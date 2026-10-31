---
title: "CPU 调度"
description: "CPU 只有那么多个核，可运行任务却更多 —— 「谁先跑、跑多久」就是调度问题。评价一个策略，先看指标："
series: os
sidebar:
  order: 3
  label: "CPU 调度"
difficulty: advanced
duration: 10
tableOfContents: true
---

**本章目标：**

- 用周转、等待、响应、尾延迟四个指标评价任何调度算法
- 说清 FCFS/SJF/RR/MLFQ 各自的失效点，以及 CFS 的虚拟运行时间如何解决它们
- 会用 `nice`、`taskset`、`chrt` 调整调度行为，并解释观察到的差异

## 调度器在优化什么

CPU 只有那么多个核，可运行任务却更多 —— 「谁先跑、跑多久」就是调度问题。评价一个策略，先看指标：

```text
CPU 利用率     核别闲着，但靠狂切任务抬利用率是假繁荣
周转时间       任务从提交到完成多久（批处理关心）
等待时间       在就绪队列里排了多久（周转 - 服务时间）
响应时间       第一次拿到 CPU 多久（交互/游戏/终端关心）
尾延迟         P99、P999（服务系统真正关心的往往不是均值）
公平性         别人饿死，你的延迟就会变成故障单
```

这些指标彼此冲突：把时间片调大 → 切换开销降低、吞吐上升，但响应时间与 P99 立刻变差。所以不存在「最好的算法」，只有**为一个工作负载做的取舍**。Linux 的目标写得很清楚：优先交互响应与公平，吞吐其次。

上手第一件事是把这四个词和具体的观测口径对上号：

```bash
uptime                                  # 1/5/15 分钟平均"可运行+不可中断"任务数，不是 CPU 使用率
vmstat 1                                # r 列=可运行队列长度；cs 列=每秒切换次数；id=空闲
ps -eo pid,ni,pri,psr,stat,time,comm --sort=-time | head   # ni=nice, pri, psr=当前所在核
cat /proc/loadavg                         # 前三个数字 + 运行/总任务数
```

`loadavg` 在 Linux 上把「等待 CPU」和「等待 IO 且不可中断」两类任务混在一起计数，所以磁盘打满时它会飙高而 CPU 其实很闲 —— 这是最常见的误读（归因方法见 [第 10 章 · 性能观测：从 top 到火焰图](../10-performance-observability/)）。

:::tip[先分类再谈调度]
CPU 密集（编译、压缩、矩阵）：切来切去只会毁掉缓存，倾向长时间独占。
IO 密集（Web 请求、shell）：拿到 CPU 用不了几毫秒就去等下一轮，醒得频繁 —— 它需要的是**快响应**，不是长时间片。
调度算法的全部巧妙之处，都在于不用问程序是哪种类型就能自动区分。
:::

## 两个天真方案：FCFS 与 SJF

**先来先服务（FCFS）**：就绪队列 FIFO，一旦占住 CPU 就跑完或被阻塞。

```text
到达顺序 A(服务 100ms)、B(2ms)、C(2ms)
A 先到 → B 等 100ms、C 等 102ms；平均等待 67ms
若把 A 放最后：平均等待 2ms
```

这就是**护航效应（convoy effect）**：一个长任务把后面的短任务全堵死，响应时间崩溃，而且顺序不可控。

**最短作业优先（SJF）**：选服务时间最小的先跑，可以证明它使平均等待时间最小。但两个前提在真实系统里都不成立：

1. **它要求预知服务时间**。调度器不知道 `make` 还要跑多久。
2. **长任务会饥饿**。源源不断的短任务能让一个后台编译永远排不到 —— 公平性归零。

抢占版 SJF 叫 SRTF（最短剩余时间优先），仍然饥饿。结论：**优化平均值的算法必须外加防饥饿机制**，而「估计服务时间」这个需求，正是后面所有算法的核心动机。

## 时间片轮转：公平地切

RR 很简单：给每人一个时间片（quantum），用完就强制放回队尾，谁也不会饿。

```text
时间片太大   退化成 FCFS → 护航效应回来了，响应时间变差
时间片太小   切换开销占比飙升：25 个任务 / 1ms 片 = 每秒 2.5 万次切换
```

一个经典经验准则：时间片应是**典型交互 burst 长度的若干倍**，让任务能在一个片内完成一次「读输入—算一下—出结果」。Linux 的分数量级在 1~10 ms（CFS 下由 `sched_min_granularity` 一类的参数决定，各版本命名与默认值不同，以 `sysctl -a | grep sched` 与 `cat /sys/kernel/debug/sched/` 实测为准；后者需要 debugfs 挂载权限）。

:::caution[时间片不是越大越省事]
调大分数量级会显著压小切换次数，但会把延迟敏感任务的 P99 拖成毫秒级的台阶感。任何改动都要同时看吞吐与尾延迟两条曲线，只看一条的调优基本等于蒙眼开车。
:::

还要分清「时间片用完了」和「被切走了」不等价。内核只在少数几个点真正执行切换：从一个系统调用返回用户态时、中断返回时、以及主动调用 `cond_resched` 时 —— 它设置 `TIF_NEED_RESCHED` 标志，等一个安全点再切。所以一段不查用户输入、不做系统调用的长计算，实际可能远超一个片才让位。

```bash
cat /proc/PID/status | grep -E 'State|NStgid'   # R=可运行（可能正在排队），S=睡眠（不占队列）
perf sched record -- sleep 3 && perf sched latency   # 谁等了多久、切了多少次（需 perf 与内核调度事件）
```

## 多级反馈队列：不用预知也能逼近 SJF

MLFQ 的想法：既然估不准服务时间，就**边跑边猜**。

```text
结构    若干条队列，优先级从高到低，各自时间片递增（高优先级 8ms、下一档 16ms……）
规则 1  优先级更高的队列先跑
规则 2  同队列内 RR
规则 3  用完一整片还没阻塞 → 降一级（说明它是 CPU 型）
规则 4  片内就主动去等 IO → 留在原级或升级（说明它是交互型）
规则 5  等太久没跑 → 提到高优先级（防饥饿）
```

一个刚醒的交互任务落在高优先级队列，几毫秒内就被服务；跑满片说明它不需要响应，把它往下沉。这样**无需任何预知**就自动把 CPU 让给短 burst 任务，同时靠规则 5 保证长任务不至于饿死。

```text
可被博弈（gaming）—— MLFQ 的经典弱点：
任务 fork 一堆子进程，每个都只跑「刚好不到一片」就阻塞 → 永远待在高优先级队列
对策：Linux 不用纯 MLFQ，而是用「历史累计 + 权重」的方式记账（见 3.5）
```

## CFS：虚拟运行时间与红黑树

完全公平调度器（CFS）的直觉是：**理想情况下所有任务应平分 CPU**。既然做不到，那就记一笔账 —— 每人应得多少、实际拿了多少。

```text
vruntime = 实际运行时间 × (自身权重 / 组内权重总和)   ← 归一化成"公平刻度"上的时间
选择     永远挑 vruntime 最小的任务（它最"吃亏"）
数据结构 可运行任务挂在红黑树上，按 vruntime 排序 → 取最左节点 O(log N)，选下一个 O(1) 摊还
新任务   vruntime 取树的最小值附近，避免刚醒的交互式任务被判"欠费过多"而排不上
```

拿两个任务手算一次，直觉就落地了。A 的权重 2、B 的权重 1（B 的 nice 更高，只拿到一半份额）：A 跑 10 ms 时 `vruntime += 10 * 2/(2+1) ≈ 6.67`；B 跑 5 ms 时 `vruntime += 5 * 1/(2+1) ≈ 1.67`。两人 vruntime 不相等？不会 —— 因为下一次挑的就是 vruntime 小的 B，直到两边在「公平刻度」上追平。权重比例就是这样被自然实现的，不需要任何「优先级抢占」。

权重由 nice 值换算：nice 范围 `-20 ~ 19`（默认 0），数值越小权重越大。Linux 里每降一档 nice 大约换来 **10% 的额外 CPU 份额**（同一调度类内的相对比例，不是绝对优先级），可用 `cat /proc/PID/sched` 里的 `nice`/`load` 字段核对。

```bash
cat /proc/self/sched | head -12     # 需要 CONFIG_SCHED_DEBUG，缺此文件即内核没开
# 关注：nr_switches、se.exec_start、se.vruntime、sum_exec_runtime —— 字段名随版本变化，EEVDF 内核上是 deadline/slice 一类
```

:::caution[别把 nice 当「绝对优先级」]
nice 只改变**同一调度类内**的权重比例。一个 nice 19 的 CPU 型任务在系统空闲时照样能跑满所有核；反过来，任何实时类任务都会无条件压过 nice 为 -20 的普通任务。想让后台任务「真不抢前台」，得配合 cgroup 的 CPU 权重（[第 9 章 · 虚拟化与容器的内核基础](../09-virtualization-container/)）。
:::

关于版本：Linux 6.6 起主线用 **EEVDF** 替换了 CFS 的调度路径（引入「延迟容忍 deadline」与可运行时间片），但 vruntime/权重/红黑树这套直觉仍然是理解调度行为的有效模型。判断自己的机器：`uname -r`，再看 `dmesg | grep -i -E 'EEVDF|CFS'` 与内核 config（`zcat /proc/config.gz | grep -i SCHED`，部分发行版不导出该文件，则以 `man 7 sched` 为准）。

## 亲和性、迁移，以及实时调度的一瞥

多核下调度不再只是「谁先跑」，还有「在哪个核上跑」。同一个任务反复换核，L1/L2 缓存与 TLB 全部作废：

```text
软亲和   调度器尽量把任务留在原来的核（缓存友好），忙了可以迁走
硬亲和   用 sched_setaffinity/taskset 把任务钉死在指定核上，除非空核否则不迁
迁移代价 缓存失效 + 需要唤醒另一个核（IPI 中断）→ 比同核切换贵得多
```

```bash
taskset -c 0,1 ./my_app                       # 绑定到 0、1 两个核
taskset -pc $$                                # 看当前进程允许跑在哪些核
cat /proc/self/status | grep Cpus_allowed_list
mpstat -P ALL 1                               # 每核利用率：只有一个核 100% → 单线程被钉死了
sysctl kernel.sched_migration_cost_ns         # 迁移成本估算（默认量级 500000 ns，以实测为准）
```

常见误用与正确姿势：

```bash
# 错误写法：给编译任务绑所有核，还以为"这样最快"
taskset -c 0-63 make -j64        # 绑核反而限制了并行度，而且核全给了它，前台没核可用
# 正确写法：留出交互核，编译只吃剩下的
taskset -c 2-63 make -j62        # 核 0、1 留给桌面与服务中断；再配合 nice 降低权重
nice -n 10 taskset -c 2-63 make -j62
```

原因：绑核解决的是「迁移导致的缓存丢失」，不解决「权重抢占」。两件事要分开调，先看 `mpstat` 的每核分布，再决定要不要绑。

### 实时调度的一瞥

实时类（`SCHED_FIFO`、`SCHED_RR`、`SCHED_DEADLINE`）与前面的「公平」模型完全不同：**只要它可运行，就无条件抢占所有普通任务，直到它主动阻塞或退出**。

```text
SCHED_OTHER  普通类（CFS/EEVDF），nice 调权重
SCHED_FIFO   实时类：同优先级不抢，用完不阻塞就一直跑（没有片的概念）
SCHED_RR     实时类：同优先级之间按片轮转
SCHED_DEADLINE 带带宽声明的实时类（sched_deadline 的三参数模型）
优先级       实时类内部 1~99，数字越大越优先
```

```bash
chrt -p $$                                  # 看当前策略与优先级
chrt -r 10 ./audio_callback                 # SCHED_RR、优先级 10
sudo chrt -f 80 ./capture                   # 需要 CAP_SYS_NICE，普通用户跑不了
```

:::danger[开发机上慎用高实时优先级]
一个 `SCHED_FIFO` 的忙等循环会把整台机器拖死（内核线程与 shell 都抢不过它）。Linux 默认开启 RT throttling（`sysctl kernel.sched_rt_period_us` 与 `sched_rt_runtime_us`，常见默认是每 1s 周期给 950ms 上限）作为兜底，但它是安全网而不是调优手段；容器/实时音频场景请以 `sysctl -a | grep sched_rt` 实测确认。
:::

## 综合练习：手算三种调度，再实测 nice

四个任务在同一时刻到达，纯 CPU 型，忽略切换开销：

```text
任务   服务时间
P      2 ms
Q      8 ms
R      4 ms
S      6 ms
```

1. **FCFS** 顺序 P、Q、R、S：算平均等待时间。
2. **SJF**（非抢占）顺序 P、R、S、Q：再算一次，比较差多少 —— 这就是 3.2 说的最优性。
3. **RR** 时间片 3ms：写出每 3ms 的甘特图，算 P 的**响应时间**与 Q 的周转时间。你会发现 SJF 的最优平均值在 RR 下换了个赢家 —— 平均值不是唯一目标。
4. 实测 nice 的相对权重：

```c
/* busy.c —— 纯计算循环，跑满 2 秒后报告自己实际用了多少 CPU 时间 */
#include <stdio.h>
#include <time.h>

int main(void) {
    struct timespec a, b;
    clock_gettime(CLOCK_PROCESS_CPUTIME_ID, &a);
    volatile double x = 0;
    do {                                   /* 不要在这里放 sleep：那会变成 IO 型任务 */
        for (int i = 0; i < 1000000; i++) x += i * 0.5;
        clock_gettime(CLOCK_PROCESS_CPUTIME_ID, &b);
    } while (b.tv_sec - a.tv_sec < 2);
    printf("cpu time used: %ld.%03ld s
",
           b.tv_sec - a.tv_sec, (b.tv_nsec - a.tv_nsec) / 1000000);
    return 0;
}
```

```bash
gcc -O2 busy.c -o busy
( nice -n 0 ./busy & nice -n 5 ./busy & nice -n 19 ./busy & wait )
# 三个数字的比值就是实际分到的 CPU 时间；也可对照 /proc/PID/sched 的 sum_exec_runtime
```

要跑在一台**核数少于任务数**的机器上（比如容器里 `nproc` 为 1~2），否则三个任务各自占满一个核，权重差异根本表现不出来 —— 这是本练习最容易得到的「假结果」。

预期：三者比例大致落在 `10 : 约 1/1.2 : 约 1/5` 的量级（nice 每档约 10% 份额差，见 3.5），而不是线性倍数。若某一步和你的直觉冲突，先把 `mpstat -P ALL 1` 的输出贴出来判断是不是核数没吃满 —— 单核够用时，权重差异表现不出来。

## 本章小结

- 评价调度要看利用率、周转/等待、响应与尾延迟、公平性，它们互相冲突；Linux 偏向交互响应与公平
- FCFS 有护航效应，SJF 最优但要求预知服务时间且会饿死长任务；RR 保证公平，时间片大小是吞吐与延迟的取舍
- MLFQ 用「用完一整片就降级、等太久就提升」来不用预知地逼近 SJF，弱点是可被博弈；CFS 改用 vruntime 记账 + 红黑树取最左，把公平做成可累积的账本
- nice 只是同调度类内的权重比例，实时类无条件抢占普通类；绑核治迁移与缓存丢失，不解决抢占，两者要分开调
