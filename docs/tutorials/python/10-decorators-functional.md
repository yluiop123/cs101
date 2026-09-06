---
title: 装饰器与函数式特性
---

# 第 10 章 · 装饰器与函数式特性

**本章目标：**

- 理解装饰器（decorator）的原理与写法
- 掌握带参数装饰器与 functools 常用工具
- 熟悉函数式特性的日常用法

## 10.1 装饰器是什么

**装饰器（decorator）**= 接收函数、返回新函数的高阶函数——给函数"套壳"增强，调用方无感：

```python
def uppercase(func):                      # 接收一个函数
    def wrapper(*args, **kwargs):         # 定义"壳"
        result = func(*args, **kwargs)    # 调用原函数
        return result.upper()             # 增强行为
    return wrapper                        # 返回新函数

@uppercase                                # 等价于 shout = uppercase(shout)
def shout(text):
    return text

shout("hello")          # 'HELLO'
```

`@` 语法只是糖：`@decorator` 之上的定义行 = `原函数 = decorator(原函数)`。日志、计时、重试、鉴权、缓存——**横切关注点**全部靠它实现（Web 框架的路由注册也是装饰器：`@app.get("/todos")`）。

## 10.2 保留元信息：functools.wraps

被装饰后，函数的 `__name__`/`__doc__` 变成 wrapper 的——修复它：

```python
import functools

def uppercase(func):
    @functools.wraps(func)                # 把原函数的元信息拷贝到 wrapper
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs).upper()
    return wrapper

@uppercase
def shout(text):
    """大声喊"""
shout.__name__      # 'shout'（不加 wraps 会是 'wrapper'）
shout.__doc__       # '大声喊'
```

**写装饰器必带 `@functools.wraps(func)`**——调试器、文档工具、序列化都依赖元信息。

## 10.3 带参数的装饰器

三层嵌套：外层收参数、中层收函数、内层执行：

```python
import functools

def repeat(times: int):                        # ① 装饰器工厂：接收参数
    def decorator(func):                       # ② 真正的装饰器：接收函数
        @functools.wraps(func)
        def wrapper(*args, **kwargs):          # ③ 壳：执行增强
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(times=3)
def greet(name):
    print(f"你好，{name}")

greet("Tom")     # 打印 3 次
```

读法：`@repeat(times=3)` 先执行 `repeat(3)` 得到真装饰器，再套到 greet 上。

## 10.4 实战装饰器三件套

```python
import functools
import time

# ① 计时器：性能排查神器
def timing(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__} 耗时 {time.perf_counter() - start:.4f}s")
        return result
    return wrapper

# ② 缓存：自动记忆重复计算（functools 现成的！）
@functools.lru_cache(maxsize=None)            # Python 3.9+ 也可用 @functools.cache
def fib(n: int) -> int:
    return n if n < 2 else fib(n - 1) + fib(n - 2)

fib(80)     # 瞬间出结果（无缓存的递归要算几个世纪）

# ③ 重试：网络请求标配
def retry(times: int, delay: float = 1.0):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == times:
                        raise                 # 最后一次失败：抛出
                    print(f"第 {attempt} 次失败：{e}，{delay}s 后重试")
                    time.sleep(delay)
        return wrapper
    return decorator

@retry(times=3, delay=0.5)
def fetch(url):
    ...
```

## 10.5 类装饰器与方法装饰器

```python
# 装饰类：包装整个类
def add_repr(cls):
    def __repr__(self):
        return f"<{cls.__name__} {self.__dict__}>"
    cls.__repr__ = __repr__
    return cls

@add_repr
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

Point(1, 2)          # <Point {'x': 1, 'y': 2}>

# 单个方法的装饰器：与方法装饰器写法一致（self 会作为第一个位置参数传入）
class Server:
    @timing                                    # 方法也能装饰
    def start(self):
        ...
```

## 10.6 函数式特性

```python
# map / filter / zip（配推导式选择：Python 社区更爱推导式）
list(map(str.upper, ["a", "b"]))        # ['A', 'B']
list(filter(lambda x: x > 0, [-1, 2]))  # [2]

# functools.partial：预设参数（函数"半成品"）
from functools import partial
int2 = partial(int, base=2)             # 二进制转十进制
int2("1010")                            # 10

# 偏函数在日志/回调中的用途
def send(to, subject, body): ...
welcome = partial(send, subject="欢迎注册")    # 主题固定，to/body 后补

# 不可变思维：用元组代替列表当常量、推导式产生新集合而不是原地修改
```

## 10.7 综合练习：装饰器驱动的命令行框架

```python
import functools

COMMANDS = {}                             # 命令注册表

def command(name: str, desc: str = ""):
    """把函数注册为命令（Flask 路由的思想原型）"""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            return func(*args, **kwargs)
        COMMANDS[name] = (wrapper, desc)
        return wrapper
    return decorator

@command("add", "添加待办")
def cmd_add(text: str):
    print(f"已添加：{text}")

@command("list", "列出全部")
def cmd_list():
    print("全部任务")

@command("help", "显示帮助")
def cmd_help():
    for name, (_, desc) in COMMANDS.items():
        print(f"{name:8} {desc}")

# 分发循环
while (line := input("> ").strip()):
    parts = line.split(maxsplit=1)
    entry = COMMANDS.get(parts[0])
    if entry:
        entry[0](*parts[1:])
    else:
        cmd_help()
```

装饰器注册命令 + 数据驱动分发——FastAPI 的 `@app.get()` 路由装饰器就是这个模式的直系后代。

## 本章小结

- 装饰器 = 高阶函数套壳；`@` 是 `f = decorator(f)` 的糖
- 必带 `@functools.wraps` 保留元信息；带参数装饰器三层嵌套
- lru_cache 缓存、timing 计时、retry 重试是三件套；框架的 @app.get 同源
- partial 预设参数；函数式特性在 Python 以推导式为首选表达
