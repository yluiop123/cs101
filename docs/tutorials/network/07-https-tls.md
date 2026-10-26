---
title: HTTPS 与 TLS
---

# 第 7 章 · HTTPS 与 TLS

**本章目标：**

- 说清 HTTP 裸奔在三类攻击下的失效方式，以及 TLS 分别用什么机制对付它们
- 能画出 TLS 1.2 与 1.3 的握手时序，解释一次握手里加密与认证如何分工
- 会用证书链思路排查「不受信任的证书」，并用 openssl 读懂一张真实证书

## 7.1 为什么需要 TLS

先在局域网里亲眼看看「明文」是什么意思：

```python
# 只是演示抓包可见性：本机起一个最简 HTTP 服务，另开终端 telnet 过去手敲
# GET / HTTP/1.1
# Host: localhost
# （空行）
# ——整个请求，包括你后续 POST 的密码，都是可直读的字节
import http.server
http.server.test(HandlerClass=http.server.SimpleHTTPRequestHandler)
```

公网上任何一跳的路由器、恶意 Wi-Fi 的热点所有者都能看到这些字节。威胁有三种，TLS 对每种各给一件武器：

```text
窃听（看了你的内容）        → 加密：对称加密保护全部流量
篡改（改了传输中的内容）    → 完整性：AEAD 密码自带防篡改校验
冒充（假装是银行站点）      → 认证：CA 签发的证书绑定「域名 ↔ 公钥」
```

::: tip HTTPS 不是协议，是组合
「HTTPS」= HTTP over TLS：TCP 之上先做 TLS 握手建立加密通道，之后的 HTTP 报文全部塞进这条通道里跑。默认端口 443，URL 方案名写 `https`，仅此而已——HTTP 层的知识（[第 6 章 · HTTP/1.1、HTTP/2 与缓存](./06-http)）一字不改地全部适用。
:::

## 7.2 对称与非对称的配合

两种加密各有致命的短板，于是 TLS 让它们搭档：

```text
对称加密   快（一条指令处理一块数据），但双方必须先共享同一把密钥——怎么送过去？
非对称加密 有公钥/私钥之分，公钥随便发，但运算慢几个数量级，只适合交换少量材料
```

配合流程（以 ECDHE 密钥交换为例）：

```text
1. 客户端：我支持这些密码套件，给你一个随机数 R1
2. 服务器：选定套件 + 给你随机数 R2 + 发证书（内含公钥）
3. 双方各自临时生成 ECDHE 密钥对，交换公钥部分
4. 双方算出相同的「预主密钥」→ 混入 R1、R2 推导出会话密钥
   —— R1/R2 的作用：防止双方算出的密钥被固定死在交换材料里
5. 互发 Finished 校验握手完整性 → 之后全部走会话密钥（对称）加密
```

第 3、4 步的密钥对**用完即弃**，这就是前向保密（PFS）：日后服务器私钥泄露，攻击者也还原不了今天录下的流量。老式的 RSA 密钥交换没有这个性质，TLS 1.3 里已被废除。

双方协商出来的「菜单项」叫密码套件，一个套件写明了各岗位算法：

```text
TLS_AES_256_GCM_SHA384                        ← 1.3 套件：密钥交换固定 (EC)DHE，只剩这三样
TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256         ← 1.2 套件
     └密钥交换┘ └签名┘  └─对称加密─┘  └校验┘
```

GCM、ChaCha20-Poly1305 这类 AEAD 模式加密与防篡改一手包办；需要另配 HMAC 的 CBC 模式历史上一堆 padding oracle 事故，1.3 直接全部移除。配服务器时只在 AEAD 里挑即可。

## 7.3 证书链与信任

上面第 2 步有个鸡生蛋问题：服务器的证书本身怎么信？答案是**信任链**：

```text
根证书（预装在操作系统/浏览器信任库里，自签名）
  └─ 签发 → 中间 CA 证书（网站一般不直接由根签发，根离线保护）
        └─ 签发 → 叶子证书（你的站点，含公钥与域名）
验证 = 逐级用上一层的签名核下一层，直到落进信任库
```

Python 客户端默认就走这条验证：

```python
import ssl, socket

ctx = ssl.create_default_context()          # 加载系统信任库
with socket.create_connection(("example.com", 443)) as sock:
    with ctx.wrap_socket(sock, server_hostname="example.com") as tls:
        print(tls.version(), tls.cipher()[0])       # TLSv1.3, TLS_AES_256_GCM...
```

::: danger 错误写法：`ctx.check_hostname = False; ctx.verify_mode = CERT_NONE`
「证书报错就关掉校验」等于把认证武器整个扔掉——任何中间人都能冒充目标站点，加密只剩下给攻击者做了一层封装。本地调试自签证书应把自己 CA 加进 `ctx.load_verify_locations(...)`，而不是关校验。
:::

证书链最常坏的三处，对应的检查动作分别是：

```text
漏发中间证书   s_client 输出里每张证书一行 depth；只有 depth=0 说明链不完整。
              浏览器可能靠历史下载的中间证书蒙对，curl/Java/Go 会直接报错
域名不匹配     现在只认 SAN 扩展列表，通配符 *.example.com 不匹配 a.b.example.com；
              老代码还在校验 CN，属于过时逻辑
过期           notBefore / notAfter 两个边界，客户端系统时钟漂移也会「被过期」
```

## 7.4 握手：一次往返与复用

TLS 1.2 完整握手需要 **2 个 RTT**（两个来回）才开始传数据：

```text
ClientHello（套件、随机数、ECDHE 公钥候选） ──►
        ◄── ServerHello + 证书 + 密钥参数 + Server Finished
Client Finished ──►
   ……此后才是应用数据
```

首次访问付完这笔钱后，下次同服务器访问要走**会话复用**，省掉证书交换：

```text
Session ID   服务器自己存会话状态，扩展性差
Session Ticket  服务器把状态加密后发给客户端保管，回来直接解票 → 1 个 RTT
```

复用对性能意义重大：移动端一次 TLS 1.2 全握手常见 200–400ms，比传一张图片还贵。把一次全新 HTTPS 访问的账单摊开看：

```text
TCP 握手 1 RTT + TLS 1.2 全握手 2 RTT + 首个 HTTP 请求 1 RTT  ≈  4 个 RTT
换成 TLS 1.3：少一个 RTT ≈ 3；命中会话复用 + keep-alive：≈ 1
```

所以「连接能不能复用」是性能关键问题——这也解释了[第 6 章](./06-http)为什么 HTTP/2 要拼命把一切塞进同一条连接：省的不只是 TCP，更是 TLS。

## 7.5 TLS 1.2 与 1.3 的差别

1.3 是一次彻底的瘦身，可用下面对照表速记：

```text
维度          TLS 1.2                TLS 1.3
握手 RTT      2（复用 1）            1（复用 0，可选 0-RTT）
密钥交换      ECDHE 或 RSA          只有 (EC)DHE → 前向保密强制成立
被淘汰        RSA 传输密钥、CBC 模式、SHA-1、MD5、任意版本协商、压缩
ClientHello   明文参数              仍要伪装兼容首包（中间盒不认 1.3 就断连）
证书校验      握手最后               服务器参数与证书几乎同批送达
```

0-RTT 指复用会话时客户端把首条应用数据直接塞进第一个包。代价：这层数据**不保证防重放**——攻击者可以原样重发那份加密数据，服务器无从分辨。所以协议规定：0-RTT 里只能放幂等请求，绝不能再放「确认转账」（对照[第 6 章](./06-http)的方法幂等表）。

## 7.6 HSTS 与常见配置错误

TLS 只管「加密后的连接」，管不住两件事：**用户第一次输入的是 http**、以及**站点自己悄悄降级**。

```text
http://bank.example.com 被首次访问 → 跳转 https 的那个明文请求可被劫持改写
```

HSTS 是对应的补丁：站点在 HTTPS 响应里声明「以后一段时间内，浏览器访问本站一律强制 HTTPS，不许降级」：

```text
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

其余高频配置错误一张表看完：

```text
只装站点证书没装中间证书    curl 报 unable to verify → 用 7.7 的命令验证 chain 完整
证书域名覆盖不全            只签了 example.com，API 在 api.example.com → SAN 要逐个列
明文页面嵌 https 资源        混合内容，浏览器拦或警告；反过来 https 页面引 http 资源必拦
SNI 与 IP 直连              一个 IP 多站点时，不带 SNI 的请求拿默认证书 → 客户端校验域名失败
时钟漂移                    本机时间错了会把有效证书判成「未生效/已过期」，先查系统时间
```

加固的底线是在代码/服务器配置里显式声明最低版本，不让协商回退到老协议：

```python
import ssl
ctx = ssl.create_default_context()
ctx.minimum_version = ssl.TLSVersion.TLSv1_2    # 1.0/1.1 不再出现在协商结果里
```

## 7.7 综合练习：用 openssl 看一张真实证书

```bash
# 1) 连上去，看握手过程与证书链（-servername 模拟 SNI，多数站点必须带）
openssl s_client -connect example.com:443 -servername example.com < /dev/null

# 2) 把链上第一张（叶子证书）存下来
openssl s_client -connect example.com:443 -servername example.com \
  < /dev/null 2>/dev/null | openssl x509 > leaf.pem

# 3) 读它：签发者、有效期、SAN、公钥算法
openssl x509 -in leaf.pem -noout -subject -issuer -dates
openssl x509 -in leaf.pem -noout -ext subjectAltName
openssl x509 -in leaf.pem -noout -text | grep -A2 "Public Key"

# 4) 用本机信任库离线验证这张证书（链不完整这里就会现形）
openssl verify leaf.pem
```

观察清单：

1. 第 1 步输出里 `verify return:1` 出现了几次？证书链带回了几张（`depth` 数字）？
2. `-dates` 里的 `notAfter` 距今几天？（Let's Encrypt 类证书 90 天，续费自动化没配好就会在这里出事）
3. SAN 列表是否覆盖你要访问的每个子域？
4. 密码套件是 TLS 1.3 还是 1.2？若对方只支持 1.2，检查是否还在提供 RSA 密钥交换套件，应关停。

## 本章小结

- TLS 用三件武器对应三种威胁：对称加密防窃听、AEAD 防篡改、证书链防冒充，缺一不可
- 握手本质是「非对称打底、对称干活」：(EC)DHE 临时密钥协商出会话密钥并保证前向保密，证书公钥只负责认证身份
- 1.3 把 2-RTT 压到 1-RTT（复用 0-RTT），并淘汰 RSA 密钥交换与 CBC 等旧算法；0-RTT 数据不防重放，只能放幂等请求
- 排错三板斧：`openssl s_client` 看链、`x509` 读 SAN 与有效期、HSTS 堵住首次降级；校验失败先怀疑中间证书缺失和系统时钟
