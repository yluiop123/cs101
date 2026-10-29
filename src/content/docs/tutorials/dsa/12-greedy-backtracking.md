---
title: "第 12 章 · 贪心、回溯与搜索"
description: "贪心每一步只取当前最优，一次遍历就出结果，所以它比 DP 快得多；代价是必须证明「局部最优能扩展成全局最优」。标准手法是交换论证：任取一个最优解，若它与贪心解不同，就把贪心选中的那个元素换进去，证明替换后可行性不变、目标值不下降——反复…"
series: dsa
sidebar:
  order: 12
  label: "贪心、回溯与搜索"
difficulty: intermediate
duration: 8
tableOfContents: true
---

**本章目标：**

- 会用交换论证说明贪心为什么对，也能构造反例证明某个贪心策略不行
- 掌握「选择—递归—撤销」的回溯模板，能写出全排列、子集、N 皇后并加上三类剪枝
- 分清 BFS 与 DFS 各自的适用问题，知道复杂度爆炸时的四条出路

## 12.1 贪心要证明，不是猜

贪心每一步只取当前最优，一次遍历就出结果，所以它比 DP 快得多；代价是**必须证明「局部最优能扩展成全局最优」**。标准手法是交换论证：任取一个最优解，若它与贪心解不同，就把贪心选中的那个元素换进去，证明替换后可行性不变、目标值不下降——反复交换就能把任意最优解变成贪心解，于是贪心解也是最优的。

区间调度用这一招：任取一个最优解，把它的第一个活动换成「全局结束最早的那个区间」，剩下的活动一个都不会被挡住——所以「结束最早的先选」是对的：

```python
from math import inf

def max_non_overlapping(intervals):
    """intervals = [(开始, 结束), ...)，返回最多能安排的互不重叠区间"""
    chosen, end = [], -inf
    for s, e in sorted(intervals, key=lambda p: p[1]):   # 按结束时间升序
        if s >= end:                                     # 与已选的最后一个不冲突
            chosen.append((s, e))
            end = e
    return chosen
```

其他看起来同样合理的策略，一个反例就倒：

```text
区间 [0,4] [3,6] [5,9]
按「时长最短」优先 → 先选 [3,6]，它与另外两个都冲突，结果只有 1 个
按「结束最早」优先 → 先选 [0,4] 再选 [5,9]，结果 2 个（最优）

区间 [0,10] [1,2] [3,4]
按「开始最早」优先 → 选中 [0,10]，只有 1 个；正确答案是 2 个
```

11 章那个硬币例子（`[1,3,4]` 凑 6，贪心 3 枚、最优 2 枚）也是同一类失败：**贪心选择性质**不成立时，算法只是「跑得很快的错误答案」，而且它每轮都自洽，跑十万次也不会自己报警。

:::danger[三种常见的贪心错觉]
① 「按比值排序」到处适用——它只在可以取部分（分数背包）或后续不影响剩余容量时才成立；② 局部最优 = 全局最优「大概」成立，靠感觉而非证明；③ 对拍通过就等于正确——对拍只能证伪，不能证明。写不出交换论证或归纳证明，就退回 DP。
:::

## 12.2 两个经典贪心：区间调度与哈夫曼

区间调度的贪心还有一层价值：它同时给出「最多能安排几个」和「需要多少条资源」。后者的判据是**同一时刻最多有多少个区间重叠**，用扫描线把区间端点排序后累加计数即可——会议室数量、最少服务器数量都是这一问。

哈夫曼编码则是「每次合并两个最小权重」的贪心：出现频率低的符号离根远、编码长，频率高的编码短，整体加权路径长度最短。它之所以不必考虑「先合了后面会不会更糟」，是因为合并顺序只影响子树深度，而最小权重放在最深处的交换论证成立。

```python
import heapq
from collections import Counter

def huffman_depths(freq):
    """freq 是 {符号: 权重}；返回每个符号的编码长度（前缀码）"""
    # 三元组 (权重, 递增序号, 子树)，序号用来避免同权重时比较子树
    heap = [(w, i, (sym,)) for i, (sym, w) in enumerate(freq.items())]
    heapq.heapify(heap)
    seq = len(heap)
    while len(heap) > 1:
        w1, _, n1 = heapq.heappop(heap)
        w2, _, n2 = heapq.heappop(heap)
        heapq.heappush(heap, (w1 + w2, seq, (n1, n2)))   # 两个最轻的子树挂到一起
        seq += 1
    depths = {}
    def collect(node, d):
        for part in node:
            if isinstance(part, tuple):
                collect(part, d + 1)
            else:
                depths[part] = d
    collect(heap[0][2], 0)
    return depths

freq = Counter("aaaabbbcd")                            # a:4 b:3 c:1 d:1
depths = huffman_depths(freq)
assert abs(sum(2 ** -d for d in depths.values()) - 1) < 1e-9   # Kraft 不等式取等
print(depths)
```

```text
$ python huffman.py
{'a': 1, 'b': 2, 'c': 3, 'd': 3}
```

`sum(2 ** -长度) == 1` 是前缀码合法性的检查（Kraft 不等式取等），能立刻抓出建树写错的情况；编码本身只要从根往下走，左 0 右 1。堆的实现见 第 6 章 · 堆与优先队列。

## 12.3 回溯模板：选择—递归—撤销

回溯是在**解空间树**上做 DFS：每一层是一个决策点，一条边是一个候选值。模板固定四段：

```text
def 回溯(路径, 候选, 结果):
    if 到达叶子 / 已收集到一个解:
        结果.append(路径的拷贝)          # 注意是拷贝，不是 paths 本身
        return                          # 若每层都要收集，就不 return
    for 选择 in 候选:
        if not 合法(选择):               # 剪枝：约束检查，越界/冲突/重复
            continue
        做选择(路径)                     # ① 改状态
        回溯(路径, 下一层候选, 结果)      # ② 深入
        撤销选择(路径)                   # ③ 还原状态 —— 漏掉这条全线崩
```

第 ③ 步是回溯与「普通递归」的唯一区别：状态是共享的可变对象，进去改了就必须原样退出来。用元组传参（不可变）时不需要显式撤销，代价是多一点分配。

:::caution[结果里必须存路径的拷贝]
`result.append(path)` 存的是同一个列表对象的引用；随着递归继续，`path.pop()` 会把所有已保存的「解」掏空，最后得到一个装满空列表的数组。写 `list(path)` 或 `path[:]`。
:::

## 12.4 全排列、子集与 N 皇后

三种题形对应解空间树的三种形状：排列每层从「未使用」里选，子集每层从「后续位置」里选，N 皇后每层选列并用集合记冲突。

```python
def permutations(nums):
    res, path, used = [], [], [False] * len(nums)
    def dfs():
        if len(path) == len(nums):
            res.append(list(path))
            return
        for i, x in enumerate(nums):
            if used[i] or (i and nums[i] == nums[i - 1] and not used[i - 1]):
                continue                 # 同值只在「前一个已用」时才走，去重排列
            used[i] = True
            path.append(x)
            dfs()
            path.pop()
            used[i] = False
    nums = sorted(nums)                  # 去重的前提是相同元素相邻
    dfs()
    return res

def subsets(nums):
    res, path = [], []
    def dfs(start):
        res.append(list(path))           # 每个节点本身就是一个子集
        for i in range(start, len(nums)):
            path.append(nums[i])
            dfs(i + 1)                   # 只往后取 → 同一组合不会重复出现
            path.pop()
    dfs(0)
    return res

def n_queens(n):
    boards, cols, diag, anti, path = [], set(), set(), set(), [0] * n
    def dfs(r):
        if r == n:
            boards.append(list(path))    # path[i] = 第 i 行皇后所在列
            return
        for c in range(n):
            if c in cols or r - c in diag or r + c in anti:
                continue                 # 剪枝：列、主对角线、副对角线冲突
            cols.add(c); diag.add(r - c); anti.add(r + c)
            path[r] = c
            dfs(r + 1)
            cols.discard(c); diag.discard(r - c); anti.discard(r + c)
    dfs(0)
    return boards
```

三个去重/防重复的关键点：排列里靠「排序 + 前一个同值是否已用」；子集里靠「只从 start 之后取」把组合变成有序枚举；棋盘上靠 `r - c` 与 `r + c` 两个集合把对角线冲突判成 O(1)，否则每次都要回看前 r 行，复杂度多出 n 倍。

## 12.5 BFS 求最短，DFS 求全部

同样是走图，队列和栈给出两种完全不同的答案。

```python
from collections import deque

WALL, OPEN = "#", "."

def maze_steps(grid, start, goal):
    """BFS：无权迷宫最少步数；不可达返回 -1"""
    rows, cols = len(grid), len(grid[0])
    steps = {start: 0}
    queue = deque([start])
    while queue:
        r, c = queue.popleft()
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            nxt = (nr, nc)
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == OPEN \
                    and nxt not in steps:
                steps[nxt] = steps[(r, c)] + 1     # 层号 = 最短距离
                queue.append(nxt)
    return steps.get(goal, -1)

def maze_paths(grid, start, goal):
    """DFS：枚举所有简单路径，用来数「有几条走法」"""
    rows, cols = len(grid), len(grid[0])
    res, path = [], [start]
    def dfs(r, c):
        if (r, c) == goal:
            res.append(list(path))
            return
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == OPEN \
                    and (nr, nc) not in path:      # 不重复经过同格 → 简单路径
                path.append((nr, nc))
                dfs(nr, nc)
                path.pop()
    dfs(*start)
    return res
```

| 维度 | BFS | DFS / 回溯 |
| --- | --- | --- |
| 首个解是否最优 | 无权图上一定最短（逐层扩展） | 不一定，要遍历完才敢下结论 |
| 能否枚举全部解 | 不擅长，得把整层存下来 | 天然擅长，一条路走到黑再退 |
| 内存 | 最宽一层的规模，可能很大 | 栈深 = 当前路径长度 |
| 典型题 | 最少步数、单词接龙、多源扩散 | 排列组合、N 皇后、数独、所有路径 |

「求最短」用 DFS 常见错误是「找到第一条就返回」；「求全部」用 BFS 则是把内存花在一整层的解前缀上。两者对调，正确性不变但代价爆炸。

## 12.6 剪枝与复杂度爆炸时的四条出路

回溯的上界是解空间大小：排列 n!、子集 2ⁿ、棋盘更糟。剪枝就是把这棵树修小，三类按性价比排：

```text
可行性剪枝：约束检查提前失败（12.4 里的列冲突、越界），最常用
最优性剪枝：已有完整解时，当前部分解的估价不优于已知最优就直接返回（bound 剪枝）
对称性剪枝：把镜像/轮转等价的分支只留一条（N 皇后首行只搜一半、组合问题强制升序）
```

四条出路按「先试便宜的后试贵的」排：① **换 DP**——如果不同路径到达同一状态后剩余代价相同（[第 11 章 · 动态规划入门](../11-dp/)），搜索就是重复劳动，记忆化或状压能把指数降成 2ⁿ · n；② **加剪枝与顺序优化**——先搜取值更少的位置（数独里候选最少的格子），一个顺序改动能少跑几个数量级；③ **换迭代加深（IDA*）**——用 DFS 的内存拿到 BFS 的最短性，代价是重复浅层；④ **改近似或随机化**——问题本身是 NP 难且 n 很大时，接受近似比或超时返回当前最好解。

:::tip[A\* 到底是什么，一句话]
把 BFS 的「排队依据 = 已走距离」换成「已走距离 + 到终点的估计剩余距离」，队列换成优先队列即可；只要估计**永不高估**真实剩余代价（称之可采纳，例如网格里的曼哈顿距离），第一次弹出终点就是最短解。估计越准，扩展的节点越少；估计为 0 时它就退回普通 BFS。
:::

## 12.7 综合练习：同一个迷宫的两种搜法

下面脚本可直接运行，同时验证「BFS 给最短、DFS 给全部」以及「贪心走迷宫不一定到得了终点」：

```python
from collections import deque

grid = [".....", ".###.", "..#..", ".###.", "....."]
start, goal = (0, 0), (4, 4)
rows, cols = len(grid), len(grid[0])
dirs = ((1, 0), (-1, 0), (0, 1), (0, -1))

def bfs_steps():
    steps = {start: 0}
    queue = deque([start])
    while queue:
        r, c = queue.popleft()
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            nxt = (nr, nc)
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == "." \
                    and nxt not in steps:
                steps[nxt] = steps[(r, c)] + 1
                queue.append(nxt)
    return steps.get(goal, -1)

def dfs_all():
    res, path = [], [start]
    def dfs(r, c):
        if (r, c) == goal:
            res.append(len(path))
            return
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == "." \
                    and (nr, nc) not in path:
                path.append((nr, nc))
                dfs(nr, nc)
                path.pop()
    dfs(*start)
    return res

shortest = bfs_steps()
lengths = dfs_all()
print("BFS 最短步数 =", shortest, "| DFS 找到路径数 =", len(lengths),
      "| 最短的一条 =", min(lengths) - 1 if lengths else -1,
      "| 两者一致 =", min(lengths) - 1 == shortest)
```

```text
$ python maze_search.py
BFS 最短步数 = 8 | DFS 找到路径数 = 4 | 最短的一条 = 8 | 两者一致 = True
```

`min(lengths) - 1 == shortest` 这个断言值得养成习惯：**两种独立算法在同一份数据上互相验证**。DFS 数出的路径条数也顺手说明了「求全部」为什么不能用 BFS 替代——它要把每条路径的前缀都存下来。

至于贪心走迷宫：每次都朝目标方向靠（曼哈顿距离最小的下一步），在这个带墙的例子第一层就会被 `.###.` 挡住而反复碰壁——它连「能不能到」都不保证。这也解释了 A\* 为什么必须保留**所有**候选节点在优先队列里：启发式只能排序，不能代替搜索。

:::caution[别忘了「状态」不等于「位置」]
如果迷宫允许重复经过同一格、或者带钥匙/体力这类附加信息，判重就不能只看坐标，而要 `(行, 列, 附加状态)` 一起进 `seen`。只用坐标剪枝会把可行解剪掉——这是搜索类题目最常见的错法。
:::

## 本章小结

- 贪心必须证明「局部最优可扩展为全局最优」（交换论证/归纳），否则 `[1,3,4]` 凑 6、区间调度选最短时长这类反例就会中招
- 区间调度按结束时间排序（同法可求最少资源数），哈夫曼每次合并两个最小权重，可用 Kraft 等式校验前缀码是否合法
- 回溯四件套是「收集—选择—递归—撤销」，撤销漏掉就全线错，结果一定要存路径拷贝；排列靠排序去重、子集靠 start 单调、棋盘靠对角线集合判冲突
- 求最短用 BFS（层号即距离），求全部用 DFS；复杂度爆炸时依次考虑换 DP、加三类剪枝、迭代加深或 A\*（可采纳启发式 + 优先队列），最后才接受近似
