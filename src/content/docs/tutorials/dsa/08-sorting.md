---
title: "第 8 章 · 排序算法全解"
description: "插入排序的直觉就是理扑克牌：手里那叠始终有序，新牌从右往左找到位置插进去。"
series: dsa
sidebar:
  order: 8
  label: "排序算法全解"
difficulty: intermediate
duration: 8
---

**本章目标：**

- 能按「规模 + 是否近乎有序 + 可否用额外空间 + 要不要稳定」四个问题选出排序算法
- 说清每种算法的最坏情况触发条件，以及比较排序 Ω(n log n) 下界从哪来
- 理解稳定性到底改变什么，并知道各语言内置排序实际用的是哪种算法

## 8.1 三种平方级：插入、选择、冒泡

插入排序的直觉就是理扑克牌：手里那叠始终有序，新牌从右往左找到位置插进去。

```python
def insertion_sort(a):
    for i in range(1, len(a)):
        x, j = a[i], i - 1
        while j >= 0 and a[j] > x:      # 写 > 不写 >=：相等就停，稳定性才保住
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = x
    return a
```

最坏 O(n²)（完全逆序），最好 O(n)（已经有序）。这个「接近有序就跑得快」的性质极值钱，工业级排序全都靠它。选择排序方向相反：每轮从后半段挑最小值和当前位置交换。

```python
def selection_sort(a):
    for i in range(len(a)):
        m = i
        for j in range(i + 1, len(a)):
            if a[j] < a[m]:
                m = j
        a[i], a[m] = a[m], a[i]         # 每轮最多一次写，总写入不超过 n 次
    return a
```

它比较次数恒为 n(n-1)/2、与输入无关，写次数却是全场最少——**只有当「写」比「读」贵得多**（老式闪存、超大结构体）才值得用它。而且它**不稳定**：`[5a, 5b, 2]` 第一轮交换就把两个 5 的相对顺序换掉了。冒泡排序则是插入排序的低配版：

```python
def bubble_sort(a):
    n = len(a)
    while n > 1:
        last = 0
        for i in range(1, n):
            if a[i - 1] > a[i]:
                a[i - 1], a[i] = a[i], a[i - 1]
                last = i                # 本轮最后一次交换之后都已就位
        n = last                        # 下一轮不必再看尾巴
    return a
```

为什么它慢：一次相邻交换只能消除**一个逆序对**，而逆序对最多 n(n-1)/2 个，于是比较和交换都是平方级。插入排序也看逆序对，但它把「交换」拆成「移动 + 一次赋值」，常数小 3~5 倍，内层还是可预测的顺序扫描。冒泡唯一剩下的价值是好懂；工程里没有它的位置。

三种平方级算法的常数差着数量级：n = 5 万时插入排序几十毫秒、冒泡几十秒。反过来，长度小于 16~64 的子问题上插入排序通常比分治法更快——这正是内置排序拿它当基座的原因。

## 8.2 归并排序：分治、稳定与 O(n) 空间

归并的分解方式是**先切成两半各自排好，再线性合并**；合并两个有序序列只需反复比较两端较小者，长度 n 的合并是 O(n)（递归调用树与递推式见 [第 10 章 · 递归与分治](./10-recursion-divide/)）。

```python
def merge_sort(a):
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    left, right = merge_sort(a[:mid]), merge_sort(a[mid:])
    out, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        take_left = left[i] <= right[j]      # <= ：相等时取左边 → 稳定
        out.append(left[i] if take_left else right[j])
        i, j = i + take_left, j + (not take_left)
    return out + left[i:] + right[j:]
```

归并的关键性质：**最好、最坏、平均都是 O(n log n)**，完全不受输入分布影响；代价是 O(n) 辅助空间。它天生适合链表（拼接不用搬元素）和外部排序（两个磁盘文件线性合并）。

## 8.3 快速排序：划分、随机化与最坏情况

快排把归并的顺序反过来：**先划分再递归**。选一个枢轴，小的挪左边、大的挪右边，枢轴落到最终位置，然后只递归两侧。划分是原地的，这就是它省空间的来源。

```python
import random

def quick_sort(a, lo=0, hi=None):
    hi = len(a) - 1 if hi is None else hi
    if lo >= hi:
        return a                          # 长度 0 或 1，直接收工
    k = random.randint(lo, hi)          # 随机枢轴：最坏情况与输入顺序解耦
    a[k], a[hi] = a[hi], a[k]
    p = lo                              # Lomuto 划分：a[lo:p] 严格小于枢轴
    for i in range(lo, hi):
        if a[i] < a[hi]:
            a[p], a[i] = a[i], a[p]
            p += 1
    a[p], a[hi] = a[hi], a[p]           # 枢轴归位，之后再不动它
    quick_sort(a, lo, p - 1)
    quick_sort(a, p + 1, hi)
    return a
```

平均 O(n log n)、原地、顺序扫描缓存友好，所以它是实践中的默认选择。但**最坏 O(n²)**：每次划分只切掉一个元素。触发条件是「枢轴恰好是当前区间的最大或最小值」，最典型的输入就是**已经有序的数组配上「固定取首/末元素」的枢轴**。随机化把它降级成「几乎不可能发生的概率事件」；工程上也常用三数取中（首、中、尾取中位数）代替随机数。

另一个地雷是**大量重复元素**：二路划分遇到 n 个相同值时同样退化。解法是三路划分（荷兰国旗），等于枢轴的元素一次性归位，不再进入任何一侧递归。

```python
def quick_sort_3way(a, lo=0, hi=None):
    hi = len(a) - 1 if hi is None else hi
    if lo >= hi:
        return a
    pivot = a[lo]
    lt, i, gt = lo, lo, hi        # 不变式：a[lo:lt] < pivot ≤ a[i:gt] ≤ a[gt+1:]
    while i <= gt:
        if a[i] < pivot:
            a[lt], a[i] = a[i], a[lt]
            lt, i = lt + 1, i + 1
        elif a[i] > pivot:
            a[i], a[gt] = a[gt], a[i]
            gt -= 1               # 换过来的元素还没检查，i 不动
        else:
            i += 1
    quick_sort_3way(a, lo, lt - 1)
    quick_sort_3way(a, gt + 1, hi)
    return a
```

还要注意栈深：先递归较小的一侧、把较大一侧写成循环，最坏栈深就是 O(log n)；否则「有序输入 + 差枢轴」会先把调用栈打爆再退化——Python 默认只有约 1000 层递归。

## 8.4 堆排序：原地的 O(n log n) 保证

堆是用数组表示的完全二叉树，父节点始终不小于子节点（结构细节见 [第 6 章 · 堆与优先队列](./06-heap/)）。堆排序只做两件事：建堆，然后反复把堆顶换到数组末尾并缩小堆。

```python
def heap_sort(a):
    def sift_down(i, size):
        while True:
            best, l, r = i, 2 * i + 1, 2 * i + 2
            if l < size and a[l] > a[best]:
                best = l
            if r < size and a[r] > a[best]:
                best = r
            if best == i:
                return
            a[i], a[best] = a[best], a[i]
            i = best
    n = len(a)
    for i in range(n // 2 - 1, -1, -1):    # 自底向上建堆，总代价 O(n) 而非 O(n log n)
        sift_down(i, n)
    for end in range(n - 1, 0, -1):
        a[0], a[end] = a[end], a[0]        # 当前最大值归位
        sift_down(0, end)
    return a
```

它的价值是**最坏情况也是 O(n log n) 且严格原地**（O(1) 额外空间）——当输入可能被外部构造、又不允许 O(n) 辅助内存时，堆排序是安全牌。代价是不稳定，而且每次比较要跳到两个子节点，缓存命中率差，实测常比快排慢 2~3 倍。`introsort` 的设计正是「快排为主，递归深度超限就切到堆排」。

## 8.5 计数与基数：跳出比较下界

前面几种都在做两两比较。**任何比较排序都逃不出 Ω(n log n)**：n 个元素有 n! 种排列，高度 h 的判定树最多 2^h 个叶子，要覆盖全部结果就得 2^h ≥ n!，取对数即 h = Ω(n log n)。想更快只能**放弃比较**，改用元素自身携带的信息。

```python
def counting_sort(a, k):
    """前提：a 是非负整数，取值范围 0..k-1；稳定"""
    cnt = [0] * k
    for x in a:
        cnt[x] += 1                   # 只统计次数，不做任何比较
    for i in range(1, k):
        cnt[i] += cnt[i - 1]          # 前缀和：值 i 在结果里的右边界
    out = [0] * len(a)
    for x in reversed(a):             # 倒序回填 → 同值元素保持原序
        cnt[x] -= 1
        out[cnt[x]] = x
    return out
```

复杂度 O(n + k)，适用前提写得很明白：**取值是整数、范围 k 不能远大于 n**。n = 10 万而 k = 10⁹（时间戳）时，`cnt` 要申请 10⁹ 个格子，内存直接爆——那种场景改用哈希表计数，或者退回比较排序。

基数排序把整数拆成一位一位，逐轮做**稳定**排序（LSD 从低位到高位）。低位已经排好，高位这一轮绝不能打乱低位的相对顺序，否则前面几轮全白做——这是它对稳定性的硬依赖。

```python
def radix_sort(a):
    """非负整数；轮数 = max 的十进制位数，每轮 O(n + 10)"""
    if not a:
        return a
    for d in range(len(str(max(a)))):
        base = 10 ** d
        buckets = [[] for _ in range(10)]
        for x in a:
            buckets[(x // base) % 10].append(x)   # 按桶顺序摊平即保持该位稳定
        a = [x for b in buckets for x in b]
    return a
```

:::caution[别把「线性时间」当真]
计数与基数的复杂度里藏着 k 和位数 d。用 8 bit 一轮处理 64 位整数要 8 轮，当 d 与 log n 同量级时 O(d·n) 已经不比 O(n log n) 省。它们的真实优势是常数小、逻辑简单，而不是渐近阶。
:::

## 8.6 稳定性到底改变什么

稳定 = 值相等的元素保持排序前的相对顺序。它决定三类需求的对错：多关键字排序（先排次键再排主键，全靠主键那一轮不动次键成果）、业务隐式次序（同分按提交先后）、可复现的对外展示（同一时间戳的日志每次刷新都换序就会被当成 bug）。错一次就会得到明确不同的结果：

```python
logs = [("/a", 500, 1), ("/b", 200, 2), ("/a", 200, 3), ("/a", 500, 4)]
# 需求：先按 path 分组，组内按 status 升序，同 (path, status) 保持 ts 的原始先后

# 错写法：先排主键再排次键 —— 最后一次排序说了算，
#         结果整体按 status 排，path 只是同 status 里碰巧挨着
sorted(sorted(logs, key=lambda r: r[0]), key=lambda r: r[1])
#   → [("/a", 200, 3), ("/b", 200, 2), ("/a", 500, 1), ("/a", 500, 4)]：/a 被拆成两段

# 正确写法 1：从次要关键字排到主要关键字，每一轮都要稳定
step = sorted(logs, key=lambda r: r[1])              # 次键；ts 次序在这一轮保留
result = sorted(step, key=lambda r: r[0])            # 主键放在最后一轮

# 正确写法 2（首选）：一次元组比较，语义直白且不依赖稳定性
result = sorted(logs, key=lambda r: (r[0], r[1], r[2]))
```

写法 1 在 Python 里成立，只因为 `sorted` 稳定；换成不保证稳定的实现（如 C++ `std::sort`），「同 status 保持 ts 顺序」这一条立刻丢失，必须换成 `stable_sort` 或改用写法 2 把 ts 放进比较器。

:::tip[`reverse=True` 不会破坏稳定性]
Python 的行为是：相等键的元素原序保留，`reverse` 只反转比较结果、不反转相等元素。想「分数降序、同分按提交先后」，直接 `sorted(rows, key=lambda r: (-r.score, r.submitted))` 最稳。
:::

## 8.7 综合练习：给十万条日志挑排序

场景：10 万条访问日志 `(路径, 状态码, 耗时毫秒, 时间戳)`，要求按路径分组、组内按耗时降序、同耗时按时间戳升序。约束：耗时是非负整数、内存不能翻倍、结果必须可复现。

```python
import random

logs = [(random.choice(["/api/a", "/api/b", "/home"]), random.choice([200, 500]),
         random.randint(0, 999999), i) for i in range(100000)]
result = sorted(logs, key=lambda r: (r[0], -r[2], r[3]))     # 一次元组 key
```

选型对照本章各节：路径是字符串，计数/基数直接出局；同组内要稳定保留时间戳顺序，于是要选稳定算法（归并类，即 Python 的 `sorted`）；「内存不能翻倍」就把整体排序换成「先按路径分桶，桶内各自 `sort()`」，额外空间限制在单桶规模内；耗时范围只有 10⁶，若分组后桶内只按耗时排，对这一维单独上计数排序才有意义。各语言内置排序的实际选型如下（细节以官方文档为准）：

```text
Python      sorted / list.sort → Timsort（归并 + 插入混合，稳定，善于吃已有有序段）
Java        Arrays.sort 基本类型 → 双枢轴快排（不稳定）；对象数组 → TimSort（稳定）
C++         std::sort → introsort（快排 + 深度超限转堆排，不稳定）；std::stable_sort → 归并
Go          sort 包基于比较器，较新版本用 pdqsort；需要稳定请显式用稳定入口
JavaScript  ES2019 起规范要求 Array.prototype.sort 稳定
```

:::danger[别在业务代码里手写快排]
丢掉随机化、三路划分、栈深保护的手写版本，会在「输入近乎有序」或「大量重复键」上退化成 O(n²)。内置实现是数百万工程验证过的；本章手写代码的用途是理解机制，不是替换调用。
:::

## 本章小结

- 平方级三兄弟各有位置：插入排序吃「近乎有序」并充当工业实现的基座，选择排序写次数最少，冒泡只是教学模型
- 归并稳定且三种情况都是 O(n log n) 但要 O(n) 空间；快排原地最快，靠随机化和三路划分躲开有序输入与重复键；堆排序给出严格原地的最坏 O(n log n)，代价是缓存不友好
- 计数与基数靠放弃比较拿到线性时间，前提是整数且值域可控；比较排序的 Ω(n log n) 下界来自判定树至少要 n! 个叶子
- 稳定性决定多关键字排序和「同值保留原序」需求的对错；实战一律从内置排序开始，并先查清它是否稳定
