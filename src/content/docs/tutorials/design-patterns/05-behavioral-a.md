---
title: "第 5 章 · 行为型模式（上）"
description: "创建型解决「对象怎么来」，结构型解决「对象怎么搭」，行为型解决的是对象之间怎么通信、职责怎么划分。判断该不该用某个行为型模式，先问三个问题："
series: design-patterns
sidebar:
  order: 5
  label: "行为型模式（上）"
difficulty: advanced
duration: 5
---

**本章目标：**

- 用观察者模式把「谁关心」与「谁发生」解耦，并识别事件总线的内存泄漏
- 用策略模式替换成串 if-else，并说清它退化为「传函数」的边界
- 理解模板方法的反向控制与钩子，知道函数式语言为何常常不需要它

## 5.1 行为型模式关心什么

创建型解决「对象怎么来」，结构型解决「对象怎么搭」，行为型解决的是**对象之间怎么通信、职责怎么划分**。判断该不该用某个行为型模式，先问三个问题：

```text
① 一个变化点要不要通知到多处？ → 观察者
② 同一件事有多套可互换的算法？ → 策略
③ 一套固定流程里只有某几步会变？ → 模板方法
```

本章的三个模式共享一条主线：**把「变化的部分」从「稳定的部分」里抽出来**，只是抽的粒度不同——观察者抽的是「通知谁」，策略抽的是「用哪种算法」，模板方法抽的是「流程骨架里的可替换步骤」。

## 5.2 观察者模式：一对多通知

场景：订单状态变化后，要同时更新库存、发通知、记审计。直接在订单里调用这三个下游，订单就耦合了所有人。观察者把方向反过来——下游自己来订阅。

```python
class EventBus:
    def __init__(self):
        self._subs = {}                      # 事件名 -> 处理函数列表

    def subscribe(self, event, handler):
        self._subs.setdefault(event, []).append(handler)

    def publish(self, event, payload):
        for handler in list(self._subs.get(event, [])):
            handler(payload)                 # 逐个通知

bus = EventBus()
bus.subscribe("order.paid", lambda o: print("扣库存", o.id))
bus.subscribe("order.paid", lambda o: print("发短信", o.id))
bus.publish("order.paid", order)             # 订单只管 publish，不认识下游
```

:::caution[通知顺序不保证]
字典里各事件的处理函数按订阅先后排列，**但不同事件之间没有全局顺序**。别依赖「先发通知再扣库存」这类跨事件时序——需要严格顺序就显式建优先级，或把关键副作用收进一个处理函数里串行执行。
:::

## 5.3 事件总线的解耦与内存泄漏

观察者最大的坑是**订阅者生命周期**。在 Python 里，`subscribe` 会把处理函数存进总线的列表，这是一条**强引用**：如果处理函数是某个对象的绑定方法，那么只要总线活着，那个对象就永远不会被回收——这就是常见的「忘记退订导致内存泄漏」。

错误写法 → 正确写法：

```python
# 错误：绑定方法被总线强引用，页面/会话对象无法回收
class Panel:
    def on_order(self, payload): ...
    def mount(self, bus):
        bus.subscribe("order.paid", self.on_order)   # 泄漏点

# 正确之一：配对退订
    def unmount(self, bus):
        bus.subscribe  # 记着句柄
        bus.unsubscribe("order.paid", self.on_order)

# 正确之二：弱引用总线，订阅者消失即自动清理
import weakref
class WeakBus:
    def __init__(self): self._subs = {}
    def subscribe(self, event, obj, name):
        ref = weakref.WeakMethod(getattr(obj, name))
        self._subs.setdefault(event, []).append(ref)
    def publish(self, event, payload):
        alive = []
        for ref in self._subs.get(event, []):
            m = ref()                        # 取回方法，对象已死则为 None
            if m is not None:
                m(payload); alive.append(ref)
        self._subs[event] = alive            # 顺手清理死订阅
```

退订要么成对出现（mount/unmount），要么干脆用弱引用把清理交给 GC。**能用退订就用退订，长生命周期总线才上弱引用**。

## 5.4 策略模式：替换 if-else 的边界

当同一件事有多套可互换算法，用策略把「选哪种」与「怎么做」分开：

```python
class DiscountStrategy:
    def apply(self, amount): raise NotImplementedError

class NoDiscount(DiscountStrategy):
    def apply(self, amount): return amount

class PercentageOff(DiscountStrategy):
    def __init__(self, rate): self.rate = rate
    def apply(self, amount): return amount * (1 - self.rate)

class Cart:
    def __init__(self, strategy): self.strategy = strategy
    def total(self, amount): return self.strategy.apply(amount)
```

**什么时候别用策略**——划清边界，避免过度设计：

```text
分支 ≤ 2 且不太会变          → 直接 if-else，别建类
各算法签名不一致、无法统一    → 策略抽象漏了，先修接口
只是「传进去一个函数就够」    → 见 5.6，函数式退化
算法要频繁在运行时替换、单测  → 策略的甜区
```

策略的价值在于**可替换 + 可单测**：`Cart` 不关心折扣怎么算，测试时塞一个假策略即可。

## 5.5 策略与工厂配合

「运行时根据入参选策略」如果散落各处写 if，就又把复杂度漏回调用方。让工厂集中负责选择：

```python
class DiscountFactory:
    _table = {"none": NoDiscount, "pct": PercentageOff}
    @classmethod
    def create(cls, kind, **kw):
        return cls._table[kind](./**kw/)

cart = Cart(DiscountFactory.create("pct", rate=0.1))
```

分工很清楚：**工厂管「造哪个」，策略管「怎么做」，上下文（Cart）只管「用」**。对照[第 8 章 · 综合实战](./08-refactor-project/)里订单计价的改造，就是这条链落地。新增一种折扣：加一个策略类 + 表里登记一行，上下文零改动。

## 5.6 模板方法与反向控制

模板方法把「不变的流程骨架」钉在基类，把「会变的步骤」留成抽象钩子，由子类填空：

```python
class ImportJob:
    def run(self):                          # 骨架：算法框架，子类别改
        data = self.fetch()
        data = self.clean(data)
        if self.validate(data):             # 钩子：可选步骤，默认放行
            self.save(data)
        self.notify(data)

    def fetch(self): raise NotImplementedError
    def clean(self, data): return data
    def validate(self, data): return True   # 默认钩子
    def save(self, data): raise NotImplementedError
    def notify(self, data): print("done")
```

关键概念是**反向控制（控制反转）**：不是你的代码调用框架，而是框架（骨架 `run`）在合适的时刻回调你填的钩子。「框架调用你」正是所有模板方法与中间件的共同气质。钩子有三档：抽象（子类必须实现）、默认实现（可覆盖）、可选（返回布尔控制流程）。

:::tip[函数式语言里它们常常退化成「传函数」]
Python 有第一等函数，策略 = 直接传一个 callable，模板方法 = 传若干回调：
:::

```python
def process(items, key=lambda x: x, should=lambda x: True, on_each=print):
    for it in items:
        if should(it):
            on_each(key(it))                # 策略与钩子都变成参数函数
```

当「一套算法」只有一个方法、且没有共享状态时，传函数比建类更轻。**当步骤之间需要共享状态、需要多方法协作、或需要在多处复用同一组步骤时，类形式（策略/模板）才重新划算**——这就是从「传函数」升回「建对象」的临界线。

## 5.7 综合练习：通知中心的策略化改造

把 5.2 的总线和 5.4 的策略合起来：给通知做「按用户偏好选渠道」的场景。

```python
class ChannelStrategy:
    def send(self, user, msg): raise NotImplementedError

class Email(ChannelStrategy):
    def send(self, user, msg): print(f"email->{user}", msg)

class Sms(ChannelStrategy):
    def send(self, user, msg): print(f"sms->{user}", msg)

class Notifier:
    def __init__(self, bus, chooser):
        self.chooser = chooser              # 策略：决定用哪个渠道
        bus.subscribe("order.paid", self.on_paid)  # 观察者：订阅事件

    def on_paid(self, order):
        for user in order.watchers:
            self.chooser(user).send(user, f"order {order.id} paid")

def chooser(user):                          # 纯函数当策略
    return Sms() if user.region == "MO" else Email()
```

自查三点：`Notifier` 不认识订单业务（只订阅事件）；新增渠道不改 `on_paid`；`chooser` 换成查库版本时，其余代码不动。若你能同时改这三处而测试仍绿，说明解耦到位。

## 本章小结

- 观察者用「订阅/发布」把发生方与关心方解耦，但必须管退订或用弱引用，否则强引用导致内存泄漏，且跨事件通知顺序不保证
- 策略把可互换算法收进对象，甜区是「运行时可替换 + 易单测」；分支少且稳定时别建类
- 工厂集中「选哪个策略」，上下文只负责「用」，三者各司其职
- 模板方法钉死流程骨架、留钩子给子类，本质是反向控制；有第一等函数时，无共享状态的策略与钩子常退化为直接传函数
