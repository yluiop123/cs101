---
title: "第 6 章 · 输入输出与中断"
description: "在 Linux 眼里，一切外设都被抽象成一个可以 open/read/write/close/ioctl 的文件。应用不需要知道网卡型号或磁盘是 SSD 还是机械盘，它只面对同一套系统调用；把请求翻译成设备能听懂的指令，是驱动（driv…"
series: os
sidebar:
  order: 6
  label: "输入输出与中断"
difficulty: advanced
duration: 9
---

**本章目标：**

- 说清一次 `read()` 从系统调用到磁盘返回的完整路径，理解驱动、中断、DMA 各自做了什么
- 分得清同步/异步与阻塞/非阻塞这两对正交概念，不再混用
- 能解释缓冲与刷新时机，并判断何时该用 `sendfile` 这类零拷贝接口

## 6.1 设备与驱动抽象

在 Linux 眼里，一切外设都被抽象成一个可以 `open`/`read`/`write`/`close`/`ioctl` 的文件。应用不需要知道网卡型号或磁盘是 SSD 还是机械盘，它只面对同一套系统调用；把请求翻译成设备能听懂的指令，是**驱动**（driver）的活。

```text
应用          read(fd, buf, n)
   │ 系统调用陷入内核
VFS 层        统一的文件抽象，分发到具体文件系统 / 设备节点
   │
通用块层       把逻辑请求排队、合并、拆分
   │
设备驱动       把请求翻译成 SCSI / NVMe / virtio 命令，交给硬件
   │
硬件           真正搬数据
```

字符设备（`/dev/tty`、`/dev/null`）按字节流访问，块设备（`/dev/sda`、`/dev/nvme0n1`）按固定大小的块随机访问。它们都以文件节点暴露，差别体现在能不能 `lseek`、有没有页缓存。控制类操作（设置波特率、查询容量、触发复位）走不进 `read`/`write` 的语义，统一塞进一个万能入口 `ioctl`：

```c
#include <sys/ioctl.h>

int fd = open("/dev/ttyS0", O_RDWR);
struct termios tio;
tcgetattr(fd, &tio);          // 底层也是 ioctl 的一种
// tcsetattr(fd, TCSANOW, &tio);   // 配置设备参数——ioctl 是"设备私有的系统调用"
```

`ioctl` 的第二个参数是设备自定义的请求码，因此它不可移植——这也是"能用 `read`/`write` 就别用 `ioctl`"这条经验的由来。

:::tip[看设备到底挂在哪]

```bash
ls -l /dev/sda*              # 主/次设备号决定路由到哪个驱动
cat /proc/devices            # 已注册的字符设备与块设备 major 号
```
:::

## 6.2 中断与轮询的取舍

早期 CPU 只能反复查询设备状态寄存器——**轮询**（busy-waiting）。设备慢、CPU 快，轮询让 CPU 空转在无用比较上。现代做法是**中断**（interrupt）：设备完成动作后主动拉一根信号线，CPU 保存现场、跳进中断处理程序（ISR），处理完再回来继续原工作。

```text
轮询  CPU 主动问"好了吗？好了吗？" → 延迟低但烧 CPU
中断  设备好了喊一声 → 省 CPU 但每次有保存/恢复现场的固定开销
```

高频设备（万兆网卡每秒几十万个包）会让中断多到 CPU 全耗在进出中断上，于是有了折中方案：

- **中断合并**（interrupt coalescing）：攒够 N 个包或等满 T 微秒再触发一次中断，用一点延迟换吞吐。
- **NAPI / 轮询混合**：一次中断后切到轮询把积压包收干净，再回到中断等待。

`/proc/interrupts` 按"每行一个 IRQ、每列一个 CPU"给出累计计数，是判断中断分布的第一现场：

```bash
watch -n1 'grep -E "eth0|nvme" /proc/interrupts'
# 若某个网卡的计数几乎只涨在第一列（CPU0），说明中断没做多队列分散，
# 一个核在替所有核收包——常见于没开 RSS / irqbalance。
```

:::caution[中断不是免费的]
每个中断都有固定成本：保存寄存器、关闭同类中断、跑软中断（softirq）、唤醒被阻塞的进程。低负载设备用中断划算，超高负载场景"减少中断次数"往往比"降低单次延迟"更有效。反过来，硬实时场景（控制机械臂）宁可回到轮询，因为中断的响应时间受其他中断干扰、不确定。
:::

## 6.3 DMA 做了什么

在 DMA（Direct Memory Access，直接内存访问）出现前，磁盘到内存的每个字节都要 CPU 亲自搬运（PIO 模式），一次读几 KB 就能占满一个核心。**DMA 控制器**是一块专门干搬运的硬件：CPU 只需告诉它"从设备端口读 N 字节写到内存地址 X"，然后就可以去做别的事；搬运完成后设备再发一个中断通知"数据已就位"。

```c
// 概念模型：CPU 的活只剩"下命令"和"收结果"
dma_configure(src_port, dst_addr, len);  // 下发描述符
enable_irq(device_irq);                  // 打开该设备的中断
// ...CPU 转去执行别的进程...
// 中断到来说明 dst_addr 处已经躺着完整数据
```

DMA 让"等待数据"和"占用 CPU"解耦：I/O 越大越划算，这也是页缓存能高效填充实力的硬件前提——磁盘到页缓存那一跳全程不经过 CPU。现代 DMA 还支持**分散/聚集**（scatter-gather）：一个描述符链表告诉控制器"依次把这几段不连续内存当作一整块传"，省去应用侧先拼成连续缓冲再下发的拷贝。

:::tip[DMA 也带来一致性问题]
DMA 直接读写物理内存，绕过 CPU 缓存。若缓存里有一块脏数据正被 DMA 覆盖，就会读到旧值。内核用 `dma_map_*`/`dma_sync_*` 做缓存与设备的同步；应用层一般感受不到，但写设备驱动或 `O_DIRECT` 对齐内存时，"地址按块对齐"就是这条硬件约束的体现。
:::

## 6.4 同步 IO 与异步 IO 的真实含义

日常口语里的"异步"经常指"非阻塞"，但它们是两条正交的轴。区分它们只看一件事：**数据什么时候算准备好**。

```text
同步 IO  发起请求的线程要参与数据搬运，提交返回不代表数据就绪
异步 IO  内核把数据准备好后才通知你，通知一到数据立刻可用

POSIX AIO  aio_read(3)     Linux 用线程池模拟，并非真异步
libaio     io_submit(3)    面向 O_DIRECT 的真异步，但提交本身可能阻塞
io_uring   SQ/CQ 环形队列  当代统一的高性能异步接口，读写/网络/文件一处搞定
```

一个常见误解：`io_submit` 返回了就等于读写完成。真实情况是——同步阻塞 `read` 会睡到数据就绪；而 `io_submit` 只是"下单"，你还要去 `io_getevents` 收"完成事件"才知道数据落地。

```c
// libaio 的最小异步读骨架（头文件 <libaio.h>，链接 -laio）
struct io_event ev;
io_submit(ctx, 1, &iocb);          // 提交，不代表数据就绪
io_getevents(ctx, 1, 1, &ev, NULL);// 阻塞等到该项完成
```

`io_uring` 用一对共享内存的环形队列（提交队列 SQ、完成队列 CQ）把"提交"和"收割"都做成批量操作，绝大多数请求能免系统调用完成，是当前高并发存储/网络栈的首选。

:::danger["异步"不等于"更快"]
异步 IO 省的是**线程**，不是**磁盘时间**。慢盘不会因为换接口变快，它只是让你的服务不必为一个未完成请求独占一个线程。若瓶颈是磁盘本身，加异步只会让排队更深、尾延迟更长。
:::

## 6.5 阻塞与非阻塞读写的行为差异

`O_NONBLOCK` 改变的是"当数据暂时不可用时系统调用怎么反应"。

```c
// 阻塞读：没数据就睡，直到有数据或被信号打断
ssize_t n = read(fd, buf, sizeof buf);      // 返回 >0，或 -1/EINTR

// 非阻塞读：没数据立刻返回 -1，errno 置 EAGAIN / EWOULDBLOCK
int fd = open(path, O_RDONLY | O_NONBLOCK);
ssize_t n = read(fd, buf, sizeof buf);
if (n < 0 && (errno == EAGAIN || errno == EWOULDBLOCK)) {
    // 此刻无数据，稍后用 poll/epoll 等它可读，别忙循环重试
}
```

还要注意三种边界：`read` 返回 `0` 表示对端关闭 / 文件到末尾（EOF），不是错误；返回值小于请求字节数是**部分读写**，循环里要累加偏移；`write` 到满了的管道同样返回 `-1` 且 `errno` 为 `EAGAIN`。非阻塞单独用容易退化成忙轮询，真正的价值在于配合就绪事件：`poll`/`select`/`epoll` 把线程挂起在"等一组 fd 中任意一个可读"上，可读再调用非阻塞 `read` 一次读干净。

```c
// 错写法：非阻塞 + 空转重试，CPU 拉满
while (read(fd, buf, sizeof buf) < 0 && errno == EAGAIN) { /* 空转 */ }

// 正确写法：非阻塞 + epoll 等待可读，醒来再读到 EAGAIN 为止
```

## 6.6 零拷贝与缓冲刷新时机

传统"读文件再发到 socket"要经历四次拷贝（磁盘→内核缓冲→用户缓冲→socket 缓冲→网卡）。**零拷贝**接口的目标是砍掉用户态这一来一回：

```text
sendfile(out_fd, in_fd, &off, count)  内核直接把页缓存数据送到 socket，不过用户态
splice(in_fd, ..., out_fd, ...)       通过 pipe 在两个 fd 间搬页，同样不落用户态
tee(in, out, len, 0)                  不搬数据，只在两条 pipe 间复制引用
mmap + write                          省一次拷贝，但缺页仍有额外成本
```

适合静态文件服务器、转发网关这类"数据不改只是搬运"的场景；一旦你要在用户态修改内容，零拷贝就失去了意义。要绕过页缓存直接走 DMA 到用户缓冲，用 `O_DIRECT`（要求缓冲区与长度按块对齐），数据库常用它自己做缓存管理。

另一条容易踩的线是**缓冲与刷新**。C 运行库默认对流做用户态缓冲，页缓存则在内核态延迟回写：

```c
FILE *f = fopen("log.txt", "w");
fprintf(f, "event\n");     // 进了 libc 用户缓冲，可能还没到内核
fflush(f);                 // 刷进内核页缓存
fsync(fileno(f));          // 强制落盘，返回即持久（慢，别滥用）
// fflush 只保证到内核，进程崩溃时内核页缓存还在；断电才需要 fsync/sync。
```

:::caution[程序没崩日志却没写出来]
十有八九是缓冲。`stdout` 连终端时是行缓冲，重定向到文件时变成全缓冲——`printf` 看似执行了，数据其实卡在 libc 里没 `fflush`。调试时加 `setvbuf(stdout, NULL, _IONBF, 0)` 关缓冲，或及时 `fflush(stdout)`。
:::

## 6.7 综合练习：一条读请求的体检

给定一段"读文件发到 socket 很慢"的直觉描述，请分层归因：

1. 设备与驱动视角：确认它是块设备还是字符设备，`cat /proc/interrupts` 里对应设备的计数是否集中在单核。
2. DMA 视角：`dd if=/dev/zero of=test bs=1M count=1024 conv=fdatasync` 测裸写带宽，判断瓶颈在磁盘还是 CPU。
3. 接口视角：只是搬运不改内容，把"read 再 write"换成 `sendfile`；海量并发小请求，评估切到 `io_uring`。
4. 缓冲视角：核对是否真的需要 `fsync`，还是页缓存回写足矣。

对照结论：延迟高看中断/轮询策略与排队；吞吐低看 DMA 与磁盘本身；CPU 高但吞吐低看是否在做多余拷贝（改零拷贝）；数据"丢了"多半是没刷新。把四把尺子分别落到 6.1–6.6 的每一层，定位就有章可循。并发下的锁与竞态请转到 [第 7 章 · 并发与锁](./07-concurrency-locks/)，这些手段如何量化见 [第 10 章 · 性能观测](./10-performance-observability/)。

下面给一段把本章要点串起来的骨架，作为练习的参考答案起点：

```c
// 非阻塞 accept + 读到 EAGAIN 为止 + 用 sendfile 直接转发文件内容
int cli = accept4(lfd, NULL, NULL, SOCK_NONBLOCK);
while (1) {
    ssize_t r = recv(cli, buf, sizeof buf, MSG_DONTWAIT);
    if (r < 0) { if (errno == EAGAIN) break; else handle_err(); }
    else if (r == 0) { close(cli); break; }        // EOF：对端关闭
    else process(buf, r);
}
off_t off = 0;
sendfile(cli, file_fd, &off, remain);              // 纯转发走零拷贝
```

## 本章小结

- 设备被抽象成可 `read`/`write` 的文件，驱动负责翻译；中断用固定开销换 CPU 空闲，高频设备靠中断合并与轮询混合找回平衡
- DMA 让搬运脱离 CPU，"等待 I/O"与"占用 CPU"解耦，这是页缓存高效工作的硬件前提
- 同步/异步看"数据何时就绪"，阻塞/非阻塞看"暂不可用时的反应"，两轴正交；异步省的是线程不是磁盘时间
- `sendfile`/`splice` 适合纯搬运的零拷贝；日志"丢失"多是 libc 用户态缓冲未 `fflush`，断电持久才需要 `fsync`
