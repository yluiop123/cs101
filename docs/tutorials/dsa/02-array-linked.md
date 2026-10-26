---
title: 数组与链表
---

# 第 2 章 · 数组与链表

**本章目标：**

- 说清动态数组的扩容策略与摊还成本，能解释尾部追加为什么几乎总是很快
- 能画出单链表、双链表、循环链表的指针关系，并用哨兵节点把它们写对
- 面对随机访问与两端插入删除冲突的需求，能在 `list`、`deque`、手写链表之间有依据地选择

## 2.1 内存布局：连续与离散

数组与链表的差别不在 API，而在**内存里怎么摆放**：数组把元素紧挨着放在一段连续空间里，第 i 个元素等于基地址加上 i 乘以元素大小，一次加法就能定位；链表把元素散落在堆上，只能顺 `next` 往后走，想跳到位必须先数过去。后面所有性能差异都从这一条推出来。

连续还有第二个红利：**缓存友好**。数组遍历时 CPU 预取器能把后续元素提前装进缓存，链表每次跳转都可能 cache miss。同样写着"遍历 n 个元素"的 O(n)，链表的常数往往大好几倍——这正是第 1 章 [复杂度分析与数据结构全景](./01-complexity) 说的"同量级必须实测"。节点对象默认还带一个 `__dict__`，所以实现里要加 `__slots__`，否则小节点的元数据会超过数据本身。

## 2.2 动态数组的扩容与摊还

定长数组要提前知道容量，实际用的是**动态数组**：预留比当前元素更多的空格，追加只是写一格；空格用完才搬家，申请更大的一块、把旧元素整体复制过去、释放旧块。搬家很贵但很少发生，因为容量按**几何比例**增长。

```python
def growth_exact(n, factor=1.125, extra=4):
    capacity = size = copies = expansions = 0
    for _ in range(n):
        if size == capacity:
            new_cap = 4 if capacity == 0 else int(capacity * factor) + extra
            copies += capacity           # 旧元素整体复制一次
            capacity, expansions = new_cap, expansions + 1
        size += 1
    return capacity, expansions, copies

if __name__ == "__main__":
    cap, exp, copies = growth_exact(100_000)
    print(f"追加 {100_000:8d} 次 → 容量 {cap:8d}，扩容 {exp:3d} 次，均摊 {copies / 100_000:.2f} 次每操作")
```

```text
C:\code\dsa> python dynarray.py
追加   100000 次 → 容量   110077，扩容  70 次，均摊 8.79 次每操作
```

CPython 的真实策略是"小容量翻倍、大容量约 1.125 倍加常数"，具体数字属于实现细节，换版本或换实现都会变。结论与数字无关：**几何级数求和与最大项同阶**，所以 n 次追加的总复制量是 O(n)，单次摊还 O(1)。反面是头部插入：`insert(0, x)` 每次都要把全部元素后移一格，没有尖峰可以分摊，n 次就是实打实的 O(n^2)。

::: tip 什么时候会看到 O(n) 尖峰
即使全是追加，个别那一次也会明显变慢（复制加重新分配），延迟敏感的服务把它叫 latency spike。对策是预先建好目标长度的列表，或换成不需要搬家的结构。
:::

## 2.3 链表的三种形态

| 形态 | 节点字段 | 方向 | 典型用途 |
| --- | --- | --- | --- |
| 单链表 | `value`, `next` | 单向 | 哈希表桶内拉链、栈、流水线 |
| 双链表 | `value`, `prev`, `next` | 双向 | LRU 缓存、需要 O(1) 摘除任意已知节点 |
| 循环链表 | 同双链表，尾的 `next` 指回头 | 双向闭环 | 轮转调度、约瑟夫问题 |

双链表最值得练，因为它支撑 2.7 的 LRU。写的时候记一句口诀：**先接新节点的四根线，再动老节点的两根线**。

```python
class DNode:
    __slots__ = ("value", "prev", "next")
    def __init__(self, value, prev=None, nxt=None):
        self.value, self.prev, self.next = value, prev, nxt

def link_before(anchor, value):          # 在锚点前插入，双链表唯一的插入原语
    prev = anchor.prev
    node = DNode(value, prev, anchor)
    prev.next, anchor.prev = node, node
    return node

def unlink(node):                        # 摘除已知节点：只改两根线，O(1)
    node.prev.next, node.next.prev = node.next, node.prev

if __name__ == "__main__":
    head = DNode(None)                   # 哨兵头：真实数据都在它之后
    tail = DNode(None, prev=head)        # 哨兵尾：省掉"是不是最后一个"的特判
    head.next = tail
    handles = {v: link_before(tail, v) for v in (1, 2, 3)}   # 交出节点引用
    unlink(handles[3])                   # 不需要遍历，直接摘掉尾部真实节点
    print("正向:", [n.value for n in (handles[1], handles[2])], "尾哨兵的前驱:", tail.prev.value)
```

哨兵节点是链表代码的护身符：有了它，"插到最前面""删到最后面"都不再需要特判空表，绝大多数链表 bug 会因此消失。循环链表只是补上 `tail.next = head` 这一环，判空条件从"是否为 None"变成"是否回到起点"。

## 2.4 随机访问与插入删除的取舍

| 操作 | 动态数组 | 双链表 | 说明 |
| --- | --- | --- | --- |
| 按下标访问 | O(1) | O(n) | 链表只能顺走 |
| 尾部追加 | 摊还 O(1) | O(1) | 数组有尖峰但可摊平 |
| 头部插入/删除 | O(n) | O(1) | 数组要搬全部元素 |
| 已知位置插入/删除 | O(n) | O(1) | 数组搬一半，链表只改指针 |
| 按值查找 | O(n)，缓存友好 | O(n)，缓存不友好 | 同为线性，常数差数倍 |
| 额外内存 | 紧凑，留有空容量 | 每节点 2～3 个指针 | 小元素时链表开销占比极高 |

关键在**"已知位置"**四个字：链表删节点 O(1) 的前提是你已经握着那个节点的引用。若还要先按值找它，查找本身就是 O(n)，链表并不更快。这正是 LRU 要把哈希表和双链表绑在一起的原因——哈希表负责"位置已知"，双链表负责"使用顺序"。

错误写法 → 正确写法：`arr.pop(0)` 常被当作队列的取头操作，理由是"只删一个元素"；它实际要把后面 n-1 个元素整体前移。实测清空 10 万元素，`list.pop(0)` 约 875 毫秒，`deque.popleft` 约 6 毫秒——换成 `deque` 才是 O(1)。

## 2.5 Python 的 list 与 deque 到底是什么

`list` 就是动态数组：一段连续的**指针数组**，元素本身是堆上的对象。`deque`（双端队列）是**分块的双链表**：一队固定大小的块，块内连续、块间用指针串起来，因此两端进出都是 O(1)。批量头部插入时 list 呈平方趋势、deque 呈线性趋势；下面的毫秒数随机器波动，要看的是趋势而不是绝对值。

```python
import time
from collections import deque

def insert_head_list(n):
    data = []
    for i in range(n):
        data.insert(0, i)                # 每轮把已有的 i 个元素整体后移
    return data

def insert_head_deque(n):
    data = deque()
    for i in range(n):
        data.appendleft(i)               # 只动首端，不搬任何东西
    return data

if __name__ == "__main__":
    for n in (5_000, 20_000):
        for name, func in (("list", insert_head_list), ("deque", insert_head_deque)):
            start = time.perf_counter()
            func(n)
            print(f"头部插入 n={n:6d}  {name:6s} {(time.perf_counter() - start) * 1000:8.1f} ms")
```

```text
C:\code\dsa> python head_insert.py
头部插入 n= 20000  list       67.5 ms
头部插入 n= 20000  deque       0.8 ms
```

::: tip deque 的索引不是 O(1)
`d[0]`、`d[-1]` 是常数时间，中间位置会退化到线性，官方文档建议只在两端使用。要随机访问就回 `list`，要两端进出就用 `deque`：拿 `list` 当队列、拿 `deque` 当数组，都是常见误用。
:::

## 2.6 双指针技巧

双指针不是结构，而是一种**用两个下标省掉一整张辅助表**的写法：同向的快慢指针用于链表判环、找中点、删倒数第 k 个；相向的左右夹逼用于有序数组两数之和、原地反转；滑动窗口是同向双指针的推广，第 3 章用双端队列把它做通用。判环要"先移动再比较"，反转要"先存住后继"，这两点是所有链表题的公共底座。

```python
class Node:
    __slots__ = ("value", "next")
    def __init__(self, value, nxt=None):
        self.value, self.next = value, nxt

def has_cycle(head):
    slow = fast = head
    while fast is not None and fast.next is not None:
        slow, fast = slow.next, fast.next.next
        if slow is fast:                 # 快指针每次两步，有环必然追上
            return True
    return False

def reverse_in_place(head):
    prev = None
    while head is not None:
        nxt = head.next                  # 必须先存住后继，否则断链
        head.next = prev
        prev, head = head, nxt
    return prev

def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:                  # 相向：靠有序性决定收缩哪一边
        total = nums[left] + nums[right]
        if total == target:
            return left, right
        left, right = (left + 1, right) if total < target else (left, right - 1)
    return None

if __name__ == "__main__":
    chain = Node(1, Node(2, Node(3)))
    print("有环:", has_cycle(chain))
    chain.next.next.next = chain         # 让尾节点指回头部
    print("造环后:", has_cycle(chain))
    head = reverse_in_place(Node(1, Node(2, Node(3))))
    print("反转后:", [head.value, head.next.value, head.next.next.value])
    print("两数之和:", two_sum_sorted([1, 2, 3, 4, 6], 7))
```

判环只回答"有没有环"；若还要找环的入口，相遇后把慢指针移回头部、两者改为一格一格走即可，那是同一对指针的第二种用法。

错误写法 → 正确写法：

```text
错：判环写成"进循环就先判断 slow is fast"   正：先移动再比较。否则初始两者都指向 head，第一次判断
                                        立刻为真，无环的链表也被判成有环
错：反转写成 `head.next, prev = prev, head`  正：先把 `head.next` 存进局部变量。同时赋值右侧的 `head`
                                        仍是旧节点，赋值后原链表的下一跳已经丢失，剩下节点全部失联
```

::: danger 快指针的循环条件要检查两项
快指针一次走两步，必须同时保证 `fast` 与 `fast.next` 都存在，否则偶数长度的无环链表会在最后一步取 `None` 的 `next`。判环与找中点都写成 `while fast is not None and fast.next is not None`。
:::

## 2.7 综合练习：双链表加哈希表实现 LRU

LRU（最近最少使用）要同时满足三件事：按 key 秒查、命中时把节点标成最近使用、容量满时淘汰最久未用的节点。哈希表负责秒查，双链表负责使用顺序，节点引用把两者串起来——这就是 2.4 里"位置已知"的现实价值。

```python
class LRUNode:
    __slots__ = ("key", "value", "prev", "next")
    def __init__(self, key=None, value=None, prev=None, nxt=None):
        self.key, self.value, self.prev, self.next = key, value, prev, nxt

class LRUCache:
    def __init__(self, capacity):
        self.capacity, self.map = capacity, {}
        self.oldest, self.newest = LRUNode(), LRUNode()    # 两个哨兵
        self.oldest.next, self.newest.prev = self.newest, self.oldest

    def _detach(self, node):
        node.prev.next, node.next.prev = node.next, node.prev

    def _to_newest(self, node):
        tail = self.newest.prev
        node.prev, node.next = tail, self.newest
        tail.next = self.newest.prev = node

    def get(self, key):
        node = self.map.get(key)
        if node is None:
            return -1
        self._detach(node)               # 命中即"最近使用"，挪到最新端
        self._to_newest(node)
        return node.value

    def put(self, key, value):
        node = self.map.get(key)
        if node is None:
            node = self.map[key] = LRUNode(key, value)
        else:
            node.value = value
            self._detach(node)
        self._to_newest(node)
        if len(self.map) > self.capacity:
            victim = self.oldest.next    # 最久未用的一直贴在哨兵旁边
            self._detach(victim)
            del self.map[victim.key]

if __name__ == "__main__":
    cache = LRUCache(2)
    cache.put("a", 1)
    cache.put("b", 2)
    print("get a:", cache.get("a"), "get b:", cache.get("b"))    # 都命中，b 变最新
    cache.put("c", 3)                    # 超容量，淘汰最旧的 a
    print("淘汰后 get a:", cache.get("a"), "get c:", cache.get("c"))
```

三处细节想清楚就掌握了这类题的全部套路：为什么必须双链表（单向无法 O(1) 摘除已知节点）、为什么用两个哨兵（免去空表与首尾特判）、为什么淘汰取 `oldest.next`（链表顺序就是使用顺序，不必再遍历找最小时间戳）。工程上可直接用 `collections.OrderedDict`，它提供 `move_to_end` 与 `popitem`，但链表练习要求能手写。

## 本章小结

- 数组连续、链表离散：数组赢在下标访问与缓存友好，链表赢在"已知位置"的两端与中间增删
- 动态数组按几何比例扩容，复制总量与 n 同阶，所以 n 次追加是 O(n)、单次摊还 O(1)；头部插入无摊还可救
- `list` 是指针数组、`deque` 是分块双链表：两端操作用 `deque`、随机访问用 `list`，`deque` 中间索引退化到线性
- LRU 是"哈希表 + 双链表 + 节点引用"的组合拳，配两个哨兵才能让 get 与 put 都是 O(1)
