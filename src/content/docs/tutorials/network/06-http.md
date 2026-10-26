---
title: "第 6 章 · HTTP/1.1、HTTP/2 与缓存"
description: "HTTP/1.x 是文本协议：一条消息就是可打印字符加 CRLF（回车换行）的组合，头部与正文之间必须有一个空行。"
series: network
sidebar:
  order: 6
  label: "HTTP/1.1、HTTP/2 与缓存"
difficulty: intermediate
duration: 6
---

**本章目标：**

- 能把一条 HTTP 消息拆成起始行、头部与正文，并按四类说清每个 Header 的归属
- 理解 Keep-Alive 与管线化为什么仍解决不了队头阻塞，HTTP/2 如何用分帧复用重写规则
- 会用 Cache-Control / ETag / Last-Modified 设计缓存，并诊断「为什么这次没命中缓存」

## 6.1 报文结构：起始行、头部、正文

HTTP/1.x 是**文本协议**：一条消息就是可打印字符加 CRLF（回车换行）的组合，头部与正文之间必须有一个空行。

```text
GET /index.html HTTP/1.1        ← 请求行：方法 + 路径 + 版本
Host: example.com               ← 头部区，每行 键: 值（大小写不敏感）
Accept-Encoding: gzip
                                ← 空行：头部到此结束
（正文只出现在请求或响应体中）
```

响应的第一行叫状态行（`HTTP/1.1 200 OK`），其余结构完全相同。正文怎么界定只有两种方式：

```text
Content-Length: 512             → 固定长度，读满 512 字节为止
Transfer-Encoding: chunked      → 分块传输，每块自带长度，0 长度块表示结束
```

用 Python 标准库看一次真实响应，头部对象可以按键取值：

```python
import http.client

conn = http.client.HTTPSConnection("example.com", timeout=5)
conn.request("GET", "/")
resp = conn.getresponse()
print(resp.status, resp.reason)          # 200 OK
print(resp.headers["Content-Type"])      # text/html...
body = resp.read()
print(len(body), "bytes")
conn.close()
```

:::caution[头部里不能有裸换行]
每个头部值必须压成单行；需要折行时用「SP + 空格」续行（obsolete line folding）。Cookie 想写多条不能塞一个 `Set-Cookie`，必须发多个同名头部行——这是新手最常踩的编码坑。
:::

## 6.2 方法与状态码：常错点

方法的核心约束是两个独立性质：**安全**（不改变服务器状态）与**幂等**（重复执行效果相同）。

```text
GET/HEAD/OPTIONS   安全 + 幂等
PUT/DELETE         幂等，但不安全
POST               既不安全也不幂等（重复提交 = 重复下单）
PATCH              默认两者都不是（取决于实现）
```

状态码的常错点集中在几组「长得像」的码：

```text
301 vs 302   永久/临时重定向；301 会被浏览器缓存，改不回来要提前留退路
302 vs 307   302 历史包袱：多数浏览器会把 POST 转成 GET 再跳转；307 保证方法不变
304          不是「错误」，是缓存协议的一部分（见 6.6），无正文
204          成功但无内容返回；响应不允许带正文
401 vs 403   401 = 没登录（配 WWW-Authenticate 头），403 = 登录了也不给你
404 vs 405   路径不存在 vs 路径存在但方法不对
502 vs 503 vs 504   网关后面的服务坏了 / 自己 overloaded / 等后面的服务超时
```

:::danger[错误写法：参数非法返回 200，靠 body 里的 code 字段判错]
`HTTP 200 + {"code": 40001}` 让所有监控、网关重试、熔断策略全部失明——从协议层看一切正常。正确做法：客户端参数错给 4xx，依赖服务故障给 5xx，业务语义再放 body。监控「成功率」才有意义。
:::

## 6.3 Header 四分类

RFC 把头部按「谁发的、说什么用」分成四类：

```text
通用头     两端都能用：Connection、Date、Cache-Control（响应侧）…
请求头     客户端的意图：Host、User-Agent、Accept、Accept-Encoding、Cookie、If-None-Match
响应头     服务器的补充：Server、Location、Set-Cookie、Vary、Retry-After
实体（表示）头   描述正文本身：Content-Type、Content-Length、Content-Encoding、Content-Disposition
```

三条容易记混的事实：

- `Host` 是 HTTP/1.1 **必须**的请求头——同一个 IP 挂多个站点全靠它分发（[第 8 章 · DNS、CDN 与负载均衡](../08-dns-cdn/)的虚拟主机与 SNI 会再遇到它）
- `Cookie`（请求头）和 `Set-Cookie`（响应头）不是一对同名头，方向相反
- `Content-*` 只描述当前这份正文；缓存协商的 `Cache-Control` 属于通用头，`Vary` 属于响应头

## 6.4 Keep-Alive 与 HTTP/1.1 的队头阻塞

早期 HTTP/1.0 默认一问一答就断开 TCP，每个资源都要付三次握手 + TLS 握手的成本（三次握手的细节见[第 3 章 · TCP 连接管理](../03-tcp-handshake/)）。`Connection: keep-alive` 让一条 TCP 连接连续服务多个请求：

```python
import http.client

conn = http.client.HTTPConnection("localhost", 8000)  # 一条连接
for path in ("/a.json", "/b.json", "/c.json"):        # 复用 3 个请求
    conn.request("GET", path)
    r = conn.getresponse()
    print(path, r.status, len(r.read()))
# 关键：请求之间不调 close()
```

为进一步减少等待，HTTP/1.1 引入了管线化（pipelining）：允许把多个请求连着写进 socket。**但它失败了**，原因在响应侧：

```text
请求:  A ──► B ──► C          可以连着发
响应:  A ◄── B ◄── C          协议强制按请求顺序返回！
       └─ A 是个慢查询（数据库卡 10s）
          B、C 明明早就算完了，也必须排在后面干等  ← 应用层队头阻塞
```

于是浏览器宁可开 6 条并行 TCP（每域名上限），开发者用域名分片、雪碧图去绕这个上限。这些补丁在 HTTP/2 面前全部作废——因为 2 改了地基。

## 6.5 HTTP/2：二进制分帧与多路复用

HTTP/2 不再把「一条连接 = 一个接一个的请求」当假设，而是三层结构：

```text
连接 Connection ─ 一条 TCP，全程复用
  └ 流 Stream    ─ 一个请求/响应往来，有唯一编号（客户端发起用奇数）
      └ 帧 Frame ─ 最小单位，二进制：9 字节帧头 + 负载（DATA、HEADERS、RST…）
```

不同流的帧可以在同一条 TCP 上**乱序交错**发送，接收端按流编号重新拼装：

```text
HTTP/1.1:  [AAAABBBBBBCCCCCC]        串行，B 等 A
HTTP/2:    [A1 B1 C1 A2 B2 C2 A3]    交错，先到先装，谁都不等谁
```

配套改动还有：HPACK 头部压缩（同名头部只传索引，去掉 chunked 与折行）、服务端推送（实践中基本被浏览器弃用）。

:::caution[HTTP/2 消灭了应用层队头阻塞，没消灭 TCP 层的]
所有流共用一条 TCP：一个 IP 包丢失，TCP 重传并**按序**交付，于是这条连接上所有流都被这一个丢包卡住。这正是 HTTP/3 把传输层换成 QUIC（跑在 UDP 上、每流独立重传）的根本动机，见[第 5 章 · UDP 与 QUIC](../05-udp-quic/)。
:::

## 6.6 压缩与缓存：强缓存、协商缓存

正文压缩走实体头：客户端用 `Accept-Encoding: gzip, br` 声明能力，服务端选一种并回 `Content-Encoding: br`。压缩后的字节也参与缓存，因此响应必须带 `Vary: Accept-Encoding`，否则缓存可能把 gzip 内容发给不支持的客户端。

缓存分两级。**强缓存**：不发请求直接用本地副本——

```text
Cache-Control: max-age=3600, public      1 小时内零网络往返
Cache-Control: no-cache                  可以用副本，但每次必须先协商
Cache-Control: no-store                  敏感数据，禁止落盘
```

**协商缓存**：到期后带上凭证问一句，服务器说「没变」就返回 304（无正文），省下行费但不省往返。

```text
Last-Modified / If-Modified-Since    秒级粒度；改了时间戳内容没变也会 miss
ETag / If-None-Match                 内容指纹，粒度精确；优先级高于前者
```

```python
# 手动走一遍协商缓存
import http.client

etag = None                       # 第一次没有凭证，直接 GET
for round_ in range(2):
    c = http.client.HTTPSConnection("example.com")
    headers = {"If-None-Match": etag} if etag else {}
    c.request("GET", "/", headers=headers)
    r = c.getresponse()
    print(r.status)               # 第一轮 200；第二轮 304 且 r.read() 为空
    if r.status == 200:
        body = r.read()
        etag = r.headers.get("ETag")   # 记下指纹，下轮带上
```

:::danger[错误写法：静态资源强缓存设一年，改版后靠「清缓存」通知用户]
正确姿势是把版本号编进 URL：`app.3f2a1c.js`（内容哈希）或 `app.js?v=20260301`。URL 变了就是一次全新请求，老 URL 尽管缓存一年——这是前端工程化的基石之一。
:::

命中判断的顺序背下来：先看 `Cache-Control` 是否还在有效期内 → 过期则带 `If-None-Match`/`If-Modified-Since` 协商 → 200 换新副本，304 用旧副本。

## 6.7 综合练习：读懂一组响应头

某接口返回如下头部，回答括号里的问题：

```text
HTTP/1.1 200 OK
Server: nginx/1.24.0
Date: Wed, 01 Apr 2026 08:00:00 GMT
Content-Type: application/json; charset=utf-8
Content-Encoding: gzip
Cache-Control: public, max-age=60, must-revalidate
Vary: Accept-Encoding, Origin
Connection: keep-alive
```

1. 这份响应能被 CDN 缓存吗？最长多久？（`public` + max-age=60）
2. 60 秒后再请求会发生什么？（先回源协商；`must-revalidate` 禁止过期后擅自使用副本）
3. 为什么 `Vary` 里有 `Origin`？（按来源区分响应，缓存键要包含它，否则跨域场景会串数据）
4. `Content-Length` 去哪了？（压缩后长度变化时常用 chunked 分块，或重新计算长度——用 `curl -v` 实测确认）
5. 用 `curl -v -H "Accept-Encoding: gzip" 地址` 复现，观察头部里是否出现分块传输。

## 本章小结

- HTTP/1.x 是文本协议：起始行 + 头部 + 空行 + 正文；正文靠 Content-Length 或 chunked 界定；头部按通用/请求/响应/实体四类归属
- 状态码要按协议语义用：参数错 4xx、依赖故障 5xx，307 保方法、304 属缓存、204 无正文，别用 200 包裹一切错误
- HTTP/1.1 的顺序响应导致应用层队头阻塞；HTTP/2 用二进制分帧在同一条 TCP 上多路复用解决它，但 TCP 层丢包阻塞仍留给 HTTP/3
- 缓存两级：强缓存（Cache-Control: max-age）零往返，协商缓存（ETag/Last-Modified → 304）省下行；静态资源用内容哈希 URL 做长期强缓存
