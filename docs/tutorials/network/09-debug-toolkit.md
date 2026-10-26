---
title: 抓包与网络排障实战
---

# 第 9 章 · 抓包与网络排障实战

**本章目标：**

- 掌握一套固定排查顺序：DNS → 连通 → 端口 → TLS → 应用，不再凭感觉试命令
- 会读 ping/traceroute/dig/ss/tcpdump/curl -v 的输出关键列，知道每个数字含义
- 能用这套工具组合独立定位一个「偶发超时」，并把证据链写清楚

## 9.1 排查顺序：像剥洋葱一样分层

网络故障的定位永远是从下往上逐层确认「这层通了没有」，每层一个代表命令：

```text
① DNS 解析对吗        dig / nslookup            症状：连不上但换 IP 直连就好
② 路由可达吗          ping / traceroute         症状：超时、丢包、绕远路
③ 端口开吗           tcp 连接本身 / ss          症状：Connection refused（对端没监听）
④ TLS 握得上吗        openssl s_client          症状：证书报错、握手被重置
⑤ 应用层行为对吗      curl -v / 日志            症状：状态码不对、慢在服务器
```

两条纪律：**先对比再动手**——同一条命令分别在「正常机器/正常域名」和故障现场各跑一遍，差异就是线索；**留证据**——每条命令的完整输出（含时间戳）贴进工单，别只写「我 ping 了不通」。

::: tip 从中间开始剥也合法
如果现象本身已经指明了层级（比如浏览器报 `ERR_CERT_AUTHORITY_INVALID`），直接从 ④ 开始，但结论仍要向下验证一层：证书报错时顺手确认 ③ 端口是通的，排除「报错是假象、其实是连错了别的服务」。
:::

## 9.2 ping 与 traceroute：先看有没有路

```bash
ping -c 10 api.example.com        # 发 10 个包，看统计
```

```text
PING api.example.com (93.184.216.34): 56 data bytes
64 bytes from 93.184.216.34: icmp_seq=0 ttl=56 time=23.4 ms
…
10 packets transmitted, 9 received, 10% packet loss
rtt min/avg/max/mdev = 21.3/28.7/95.2/22.1 ms
```

读法三件事：`10% packet loss` 说明路径有损（偶发超时的头号嫌疑）；`max` 远大于 `avg`、`mdev` 偏大说明抖动；`ttl=56` 能反推经过的路由跳数区间。但 **ping 不通 ≠ 网络不通**：很多机房直接屏蔽 ICMP，要换 ③ 的 TCP 连接再证。

traceroute 靠「TTL 逐跳递增、沿途路由器回 ICMP 超时」画出路径：

```bash
traceroute -n -w 2 api.example.com      # -n 不做反解（省时间防误导），-w 每跳超时秒数
```

星号 `* * *` 只代表该跳不回 ICMP，不代表断流——看**最后一跳有没有到达目标**。到达目标的跳数、以及某两跳之间 RTT 突然放大，才是有效结论。

ICMP 被屏蔽时，用 TCP 握手本身验证可达性（对应 9.1 的第 ②③ 步合并）：

```bash
nc -vz -w 2 api.example.com 443        # 只做 TCP 三次握手就断开
```

```text
Ncat: Connected to 93.184.216.34:443.   ← 出现 Connected：路径可达 + 端口在监听，②③ 两层同时过
Ncat: Connection refused.               ← 对端明确拒绝：进程没监听或 LB 后端摘除，跳 ③ 查 ss
Ncat: Connection timed out.             ← 连 SYN 都没回：防火墙丢包或路由黑洞，回头查 ②
```

## 9.3 dig：把解析结果钉死

```bash
dig api.example.com +noall +answer            # 只看答案段
dig api.example.com +short                    # 只要值，脚本里用
dig api.example.com @8.8.8.8                  # 指定上游，绕开本机解析器
dig api.example.com +trace                    # 从根服务器亲手走迭代链（第 8 章）
```

结合[第 8 章](./08-dns-cdn)的多上游比对判断污染。dig 的完整输出分四段，各段用途固定：

```text
;; status: NOERROR          结果码：NOERROR / SERVFAIL(上游拒答或配置坏) / NXDOMAIN(不存在)
;; flags: … qr rd ra         没有 aa 标志 = 这是某解析器缓存里的中间答案，未必是权威现值
;; QUESTION                  你问的问题原样回显
;; ANSWER                    记录本体：盯类型列与 TTL（第 8 章 8.2 的读法）
;; AUTHORITY                 下一跳提示：这个 zone 归哪组 NS 管，+trace 的迭代链在此展开
;; ADDITIONAL                附带地址：NS/MX 目标自己的 IP，最常漏看的一段
```

还有一个排障利器是**让 DNS 彻底出局**：

```bash
curl --resolve api.example.com:443:93.184.216.34 https://api.example.com/health
```

`--resolve` 把域名硬钉到指定 IP（SNI 与 Host 仍用域名）。这条命令通、平时不通 → 问题锁定在解析层；这条也不通 → 继续往下查。

## 9.4 ss 与 netstat：看本机端口与连接状态

`netstat` 是老将，`ss` 是它的现代替代（信息更多、更快），常用组合：

```bash
ss -tulnp                      # 谁在监听哪些端口（t=TCP u=UDP l=_listen p=进程）
tcp   LISTEN  0   511  0.0.0.0:8080  0.0.0.0:*  users:(("gunicorn",pid=412,fd=7))
                ▲    ▲
                snd-Q Send-Q: 这里是 accept 队列（backlog）上限，不是连接数
ss -s                          # 全机连接状态汇总，一眼看异常堆积
```

状态计数解读速查：

```text
ESTAB      真在传数据的连接
SYN-RECV   半连接堆积：对端来了但三次握手没完成 —— SYN 洪水或队列溢出
TIME-WAIT  主动关闭方的残留，4 分钟量级：短连接打满时会耗尽本地端口
CLOSE-WAIT 对端已 FIN，本端一直没关 —— 十有八九是代码漏了 close()，会无限堆积
```

两个高频统计命令：

```bash
ss -tan state time-wait | wc -l        # TIME-WAIT 暴涨：短连接客户端病，改长连接/调端口范围
ss -tan state established | wc -l      # 与监控曲线对账，确认有没有连接泄漏
```

::: danger 错误写法：把「连不上」归因于防火墙前先只看 ss -tulnp
监听行里的地址若是 `127.0.0.1:8080`，服务根本没暴露到外部网卡——这不是防火墙问题，是绑错地址。先看监听行第一列：`0.0.0.0` / `*` 才是全网卡监听（对照[第 10 章 · 网络编程：从 socket 到 epoll](./10-socket)的 bind 写法）。
:::

## 9.5 tcpdump / tshark 与 Wireshark 关键列

抓包是最后一层证据：前面都在「问系统」，这里直接看线上字节。过滤器是它的灵魂：

```bash
tcpdump -i any -nn -s 0 host 93.184.216.34 and port 443 -w /tmp/cap.pcap
#  -i any 所有网卡   -nn 不解析域名/端口名（快且防误导）
#  -s 0 抓完整包    -w 落盘，回头慢慢分析
tshark -r /tmp/cap.pcap -Y "tcp.flags.syn==1 && tcp.flags.ack==0"   # 只看纯 SYN
tshark -r /tmp/cap.pcap -q -z conv,tcp                              # 按 TCP 会话汇总
tshark -r /tmp/cap.pcap -T fields -e frame.time_relative -e ip.src -e tcp.flags -e tcp.len
```

最后一条把包导出成制表符分隔的列，交给 awk/Python 统计「谁在重传、间隔多久」比肉眼翻 Wireshark 快得多。落盘的 pcap 拖进 Wireshark 后，重点列与动作：

```text
No./Time        Time 默认绝对时间；右键可改「相对前后帧」看间隔
Source/Dest     方向感：谁的包在重复出现？
Protocol/Info   一眼认出 SYN/ACK/ICMP/重传（Info 列有描述）
颜色             黑底红字一般是重传/错误，先点一条看它为什么红
右键 Follow TCP Stream    看这条会话的完整字节内容，HTTP 明文时最直观
```

## 9.6 curl -v 与时间拆解

一条 `curl -v` 把 ①–⑤ 层全部过一遍：DNS 结果、TCP 连接、TLS 参数、请求头、响应头、重定向链：

```bash
curl -v --max-time 10 https://api.example.com/v1/ping
```

排「慢」的时候要用 `-w` 做定量拆解（各选项含义以 `man curl` 为准）：

```bash
curl -s -o /dev/null -w 'dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total}\n' https://api.example.com/v1/ping
```

```text
dns=0.030 connect=0.085 tls=0.260 ttfb=0.910 total=0.930
  └ 差值定位：connect-dns≈TCP 握手；tls-connect≈TLS 握手；ttfb-tls≈服务器处理；total-ttfb≈下载
```

上例的瓶颈在「服务器处理」（0.65s），与网络无关；若 `tls` 异常大则是握手/证书问题（回[第 7 章 · HTTPS 与 TLS](./07-https-tls)）；`dns` 大是解析问题（回[第 8 章 · DNS、CDN 与负载均衡](./08-dns-cdn)）。

再强调一次读法：`-w` 的各段是**累积时间轴**，永远做差看，不看单值。排「偶发」要批量采样——同一命令循环 100 次把整行 `-w` 输出落盘，用 Python 统计 P50/P95/P99：偶发的慢只有分位数能现形，平均值会骗人。这正是 9.7 案件的入口手法。

## 9.7 综合练习：定位一个「偶发超时」

场景：网关日志里 2% 的 `/api/order` 请求耗时超过 5s，直接重试就好。按本章顺序走完整个案子：

```bash
# ① 解析层：多上游对比，排除污染；看 TTL 是否过短
dig +noall +answer api.example.com @8.8.8.8
# ②③ 网络层：连续观测丢包与 RTT 抖动
ping -i 0.5 -c 200 api.example.com
# ④ TLS 层：确认可复用会话，排除每次全握手
openssl s_client -connect api.example.com:443 -servername api.example.com < /dev/null 2>/dev/null | grep -E "Protocol|New,|Reused"
# ⑤ 定量拆解：批量采样找规律（写个小循环跑 100 次记录 9.6 的 -w 输出）
# 服务器侧：连接状态分布，盯 CLOSE-WAIT 与 SYN-RECV
ss -s
```

本案实际走到第 ⑤ 步发现规律：超时的 `total` 卡在 ttfb 之前、`connect` 正常——慢在连接建立后的第一个请求。在 LB 主机抓包：

```bash
tcpdump -i any -nn -s 0 tcp port 443 and greater 100 -w /tmp/lb.pcap
# 分析：正常会话每 60s 一次心跳后安然关闭；超时会话里客户端发数据，服务端直接回 RST
```

结论与修复：LB 空闲连接 60s 回收，客户端 keep-alive 复用了一条「已被 RST」的连接，TCP 重传直到 5s 超时才放弃。修复 = 把 LB 空闲超时调到大于客户端 keep-alive 周期，并把 RST 后的重试改为立即新建连接。

交付物模板：现象统计 → 各层排除记录（带命令输出）→ 抓包证据 → 根因一句话 → 修复与回归验证。**没有证据链的结论等于没结论。**

## 本章小结

- 固定顺序 DNS→连通→端口→TLS→应用 逐层确认，每层一个代表命令；对比正常样本、保留原始输出是排障的两条铁律
- ping 看丢包/抖动但可能被 ICMP 屏蔽；traceroute 的星号只说明不回包；`--resolve` 钉 IP 是让 DNS 迅速出局的最快手段
- `ss` 状态计数里最值钱的两个信号：CLOSE-WAIT 堆积指向代码漏关连接，Send-Q 上限指向 backlog 配置；抓包用 tcpdump 落盘、tshark/Wireshark 分析，跟着 Follow Stream 与重传标红走
- `curl -w` 的时间拆解把「慢」定量归因到 DNS/TCP/TLS/服务器处理/下载五段之一，偶发超时案要靠在这一层采样出规律
