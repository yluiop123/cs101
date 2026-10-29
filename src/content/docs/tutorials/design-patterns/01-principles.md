---
title: "第 1 章 · 面向对象原则与模式的语言"
description: "初学者对设计模式的常见误解：把 GoF 的 23 个模式当成要背诵的类图清单，写代码时恨不得全用上一遍。实际上模式的本质是给反复出现的\"问题—解法\"配对起一个名字：没有名字你要解释\"包一层、保持同样接口、运行时换行为\"，有名字只需说\"这…"
series: design-patterns
sidebar:
  order: 1
  label: "面向对象原则与模式的语言"
difficulty: advanced
duration: 7
tableOfContents: true
---

**本章目标：**

- 说清 SOLID 五条原则各自治什么病，并能在 Python 代码里指出违反点
- 判断何时用组合替代继承、何时干脆不要用任何模式
- 掌握读懂模式类图所需的最小 UML 记号集

## 1.1 模式不是背 23 个类图

初学者对设计模式的常见误解：把 GoF 的 23 个模式当成要背诵的类图清单，写代码时恨不得全用上一遍。实际上模式的本质是**给反复出现的"问题—解法"配对起一个名字**：没有名字你要解释"包一层、保持同样接口、运行时换行为"，有名字只需说"这里加个装饰器"。

名字带来的是沟通效率与学习索引，不是必须完成的任务清单。23 个模式是**目录**而不是**目标**——绝大多数工程师职业生涯里真正主动引入的模式不超过十种。

上手一个模式前先问三个问题：

1. 这里**在变什么**？（变化点在哪）
2. 这个模式解决的**是不是**这个变化？
3. 引入这层抽象的**代价**（多一个类型、多一层间接）值得吗？

模式描述几乎都用 UML 类图，先记住能读懂它们的最小记号集——类图的全部秘密就在连线：

| 记号 | 含义 | 读法 |
| --- | --- | --- |
| 实线 + 空心三角 | 继承 | A 是 B 的一种 |
| 虚线 + 空心三角 | 实现接口 | A 承诺具备 B 的能力 |
| 实线箭头 | 关联 | A 持有 B 的字段 |
| 空心菱形 | 聚合 | A 持有 B，B 可脱离 A 存活 |
| 实心菱形 | 组合 | A 的生命周期决定 B 的 |
| 虚线箭头 | 依赖 | A 只在参数/局部临时用 B |

多重度 `1`、`0..*`、`1..*` 标在线段旁边；类框内 `+` 公有、`-` 私有、`#` 受保护。就这些——本书所有模式的示意图只用这套记号。

## 1.2 SRP 与 OCP：两味针对「变化」的药

**单一职责原则（SRP）**：一个类应该只有一个引起它变化的原因。注意是"变化原因"不是"功能数量"。

```python
# 错误写法：三个变化原因挤进一个类——
# 报表格式要改、表名要改、通知渠道要改，全都要动它
class InvoiceReport:
    def calc_total(self, invoice): ...
    def save_to_db(self, invoice): ...
    def render_pdf(self, invoice): ...
```

```python
# 正确写法：按变化原因拆分，每个类可独立测试、独立修改
class Invoice:            # 领域规则：金额怎么算
    def total(self): ...

class InvoiceRepository:  # 存储：数据放哪
    def save(self, invoice): ...

class PdfRenderer:        # 呈现：纸面上长什么样
    def render(self, invoice): ...
```

拆分收益：三处变更常来自三个需求、三个时间点，合并一类则每次改动都碰同一份文件，回归风险与合并冲突被人为放大。

**开闭原则（OCP）**：对扩展开放、对修改关闭——加行为靠**新增代码**，而不是改已有分支。

```python
# 错误写法：每加一种折扣，都要回头改这个函数
def discount(order, kind):
    if kind == "fixed": ...
    elif kind == "pct": ...
    elif kind == "bundle": ...   # 第 N 种需求 = 第 N 次修改
```

```python
# 正确写法：分支收进注册表，新增折扣 = 新增一个类，不碰老代码
DISCOUNTS = {}

def register(name):
    def deco(cls):
        DISCOUNTS[name] = cls
        return cls
    return deco

@register("fixed")
class FixedDiscount:
    def apply(self, order, arg): ...
```

:::caution[OCP 不免费]
每个扩展点都是一层间接。只有两种分支时就抽注册表，属于为想象中的变化买单——等第三次真实变化出现再动手，与 1.6 节主题呼应。
:::

## 1.3 LSP 与 ISP：可替换性与接口肥大

**里氏替换原则（LSP）**：任何用基类的地方，替换成子类型后调用方的契约不能被打破。可替换性看**行为**，不是看字段。经典反例是"正方形继承矩形"：

```python
class Rectangle:
    def __init__(self, w, h): self._w, self._h = w, h
    def area(self): return self._w * self._h
    def set_width(self, w): self._w = w
    def set_height(self, h): self._h = h

class Square(Rectangle):      # 几何上正方形"是"矩形，
    def set_width(self, w):   # 但行为契约上不是——
        self._w = self._h = w # 这里就是 LSP 违反点
    def set_height(self, h):
        self._w = self._h = h
```

调用方先 `set_width(3)` 再 `set_height(4)`，断言面积是 12：传 Rectangle 通过，传 Square 失败。子类改了副作用，调用方却毫不知情——继承树里最阴险的一类 bug。

**接口隔离原则（ISP）**：不要让调用方依赖它用不到的方法。接口长到"每个调用方只用其中两三成"就该按**角色**切小。

```python
# 错误写法：后台 worker 被迫"继承"下载能力，只因接口是一个大杂烩
class MachineBase:
    def work(self): ...
    def download(self, url): ...
    def browse(self, url): ...

# 正确写法：能力分开声明，调用方按角色依赖（Python 里就是小 Protocol）
from typing import Protocol

class Workable(Protocol):
    def work(self): ...
```

:::tip[Python 的 ISP 更便宜]
没有正式 `implements`，一个类可以同时实现多个小 Protocol，天然就是"按需承诺能力"。但小接口的好处（改一个不影响另一个）依然存在，设计时仍要按角色切。
:::

## 1.4 DIP：依赖的方向与抽象

**依赖倒置原则（DIP）**：高层模块不依赖低层模块，两者都依赖抽象；抽象不依赖细节，细节依赖抽象。落到代码上就是一句话——**别让业务策略 import 具体的脏活实现**。

```python
# 错误写法：依赖箭头从高层策略指向低层细节
from smtp_client import SmtpClient

class OrderService:
    def __init__(self):
        self.notifier = SmtpClient("mail.corp.com")  # 写死细节
```

```python
# 正确写法：OrderService 只依赖"会发消息"这个行为，
# 谁实现、怎么连接，由调用它的装配层决定
class OrderService:
    def __init__(self, notifier):
        self.notifier = notifier
```

两个最容易被误解的点：

1. **"倒置"指的是依赖方向反转**：抽象（接口/协议）应定义在高层业务附近，低层实现反过来依赖它，而不是高层去 import 低层。
2. Python 里"抽象"可以轻到只是一份函数签名——传一个接收 `notify(msg: str) -> None` 可调用对象即可，不必真有一个基类。

```java
// Java 里的 DIP 通常长成"构造函数注入接口"的样子
class OrderService {
    private final Notifier notifier;
    OrderService(Notifier notifier) { this.notifier = notifier; }
}
```

DIP 的工程化身就是依赖注入，在 [第 4 章 · 结构型模式（下）](../04-structural-b/) 展开讲容器与手工装配的取舍。

## 1.5 组合优于继承

继承写死了"是一种"，同时继承了父类实现里的毛病；多维变化用继承表达会出现矩阵爆炸。看通知器的两个变化维度：内容（纯文本/HTML）× 渠道（邮件/短信/Webhook）。

```text
继承写法：3 种内容 × 3 种渠道 = 9 个类，
         新增一种渠道要复制一整个内容的行数
组合写法：3 个内容组件 + 3 个渠道组件 = 6 个类，
         任意拼装，新增维度只加一列
```

```python
class Notifier:                     # 骨架用组合搭
    def __init__(self, content, channel):
        self.content = content      # "说什么"可替换
        self.channel = channel      # "走哪条路"可替换

    def send(self, invoice):
        self.channel.deliver(self.content.render(invoice))

n = Notifier(HtmlContent(), SmsChannel())   # 运行时随便换
```

判断口径：**这个行为将来需要在运行时换吗？** 需要 → 组合；只是编译期的类型分类体系 → 才考虑继承。继承前必答两问：子类型能否通过 LSP 检验？你想复用的是实现还是类型声明——若只是后者，实现接口 + 组合委派即可。

## 1.6 什么时候不该用模式

模式用错比不用更伤。三个典型的"不该用"信号：

- **为想象中的变化服务**："以后可能要扩展"不是引入抽象的理由；等第三次真实变化出现再抽象（对照 1.2 节的 warning）。
- **语言原生已有替身**：Python 的一等函数顶掉策略/命令模式的大半场景，生成器顶掉迭代器，`@property` 顶掉访问器，上下文管理器顶掉一部分中介者的资源协议职责。
- **团队驾驭不了代价**：用不明白的单例和外观会让依赖隐形、调试无门，比摊开的直白代码更难维护。

```python
# "不用模式"在 Python 里常常就是一行：
# GoF 策略模式要 4 个类起步，这里传函数就完事
def apply_discount(order, discount_fn):
    return discount_fn(order)
```

正确的问题不是"我该用哪个模式"，而是"这里在变什么、哪条原则被违反了、最便宜的修法是什么"。模式答案是其中最贵但最成套的那一档。

## 1.7 综合练习：给一段代码找违反点

通读下面的类，按问题清单逐条作答（答案要点附后，先写再看）：

```python
class UserManager:
    def __init__(self):
        self.db = MySQLClient(host="127.0.0.1")

    def create_user(self, name, mail):
        pwd = self.hash(name)
        self.db.insert("users", name, pwd)
        if mail:
            self.send_welcome_mail(mail)

    def hash(self, s):
        import hashlib
        return hashlib.md5(s.encode()).hexdigest()

    def send_welcome_mail(self, mail):
        import smtplib
        smtp = smtplib.SMTP("localhost")
        smtp.sendmail("sys@corp.com", mail, "Welcome!")
```

问题清单：

1. `UserManager` 有几个引起它变化的原因？（提示：存储、哈希算法、邮件、业务流程）
2. 想在**没有邮件服务器**的环境测试 `create_user`，挡路的是什么？
3. 要把 MD5 换成更强的哈希，要动几个地方？会不会牵连不相干的调用方？
4. 将来还要支持 LDAP 用户和访客用户，这个类会长成什么样？

答案要点：

- **SRP**：至少四个变化原因挤在一类，应拆成 `UserRepository`、`PasswordHasher`、`MailSender` 三个角色。
- **DIP**：`MySQLClient` 和 `smtplib` 都是写死的低层细节；改由构造函数注入，测试传假货即可。
- **OCP**：新增用户类型 = 修改 `create_user` 的分支，应改为按类型注册。
- 修法的核心不是喊出某个 GoF 名字，而是**切断不该存在的依赖、隔离变化点**——模式是这些修法的成套命名。

第 2 章的单例陷阱与第 4 章的依赖注入会直接复用这里的四条判断，建议把答案写进笔记再往下走。

## 本章小结

- 模式是给"问题—解法"配对起名，23 个是目录不是背诵清单；上模式前先问变化点、对症与否、代价值不值
- SOLID 各治一病：变化原因混杂（SRP）、加需求改分支（OCP）、子类型破坏契约（LSP）、接口肥大（ISP）、高层绑死细节（DIP）
- 组合优于继承：多维变化用组合拼装替代继承矩阵，继承只留给严格"is-a"
- 不用模式也是决定：语言原生能力常已顶掉大半场景，第三次真实变化出现再抽象
