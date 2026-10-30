---
title: "第 6 章 · 堆与优先队列"
description: "队列讲的是「来的顺序」，但很多场景只关心「谁最急」：任务调度、Dijkstra 取最近点、Top-K、合并多路有序数据。每次都要 O(1) 拿出最值、又允许随时插入新元素，这就是堆（优先队列）——用一棵「堆序」的完全二叉树把取最值压到 O(log n)。"
series: dsa
sidebar:
  order: 6
  label: "堆与优先队列"
difficulty: intermediate
duration: 7
tableOfContents: true
---

**本章目标：**

- 理解堆的两个约束：完全二叉树 + 堆序（父不大于子），以及它为什么能用数组存
- 能手写上浮（sift-up）与下沉（sift-down），并解释建堆为什么是 O(n) 而不是 O(n log n)
- 熟练使用 `heapq`：最小堆、`heappush` / `heappop` / `heapify`、用负数或元组做最大堆
- 会用堆解决 Top-K、合并 K 路有序数据、任务调度与 Dijkstra 的最值提取

## 6.1 堆：只要最值，最快路径

优先队列（priority queue）的接口很窄：**插入一个元素**、**取出当前最值**。它不关心整体有序，只保证最值随时可取。堆就是它的实现。

堆是一棵**完全二叉树**，并且满足**堆序**：每个节点的值都不大于（或不小于）它的孩子。注意它不要求左右孩子之间有序，也不要求整棵树有序——这条"局部有序"就足够让最值永远在根上。

```text
最小堆示例（父 ≤ 子）：
          1
        /   \
       3     2
      / \   /
     7   4 5

对应的数组存储（层序）：
[1, 3, 2, 7, 4, 5]
 0  1  2  3  4  5
下标关系：i 的孩子是 2i+1 / 2i+2，父亲是 (i-1)//2
```

完全二叉树的形状让它可以**直接存进数组**，不需要任何指针——这是堆比其他平衡树轻得多的根本原因（第 5 章）。

## 6.2 上浮与下沉：维护堆序的两个动作

堆只允许两个基本操作，且都沿着一条从根到叶的路径移动，所以是 O(log n)：

- **上浮（sift-up）**：新元素插到数组末尾，然后一路和父亲比较、比父亲小就交换——用于插入；
- **下沉（sift-down）**：把根取下后，把末尾元素挪到根，然后一路和孩子中较小的那个交换——用于取最值。

```python
class MinHeap:
    def __init__(self):
        self.data = []

    def push(self, value):
        self.data.append(value)
        self._sift_up(len(self.data) - 1)

    def _sift_up(self, index):
        while index > 0:
            parent = (index - 1) // 2
            if self.data[parent] <= self.data[index]:
                break
            self.data[parent], self.data[index] = self.data[index], self.data[parent]
            index = parent

    def pop(self):
        if not self.data:
            raise IndexError("pop from empty heap")
        last = self.data.pop()
        if not self.data:
            return last
        top, self.data[0] = self.data[0], last
        self._sift_down(0)
        return top

    def _sift_down(self, index):
        size = len(self.data)
        while True:
            left, right = 2 * index + 1, 2 * index + 2
            smallest = index
            if left < size and self.data[left] < self.data[smallest]:
                smallest = left
            if right < size and self.data[right] < self.data[smallest]:
                smallest = right
            if smallest == index:
                break
            self.data[index], self.data[smallest] = self.data[smallest], self.data[index]
            index = smallest

if __name__ == "__main__":
    heap = MinHeap()
    for value in [5, 3, 8, 1, 9, 2]:
        heap.push(value)
    print("堆数组 =", heap.data)                 # 只是"父 ≤ 子"，不保证整体有序
    print("依次弹出 =", [heap.pop() for _ in range(6)])
```

```text
C:\code\dsa> python min_heap.py
堆数组 = [1, 3, 2, 5, 9, 8]
依次弹出 = [1, 2, 3, 5, 8, 9]
```

## 6.3 建堆为什么是 O(n)

把 n 个元素一个个 `push` 进堆是 O(n log n)。但若已经有数组，直接**从最后一个非叶节点往前逐个下沉**，总代价是 O(n)：

```text
直觉：每个节点下沉的代价 = 它的高度。
高度为 1 的节点约 n/4 个，高度为 2 的约 n/8 个……
总代价 = n/4·1 + n/8·2 + n/16·3 + … < 2n
```

```python
import heapq

def heapify_demo(values):
    data = list(values)
    heapq.heapify(data)          # 原地建堆，O(n)
    return data

if __name__ == "__main__":
    print(heapify_demo([5, 3, 8, 1, 9, 2]))
```

## 6.4 heapq：Python 的最小堆工具箱

标准库 `heapq` 提供的是**最小堆**（只能取最小值）。要做最大堆，常用两个办法：存负数，或存元组 `(-value, payload)`。

```python
import heapq

if __name__ == "__main__":
    # 最大堆：存负数
    max_heap = []
    for value in [5, 3, 8, 1]:
        heapq.heappush(max_heap, -value)
    print("最大值:", -heapq.heappop(max_heap))

    # 带优先级的任务：元组比较先看第一项，再按第二项兜底（避免"值相同但不可比较"报错）
    tasks = []
    heapq.heappush(tasks, (2, "写邮件"))
    heapq.heappush(tasks, (1, "修线上 bug"))
    heapq.heappush(tasks, (3, "写周报"))
    while tasks:
        priority, name = heapq.heappop(tasks)
        print(priority, name)

    # nsmallest / nlargest：Top-K 不需要全排序
    nums = [7, 1, 9, 3, 5, 2, 8]
    print("Top3 最大:", heapq.nlargest(3, nums))
```

```text
C:\code\dsa> python heapq_demo.py
最大值: 8
1 修线上 bug
2 写邮件
3 写周报
Top3 最大: [9, 8, 7]
```

:::caution[heapq 的三个"坑"]
一是它**不是**线程安全的（多线程共享要加锁）；二是修改已入堆元素的优先级不能直接改（堆会失序），标准做法是"懒惰删除"（6.6 节）；三是 `heappop` 遇到空堆会抛 `IndexError`，而 `heapq.heappushpop` / `heapreplace` 能一次完成"弹出 + 压入"，比两次操作快。
:::

## 6.5 堆排序：取出最值 n 次

堆排序就是"建堆 + 反复取堆顶"。全部弹出得到升序；如果原地排序，则把堆顶换到数组末尾再缩小堆范围（升序用最大堆）。

```python
def heap_sort(values):
    data = list(values)
    heapq.heapify(data)
    return [heapq.heappop(data) for _ in range(len(data))]

if __name__ == "__main__":
    print(heap_sort([5, 3, 8, 1, 9, 2]))
```

堆排序时间 O(n log n)、空间 O(1)（原地版）、不稳定。实际工程里 Python 的 `sorted`（Timsort）通常更快，堆排序的价值在于**边取边处理**（数据流场景）而不是一次性排序。

## 6.6 懒惰删除：堆里的"删除任意元素"

堆只保证堆顶最值，删除中间某个元素很麻烦。工程上不真删，而是给元素打个标记，弹出时跳过：

```python
import heapq

class LazyHeap:
    """支持"删除任意元素"的堆：删除只是记一笔，弹出时再清理"""

    def __init__(self):
        self.data = []
        self.removed = {}                 # 值 → 待删除次数

    def push(self, value):
        heapq.heappush(self.data, value)

    def remove(self, value):
        self.removed[value] = self.removed.get(value, 0) + 1

    def pop(self):
        while self.data:
            top = heapq.heappop(self.data)
            if self.removed.get(top, 0) > 0:   # 已被逻辑删除：跳过
                self.removed[top] -= 1
                if self.removed[top] == 0:
                    del self.removed[top]
                continue
            return top
        raise IndexError("pop from empty heap")
```

这正是 Dijkstra 算法里"节点距离变短就再压一次、旧记录出堆时用 `visited` 跳过"的做法（第 7 章）。

## 6.7 综合练习：Top-K、合并 K 路、数据流中位数

### 练习一：Top-K（维护大小为 K 的小顶堆）

```python
import heapq

def top_k(nums, k):
    heap = []
    for value in nums:
        heapq.heappush(heap, value)
        if len(heap) > k:
            heapq.heappop(heap)          # 弹出当前最小值，留下更大的 K 个
    return sorted(heap, reverse=True)

if __name__ == "__main__":
    stream = [9, 2, 7, 4, 8, 1, 6, 3, 5]
    print(top_k(stream, 3))
```

```text
C:\code\dsa> python top_k.py
[9, 8, 7]
```

### 练习二：合并 K 个有序列表

```python
import heapq

def merge_k_lists(lists):
    heap = []
    for index, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], index, 0))   # (值, 列表编号, 下标)
    merged = []
    while heap:
        value, list_index, position = heapq.heappop(heap)
        merged.append(value)
        next_position = position + 1
        if next_position < len(lists[list_index]):
            heapq.heappush(heap, (lists[list_index][next_position], list_index, next_position))
    return merged

if __name__ == "__main__":
    print(merge_k_lists([[1, 4, 7], [2, 5, 8], [3, 6, 9]]))
```

```text
C:\code\dsa> python merge_k.py
[1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### 练习三：数据流中位数（双堆）

用一个**大顶堆**存较小的一半、一个**小顶堆**存较大的一半，两个堆大小差不超过 1，中位数就在两个堆顶之间。

```python
import heapq

class MedianFinder:
    def __init__(self):
        self.small = []      # 已取负，模拟大顶堆
        self.large = []      # 小顶堆

    def add(self, value):
        heapq.heappush(self.small, -value)
        heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def median(self):
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2

if __name__ == "__main__":
    finder = MedianFinder()
    for value in [1, 2, 3, 4]:
        finder.add(value)
        print(value, "→", finder.median())
```

```text
C:\code\dsa> python median.py
1 → 1
2 → 1.5
3 → 2
4 → 2.5
```

## 6.8 堆 vs 其他结构：什么时候不该用它

| 需求 | 更合适的选择 |
| --- | --- |
| 只需要静态有序 + 二分查找 | 排序数组 + `bisect`（第 9 章） |
| 需要动态有序、范围查询、前驱后继 | 平衡树 / `sortedcontainers`（第 5 章） |
| 只取最值、允许延迟删除 | 堆（本章） |
| 只需去重 / 计数 | 哈希表（第 4 章） |

:::tip[优先队列是"算法里的齿轮"]
Dijkstra、Prim、A*、Huffman 编码、任务调度、事件驱动仿真——这些算法的共同点都是"每一步取当前最优的一个"，堆就是那个把"取最优"变成 O(log n) 的齿轮。
:::

## 本章小结

- 堆 = 完全二叉树 + 堆序，用数组存（i 的孩子 2i+1 / 2i+2），只保证最值在根，不保证整体有序
- 上浮用于插入、下沉用于弹出，都是 O(log n)；建堆从最后一个非叶节点下沉是 O(n)
- `heapq` 是最小堆；最大堆用负数或元组，元组第二个字段用来打破平局、避免不可比较报错
- 堆排序 O(n log n) 不稳定；实际工程更常用"边取边处理"（Top-K、合并 K 路、中位数）
- 删除任意元素用懒惰删除：标记跳过，出堆时清理；Dijkstra 也靠这一招
