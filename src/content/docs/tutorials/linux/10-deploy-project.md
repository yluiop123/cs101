---
title: "第 10 章 · 综合实战：把一台裸机变成可上线的服务器"
description: "场景设定：一台刚装好 Ubuntu 24.04（或 CentOS Stream）的云主机，只有 root 密码可登录。目标应用是一个跑在 8080 端口的 Web 服务（语言不限，本章以 Node 演示）。密钥登录按 第 7 章 · 网…"
series: linux
sidebar:
  order: 10
  label: "综合实战：把一台裸机变成可上线的服务器"
difficulty: beginner
duration: 5
tableOfContents: true
---

**本章目标：**

- 走完新服务器初始化全流程：建用户、配密钥、禁用危险登录方式
- 用 systemd 托管应用、Nginx 做反向代理，并用防火墙只开放必要端口
- 交付一套日志轮转 + 定时备份 + 上线自查清单的运维闭环

## 10.1 新机器第一步：用户与 SSH 加固

场景设定：一台刚装好 Ubuntu 24.04（或 CentOS Stream）的云主机，只有 root 密码可登录。目标应用是一个跑在 `8080` 端口的 Web 服务（语言不限，本章以 Node 演示）。密钥登录按 [第 7 章 · 网络与排查](../07-network/) 的方式先推好公钥，再开始初始化：

```bash
# 本地机器上先推密钥（做法见上文），再登录 root：
ssh-copy-id root@203.0.113.10
ssh root@203.0.113.10

# —— 以下在服务器执行 ——
adduser devops                      # 交互式建用户（CentOS 用 useradd -m devops && passwd devops）
usermod -aG sudo devops             # Ubuntu 进 sudo 组；CentOS 是： usermod -aG wheel devops
su - devops                         # 切过去测试
sudo hostnamectl status             # sudo 工作正常才继续下一步

# 把 root 的公钥复制给 devops（root 提示词执行）：
install -d -m 700 -o devops -g devops /home/devops/.ssh
cp /root/.ssh/authorized_keys /home/devops/.ssh/
chmod 600 /home/devops/.ssh/authorized_keys
chown -R devops:devops /home/devops/.ssh
```

编辑 `/etc/ssh/sshd_config`（或按发行版惯例放进 `sshd_config.d/` 的独立文件，改动方式以 `man sshd_config` 为准）：

```text
PermitRootLogin no
PasswordAuthentication no
```

```bash
sudo systemctl restart ssh          # Ubuntu 服务名是 ssh
sudo systemctl restart sshd         # CentOS 服务名是 sshd
```

:::danger[改 sshd 配置的铁律]
① 保持当前 root 会话不要关——它是逃生通道；② 新开终端用 `ssh devops@...` 验证密钥登录成功、确认密码登录已被拒绝，再动防火墙；③ 云主机若连逃生通道都没了，用厂商控制台 VNC 复位。顺序错了，把自己锁在门外的是大多数。
:::

## 10.2 安装运行时与依赖

```bash
# 通用工具打底（两厂命令并列）：
sudo apt update && sudo apt -y install curl git rsync logrotate
sudo dnf makecache && sudo dnf -y install curl git rsync logrotate

# Node 运行时：发行版自带的版本通常偏老，生产按应用官方要求装。
# 例：Node 官方仓库方式（Ubuntu，具体 URL 与版本以 nodejs.org 官方文档为准）：
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt -y install nodejs
node --version && npm --version

# CentOS 侧可用 dnf 模块流选择版本（语法以 dnf 文档为准）：
# sudo dnf -y install nodejs
```

应用部署约定：代码放 `/opt/myapp`，运行账号用专用的低权用户 `myapp`（不是 devops，也不是 root——**登录的人与跑服务的账号分离**）：

```bash
sudo useradd --system --home /opt/myapp --shell /usr/sbin/nologin myapp
sudo mkdir -p /opt/myapp
# 本地通过 git 拉取或 rsync 上传产物后：
sudo chown -R myapp:myapp /opt/myapp
sudo -u myapp bash -c 'cd /opt/myapp && npm ci --omit=dev'
```

`EnvironmentFile` 所需的密钥放 `/etc/myapp.env`，属主 myapp、权限 600（第 4 章的规则），**绝不写进 git 仓库**。

## 10.3 systemd 托管应用

把第 5 章的 unit 模板落成生产形态，`/etc/systemd/system/myapp.service`：

```text
[Unit]
Description=MyApp production service
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=myapp
Group=myapp
WorkingDirectory=/opt/myapp
EnvironmentFile=/etc/myapp.env
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=3
NoNewPrivileges=true
ProtectSystem=full

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now myapp
systemctl status myapp
journalctl -u myapp -f            # 上线初期挂在这儿看日志
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8080/health
```

`ProtectSystem=full`、`NoNewPrivileges` 是低成本的加固项，含义与更多沙箱指令以 `man systemd.exec` 为准。更新发布的标准循环：`rsync 新版本 -> sudo systemctl restart myapp -> journalctl 观察启动 -> 健康检查`，回滚即反向重放上一版本。

## 10.4 Nginx 反向代理

应用监听 `127.0.0.1:8080`（unit/应用配置里绑 localhost，外部只能经 Nginx 进来）：

```bash
sudo apt -y install nginx         # CentOS: sudo dnf -y install nginx
```

站点配置放 `/etc/nginx/conf.d/app.conf`（Debian 系也接受 conf.d 片段，两厂此处写法一致）：

```text
server {
    listen 80;
    server_name app.example.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
    }
}
```

```bash
sudo nginx -t                     # 语法检查，改完必跑
sudo systemctl reload nginx       # 平滑生效（主进程收 HUP，第 5 章的信号知识）
sudo tail -f /var/log/nginx/access.log
```

:::caution[CentOS 的 SELinux 拦 Nginx 反代]
CentOS Stream/RHEL 默认 SELinux Enforcing，Nginx 向外发起上游连接会被静默拒绝（502 且日志含糊）。正确解法是放行布尔值而非关闭 SELinux：`sudo setsebool -P httpd_can_network_connect 1`（`getsebool -a | grep httpd` 可查现状；Ubuntu 的 AppArmor 一般无此拦截）。
:::

HTTPS 用 Let's Encrypt 的 certbot：按官网给出的发行版对应命令安装（certbot 的包名与 nginx 插件名两厂不同，以官网指南为准），证书续订由 certbot 自带的 timer 自动完成（`systemctl list-timers | grep certbot` 验证）。

## 10.5 日志、logrotate 与备份定时化

journald 的自管理先立规矩：`/etc/journald.conf` 设 `SystemMaxUse=500M`（参数以 `man journald.conf` 为准）后 `sudo systemctl restart systemd-journald`。

Nginx 由发行版包自带 logrotate 配置；自产文本日志交给 logrotate，文件 `/etc/logrotate.d/myapp`：

```text
/var/log/myapp/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    copytruncate
}
```

`copytruncate` 让应用无需重启即可继续写（先拷贝再截断）；对 systemd 管理的日志建议直接写 journald（StandardOutput=journal）免去轮转。干跑验证：`sudo logrotate -d /etc/logrotate.d/myapp`（-d 为调试模式，只打印计划不动手）。

把第 9 章的 `db-backup.sh` 定时化——cron 是最短路径：

```bash
sudo cp db-backup.sh /usr/local/bin/ && sudo chmod 755 /usr/local/bin/db-backup.sh
sudo crontab -e
# 追加一行：每天 03:17 执行（分钟避开整点，减小集中任务的拥堵）
17 3 * * * /usr/local/bin/db-backup.sh >> /var/log/app-backup-cron.log 2>&1
```

验证：`sudo crontab -l`；次日 `less /var/log/app-backup-cron.log` 看首轮执行；备份异地化（rsync 到对象存储/第二台机器）自行排期。用 systemd timer 替代 cron 亦可（`man systemd.timer`），团队若已重度使用 systemd 更推荐后者。

:::tip[cron 的环境差异]
cron 里 PATH 极简、无用户 shell 环境：脚本在 cron 失败而在手工执行正常，九成是环境变量问题。对策：脚本内自带绝对路径与显式 PATH（第 9 章脚本正是这么写的），把输出重定向落盘（`>> 日志 2>&1`），否则 cron 只会把输出尝试发邮件。
:::

## 10.6 防火墙：只开 80/443（和 SSH）

```bash
# Ubuntu（ufw）：
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw default deny incoming
sudo ufw enable
sudo ufw status verbose

# CentOS（firewalld）：
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --remove-service=cockpit   # 清掉不用的预开服务（按需）
sudo firewall-cmd --reload
sudo firewall-cmd --list-all
```

主机之外，云控制台**安全组**同样只放行 22/80/443（出方向按需）——两层取交集，任何一层漏配都是事故。8080 永远不对公网开放：它绑在 127.0.0.1 上本就连不到（第 7 章的绑定地址），防火墙再兜一道底，双层防御。

## 10.7 上线自查清单

逐项打勾，全绿才算"可上线"：

```text
[ ] SSH：root 密码登录已禁（PermitRootLogin no）、PasswordAuthentication no、仅密钥可入
[ ] 账号：应用以专用低权用户运行（myapp），nologin shell；sudo 组名单复核过
[ ] 服务：systemctl enable 生效，重启机器后 journalctl -u myapp 有正常启动记录
[ ] 服务：应用端口仅绑 127.0.0.1；curl 健康检查 200
[ ] Nginx：nginx -t 通过；X-Forwarded-For 等头已传递；HTTPS 证书有效期 > 30 天且续订 timer 存在
[ ] SELinux/AppArmor：未全局关闭；502/拒绝类日志已按 10.4 排查
[ ] 防火墙：主机 + 云安全组双层均只开 22/80/443；ufw status / firewall-cmd --list-all 截图存档
[ ] 日志：journald 上限已设；logrotate -d 干跑通过；nginx 访问日志可 tail -f
[ ] 备份：db-backup.sh 手工跑过一轮；cron 已挂；次日人工确认首轮产物与日志
[ ] 时间：timedatectl status 时区与 NTP synchronized: yes（日志对齐的前提）
[ ] 更新：unattended-upgrades（Ubuntu）/ dnf-automatic（CentOS）已启用或排好维护窗口
[ ] 告警：磁盘用量与证书到期至少有 cron + 邮件脚本一层的土办法
```

补一个"灾难演练"收尾：在测试机上 `sudo systemctl stop myapp`，走一遍从"用户报障"到 `journalctl -u myapp` 定位、重启、验证的 5 分钟闭环——**上线前流过汗，上线时才能不流血**。

## 本章小结

- 初始化三步走：建 sudo 用户并推密钥 → 禁 root 密码登录（留逃生会话）→ 服务用专用 nologin 低权账号
- 应用交给 systemd（enable --now + EnvironmentFile），外部流量交给 Nginx（proxy_pass + XFF 头 + nginx -t），两厂差异在 ssh/sshd 服务名与 SELinux 拦反代
- 日志三道防线：journald 限额、logrotate copytruncate、备份脚本 + cron（显式路径、输出落盘）
- 防火墙原则"默认拒绝、白名单放行"：主机与云安全组双层各开 22/80/443，应用端口只绑 127.0.0.1；清单逐项过 + 一次故障演练，才算真正"可上线"
