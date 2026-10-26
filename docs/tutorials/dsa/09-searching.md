---
title: 查找与二分
---

# 第 9 章 · 查找与二分

**本章目标：**

- 分清线性查找与二分各自的前提，理解「有序」和「可随机访问」为什么缺一不可
- 掌握三种边界写法及其不变式，能一眼看出 off-by-one 出在哪一步
- 会把「求最小可行值」「旋转数组」「局部极值」都归约成同一个二分骨架

## 9.1 线性与二分：两个前提，不只是一个

线性查找不需要任何前提，从头扫到尾，O(n)；它唯一的优势是**什么数据都能处理**。二分把 O(n) 压成 O(log n)，靠的是一次比较砍掉一半候选——但这要求候选集满足两个条件：

```text
有序性：存在一个判定谓词 p，沿数组从左到右是「一路 False 然后一路 True」的单调形状
随机访问：任何一次都能 O(1) 跳到中间位置
```

第一条常被简化成「数组要有序」，更准确的说法是**判定函数单调**：找「第一个不小于 x 的位置」时，谓词是 `a[i] >= x`，只要数组有序它必然单调；找旋转数组里的边界时，谓词换成「`a[i]` 在左半段吗」，同样单调，尽管数组整体并不有序。

第二条决定了数据结构能不能用二分。链表上每次取 mid 都要从头走 O(n) 步，总共 log n 次，合起来 O(n log n)——比线性扫描还慢。**有序链表要快查就得上跳表**（用多层指针把「跳」变成 O(1)，见 [第 5 章 · 树与二叉搜索树](./05-tree-bst) 里的平衡思想），或者干脆换成数组。哈希表则是另一条路：它放弃有序性换来 O(1) 等值查找（[第 4 章 · 哈希表](./04-hash-table)），但范围查询和「最近的一个」它都做不了。

::: tip 二分的真正用法是「找临界点」
不要把它想成「在数组里找元素」，而是想成「在一条单调的候选轴上找到 True/False 的分界线」。元素查找、二分答案、旋转数组、局部极值，全都是这一件事。
:::

## 9.2 三种边界写法与一个统一模板

三种写法都对，区别只在候选区间的定义。**选一种并且从头到尾只用它**，比会写三种重要得多。

```python
def lower_bound(a, x):
    """第一个 >= x 的下标；若全都小于 x 返回 len(a)。半开区间 [lo, hi)"""
    lo, hi = 0, len(a)
    while lo < hi:                       # 区间非空 ⟺ lo < hi
        mid = (lo + hi) // 2
        if a[mid] < x:                   # mid 一定不是答案
            lo = mid + 1
        else:                            # mid 可能是答案，不能丢
            hi = mid
    return lo

def upper_bound(a, x):
    """第一个 > x 的下标"""
    lo, hi = 0, len(a)
    while lo < hi:
        mid = (lo + hi) // 2
        if a[mid] <= x:
            lo = mid + 1
        else:
            hi = mid
    return lo
```

闭区间版（`[lo, hi]`）把三处一起改掉即可：`hi = len(a) - 1`、`while lo <= hi`、命中不到时返回 `lo`。第三种是「哨兵开区间」`(lo, hi)`，令 `lo = -1`、`hi = len(a)`，循环条件 `while hi - lo > 1`，退出时 `hi` 就是第一个满足谓词的位置——它把「可能没有答案」编码成哨兵，写起来最不容易出错，代价是多两个变量。

| 区间定义 | 循环条件 | 排除 mid 时 | 保留 mid 时 |
| --- | --- | --- | --- |
| 半开 `[lo, hi)` | `lo < hi` | `lo = mid + 1` | `hi = mid` |
| 闭 `[lo, hi]` | `lo <= hi` | `lo = mid + 1` | `hi = mid - 1` |
| 开区间 `(lo, hi)` | `hi - lo > 1` | `lo = mid` | `hi = mid` |

标准库已经把这套语义实现好了：`bisect.bisect_left` 等价于 `lower_bound`，`bisect.bisect_right` 等价于 `upper_bound`。手写是为了理解，实际项目里直接用它们更快也更不容易错。

## 9.3 off-by-one 从哪里来

死循环、漏解、多解，成因只有四类：

```text
1. 循环条件和收缩语句不匹配：半开区间写成 while lo <= hi，退出时 lo == hi + 1
2. 该丢 mid 时没丢：谓词说 mid 不可能，却写 hi = mid → 区间不再缩小 → 死循环
3. 该留 mid 时丢了：mid 可能就是答案，却写 hi = mid - 1 → 直接跳过正确位置
4. 边界量纲混用：把「长度」当「下标」用，或把返回值当下标直接访问 a[lo]
```

对照最清楚：

```text
错误写法  while lo < hi:  ... hi = mid - 1     # 半开区间 + 闭区间收缩 → 可能漏掉答案
正确写法  while lo < hi:  ... hi = mid         # 配对：区间始终包含所有候选

错误写法  while lo <= hi: ... lo = mid         # mid 已判定不可行，却留在区间里 → 死循环
正确写法  while lo <= hi: ... lo = mid + 1     # 配对：每轮候选数严格减少
```

第 4 类在 Python 里表现为 `IndexError`：`lower_bound` 的返回值可以是 `len(a)`（表示「没有元素满足」），必须先判 `lo == len(a)` 或 `a[lo] == x` 再访问。

::: warning 溢出是别的语言的事，但习惯要养成
C/Java 里 `(lo + hi) / 2` 在两个大下标相加时会溢出成负数——这个 bug 在 Java 标准库里潜伏了近十年才修。Python 整数不会溢出，但仍然建议写 `lo + (hi - lo) // 2`，让你移植的代码不至于在这里翻车。
:::

## 9.4 二分答案：判定单调就能二分

有一类问题里没有数组，只有一个「候选答案的取值范围」和「给定答案能否实现」的判定函数。只要**可行性随候选值单调**（越大越容易满足），就可以二分答案，把 O(范围) 的枚举压成 O(log 范围 × 判定代价)。

```python
def min_feasible(lo, hi, ok):
    """在 [lo, hi] 中找第一个使 ok 为真的值，调用方保证 hi 一定可行"""
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if ok(mid):
            hi = mid                      # mid 可行，但它可能不是最小
        else:
            lo = mid + 1                  # mid 不可行，更小也不行
    return lo
```

模板有了，剩下的只是写出 `ok`。题目：把数组顺序切成 m 段，让「最大段和」尽量小——`ok(cap)` 就是「每段上限取 cap 时，m 段装得下吗」。

```python
def split_possible(a, m, cap):
    parts, used = 1, 0
    for x in a:
        if x > cap:                       # 单个元素超容，任何切法都失败
            return False
        if used + x > cap:                # 装满这一段，开新段
            parts, used = parts + 1, x
        else:
            used += x
    return parts <= m

def smallest_cap(a, m):
    """套模板即可：下界是最大元素，上界 sum(a) 一定可行（前提 m >= 1）"""
    ok = lambda cap: split_possible(a, m, cap)
    return min_feasible(max(a), sum(a), ok)
```

::: danger 二分答案的前提是「单调」，不是「有序」
如果 `ok` 的值随候选增大而反复 True/False 跳变，二分一定给出错误答案，而且很难发现。写完 `ok` 先自问：`ok(x)` 为真时，`ok(x+1)` 是否必然为真？答不出来就不能二分，只能老老实实枚举或换动态规划（[第 11 章 · 动态规划入门](./11-dp)）。
:::

## 9.5 旋转数组与局部极值

旋转数组 `[4,5,6,1,2,3]` 整体无序，但它是**两段有序拼接**，所以「最小值在哪一侧」这个谓词依然单调：

```python
def rotated_min(a):
    lo, hi = 0, len(a) - 1                # 闭区间，答案一定在里面
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if a[mid] > a[hi]:                # mid 在较大的右段之前 → 最小值在 mid 右边
            lo = mid + 1
        elif a[mid] < a[hi]:
            hi = mid                      # mid 自己就可能是最小值，不能丢
        else:
            hi -= 1                       # a[mid] == a[hi] 无法判断，只削掉一个
    return a[lo]
```

三个分支里 `else` 是**重复元素**逼出来的：`[1,1,1,0,1]` 中 mid 和 hi 相等，无法判断最小值在哪边，只能保守地 `hi -= 1`，最坏退化到 O(n)。这也是二分复杂度分析里少见的「有序性被破坏后无法保证 log」的例子。

局部极值（找出比左右邻居都大的下标）看似与有序无关，其实同样单调：只要数组两端视为负无穷，一直沿上坡走就一定会撞上峰。

```python
def find_peak(a):
    lo, hi = 0, len(a) - 1
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if a[mid] < a[mid + 1]:           # 右边在上坡，[mid+1, hi] 里必有峰
            lo = mid + 1
        else:                             # 下坡或平地，峰在 [lo, mid]
            hi = mid
    return lo
```

::: tip 为什么 `a[mid + 1]` 不会越界
循环条件是 `lo < hi`，所以 mid 恒小于 hi，`mid + 1` 至多等于 hi，永远在数组内。这类「下标偏移安全性」不是运气，而是区间不变式给的保证——把不变式写清楚，越界问题当场就能排除。
:::

## 9.6 插值查找与指数查找

二分假设「值在位置上均匀分布」，但每次只砍一半，不看值的大小。如果数据分布均匀，可以用线性插值直接估出位置，平均复杂度降到 O(log log n)：

```python
def interpolation_search(a, x):
    lo, hi = 0, len(a) - 1
    while lo <= hi and a[lo] <= x <= a[hi]:
        span = a[hi] - a[lo]
        if span == 0:                     # 区间内全部相等，避免除零
            return lo if a[lo] == x else -1
        pos = lo + (x - a[lo]) * (hi - lo) // span   # 按比例估位置
        if a[pos] == x:
            return pos
        if a[pos] < x:
            lo = pos + 1
        else:
            hi = pos - 1
    return -1
```

代价是**最坏仍是 O(n)**：数据分布极端不均（几何增长）时每刀只切掉一个元素。所以它属于「分布已知均匀才用」的优化，不适合当作通用替代。

指数查找（也叫 galloping）解决另一类问题：**不知道边界**。从 1 开始按 2 的幂向后探，探到第一个不小于 x 的位置，区间就确定了，再在其中二分——总代价 O(log n)，且不需要预先知道长度。适合无界/流式有序序列、按行数递增的日志文件；归并排序里「跳过一大段同侧元素」的加速（`_gallop`）用的正是同一招。

```python
def exponential_search(a, x):
    if not a or a[0] > x:
        return -1
    bound, n = 1, len(a)
    while bound < n and a[bound] < x:     # 先倍增定出上界
        bound *= 2
    lo, hi = bound // 2, min(bound, n - 1)
    while lo <= hi:                       # 再在这个小区间里二分
        mid = lo + (hi - lo) // 2
        if a[mid] == x:
            return mid
        if a[mid] < x:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
```

## 9.7 综合练习：四个查询一次搞定

有序数组（含重复值）上，`x` 的出现次数、第一次出现的位置、最后一次出现的位置，都可以只用 `lower_bound` 表达。下面脚本可直接运行，并与标准库对拍：

```python
from bisect import bisect_left, bisect_right

def lower_bound(a, x):
    lo, hi = 0, len(a)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        lo, hi = (mid + 1, hi) if a[mid] < x else (lo, mid)
    return lo

a = [1, 3, 3, 3, 5, 8, 8, 13]
for x in (3, 8, 7):
    left = lower_bound(a, x)
    right = bisect_right(a, x)            # 第一个 > x
    print("x=%-2d 下界=%d 上界=%d 次数=%d 存在=%s"
          % (x, left, right, right - left, left < right and a[left] == x))
```

```text
$ python bsearch.py
x=3  下界=1 上界=4 次数=3 存在=True
x=8  下界=5 上界=7 次数=2 存在=True
x=7  下界=5 上界=5 次数=0 存在=False
```

`存在=False` 那一行是本章最容易踩的坑：`left == len(a)` 时 `a[left]` 直接越界，必须靠 `and` 的短路顺序把下标访问挡在后面。把 `x = 20` 加进循环验证一下，如果你的写法在这里抛异常，说明第 4 类边界还没守住。

## 本章小结

- 二分的两个前提缺一不可：判定谓词单调（不只是「数组有序」）与 O(1) 随机访问（有序链表要靠跳表或指数查找）
- 三种边界写法是同一套逻辑：循环条件必须是「区间非空」的表达，收缩语句要和它配对，否则要么死循环要么漏解
- 手写二分请统一用 `lo + (hi - lo) // 2` 并先检查返回下标是否等于 `len(a)`；生产代码直接调 `bisect` 系列
- 二分答案、旋转数组、局部极值都是「找临界点」的实例，判据是可行性谓词单调；分布均匀可用插值查找提速，边界未知用指数查找
