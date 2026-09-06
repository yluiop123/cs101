---
title: 函数与作用域
---

# 第 4 章 · 函数与作用域

**本章目标：**

- 掌握函数定义、参数的各种形态
- 理解作用域（LEGB）与闭包
- 会写类型提示让代码可维护

## 4.1 函数定义与调用

```python
def greet(name):
    """向指定的人问好（文档字符串 docstring）"""
    return f"你好，{name}！"

greet("Tom")             # '你好，Tom！'
greet.__doc__            # '向指定的人问好（文档字符串 docstring）'
help(greet)              # 查看文档
```

函数是**一等公民（first-class）**：可以赋值给变量、当参数传、当返回值——与 JS 函数同级待遇（Java 要用接口包装，Python 直接来）：

```python
def add(a, b):
    return a + b

ops = {"add": add, "mul": lambda x, y: x * y}
ops["add"](1, 2)         # 3
```

## 4.2 参数的五种形态

```python
# ① 位置参数：按顺序
def power(base, exp):
    return base ** exp

power(2, 10)             # 1024

# ② 关键字参数：按名传（顺序随意、可读性好）
power(exp=10, base=2)    # 1024

# ③ 默认参数：可省略
def power(base, exp=2):
    return base ** exp

power(3)                 # 9

# ④ 可变位置参数 *args：收集成元组
def sum_all(*args):
    return sum(args)

sum_all(1, 2, 3)         # 6

# ⑤ 可变关键字参数 **kwargs：收集成字典
def config(**kwargs):
    return kwargs

config(host="localhost", port=8080)   # {'host': 'localhost', 'port': 8080}

# 完整签名顺序：位置 → 默认 → *args → **kwargs
def full(a, b=1, *args, **kwargs): ...
```

::: danger 默认参数陷阱：可变默认值
```python
def add_item(item, items=[]):      # ❌ 默认列表在函数定义时创建一次，跨调用共享！
    items.append(item)
    return items

add_item(1)    # [1]
add_item(2)    # [1, 2] —— 上一调用的残留还在！

def add_item(item, items=None):    # ✅ 标准解法：None 哨兵
    if items is None:
        items = []
    items.append(item)
    return items
```
:::

## 4.3 返回值：元组与多返回

```python
def min_max(nums):
    return min(nums), max(nums)      # 返回元组

lo, hi = min_max([3, 1, 4])          # 接收端解包
```

没有 return 语句的函数返回 `None`——Java 的 void 在 Python 里是"隐式返回 None"。

## 4.4 作用域：LEGB 规则

变量查找顺序：**L**ocal → **E**nclosing（外层函数）→ **G**lobal（模块）→ **B**uilt-in（内置）：

```python
x = "global"                 # G

def outer():
    x = "enclosing"          # E
    def inner():
        x = "local"          # L —— 遮蔽外层
        print(x)             # local
    inner()

outer()
```

内层要**修改**外层变量，必须显式声明：

```python
count = 0

def increment():
    global count             # 声明操作的是全局变量
    count += 1

def outer2():
    n = 10
    def inner2():
        nonlocal n           # 声明操作的是外层函数的变量
        n += 1
    inner2()
```

::: warning 减少用 global
全局可变状态是 bug 温床——数据通过**参数传入、返回值带出**才是正道。global/nolocal 认识即可，正式代码极少用。
:::

## 4.5 闭包（closure）

**闭包** = 内层函数"记住"外层函数的变量：

```python
def make_multiplier(factor):
    def multiply(x):
        return x * factor       # factor 被内层函数捕获
    return multiply

double = make_multiplier(2)     # 每次调用产生独立闭包
triple = make_multiplier(3)

double(5)     # 10
triple(5)     # 15
```

闭包是装饰器（第 10 章）的基石——"函数工厂"模式。

## 4.6 类型提示（type hints）

```python
def process(items: list[str], limit: int = 10) -> list[str]:
    """处理条目并返回前 limit 个"""
    return items[:limit]

# 常用标注
def find_user(uid: int) -> dict | None:      # 可能返回 None（3.10+ 联合类型写法）
    ...

from typing import Callable
def apply(fn: Callable[[int], int], x: int) -> int:   # 函数类型
    return fn(x)

class User: ...
def save(user: User) -> None: ...            # 类类型
```

类型提示**运行时不校验**（传错类型不报错），但编辑器智能提示、mypy 静态检查、FastAPI 的参数验证都靠它——现代 Python 工程的标配。

## 4.7 lambda 与高阶函数

```python
# lambda：一行小函数（能 def 就别用 lambda 表达复杂逻辑）
square = lambda x: x ** 2

# 高阶函数三件套（配合推导式使用）
nums = [3, 1, 4, 1, 5]

sorted(nums, key=lambda x: -x)               # 降序排序
list(map(str, nums))                          # ['3','1','4','1','5']
sum(x for x in nums if x % 2 == 1)           # 生成器表达式求奇数和：9
```

## 4.8 综合练习：命令行计算器（函数版）

```python
OPERATIONS = {
    "add": lambda a, b: a + b,
    "sub": lambda a, b: a - b,
    "mul": lambda a, b: a * b,
    "div": lambda a, b: a / b if b != 0 else None,
}

def calculate(op: str, a: float, b: float) -> float | None:
    fn = OPERATIONS.get(op)
    return fn(a, b) if fn else None

while True:
    line = input("> ").strip()
    if line == "quit":
        break
    parts = line.split()
    if len(parts) != 3:
        print("格式：add 1 2"); continue
    result = calculate(parts[0], float(parts[1]), float(parts[2]))
    print(result if result is not None else "无法计算")
```

字典 + lambda + 类型提示——"命令分发"从 Java 的 switch 变成了**数据驱动**。

## 本章小结

- 函数一等公民；默认参数用 None 哨兵防可变陷阱
- 参数五形态：位置/关键字/默认/*args/**kwargs
- LEGB 作用域；闭包捕获外层变量（装饰器基石）
- 类型提示提升可维护性；lambda 只做一行小事
