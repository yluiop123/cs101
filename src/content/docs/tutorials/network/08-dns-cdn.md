---
title: "第 8 章 · DNS、CDN 与负载均衡"
description: "DNS 是一棵倒挂的树，从下往上读："
series: network
sidebar:
  order: 8
  label: "DNS、CDN 与负载均衡"
difficulty: intermediate
duration: 9
---

**本章目标：**

- 能完整讲出从输入域名到拿到 IP 的解析全流程，区分递归与迭代两种查询角色
- 会读 A/AAAA/CNAME/MX/NS/TXT 记录，理解 TTL 与各级缓存如何影响「改了记录为什么还没生效」
- 说清 CDN 回源与命中判断，以及四层、七层负载均衡各自的取舍

## 8.1 域名的树与权威服务器

DNS 是一棵倒挂的树，从下往上读：

```text
www.shop.example.com.
 └─┬─┘ └─┬─┘ └─┬─┘ └┬┘
 主机  三级   二级   根（最后的点可省略）
        └ 第二层 + 顶级域 com = 授权管辖单元（zone）
```

每层各有一组**权威服务器**：根服务器只回答「com 的 NS 在谁手上」，com 的权威只回答「example.com 的 NS 在谁手上」，example.com 的权威才真正存有 `www.shop` 的 A 记录。管理边界靠 NS 记录一层层授权下去。

:::tip[域名的字符规则别背错]
单级标签最长 63 字节，全名最长 253 字节；大小写不敏感；`-` 可以出现在中间。中文域名经 Punycode 变成 `xn--` 开头的 ASCII——证书、Cookie 的域匹配都按转换后的形态算。
:::

配置里最常见的四种「笔误」：zone 文件里忘了结尾点，相对名会被拼成 `www.shop.example.com.example.com.`；TTL 字段漏写（继承 $TTL，但和 dig 看到的默认值不是一回事）；证书域名与实际访问名差一层 `www.`（呼应[第 7 章 · HTTPS 与 TLS](../07-https-tls/)的 SAN）；把 CNAME 和 A 记录并写在同一个名字下（互斥，解析结果看运气）。

## 8.2 资源记录：不止 A 和 AAAA

一条记录 = （名字, 类型, TTL, 值）。常见类型与用途：

```text
A      域名 → IPv4          www → 93.184.216.34
AAAA   域名 → IPv6          双栈站点两种都要有
CNAME  域名 → 另一个域名     www.shop → cdn.example.net（别名，最终仍要解到 A）
NS     这一级由谁权威管辖    授权链的指针
MX     邮件交换 + 优先级     发邮件时先查它
TXT    任意文本             SPF、域名所有权验证、DKIM 签名都放这
SOA    本 zone 的主权威、序列号、刷新参数
```

三条实践规则：CNAME 的**链尾**必须落到 A/AAAA（同一名字有 CNAME 时不能再并存其他记录）；根域（裸域 `example.com`）理论上不能是 CNAME，实践中靠云厂商 ANAME/ALIAS 记录代打；MX 优先级数字**越小越优先**。

`dig` 的 ANSWER 段就是上面这张记录表的原文：

```bash
$ dig www.shop.example.com +noall +answer
www.shop.example.com.   300   IN   CNAME   cdn.example-cdn.net.
cdn.example-cdn.net.     60   IN   A       198.51.100.7
```

两列必读数：类型列告诉你这是什么记录；TTL 列是**签发瞬间的倒计时快照**——中间层缓存过的答案，你看到的 TTL 会比权威设定值小，反复查同一名字看到 TTL 一路减小就是这个原因。

MX 与 TXT 的形态也在 ANSWER 段里认一下：

```bash
$ dig example.com MX +noall +answer
example.com.   3600   IN   MX   10 mail-a.example.com.
example.com.   3600   IN   MX   20 mail-b.example.com.      # 10 为主，20 是备份
$ dig _dmarc.example.com TXT +noall +answer
_dmarc.example.com.  3600  IN  TXT  "v=DMARC1; p=none; ..."
```

## 8.3 递归与迭代：一次完整解析

发起方与响应方的姿态完全不同，这两个词描述的是**谁替谁跑腿**：

```text
客户端 → 本地解析器（运营商/企业网关/公共 DNS）：  递归 ——「你必须给我最终答案」
本地解析器 → 根 → 顶级域 → 权威：                迭代 ——「我只告诉你下一步问谁」
```

完整走一遍 `www.shop.example.com`（解析器缓存全空的最坏情况）：

```text
1. 问根：example.com 的 NS？   → 返回 com 的服务器名单
2. 问 com：example.com 的 NS？ → 返回权威服务器名单
3. 问权威：www.shop 的 A？     → 返回 93.184.216.34 + TTL
4. 解析器把结果按 TTL 缓存，答复客户端
```

Python 标准库不自己跑这套流程，它把活外包给系统的解析器：

```python
import socket
infos = socket.getaddrinfo("www.example.com", 443)
print(sorted({i[4][0] for i in infos}))   # 所有候选 IP（A/AAAA 混排）
```

第一次解析要串行问三跳；此后各级缓存命中，才轮得到 8.4 的话题。另外 `getaddrinfo` 返回的是**按系统策略排好序的候选列表**（IPv6/IPv4 偏好规则），应用的正确姿势是逐个试：连第一条失败再连第二条——双栈站点（同时有 A 与 AAAA）的故障切换就发生在这一步，而不是 DNS 层。

本地解析器还有两个隐藏参数决定「排障手感」：A/AAAA 双查询并行竞速、UDP 查询的超时与重试次数——上游解析器半死不活时，用户看到的「转圈白屏」时长就是这两者乘出来的。实验时可用 `dig +time=2 +tries=1` 缩短等待。

## 8.4 TTL、缓存层级与 hosts

同一份答案在沿途每一站都会被抄一份，每份独立倒计时：

```text
应用/浏览器缓存（Chrome 内部有独立 DNS 缓存，重启浏览器最干净）
  → 操作系统缓存（各系统策略不同，以本机实测与官方文档为准）
    → hosts 文件（在系统解析器之前插入，优先级最高，TTL 不适用）
      → 本地解析器（受记录 TTL 约束，也可强行截短）
        → 权威（TTL 由你设定）
```

hosts 是调试利器——绕过拨出方向的解析，直连指定 IP：

```bash
# Linux/macOS 在 /etc/hosts，Windows 在 C:\Windows\System32\drivers\etc\hosts
127.0.0.1  api.example.com     # 本地起网关桩时临时接管域名
```

:::caution[「改了 DNS 怎么还没生效」的标准答案]
TTL 是**给缓存的上限**，不是生效延迟保证：旧记录在已经缓存它的每一层里都得待满各自的剩余时间。所以变更计划是：提前 1–2 天把 TTL 降到 300 秒以下，再改值；应急时改完 hosts 或用 `dig @权威服务器` 直接问权威验证——权威对了，剩下的只是等各级缓存过期。
:::

负答案同样被缓存：NXDOMAIN（域名不存在）被查过之后，一段时间内所有解析直接返回「不存在」而不转发权威，这段时长由该 zone SOA 的最小 TTL 字段决定。推论：「新子域名加上了却半天解不出」通常是正向 TTL 没到；「删掉的域名还解得出旧 IP」多半是正向缓存在途；而「解了一次拼错的域名之后反复报不存在」就是负缓存在场——三者都要拿 `dig @权威` 做基准对照。

## 8.5 DNS 污染与甄别

污染 = 有人抢在真答案之前给你塞了伪造响应（典型是缓存投毒与中间设备截答）。特征是**同一问题、不同上游给出不同答案**：

```bash
# 向两个互不隶属的解析器问同一个名字
dig +short www.example.com @8.8.8.8
dig +short www.example.com @1.1.1.1
```

两组 IP 指向的 CDN 段不同可以接受（调度本来就动态），但出现**明显不该存在的地址**就要警惕。比对读法：

```text
@8.8.8.8 → 93.184.216.34        公网可查归属，正常
@1.1.1.1 → 198.51.100.20        另一个 CDN 节点，正常调度差异
某个上游 → 127.0.0.1 / 内网段     经典污染特征，立刻可疑
```

加固手段按层次记：传输层做源端口随机化（协议自身改进）、终端改用加密 DNS（DoH/DoT，把查询装进 HTTPS/TLS 信道）、关键系统留 hosts 或本地缓存兜底。

:::danger[别把「污染」当「挂了」]
排查时先分清两件事：解析结果错（污染/劫持）还是解析超时（上游不可达）。前者要换上游比对，后者要换网络路径。用 `mdig` 之类多上游并行工具能一次看完所有答案做交叉验证（工具需自行安装，选项以其帮助为准）。
:::

## 8.6 CDN 回源与四层/七层负载均衡

CDN 解决的问题：源站只有一个，用户遍布全球。思路是把内容**搬到离用户近的地方**：

```text
用户查 www.shop.example.com
  → 权威返回 CNAME 到 dns.example-cdn.net（调度域名）
    → CDN 的全局调度（GSLB）按用户出口位置返回最近的边缘节点 IP
      → 边缘节点查本地缓存：
          命中 → 直接返回（再看边缘到源的缓存策略）
          未命中 → 回源：带着原始 Host 去源站取，取到后按规则缓存/透传
```

命中还是回源，看响应头即可判断（具体字段名各家 CDN 不同，以目标站点 `curl -v` 实测为准）：

```python
import http.client
c = http.client.HTTPSConnection("www.shop.example.com")
c.request("GET", "/")
r = c.getresponse()
for k, v in r.getheaders():
    if any(t in k.lower() for t in ("cache", "cdn", "via")):
        print(f"{k}: {v}")     # 常见形态：X-Cache: HIT/MISS、Via: 边缘节点名单
```

边缘就是一层反向代理缓存：[第 6 章 · HTTP/1.1、HTTP/2 与缓存](../06-http/)的 `Cache-Control`、`Vary` 在这里全部生效——源站响应头写错，CDN 就会忠实地把错的东西缓存到全球。再补两个回源细节：边缘对回源结果的缓存键默认是 URL，带不同 `Cookie`/`Authorization` 的请求要么在 CDN 规则里声明忽略这些头、要么让源站回 `private`，否则会出现「A 用户的页面缓存给 B 用户」的事故；动态 API 若也走 CDN，命中不了缓存的流量全额消耗回源带宽，值不值要先算账。回源风暴的三个常见根因：命中率低（URL 带随机 query 参数导致缓存键对不上）、源站响应头长期没写对缓存策略（[第 6 章](../06-http/)）、边缘健康检查误判把流量打回源站。

负载均衡分四层还是七层，差别就在「看不看得懂 HTTP」：

```text
四层（传输层）  只看 IP+端口，转发 TCP 连接本身；不终结 TLS 也能极高性能
               健康检查打到端口；会话保持只能靠源 IP 哈希
七层（应用层）  终结 TLS、解析 HTTP：可按路径/Header/Cookie 路由，能重试、限流、改写
               代价：要解析证书与报文，性能低一档，且拿到的是代理重建的连接（真实客户端 IP 要靠透传头带回）
```

GSLB（按地域调度）、CDN 边缘、机房内 LB 是同一条思想在不同尺度上的应用：**把「谁该处理这个请求」的决定尽量提前做**。

选型一句话：只需要把 TCP 连接摊开分到多台机器 → 四层（快、便宜，但看不见应用错误）；需要按 URL/Header 路由、灰度发布、终结 TLS → 七层。真实架构常常叠两层：四层在前面做流量摊薄，七层在后面做网关集群。

## 8.7 综合练习：拆解一个大站的解析链

选一个你常用的站点，完成以下侦察（命令均以本机 `dig --help` 实测为准，下面是常用组合）：

```bash
dig www.somebigsite.com +noall +answer          # 拿到最终 A 记录，看类型和 TTL
dig www.somebigsite.com +trace                  # 从根开始亲手走一遍迭代链
dig somebigsite.com NS +noall +answer           # 权威是谁家的？
dig somebigsite.com MX +noall +answer           # 邮件走谁？优先级排序对不对？
dig somebigsite.com TXT +noall +answer          # 有没有 SPF？
```

回答：

1. 从 `www.` 到最终 IP 中间经过了几跳 CNAME？调度域名暴露了它用哪家 CDN？
2. 答案里的 TTL 是多少秒？对照 8.4 想想：换 IP 演练要提前做什么？
3. 在两台不同城市的机器上跑第 1 条命令，答案 IP 一样吗？为什么？（GSLB 按出口调度）
4. 用 `dig @8.8.8.8` 与 `dig @1.1.1.1` 各问一遍，结果段差异属于正常调度还是可疑污染？
5. 裸域有没有 AAAA 记录？（双栈站点这里最容易漏）

## 本章小结

- DNS 是按 NS 授权一层层管下去的树；解析里客户端对本地解析器是递归，解析器对权威是迭代，四步问答走完最坏路径
- 记录类型各司其职：A/AAAA 指地址、CNAME 做别名与 CDN 调度、NS 划管辖、MX 管邮件、TXT 放验证；改记录后等的是各级缓存里剩余 TTL 走完，提前降 TTL 才是正解
- hosts 插在最前、优先级最高；污染看「不同上游答案是否离谱」，超时看「路径是否可达」，两类故障排查方向不同
- CDN 用 CNAME+GSLB 把用户引到边缘节点，命中直接回、未命中回源；四层 LB 快而盲、七层 LB 聪明而贵，决定「谁处理请求」的层级越靠前越好
