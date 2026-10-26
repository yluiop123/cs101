---
title: "第 3 章 · TCP 连接管理"
description: "TCP 是面向字节流的，建连的本质是双方各交一次「我的初始序列号（ISN）」并得到对方确认。三次是完成这件事的最少次数。"
series: network
sidebar:
  order: 3
  label: "TCP 连接管理"
difficulty: intermediate
duration: 7
---

**本章目标：**

- 说清三次握手与四次挥手各自在确认什么，为什么次数不一样
- 解释 TIME_WAIT 的两个必要性，并能独立排查堆积与队列溢出两类故障
- 建立「连接是资源」的意识：会看队列、会配长连接与连接池

## 3.1 三次握手到底在确认什么

TCP 是面向字节流的，建连的本质是**双方各交一次「我的初始序列号（ISN）」并得到对方确认**。三次是完成这件事的最少次数。

```text
客户端                                                    服务端
  │  SYN   seq=x（我随机选了一个起始号 x）                   │
  │ ────────────────────────────────────────────────────▶  │
  │  SYN+ACK  seq=y, ack=x+1（我的起始号是 y，你的 x 收到）   │
  │ ◀────────────────────────────────────────────────────  │
  │  ACK  ack=y+1（你的 y 我收到了）                         │
  │ ────────────────────────────────────────────────────▶  │
                        ESTABLISHED                        ESTABLISHED
```

```bash
$ sudo tcpdump -i any -nn 'tcp port 8080 and (tcp[tcpflags] & (tcp-syn|tcp-fin) != 0)'
10:01:00.000001 IP 10.0.0.5.44120 > 10.0.0.9.8080: Flags [S], seq 3932174412
10:01:00.000312 IP 10.0.0.9.8080 > 10.0.0.5.44120: Flags [S.], seq 118820, ack 3932174413
10:01:00.000401 IP 10.0.0.5.44120 > 10.0.0.9.8080: Flags [.], ack 118821
```

三次各解决了什么：

```text
第 1 次  客户端告诉服务端「我要连，我的 ISN 是 x」 → 服务端能确认客户端→服务端方向可通
第 2 次  服务端告诉客户端「我的 ISN 是 y，x 我收到了」 → 客户端确认双向可通 + 服务端收/发都正常
第 3 次  客户端回 ACK → 服务端确认服务端→客户端方向也可通，连接可用
```

为什么随机 ISN：序列号决定对方如何重组字节流。固定起始值会让**上一次连接里延迟到达的旧包**被这次连接当成有效数据（同四元组复用），这是经典的历史报文问题。

:::caution[两次握手行不行]
不够。只发 SYN 和 SYN+ACK 时，服务端无从知道**自己发出的包客户端是否收得到** —— 客户端能回来说明「客户端收 + 服务端发」这条路径 OK，但少了这次回复，服务端就会单方向认为连接成立，然后向一个并未准备好的对端持续发数据。
:::

## 3.2 四次挥手：关闭是双向各关一次

TCP 全双工，两个方向各自独立关闭，所以「关门」要分四次。

```text
主动关闭方                                              被动关闭方
  │  FIN, seq=u                                        │
  │ ──────────────────────────────────────────────────▶ │   ← 我说完了
  │  ACK, ack=u+1                                      │
  │ ◀─────────────────────────────────────────────────  │   ← 知道你说完了（我可能还没说完）
  │                    （被动方继续发剩余数据）            │
  │  FIN, seq=w                                        │
  │ ◀─────────────────────────────────────────────────  │   ← 我也说完了
  │  ACK, ack=w+1                                       │
  │ ──────────────────────────────────────────────────▶ │   主动方进入 TIME_WAIT
```

握手是三次、挥手是四次的真正原因：**挥手中间那个 ACK 和 FIN 不能合并**，因为被动方收到 FIN 时可能还有数据要发（半关闭，`shutdown(fd, SHUT_WR)`）；握手时 SYN 和 ACK 可以合并发送。

```bash
$ ss -tan 'sport = :8080' | head -5      # 观察服务端侧状态
State      Recv-Q Send-Q  Local:Port   Peer:Port
FIN-WAIT-2 0      0       10.0.0.9:8080 10.0.0.5:44120
TIME-WAIT  0      0       10.0.0.9:8080 10.0.0.5:44131
ESTAB      0      0       10.0.0.9:8080 10.0.0.5:44140
```

:::danger[别把 RST 当正常关闭]
`tcpdump` 里看到 `[R]` 说明连接被强制重置：可能是进程直接 `close()` 时接收缓冲区还有未读数据、对端端口没人监听、或中间设备（LB/防火墙）超时清理。业务报 `connection reset by peer` 而日志一切正常时，先抓包确认是谁发的 RST。
:::

## 3.3 半连接队列与全连接队列

服务端接受连接要过两道队列，这是压测时最容易先崩的地方。

```text
        SYN ──▶ 【半连接队列 / SYN queue】 状态 SYN_RECV，等第三次 ACK
                          │ 收到 ACK
                          ▼
                   【全连接队列 / accept queue】 状态 ESTAB，等应用 accept()
                          │
                          ▼
                       应用进程

半连接队列上限：net.ipv4.tcp_max_syn_backlog
全连接队列长度：min(net.core.somaxconn, listen(fd, backlog))
```

```bash
$ ss -ltnp 'sport = :8080'
LISTEN  0   128   0.0.0.0:8080   0.0.0.0:*   users:(("app",pid=2211,fd=9))
#             ↑  ↑
#        Recv-Q 当前积压   Send-Q 队列上限（backlog）
$ nstat -az TcpExtListenOverflows TcpExtListenDrops   # 溢出计数，只增不减
TcpExtListenOverflows   412    0.0
```

`Recv-Q` 逼近 `Send-Q` 且计数增长 = 应用 accept 不过来，**加机器或加快处理才有用，改内核参数只能治标**。

```bash
$ sysctl net.core.somaxconn net.ipv4.tcp_max_syn_backlog net.ipv4.tcp_syncookies
net.core.somaxconn = 4096
net.ipv4.tcp_max_syn_backlog = 1024
net.ipv4.tcp_syncookies = 1        # 1 = 半连接队列满时用 SYN cookie 兜底
```

:::tip[应用层的 backlog 也要改]
`listen(fd, 128)` 这类硬编码会把上限锁死：内核参数调到 4096 也没用，最终长度取两者最小值。Nginx 的 `listen ... backlog=`、Java 的 `ServerSocket(port, backlog)` 都要配套检查，两边都调才算调到位。
:::

## 3.4 TIME_WAIT：谁先进入、为什么必须等

**主动关闭连接的那一方**发完最后一个 ACK 后进入 TIME_WAIT，Linux 上时长固定 60 秒（即 2MSL，实现里是硬编码，参数改不了）。

```text
作用一：可靠地让对端收到最后的 ACK
        如果这个 ACK 丢了，对端会重传 FIN；还在 TIME_WAIT 的我方能够重新应答。
        若直接关闭，对端只会收到 RST，看起来像一次异常断开。

作用二：让本次连接的报文在网络中彻底消亡
        等 2 倍 MSL，同一四元组的下一条连接就不会收到上一次遗留的迟到包
        —— 这正是 3.1 节随机 ISN 之外的第二重防线。
```

```bash
$ ss -tan state time-wait | wc -l
24163
$ ss -tan state time-wait | awk 'NR>1{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | head -3
   9120 110.242.68.66    ← 第 5 列是对端地址：能直接看出是哪一下游在频繁被我们断开
```

## 3.5 TIME_WAIT 堆积怎么看怎么办

先看是不是真的有问题：TIME_WAIT 是**正常状态**，只消耗本机一个四元组，不占服务端线程或 fd（对端已经关了）。

```text
判断阈值参考：
  几千条     → 高频短连接的正常结果，先优化连接复用
  数万~十万  → 端口可能耗尽（本地端口范围约 2.8 万个，默认 32768–60999）
  伴随报错   →  connect: cannot assign requested address 才是真故障
```

```bash
$ cat /proc/sys/net/ipv4/ip_local_port_range
32768    60999
$ ss -s | head -3
TCP:   382 (estab 120, closed 240, orphaned 0, timewait 22000)
```

处理顺序（从根因到缓解）：

```bash
# ① 首选：让业务少建连（长连接/连接池，见 3.6）—— 消除来源
# ② 扩大可用端口范围，代价很小，优先做
sudo sysctl -w net.ipv4.ip_local_port_range="10000 65535"
# ③ 允许复用处于 TIME_WAIT 的本地端口（仅对出站连接生效，需开启 timestamps）
sudo sysctl -w net.ipv4.tcp_tw_reuse=1
sudo sysctl -w net.ipv4.tcp_timestamps=1
# ④ 兜底：限制 tw 上限，超出直接释放（会丢一些可靠性，谨慎）
sudo sysctl -w net.ipv4.tcp_max_tw_buckets=20000
```

```text
错误写法：照抄老文章里的 sysctl 命令 net.ipv4.tcp_tw_recycle=1 来「清理 TIME_WAIT」
正确写法：不要碰它。该开关在 Linux 4.12 已被彻底移除，开启后会按「对端 IP」做时间戳单调性检查，
          一旦多个客户端经 NAT 共享同一公网 IP，时间戳互相冲突 → 后面来的连接被内核直接丢弃，
          表现为「部分用户随机连不上」，且极难复现。
          真要复用只用 tcp_tw_reuse（出站），它按四元组判断，不依赖对端时间戳一致性。
```

:::caution[别在负载均衡器上找 TIME_WAIT]
云 LB / Nginx 到后端这一侧通常是长连接，TIME_WAIT 大量堆积几乎都发生在**发起连接的一侧**。看到客户端机器有几万条 tw，先怀疑「每请求新建连接」，而不是去调服务端参数。
:::

## 3.6 连接复用与长连接

建连的成本不只是三个包：还要付 TCP 慢启动（初始窗口小，见 [第 4 章 · 可靠传输与拥塞控制](../04-tcp-reliability/)）、TLS 握手、可能的路由与 ARP 查询。

```bash
# 分别计时：DNS、TCP 建连、TLS、首字节 —— 建连成本一眼可见（选项名以 curl --help 为准）
$ curl -s -o /dev/null -w 'dns=%{time_namelookup} connect=%{time_connect} ttfb=%{time_starttransfer} total=%{time_total}\n' http://127.0.0.1:8080/api/list
dns=0.000000 connect=0.000312 ttfb=0.012310 total=0.013004

# 同一条命令里连续请求两次：第二次 connect 时间为 0 说明复用了连接
$ curl -s -o /dev/null -w '1st connect=%{time_connect}\n' http://127.0.0.1:8080/a \
       --next -o /dev/null -w '2nd connect=%{time_connect}\n' http://127.0.0.1:8080/b
```

三个层次的复用：

```text
HTTP 层    keep-alive：一条 TCP 上跑多个请求（HTTP/1.1 默认开，HTTP/2 更进一步多路复用）
进程内     连接池：HTTP client / 数据库连接池，池大小 = 并发处理能力，不是越大越好
跨进程     连接复用服务：把外部依赖的连接收敛到 sidecar / 代理，统一管理与熔断
```

```text
错误写法：把 HTTP 短连接改成 keep-alive 后，随机出现 "connection reset by peer"
正确写法：让空闲超时层层递减 —— 客户端 keep-alive 超时 必须小于
          中间 LB/反向代理的 idle timeout（例如 LB 60s，则客户端设 15~30s）。
          否则代理先悄悄关掉连接，客户端还以为可用，往已关闭的连接上写数据就被 RST。
```

```bash
# 数一下到某个下游到底开了几条连接：远大于并发度说明连接池没生效，每请求都在新建
$ ss -tn dst 10.0.0.9:8080 | tail -n +2 | wc -l
214
```

## 3.7 自查清单

- [ ] 用「两个方向各确认一次」解释为什么握手三次、挥手四次
- [ ] 能说出 TIME_WAIT 的两个作用，并解释「谁主动关闭谁进入」
- [ ] 知道半连接队列与全连接队列分别由哪两个参数决定上限
- [ ] `ss -s` 与 `nstat` 里哪两个指标能证明是应用 accept 不过来
- [ ] 能说清 `tcp_tw_recycle` 为什么危险、`tcp_tw_reuse` 只对哪一侧生效
- [ ] 配置长连接时，客户端与代理的空闲超时谁应该更短

## 本章小结

- 三次握手是两个方向各确认一次对方的 ISN，四次挥手因为全双工要逐方向关闭，中间的 ACK 与 FIN 不能合并
- TIME_WAIT 由主动关闭方持有 60 秒，用来重发丢失的最终 ACK、并让旧连接的报文在网络中消亡
- 连接积压分两道：SYN  flood 打满半连接队列（有 syncookies 兜底），应用慢打满全连接队列（只能靠 accept 能力）
- 处理 TIME_WAIT 堆积的顺序是「少建连 → 扩端口 → tcp_tw_reuse → tw_buckets」，绝不要开 tcp_tw_recycle
