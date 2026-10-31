---
title: "磁盘、内存与性能观测"
description: "total used free shared buff/cache available"
series: linux
sidebar:
  order: 8
  label: "磁盘、内存与性能观测"
difficulty: beginner
duration: 6
tableOfContents: true
---

**本章目标：**

- 分得清 free/vmstat/iostat 各看什么维度的数据，不再"凭感觉卡了"
- 会读 load average 并结合 CPU 数量判断系统真忙还是假忙
- 掌握 CPU 高、磁盘满、inode 满、TIME_WAIT 堆积四类问题的标准排查路径

## free：内存到底够不够

```bash
free -h
```

```text
              total        used        free      shared  buff/cache   available
Mem:          7.8Gi       3.2Gi       512Mi        90Mi       4.1Gi       4.2Gi
Swap:         2.0Gi       180Mi       1.8Gi
```

新手最大的误区：看到 free 只剩 512Mi 就喊内存不够。**buff/cache 是Linux 主动拿来当磁盘缓存的空闲内存**，任何进程需要时内核会立刻让出——所以要看 **available 列**（4.2Gi）："还能给新程序用多少"。判断标准：

```text
available 长期充裕，swap used 几乎不动   → 内存无忧
available 逼近 0，si/so 换页持续        → 真缺内存（vmstat 验证）
used 持续爬升、回收不动                  → 疑似泄漏，转应用层排查
```

## vmstat 与 iostat：持续观察的节奏

一次性快照（free/df/ps）回答"现在怎样"，间隔采样回答"趋势与瓶颈在哪"。vmstat 属 procps（预装），iostat 属 **sysstat 包**（`sudo apt install sysstat` / `sudo dnf install sysstat`）：

```bash
vmstat 1 5        # 每秒一行共 5 行
iostat -x 1 5     # -x 扩展列
```

vmstat 的列分组看：

```text
r    等待上 CPU 的进程数        b   等 IO 的不可中断进程数 ← 磁盘问题的哨兵
si/so 每秒换页入/出             us/sy/id/wa CPU 用户/内核/空闲/等IO 时间占比
```

一次真实采样的样子（头两行是历史均值与启动行，从第三行起才是每秒数据）：

```text
procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa
 1  0      0 528340     92  421076    0    0     6    11   44   62  2  1 96  1
 2  0      0 527988     92  421090    0    0     0   128  812 1240 18  4 76  2
 3  1      0 527640     92  421102    0    0   512  4096  934 1301 22  6 58 14
```

第 3 行的故事：r=3 超过核数就在排队；b=1 且 wa=14 说明有进程卡在 IO；bo=4096 表示这一秒写出去 4MB——读日志/写备份的典型指纹。

iostat 盯这三样：

```text
r/s w/s      每秒读写次数（IOPS）
await        IO 平均耗时（ms）——SSD 上持续两位数即异常
%util        设备繁忙占比；接近 100% 说明队列在排队
```

采样输出节选（`iostat -x 1`）：

```text
Device   r/s   w/s   rkB/s  wkB/s  rrqm/s wrqm/s  r/s%wr %util await  aqu-sz
nvme0n1  0.0 128.0    0.0  3240.0    0.0   14.0   0.0  96.0  7.31   0.94
```

nvme0n1 写满负荷（%util 96）但 await 仅 7ms——设备忙但响应健康，通常是日志洪峰；若 await 升到几十上百毫秒，才轮到"换盘/查应用 IO 模式"的讨论。

:::tip[读法先行]
各列精确定义与计数口径（尤其 iostat 的 adb_s、aqu_sz 等扩展列）以 `man vmstat`、`man iostat` 为准；本章给的是"先扫哪几眼"的优先级，不是完整说明书。
:::

## load average：三个数字的读法

```bash
uptime
```

```text
 10:32:01 up 3 days, 2 users,  load average: 4.20, 3.10, 1.85
                                            1分钟  5分钟  15分钟
```

load 的本质是"**平均活跃任务数**"（运行中 + 等 CPU + 等 IO，Linux 特有口径）。判断锚点是 CPU 核数：

```bash
nproc          # 逻辑核数，比如 4
```

```text
load ≈ 核数    系统满负荷但有序，观察
load > 核数    有任务在排队；继续看是 us 高（CPU 不够）还是 wa 高（IO 瓶颈）
load 曲线      三数对比：1 分钟 > 15 分钟 → 正在恶化；反之 → 刚缓和
```

同样是 load 4，`top` 里 us 占满 → CPU 密集型；wa 占满 → 磁盘拖的后腿（数据库/日志盘慢），处理方向完全不同。**load 是症状，不是病因**——病因要靠下面的四步法定位。

## CPU 高排查四步法

1. **定机器**：集群多台先 `uptime`/`top` 横向比，找 load 明显高的那台（第 5 章仪表盘）。
2. **定进程**：`top` 里按 `P` 排序，看 %CPU 头部进程；记下 PID 与命令。`ps -o pid,user,%cpu,etime,cmd -p PID` 确认它"跑了多久、什么身份、完整命令行"。
3. **定线程与热点**：`top -H -p PID` 看该进程内哪些线程吃 CPU，记下高 CPU 线程 TID；`printf '%x\n' TID` 转十六进制，供应用层线程转储/dump 对照（Java 用 jstack，Node/Python 用各自 profiler——工具以应用文档为准）。

```text
Threads 24 (Total: 24 threads, 2 running, 22 sleeping)
  PID USER  %CPU %MEM   TIME+  COMMAND
12345 myapp 89.0  2.1  12:03.44 node            ← 单线程吃掉近一个核
12346 myapp  0.3  2.1   0:00.11 node
12348 myapp  0.1  2.1   0:00.07 libuv-worker
```

一个进程里"一枝独秀"的热线程，几乎总对应一段具体代码路径：转储里找到 `12345 → 0x3039`，在 jstack/快照里搜这串十六进制 ID，方法栈即刻现身。
4. **回代码/配置**：拿到热点线程栈，定位到具体函数；常见真凶：死循环、正则灾难性回溯、同步阻塞 IO 轮询、GC 风暴（伴随高 sy/wa 或内存锯齿）。

:::caution[先救火再查因]
生产突发高 CPU：先评估是否降级/扩容保业务，**不要在生产机器上跑实验性重负载诊断**（如全局 perf 采样）；保留现场（top 截图、jstack 快照）比当场跑完所有工具更重要。
:::

## 磁盘满与 inode 满

写不进数据时先分诊，两类"满"都会报 No space left on device：

```bash
df -h        # 块满：空间真的用完了
df -i        # inode 满：空间还剩但 inode 耗尽（海量小文件的经典事故）
```

找大目录的递进套路：

```bash
sudo du -xh --max-depth=1 / | sort -h | tail        # 根下哪个一级目录胖
sudo du -xh --max-depth=1 /var | sort -h | tail     # 下钻，通常命中 /var/log、某应用数据目录
```

inode 满时找海量小文件元凶：`sudo find /var/spool -type f | wc -l` 分段计数，常见是**邮件/队列积压**、**缓存碎文件**、**被删除但仍被进程占用的大文件句柄**（`df -h` 与 `du` 对不上账就查它：`sudo lsof +L1`，或扫 `/proc/*/fd` 找 deleted 链接，重启对应进程即可释放）。

`df -h` 的输出里还藏着一个常见误判源：

```text
Filesystem      Size  Used Avail Use% Mounted on
/dev/vda1        40G   36G  1.9G  95% /
tmpfs            64M     0   64M   0% /dev/shm
/dev/vdb        200G   22G  168G  12% /data
overlay            0     0     0    -  /var/lib/docker/overlay2
```

看盘要对着"挂载点"看：根盘 95% 紧张时，若 `/data` 独立挂载且充裕，把日志/备份/镜像仓库迁过去往往比删文件更治本；tmpfs 占用的是内存不是磁盘，别把它算进"磁盘满了"的账里。

常见元凶与正规解法：日志膨胀 → logrotate（第 10 章）；journald 无限增长 → `sudo journalctl --vacuum-size=200M` 并在 `/etc/journald.conf` 设 SystemMaxUse（参数以 `man journald.conf` 为准）；Docker 悬空镜像与日志 → `docker system prune`（先 `docker system df` 看账，命令语义以 `docker system --help` 为准）。

## TIME_WAIT 与连接数

```bash
ss -s                       # 汇总：timewait 计数一眼可见
ss -tan state time-wait | wc -l
ss -tan state established | wc -l
```

```text
Total: 172
TCP:   1442 (estab 388, closed 1006, orphaned 4, timewait 980)
Estab  388   ← 真正在服务的活跃连接
timewait 980 ← 已关闭但处于 2MSL 等待；closed 约等于它，说明来源就是本机关闭
```

TIME_WAIT 是什么：**主动关闭连接的一方**要等 2MSL（常见约 60 秒）才彻底释放端口，确保迟到的报文不串台、FIN 握手完整。它是 TCP 的正常机制，**不是故障**。

需要管它的场景：高并发短连接的反向代理/网关，出向端口被 TIME_WAIT 吃光（新连接报 Cannot assign requested address）。正规处理优先级：

1. **应用侧用长连接/连接池**（HTTP keep-alive、数据库池化）——治本，减少关闭次数
2. **让对端先关闭**（代理侧超时短于服务端 keep-alive 超时）——转移 TIME_WAIT 的位置
3. 内核调参（如 `tcp_tw_reuse`、放大 `ip_local_port_range`）——**以 `man tcp`、内核文档为准再动手**，不同内核版本行为与默认值有差异，别照抄网上旧帖子

:::danger[慎碰 tcp_tw_recycle]
该参数在早期内核上因 NAT 环境丢包问题严重，已在较新内核中被移除。遇到建议"开 recycle"的教程要警惕其年代；改任何 sysctl 前用 `sysctl 参数名` 记录当前值并确认内核文档里它存在，改完 `ss -s` 观察效果。
:::

## 自查清单：从 top 到定位代码的一条龙

综合演练——"服务变慢"的完整动线，按序执行并记录每步输出：

1. `uptime` + `nproc`：load 是否超核数？三数走势是升是降？
2. `top` 看行首 CPU 分布：us 高走 CPU 路线，wa 高走 IO 路线，sy 高查中断/上下文切换（`vmstat 1` 的 cs 列）。
3. 按 `P`/`M` 锁定嫌疑进程；`ps -o user,etime,cmd -p PID` 补全身份与启动时间——"什么时候开始变慢的"常在这一步浮现（对应 8.3 的四步法）。
4. `iostat -x 1` 确认磁盘：await 与 %util 异常则查是哪个进程在读写（`sudo iotop -o` 可看每进程 IO，属iotop 包，装法同 sysstat 思路）。
5. `free -h` + `vmstat 1`：available 与 si/so 判断是否内存压力引发 GC/换页抖动。
6. `ss -s` + `ss -tan state time-wait | wc -l`：连接层是否堆积。
7. 拿到"进程 + 资源类型 + 时间点"三要素后，转入应用层：journalctl 对齐时间轴（[第 5 章 · 进程与服务管理](../05-process-systemd/)）、日志找异常栈、profile 找热点函数（第 4 步的 TID 在此兑现）。

## 本章小结

- 内存看 available 不看 free，buff/cache 是可随时让出的磁盘缓存；si/so 持续非零才是真缺
- load 的锚是核数，us/wa 的比例决定病因方向；磁盘满用 du --max-depth 下钻、"报没空间 yet df 有空"查 df -i
- TIME_WAIT 是主动关闭方的正常状态，治本靠长连接与连接池，调内核参数前以 man/内核文档为准
- 性能排查的产出永远是三要素——哪个进程、哪种资源、从何时起，缺一个就回到自查清单重走
