---
title: "第 10 章 · 递归与分治"
description: "一个正确的递归必须同时给出三件东西，缺一件就是 bug："
series: dsa
sidebar:
  order: 10
  label: "递归与分治"
difficulty: intermediate
duration: 7
tableOfContents: true
---

**本章目标：**

- 能用「基线 + 规模递减 + 组合方式」三要素检查任意递归代码，并画出它的栈帧
- 会用记忆化把指数级递归压成多项式，也知道 Python 不做尾递归优化该改写成什么
- 能用主定理的直觉判断递推式的阶，并认出分治的两类典型题形

## 10.1 递归三要素与栈帧里到底发生了什么

一个正确的递归必须同时给出三件东西，缺一件就是 bug：

```python
def fact(n):
    if n <= 1:                      # 1. 基线：可达，且不再递归
        return 1
    return n * fact(n - 1)          # 2. 规模严格变小  3. 用子问题的答案组合出当前答案
```

第 2 条最容易漏：`fact(n)` 里递归调用写成 `fact(n // 2)` 但基线只判 `n == 1`，`n = 3` 时永远跳不到基线；第 3 条最容易写错组合方向，比如把「先处理自己再处理子问题」和「先子问题再自己」混用（遍历序的区别见 第 5 章 · 树与二叉搜索树）。

`fact(4)` 的执行过程就是栈的压入弹出：

```text
fact(4)  ── 压栈，等待 4 * ?
  fact(3) ── 压栈，等待 3 * ?
    fact(2) ── 压栈，等待 2 * ?
      fact(1) ── 命中基线，返回 1
    ← 返回 2          每一层返回后才补上「等待的那一步」
  ← 返回 6
← 返回 24
栈深 = n，额外空间 O(n)：每层都要保存返回地址、局部变量和「尚未完成的乘法」
```

:::caution[递归的隐藏账单是栈深，不是代码行数]
写起来只要三行的递归，运行时要为每一层保留一个栈帧。n = 10 万时爆的是内存/栈，不是算力——分析复杂度时把「深度 × 每帧大小」算进空间项。
:::

## 10.2 尾递归、显式栈与 Python 的现实

如果递归调用是函数的**最后一个动作**，且返回值直接 `return`（外面没有任何待完成的运算），就叫尾递归：

```python
def fact_tail(n, acc=1):
    if n <= 1:
        return acc              # 答案全在参数里，返回时没有任何「等待」
    return fact_tail(n - 1, n * acc)
```

理论上编译器可以把它退化成循环（复用同一个栈帧，空间 O(1)），这是 Scheme、Erlang、OCaml 的语言级承诺。但 **CPython 不做尾调用优化**——为了 traceback 能显示完整调用链，也为了 `with`/异常语义清晰，这条优化被明确否决。所以 Python 里上面这份代码照样吃 O(n) 栈深，`fact_tail(100000, 1)` 依然 `RecursionError`（默认上限约 1000，`sys.getrecursionlimit()` 可查）。

```text
错误做法  在 Python 里靠尾递归写法来省空间，或者调大 setrecursionlimit 当万能药
          → 栈深没降，只是把崩溃点后移；帧太大时还会段错误，进程直接没了
正确做法  两种改写任选：① 逻辑是线性的就改成循环；② 需要多分支回溯就自己维护显式栈
```

线性情况改循环（把累加器变成变量）：

```python
def fact_loop(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result
```

多分支情况改显式栈——访问到的节点集合与递归版完全相同，只是栈在自己手里，可以按需压、按需弹：

```python
def walk(node):                       # 递归版：目录树遍历
    yield node.name
    for child in node.children:
        yield from walk(child)

def walk_iter(node):                  # 显式栈版：栈里放「还没展开的节点」
    stack = [node]
    while stack:
        cur = stack.pop()               # 后进先出，所以子节点要倒着压
        yield cur.name
        stack.extend(reversed(cur.children))   # 这样才与递归版的顺序一致
```

:::danger[递归不总是该被消灭]
分治、树遍历、回溯这三类结构，递归写法比迭代清晰得多，且深度是 O(log n) 或受数据规模天然限制。真正必须改写的是「深度随输入线性增长」的递归：链状结构遍历、长数组归约、用户可控的嵌套输入。
:::

## 10.3 记忆化：把指数降成多项式

朴素递归斐波那契的问题是**同一子问题被反复求解**：

```python
def fib_naive(n):
    return n if n < 2 else fib_naive(n - 1) + fib_naive(n - 2)
```

`fib(5)` 的调用树里 `fib(3)` 出现 2 次、`fib(2)` 出现 3 次；总调用次数满足 `T(n) = T(n-1) + T(n-2) + 1`，其阶与结果本身一样是 φⁿ ≈ 1.618ⁿ——**指数**。加一层「算过就查表」：

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib_memo(n):
    return n if n < 2 else fib_memo(n - 1) + fib_memo(n - 2)
```

每个不同的 `n` 只计算一次，代价从 φⁿ 变成 O(n)，空间 O(n)。手写版就是把字典显式写出来：

```python
def fib_memo_dict(n, memo={0: 0, 1: 1}):
    if n not in memo:
        memo[n] = fib_memo_dict(n - 1, memo) + fib_memo_dict(n - 2, memo)
    return memo[n]
```

:::caution[记忆化的两个使用前提]
一是子问题必须能用**可哈希的值**唯一标识（列表、生成器、对象状态当参数就不行，得先把状态压成元组）；二是函数**无副作用**——命中缓存意味着函数体根本没执行，往里塞打印、计数、写文件都会时灵时不灵。另外 `lru_cache` 挂在方法上会让实例长期不被回收，长期运行的服务要显式控制 `maxsize`。
:::

## 10.4 递推式与主定理直觉

分治的复杂度都是解一个递推式：`T(n) = a · T(n / b) + f(n)`——a 个子问题、每个规模降到 1/b、本层拆分与合并花 f(n)。**不用背公式**，只比两件事：子问题层的总规模 `n^log_b(a)` 与当前层代价 `f(n)`。

```text
f(n) 增长更慢 → 代价集中在叶子层，T(n) = Θ(n^log_b(a))
                例：a=4, b=2, f=n → Θ(n²)（朴素分治矩阵乘法）
两者同阶     → 每层贡献相同，共 log_b(n) 层，T(n) = Θ(n^log_b(a) · log n)
                例：归并/快排 a=2, b=2, f=n → Θ(n log n)
f(n) 增长更快 → 代价集中在根层，往下越算越便宜，T(n) = Θ(f(n))
                例：二分 a=1, b=2, f=1 → Θ(log n)；a=1, b=2, f=n → Θ(n)
```

三种「不减半」的递推式更要用直觉检验：`T(n) = T(n-1) + O(1)` 是 O(n)（线性递减，即减治）；`T(n) = T(n-1) + O(n)` 是 O(n²)——插入排序、单层循环的递归版都是它；`T(n) = 2T(n-1) + O(1)` 是 O(2ⁿ)，也就是上一节斐波那契的教训：**子问题数乘 2、规模只减 1，就是指数**。

判据简化成一句话：**每层工作量是增长还是缩减**。分治把它砍半（log n 层），递归不砍规模（n 层）；这也是为什么 [第 9 章 · 查找与二分](../09-searching/) 的二分是 O(log n) 而线性扫描是 O(n)。

## 10.5 分治题形一：靠「边界带」提速的最近点对

平面上 n 个点求最近一对。暴力两两比较是 O(n²)。分治的做法：按 x 坐标排序后二分，`d = min(左半最近, 右半最近)`，剩下的只有**跨边界**的点对可能更近，于是只需考察距离中线 `d` 以内的竖带。

```python
from math import inf

def dist(p, q):
    return (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2

def closest_pair(points):
    pts = sorted(points)                        # 按 x 排序，中线取中间下标
    def rec(lo, hi):
        if hi - lo <= 3:
            return min((dist(pts[i], pts[j])
                        for i in range(lo, hi) for j in range(i + 1, hi)), default=inf)
        mid = (lo + hi) // 2
        d = min(rec(lo, mid), rec(mid, hi))
        strip = sorted((p for p in pts[lo:hi] if (p[0] - pts[mid][0]) ** 2 < d),
                       key=lambda p: p[1])      # 带内按 y 重排
        for i, p in enumerate(strip):
            for q in strip[i + 1:i + 8]:        # 几何结论：只需再看至多 7 个
                if (q[1] - p[1]) ** 2 >= d:
                    break                       # y 已经差得太远，后面更差
                d = min(d, dist(p, q))
        return d
    return rec(0, len(pts))
```

关键在 `strip[i + 1 : i + 8]`：把带内每个点限制为「最多比较 7 个后继」，是把它按 y 排序后由「d×2d 矩形里最多放 8 个互距至少 d 的点」推出来的。少了这一步，合并层就退化成 O(n²)，整套分治白做。上面这版每层重排一次 y 序，总代价 O(n log² n)；把左右两半已经排好 y 的数组在合并时归并上来，就是标准 O(n log n)。

## 10.6 分治题形二：换一种划分就少一次乘法

两个 n 位整数相乘，竖式是 O(n²)。Karatsuba 把数字按位切成高低两半：`x = x1·B + x0`、`y = y1·B + y0`，则交叉项不需要两次乘法：

```python
def karatsuba(x, y):
    """非负整数；x < 10 or y < 10 时直接返回，规模每次砍半"""
    if x < 10 or y < 10:
        return x * y
    half = max(len(str(x)), len(str(y))) // 2
    base = 10 ** half
    x1, x0 = divmod(x, base)
    y1, y0 = divmod(y, base)
    z0 = karatsuba(x0, y0)
    z2 = karatsuba(x1, y1)
    z1 = karatsuba(x0 + x1, y0 + y1) - z0 - z2   # 三次乘法顶掉原来的四次
    return z2 * base * base + z1 * base + z0
```

递推式是 `T(n) = 3T(n/2) + O(n)`，按 10.4 的判据落在第一种情况，`log₂3 ≈ 1.585`，即 O(n^1.585)。同样的「减少子问题数」思路在快速幂里更常见——把 `x^n` 的规模折半：

```python
def power(x, n, mod=None):
    result, base = 1, x
    while n:
        if n & 1:                                  # 二进制这一位是 1 才乘进结果
            result = result * base if mod is None else result * base % mod
        base = base * base if mod is None else base * base % mod
        n >>= 1
    return result
```

`T(n) = T(n/2) + O(1)` → O(log n) 次乘法。注意取模版本里**每一步都取模**，否则中间结果先膨胀成巨型整数，再取模就已经慢了几十倍。

:::tip[分治的两个改造方向]
划分方式（切成几份、按什么切）决定子问题个数 a 和规模比 b；合并方式决定 f(n)。最近点对改的是合并（把 n² 压到 7n），Karatsuba 改的是子问题个数（4 → 3）。找优化时这两处轮流动手，别一上来就想换算法。
:::

## 10.7 综合练习：同一道题的四种写法

斐波那契把本章所有点串起来。下面脚本可直接运行，统计各自的递归调用次数：

```python
from functools import lru_cache

N, calls = 24, [0]      # 深度只有 24，不需要动 setrecursionlimit

def naive(n):
    calls[0] += 1
    return n if n < 2 else naive(n - 1) + naive(n - 2)

@lru_cache(maxsize=None)
def memo(n):
    return n if n < 2 else memo(n - 1) + memo(n - 2)

def bottom_up(n):
    if n < 2:
        return n
    table = [0, 1]                        # 基线先填好：F(0)、F(1)
    for i in range(2, n + 1):             # 再按规模从小到大往上推
        table.append(table[i - 1] + table[i - 2])
    return table[n]

def rolling(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b                   # 只留两个变量，空间 O(1)
    return a

first = naive(N)                      # 先跑完，再读计数器
print("naive 调用次数 =", calls[0], "| 结果 =", first)
print("结果一致 =", first == memo(N) == bottom_up(N) == rolling(N),
      "| memo 实际算过的子问题 =", memo.cache_info().currsize)
```

```text
$ python fib_variants.py
naive 调用次数 = 150049 | 结果 = 46368
结果一致 = True | memo 实际算过的子问题 = 25
```

选择顺序：深度随输入线性增长 → 用 `rolling`（迭代 + O(1) 空间）；子问题重复出现 → 记忆化（自顶向下最好写，但栈深仍是 O(n)）或 `bottom_up`（无栈深风险，还能顺手做滚动数组压缩）；子问题不重复、规模每次砍半 → 才是分治的主场（10.5、10.6）。自顶向下的记忆化和自底向上的填表是同一张依赖图的两个方向，详见 [第 11 章 · 动态规划入门](../11-dp/)。

## 本章小结

- 递归正确性看三要素：基线可达、规模严格变小、组合方向明确；递归的隐藏成本是栈深，空间要按「深度 × 每帧」计
- CPython 不做尾调用优化，尾递归写法省不了空间：线性逻辑改循环，多分支改显式栈；分治与回溯这类深度受控的递归才值得保留
- 记忆化靠「子问题可哈希 + 无副作用」把 φⁿ 的重复求解压成 O(n)；判指数 Look 递推式里「子问题个数 × 规模是否只减 1」
- 主定理直觉就是比子问题层规模 `n^log_b(a)` 与本层代价 `f(n)`；分治提速的两个抓手是减少子问题数（Karatsuba）和压低合并层代价（最近点对的边界带）
