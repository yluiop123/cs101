---
title: "第 10 章 · 性能观测：从 top 到火焰图"
description: "排查性能问题最怕\"凭感觉翻工具\"。USE 方法给了一个不会漏的检查表：对每一种资源（CPU、内存、磁盘、网络、锁……）都看三个维度："
series: os
sidebar:
  order: 10
  label: "性能观测：从 top 到火焰图"
difficulty: advanced
duration: 8
---

**本章目标：**

- 会用 USE 方法系统性地扫一遍资源，不漏掉饱和度指标
- 读懂 load average、上下文切换、内存与 IO 的关键数字各自说明什么
- 能用 perf 采样并读火焰图，走通"CPU 不高但很慢"的定位流程

## 10.1 USE 方法与饱和度指标

排查性能问题最怕"凭感觉翻工具"。**USE 方法**给了一个不会漏的检查表：对**每一种资源**（CPU、内存、磁盘、网络、锁……）都看三个维度：

```text
U  Utilization 利用率   资源忙碌的时间占比（%usr、磁盘 busy%）
S  Saturation 饱和度    资源"不够用而排队"的程度（运行队列长度、IO wait 队列）
E  Errors 错误          重试、丢包、OOM kill、被限流等错误计数
```

绝大多数人只看利用率（U），漏掉饱和度（S）——而**性能问题几乎都先体现在饱和度上**：利用率 90% 可能一切正常，但只要有请求在排队（S 上去了），延迟就会非线性恶化。所以口诀是"利用率告诉你忙不忙，饱和度告诉你挤不挤，先看 U 再看 S"。

```text
只报 "CPU 利用率 92%"   → 信息不足：可能只是并行度高，没排队
应报 "利用率 92% + 运行队列长度 8 + 被限流周期上升"  → 饱和度才说明在挤
```

:::tip[每个指标都归到 USE 的一格]
看到任何数字先问它属于哪类资源的 U/S/E，能强迫你检查是否漏看。比如内存的 U 是"已用/总量"、S 是 swap 换页速率与 PSI、E 是 OOM kill 次数；只报"内存用了 80%"而不看有没有在 swap，就是漏了 S。
:::

## 10.2 load average 到底在量什么

`uptime` / `top` 给出的 1、5、15 分钟三个数，常被误读成"CPU 使用率"。它其实量的是：

```text
Linux 的 load average = 处于「可运行(正在跑/等 CPU)」+「不可中断睡眠(D 状态)」的
                         任务平均数，在 1/5/15 分钟上的指数衰减滑动值
```

关键在于它**把 D 状态也算进去了**。D 状态是"不可中断睡眠"，典型是卡在磁盘 IO 上。所以机械盘打满时，CPU 可能很闲（`%usr` 低），但 load average 能飙到几十——因为它在数"排队等 IO 的任务"。

```bash
cat /proc/loadavg        # 第一个=1min 第二个=5min 第三个=15min 之后是 运行/总任务
top -b -n1 | head        # 看 "Tasks: ... running, ... sleeping" 与 Cpu(s) 行
ps -eo state,comm | sort | awk '{print $1}' | uniq -c   # 数一数有几个 D 状态进程
```

判断经验：**load 除以逻辑核数**才是可比的负载。4 核机器 load=8 是"每人等一个位置"（约 2 倍过载）；64 核机器 load=8 则很轻。单看绝对数字没有意义，一定要除以核数。

```bash
# 归一化负载：用当前 1 分钟 load 除以核数
nproc                                          # 逻辑核数
awk '{c=systab("/proc/stat"); for(i=1;i<c;i++) if(...) } ' 2>/dev/null
cpu=$(nproc); read l1 _ < /proc/loadavg
awk -v l="$l1" -v c="$cpu" 'BEGIN{printf "归一化负载 = %.2f（>1 说明在排队）\n", l/c}'
```

三个数还要一起看：1 分钟 > 5 分钟 > 15 分钟表示负载正在**上升**（刚出问题），反之表示**回落**。它还是指数衰减的滑动平均，所以"load 高"永远滞后于现象本身，别拿它当实时值。

## 10.3 CPU：上下文切换与系统调用计数

CPU 时间高不一定全在"算"，也可能耗在切换与进内核上。

```bash
vmstat 1                 # cs 列=整机每秒上下文切换；in 列=每秒中断
pidstat -w -p 1234 1     # 单进程：cswch/s(自愿) 与 cnvcsw/s(非自愿)
mpstat -P ALL 1          # 每个核的 %usr/%sys/%iowait/%soft，看是否单核热点
```

两种切换含义不同：**自愿切换**（voluntary）是线程主动让出，多在等锁、等 IO（对应 8.6 的锁竞争信号）；**非自愿切换**（involuntary）是时间片到了被抢占，说明 CPU 真不够分。

系统调用太频繁也是一类隐性开销（每次要 trap 进内核）。数它：

```bash
strace -c -p 1234        # 挂上去统计各 syscall 次数与耗时（会显著拖慢被测进程）
perf stat -e 'raw_syscalls:sys_enter' -p 1234 -- sleep 5   # 采样式，开销小得多
```

:::caution[strace 会把被测程序拖慢一个量级]
`strace` 靠 ptrace 每次系统调用进出都拦一道，对高 QPS 进程是灾难，测出的延迟严重失真。生产定位优先用 `perf`/eBPF 这类采样式工具；`strace -c` 只适合"我就想知道它调了哪些 syscall、各调了几次"的粗略场景，且尽量在测试环境跑。
:::

## 10.4 内存与 IO 的关键指标

内存看三件事：够不够、有没有在换页、有没有被回收 thrash。IO 看延迟、饱和度、队列。

```bash
free -h                  # 重点看 available（可用），而非 used；buff/cache 可回收
vmstat 1                 # si/so 非 0 = 正在 swap in/out，内存吃紧的硬信号
iostat -x 1              # %util、await(平均延迟)、r/s w/s、aqu-sz(平均队列深度)
cat /proc/pressure/io    # PSI 压力指标：some avg10 直接量化"多少比例时间在等 IO"
```

两个易踩的判断点：一是 `free` 的 `used` 看着高不代表缺内存，页缓存（buff/cache）随时可让出，要看 `available`；二是 `iostat` 的 `%util` 对**SSD/RAID 会骗人**——它们能并行处理多个请求，`%util` 到 100% 不等于饱和，真正该盯的是 `await`（延迟）和队列深度是否上涨。

:::tip[PSI 比"猜阈值"更好用]
`/proc/pressure/{cpu,memory,io}` 里的 `some`/`full` 百分比，直接回答"过去这段时间有多少比例的时间至少一个任务在等这类资源"。它是 USE 里"饱和度"的最佳落地：不用记"load 超过几就算高"，看 PSI 有没有从 0 往上爬就行。
:::

想深挖单个进程为何吃内存，读它的 `smaps`，重点看 RSS 里有多少是"脏页"（真的占着物理内存、回收不掉）：

```bash
pmap -x 1234 | tail -1          # 该进程各映射的 RSS 汇总
awk '/Rss|Dirty|Private_Dirty/ {s[$1]+=$2} END{for(k in s)print k, s[k]" kB"}' \
    /proc/1234/smaps_rollup     # 一次读全进程汇总（以实测字段为准）
```

## 10.5 perf 采样、栈回溯与火焰图怎么读

`perf` 是 Linux 的瑞士军刀。原理是**定时采样**：每 N 个事件（默认每几百毫秒）抓一次"当前 CPU 上正在执行哪个调用栈"，统计命中次数近似各函数的耗时占比——是统计采样，不是逐函数计时。

```bash
perf top -g                          # 实时看热点函数（带调用栈）
perf record -F 99 -g -- ./app        # 以 99Hz 采样运行 ./app，-g 记录调用图
perf report                          # 交互式读 perf.data，看各符号占比
```

采样频率不是越高越好：`-F 99`（略低于 100，避开与其他定时器的锁相）是常用折中，频率拉太高时采样本身就会扰动被测程序。除了 on-CPU，还可以用 `perf stat` 拿硬件计数器做"总量体检"：

```bash
perf stat -e cycles,instructions,cache-misses,branch-misses -- ./app
# 看 IPC（instructions/cycles）：明显低于核心理论值往往在等内存或分支预测失败
```

把 `perf.data` 转成**火焰图**（Brendan Gregg 的 FlameGraph 脚本，需 `-g` 展开帧）：

```bash
perf script | stackcollapse-perf.pl | flamegraph.pl > flame.svg
# 用浏览器打开 flame.svg
```

火焰图的读法是本章重点，也是最大的误区来源：

```text
横轴(宽度) = 该函数在样本里出现的比例 → 越宽越"热"，横向是"按名字排序聚合"不是时间！
纵轴(高度) = 调用栈深度，上面被下面调用
颜色        = 无语义，只为区分
找热点      = 找"最宽的平顶"(plateau)：自身占比大又没有明显宽的子调用在上面
```

:::danger[火焰图横轴不是时间]
新手最常见的错误是把火焰图当"执行时间线"从左往右读。它的横轴是**样本占比、并按函数名字典序重排**，相邻两帧可能毫无调用关系。要看"这段时间谁在跑"应该用时间轴式的 `perf script` 输出或 off-CPU 图，而不是对着火焰图从左扫到右。
:::

还有两个采样偏差要心里有数：

- **需要展开栈**：编译时没留 `-fno-omit-frame-pointer`，或库做了栈帧省略，`perf -g` 可能只抓到几帧，火焰图"矮而失真"。必要时装带调试符号的系统库。
- **短函数被低估**：采样只抓"某一瞬间在跑谁"，调用极快但次数极多的函数，样本可能落在它的调用者上。怀疑时改数事件（`perf stat -e`）或上更重的插桩（eBPF/uprobe）。

## 10.6 常用观测工具速查

把前面分散的工具按"看什么"归拢成一张表，排查时按需取用（具体选项一律以 `--help` / `man` 实测为准）：

```text
资源       利用率 U          饱和度 S               错误 E / 细粒度
CPU       top %usr/%sys     /proc/loadavg          非自愿切换(被抢占)
          mpstat -P ALL     run queue(r 列)         perf top
内存      free available    vmstat si/so            OOM kill(dmesg)
          PSI memory        majflt(次缺页)          /proc/PID/smaps
磁盘 IO   iostat %util*     iostat await/aqu-sz     dmesg 错误
          (SSD 上会失真)    PSI io                   biosync/bpftrace
网络      sar -n DEV        丢包/重传(ss -s)        ip -s link
进程/锁   利用率难直看      pidstat -w cswch         perf lock contention
                            off-CPU 火焰图           bpf trace
```

`*`：`%util` 只对"同一时刻只能处理一个请求"的串行设备（老机械盘）才等价于饱和；能并行的 SSD/RAID 要看 `await` 和队列深度。系统级"一眼全景"首选 `vmstat`/`mpstat`/`iostat`/`sar` 四件套，深入单函数/单调用栈再上 `perf`/`bpftrace`。

:::tip[先系统级、再进程级、最后函数级]
自顶向下的顺序能省大量时间：USE 扫一遍确定是哪类资源饱和（系统级）→ 用 `pidstat`/`top -H` 定位到哪个进程哪个线程（进程级）→ 用 `perf record -g` / off-CPU 火焰图落到具体函数与调用栈（函数级）。跳过前两级直接 `perf`，往往在优化一个根本不是瓶颈的函数。
:::

## 10.7 综合练习：一个「CPU 不高但很慢」的定位过程

场景：接口 P99 从 20ms 涨到 300ms，但监控显示机器 CPU 只有 40%。按 USE 走一遍：

```bash
# 第 1 步：CPU 闲但慢——先看是不是在等，而不是在算
mpstat -P ALL 1                        # %usr 低、%sys 或 %iowait 高？某核 100% 其余空？
vmstat 1                               # cs 是否暴涨（锁竞争）？si/so 是否非 0（换页）？
cat /proc/pressure/io                  # some avg10 有没有从 0 爬起来（IO 饱和）

# 第 2 步：确认是"排队"而非"算力不足"
cat /proc/loadavg                      # load 远超核数 → 大量任务处于 runnable/D 态
iostat -x 1                            # await、aqu-sz 上升 → 磁盘是真凶（接第 6 章）

# 第 3 步：off-CPU 定位它到底在等什么
perf record -g -e sched:sched_switch   # 采 off-CPU 事件，看睡眠栈
# 或 bpftrace 的 offcputime，产出 off-CPU 火焰图（宽=等得久，不是跑得多）
```

结论模板：CPU 40% 却 P99 爆炸，八成不是算力问题。若 `iostat` 的 `await` 高且 PSI io 上爬 → 卡在磁盘 IO，回到 [第 6 章 · 输入输出与中断](./06-io-interrupt/) 看缓冲/零拷贝；若 `vmstat` 自愿切换（cswch）高、off-CPU 火焰图栈顶是 `futex`/`__lll_lock_wait` → 卡在锁，回到 [第 8 章 · 死锁与同步原语](./08-deadlock-sync/) 的 8.6 观测手段。反过来，若 CPU 真打满且火焰图有宽平顶，才轮到优化那个函数本身。

## 本章小结

- USE 方法对每种资源查利用率/饱和度/错误，性能问题先暴露在饱和度上，别只盯利用率
- load average 数的是"可运行 + D 状态"任务数，含等 IO 的进程，必须除以核数才可横向比较
- 自愿切换高多在等锁等 IO、非自愿高说明 CPU 不够；strace 拖慢大，采样优先用 perf/PSI
- 火焰图横轴是样本占比且按名字排序、不是时间线，找最宽平顶定位热点；"CPU 不高却慢"多半在等而非在算
