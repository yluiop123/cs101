---
title: "第 4 章 · 可靠传输与拥塞控制"
description: "TCP 头里的序列号标识的是这个段的第一个字节在整条字节流中的位置，所以「丢了第 3 个包」这种说法在 TCP 里并不准确，准确说法是「字节 2921 之后没收到」。"
series: network
sidebar:
  order: 4
  label: "可靠传输与拥塞控制"
difficulty: intermediate
duration: 7
---

**本章目标：**

- 理解序号与确认如何把不可靠的 IP 变成有序可靠的字节流
- 会读 `ss -ti` 里的 rtt / rto / cwnd / retrans，判断重传是超时还是快速重传
- 分清流量控制与拥塞控制，能用一句话说出 CUBIC 与 BBR 的差别

## 4.1 序号与确认：给字节编号，而不是给包编号

TCP 头里的序列号**标识的是这个段的第一个字节在整条字节流中的位置**，所以「丢了第 3 个包」这种说法在 TCP 里并不准确，准确说法是「字节 2921 之后没收到」。

```text
发送 1448 字节 × 3 段：
  段1  seq=1      len=1448   → 覆盖字节 1..1448
  段2  seq=1449   len=1448   → 覆盖字节 1449..2896
  段3  seq=2897   len=1448   → 覆盖字节 2897..4344

确认号 ack=2897 的含义是：「2897 之前的我都收到了，请从 2897 继续发」
```

```bash
$ sudo tcpdump -i any -nn 'tcp port 8080' -c 6
11:20:00.0001 IP 10.0.0.5.44120 > 10.0.0.9.8080: Flags [P.], seq 1:501, ack 1, win 80
11:20:00.0035 IP 10.0.0.9.8080 > 10.0.0.5.44120: Flags [.], ack 501, win 64240
#                                             ↑ seq 1:501 = 净荷 500 字节；ack 501 = 累计确认
```

TCP 的确认默认是**累计**的：收到 1、2、3 只需回一个 ack=4。这带来一个副作用——中间一段乱序时，确认号无法表达「后面的我也收到了」，于是有了 **SACK 选项**（`tcp_sack`，默认开启），让接收方能说「2897 之前缺，但 4345..8000 我已经有了」，发送方就只补缺的那一段。

## 4.2 超时重传与 RTT 测量

超时重传（RTO）是最后的兜底手段，代价极高：等一个定时器 + 回到慢启动。

```text
Linux 依 RFC 6298 计算：
  SRTT   = (1 − 1/8) × SRTT + 1/8 × R        # R 是本次测得的往返时间
  RTTVAR = (1 − 1/4) × RTTVAR + 1/4 × |SRTT − R|   # 抖动
  RTO    = SRTT + 4 × RTTVAR
  取值夹在下限与上限之间（Linux 常见下限 200ms、上限 120s），重传一次未回就翻倍（指数退避）
```

```bash
$ ss -ti 'dport = :8080'
ESTAB  0  0  10.0.0.5:44120  10.0.0.9:8080
     ts sack cubic wscale:7,7 rto:244 rtt:21.098/9.742 mss:1448 pmtu:1500
     cwnd:10 bytes_sent:1421 bytes_acked:1422 bytes_received:9466
     segs_out:82 segs_in:82 data_segs_out:6 retrans:0/4 rcv_space:14480
     send 5495921bps lastsnd:91675 lastrcv:91650 rcv_rtt:6755.4 minrtt:16.098
```

`ss -ti` 关键字段的读法（字段名随内核版本略有增减，以 `man ss` 为准）：

```text
rtt:23.5/11.8      SRTT / 抖动 RTTVAR，单位毫秒
retrans:0/4        当前未确认的重传数 / 累计重传数
cwnd:14480         拥塞窗口（字节）
rto:200            当前超时值（毫秒）
pmtu:1500          路径 MTU
```

:::caution[RTT 抖动大时 rto 会很难看]
`rtt:5.0/40.0` 意味着 RTTVAR 远大于 SRTT，算出来的 RTO 会被推到上限。这类链路上「重传很多但网络不慢」很常见，先查是不是有无线/跨境链路导致抖动，而不是急着调大初始窗口。
:::

看整体重传率比看单条连接有用：

```bash
$ nstat -az TcpRetransSegs TcpOutSegs 2>/dev/null || netstat -s | grep -i retrans
TcpRetransSegs     12043
TcpOutSegs         2841203          # 重传率 ≈ 0.42%，正常广域网在 1% 以内
```

## 4.3 滑动窗口：在途数据量的闸门

发送方不能「发一个等一个」，那会把带宽浪费在等待上。滑动窗口允许**一批数据同时在途**，窗口大小由两个约束共同决定。

```text
可用窗口 = min(cwnd, rwnd) − 在途字节数

cwnd  拥塞窗口：发送方估计的「网络能承受多少」        → 4.5 节
rwnd  接收窗口：接收方通告的「我的缓冲区还剩多少」     → TCP 头的 win 字段
```

```text
       已确认      在途（已发未确认）        允许发送          不允许发送
  ────────|──────────────────|───────────────────|──────────────────
          ^                  ^                   ^
       左边界（最后 ack）    发送指针右界        窗口右边界（滑动的「窗口」）
```

带宽时延积（BDP）决定需要多大的窗口才能填满链路：

```bash
# 100ms RTT、100Mbps 链路的 BDP = 100e6 × 0.1 / 8 = 1.25 MB
$ ss -ti 'dport = :8080' | grep -o 'rcv_space:[0-9]*'
$ sysctl net.ipv4.tcp_rmem net.ipv4.tcp_wmem   # 自动调优缓冲区上下限
```

TCP 头的窗口字段只有 16 位（最大 65535 字节），超过就必须靠**窗口缩放选项**（`wscale:7,7` = 左移 7 位）。所以看到 `wscale:0,0` 的高带宽链路，吞吐会被 64KB 硬顶住 —— 多半是中间某设备剥掉了选项。

## 4.4 流量控制与拥塞控制：两件事，别混

这是本章最重要的概念区分。

```text
                cwnd（网络说）              rwnd（对端说）
发送方 ──── 取两者较小值 ────▶ 中间路由器 ────▶ 接收方缓冲区
                                                    │
                                                    └─ 缓冲区满 → 通告 win=0
```

```text
流量控制   目的：别把接收方的内存撑爆        信号：TCP 头的 win 字段（对方给）
拥塞控制   目的：别把中间链路塞死            信号：丢包 / 时延（自己估）
```

两者的故障现场完全不同：

```bash
# 对端通告的窗口只能从包头的 win 字段看（ss 看不到对端意图，只看得到本端估算）
$ sudo tcpdump -i any -nn 'tcp port 8080' | grep -o 'win [0-9]*' | sort | uniq -c | sort -n | tail -5
# 情形 A：win 被对端通告成很小   → 接收方处理不过来（慢消费者、GC、磁盘卡）
# 情形 B：win 很大但 cwnd 很小   → 链路在丢包或带宽不足，是网络问题
$ ss -ti 'dport = :8080' | grep -oE 'cwnd:[0-9]+|retrans:[0-9]+/[0-9]+'   # 本侧对照
```

:::danger[win=0 是接收方的锅，别去调拥塞算法]
看到抓包里连续 `win 0` 和窗口探测（zero window probe），问题一定在接收端缓冲区，加带宽、换 BBR 都不会有任何改善。正确方向是让对方读得快一点，或把大响应切小、加背压。
:::

## 4.5 慢启动、拥塞避免与快重传

「慢启动」这个名字有欺骗性：它一点不慢，每个 RTT 窗口翻倍，是指数增长。真正的「慢」是相对一次性打满而言的谨慎起步。

```text
cwnd
 ↑                                      ┌── 拥塞避免：每个 RTT 加 1 MSS（线性）
 │                              ╱╱╱╱╱╱╱
 │                     ╱╱╱╱╱╱╱  ← 到达 ssthresh 后转为线性
 │            ╱╱╱╱╱╱╱
 │     ╱╱╱╱
 │╱╱╱╱  ← 慢启动：每收到一个 ACK，cwnd += 1 MSS（一个 RTT 翻倍）
 └──────────────────────────────────────────────────────────▶ 时间
      初始 cwnd ≈ 10 MSS（Linux 默认 initcwnd，见 ip route 的 initcwnd 属性）
```

```text
事件 → 反应（CUBIC 传统 Reno 语义下的核心规则）：
  收到 3 个重复 ACK → 快重传（立刻重发缺失段）+ 快恢复：ssthresh = cwnd/2，cwnd = ssthresh
  RTO 超时         → ssthresh = cwnd/2，cwnd = 1 MSS，回到慢启动（惩罚重得多）
```

```bash
$ ip route change default via 192.168.1.1 dev eth0 initcwnd 20 initrwnd 20
$ ip route get 8.8.8.8          # 用这个确认属性是否真的生效（选项名以 man ip-route 为准）
$ sysctl net.ipv4.tcp_recovery   # 0=Reno 1=RFC6675 2=RFC6582，影响快恢复行为
```

短传输的命运由慢启动决定 —— 这是「为什么小请求在跨境链路上特别慢」的答案：

```text
RTT=200ms、initcwnd=10 MSS（约 14KB）：第一个 RTT 最多发出 14KB
一条 200KB 的响应至少需要 5 个 RTT ≈ 1 秒，纯粹耗在窗口爬坡上
→ 所以减少往返次数比调窗口更值钱（连接复用见 [第 3 章 · TCP 连接管理](./03-tcp-handshake/)）
→ 这也是 CDN 与对象存储对首包窗口敏感、HTTP/2 多路复用收益显著的原因
```

```text
错误写法：「服务在跨境链路上慢，所以把 initcwnd 调到 100 让它快点 ramp up」
正确写法：先分清瓶颈。窗口爬坡只在小传输上占主导；传输一大，CUBIC 自己会在几个 RTT 内
          爬到同等高度，调大 initcwnd 只是把第一次拥塞崩溃提前，反而更容易丢包。
          真正有效的是：减少往返次数（合并请求、开 keep-alive/TLS 会话复用）、
          或在服务端开启 BBR 以更快识别真实带宽。
```

:::tip[为什么「RTO 超时」比「三个重复 ACK」严重得多]
三个重复 ACK 说明网络**还能把后面的包送回来**（否则也不会有重复 ACK），只是丢了一个；RTO 超时说明**整条路径没反应**，可能是链路断了。前者只砍一半窗口，后者直接回到 1 个包 —— 这就是为什么高 RTT 链路上「一次 RTO」能拖垮整个传输时间。
:::

## 4.6 CUBIC 与 BBR：一句话差别

**CUBIC 把丢包当拥塞信号，BBR 把时延和带宽测量当拥塞信号。** 展开一点：

```text
CUBIC（Linux 默认，2.6.19 起）
  窗口曲线是关于「距上次丢包的时间」的三次函数：丢包后先平台期，再三次方加速冲向 Wmax
  优点：在浅缓冲、丢包可控的路径上吞吐高且稳定
  缺点：① 没丢包 ≠ 不拥塞（缓冲区涨满前它不知道） ② 高 RTT 流比低 RTT 流抢更多带宽（不公平）

BBR（内核 4.9+ 以模块提供，tcp_bbr）
  主动估计带宽 BtlBw 与最小 RTT（RTprop），把在途数据维持在「BDP + 少量探测余量」
  优点：不靠丢包判断，浅缓冲与高丢包链路表现明显更好，能压住排队时延
  缺点：与同样跑 BBR 的流共享时可能过于激进；测量被中间设备干扰时收益下降
```

```bash
$ sysctl net.ipv4.tcp_available_congestion_control net.ipv4.tcp_congestion_control
net.ipv4.tcp_available_congestion_control = reno cubic bbr
net.ipv4.tcp_congestion_control = cubic
$ sudo modprobe tcp_bbr && sudo sysctl -w net.ipv4.tcp_congestion_control=bbr   # 需内核带该模块
```

:::caution[换拥塞算法不是万能钥匙]
拥塞算法只影响**发送方怎么决定发多快**。如果瓶颈是带宽本身、是接收方处理能力、或是应用串行等待，换 BBR 一分钱好处都没有。先在 `ss -ti` 里确认 cwnd 明显小于 BDP，再谈调算法。
:::

## 4.7 综合练习：从抓包判断问题出在哪一侧

同一次大文件下载变慢，四组现象，逐组判断：

```text
A  win 字段一直是 500 左右，cwnd 很大
B  rtt 从 20ms 涨到 400ms，重传率却几乎为 0
C  每约 1 秒整齐地出现一次重传，且伴随 RTO 计数增长
D  抓到大量「3 个重复 ACK 后立刻重传」，吞吐没有明显下降
```

```text
参考答案：
A  流量控制问题 —— 接收方缓冲区/处理能力是瓶颈，方向是让对方读快点，与网络无关
B  排队时延（bufferbloat）—— 中间设备队列被塞满，CUBIC 因没丢包还在加速，BBR 会主动降速
C  超时重传主导 —— 路径上存在周期性丢包或链路抖动；先查物理层/VPN，再考虑 RTO 下限
D  快重传在正常工作 —— 少量随机丢包，TCP 自愈，属于预期行为，不必处理
```

```bash
$ ss -tni 'dport = :443' | grep -E 'cwnd|rtt|retrans'   # 采样脚本：每 200ms 打一行，看 cwnd 曲线形态
$ sudo tcpdump -i any -nn 'tcp port 443 and (tcp[tcpflags] & tcp-push != 0)' -w dl.pcap
```

## 本章小结

- TCP 用字节序号 + 累计确认实现可靠有序，SACK 让乱序场景只补缺口；seq 不是包号，是字节位置
- RTO 由 SRTT 与 RTTVAR 算出并指数退避，一次超时重传的代价远大于一次快重传，排查时先看是哪种
- 在途数据量受 `min(cwnd, rwnd)` 约束：rwnd 是接收方的内存问题，cwnd 是链路容量问题，绝不能混为一谈
- 慢启动指数增长、拥塞避免线性增长，丢包砍窗口；CUBIC 以丢包为信号，BBR 以带宽与时延测量为信号
