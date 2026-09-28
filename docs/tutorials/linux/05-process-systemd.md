---
title: 进程与服务管理
---

# 第 5 章 · 进程与服务管理

**本章目标：**

- 能用 ps/top/htop 看清系统上跑着什么、谁在消耗资源
- 掌握前后台作业控制与 kill 信号，能优雅地停掉一个进程
- 会用 systemctl/journalctl 管理现成服务，并能亲手写一个 unit 文件让程序开机自启

## 5.1 ps：给进程拍快照

每个运行的程序都是一个**进程**：程序代码 + 独立的内存空间 + 至少一个线程。PID 是它的身份证号。

```bash
ps -ef                 # 全系统进程：UID PPID C STIME TTY TIME CMD
ps aux                 # BSD 风格：多 CPU/内存占用列，最常用
ps -u devops           # 只看某用户的进程
ps -p 2345 -o pid,ppid,user,%cpu,%mem,etime,cmd   # 定制列输出
ps --ppid 1            # 找出所有父进程是 systemd 的服务
```

`ps aux` 关键列：

```text
USER  PID %CPU %MEM   VSZ   RSS  TTY STAT START  TIME  COMMAND
devops 2345 0.3  1.2 120340 24800 ?  Sl   10:12  0:15  node app.js
```

STAT 状态码里最常见的：`R` 运行中、`S` 睡眠（等事件，正常）、`D` 不可中断睡眠（**在等 IO，堆积时要警觉**）、`Z` 僵尸、`T` 被停止、`<`/`N` 优先级高低。

## 5.2 top 与 htop：给系统开实时仪表盘

```bash
top              # 经典实时视图
htop             # 彩色交互版（Ubuntu 直接装；CentOS 可能需 EPEL 源，第 6 章）
```

top 界面与高频按键：

```text
负载行:  top - 10:32:01 up 3 days,  2 users,  load average: 0.52, 0.48, 0.44
任务行:  Tasks: 187 total, 2 running, 185 sleeping, ...
CPU行:   %Cpu(s): 12.3 us, 3.1 sy, 0.0 ni, 84.0 id, 0.6 wa
按键:    P 按 CPU 排序   M 按内存排序   1 展开每个核心   c 显示完整命令行
         k 输入 PID 杀进程   r 调优先级   q 退出
```

`us` 用户态、`sy` 内核态、`wa` 等 IO 的时间——`wa` 高说明瓶颈在磁盘/网络而不在 CPU。load average 三个数的读法与"多少算高"在第 8 章专门讲。

::: tip htop 值得装
鼠标可点、树状视图、F9 直接杀进程。安装：`sudo apt install htop` 或 `sudo dnf install htop`（CentOS 不在基础源时先装 EPEL，见 [第 6 章 · 软件安装与包管理](./06-packages)）。资源消耗的解读方法两厂一致。
:::

## 5.3 进程树、父子与僵尸

```bash
pstree -p            # 树状视图带 PID（没装则 apt/dnf install pstree）
ps -eo pid,ppid,user,cmd --forest   # 另一种"缩进树"
```

Linux 进程是父子制：几乎所有进程最终溯到 PID 1（systemd）。父进程通过 fork 创造子进程，子进程退出后父进程要**收割**（wait）其退出状态；不收割就留下僵尸（Z 状态）——不占内存但占一个 PID 与表项。

```bash
ps aux | awk '$8 ~ /Z/ {print}'      # 列出当前僵尸进程
```

少量僵尸无害；大量增长说明父进程有 bug，处理思路：先解决父进程（重启它，僵尸随之由 systemd 接管收割），而不是试图杀僵尸本身（杀不掉，它已经死了）。孤儿进程会被 PID 1 收养并由它正常收割，这是设计行为不是故障。

## 5.4 前台、后台与作业控制

```bash
sleep 300 &              # 放到后台启动，输出 [1] 进程号
jobs                     # 本终端的后台作业列表
jobs -l                  # 连同 PID
fg %1                    # 作业 1 拉回前台
bg %1                    # 作业 1 在后台继续（Ctrl+Z 挂起后恢复用）
```

`Ctrl+Z` 是**挂起**（SIGTSTP，进程停住不退出），`Ctrl+C` 是**中断**（SIGINT）。终端一关后台作业就收到 SIGHUP 而死；想让它在退出登录后继续活：

```bash
nohup long-task.sh > task.out 2>&1 &   # 忽略挂断信号，输出重定向到文件
disown                                  # 或：已启动的作业从作业表摘除（bash 内建）
```

::: warning nohup 的临时性
nohup 进程脱离了终端也脱离了管理：没人给它重启、没人收日志轮转。它是调试期的权宜之计；**正式长跑的服务请写成 systemd unit**（5.6 节），第 10 章生产部署全程使用 systemd。
:::

## 5.5 kill 与信号

kill 发送的是**信号**，不是"立即处决"：

```bash
kill 2345              # 默认 SIGTERM(15)：请求退出，程序可清理后走
kill -9 2345           # SIGKILL(9)：内核强杀，不可捕获，最后手段
kill -2 2345           # SIGINT(2)：等同 Ctrl+C
kill -HUP 2345         # SIGHUP(1)：传统"重读配置"信号，nginx 常用它
kill -STOP 2345        # 冻结进程（调试用）；kill -CONT 解冻
pkill -f "node app"    # 按命令行模式杀（先 pgrep -f 同名式确认目标！）
killall nginx          # 按命令名杀
```

**标准姿势：先 TERM，等待数秒，无效才 -9。** 直接 -9 会跳过清理，可能留下半写文件、锁死的数据库。判断"该不该 -9"：`ps -o stat= -p PID` 看它是否还在（TERM 后短暂存在是正常的收尾中）。

信号清单用 `kill -l` 现场查看；各程序自定义了哪些信号行为，以 `man 程序名` 为准（如 nginx 的 `-s reload` 本质就是给主进程发 HUP）。

## 5.6 systemctl 与 journalctl：现代服务管理

systemd 身兼二职：它是 PID 1（init），也是服务与日志的统一管理器。核心命令：

```bash
systemctl status nginx          # 状态 + 最近几行日志
systemctl start nginx           # 启动
systemctl stop nginx            # 停止
systemctl restart nginx         # 停了再开（瞬间断开）
systemctl reload nginx          # 平滑重载配置（依赖服务支持）
systemctl reload-or-restart nginx
systemctl enable nginx          # 开机自启
systemctl enable --now nginx    # 自启 + 立即启动，一步到位
systemctl disable --now nginx   # 反向操作
systemctl list-units --type=service --state=running
systemctl is-enabled nginx; systemctl is-active nginx
```

journalctl 读 systemd 收集的集中日志：

```bash
journalctl -u nginx -f              # 跟随某服务
journalctl -u nginx --since "10 min ago"
journalctl -u nginx --since today --until "12:00"
journalctl -p err -b                # 本次开机以来的 error 级及以上
journalctl --disk-usage             # 日志占多少盘
sudo journalctl --vacuum-size=200M  # 瘦身（另见第 8 章磁盘满）
```

一次典型的 status 输出，值得逐行读：

```text
● nginx.service - A high performance web server and a reverse proxy server
     Loaded: loaded (/lib/systemd/system/nginx.service; enabled; preset: enabled)
     Active: active (running) since Tue 2026-06-02 08:00:12 CST; 3 days ago
       Docs: man:nginx(8)
   Main PID: 1042 (nginx)
      Tasks: 3 (limit: 4559)
     Memory: 12.4M (peak: 13.1M)
        CPU: 1.2s
     CGroup: /system.slice/nginx.service
             ├─1042 "nginx: master process /usr/sbin/nginx -g daemon off;"
             └─1043 "nginx: worker process"
```

Loaded 行告诉你 unit 文件位置与是否 enable；Active 行有启动时间与"多久没重启过"；CGroup 列出它名下的全部进程——服务重启后 PID 会变，但 `systemctl status` 永远找得到它，这是比 `ps | grep` 可靠得多的定位方式。

::: tip 两厂服务名差异：以 ssh 为例
同样的服务，unit 名可能不同：Ubuntu 是 `ssh.service`，CentOS 是 `sshd.service`。查名字是通用招：`systemctl list-units --type=service | grep -i ssh`。第 10 章改 SSH 配置后重启服务会再次遇到这个差异。
:::

## 5.7 综合练习：把一个命令变成开机自启的服务

把一个"裸命令"变成受 systemd 托管的服务，就是在 `/etc/systemd/system/` 下写一份 unit 文件。假设应用放在 `/opt/myapp`、以 `myapp` 用户运行：

```text
# /etc/systemd/system/myapp.service
[Unit]
Description=MyApp example web service
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=myapp
Group=myapp
WorkingDirectory=/opt/myapp
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=3
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

部署三连：

```bash
sudo systemctl daemon-reload          # 让 systemd 重读 unit 文件（每次改完都要）
sudo systemctl enable --now myapp     # 开机自启 + 立即拉起
systemctl status myapp                # 确认 active (running)
```

要点解读：`Type=simple` 表示 ExecStart 的进程即主进程；`Restart=on-failure` 崩溃自动再拉起；前台进程交给 systemd 看护后，**不需要** nohup/`&`；日志进 journald，用 `journalctl -u myapp -f` 看。`EnvironmentFile=` 可外挂环境变量文件，密钥不落 unit——第 10 章实战采用。各指令语义以 `man systemd.service`、`man systemd.unit` 为准。

## 本章小结

- ps 是快照（-ef 看全局、-o 定制列），top/htop 是仪表盘（P/M 排序、us/sy/wa 三分天下）
- 进程父子制：僵尸由父进程收割、孤儿由 PID 1 接管；D 状态堆积指向 IO 问题
- 作业控制管本终端、nohup 是权宜之计；kill 先 TERM 后 -9，长跑服务一律交给 systemd
- unit 放 /etc/systemd/system，enable --now 开机自启，改完必 daemon-reload，日志用 journalctl -u -f 跟
