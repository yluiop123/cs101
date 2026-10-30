---
title: "第 4 章 · 哈希表"
description: "数组用下标访问，链表用指针串联；哈希表把「键」直接映射到桶的位置，于是查找、插入、删除的平均代价都变成 O(1)。代价是空间、哈希函数质量，以及冲突处理与扩容策略——这三件事决定了它在最坏情况下会不会退化成链表。"
series: dsa
sidebar:
  order: 4
  label: "哈希表"
difficulty: intermediate
duration: 8
tableOfContents: true
---

**本章目标：**

- 说清哈希表"平均 O(1)"的前提：哈希函数均匀、冲突可控、负载因子有上限
- 能写出链地址法与开放寻址法两种冲突处理，并解释各自的取舍
- 理解扩容与再哈希为什么是摊还 O(1)，以及为什么 Python 的 dict 不保证顺序
- 会用哈希表解决计数、去重、分组、缓存与"两数之和"这类问题，并避开最坏 O(n) 的坑

## 4.1 哈希表：用空间换 O(1)

数组按下标访问是 O(1)，但下标必须是连续整数；链表插入删除是 O(1)，但找元素要 O(n)。哈希表把两者接起来：**用一个哈希函数把任意键换算成桶的下标**，然后像数组一样直接跳过去访问。

```python
# 极简版：只存键、不处理冲突的"理想哈希表"
def hash_index(key, bucket_count):
    total = 0
    for ch in key:
        total = (total * 31 + ord(ch)) % bucket_count
    return total

if __name__ == "__main__":
    for key in ["apple", "banana", "cherry"]:
        print(f"{key:8s} → 桶 {hash_index(key, 8)}")
```

```text
C:\code\dsa> python hash_index.py
apple    → 桶 2
banana   → 桶 5
cherry   → 桶 1
```

这不只是"快"，而是**一次计算就能定位**：查找、插入、删除都只和桶里的元素有关，不再和表的大小有关。

:::caution[哈希函数必须满足两条]
第一，**同一个键每次算出的值必须一样**（否则存进去就找不回来）；第二，**尽量均匀**（否则所有键挤进同一个桶，就退化成了链表）。Python 的 `hash()` 对字符串做了随机化种子，正是为了防止攻击者构造大量冲突键。
:::

## 4.2 冲突处理：链地址法 vs 开放寻址法

不同键算到同一个桶，这就是**哈希冲突**。理论上无法彻底避免（键空间通常远大于桶数），只能处理：

```python
class ChainedHashMap:
    """链地址法：每个桶挂一条链（这里用 list 存键值对）"""

    def __init__(self, bucket_count=8):
        self.buckets = [[] for _ in range(bucket_count)]
        self.size = 0

    def _index(self, key):
        return hash(key) % len(self.buckets)

    def put(self, key, value):
        bucket = self.buckets[self._index(key)]
        for pair in bucket:
            if pair[0] == key:
                pair[1] = value          # 键已存在：覆盖
                return
        bucket.append([key, value])       # 键不存在：追加到链尾
        self.size += 1

    def get(self, key, default=None):
        for k, v in self.buckets[self._index(key)]:
            if k == key:
                return v
        return default

if __name__ == "__main__":
    m = ChainedHashMap()
    m.put("name", "CS101")
    m.put("lang", "Python")
    m.put("name", "CS101 网站")
    print(m.get("name"), m.get("missing", "没有这个键"), "size =", m.size)
```

开放寻址法则不挂链：冲突时按固定规则（线性探测、二次探测、双重哈希）往后找下一个空槽。它的缓存更友好（数据都在同一个数组里），但**删除需要墓碑标记**，否则会把后续探测链切断。

| 维度 | 链地址法 | 开放寻址法 |
| --- | --- | --- |
| 冲突存储位置 | 桶外（链表 / 红黑树） | 表内其他空槽 |
| 负载因子容忍度 | 可以很高（>1） | 必须低于 1，通常 ≤ 0.7 |
| 删除 | 直接摘链 | 要标记墓碑，定期清理 |
| 缓存友好度 | 差（指针跳跃） | 好（连续内存） |

## 4.3 扩容与再哈希：为什么还是摊还 O(1)

桶数固定时，元素越多冲突越频繁。哈希表要设一个**负载因子**（元素数 / 桶数）阈值，超过就扩容并**把所有元素重新算一遍位置**（再哈希）。

```python
class GrowingHashMap:
    def __init__(self):
        self._resize(8)
        self.size = 0

    def _resize(self, bucket_count):
        old_pairs = [pair for bucket in getattr(self, "buckets", []) for pair in bucket]
        self.buckets = [[] for _ in range(bucket_count)]
        self.size = 0
        for key, value in old_pairs:
            self.put(key, value)

    def put(self, key, value):
        if (self.size + 1) / len(self.buckets) > 0.75:   # 负载因子超过 0.75 就翻倍
            self._resize(len(self.buckets) * 2)
        for pair in self.buckets[hash(key) % len(self.buckets)]:
            if pair[0] == key:
                pair[1] = value
                return
        self.buckets[hash(key) % len(self.buckets)].append([key, value])
        self.size += 1

if __name__ == "__main__":
    m = GrowingHashMap()
    for i in range(100):
        m.put(f"k{i}", i)
    print("size =", m.size, "buckets =", len(m.buckets))
```

单次扩容要搬 n 个元素，看起来是 O(n)；但每次扩容桶数翻倍，n 次插入里扩容总代价是 1+2+4+…+n < 2n，**均摊到每次插入仍是 O(1)**。这和动态数组的扩容是同一个论证（第 2 章）。

## 4.4 Python 的 dict / set：能用，但要守三条

日常写代码不必手写哈希表，`dict` 与 `set` 已经是最优实现（哈希表 + 冲突时的小数组 / 红黑树）。但有三条规则必须知道：

```python
# 1) 键必须可哈希（不可变）
# {[1, 2]: "x"}          → TypeError: unhashable type: 'list'
# 2) 自定义对象做键：hash 与 eq 必须同时定义
# 3) 不要依赖遍历顺序
d = {"b": 2, "a": 1, "c": 3}
print(list(d))              # 按插入顺序（CPython 3.7+ 的实现细节，不代表"有序表"）
print(d.get("missing"))     # 缺键返回 None，而不是抛 KeyError
```

```text
C:\code\dsa> python dict_rules.py
['b', 'a', 'c']
None
```

:::tip[两个高频误用]
一是拿 `list` 当 dict 的键（不可哈希），要先用 `tuple(values)` 转成不可变；二是把可变对象塞进 `set` 后修改它，哈希值变化会让这个元素"消失"在集合里。
:::

## 4.5 哈希表的四类典型用法

哈希表的本质是"**记住某个键出现过没有 / 出现过几次 / 对应什么值**"。四类问题几乎覆盖了它的日常用途。

```python
def two_sum(nums, target):
    """两数之和：边遍历边把"还差多少"记进哈希表，一趟 O(n)"""
    seen = {}
    for index, value in enumerate(nums):
        need = target - value
        if need in seen:
            return [seen[need], index]
        seen[value] = index
    return []

def group_words(words):
    """分组：键是分组依据，值是同一组的元素"""
    groups = {}
    for word in words:
        key = "".join(sorted(word))       # 字母相同的词归为一组
        groups.setdefault(key, []).append(word)
    return list(groups.values())

if __name__ == "__main__":
    print(two_sum([2, 7, 11, 15], 9))
    print(group_words(["eat", "tea", "tan", "nat", "bat"]))
```

| 用法 | 数据结构 | 典型问题 |
| --- | --- | --- |
| 计数 | dict：键 → 次数 | 词频统计、字符出现次数、Top-K 的前置步骤 |
| 去重 / 判重 | set | 数组去重、BFS 记录访问过的节点（第 7 章） |
| 分组 | dict：键 → list | 字母异位词分组、按字段聚合 |
| 映射 / 缓存 | dict：键 → 值 | 两数之和、LRU 缓存的索引层 |

## 4.6 最坏情况：从 O(1) 退化到 O(n)

哈希表不是无条件 O(1)。如果所有键都冲突到同一个桶，链地址法就变成普通链表，查找 O(n)——这就是**哈希洪水攻击**（攻击者构造大量同桶键，让服务器卡死）。工程上的应对：

- 用带随机种子的哈希（Python 的字符串哈希默认随机化）；
- 桶内链过长时转成红黑树（Java 8 的 `HashMap` 在链长 ≥ 8 时树化）；
- 对不可信输入做键数量与长度限制。

另外两个常见坑：

```text
坑 1：把"顺序"当成契约——dict 的遍历顺序是插入顺序的实现细节，
      排序需求请显式 sorted(d.items())。
坑 2：在遍历 dict 时增删键——RuntimeError: dictionary changed size during iteration，
      需要先 list(d.items()) 再遍历。
```

## 4.7 综合练习：用哈希表做"最近窗口计数"

第 3 章的滑动窗口计数只用了计数器；现在换成任意窗口大小 k 的访问记录，用"队列记录顺序 + 哈希表记次数"，两个结构各司其职。

```python
from collections import deque

class RecentWindow:
    def __init__(self, k):
        self.k = k
        self.history = deque()               # 队列负责"最近 k 条"的边界
        self.counter = {}                    # 哈希表负责窗口内计数

    def visit(self, key):
        self.history.append(key)
        self.counter[key] = self.counter.get(key, 0) + 1
        while len(self.history) > self.k:
            expired = self.history.popleft()
            self.counter[expired] -= 1
            if self.counter[expired] == 0:
                del self.counter[expired]     # 计数归零必须删键，否则表只增不减

    def count(self, key):
        return self.counter.get(key, 0)

if __name__ == "__main__":
    window = RecentWindow(3)
    for key in ("a", "b", "a", "c", "a"):
        window.visit(key)
    print("a:", window.count("a"), " b:", window.count("b"), " c:", window.count("c"))
```

```text
C:\code\dsa> python recent_window.py
a: 2  b: 0  c: 1
```

三个易错点：出队与减计数必须成对，漏一个计数就永远偏高；计数归零要删键，否则哈希表只增不减（内存泄漏的常见形态）；窗口用 `while` 收缩，批量灌入时一次可能淘汰多条。

## 本章小结

- 哈希表 = 哈希函数 + 桶数组：平均 O(1) 的前提是均匀哈希与可控负载因子，最坏情况 O(n)
- 冲突处理两派：链地址法实现简单、容忍高负载因子；开放寻址法缓存友好，但删除需要墓碑
- 扩容时桶数翻倍并再哈希，单次 O(n)、摊还 O(1)，与动态数组扩容同一论证
- dict / set 的键必须可哈希，遍历顺序不是契约；计数、去重、分组、映射是四类基本用法
- 对不可信输入要防哈希洪水；工程实现会在链过长时树化
