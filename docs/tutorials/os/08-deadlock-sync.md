---
title: 死锁与同步原语
---

# 第 8 章 · 死锁与同步原语

**本章目标：**

- 理解银行家算法的直觉，以及它为什么在通用系统里几乎不落地
- 掌握破坏死锁的工程手段：全局锁顺序、超时、检测与恢复
- 知道用户态锁最终落到 futex，并能用工具观测锁竞争

## 8.1 银行家算法的直觉与为什么不实用

[第 7 章](./07-concurrency-locks) 末尾列了死锁四条件。理论上有个"预言家"能在每次分配资源前判断：这样下去系统是否还会进入不安全状态？如果分配后所有进程都能顺利跑完（存在至少一种完成顺序），就安全放行，否则拒绝、让请求者等着。这就是**银行家算法**（Dijkstra）。

```text
Available    每类资源当前还剩多少
Max          每个进程声明"我最多需要多少"
Allocation   每个进程现在已分到多少
Need = Max - Allocation

每次请求先"假装"分配，再跑一遍安全性检查：
能否找到一个进程，它的 Need 全部被 (Available + 它已持有的) 覆盖？
能 → 让它跑完并回收，把它占的资源还进 Available，重复到全部完成 → 安全
找不到 → 该分配会使系统进入不安全状态 → 拒绝
```

直觉很优雅，工程上却基本没人用，原因有三：

1. **要进程提前声明 Max**。真实程序的资源需求随输入动态变化，数据库锁、内存分配根本给不出"我最多要 42 把锁"。
2. **开销随规模爆炸**。安全性检查是 O(进程数 × 资源数) 每请求一次，高并发下光算就吃不消。
3. **资源语义不匹配**。锁是可重入、可递归、有所有权的，不像打印机/磁带那样是齐次的"一类多少个"，模型对不上。

一个最小的两进程两资源版本能帮助建立直觉：

```text
进程   Max    Allocation   Need
P0     A:1 B:1  A:1         B:1
P1     A:1 B:1  B:1         A:1
Available: 只剩 B 之外无……若把唯一的 A 判给 P1，
P0 在等 A、P1 攥着 B 也在等 A → 安全性检查找不到能让任一进程跑完的顺序
→ 判定为"不安全"，拒绝这次分配。
```

这正是死锁四条件里"持有并等待 + 循环等待"同时成立的画面；银行家算法在分配**前**就把它拦下，代价就是上面那三条不实用的理由。

::: warning 银行家算法是"存在性证明"不是"生产方案"
它的价值是让你理解"安全状态"这个概念，以及在**资源种类固定、需求可预先声明**的极窄场景（某些批处理作业调度）里还能用。通用 OS 与业务代码靠的是后面的预防、检测、超时三板斧。
:::

## 8.2 死锁预防与破坏循环等待

预防（prevention）的思路是直接让四条件里至少一条永远不成立，简单粗暴但有效。

```text
破坏互斥      把独占资源改成可共享版本（读写锁、无锁结构、原子操作）
破坏持有并等待 一次性申请全部资源，或申请前先释放已持有的
破坏不可剥夺  申请不到就把手里的放掉（trylock 失败即 rollback）
破坏循环等待  给所有锁定一个全局顺序，只允许按序加锁
```

其中**破坏循环等待**最实用、代价最小，也就是 8.3 的锁顺序。破坏"持有并等待"（全都要或全不放）听起来干净，实际常导致低并发——你为了一笔只需两把锁的小操作，得先把无关的锁全放下再抢回来，反而制造新竞态。

## 8.3 锁顺序与超时策略

**全局锁顺序**：给系统里每一把可竞争的锁编号（指针地址、对象 ID、字母序皆可），规定任何线程必须**按编号从小到大**加锁。

```c
// 转账：给两把账户锁定顺序（按地址小者优先）
pthread_mutex_t *first  = from->mutex < to->mutex ? from->mutex : to->mutex;
pthread_mutex_t *second = from->mutex < to->mutex ? to->mutex : from->mutex;
pthread_mutex_lock(first);
pthread_mutex_lock(second);
do_transfer();
pthread_mutex_unlock(second);
pthread_mutex_unlock(first);
```

```c
// 错误写法：两个线程各按"业务直觉"的顺序加锁，方向相反 → 环形等待
// 线程 A：lock(acc1); lock(acc2);
// 线程 B：lock(acc2); lock(acc1);
// 正确写法：A、B 都先 lock(min(acc1,acc2)) 再 lock(max(...)) —— 顺序统一，环不成形
```

顺序统一后不可能出现循环等待，这是最省心的预防。难点只在"给所有锁排一个全序"这件事上——大型代码库需要一个明确的、文档化的排序规则（常见：按锁对象内存地址）。

**超时策略**：`pthread_mutex_timedlock` 给了拿不到锁时的退路。

```c
struct timespec ts;
clock_gettime(CLOCK_REALTIME, &ts);
ts.tv_sec += 1;                              // 最多等 1 秒
if (pthread_mutex_timedlock(&m, &ts) == ETIMEDOUT) {
    // 拿不到：释放已持有的其它锁后重试，或上报"操作超时"，绝不无限等
}
```

超时把"永久死锁"降级成"可恢复的失败"，但它是兜底不是主方案：全代码库撒 `timedlock` 说明锁设计本身有问题。

经典教学案例"哲学家进餐"恰好演示了两种破坏方式：五个哲学家各拿左右两支筷子，人手都先拿左再拿右，就可能全员各执一支、互相等待成环。解法要么给筷子编号强制按序取（破坏循环等待），要么"拿不齐两支就一支都不拿"（破坏持有并等待），要么设一个只能坐 4 人的房间（限制并发使环无法闭合）。

## 8.4 检测与恢复

对既不能预防、又不能容忍超时的场景（比如事务型数据库），走**检测 + 恢复**：周期性在等待图（wait-for graph，节点是线程/事务，边是"我在等你持有的锁"）上找环；有环即死锁。

```text
检测  维护 wait-for graph，跑一次环检测（DFS 或拓扑排序）O(V+E)
恢复  选"代价最小"的牺牲者回滚/杀掉打破环：优先回滚持锁少、进展短的
      被回滚的事务重试时会发现环已消失
```

一个 DFS 找环的伪码骨架：

```c
// color: 0 未访问, 1 在当前 DFS 栈中, 2 已完成
bool dfs(node u) {
    color[u] = 1;
    for (v in waits_for(u)) {          // u 持有的资源被 v 等着 → u→v 边
        if (color[v] == 1) return true; // 回边 → 找到环
        if (color[v] == 0 && dfs(v)) return true;
    }
    color[u] = 2;
    return false;
}
```

数据库（InnoDB 的死锁检测、PostgreSQL 的 `deadlock_timeout`）正是这么做的，所以你会在日志里看到 `Deadlock found when trying to get lock; try restarting transaction`。应用层线程死锁通常不做在线检测，而是靠 8.3 的预防 + 线程栈快照事后分析（`gdb` attach 上去 `thread apply all bt`，看谁卡在哪个 `pthread_mutex_lock`）。

## 8.5 futex 与用户态锁

前面反复用 `pthread_mutex_lock`。它到底怎么睡下去的？答案是一个叫 **futex**（fast userspace mutex）的内核原语——它的设计哲学是" uncontended 走用户态，contended 才进内核"。

```text
 uncontended（没人抢）
   lock 就是一条原子 CAS：把 0 改成 1，全程不进内核，纳秒级
 contended（有人抢）
   CAS 发现已被占 → syscall(SYS_futex, addr, FUTEX_WAIT, 期望值, ...)
   内核把该线程挂到 addr 对应的等待队列上睡眠
 unlock
   原子把值改回 0；若队列里有人等 → syscall(..., FUTEX_WAKE, 1) 唤醒一个
```

关键洞见：**锁的常见状态是"没人抢"**，glibc 用一条原子指令就搞定，把昂贵的系统调用留给少数真竞争。futex 以"用户态地址"作为内核等待队列的 key，只有真冲突时才联系内核——这就是用户态互斥锁快的根本原因。

```bash
man 2 futex          # FUTEX_WAIT / FUTEX_WAKE / FUTEX_WAKE_OP 等
```

手写一个 futex 锁的核心只有三段（实际生产请用 pthread，这里只为看清机制）：

```c
#include <linux/futex.h>
#include <sys/syscall.h>
#include <unistd.h>

static void futex_wait(int *addr, int val) {
    syscall(SYS_futex, addr, FUTEX_WAIT_PRIVATE, val, NULL, NULL, 0);
}
static void futex_wake(int *addr) {
    syscall(SYS_futex, addr, FUTEX_WAKE_PRIVATE, 1, NULL, NULL, 0);
}
// lock:  CAS(0→1) 成功即持有；否则 futex_wait(&word, 1)
// unlock:写回 0；若有等待者则 futex_wake(&word)
```

`FUTEX_WAIT` 会先复核 `*addr` 是否仍等于期望值——不等就立刻返回，避免"我正要睡，锁却已被释放"的丢唤醒竞态。这正是内核替你处理好的那部分难点。

::: tip 条件变量、信号量、读写锁都是同一套底座
`pthread_cond_*`、`sem_*`、`pthread_rwlock_*` 在 Linux 上的慢路径最终都落到 futex（较新内核还有 futex2 与 `FUTEX_WAIT_BITSET` 等扩展）。理解了 futex，就理解了"用户态同步对象在竞争时如何变成一次进内核的睡眠"。
:::

## 8.6 锁竞争的性能观测方法

锁写错了会死锁（功能 bug），写"对但慢"则是性能问题：大量线程睡在同一把锁上，吞吐塌方。观测手段从粗到细：

```bash
# 1) 上下文切换：非自愿切换(cs)暴涨说明线程在抢锁/被抢占
pidstat -w -p <PID> 1          # cswch/s（自愿，多在等锁等 IO）与非自愿

# 2) 谁在等什么：内核态锁用 /proc 快查
cat /proc/lock_stat            # 需内核开启 CONFIG_LOCK_STAT（以实测为准）

# 3) 精确到调用点：perf 的锁内容分析
perf lock record ./app && perf lock report
perf lock contention           # 新版 perf，直接聚合竞争热点与栈
```

判读要点：**自愿上下文切换**（voluntary，`cswch`）高通常意味着大量线程在锁/条件变量上睡眠等待；再结合火焰图（见 [第 10 章 · 性能观测](./10-performance-observability)）看栈顶是不是 `futex_wait`/`__lll_lock_wait`，就能确认"慢在锁竞争"而非"慢在算"。

## 8.7 自查清单

动手改代码前后，逐条核对：

- [ ] 系统里存在**全局锁顺序**且有文档，转账/多资源操作严格按序加锁
- [ ] 没有两处代码对同一组锁用相反顺序（破坏循环等待）
- [ ] 临界区内不做 IO、不调用回调/未知代码（缩短持锁时间）
- [ ] 需要"拿不到就走"的地方用 `pthread_mutex_timedlock`，且失败路径会**释放已持有的锁**
- [ ] 用 trylock + 回退（释放已持有、退避重试）实现"破坏不可剥夺"
- [ ] 锁竞争被视为性能问题：`pidstat -w` + `perf lock contention` 至少各跑过一次
- [ ] 数据库/事务场景知道死锁会被检测并回滚，重试逻辑幂等
- [ ] 理解 `pthread_mutex_lock` 的快路径是原子 CAS，慢路径才 futex 进内核

## 本章小结

- 银行家算法给出"安全状态"的漂亮直觉，但需要预声明 Max、开销爆炸、锁语义不匹配，通用系统里基本不落地
- 预防优先破坏循环等待：给全部锁定全局顺序是最省心的死锁免疫，超时/trylock 回退作兜底
- 数据库靠 wait-for graph 做在线检测并回滚牺牲者；应用层多用栈快照事后分析
- 用户态锁快在 uncontended 时只走一条原子 CAS，真竞争才 futex 进内核；`pidstat -w` 与 `perf lock contention` 是发现锁竞争的第一现场
