---
title: "第 6 章 · 行为型模式（下）"
description: "上一章关注「通知与算法」，这一章关注「流程与控制」：责任链管请求怎么在多个处理者间传递，状态管对象随状态如何改变行为，命令管如何把一次操作变成对象，迭代器管如何在不暴露内部结构的前提下遍历。"
series: design-patterns
sidebar:
  order: 6
  label: "行为型模式（下）"
difficulty: advanced
duration: 5
tableOfContents: true
---

**本章目标：**

- 用责任链搭出可短路的中间件/校验流水线
- 用状态模式把散落的状态判断收敛成状态机，并支持表驱动与持久化
- 用命令实现可撤销与队列化，用迭代器协议做惰性求值

## 6.1 本章四个模式的位置

上一章关注「通知与算法」，这一章关注「流程与控制」：责任链管**请求怎么在多个处理者间传递**，状态管**对象随状态如何改变行为**，命令管**如何把一次操作变成对象**，迭代器管**如何在不暴露内部结构的前提下遍历**。它们的共同点是：把「控制流的决定权」从写死的代码里挪到可配置的对象上。

## 6.2 责任链：中间件链与短路

责任链把一串处理者连起来，每个处理者决定「处理并继续」还是「拦下并短路」。Web 中间件就是最典型的责任链。

```python
class Chain:
    def __init__(self): self.handlers = []
    def add(self, h): self.handlers.append(h); return self
    def run(self, ctx):
        for h in self.handlers:
            if h(ctx) is False:              # 返回 False 即短路
                return False
        return True

def auth(ctx):
    return bool(ctx.get("token"))            # 无 token 直接短路，后面不跑
def ratelimit(ctx):
    return ctx["remaining"] > 0

pipe = Chain().add(auth).add(ratelimit).add(lambda c: record(c))
pipe.run({"token": None, "remaining": 5})    # 卡在 auth，record 不执行
```

:::caution[洋葱模型的两段]
上一节是「进入型」链：任一环节 return False 就停止向后传递。Gin/Express 那种「前后都执行」的洋葱模型则是嵌套调用：进入时做鉴权、调用下游、返回时做计时。两种都属责任链，区别只在**是否允许在处理者里写「下游之后」的逻辑**——需要收尾/统计就用洋葱，只需层层放行就用平链。
:::

校验流水线是平链的好用武之地：定价校验、库存校验、风控校验依次放行，任意一步不过就短路返回原因。

## 6.3 状态模式：告别 if 地狱

当对象行为高度依赖当前状态，代码会长成一团 `if state == ...`。状态模式把「每个状态的行为」收进各自的状态类：

```python
class OrderState:
    def pay(self, order): raise InvalidTransition("pay")
    def ship(self, order): raise InvalidTransition("ship")
    def cancel(self, order): raise InvalidTransition("cancel")

class Pending(OrderState):
    def pay(self, order):
        order.state = Paid()                 # 处理后迁移状态
    def cancel(self, order):
        order.state = Cancelled()

class Paid(OrderState):
    def ship(self, order):
        order.state = Shipped()
    def cancel(self, order):
        order.state = Refunding()

class InvalidTransition(Exception): pass

class Order:
    def __init__(self): self.state = Pending()
    def pay(self): self.state.pay(self)      # 委托给当前状态
    def ship(self): self.state.ship(self)
```

非法流转（比如未支付就发货）不再靠「记得写判断」，而是**默认基类直接抛异常**——没在子类里重写的动作自动非法。这把「合法迁移」编码进了类型结构，遗漏即报错，比散落各处的 if 安全得多。对照[第 5 章 · 行为型模式（上）](../05-behavioral-a/)：状态对象就是「按状态切换的策略」。

## 6.4 表驱动与状态持久化

状态类写多了会繁琐。当迁移规则简单、无复杂副作用时，**表驱动状态机**更轻：一张迁移表 + 一个通用执行器。

```python
TRANSITIONS = {                    # (当前状态, 动作) -> 新状态
    ("pending", "pay"):    "paid",
    ("pending", "cancel"): "cancelled",
    ("paid",    "ship"):   "shipped",
    ("paid",    "cancel"): "refunding",
}

def transition(order, action):
    key = (order.status, action)
    if key not in TRANSITIONS:
        raise InvalidTransition(action)
    order.status = TRANSITIONS[key]
```

表驱动的好处是迁移规则**集中在一张可审计、可序列化的表**里。要持久化状态机也简单：状态本身就是字符串或枚举，落库时存 `status` 一列，读回来即恢复；表在代码里，不进数据库。状态模式与表驱动的取舍：

```text
每个状态行为差异大、有复杂副作用  → 状态类
迁移是纯查表、行为都在外面        → 表驱动
要把「合法迁移」暴露给运营配置    → 表驱动（表可放配置/DB）
```

## 6.5 命令：可撤销与队列化

命令模式把「一次操作」封装成对象：`execute` 做，`undo` 撤。因为操作成了对象，就能排队、记录、重放、撤销。

```python
class Command:
    def execute(self): raise NotImplementedError
    def undo(self): raise NotImplementedError

class AddItem(Command):
    def __init__(self, cart, sku): self.cart, self.sku = cart, sku
    def execute(self): self.cart.items.append(self.sku)
    def undo(self):    self.cart.items.remove(self.sku)

class Editor:
    def __init__(self): self.history = []
    def do(self, cmd):
        cmd.execute()
        self.history.append(cmd)             # 记录以便撤销
    def undo(self):
        if self.history:
            self.history.pop().undo()
```

撤销栈（甚至重做栈）、任务队列、操作日志回放，都建立在「命令是对象」这一点上。代价是每个操作都要成对实现 execute/undo，**只读或不可逆的操作别硬套命令**。

## 6.6 迭代器协议与惰性求值

迭代器模式在 Python 里是语言内置的：实现 `__iter__`/`__next__`（或用生成器）就能支持 `for`。价值在于**遍历不暴露底层结构，且能惰性产出**。

```python
class LogRange:
    def __init__(self, start, end): self.start, self.end = start, end
    def __iter__(self):
        i = self.start
        while i <= self.end:
            yield i                          # 惰性：一次产一个，不建列表
            i += 1

# 生成器天然惰性，管道可无限长
def parse(lines):
    for ln in lines:                         # 逐行处理，内存恒定
        yield ln.split(",", 1)

first3 = []
for item in LogRange(1, 10_000_000):         # 不会真的分配千万级列表
    first3.append(item)
    if len(first3) == 3: break
```

惰性求值把「构造集合」和「消费集合」分开：上例里十亿级范围也占常数量内存，`break` 后剩余根本不产出。这是迭代器/生成器相较「先 `list(...)` 再遍历」的核心优势。

对比错误写法 → 正确写法：

```python
# 错误：先把巨大范围物化成列表，内存爆表
first3 = list(range(1, 10_000_000))[:3]
# 正确：迭代器/生成器惰性产出，取够即停
first3 = []
for x in LogRange(1, 10_000_000):
    first3.append(x)
    if len(first3) == 3: break
```

原因：`list(range(...))` 会真的分配千万级对象再切片，而迭代器只在 `for` 推进一步时产一个值，提前 `break` 后面的根本不生成——数据规模与内存占用彻底解耦。

## 6.7 中介者、访问者与综合练习

**中介者**把多对多的对象通信改成「都只跟中介说话」——聊天室、UI 控件联动是典型。它少用的原因：中介者本身容易膨胀成「上帝对象」，业务全堆进一个协调者，反而更难测。**访问者**把「对一组元素的不同操作」集中到访问者对象，便于新增操作而不动元素结构；它少用的原因：元素类一旦增加，所有访问者都要改（双分派、依赖稳定的元素类型），在 Python 里通常用「按类型的分派字典」或模式匹配替代，收益不如代价大。

综合练习——把命令 + 责任链 + 迭代器串成一个小撤销流水线：

```python
class Cmd:
    def __init__(self, do, undo): self._do, self._undo = do, undo
    def execute(self): self._do()
    def undo(self):    self._undo()

class Runner:
    def __init__(self, guard): self.guard, self.done = guard, []
    def run(self, cmds):
        for cmd in cmds:                     # 迭代器逐个消费（可来自生成器）
            if not self.guard(cmd): break     # 责任链式放行判断
            cmd.execute(); self.done.append(cmd)
    def rollback(self):
        for cmd in reversed(self.done):       # 逆序撤销
            cmd.undo()

# 命令来自惰性生成
def build_cmds(actions):
    for a in actions:
        yield Cmd(lambda a=a: apply(a), lambda a=a: revert(a))
```

自查三点：guard 返回 False 能短路且不记录该命令；`build_cmds` 是生成器、不预先物化全部命令；`rollback` 严格逆序。三条都成立，说明本章四个模式的组合用对了。

## 本章小结

- 责任链用「放行或短路」组织中间件/校验，平链适合层层放行、洋葱模型适合需要收尾统计
- 状态模式把状态行为收进类、非法流转靠基类默认抛错兜底；简单迁移可用表驱动，状态天然可持久化
- 命令把操作变对象，从而支持撤销栈与队列，但只要求可逆成对的操作才值得
- 迭代器（生成器）让遍历不暴露结构且惰性求值，内存恒定；中介者/访问者因易造出上帝对象和双分派成本而少用
