---
title: 面向对象：类与继承
---

# 第 5 章 · 面向对象：类与继承

**本章目标：**

- 掌握类定义、实例属性与方法
- 理解类属性与实例属性的区别
- 掌握继承、super 与 @property 封装

## 5.1 类的基本结构

```python
class Course:
    """一门课程的描述（docstring）"""

    def __init__(self, title: str, hours: int):
        """构造器：创建实例时自动调用"""
        self.title = title          # 实例属性
        self.hours = hours

    def show_info(self) -> None:
        """实例方法：第一个参数永远是 self（当前实例）"""
        print(f"{self.title}（{self.hours} 小时）")

course = Course("Python 教程", 10)   # 调用 __init__（不需要 new）
course.show_info()                   # Python 教程（10 小时）
course.hours                         # 10 —— 属性直接访问
```

`self` 显式写在参数第一位，是 Python 与 Java（隐式 this）最直观的差异——本质相同。

## 5.2 类属性 vs 实例属性

```python
class Counter:
    total_created = 0            # 类属性：全体实例共享（相当于 Java static）

    def __init__(self):
        Counter.total_created += 1
        self.serial = Counter.total_created   # 实例属性：每个对象一份

a, b = Counter(), Counter()
a.total_created        # 2
a.serial               # 1
b.serial               # 2
```

::: warning 通过实例改类属性会"新建实例属性"
```python
a.total_created = 99   # 这是在 a 身上新建了一个实例属性，不是改类属性！
Counter.total_created  # 仍然是 2
```
改类属性一律通过**类名**。
:::

## 5.3 私有约定与 @property

Python 没有真正的 private——**约定**：单下划线 `_name` 表"内部使用"，双下划线 `__name` 触发名称改写（name mangling）：

```python
class Account:
    def __init__(self, balance: float):
        self.__balance = balance        # 双下划线：外部不能直接 account.__balance 访问

    @property
    def balance(self) -> float:         # 像属性一样读
        return self.__balance

    @balance.setter
    def balance(self, value: float) -> None:
        if value < 0:
            raise ValueError("余额不能为负")
        self.__balance = value

acc = Account(100)
acc.balance          # 100（不用加括号！）
acc.balance = 500    # 走 setter 校验
acc.balance = -1     # ValueError
```

`@property` = Java getter/setter 的 Python 解法——**对外像属性、内部可加逻辑**，调用方无感升级。

## 5.4 继承与 super

```python
class Animal:
    def __init__(self, name: str):
        self.name = name

    def eat(self) -> None:
        print(f"{self.name} 在吃东西")

    def introduce(self) -> None:
        print(f"我是 {self.name}")


class Dog(Animal):                       # 括号里写父类（单继承）
    def __init__(self, name: str, breed: str):
        super().__init__(name)           # 调父类构造器
        self.breed = breed

    def fetch(self) -> None:             # 子类扩展
        print(f"{self.name} 衔回飞盘")

    def eat(self) -> None:               # 重写（override）
        super().eat()                    # 复用父类逻辑
        print("（吃的很快）")


dog = Dog("旺财", "柴犬")
dog.eat()          # 旺财 在吃东西 →（吃的很快）
isinstance(dog, Animal)   # True
```

## 5.5 多重继承与 MRO

Python 支持多继承（Java 不支持），查找顺序由 **MRO**（Method Resolution Order，方法解析顺序）决定：

```python
class Swimmer:
    def move(self): print("游泳")

class Flyer:
    def move(self): print("飞行")

class Duck(Swimmer, Flyer):      # 多继承
    pass

Duck().move()            # 游泳 —— 按 MRO 先查 Swimmer
Duck.__mro__             # 查看完整顺序
```

多继承强大但易乱——优先用**组合**或**接口式单继承**，`Mixin`（混入）是社区惯用的多继承模式（小功能类，如 `JSONSerializableMixin`）。

## 5.6 类方法与静态方法

```python
class Date:
    def __init__(self, y: int, m: int, d: int):
        self.y, self.m, self.d = y, m, d

    @classmethod
    def today(cls) -> "Date":            # cls = 类本身（工厂方法惯用）
        import datetime
        t = datetime.date.today()
        return cls(t.year, t.month, t.day)

    @staticmethod
    def is_leap(year: int) -> bool:      # 无 self/cls：纯工具函数
        return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)

Date.today()             # 类方法造实例
Date.is_leap(2024)       # True
```

| | 实例方法 | @classmethod | @staticmethod |
| --- | --- | --- | --- |
| 首参 | self（实例） | cls（类） | 无 |
| 用途 | 操作实例状态 | 备选构造器 | 纯工具逻辑 |

## 5.7 dataclass：数据类的标准答案

样板代码终结者（Python 3.7+，对标 Java 的 record）：

```python
from dataclasses import dataclass, field

@dataclass
class Task:
    id: int
    text: str
    done: bool = False
    tags: list[str] = field(default_factory=list)   # 可变默认值的标准解法

    def toggle(self) -> None:
        self.done = not self.done

t = Task(1, "学 Python")
print(t)            # Task(id=1, text='学 Python', done=False, tags=[]) —— 自动 __repr__
t == Task(1, "学 Python")   # True —— 自动 __eq__
t.toggle()
```

**不可变数据**用 `@dataclass(frozen=True)`（赋值报错）。数据建模默认 dataclass，需要大量自定义行为时才手写类。

## 5.8 综合练习：银行账户体系

```python
@dataclass
class Account:
    owner: str
    __balance: float = 0.0

    def deposit(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("存款必须为正")
        self.__balance += amount

    def withdraw(self, amount: float) -> None:
        if amount > self.__balance:
            raise ValueError("余额不足")
        self.__balance -= amount

    @property
    def balance(self) -> float:
        return self.__balance

class SavingsAccount(Account):
    def __init__(self, owner: str, rate: float = 0.03):
        super().__init__(owner)
        self.rate = rate

    def add_interest(self) -> float:
        interest = self.balance * self.rate
        self.deposit(interest)
        return interest

acc = SavingsAccount("Tom")
acc.deposit(1000)
print(f"{acc.add_interest():.2f}")   # 30.00
```

## 本章小结

- `__init__` 构造器 + 显式 self；类属性走类名改
- `_name` 私有约定、`@property` 对外属性对内逻辑
- 继承 + super；MRO 管多继承；Mixin 是安全的多继承用法
- 数据建模默认 **dataclass**（对标 Java record）
