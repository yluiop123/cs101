---
title: 核心数据结构：list / tuple / dict / set
---

# 第 3 章 · 核心数据结构：list / tuple / dict / set

**本章目标：**

- 熟练掌握四大内置容器的增删改查
- 掌握切片与列表/字典推导式
- 理解可变与不可变的区别

## 3.1 list：可变有序列表

Python 的"万能数组"（对应 JS 数组 / Java 的 ArrayList，但元素类型可以混搭）：

```python
nums = [3, 1, 4, 1, 5]

nums.append(9)          # 尾部追加 → [3,1,4,1,5,9]
nums.insert(0, 2)       # 指定位置插入
nums.extend([6, 5])     # 合并另一个列表
nums.pop()              # 弹出末尾并返回
nums.pop(0)             # 弹出指定下标
nums.remove(4)          # 按值删（只删第一个）
nums.index(5)           # 值的下标
nums.count(1)           # 出现次数
nums.sort()             # 原地排序
nums.reverse()          # 原地反转
sorted(nums)            # 返回新列表（不改原列表）
len(nums); sum(nums); max(nums); min(nums)
```

### 切片（slice）：下标艺术

```python
nums = [0, 1, 2, 3, 4, 5]

nums[1:4]      # [1, 2, 3]     含头不含尾
nums[:3]       # [0, 1, 2]     前三个
nums[-2:]      # [4, 5]        最后两个
nums[::-1]     # 反转副本
nums[::2]      # [0, 2, 4]     隔一个取一个
copy = nums[:] # 浅拷贝
```

切片对字符串同样适用——`"hello"[::-1]` 得到 `"olleh"`。

### 可变与共享引用的坑

```python
a = [1, 2, 3]
b = a              # 引用同一个列表！
b.append(4)
a                  # [1, 2, 3, 4] —— a 也变了

c = a[:]           # 浅拷贝：新列表（嵌套元素仍是共享引用）
import copy
deep = copy.deepcopy(a)   # 深拷贝：完全独立
```

## 3.2 tuple：不可变序列

```python
point = (3, 5)
single = (42,)         # 单元素元组必须带逗号！
x, y = point           # 解包（unpacking）
first, *rest = [1, 2, 3, 4]   # 星号解包 → first=1, rest=[2,3,4]
```

**用途**：不应被修改的数据（坐标、配置）、函数多返回值、字典的键（可哈希）。

```python
def min_max(nums):
    return min(nums), max(nums)     # 返回元组

lo, hi = min_max([3, 1, 4])         # 接收端解包
```

## 3.3 dict：键值对（最常用）

```python
user = {"name": "Tom", "age": 18}

user["name"]                  # 'Tom'
user["email"]                 # ❌ KeyError —— 不存在直接炸
user.get("email")             # None —— 安全读取
user.get("email", "未填写")    # '未填写' —— 带默认值

user["email"] = "t@x.com"     # 添加/覆盖
del user["age"]               # 删除
user.pop("email")             # 删除并返回值
"name" in user                # True —— 判断键
list(user.keys())             # 所有键
list(user.values())           # 所有值
list(user.items())            # [('name','Tom'), ...] 键值对列表

# 遍历
for key, value in user.items():
    print(key, value)

# 合并
defaults = {"host": "localhost", "port": 8080}
config = {**defaults, "port": 9090}       # 星号解包合并 → port 被覆盖
```

### 字典计数三连

```python
counts = {}
for word in text.split():
    counts[word] = counts.get(word, 0) + 1     # 经典写法

# 或用 collections.Counter（标准库，第 8 章）
from collections import Counter
counts = Counter(text.split())
counts.most_common(3)     # 出现最多的前 3 个
```

## 3.4 set：去重与集合运算

```python
tags = {"python", "backend", "python"}    # {'python', 'backend'} —— 自动去重
empty = set()                              # 空集合（{} 是空字典！）

tags.add("fast")
tags.discard("slow")              # 删除（不存在也不报错）
"python" in tags                  # O(1) 成员判断 —— 海量判重用 set

# 集合运算
a = {1, 2, 3}
b = {2, 3, 4}
a & b      # {2, 3}      交集
a | b      # {1, 2, 3, 4} 并集
a - b      # {1}         差集
a ^ b      # {1, 4}      对称差（不同时属于两者的）
```

## 3.5 推导式：Python 的招牌语法

**推导式（comprehension）**= 一行完成"遍历+转换+过滤+收集"：

```python
# 列表推导式
[x ** 2 for x in range(5)]              # [0, 1, 4, 9, 16]
[x for x in range(10) if x % 2 == 0]    # [0, 2, 4, 6, 8]
[f"{name}:{score}" for name, score in [("Tom", 92), ("Lucy", 88)]]

# 字典推导式
{word: len(word) for word in ["java", "go"]}    # {'java': 4, 'go': 2}

# 集合推导式
{x % 3 for x in range(10)}      # {0, 1, 2}

# 嵌套：矩阵转置
matrix = [[1, 2, 3], [4, 5, 6]]
[[row[i] for row in matrix] for i in range(3)]   # [[1,4],[2,5],[3,6]]
```

::: tip 推导式 vs 循环
```python
# 这两段等价，推导式更"声明式"
squares = []
for x in range(5):
    squares.append(x ** 2)

squares = [x ** 2 for x in range(5)]
```
复杂逻辑（多层嵌套条件）时退回普通循环——**可读性优先**。
:::

## 3.6 容器选型速查

| 需求 | 选择 | 示例 |
| --- | --- | --- |
| 有序、可增删改 | list | 任务列表 |
| 不可变记录 | tuple | 坐标、多返回值 |
| 键找值、缓存、计数 | dict | 用户信息、配置 |
| 去重、成员判断 | set | 标签集合、已访问ID |

## 3.7 综合练习：学生成绩统计

```python
students = [
    {"name": "Tom", "clazz": "A", "score": 92},
    {"name": "Lucy", "clazz": "B", "score": 85},
    {"name": "Jerry", "clazz": "A", "score": 78},
    {"name": "Lily", "clazz": "B", "score": 95},
]

# ① 及格名单按分排序（推导式 + sorted）
passed = sorted([s for s in students if s["score"] >= 80],
                key=lambda s: -s["score"])

# ② 按班分组
groups = {}
for s in students:
    groups.setdefault(s["clazz"], []).append(s["name"])

# ③ 每班平均分
avg = {c: sum(s["score"] for s in students if s["clazz"] == c) /
          len([s for s in students if s["clazz"] == c])
       for c in groups}

print(passed)      # Lily 95, Tom 92, Lucy 85
print(groups)      # {'A': ['Tom', 'Jerry'], 'B': ['Lucy', 'Lily']}
print(avg)         # {'A': 85.0, 'B': 90.0}
```

list 过滤排序、dict 分组、推导式聚合——数据处理的日常三板斧。

## 本章小结

- list 万能列表 + 切片；tuple 不可变 + 解包
- dict 用 get 防炸、items 遍历、merge/Counter 计数
- set 去重 + &|^| 运算；{} 是空字典，空集合用 set()
- **推导式一行搞定遍历转换过滤**，复杂逻辑退回循环
