---
title: 图与遍历
---

# 第 7 章 · 图与遍历

**本章目标：**

- 按问题特征选图的表示法（邻接矩阵 / 邻接表）与遍历方式（BFS / DFS）
- 会用拓扑排序判定依赖是否成环，用并查集动态维护连通性
- 说清 Dijkstra 成立的唯一前提，以及它碰到负权边为什么就失效

## 7.1 三个维度与两种存法

图就是「点 + 边」，但边有三个互相独立的属性，它们共同决定你该写哪种代码：**方向**（有向如先修课、调用关系；无向如好友、道路）、**权重**（带权表示距离或代价，无权只回答「能不能到」）、**结构**（是否连通、是否成环——无环的有向图叫 DAG）。

```python
# 有向带权图的邻接表：键是起点，值是（终点, 权重）的列表
adj = {0: [(1, 4), (2, 1)], 1: [(3, 1)], 2: [(1, 2), (3, 5)], 3: []}
# 无向图 = 每条边存两次，邻居直接用集合对称维护
undirected = {0: {1, 2}, 1: {0, 3}, 2: {0, 3}, 3: {1, 2}}
```

存法的取舍只有一句话：**你更常问「u 和 v 之间有边吗」，还是更常问「u 能去哪」**。

| 操作 | 邻接矩阵 `mat[u][v]` | 邻接表 `adj[u]` |
| --- | --- | --- |
| 判断 `u` 到 `v` 是否有边 | O(1) | O(度数)，先排序可二分 |
| 枚举 `u` 的所有邻居 | O(n)，要跳过空格 | O(度数)，天生最优 |
| 空间 | O(n²) | O(n + m) |
| 典型场景 | 稠密图、Floyd、算法推导 | 工程与面试的默认选择 |

矩阵只在节点数几百以内且图很密（边数接近 n²），或者你要算任意两点间距离（Floyd 算法）时才划算；否则 n 到 10⁵ 时矩阵就是 10¹⁰ 个格子，内存先爆炸。

## 7.2 BFS：逐层扩散就是无权最短路

BFS 用队列保证「先发现的点先处理」，于是层号 = 到起点的边数。在**无权图**里这就是最短路径：第一次到达某个点，就不可能再用更少的步数到达它（端点操作语义见 [第 3 章 · 栈与队列](./03-stack-queue)，判重的哈希保证见 [第 4 章 · 哈希表](./04-hash-table)）。

```python
from collections import deque

def bfs_steps(adj, start, target):
    """start 到 target 的最少步数，不可达返回 -1"""
    if start == target:
        return 0
    seen, queue = {start}, deque([(start, 0)])
    while queue:
        node, dist = queue.popleft()
        for nxt in adj[node]:
            if nxt not in seen:
                seen.add(nxt)              # 关键：入队时就标记
                if nxt == target:
                    return dist + 1
                queue.append((nxt, dist + 1))
    return -1
```

标记时机的差别很实在：

```text
错误写法  seen 在 popleft 之后才添加
          → 同一节点被 k 个邻居重复入队，队列最坏堆出 O(n·m) 条记录，超时
正确写法  seen.add(nxt) 紧贴 append 之前
          → 每个节点最多入队一次，总代价才是 O(n + m)
```

::: warning 判重要留在 O(1)
用 `set` 或 `bytearray` 记录已访问，别用 `list` 的 `in`——后者每次比较都退化成线性扫描，整趟 BFS 直接从 O(n + m) 变成平方级。
:::

## 7.3 DFS：连通分量与递归深度

DFS 一条路走到黑，给不了最短路，但给**结构信息**：连通分量、环、拓扑序、全部解。

```python
def count_components(adj):
    """无向图连通分量个数，迭代版（显式栈）"""
    seen, count = set(), 0
    for start in adj:
        if start in seen:
            continue
        count, stack = count + 1, [start]
        while stack:
            x = stack.pop()
            if x in seen:
                continue
            seen.add(x)                    # DFS 里出栈才标记也正确
            stack.extend(adj[x] - seen)
    return count
```

「出栈时标记」对 DFS 是安全的：它不依赖最短路语义，重复只影响常数。判断有向图有无环用三色标记——白（未访问）、灰（在当前调用栈上）、黑（已完成），碰到灰点就是回到自己的祖先。

```python
WHITE, GRAY, BLACK = 0, 1, 2

def has_cycle(adj):
    color = {u: WHITE for u in adj}
    def dfs(u):
        color[u] = GRAY
        for v in adj.get(u, ()):
            if color[v] == GRAY:
                return True                # 后向边 → 成环
            if color[v] == WHITE and dfs(v):
                return True
        color[u] = BLACK
        return False
    return any(color[u] == WHITE and dfs(u) for u in adj)
```

::: danger 递归 DFS 有栈深上限
Python 默认递归深度约 1000（`sys.getrecursionlimit()` 可查）。10⁵ 个节点的长链会把递归 DFS 直接打爆成 `RecursionError`。`setrecursionlimit` 只是续命，真正的解法是把栈写成显式容器——语义完全等价。
:::

## 7.4 拓扑排序：DAG 上的线性顺序

只有有向无环图能拓扑排序：输出一个序列，使每条边 `u → v` 都满足 `u` 排在 `v` 前面。构建顺序、任务调度、依赖解析全是它。Kahn 算法从入度为 0 的点开始剥洋葱：

```python
from collections import deque

def topo_sort(n, edges):
    """edges 是 (u, v) 列表，表示 u 必须在 v 之前；有环返回 None"""
    adj, indeg = [[] for _ in range(n)], [0] * n
    for u, v in edges:
        adj[u].append(v)
        indeg[v] += 1
    queue, order = deque(i for i in range(n) if indeg[i] == 0), []
    while queue:
        u = queue.popleft()
        order.append(u)
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:              # 恰好为 0 才入队，别写 <= 0
                queue.append(v)
    return order if len(order) == n else None
```

`len(order)` 小于 `n`，说明剩下的点互相卡住——那就是环。**拓扑排序顺手就是环检测**，还能告诉你环之外的点照常可排。想要确定顺序（同层按编号出），把 `deque` 换成最小堆。两种环检测的分工：三色 DFS 能立刻指出「哪条边造成成环」，适合写报错信息；Kahn 天然迭代、无栈深风险，适合大图。

## 7.5 并查集：只关心连不连通

如果只有两个操作——「合并两个集合」「判断两点是否同集合」——不必遍历整张图，并查集（DSU）足够。

```python
class DSU:
    def __init__(self, n):
        self.parent, self.size = list(range(n)), [1] * n

    def find(self, x):
        root = x
        while self.parent[root] != root:
            root = self.parent[root]
        while self.parent[x] != root:       # 路径压缩：沿途全挂到根上
            self.parent[x], x = root, self.parent[x]
        return root

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False                    # 已连通：这条边必然成环
        if self.size[ra] < self.size[rb]:   # 按大小合并，保持树矮
            ra, rb = rb, ra
        self.parent[rb] = ra
        self.size[ra] += self.size[rb]
        return True
```

两个优化各管一半：**按大小/按秩合并**保证树高不超过 log n，**路径压缩**让查过的点后续一步到位。一起用时单次操作接近常数（O(α(n))）；只有按秩而无压缩会在长链查询上退化。数集合个数就统计根：`len({dsu.find(i) for i in range(n)})`。

::: warning 并查集不会做的事
它不支持**删边**（拆分集合要靠可撤销并查集加离线处理，成本高得多），也不记录路径内容，只回答「是否同一集合」。需要「两点之间怎么走」请回到 BFS/DFS。
:::

## 7.6 Dijkstra 与负权边的边界

带权非负图的单源最短路交给 Dijkstra：每次弹出当前距离最小的点定稿，再用它松弛邻居。堆的性质见 [第 6 章 · 堆与优先队列](./06-heap)。

```python
import heapq
from math import inf

def dijkstra(n, adj, start):
    """adj[u] = [(v, w), ...]，w 必须非负；不可达点返回 inf"""
    dist = [inf] * n
    dist[start] = 0
    heap, done = [(0, start)], [False] * n
    while heap:
        d, u = heapq.heappop(heap)
        if done[u]:                      # 定稿过的点不再处理
            continue
        done[u] = True
        for v, w in adj[u]:
            if not done[v] and d + w < dist[v]:
                dist[v] = d + w
                heapq.heappush(heap, (dist[v], v))
    return dist
```

二叉堆实现下复杂度 O((n + m) log n)。它正确的唯一前提是**边权非负**：弹出 `u` 时任何未走过的路都要先经过某个未定稿点，距离只增不减，所以 `dist[u]` 不可能再被改进——「弹出即定稿」才有资格成立。负权一出现，「只增不减」就断了：

```python
g = {0: [(1, 2), (2, 5)], 1: [(3, 10)], 2: [(1, -4)], 3: []}
# 正确答案：0→2→1→3 = 5 - 4 + 10 = 11
# 上面这份代码给出 dist[3] = 12：点 1 在距离 2 时就定了稿，
# 随后 2→1 把它改到 1，可 done[1] 已为 True，这个改进再也传不到 3
```

有负权就换 Bellman-Ford：把全部边重复松弛 n-1 轮，还能改进就说明存在负权环（此时最短路是负无穷，问题无解）。代价是 O(n·m)，比 Dijkstra 慢一个量级——所以「能不能用快的那个」要先看有没有负权边。

::: warning 「不判 done、只跳过陈旧记录」的那版不是 Dijkstra
很多人写成 `if d > dist[u]: continue`：允许改进后的点重新入队重新展开。它在某些负权图上确实能给出正确答案（本质是标号修正算法），但**没有 O((n + m) log n) 的复杂度保证**，碰到负权环更是永不停机。要说「Dijkstra 怕负权」，指的就是上面这份弹出即定稿的标准实现。
:::

## 7.7 综合练习：排课系统

六门课的先修关系如下，问：(1) 是否根本毕不了业；(2) 一个可行顺序；(3) 一学期能同时修完所有没有待修的课程，共需几学期。完整可运行脚本：

```python
courses = ["高数", "线代", "概率", "数据结构", "算法", "机器学习"]
raw = [(0, 1), (0, 3), (1, 2), (3, 4), (2, 5), (4, 5)]   # (u, v)：u 是 v 的先修课
n, adj, indeg = len(courses), [[] for _ in range(len(courses))], [0] * len(courses)
for u, v in raw:
    adj[u].append(v)
    indeg[v] += 1

order, finished, semesters = [], 0, 0
current = [i for i in range(n) if indeg[i] == 0]         # 第一学期：没有先修课
while current:
    semesters, nxt = semesters + 1, []
    for u in current:
        order.append(courses[u])
        finished += 1
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                nxt.append(v)
    current = nxt
print("成环，无法排课" if finished != n
      else "顺序：%s｜学期数：%d" % (" → ".join(order), semesters))
```

```text
$ python schedule.py
顺序：高数 → 线代 → 数据结构 → 概率 → 算法 → 机器学习｜学期数：4
```

三问用到三件工具：成环判定（Kahn 数不齐）、可行顺序（拓扑序）、按层推进（把「同一学期」理解成 BFS 的「同一层」）。

::: tip 自查三个边界
孤立节点（没有任何边的课）、重边（同一条先修关系给了两遍）、自环（`u → u`）。图论代码的 bug 九成落在这三个边界上：往 `raw` 里加一条 `(0, 0)` 再跑，看你的实现还能不能给出正确答案。
:::

## 本章小结

- 图按「方向 / 权重 / 是否成环」三个维度分类；稀疏图一律邻接表，邻接矩阵只属于稠密图与 Floyd 类算法
- BFS 的层号就是无权最短路，判重必须在入队时做；DFS 给结构信息（连通分量、环、拓扑序），递归版要警惕栈深上限
- 拓扑排序只在 DAG 上存在，Kahn 输出点数不足即有环；并查集用路径压缩 + 按大小合并把连通性做到近 O(1)，但不能删边
- Dijkstra 的正确性完全依赖边权非负（弹出即定稿）；负权改用 Bellman-Ford O(n·m)，存在负权环时最短路无解
