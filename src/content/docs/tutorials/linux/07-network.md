---
title: "网络与排查"
description: "老牌 ifconfig/route 已被 iproute2 套件取代（两厂现代发行版通用，命令为 ip 与 ss）："
series: linux
sidebar:
  order: 7
  label: "网络与排查"
difficulty: beginner
duration: 6
tableOfContents: true
---

**本章目标：**

- 用 ip 与 ss 查看网卡地址、路由与端口监听，掌握 ping/traceroute/dig/curl 四个探测工具
- 会配置 firewalld/ufw 防火墙，并用 SSH 密钥与 config 文件实现安全免密登录
- 理解端口转发原理，并按"由近及远"的顺序排查"连不通"问题

## ip：网卡、地址与路由

老牌 `ifconfig`/`route` 已被 iproute2 套件取代（两厂现代发行版通用，命令为 `ip` 与 `ss`）：

```bash
ip addr              # 各网卡与 IP（缩写 ip a）
ip -br addr          # 紧凑模式：网卡名 + 状态 + 地址，一行一个
ip route             # 路由表，默认网关那行最常用（缩写 ip r）
ip link set dev eth0 down    # 停网卡（远程操作慎用，断网的是你自己）
ip link set dev eth0 up      # 启网卡
```

```text
$ ip -br addr
lo        UNKNOWN  127.0.0.1/8
eth0      UP       172.19.0.7/16, 203.0.113.10/24
```

完整视图 `ip addr`（截断展示）能告诉你的更多：

```text
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default
    link/ether 00:16:3e:2a:7f:1c brd ff:ff:ff:ff:ff:ff
    inet 172.19.0.7/16 brd 172.19.255.255 scope global eth0
       valid_lft forever preferred_lft forever
    inet 203.0.113.10/24 scope global secondary eth0
    inet6 fe80::dd16:3eff:fe2a:7f1c/64 scope link
```

`state UP` 是链路状态、`inet` 行是 IPv4 地址（secondary 表示第二个绑定）、`inet6 fe80` 是本地链路地址不参与外网路由。读路由则只看一行关键的：

```bash
ip route | grep default     # default via 172.19.0.1 dev eth0 —— 出口网关
```

读网卡先认三样：网卡名（现代系统多为 eth0/enp0s3  predictable 命名）、内网地址（10/172.16-31/192.168 段）、以及是否有公网地址。云主机通常"公网 IP 不在网卡上"——NAT 在云上完成，`ip a` 只能看到内网地址，这是正常现象（第 10 章再提）。

## ss：谁在监听哪个端口

```bash
ss -tlnp                    # tcp listening，带进程名（需 sudo 看全）
ss -tlnp | grep :80         # 80 端口被谁占着
ss -unp                     # udp 视角（DNS、QUIC 等）
ss -s                       # 汇总：各状态连接数
ss -tan state established   # 按 TCP 状态筛选（第 8 章连接数统计的基础）
```

输出读法：

```text
State   Recv-Q  Send-Q  Local Address:Port  Peer Address:Port  Process
LISTEN  0       511     0.0.0.0:80          0.0.0.0:*          users:(("nginx",...))
LISTEN  0       128     127.0.0.1:5432      0.0.0.0:*          users:(("postgres",...))
```

关键信息是 Local Address 那列：`0.0.0.0:80` 表示所有网卡都接受连接，`127.0.0.1:5432` 表示只允许本机访问——"服务起了但外面连不上"的第一嫌疑人就是这个绑定地址。

## ping、traceroute、dig：连通三连

```bash
ping -c 4 example.com       # -c 4 发四个包就停（不加会一直刷）
traceroute -T -p 443 example.com   # TCP 模式路径（部分网络禁 ICMP 时更准）
dig +short example.com      # DNS 解析：返回 IP 列表
dig example.com A +noall +answer   # 看完整应答段
dig +short -x 93.184.216.34         # 反向解析 IP→域名
```

三件套各管一段：`ping` 验"网络层通不通"（但许多防火墙默认禁 ICMP，不通 ≠ 网络坏）；`traceroute` 看"路由走到第几跳断了"；`dig` 判"域名解析对不对"——拨号上网时代的"DNS 是第一个嫌疑人"今天依然成立。CentOS 上 traceroute/dig 可能需要补装：`sudo dnf install traceroute bind-utils`；Ubuntu 对应 `sudo apt install traceroute dnsutils`。

```bash
dig +short example.com
```

```text
93.184.216.34
2606:28f0:0:2965:7c50:788:72:43bc
```

解析结果同时有 IPv4 与 IPv6 很正常；若返回空或 NXDOMAIN，先换公共 DNS 复核（`dig @8.8.8.8 example.com`）：能解析说明你机器的 DNS 配置有问题（`resolv.conf` 归 systemd-resolved 管，改法以发行版文档为准），还不行就是域名本身的事。临时验证可改 `/etc/hosts` 强行指到某个 IP——排查完记得删掉，忘掉的 hosts 条目是三个月后灵异故障的经典种子。

## curl：从命令行验一次 HTTP

```bash
curl -I https://example.com            # 只看响应头（HEAD）
curl -s -o /dev/null -w '%{http_code}\n' https://example.com   # 只要状态码
curl -v http://127.0.0.1:8080/health   #  verbose 看握手与头，排障首选
curl -L https://tiny.cc/xxx            # 跟随重定向
curl -d 'a=1' -H 'Content-Type: application/x-www-form-urlencoded' http://api.local/v1
```

`curl` 返回码与含义对照常用几个：`6` 解析不了域名、`7` 连不上（端口没开/被防火墙拦）、`28` 超时、`60` 证书问题、HTTP 层的 `200/404/502` 则是服务自己的事。`curl -v` 的输出停在哪个阶段（DNS→TCP→TLS→HTTP），问题就在哪个阶段。

```bash
curl -sI http://127.0.0.1:8080/health
```

```text
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 15
Date: Tue, 02 Jun 2026 10:12:44 GMT
Connection: keep-alive
```

健康检查、接口冒烟、验证反代头是否传到（对比经 Nginx 与直连后端的响应差异），全靠 curl 这一层"手工客户端"。测 API 时加 `-w '\n'` 补回车、`-o /dev/null` 丢正文只看头/状态码，脚本化验证第 10 章会再用一次。

## 防火墙：firewalld 与 ufw

两厂默认防火墙体系不同：CentOS/RHEL 用 **firewalld**，Ubuntu 主推 **ufw**（底层是 nftables/iptables，无需直接碰）。

```bash
# firewalld（CentOS 主战场；Ubuntu 也可用）
sudo firewall-cmd --state                       # running/not running
sudo firewall-cmd --list-all                    # 当前 zone 的开放清单
sudo firewall-cmd --permanent --add-service=http    # 放行 http 服务（预定义端口组）
sudo firewall-cmd --permanent --add-port=8080/tcp   # 放行自定义端口
sudo firewall-cmd --reload                      # 让 permanent 改动生效

# ufw（Ubuntu 主战场）
sudo ufw status verbose
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw deny 3306/tcp                           # 显式拒绝数据库对外
sudo ufw enable                                  # 启用（默认策略 incoming deny）
```

:::danger[先给自己留后路]
远程 SSH 操作防火墙，**务必先把 22 端口放行再 enable/reload**，并另开一个已连接的会话作为逃生通道（改完测试新连接能否建立，再关旧会话）。另外云主机还有厂商"安全组"这一层外部防火墙，主机放行而安全组没放行照样连不上——两层都要查（第 10 章上线清单条目）。
:::

service 名（http/https/ssh）与端口的对应关系由各 firewall 预定义，自定义端口是通用逃生招；zone 概念与更多选项以 `man firewalld`、`ufw help` 为准。

## SSH 密钥登录与 config

密码登录的三大罪：可爆破、可钓鱼、难管理。服务器日常应改用**密钥对**（概念与第 1 章 danger 框呼应，这里是实操）：

```bash
# 在你的电脑上（不是服务器）：
ssh-keygen -t ed25519 -C "me@laptop"    # 一路回车；passphrase 建议设
ssh-copy-id devops@203.0.113.10         # 把公钥推上服务器（Ubuntu 桌面端如无此命令，手动追加公钥亦可）
# 手动方式：把 ~/.ssh/id_ed25519.pub 内容追加到服务器 ~/.ssh/authorized_keys
```

公钥/私钥的分工：私钥永不出本机；公钥可以公开，放服务器用于验证"持对应私钥者"。改完后在服务器端 `chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys`——权限过宽 sshd 会直接拒用该文件（第 4 章的 x/600 规则在这里兑现）。

`~/.ssh/config` 让你给每台机器起别名、定身份：

```text
Host prod
    HostName 203.0.113.10
    User devops
    Port 22
    IdentityFile ~/.ssh/id_ed25519

Host lab
    HostName 192.168.1.20
    User student
```

此后 `ssh prod` 即等价于那一长串参数；VS Code 远程开发、scp/rsync 同样复用这套 Host 别名：

```bash
scp report.pdf prod:/home/devops/incoming/         # 别名直接当主机用
rsync -avz --progress ./dist/ prod:/opt/myapp/dist/   # 增量同步部署产物（第 10 章主力）
```

:::caution[指纹变了先停手]
连接时若弹出 "REMOTE HOST IDENTIFICATION HAS CHANGED" 并要求确认，**不要条件反射删 known_hosts 条目**：要么是服务器真的重装/换密钥（自己知道的操作），要么是中间人攻击。先在厂商控制台核实主机公钥，确认无误后再 `ssh-keygen -R 主机名` 移除旧记录重连。
:::

免密之后还有一层体验优化：把常用连接参数写进 config 的 `Host *` 段（如 `ServerAliveInterval 60` 防闲置断连）；选项列表以 `man ssh_config` 为准，别直接照搬网络帖子里的老参数。

## 端口转发与「连不通」排查自查清单

**本地转发**：把远端才能访问的服务，借一条 SSH 隧道映射到本机——调试内网数据库的标准姿势：

```bash
ssh -L 5433:127.0.0.1:5432 prod     # 本机 5433 → 经 prod 转发到 prod 的 5432
# 另开终端验证：psql 连接 localhost:5433 即等于连到了 prod 内网的 Postgres
```

**远程转发**（`ssh -R`）反向：把本机服务映射到远端端口，演示"内网穿透"的概念——无公网 IP 的机器主动出来，占住公网服务器的一个端口让外人访问它。生产环境的内网穿透有专门工具链（如 frp，配置以其官方文档为准），此处只需理解原理：**穿透 = 让"只能出"的内网机器建立一条反向可用通道**；同时牢记把内网服务暴露公网的安全风险（第 10 章防火墙原则的镜像面）。

**连不通的排查顺序（由近及远，每步一条命令）：**

1. 本机应用起来了吗：`ss -tlnp | grep 端口` —— 没监听，看服务日志（journalctl -u，[第 5 章 · 进程与服务管理](../05-process-systemd/)）
2. 监听地址对吗：`0.0.0.0` 还是 `127.0.0.1` —— 后者外部永远进不来，改服务配置
3. 本机防火墙放行了吗：`firewall-cmd --list-all` / `ufw status`
4. 路由通吗：从另一台机器 `ping 服务器IP`、`traceroute`（注意 ICMP 可能被禁）
5. 端口通吗：`curl -v telnet://IP:端口` 或 `nc -vz IP 端口`（Ubuntu 装 netcat-openbsd / CentOS 装 ncat，命令用法以 --help 为准）
6. 云上查安全组、IDC 查上游防火墙 —— 主机之外还有一层
7. DNS：`dig +short 域名` —— 能连 IP 不能连域名 = 解析或 hosts 问题

第 5 步的 `nc` 试探结果读法：

```text
$ nc -vz 203.0.113.10 80
Connection to 203.0.113.10 80 port [tcp/http] succeeded!   # TCP 握手成功=端口通
$ nc -vz 203.0.113.10 8080
nc: connect to 203.0.113.10 port 8080 (tcp) failed: Connection refused  # 立刻拒绝=没监听或被本机防火墙 REJECT
nc: connect to 203.0.113.10 port 8080 (tcp) failed: Connection timed out # 超时=路径或防火墙 DROP（静默丢弃）
```

refused 与 timed out 的区分很值钱：前者指向"服务/绑定/REJECT 规则"，后者指向"路由/安全组/DROP 规则"。排查到这一步仍未解决，把每步的命令与输出记下来按层贴给别人求助——"由近及远"的每一问都比"就是连不上"三个字有效得多。

## 本章小结

- ip/ss 看现状：ss -tlnp 看"谁在哪个地址监听"，绑定 127.0.0.1 是远程连不上头号嫌疑；ping/traceroute/dig/curl 分段定位——ICMP、路径、DNS、HTTP 各管一段，curl -v 卡在哪问题就在哪
- firewalld 用 zone/service/permanent+reload，ufw 用 allow/enable；改远程防火墙先留逃生通道，云安全组是第二道闸
- SSH 用密钥免密 + config 别名（authorized_keys 600、目录 700）；端口转发 -L 借道进来、-R 借道出去
- 排查连不通永远"由近及远"逐层验证：监听→绑定→主机防火墙→路由→端口→安全组→DNS，而非从最远端猜起
