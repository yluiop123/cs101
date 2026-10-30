---
title: "第 1 章 · 复杂度分析与数据结构全景"
description: "复杂度回答的不是\"这段代码跑多少秒\"，而是输入规模 n 变大时，耗时或内存按什么趋势增长。换更快的机器、换更新的解释器，耗时会变，增长趋势不变——这正是大 O 能跨语言、跨机器比较的原因。"
series: dsa
sidebar:
  order: 1
  label: "复杂度分析与数据结构全景"
difficulty: intermediate
duration: 7
tableOfContents: true
---

**本章目标：**

- 能算出循环、嵌套循环与递归代码的时间复杂度和空间复杂度
- 分清最好、最坏、平均、摊还四种口径，不被常量因子误导
- 面对同一份数据，能按操作画像在多种结构之间给出选型理由

## 1.1 大 O 到底在比什么

复杂度回答的不是"这段代码跑多少秒"，而是**输入规模 n 变大时，耗时或内存按什么趋势增长**。换更快的机器、换更新的解释器，耗时会变，增长趋势不变——这正是大 O 能跨语言、跨机器比较的原因。

分析只有两步：写出基本操作执行次数关于 n 的函数，再保留最高阶并丢掉系数。例如 `T(n) = 3n^2 + 20n + 500`，结论是 `O(n^2)`。丢系数有个前提：**比较双方量级不同**。n^2 与 n log n 在 n 够大时必然分出胜负；但同为 O(n) 的两份代码，系数差 100 倍就是真实差 100 倍，这时必须实测。

```python
import time

def contains_all(haystack, needles):
    # 列表的 in 是一次线性扫描，所以整体是 O(n * m)
    return sum(1 for x in needles if x in haystack)

def contains_all_with_set(haystack, needles):
    lookup = set(haystack)          # 建集合 O(n)，之后每次 in 是 O(1)
    return sum(1 for x in needles if x in lookup)

def time_it(func, n):
    data = (list(range(n)), list(range(0, n, 2)))
    start = time.perf_counter()
    func(*data)
    return time.perf_counter() - start

if __name__ == "__main__":
    for n in (2_000, 8_000):
        t1, t2 = time_it(contains_all, n), time_it(contains_all_with_set, n)
        print(f"n={n:6d}  列表版 {t1 * 1000:8.1f} ms   集合版 {t2 * 1000:7.1f} ms")
```

```text
C:\code\dsa> python growth.py
n=  2000  列表版      7.9 ms   集合版     0.2 ms
n=  8000  列表版    126.3 ms   集合版     0.7 ms
```

列表版 n 乘以 4、耗时约乘以 16（平方趋势），集合版 n 乘以 4、耗时约乘以 4（线性趋势）。实测曲线是验证复杂度判断的最好工具。

## 1.2 时间复杂度怎么算

四条规则覆盖 90% 的场景：

```text
顺序规则   两段代码先后执行，取最高阶：O(n) + O(n^2) = O(n^2)
循环规则   循环体 O(f(n)) 执行 k 次，得 O(k * f(n))
嵌套规则   层数相乘，但要看内层上限是否依赖外层变量
对数规则   每轮规模减半（二分、快排划分），出现 log n
```

常见量级的直观感受（n = 10^6，假设每秒完成 10^8 次基本操作）：

| 量级 | 名称 | 直观感受 | 典型场景 |
| --- | --- | --- | --- |
| O(1) | 常数 | 瞬间 | 数组按下标取元素、哈希表命中 |
| O(log n) | 对数 | 约 20 次 | 二分查找、平衡树下降一层 |
| O(n) | 线性 | 约 10 毫秒 | 遍历、求和、装填哈希表 |
| O(n log n) | 线性对数 | 约 200 毫秒 | 高效排序、遍历加平衡树操作 |
| O(n^2) | 平方 | 约 17 分钟 | 双重遍历、冒泡排序 |
| O(2^n) | 指数 | 算不完 | 暴力子集枚举、朴素递归斐波那契 |

:::tip[判断量级最快的办法：数总执行次数]
别看有几层循环，看**总共做了多少次操作**。外层 `for i in range(n)` 配内层 `for j in range(i, n)` 是两层，但总次数是 n(n+1)/2，仍是 O(n^2)；外层 `for i in range(n)` 配内层 `while k < n: k *= 2` 则是 O(n log n)。
:::

## 1.3 最好、最坏、平均与摊还

同一算法在不同输入上表现不同，于是有四种口径：

```text
最好情况   输入让算法最早结束（第一个元素就命中）
最坏情况   输入让算法付出最大代价（数据恰好逆序、哈希全部冲突）
平均情况   对所有输入按某种分布取期望，需要假设且推导困难
摊还分析   对同一结构的 m 次操作求总代价再平均，保证连续用不会亏
```

**摊还与平均是两回事**，这是最容易混的点。以动态数组追加为例：绝大多数追加只写一个格子，偶尔一次要整体搬家。摊还分析把搬家成本分摊到之前每次追加头上，得出"连续 n 次 append 总计 O(n)，单次摊还 O(1)"。它不依赖概率假设，是**最坏情况下的保证**，比平均结论更硬。

```python
def growth_cost(n):
    size = capacity = moves = 0
    for _ in range(n):
        if size == capacity:
            new_cap = 4 if capacity == 0 else capacity + capacity // 8 + 4
            moves += capacity       # 旧元素整体复制一次
            capacity = new_cap
        size += 1
    return size, moves

if __name__ == "__main__":
    for n in (1_000, 10_000, 100_000, 1_000_000):
        _, moves = growth_cost(n)
        print(f"追加 {n:8d} 次，累计复制 {moves:9d} 个，均摊 {moves / n:.2f} 次每操作")
```

复制总量约为元素数的 8 倍上下，是个**常数**倍，所以 n 次追加仍是 O(n)。这就是 `list.append` 能放心用在热路径里的底气（机制详见 [第 2 章 · 数组与链表](../02-array-linked/)）。

## 1.4 空间复杂度与大 O 的常见误读

空间复杂度统计**随输入规模增长的额外内存**，输入本身通常不计入（除非要求原地）。递归必须算上调用栈：深度 d 就是 O(d) 额外空间，很多人正是漏掉这一项才写出栈溢出。

```text
误读 1  "O(1) 就是很快"   → 只说明与 n 无关；哈希冲突退化成链时，O(1) 的常数可以是整条链
误读 2  "O(n) 必优于 O(n log n)" → 若 O(n) 那版每步新建字典，小规模时反而更慢
误读 3  "大 O 相同性能就相同" → 常量因子、缓存局部性、内存带宽都不在大 O 里
误读 4  "n 是什么不重要"   → 双变量问题要写清：文本匹配是 O(n * m)，把 n+m 当 n 会低估
误读 5  "复杂度高就是算法差" → 打印 n 乘 n 矩阵的输出规模本身是 O(n^2)，算法不可能更低
```

```python
def extra_space(data):
    m = max(data)                                 # O(1) 额外空间
    s = sorted(data)                              # O(n)：新建了一个列表
    mat = [[a + b for b in data] for a in data]   # O(n^2)
    return m, s, mat

if __name__ == "__main__":
    best, copy_sorted, matrix = extra_space([3, 1, 2])
    print("最大值", best, "排序副本", copy_sorted, "矩阵规模", len(matrix), "乘", len(matrix[0]))
```

:::caution[`sorted()` 与 `list.sort()` 不只是写法差别]
`sorted(data)` 分配新列表，额外空间 O(n)；`data.sort()` 原地排序，额外空间接近 O(1)（归并类算法仍可能借用约一半长度的临时缓冲）。百万级数据上这一项就能决定内存是否够用。
:::

## 1.5 递归式的代价估算

递归代码用**递归树加每层工作量**来估：层数是深度，每层节点数乘以该层非递归工作量就是这层的代价。下面三行分别对应主定理的三个直觉档位：代价集中在叶子层（指数）、每层线性而层数对数（n log n）、每层常数（log n）。

```text
fib(n) = fib(n-1) + fib(n-2)             分支 2、深度 n，节点约 2^n → 时间 O(2^n)、空间 O(n)
merge(n) = 2 个 merge(n/2) + O(n) 合并    层 log n、每层 O(n) → O(n log n)
binary(n) = 1 个 binary(n/2) + O(1)       层 log n、每层 O(1) → O(log n)
```

```python
from functools import lru_cache

CALLS = 0

def fib_naive(n):
    global CALLS
    CALLS += 1
    return n if n < 2 else fib_naive(n - 1) + fib_naive(n - 2)

@lru_cache(maxsize=None)
def fib_memo(n):
    return n if n < 2 else fib_memo(n - 1) + fib_memo(n - 2)

def sum_rec(items):
    return 0 if not items else items[0] + sum_rec(items[1:])

if __name__ == "__main__":
    for n in (10, 20, 28):
        CALLS = 0
        value = fib_naive(n)
        print(f"n={n:2d}  朴素递归调用 {CALLS:8d} 次  fib={value}")
    print("记忆化 fib(28):", fib_memo(28), fib_memo.cache_info())
    print("切片递归 500 项求和:", sum_rec(list(range(500))))
```

朴素版在 n=28 时调用次数已达百万级，记忆化后真正求值的参数只有 0 到 28 共 29 个：自顶向下记忆化把 O(2^n) 降为 O(n)，这正是第 11 章动态规划的起点。`sum_rec` 则是反面教材——每次 `items[1:]` 都复制一份新列表，时间从 O(n) 变成 O(n^2)，额外空间也是 O(n)，看起来"只有一行"的代码并不免费。

## 1.6 同一份数据为什么可以有多种结构

数据是同一份，结构是给它组织的**方式与索引**。选哪种取决于最高频的几个操作：查、插、删、遍历、排序、取极值。每种结构都在其中几项上强、在另几项上弱，所以"这份数据该用什么"没有标准答案，只有"这批操作该用什么"。

```python
from collections import deque

records = [("u1", 12), ("u2", 7), ("u3", 30)]
by_index = list(records)                            # 顺序即身份
by_name = {name: score for name, score in records}  # 按名字查：哈希
ordered = sorted(records, key=lambda r: r[1])       # 按分数排：有序视图
queue = deque(records)                              # 先进先出处理

if __name__ == "__main__":
    print(by_index[1], by_name["u2"], ordered[0], queue[0])
```

选型对照表（强表示擅长，弱表示代价高，无表示基本不支持）：

| 操作 | 数组/列表 | 链表 | 栈 | 队列 | 哈希表 | 平衡树 | 堆 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 按下标随机访问 | 强 | 无 | 无 | 无 | 无 | 弱 | 无 |
| 按关键字查找 | 弱 | 弱 | 无 | 无 | 强 | 强 | 弱 |
| 头部插入/删除 | 弱（O(n)） | 强 | 弱 | 强 | 无 | 强 | 无 |
| 保持有序遍历 | 弱 | 弱 | 无 | 无 | 无 | 强 | 弱 |
| 反复取极值 | 弱 | 弱 | 无 | 无 | 无 | 强 | 强 |
| 额外内存 | 紧凑 | 每节点两三个指针 | 少 | 少 | 桶数组有空槽 | 左右子加颜色或高度 | 紧凑 |

:::tip[一句话选型法]
先写下"一秒内会调用一百万次的操作是哪一个"，再排除在这个操作上不擅长的结构。按 key 秒查用哈希表（第 4 章 · 哈希表（整理中））；既要秒查又要按 key 有序用平衡树（第 5 章 · 树与二叉搜索树（整理中））；只要最值不要全序用堆（第 6 章 · 堆与优先队列（整理中））。
:::

## 1.7 综合练习：给五段代码定复杂度

判断每段的量级，并说清变量是什么。最后一段脚本把真实执行量打印出来，可以印证你的判断。

```python
def seg_a(n):
    for _ in range(n):
        for _ in range(n, 2 * n):
            pass

def seg_b(n):
    rounds, i = 0, 1
    while i < n:
        i *= 3
        rounds += 1
    return rounds

def seg_c(arr):
    return sum(sum(arr) for _ in arr)   # 每轮都重新遍历一次全表

def seg_d(n):
    return 1 if n <= 1 else seg_d(n - 1) + seg_d(n - 1)

def seg_e(words):
    return len(set(words))              # 哈希表逐个装填

if __name__ == "__main__":
    print("seg_b(200) 轮数", seg_b(200), " seg_d(18) 返回值", seg_d(18))
    print("seg_c 传入 50 个元素时的加法次数", 50 * 50, " 去重数", seg_e(["a", "b", "a", "c"]))
```

错误写法与正确写法对照：

```text
错：seg_a 只答"两层循环所以 O(n^2)"，不解释内层范围。正：range(n, 2 * n) 长度恰好是 n，外层 n 次乘内层 n 次是 O(n^2)，起点是 n 还是 0 不影响量级，只影响常数
错：seg_c 判为 O(n^2) 就收工，不再优化。正：量级判断正确，但每轮 sum(arr) 都重新遍历全表，热路径应改成维护累加器，降到 O(n)
错：seg_d 只有 n 层递归，判为 O(n)。正：每层分裂出两个子问题，调用总数是 2^n 量级；写成 2 * seg_d(n - 1) 立刻降到 O(n)
```

参考答案：

```text
seg_a  O(n^2) —— 外层 n 次，内层固定 n 次
seg_b  O(log n) —— 每轮规模除以 3，对数的底数在量级里可忽略
seg_c  O(n^2) —— 循环体内藏了一次全表遍历，这是最隐蔽的性能陷阱
seg_d  O(2^n) 次调用、O(n) 栈空间 —— 递归树每层节点翻倍
seg_e  O(n) 时间、O(n) 空间 —— 哈希表逐个装填，见第 4 章 · 哈希表（整理中）
```

## 本章小结

- 大 O 描述增长趋势而非耗时：抓最高阶、丢常数，但同量级之间必须靠实测比较
- 最好/最坏/平均依赖输入分布，摊还则是对连续 m 次操作的最坏情况总保证，`list.append` 的 O(1) 就是摊还结论
- 空间复杂度别漏掉递归栈与切片复制：`sorted()` 需要 O(n) 额外空间，`list.sort()` 接近原地
- 结构选择只看"最高频的三个操作"：秒查用哈希表，秒查又有序用平衡树，只要极值用堆
