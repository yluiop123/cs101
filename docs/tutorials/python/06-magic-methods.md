---
title: 魔术方法与迭代器生成器
---

# 第 6 章 · 魔术方法与迭代器生成器

**本章目标：**

- 理解魔术方法（dunder methods）如何驱动内置语法
- 掌握 `__str__`/`__repr__`/`__eq__` 等高频魔术方法
- 学会迭代器协议与生成器

## 6.1 魔术方法：语法的发动机

双下划线方法（**魔术方法 / dunder methods**）让自定义对象接入 Python 内置语法：

```python
len(obj)        →  obj.__len__()
for x in obj    →  obj.__iter__()
print(obj)      →  obj.__str__()
a == b          →  a.__eq__(b)
a + b           →  a.__add__(b)
obj["key"]      →  obj.__getitem__("key")
with obj        →  obj.__enter__() / obj.__exit__()
```

你写 `a + b`，Python 实际调用 `a.__add__(b)`——**运算符就是魔术方法的语法糖**。

## 6.2 高频魔术方法速成

```python
class Playlist:
    def __init__(self, name: str):
        self.name = name
        self.songs: list[str] = []

    def __repr__(self) -> str:              # 开发者视角（调试/REPL 显示）
        return f"Playlist({self.name!r}, {len(self.songs)} 首)"

    def __str__(self) -> str:               # 用户视角（print/str()）
        return f"歌单「{self.name}」共 {len(self.songs)} 首"

    def __len__(self) -> int:               # 接入 len()
        return len(self.songs)

    def __contains__(self, song: str) -> bool:   # 接入 in
        return song in self.songs

    def __eq__(self, other) -> bool:        # 接入 ==
        if not isinstance(other, Playlist):
            return NotImplemented
        return self.songs == other.songs

    def __add__(self, other: "Playlist") -> "Playlist":   # 接入 +
        merged = Playlist(f"{self.name}+{other.name}")
        merged.songs = self.songs + other.songs
        return merged

p = Playlist("学习")
p.songs.append("Focus")
len(p)                # 1 —— 因为 __len__
"Focus" in p          # True —— 因为 __contains__
print(p)              # 歌单「学习」共 1 首
```

| 魔术方法 | 触发场景 | 常用度 |
| --- | --- | --- |
| `__init__` | 构造 | ★★★ |
| `__repr__` / `__str__` | 调试显示 / print | ★★★ |
| `__eq__` / `__hash__` | == / 集合字典键 | ★★★ |
| `__len__` / `__contains__` / `__getitem__` | len/in/下标 | ★★ |
| `__add__` / `__lt__` 等 | 运算符/比较 | ★★ |
| `__iter__` / `__next__` | for 循环 | ★★（第 6.4 节） |
| `__enter__` / `__exit__` | with 上下文 | ★★ |

`__repr__` vs `__str__`：repr 给开发者看（应可复现对象），str 给用户看。只写一个时写 `__repr__`（str 缺省时回落到 repr）。

## 6.3 迭代器协议

`for x in obj` 背后的机制——**迭代器（iterator）协议**：

```python
class Countdown:
    def __init__(self, start: int):
        self.current = start

    def __iter__(self):          # 返回迭代器（自己就是，返回 self）
        return self

    def __next__(self):          # 每次循环取下一个值
        if self.current <= 0:
            raise StopIteration  # 没有更多元素的标准信号
        self.current -= 1
        return self.current + 1

for n in Countdown(3):       # 3 2 1 —— for 自动调 __iter__/__next__，捕获 StopIteration
    print(n)
```

实现了 `__iter__` 的对象叫**可迭代对象（iterable）**；同时实现 `__next__` 的叫迭代器。

## 6.4 生成器：迭代器的省力写法

**生成器（generator）**用 `yield` 关键字把"写迭代器"变成"写普通函数"：

```python
def countdown(start: int):
    while start > 0:
        yield start          # 暂停并交出一个值；下次从这一行继续
        start -= 1

for n in countdown(3):       # 3 2 1 —— 等价于上面 20 行的类
    print(n)

# 生成器表达式：推导式的惰性版
sum(x * x for x in range(10**8))    # 不创建 1 亿元素列表，边生成边算 —— 内存 O(1)
```

### yield 的执行流

```python
def gen():
    print("开始")
    yield 1
    print("继续")
    yield 2

g = gen()
next(g)     # 打印"开始"，返回 1（函数在此暂停）
next(g)     # 从 yield 1 的下一行继续，打印"继续"，返回 2
next(g)     # StopIteration（函数结束）
```

**惰性求值**：用到才算、一次一个——处理大文件、无限序列的标准姿势。

```python
# 读超大文件：逐行惰性处理，内存占用恒定
def error_lines(path):
    with open(path) as f:
        for line in f:
            if "ERROR" in line:
                yield line.strip()

for line in error_lines("app.log"):
    print(line)
```

## 6.5 上下文管理器：with 的原理

`with` 语句（第 9 章文件）背后是 `__enter__`/`__exit__`：

```python
class Timer:
    def __enter__(self):
        import time
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        import time
        print(f"耗时 {time.perf_counter() - self.start:.3f}s")
        return False       # False = 异常继续向外抛（True = 吞掉异常）

with Timer():
    sum(x * x for x in range(10**7))
# 耗时 0.512s —— 自动成对"进入/退出"，异常也保证退出
```

**contextlib 更省事**（生成器版上下文管理器）：

```python
from contextlib import contextmanager

@contextmanager
def timer():
    import time
    start = time.perf_counter()
    try:
        yield                        # yield 之前 = __enter__，之后 = __exit__
    finally:
        print(f"耗时 {time.perf_counter() - start:.3f}s")

with timer():
    do_something()
```

## 6.6 综合练习：斐波那契流

```python
def fibonacci():
    """无限斐波那契生成器 —— 配 itertools.islice 取前 N 个"""
    a, b = 0, 1
    while True:              # 无限循环也没问题：惰性求值
        yield a
        a, b = b, a + b

from itertools import islice
print(list(islice(fibonacci(), 10)))   # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

# 找第一个超过 1000 的斐波那契数
from itertools import takewhile
first_gt_1000 = next(x for x in fibonacci() if x > 1000)
print(first_gt_1000)    # 1597
```

## 本章小结

- 魔术方法接入内置语法：`len/in/+/==/print` 全是 `__xxx__` 的糖
- 只写一个显示方法时选 `__repr__`；`__eq__` 常配 `__hash__`
- 迭代器协议 = `__iter__` + `__next__`；生成器用 yield 两行实现
- 生成器惰性求值管大文件/无限流；contextmanager 造 with 对象
