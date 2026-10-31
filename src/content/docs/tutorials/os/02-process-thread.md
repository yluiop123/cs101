---
title: "进程与线程"
description: "「程序」是磁盘上那个 ELF 文件，「进程」是内核为它建立的一套运行实例。一个进程同时具备三样东西，缺一不可："
series: os
sidebar:
  order: 2
  label: "进程与线程"
difficulty: advanced
duration: 9
tableOfContents: true
---

**本章目标：**

- 画出 Linux 进程地址空间的布局，并能用 `/proc` 验证每一段的存在
- 讲清 `fork`/`exec`/`wait` 各自的职责，以及写时复制为什么让 `fork` 变便宜
- 说清线程共享什么、上下文切换贵在哪，并能制造与回收僵尸进程

## 进程 = 地址空间 + 执行流 + 资源账本

「程序」是磁盘上那个 ELF 文件，「进程」是内核为它建立的一套运行实例。一个进程同时具备三样东西，缺一不可：

```text
地址空间   一段属于它的虚拟内存（代码、数据、堆、栈），别人看不见也改不了
执行流     一条 CPU 上的指令序列（PC + 寄存器 + 内核栈），可以被调度走再调度回
资源账本   已打开的 fd 表、信号处理方式、uid/gid、限额、记账用的 CPU 时间
```

关键在第三项：进程是内核**记账**的单位。为什么需要记账？因为机器上同时跑着上百个执行流，出问题的必须能定位到人，超预算的必须能拦住 —— 这两件事都靠账本。

Linux 里进程与线程的区分比教科书更模糊：内核只有一种东西叫 **task**（`task_struct`），每个线程一个 task；所谓「进程」只是共享同一份地址空间的一组 task（线程组）。

再看这条「账本」最核心的资产 —— 地址空间。x86-64 Linux 的用户态地址空间是高 16 位全 0 的那一半（48 位虚拟地址，5 级页表下可扩展），低地址放代码、高地址放栈，中间留着一大片空洞给映射：

```text
高地址  ┌──────────────────────────────┐
        │  内核空间（用户态不可见）      │  每个页表都映射它，但用户态无权访问
        ├──────────────────────────────┤
        │  [栈] 环境变量、参数、局部变量 │  向下生长，默认上限 8 MB
        │         ↓                    │
        │  [mmap 区] 动态库、大 malloc  │  线程栈也在这里
        │         ↓                    │
        │  [堆]  brk / 小对象 malloc    │  向上生长
        │  .bss   未初始化全局/静态变量  │  不占磁盘文件
        │  .data  已初始化全局/静态变量  │
        │  .text  机器指令（只读可执行） │
低地址  └──────────────────────────────┘
```

这不是画出来的理想图，机器上就能直接看：

```bash
cat /proc/self/maps | head -20     # 每行一段映射：地址范围 权限 偏移 设备 inode 路径
ulimit -s                          # 栈的软限制（单位 KB）
getconf PAGESIZE                   # 页大小，x86-64 通常是 4096
```

`maps` 里最有信息量的是**权限列**：代码段是 `r-xp`（可执行不可写），只读数据是 `r--p`，堆栈是 `rw-p`。向 `.text` 写一个字节立刻 `SIGSEGV` —— 这就是进程隔离在内存维度的最小体现（页表机制见 [第 4 章 · 内存管理与虚拟内存](../04-memory/)）。

:::caution[别用进程地址当共享内存]
两个进程里 `0x7f8a1c000000` 是**各自**的虚拟地址，指向不同的物理页。跨进程传数据必须走显式通道：管道、socket、共享内存段，或者干脆用线程。
:::

## PCB：内核怎么记住一个进程

进程控制块（PCB）在 Linux 里就是 `task_struct`，一个几百字段的结构体，主要成员可以归为五组：

```text
标识与状态   pid、线程组 id、state（RUNNING/SLEEPING/STOPPED/ZOMBIE）、退出码
内存         mm_struct：页表基址 CR3、各段边界、缺页统计
文件         files_struct（fd → file 对象的数组）、fs_struct（cwd、root）
信号         sigpending、已注册的处理函数表
调度         调度类指针、优先级、权重、绑核掩码、累计运行时间（[第 3 章 · CPU 调度](../03-cpu-scheduling/) 细讲）
```

`/proc` 就是这些字段的只读导出，`status` 里的 `Threads:` 也说明「进程」与「线程」在 Linux 里只是同一批 task 的两种看法：

```bash
cat /proc/1/status   # State/Uid/Threads/VmRSS 等，对应 PCB 各字段
cat /proc/1/stat     # 空格分隔的原始字段，第 3 个是状态字符
ls  /proc/1/fd       # files_struct；ls /proc/1/task 列出全部线程
```

`status` 里的 `VmRSS` 是**当前**驻留物理内存的量，不等于分配量（原因见 2.4 与 [第 4 章 · 内存管理与虚拟内存](../04-memory/)）。

## fork、exec、wait：Unix 造进程的三步

Unix 把「启动一个程序」拆成两个正交动作，这是它最漂亮的设计之一：

```text
fork()   复制当前进程，得到父子两份，返回后从同一行代码继续跑
         父进程拿到子进程 pid；子进程拿到 0；失败返回 -1
exec*()  不换进程，换「内容」：把当前地址空间整个丢掉，装入新程序
         成功后不返回；失败才返回 -1（新程序继承了原来的 fd）
wait*()  父进程取回子进程的退出状态，同时释放 PCB 里剩下的那点记录
```

为什么要拆成两步？因为中间那段空隙是**给父进程留的定制窗口**：重定向一个 fd、关掉某个 fd、改工作目录、设置信号掩码 —— 全都在子进程里几行代码搞定，不需要为每种启动需求设计一个参数繁多的 API。

```c
/* spawn.c —— 用 fork+exec 启动 ls，并等它结束 */
#include <stdio.h>
#include <stdlib.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    pid_t pid = fork();
    if (pid < 0) { perror("fork"); return 1; }      /* 先判失败：此刻父子都不存在 */
    if (pid == 0) {                                 /* 子进程：这一份只用来变成新程序 */
        char *argv[] = { "ls", "-l", "/etc/hostname", NULL };
        execvp(argv[0], argv);                      /* 成功则不再往下执行 */
        perror("execvp");                           /* 只有失败才会走到这里 */
        _exit(127);                                 /* 是 _exit，不是 exit，见下 */
    }
    int status;
    if (waitpid(pid, &status, 0) < 0) { perror("waitpid"); return 1; }
    if (WIFEXITED(status))   printf("exited %d\n", WEXITSTATUS(status));
    else if (WIFSIGNALED(status)) printf("killed by %d\n", WTERMSIG(status));
    return 0;
}
```

**错误写法 → 正确写法**（本章最值钱的一条）：

```c
/* 错误：把「不是失败」当成「我是子进程」 */
if (fork() != -1) { child_main(); }   /* 父进程返回值是正数，条件同样成立 */
/* 正确：只用 == 0 与 > 0 三个分支判身份，并且先判失败 */
pid_t pid = fork();
if (pid < 0) { perror("fork"); return 1; }
if (pid == 0) { child_main(); _exit(0); }   /* 子进程用 _exit，不用 exit */
waitpid(pid, &st, 0);                        /* 父进程必须回收，否则攒僵尸 */
```

三个坑各对应一类故障：分支写反 → 「同一请求被处理两次」；`exec` 失败后调 `exit` → stdio 缓冲被冲刷两遍，日志出现重复行；不 `wait` → 子进程记录堆积到 `fork` 报错。另外，fork 再 exec 会白白复制一份页表，多线程大进程里 fork 还可能让子进程继承一把没释放的锁 —— 只想跑个子进程时优先用 `posix_spawn`（见 `man 3 posix_spawn`）。

## 写时复制：fork 为什么便宜

朴素实现里 fork 要复制整个地址空间，1 GB 内存就得搬 1 GB —— 但子进程接下来通常立刻 `exec` 把这一切丢掉。Linux 的做法是**只复制页表，不复制数据**：

```text
fork 后     父子页表都指向同一批物理页，页表项标记为「只读」+ COW 位
子进程写    CPU 触发缺页 → 内核发现是 COW 页 → 复制这一页、改写映射、恢复可写
之后        父子各有一份独立物理页；没被写的页始终共享
```

代价按「实际写入的页」计，而不是按地址空间大小计 —— 这就是 `fork` 一个几 GB 的进程只需微秒级、以及 `VmRSS` 会在子进程写入后悄悄上涨的原因。用 `cat /proc/self/smaps_rollup | grep -E 'Rss|Private|Shared'` 能直接看到共享页与私有页的分布（字段名随内核版本略有差异，以实测为准）。

```python
import os, resource
big = bytearray(256 * 1024 * 1024)              # 256 MB 已写入的匿名页
if os.fork() == 0:
    for i in range(0, len(big), 4096):           # 每页碰一下：256 MB 全部触发 COW
        big[i] = 1
    print("child peak RSS KB:", resource.getrusage(resource.RUSAGE_SELF).ru_maxrss)
    os._exit(0)
os.waitpid(-1, 0)
```

不写的那一版子进程 `ru_maxrss` 接近父进程（页共享，内核不计两遍），逐页写过的版本则接近父进程 + 256 MB。

:::caution[COW 的隐藏账单]
写时复制不是免费的：每个被写过的页要付一次缺页陷入 + 一次内存复制，密集写入时比预期慢得多。数据库这类「fork 之后父子都猛写」的程序通常用 `mmap` 共享段绕开（[第 4 章 · 内存管理与虚拟内存](../04-memory/)），或者干脆不 fork 而是 `posix_spawn`。
:::

## 线程共享什么、不共享什么

线程是「同一个地址空间里的第二条执行流」。共享与私有的划分决定了并发 bug 的形状：

```text
共享（一个进程内所有线程同一份）        私有（每线程一份）
────────────────────────────────      ─────────────────────────
地址空间 / 页表                        栈（局部变量）+ 寄存器组 + 程序计数器
文件描述符表（files_struct）           线程本地存储 TLS、errno
工作目录与 umask                       信号掩码（阻塞哪些信号）
信号处理方式                           调度身份（tid）、优先级/affinity
进程的 uid/gid、资源限额               自己的内核栈与调度实体
```

由此得出三条实践结论：

1. **一个线程 `close(fd)`，所有线程的同一个 fd 都失效** —— fd 表是共享的。多线程程序里 `open` 与 `read` 之间有竞态（[第 5 章 · 文件系统](../05-filesystem/) 细讲）。
2. **地址空间共享 = 竞态免费赠送**。不需要任何 IPC 就能互相踩数据，这正是快所在，也是危险所在（[第 7 章 · 并发与锁](../07-concurrency-locks/)）。
3. **改一次 cwd 全局生效**。用 `chdir` 拼路径的库在线程下会突然读错文件，改用绝对路径或 `openat`。

Linux 的线程创建走 `clone`/`pthread_create`，共享哪些资源由标志位精确控制：

```c
#include <pthread.h>
int counter = 0;                                     /* .data 段：两线程共享同一份 */
void *work(void *arg) {
    for (int i = 0; i < 100000; i++) counter++;       /* 无同步：结果可能小于 200000 */
    return NULL;
}
/* main：pthread_create 起一个线程跑 work，主线程自己同样加 10 万次，再 pthread_join */
/* 打印的 counter 几乎总是小于 200000 —— 竞态如何破坏加法：第 7 章 */
```

:::tip[协程与线程的差别，一句话]
线程的切换由**内核**决定并在内核态完成（要换调度实体、可能换地址空间），协程的切换由**用户态运行时代码**在明确的点上完成（只保存少量寄存器，不进内核）—— 所以协程便宜但有「一处阻塞全部停摆」的风险，线程贵但能被内核抢占。
:::

## 上下文切换的代价、僵尸与孤儿

一次「进程 A → 进程 B」的切换到底做了什么：

```text
1. 保存 A 的寄存器到 A 的内核栈            ← 纯硬件成本，很小
2. 调度器决定下一个跑谁                    ← 成本随可运行任务数变化（见第 3 章）
3. 切 CR3 到 B 的页表                      ← TLB 里的 A 项作废（PCID/ASID 可缓解）
4. 进入 B 后：冷缓存、冷分支预测、冷页表项  ← 真正的隐性成本，可达几十微秒
```

**线程切换**省掉第 3 步（同进程页表不变），因此明显便宜；**系统调用**只付第 1、4 步的一部分，但频率可能高得多。测量：

```bash
perf stat -e context-switches,cpu-migrations ./my_app  # 切换与迁移次数：cs/vcsw 每秒几十万而吞吐不涨 → 大概率是锁或频繁系统调用
pidstat -w -p $$ 1                                     # 每进程每秒内核/用户切换次数
cat /proc/pressure/{cpu,memory,io}                     # PSI（需内核 CONFIG_PSI）：avg10 stall 明显 > 0 → 该资源已在排队
```

最后两种「非正常状态」的进程，是运维现场的常客：

```text
僵尸（zombie, STAT=Z）  子进程已退出，父进程还没 wait —— 只剩 PCB 与退出码，不占 CPU 不占内存
孤儿（orphan）          父进程先退了 —— 子进程被过继给 init/systemd 或最近的 subreaper，
                        由它负责回收，所以不会永久僵尸
```

:::caution[僵尸杀不掉，也杀不得]
`kill -9` 对一个 `Z` 状态进程无效：它已经死了，留着记录只为等人来取退出码。真正该处理的是它的**父进程** —— 要么补上 `wait`，要么让父进程退出（记录随 PCB 一起消失，子进程被过继）。大量僵尸堆积会耗尽 pid 与进程表槽位，表现为 `fork: Resource temporarily unavailable`。
:::

## 综合练习：制造一个僵尸并把它收掉

```python
# zombie.py —— 亲手造一个僵尸，再从 /proc 里指认它
import os, time

pid = os.fork()
if pid == 0:
    os._exit(0)                     # 子进程立刻退出，退出码没人取 → 僵尸
print("parent pid:", os.getpid(), "child pid:", pid, flush=True)
time.sleep(60)                      # 父进程故意不 wait
```

```bash
python3 zombie.py &
sleep 1
ps -eo pid,ppid,stat,comm | awk '$3 ~ /Z/ {print}'        # 找出所有僵尸及其父 pid
cat /proc/子pid/status | grep -E 'State|PPid'              # 这里换成上一步打印的子 pid
```

按要求做完三步，并写出每步的预期与观察：

1. 把父进程的 `time.sleep(60)` 换成 `os.wait()`，僵尸是否消失？为什么？
2. 不改代码直接 `kill` 父进程 —— 子进程的记录去了哪里？（提示：再看 `PPid` 变成了什么）
3. 在第 2.3 节的 `spawn.c` 里注释掉 `waitpid` 那行重跑，观察 `Z`；再分别用 `signal(SIGCHLD, SIG_IGN)`（内核自动回收）与「注册一个只调 `waitpid(-1, &st, WNOHANG)` 的 SIGCHLD 处理函数」两种修法验证。

## 本章小结

- 进程 = 地址空间 + 执行流 + 资源账本；Linux 内核只有 task，「进程」是共享同一 `mm` 的一组 task
- `fork` 复制、`exec` 换内容、`wait` 收尾：两步分离给父进程留下定制 fd 与环境的窗口，子进程 `exec` 失败要用 `_exit`
- 写时复制让 `fork` 的代价按「写过的页」计；线程共享地址空间与 fd 表、私有栈与信号掩码，这是竞态的来源
- 上下文切换的真实成本在 TLB 与缓存冷启动，切页表那一步线程能省掉；僵尸是「退出码没人取」，只能由父进程解决
