---
title: "并发与锁"
description: "竞态条件（race condition）的定义很朴素：程序的正确性取决于多个线程谁先谁后，而这个顺序你不控制。最小复现就是“读-改-写”三步被别的线程插了队。"
series: os
sidebar:
  order: 7
  label: "并发与锁"
difficulty: advanced
duration: 7
tableOfContents: true
---

**本章目标：**

- 能亲手复现一个竞态条件，并解释它为什么"有时对有时错"
- 选对同步原语：互斥/自旋/读写/信号量/条件变量各自的适用边界
- 理解 CAS 与 ABA 的坑，能背出死锁的四个必要条件

## 竞态条件的最小复现

竞态条件（race condition）的定义很朴素：程序的正确性取决于多个线程谁先谁后，而这个顺序你不控制。最小复现就是"读-改-写"三步被别的线程插了队。

```c
#include <pthread.h>
#include <stdio.h>

long counter = 0;                       // 共享可变状态，没有任何保护

void *worker(void *arg) {
    for (int i = 0; i < 1000000; i++)
        counter++;                      // 不是原子操作：load / add / store 三步
    return NULL;
}

int main() {
    pthread_t a, b;
    pthread_create(&a, NULL, worker, NULL);
    pthread_create(&b, NULL, worker, NULL);
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("%ld\n", counter);           // 期望 2000000，实跑得 130 万、170 万……
}
```

`counter++` 编译成"取值、加一、写回"三条机器指令。两个线程同时读到同一个旧值，各自加一写回，就丢了一次。跑不满次数是常态，跑出满次数是运气——这正是竞态的可怕之处：**测试通过不代表没有 bug**。

:::caution[数据竞争 ≠ 竞态条件]
数据竞争（data race）指两个线程无同步地访问同一内存、至少一个在写，是**未定义行为**；竞态条件是更宽的结果错误。加了锁消除了数据竞争，仍可能有竞态——比如"检查余额再扣款"两步之间被别人插队。锁要保证的是**临界区**的逻辑完整，不只是单条指令不撕裂。
:::

## 原子性与内存序直觉

给 `counter++` 加锁当然行，但对一个自增来说太重。C11/C++11 提供**原子操作**：无锁但不可分割。

```c
#include <stdatomic.h>

atomic_long counter = 0;
atomic_fetch_add(&counter, 1);          // 或 counter++（原子类型上就是原子）
```

原子的"不可分割"只解决单个变量不撕裂。更隐蔽的是**可见性与顺序**：编译器与 CPU 都会重排指令，一个核写的数据另一个核未必立刻看到。原子操作带**内存序**（memory order）参数：

```text
memory_order_relaxed   只保证原子性，不管与其他读写的先后
memory_order_acquire   读：之后的操作不会被排到它前面（拿到锁语义）
memory_order_release   写：之前的操作不会被排到它后面（放锁语义）
memory_order_seq_cst   默认，全局单一顺序，最直观也最贵
```

直觉版：`release` 写锁、`acquire` 读锁配成对，能保证"我在锁之前写的所有数据，你在锁之后都看得见"。除非你在写无锁数据结构并反复测量，否则默认的 `seq_cst` 或直接用互斥锁更稳妥。

:::tip[顺序一致性够用就好]
一个常见误区是"为了性能把内存序全调成 `relaxed`"。绝大多数业务代码根本测不出差别，却极易引入只在某架构（弱内存序的 ARM 而非 x86）上复现的 bug。先用默认序或锁把逻辑写对，确实成为热点再逐处放宽，并用 `stdatomic` 的压力测试反复验证。
:::

## 互斥锁与自旋锁的适用边界

互斥锁（mutex）拿不到就**睡眠让出 CPU**；自旋锁（spinlock）拿不到就**原地空转死等**。区别在"等待时 CPU 干什么"。

```c
pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;
pthread_mutex_lock(&m);                 // 拿不到则阻塞（睡）
/* 临界区 */
pthread_mutex_unlock(&m);               // 未定义行为，务必成对
```

选择规则看**临界区时长**：

```text
临界区很短（几十纳秒，纯内存操作）  自旋更省：省掉睡/醒的上下文切换
临界区较长 / 内含系统调用或 IO        互斥更好：别霸着 CPU 空转
持锁时间不确定 / 可能睡眠             绝不能用自旋（内核态尤其致命）
```

自旋锁在内核态很常见（中断上下文不能睡，只能自旋）；用户态默认用互斥锁。glibc 提供 `pthread_spinlock_t`，但多数应用层代码不需要它。

:::tip[递归锁与错误配对]
普通互斥锁被同一线程二次 `lock` 会死锁（自己等自己）。若确实需要重入，用 `PTHREAD_MUTEX_RECURSIVE` 属性初始化，但要优先重构掉重入需求。`lock`/`unlock` 不配对或 `unlock` 别人的锁都是未定义行为。
:::

## 读写锁与信号量

**读写锁**（rwlock）允许"多个读者共享、写者独占"，适合读多写少的共享数据。

```c
pthread_rwlock_t rw = PTHREAD_RWLOCK_INITIALIZER;
pthread_rwlock_rdlock(&rw);             // 读者进（可并发）
pthread_rwlock_wrlock(&rw);             // 写者进（独占）
pthread_rwlock_unlock(&rw);
```

读写锁不是免费午餐：读者可能饿死写者（持续有读者进来，写者永远拿不到独占）。许多实现默认写者优先，但优先级策略以 `man 3 pthread_rwlock_init` 实测为准。读临界区极短时，读写锁的记账开销反而不如一把普通互斥锁——先测量再上读写锁。

**信号量**（semaphore）是一个带计数器的通行证，`P`（wait）减一、`V`（post）加一，计数为 0 时 `P` 阻塞。

```c
#include <semaphore.h>
sem_t s;
sem_init(&s, 0, 1);        // 初值 1，等价一把二值信号量 = 互斥锁
sem_wait(&s);              // P
sem_post(&s);              // V
```

信号量比互斥锁多两个能力：初值大于 1 可作**资源池限流**（比如最多 10 个并发下载）；`post` 与 `wait` 可以解耦在不同线程/进程调用，天然适合"生产者通知消费者"。互斥锁强调"谁锁的谁解"，信号量没有所有权概念，用错容易失控。

## 条件变量与虚假唤醒

条件变量（condvar）不保护数据，它让你"等待某个条件成立"，避免自己轮询。它必须和一把互斥锁配套。

```c
pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t  c = PTHREAD_COND_INITIALIZER;

// 消费者
pthread_mutex_lock(&m);
while (!ready)                        // 关键：while 不是 if
    pthread_cond_wait(&c, &m);        // 原子地"解锁并睡下"，醒来重新加锁
use();
pthread_mutex_unlock(&m);

// 生产者
pthread_mutex_lock(&m);
data = produce(); ready = 1;
pthread_mutex_unlock(&m);
pthread_cond_signal(&c);              // 唤醒一个等待者
```

`pthread_cond_wait` 内部做了三件事：释放锁、睡到被唤醒、醒来后重新抢锁。这就是为什么条件判断必须在**锁内**、且用 **while 循环**。

```c
// 错误写法：if 判断
if (!ready) pthread_cond_wait(&c, &m);   // 可能被"虚假唤醒"或因别的线程抢先消费
// 正确写法：while 判断，醒来后重新检查条件
while (!ready) pthread_cond_wait(&c, &m);
```

:::caution[虚假唤醒（spurious wakeup）]
即使没人 `signal`，`pthread_cond_wait` 也可能返回——POSIX 明确允许。多个等待者被一次 `signal`/`broadcast` 唤醒后，只有部分能满足条件，其余必须回到循环继续睡。因此判断条件永远用 `while`，绝不用 `if`，这是铁律。
:::

## 无锁结构与 CAS 的 ABA 问题

无锁数据结构靠 **CAS**（compare-and-swap，比较并交换）：只当前值等于预期才写入新值，否则重试。

```c
atomic_int head = NULL_INDEX;
int old = atomic_load(&head);
while (!atomic_compare_exchange_weak(&head, &old, new_node)) {
    // CAS 失败说明别人改了，old 被更新为最新值，继续重试
}
```

CAS 有个经典陷阱——**ABA 问题**：线程读到值为 A，准备 CAS "A→C"；期间另一个线程把它改成 B 又改回 A。CAS 看到值仍是 A，以为没人动过就成功，但中间那次改动可能已经让依赖它的逻辑失效（尤其在无锁链表里，节点被回收又复用到同一地址）。

应对手段：

- **带版本号的指针（tagged pointer）**：每次修改把计数加一，比较"值+计数"，ABA 变不成 A-B-A-B 的同计数。
- ** hazard pointer / epoch 回收**：延迟真正释放内存，保证没人还在引用时才回收。

:::danger[别在用户态 CAS 上随手回收内存]
ABA 之所以危险，本质是"地址被复用"。测试里 ABA 很少复现，因为需要极巧的时间窗；线上高并发一旦触发就是偶发、难查的内存错误。这是无锁代码比有锁更难写对的头号原因——能用互斥锁就别上无锁。
:::

## 综合练习：复现、加锁、并背出死锁四条件

1. 把 7.1 的 `counter++` 分别用「互斥锁」「`atomic_fetch_add`」两种方案改正确，各跑 5 次确认稳定输出 2000000。
2. 构造一个读多写少场景，对比「普通互斥锁」与「读写锁」的吞吐，体会"读临界区极短时读写锁未必更快"。
3. 用「互斥锁 + 条件变量」实现一个容量为 1 的有界队列，故意用 `if` 而非 `while` 观察问题，再改回 `while`。

作为收尾，把**死锁的四个必要条件**背熟（缺一即不会死锁，破坏任意一个即可预防）：

```text
互斥      资源一次只能被一个线程持有
持有并等待  持有一个资源的同时去申请另一个
不可剥夺  已拿到的锁不能被强行夺走，只能由持有者主动释放
循环等待  存在 T1→T2→…→T1 的环形等待链
```

本章只需知道这四条，破坏它们的工程手段（锁顺序、超时、银行家算法、futex 内核机制）在 [第 8 章 · 死锁与同步原语](../08-deadlock-sync/) 展开；性能视角下的锁竞争观测见 [第 10 章 · 性能观测](../10-performance-observability/)。

## 本章小结

- 竞态源于"读-改-写"被插队且不可复现；数据竞争是未定义行为，加锁要保护的是逻辑完整的临界区而非单条指令
- 原子操作管单变量不撕裂，内存序管跨变量的可见性与顺序；拿不准就用默认 `seq_cst` 或直接上互斥锁
- 短临界区用自旋省切换、长或含 IO 用互斥；读写锁适合读多写少但可能饿死写者；信号量能做限流与解耦通知
- 条件变量必须配 `while` 防虚假唤醒；CAS 的 ABA 来自地址复用——无锁难写对，能用锁就用锁
