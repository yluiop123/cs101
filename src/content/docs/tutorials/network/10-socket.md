---
title: "第 10 章 · 网络编程：从 socket 到 epoll"
description: "Unix 的答案是把网络塞进它最成熟抽象：一切皆文件。一次 TCP 连接、一个监听端口，都是一个整数 fd，读写用和文件一样的 read/write/close。"
series: network
sidebar:
  order: 10
  label: "网络编程：从 socket 到 epoll"
difficulty: intermediate
duration: 7
---

**本章目标：**

- 把「socket 是一个文件描述符」落到实处，能独立写出 TCP 服务端与客户端最小实现
- 理解 TCP 字节流为什么产生粘包/半包，并用长度前缀协议给出边界
- 说清阻塞/非阻塞与 select/poll/epoll 的差别，解释 epoll 为什么能扛十万连接

## 10.1 socket 抽象与文件描述符

Unix 的答案是把网络塞进它最成熟抽象：**一切皆文件**。一次 TCP 连接、一个监听端口，都是一个整数 fd，读写用和文件一样的 `read/write/close`。

```python
import socket

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
#        地址族 IPv4 ─┘        类型：SOCK_STREAM=TCP / SOCK_DGRAM=UDP
```

四类系统调用把 fd 变成服务或连接：

```text
服务端:  socket() → bind(地址,端口) → listen(backlog) → accept() ─► 返回新连接的 fd
客户端:  socket() → connect(服务端地址)                          ─► 直接可读写
读写:    send/recv（TCP）  sendto/recvfrom（UDP 带地址）
关闭:    close()；shutdown() 可只关读或写方向（半关闭，见 10.3）
```

关键心智模型：**`accept` 返回的是另一个 fd**。监听 fd 只负责排队接客，每个已建立的连接各自一个 fd——「一个服务器同时有几万个连接」物理上就是「进程持有几万个连接 fd」。这也是[第 9 章 · 抓包与网络排障实战](../09-debug-toolkit/)的 `ss` 里看到大量 ESTAB 时，它们分散在不同 fd 上的原因。

:::tip[fd 的上限是真实的墙]
每个进程默认 fd 上限常见 1024（`ulimit -n` 查看调整）。第 1 万条连接如果 accept 返回 -1 报 Too many open files，先调上限再怪代码——这是 C10K 的第一关（10.6）。
:::

## 10.2 TCP 服务端最小实现

一个能跑的 echo 服务器，注意每一行的语义：

```python
import socket

srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)   # 重启即 bind，跳过 TIME_WAIT
srv.bind(("0.0.0.0", 9000))        # 绑全网卡；绑 "127.0.0.1" 就只有本机能连（第 9 章的坑）
srv.listen(128)                    # backlog：已完成握手等待 accept 的队列长度
print("listening on 9000")

conn, addr = srv.accept()          # 没客人时在这里睡着（阻塞）
while True:
    data = conn.recv(4096)         # 阻塞直到有字节可读
    if not data:                  # 收到 EOF：对端正常关闭
        break
    conn.sendall(b"echo:" + data) # sendall：内部循环直到全部发完
conn.close()
```

`send` 与 `sendall` 的区别是新手最容易忽略的：`send` 允许**部分写**——内核缓冲区满时只塞进去一半，返回实际字节数；`sendall` 帮你循环补发。单发一条消息务必 `sendall`（10.4 会看到 recv 侧的镜像问题）。

## 10.3 客户端、粘包与消息边界

客户端侧：

```python
cli = socket.create_connection(("127.0.0.1", 9000), timeout=3)
cli.sendall(b"first")
cli.sendall(b"second")
print(cli.recv(1024))     # 可能一次收到 b'echo:firstecho:second'
cli.close()
```

连发两条消息，对端可能一次收到「粘在一起」的结果。**这不是 bug，是 TCP 的定义**：它承诺的是「按序、完整、不重复的字节流」，从不承诺「你 send 几次，对端 recv 几次」。`send` 可能被合并（Nagle 算法）、被拆分（超过 MSS/窗口），对端 `recv` 更不可能替你知道消息边界。

UDP 相反：报文边界天然保留，但可能丢、可能乱。要边界，就得自己在 TCP 上定义**应用层协议**。工程上三种写法，从错到对：

```text
错：靠 recv 返回值 = 一次 send —— 协议里根本没有这个保证，偶发必炸
错：定长消息 —— 浪费带宽，超长还得再拆，字段数一变全链路遭殃
对：分隔符（一行一条，如 HTTP 头部）或长度前缀（4 字节大端 + 消息体）
```

长度前缀的收发对，`struct` 打包头：

```python
import socket, struct

def send_msg(conn, payload: bytes):
    conn.sendall(struct.pack("!I", len(payload)) + payload)   # !I = 网络字节序 4 字节无符号整数

def recv_exact(conn, n: int) -> bytes:
    buf = bytearray()
    while len(buf) < n:                 # 半包时继续补读——recv_exact 是一切边界协议的基石
        chunk = conn.recv(n - len(buf))
        if not chunk:
            raise ConnectionError("对端提前关闭")
        buf.extend(chunk)
    return bytes(buf)

def recv_msg(conn) -> bytes:
    (length,) = struct.unpack("!I", recv_exact(conn, 4))
    return recv_exact(conn, length)
```

:::caution[shutdown 与 close 不是一回事]
`close(fd)` 直接全关；想「我说完了但还能听你说」时要用 `conn.shutdown(socket.SHUT_WR)` 先发 FIN 半边关闭——做「请求-响应后由发送方先关」类协议时，半关闭是给对方留确认窗口的手段，也是 `CLOSE-WAIT` 堆积类故障（[第 9 章 · 抓包与网络排障实战](../09-debug-toolkit/)）的解药。
:::

## 10.4 阻塞与非阻塞

默认所有 socket 都是阻塞的：`accept`/`recv` 没东西就睡着。这在单连接演示里没问题，一个服务几百连接时线程全睡死在这些调用上。改成非阻塞：

```python
conn.setblocking(False)          # 或 settimeout(5.0)：等，但有上限——生产更常用这个
try:
    data = conn.recv(4096)
except BlockingIOError:          # 内核说：现在没数据，你自己看着办
    data = b""
```

非阻塞之后，`recv` 立即返回「有数据」或「暂无」。但裸轮询空转烧 CPU，正确姿势是「**问内核：哪些 fd 现在可读？**」——这就是下一节的 I/O 多路复用。Python 的 `selectors` 标准库就是这个问题的跨平台封装（Linux 上底层自动走 epoll）：

```python
import selectors
sel = selectors.DefaultSelector()
sel.register(srv, selectors.EVENT_READ, data="listener")   # 每个 fd 挂一个关注事件
```

:::tip[阻塞/非阻塞 × 同步/异步 别混]
本章全部是「同步 I/O」：线程仍然要亲自调 recv 把数据拷走，非阻塞+多路复用只是让它**不白等**。真正的异步 I/O（Linux 的 io_uring、Windows 的 IOCP）连拷贝都交给内核完成，这里不展开——面试口诀：非阻塞是「不等」，异步是「不做」。
:::

## 10.5 select / poll / epoll：为什么 epoll 快

三代多路复用的差别一张表：

```text
           select                     poll                    epoll
fd 上限    FD_SETSIZE（常见 1024）     无硬上限               无硬上限
数据结构   位图，每次全量传入传出       数组，同样全量          内核红黑树存注册表 + 就绪链表
每次调用   拷贝全部 fd + 内核 O(n) 扫描  同上                  只拷就绪的：O(就绪数)
返回信息   只知道"可读"               同左                   EPOLLIN/OUT/ERR/HUP 细分事件
```

`epoll` 三个函数各司其职：

```text
epoll_create1()            建一个 epoll 实例（自己也是个 fd）
epoll_ctl(ADD/MOD/DEL, fd) 注册/修改/摘除要关注的连接 —— 一次性成本，不用每次重复
epoll_wait()               睡 here，直到有就绪事件，返回「哪些 fd、什么事件」
```

它快的本质两点：**注册与等待分离**（fd 集合不随每次调用重复拷贝）、**回调式就绪队列**（新数据到达时内核把 fd 挂进就绪链表，`epoll_wait` 只摘链表——十万连接里通常只有几百个活跃，代价正比于活跃数而非总数）。

还有一个必须懂的行为差异：

```text
水平触发 LT（默认）：  fd 还有数据没读完，下次 epoll_wait 继续通知 —— 安全，可以慢慢读
边缘触发 ET（EPOLLET）：只在状态"跳变"瞬间通知一次 —— 必须一次读到 BlockingIOError 为止，
                       漏读半截就永远不再提醒；性能略好、写错概率高
```

Python 里对比感受一下封装层：

```python
import selectors
evts = sel.select(timeout=1)          # 阻塞直到有事件或超时
for key, mask in evts:
    if key.data == "listener":
        conn, _ = key.fileobj.accept()
        sel.register(conn, selectors.EVENT_READ)
    else:
        handle_conn(key.fileobj)      # 非阻塞 recv + 10.3 的收包框架
```

## 10.6 线程模型一句话，与 C10K → C10M

服务端并发模型按「一个连接谁来管」分类：

```text
thread-per-connection   每连接一条线程，线程内阻塞 —— 十万线程时内存与调度双爆（Java 老 servlet 容器）
reactor 事件循环         单线程 epoll_wait + 非阻塞读写，回调派活 —— Node/Redis 的形态
主从 reactor            一组事件循环各带一个 epoll，监听 fd 分发连接、工作线程跑业务 —— Netty 的 BossGroup/WorkerGroup
```

一句话总结：**阻塞模型用线程数换并发度，reactor 用事件循环换；现代框架基本是「事件循环收数据 + 线程池跑业务」的混合。**

C10K（单进程一万连接）当年卡在哪：fd 上限、内存（每连接收发缓冲 + 线程栈）、accept 惊群、以及 select 的 O(n)。epoll + 调大 fd 上限 + 单线程事件循环后，C10K 在 2000 年代就是「配置问题」。到 C10M 时瓶颈移到了更深的层：**内核每包的中断、协议栈拷贝与 socket 锁**——解法方向是网卡多队列 RSS 分流、CPU 亲和绑核、DPDK/kernel-bypass 让用户态直接收包、零拷贝（sendfile）与连接复用（呼应第 6 章 keep-alive）。层级越深，越不是「换个模型」而是「重排整条路径」。

## 10.7 综合练习：写一个长度前缀的并发 echo 服务器

把本章零件拼成完整程序：服务端用 `selectors` 接受多客户端，每个连接按 10.3 的长度前缀协议收消息、原样回一条 `echo:` 消息，客户端脚本连发 3 条验证不粘包。

```python
# client.py —— 验证脚本
import socket, struct

c = socket.create_connection(("127.0.0.1", 9000))
for i in range(3):
    msg = f"hello-{i}".encode()
    c.sendall(struct.pack("!I", len(msg)) + msg)
print("all sent")
```

自查要点：

1. 服务端 accept 出的新 fd 有没有 `setblocking(False)`？忘了它会退化回串行。
2. `recv` 返回空字节时是否注销该 fd 并 close？漏关就是 [第 9 章](../09-debug-toolkit/)里 CLOSE-WAIT 堆积的源头。
3. 半包：客户端把一条消息分两次 send，服务端能否正确拼回？用 `recv_exact` 的循环验证。
4. 用 `ss -tulnp | grep 9000` 确认监听，再用两个终端同时连——两台都能收到回显才算并发成立。

## 本章小结

- socket 即 fd：监听 fd 只管 accept 出新连接 fd，一个服务器的并发规模物理上就是它的 fd 数量，先过 `ulimit -n` 这道关
- TCP 是字节流，边界必须自己定义：长度前缀 + `recv_exact` 循环补读是最通用的做法，`sendall` 保证发全、半关闭 `shutdown` 留给协议收尾
- 非阻塞让调用立即返回「暂无」，多路复用让内核告诉你「谁可读写」；epoll 靠注册与等待分离 + 就绪链表把成本降到 O(活跃连接数)，ET 模式性能略好但必须读到空
- 线程模型：每连接一线程靠堆人，reactor 靠事件循环，现代框架混合使用；C10K 靠 epoll 解决，C10M 要动内核路径——中断、拷贝、锁三座山
