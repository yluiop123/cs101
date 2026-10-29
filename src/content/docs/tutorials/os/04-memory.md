---
title: "第 4 章 · 内存管理与虚拟内存"
description: "最朴素的想法：给每个进程一段连续的物理内存。它立刻撞上两堵墙。"
series: os
sidebar:
  order: 4
  label: "内存管理与虚拟内存"
difficulty: advanced
duration: 8
tableOfContents: true
---

**本章目标：**

- 说清分页如何同时解决外部碎片与地址保护，并能算出页表要多少级
- 建立「虚拟地址 → TLB → 多级页表 → 页帧」这条翻译链，理解局部性为何决定性能
- 会用 `/proc` 判断一次内存问题的真相：缺页、换页、超配还是 OOM

## 4.1 连续分配的尽头

最朴素的想法：给每个进程一段连续的物理内存。它立刻撞上两堵墙。

```text
墙一 找不到地方   内存被切成一堆空洞：总空闲 4 GB，但没有 1 GB 连续 → 分配失败
       → 内部碎片：分 100 MB 却按 128 MB 给
       → 外部碎片：空洞本身，靠"紧凑"整理要移动整个地址空间，代价大到不可用
墙二 无法保护     进程 A 手里有物理地址，随便一改就写坏了 B 或内核
       → 必须有硬件级边界（基址+长度寄存器），且切换进程时要换掉整套边界
```

分页的思路是**放弃连续性**：把虚拟地址空间切成固定大小的**页**（page，通常 4 KB），把物理内存切成同样大小的**页帧**（frame），页与帧之间用一张表任意配对。

```text
虚拟页号 ──[页表]──> 物理页帧号，帧内偏移原样照抄
后果 1  任何虚拟页可以落在任何空闲帧上 → 外部碎片消失（只剩页内的平均 2 KB 内部碎片）
后果 2  表是每进程私有的 → 「别人的地址在我表里没有有效项」，隔离变成查表的副产品
后果 3  表项里有权限位与 present 位 → 只读、不可执行、用户不可访问都能表达
```

:::caution[别把「分配成功」理解成「内存到手」]
`malloc` 1 GB 只改变虚拟地址空间的记账，物理内存要在**第一次写入**（首次触碰，first touch）时才由缺页处理分配。所以容器里 `RSS` 远小于 `Xmx`/`malloc` 总量是正常现象，也意味着真正的风险在运行中突然爆发。
:::

## 4.2 页表：一次翻译的账

页表本身是**存在内存里的数组**，硬件自动完成查表。地址翻译于是变成一串内存访问：

```text
页大小 4 KB → 低 12 位是帧内偏移，剩下的是虚拟页号
x86-64 用 4 级（可选 5 级），每级表 512 项，用虚拟地址的 9 位做下标
PGD ─9─> PUD ─9─> PMD ─9─> PTE ─12─> 字节偏移      （48 位虚拟地址）
每级 9 位 × 4 = 36 位 + 12 位偏移 = 48 位 ✓
```

一次翻译最多要读 4 个页表页 —— 但 CPU 里有专门的缓存：**TLB**（4.3）。更要紧的是，[第 1 章 · 操作系统到底在做什么](../01-what-os-does/) 说的「向 `.text` 写一字节就 `SIGSEGV`」正是发生在这里：PTE 里有 `R/W/U/S/PKE` 等权限位，CPU 检查不过就直接报保护异常，内核把它翻译成信号。

```bash
getconf PAGESIZE                                    # 4096
cat /proc/self/smaps | head -20                     # 每段映射的 Rss/Pss/Anonymous/THPeligible
grep -E 'VmRSS|VmSize|VmStk|VmData' /proc/self/status
```

`VmSize` 是虚拟地址空间总量（可以远超物理内存），`VmRSS` 是当前真正驻留的物理页。两者的差就是本章后半部分要讨论的一切。

## 4.3 TLB 与局部性

TLB 是翻译结果的缓存，容量只有千级条目（各代 CPU 不同），命中与否却能让同一份代码差出几倍速度。

```text
TLB 命中    翻译几乎免费（几个周期）
TLB 未命中  硬件页表遍历（最多 4 次内存访问）或陷入内核（software walk）
            → 数十到数百周期，且会污染缓存
```

TLB 小，所以程序必须**局部性好**才跑得快：

- **时间局部性**：刚用过的页大概率还会用 → 缓存它。
- **空间局部性**：用了这页大概率用邻居页 → 一次遍历能顺手填好几项；这也是**顺序扫描比随机跳跃快得多**的根本原因（数据库页缓存、[第 5 章 · 文件系统](../05-filesystem/) 的预读都靠它）。

```bash
perf stat -e dTLB-load-misses,dTLB-loads,LLC-load-misses ./my_app   # 事件名随微架构变化，先 perf list | grep -i tlb 查
```

两条工程推论：**大页**把 512 个 4 KB 页合并成一项（2 MB 或 1 GB），TLB 压力直接降两个量级，数据库与虚拟化最爱用；**结构体字段按访问热度排列**、避免指针满天飞的布局，本质都是在保护 TLB。

```bash
cat /sys/kernel/mm/transparent_hugepage/enabled     # 透明大页策略：always/[madvise]/never
# 大页的代价：内部碎片变大、内存整理（compaction）可能引入长尾延迟 —— 延迟敏感服务常关成 madvise
```

## 4.4 多级页表为什么必要

如果给 48 位地址空间做一张**平铺**页表：`2^48 / 2^12 = 2^36` 个表项，每项 8 字节 = **512 GB 页表**，每个进程一份 —— 完全不可能。

真实进程的地址空间却极其稀疏：

```text
栈在最高端、代码与数据在最低端、中间夹着少量 mmap 段
典型服务端进程的活跃映射合计几 MB ~ 几百 MB，其余是几十 TB 的空洞
```

多级页表的解法是**按需分配最后一级**：PGD 只有一页，指向它的 PUD/PMD/PTE 页只有真正被用到的地址区间才会存在，未使用的区间整段跳过。

```text
稀疏区间   上级表项为空 → 硬件判定"未映射"，一句话都不用存
2 MB 对齐的整块未用区域可由 PMD 直接标注 → 省掉一整层表（这也是大页的存储基础）
```

:::tip[读一个进程的「稀疏程度」]
`pmap -x PID` 或 `cat /proc/PID/maps`：行数少、跨度大、中间空洞多，就是多级页表在替你省内存。反过来，一个映射了几十万个小程序段的进程（某些老 Java 配置、疯狂 `mmap` 的程序）光是页表与 VMA 结构本身就是负担。
:::

## 4.5 缺页中断与换页

PTE 的 present 位为 0 时访问该页，CPU 抛**缺页异常**，内核进 `do_page_fault` 判断三种情况：

```text
1. 地址根本不该被访问（野指针、越界、写只读页）→ 送 SIGSEGV/SIGBUS，进程死
2. 地址合法但页还没来：
   a. 匿名页首次触碰      → 分配一个清零页帧，建立映射（demand zero page）
   b. 文件映射页          → 从页缓存取或读盘（[第 5 章 · 文件系统](../05-filesystem/)）
   c. 页被换出到 swap     → 分配帧、读回来、改 PTE
3. 权限暂时收紧（COW 共享页要写）→ 复制一份，改映射（[第 2 章 · 进程与线程](../02-process-thread/) 的 fork）
```

代价分两个量级，排查时务必区分：

```text
minor fault   不需要磁盘 IO（页已在页缓存、只是补建映射）—— 几百纳秒到微秒
major fault   必须读盘/读 swap —— 毫秒级，一次majflt 相当于几万次普通访问
```

```bash
cat /proc/PID/stat | awk '{print "minflt="$10" majflt="$12}'   # 字段号按内核文档核对：man 5 proc
vmstat 1        # si/so 两列持续非 0 = 正在换页；us/sy 高而 id 低 = CPU 真忙
grep -E 'pgmajfault|pswpin|pswpout' /proc/vmstat
```

**工作集**（进程一段时间内反复触碰的页集合）超过可用物理内存时，系统进入**颠簸（thrashing）**：几乎所有时间都在换页，吞吐掉到零但 CPU 看起来 100% 忙（全在内核态）。此时加线程/加请求只会更快崩溃 —— 唯一有效的是减负载或加内存。

## 4.6 swap、OOM 与内存超配

Linux 允许**承诺比实际能给的多**（overcommit），因为 `malloc` 过的内存通常不会被全用满。策略由一个开关控制：

```bash
sysctl vm.overcommit_memory        # 0 启发式（默认）/ 1 总是允许 / 2 严格按 CommitLimit
sysctl vm.overcommit_ratio         # 模式 2 下参与计算的物理内存百分比
cat /proc/meminfo | grep -E 'CommitLimit|Committed_AS|MemAvailable|SwapTotal|Dirty'
```

`CommitLimit` 大致是「物理内存 × ratio + swap 总量」，`Committed_AS` 是全体进程已承诺的量：后者逼近甚至超过前者，就意味着下一次 `malloc` 可能直接失败（返回 NULL 或 `ENOMEM`）。

:::caution[关掉超配不等于没有风险]
把 `vm.overcommit_memory` 设为 2 确实能让 `malloc` 不再骗人，但也意味着 Redis 这类靠 `fork` + 写时复制做持久化的程序可能因「承诺」不够而失败。改这个参数前，先确认你的关键进程是否依赖 fork 时不预留内存（见 2.4 节）。
:::

真的凑不齐页时会发生两件事：

```text
先换页        内核按 LRU 把冷页退回 swap（匿名页）或直接丢弃（干净文件页）
换无可换      OOM killer 挑一个进程杀掉：/proc/PID/oom_score 越高越容易被选中
              调整：/proc/PID/oom_score_adj（-1000 到 1000）
```

```bash
dmesg -T | grep -i -E 'out of memory|oom-kill'        # 谁被杀、缺多少
sudo journalctl -k | grep -i oom                       # systemd 机器的等价看法
swapon --show                                          # 有没有 swap、用了多少
sysctl vm.swappiness                                   # 换页倾向（默认量级 60，取值范围随版本变化）
```

`vm.swappiness` 调低只是**减少对「匿名页 + 文件页」之间的偏好**，不是「永不换页」。数据库与 JVM 想避免被换出，正解是 `mlock`/`mlockall`（受 `RLIMIT_MEMLOCK` 与 `CAP_IPC_LOCK` 限制）或 cgroup 内存锁定，而不是把参数调成 0。

**错误写法 → 正确写法**：

```python
# 错误：以为 malloc 成功就等于内存安全，且再 free() 就能把内存还给操作系统
import ctypes
libc = ctypes.CDLL("libc.so.6", use_errno=True)
addr = libc.malloc(4 << 30)          # 承诺 4 GB，超配下几乎必然成功
libc.free(addr)                      # glibc 可能仍把它留在自己的 arena 里，RSS 不降

# 正确：大块且要真正归还，用 mmap 建映射 + 明确首次触碰策略，必要时 mlock 保证常驻
size = 4 << 30
mmap_region = mmap.mmap(-1, size)    # 匿名映射：只建虚拟区间
mmap_region[:4096] = b"\0" * 4096    # 首触才真正占用一页
```

原因：`malloc` 小对象走 `brk`/arena，归还给内核的时机由分配器决定，进程内碎片不会因 `free` 消失；`mmap` 的区间 `munmap` 后一定立刻归还。这也是「长跑进程内存只涨不落」最常见的真实原因之一。

## 4.7 综合练习：一次说清「这块内存到底占了多少」

按顺序执行并记录每个数字：

```bash
python3 - <<'EOF'
import os
big = bytearray(2 << 30)              # 申请 2 GB，还没写
print("pid", os.getpid(), "input rss_kb:")
os.system("grep VmRSS /proc/%d/status" % os.getpid())
for i in range(0, len(big), 4096):    # 每页写一个字节：强制首触
    big[i] = 1
os.system("grep -E 'VmRSS|VmSize' /proc/%d/status" % os.getpid())
input("press enter to exit: ")
EOF
```

```bash
# 另开一个终端，把 PID 换成上面的 pid
cat /proc/PID/smaps_rollup | grep -E 'Rss|Pss|Private_Dirty|Swap'
cat /proc/PID/stat | awk '{print "minflt="$10}'      # 首触造成的缺页次数 ≈ 2GB/4KB
cat /proc/PID/pagemap > /dev/null                      # 需要权限；无权限就跳过
```

回答四问：

1. 分配后与写入后 `VmRSS` 各是多少？差多少？用 4.5 的哪一条解释？
2. `minflt` 的次数与你的分配大小是什么关系？为什么几乎看不到 `majflt`？
3. 把这段进程的 `Pss` 与 `Rss` 比较：什么时候它们会不相等？（提示：`fork` 后未写的页，见 2.4）
4. 用 `MemAvailable`（`/proc/meminfo`）而不是 `MemFree` 判断「还能不能再吃」，为什么？（提示：可回收的文件页与缓存，见 [第 5 章 · 文件系统](../05-filesystem/)）

最后加一步压力实验：给容器或 cgroup 设一个小于 2 GB 的内存上限后重跑，观察 `dmesg -T | grep -i oom` 与 `oom_score`，说清是谁被选中、依据是什么。

## 本章小结

- 分页用「放弃物理连续性」一次解决外部碎片与地址保护：页表决定谁能访问哪一帧，隔离是查表的副产品
- 翻译链是虚拟地址 → TLB → 多级页表 → 页帧；TLB 容量小，所以局部性与大页直接决定内存子系统的实际速度
- 多级页表必要，因为 48 位平铺页表要 512 GB；按稀疏性只分配最后一级，空洞不占空间
- `VmSize`/`VmRSS`/`Pss`/`CommitLimit` 各说一件事：先看是否真占物理内存（首触、majflt），再看是否超配或正在换页，最后才谈 OOM
