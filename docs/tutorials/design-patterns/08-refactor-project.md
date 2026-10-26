---
title: 综合实战：重构面条代码
---

# 第 8 章 · 综合实战：重构一段面条代码

**本章目标：**

- 从一段过程式订单模块里定位耦合点（变化点、副作用、校验、构造）
- 依次用策略、工厂、观察者、责任链改造，且每一步测试保持通过
- 沉淀一张「什么信号触发用哪个模式」的决策表

## 8.1 面条代码：过程式订单模块

下面是一个能跑但难改的订单模块：计价、校验、副作用、构造全糊在一个函数里。

```python
# orders.py（重构前）
import json, smtplib

def create_order(raw):
    # —— 解析 + 校验混在一起 ——
    items = raw["items"]
    if not items:
        raise ValueError("空订单")
    for it in items:
        if it["qty"] <= 0:
            raise ValueError("数量非法")
    user = load_user(raw["user_id"])
    if raw.get("coupon") and not valid_coupon(raw["coupon"], user):
        raise ValueError("券无效")
    if total_of(items) > user.credit:
        raise ValueError("额度不足")

    # —— 计价：一大坨 if-elif 按用户类型/渠道分叉 ——
    subtotal = total_of(items)
    if user.kind == "vip":
        total = subtotal * 0.8
    elif user.kind == "wholesale":
        total = subtotal * 0.7
    elif raw.get("channel") == "app":
        total = subtotal * 0.95
    else:
        total = subtotal
    if raw.get("coupon") == "FREESHIP":
        total -= 10

    # —— 落库 ——
    order = {"id": next_id(), "user": user.id, "total": total,
             "status": "pending", "items": items}
    db_save(order)

    # —— 副作用：直接在流程里发邮件、推库存、记审计 ——
    send_email(user.email, f"订单 {order['id']} 已创建")
    reserve_stock(items)
    audit_log(order)
    return order
```

功能没错，但任何一处规则变化都要回来动这个函数，而且没有测试敢跑——因为它一调就发邮件、写库。

## 8.2 找出耦合点

把变化原因分类，四类正对应四个模式：

```text
计价规则常变（VIP/批发/渠道/券）   → 策略（第 5 章）
「造一个订单」的装配散落各处        → 工厂（第 2/5 章）
副作用（邮件/库存/审计）绑死主流程  → 观察者（第 5 章）
校验步骤堆叠、顺序敏感、难短路      → 责任链（第 6 章）
```

重构纪律：**一次只搬一类，搬完立刻补/跑测试**。测试是安全网——只要「输入 raw，断言 total 与 status」这类核心断言不变，内部怎么挪都算等价。反过来，若某个改动逼着你去修正一个黄金用例的期望值，那多半不是等价重构，而是偷偷改了行为——先停下确认。

```python
# 先钉住行为契约（重构前就能跑通的黄金用例）
def test_golden_cases():
    assert create_order(vip_raw()).total == 80.0          # 100*0.8
    assert create_order(app_raw()).total == 95.0          # 100*0.95
    assert create_order(freeship_raw()).total == 70.0     # 80-10
```

## 8.3 用策略改造计价

把那一串 if-elif 抽成策略对象，主流程只认「算一下」：

```python
class PricingStrategy:
    def price(self, subtotal, user, raw): raise NotImplementedError

class VipPricing(PricingStrategy):
    def price(self, s, u, raw): return s * 0.8
class WholesalePricing(PricingStrategy):
    def price(self, s, u, raw): return s * 0.7
class AppChannelPricing(PricingStrategy):
    def price(self, s, u, raw): return s * 0.95
class FlatPricing(PricingStrategy):
    def price(self, s, u, raw): return s

def pick_pricing(user, raw):                 # 选择逻辑独立成函数
    if user.kind == "vip": return VipPricing()
    if user.kind == "wholesale": return WholesalePricing()
    if raw.get("channel") == "app": return AppChannelPricing()
    return FlatPricing()
```

主流程里 8 行 if-elif 变成 `total = pick_pricing(user, raw).price(subtotal, user, raw)`。**行为等价**：黄金用例仍 80/95。新增折扣只需加一个策略类 + `pick_pricing` 一行，不动主流程。FREESHIP 券的「减 10」也归入策略层（或后续做成可叠加的装饰），不再散在 if 里。

## 8.4 用工厂创建订单

「装配一个 order 字典」的活儿被 `create_order` 和测试同时需要，抽成工厂：

```python
class OrderFactory:
    @staticmethod
    def make(user, items, total):
        return {"id": next_id(), "user": user.id,
                "status": "pending", "total": total, "items": items}
```

`create_order` 现在只调 `OrderFactory.make(...)`，测试造 fixture 也用它——**构造口径唯一**。状态默认 `pending` 集中一处，将来改初始状态或加字段，只碰工厂。这正是[第 5 章 · 行为型模式（上）](./05-behavioral-a)「工厂管造哪个、上下文只管用」的落地。

```text
改造前：dict 字面量散在 create_order 与每个测试里，加字段要全改
改造后：装配收进 OrderFactory.make，字段/默认状态只此一处定义
```

## 8.5 用观察者解耦副作用

发邮件、推库存、记审计是「订单创建了，谁关心谁响应」——典型的观察者场景（[第 5 章 · 行为型模式（上）](./05-behavioral-a)）。把它们从主流程摘出去：

```python
# 重构前（副作用焊死在主流程）
send_email(user.email, ...); reserve_stock(items); audit_log(order)

# 重构后（主流程只 publish）
bus.subscribe("order.created", send_email_handler)
bus.subscribe("order.created", reserve_stock_handler)
bus.subscribe("order.created", audit_handler)

def create_order(raw):
    ...
    order = OrderFactory.make(user, items, total)
    db_save(order)
    bus.publish("order.created", order)      # 不认识任何下游
    return order
```

收益：**测试 `create_order` 时不订阅任何东西，就不会真发邮件**——副作用可插拔。想加「推送 App 通知」只加一个订阅者，`create_order` 零改动。

::: warning 别忘了退订
若下游是对象绑定方法且总线是进程级长生命周期，按[第 5 章 · 行为型模式（上）](./05-behavioral-a)用 `unsubscribe` 配对或弱引用总线，否则每建一个处理器就泄漏一个。
:::

## 8.6 用责任链做校验

把 8.1 顶部堆叠的校验拆成一条条可短路的责任（[第 6 章 · 行为型模式（下）](./06-behavioral-b)的平链）：

```python
def check_not_empty(ctx):        return bool(ctx["items"])
def check_qty(ctx):
    return all(it["qty"] > 0 for it in ctx["items"])
def check_coupon(ctx):
    return (not ctx.get("coupon")) or valid_coupon(ctx["coupon"], ctx["user"])
def check_credit(ctx):
    return total_of(ctx["items"]) <= ctx["user"].credit

validators = Chain([check_not_empty, check_qty, check_coupon, check_credit])

def create_order(raw):
    ctx = preprocess(raw)                      # 载入 user/items
    result = validators.run(ctx)               # 任一不过即短路并带原因
    if not result.ok:
        raise ValidationError(result.reason)
    total = pick_pricing(ctx.user, raw).price(total_of(ctx["items"]), ctx.user, raw)
    order = OrderFactory.make(ctx.user, ctx["items"], total)
    db_save(order); bus.publish("order.created", order)
    return order
```

主函数从 40 多行缩到十几行，只剩「装配→校验→计价→构造→落库→通知」的清晰骨架。**每条校验单独可测**（`check_qty({"items":[...]})` 返回 False 即可），顺序调整就是列表里换个位置。

## 8.7 综合练习：模式选择决策表

重构后回看每一步，提炼「出现什么信号 → 上什么模式」：

```text
信号（在代码里看到的样子）              模式            搬走后得到的好处
一处逻辑按类型 if-elif 分叉多套算法    策略            新增类型只加类，主流程不动
构造对象的代码散落多处、口径不一        工厂            装配口径唯一，改字段一处生效
一个动作完成后要通知多个互不相干的下游  观察者          主流程不认识下游，副作用可插拔
一串前置检查层层嵌套、任一失败要中断    责任链          每步独立可测，顺序即列表顺序
行为随对象状态改变、散落各处的 state==  状态            非法迁移由类型结构兜底（第 6 章）
需要撤销/队列/重放一次操作             命令            操作成为对象（第 6 章）
```

动手验证：给订单加「学生价 85 折」——只需 (a) 新增 `StudentPricing` 策略、(b) `pick_pricing` 加一个分支，主流程、落库、副作用**一行不改**，黄金用例仍绿。若你发现自己为了加个折扣要同时改 `create_order` 中间那段 if，说明策略还没抽干净。这条「加需求时改动是否只落在一个扩展点」就是模式是否用对的试金石。

## 本章小结

- 重构按「变化原因」分类下刀：计价→策略、构造→工厂、副作用→观察者、校验→责任链，各归其位
- 每步先钉住黄金用例再搬代码，测试通过即行为等价；副作用移出主流程让函数可脱离邮件/DB 单测
- 责任链让校验短路且每步独立可测，工厂让构造口径唯一，主函数收敛成清晰骨架
- 决策表的核心试金石：加同类新需求时，改动是否只落在一个扩展点——是则抽象到位，否则模式没用对
