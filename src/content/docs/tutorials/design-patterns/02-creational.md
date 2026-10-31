---
title: "创建型模式"
description: "new 看起来无害，但它把三个决定塞进了调用现场：创建什么、何时创建、怎么组装。每写一处 SomeConcreteClass()，就多一处对该具体类的依赖。创建型模式的共同动作只有一个：把创建决定从业务代码搬到可控的地方。五个模式分工："
series: design-patterns
sidebar:
  order: 2
  label: "创建型模式"
difficulty: advanced
duration: 8
tableOfContents: true
---

**本章目标：**

- 掌握单例的三种写法与线程安全陷阱，说清全局状态为什么伤测试
- 区分工厂方法、抽象工厂、建造者各解决哪种耦合，并能为场景选型
- 解释原型的深浅拷贝语义与 `deepcopy` 的三个坑

## 创建型只解决一类问题

`new` 看起来无害，但它把三个决定塞进了调用现场：**创建什么、何时创建、怎么组装**。每写一处 `SomeConcreteClass()`，就多一处对该具体类的依赖。创建型模式的共同动作只有一个：**把创建决定从业务代码搬到可控的地方**。五个模式分工：

| 模式 | 一句话的病 |
| --- | --- |
| 单例 | "全局那一个"实例入口太多，状态不一致 |
| 工厂方法 | 调用方写死具体类，加一种类型要改调用方 |
| 抽象工厂 | 产品必须配套出现，容易串牌 |
| 建造者 | 构造参数爆炸，位置容易错位 |
| 原型 | 每次从头造对象太贵 |

本章每个模式都按三段式过一遍：**不用它会长什么样 → 用了之后 → 代价是什么**。

## 单例：全局一个实例，与它的三种写法

**不用它**：配置管理器在三处各自 new 一份，改了一处另两处不知道——同一个"全局配置"其实有三份。
**用了之后**：类自身保证全局至多一个实例，访问入口唯一。
**代价**：依赖隐形（任何函数都能悄悄摸它）、单元测试互相干扰、多线程还得处理竞态。

三种写法按"仪式感"递增。写法一，模块级实例——Python 的默认答案：

```python
# db.py —— 模块只执行一次，这本身就是天然单例
class Database:
    def __init__(self):
        self._conn = None

db = Database()          # 使用方一律 from db import db
```

写法二，`__new__` 拦截——GoF 原书形状在 Python 里的对应物：

```python
class Database:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)   # 只负责"造"
        return cls._instance
```

:::caution[__init__ 陷阱]
`__new__` 只管创建，但每次 `Database()` 仍会重跑 `__init__`。初始化逻辑（读文件、开连接）写在 `__init__` 里会被反复执行——要么加 `if getattr(self, "_inited", False): return` 守卫，要么把初始化挪进惰性方法。
:::

写法三，线程安全的双检锁——延迟初始化 + 多线程时的正确姿势：

```python
import threading

class Database:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:            # 外检：无锁快路径
            with cls._lock:
                if cls._instance is None:    # 内检：防两线程同时通过
                    cls._instance = super().__new__(cls)
        return cls._instance
```

错误写法 → 正确写法就在这里：不加锁的 `if 空: 创建` 在多线程下会竞态出两个实例；给整个方法加锁又让每次调用都排队。双检锁两头兼顾——外检挡住绝大多数命中路径，内检守住创建瞬间。

Java 另有常见做法：借 JVM 的类加载保证线程安全且惰性初始化（holder 惯用法）：

```java
public class Config {
    private Config() {}
    private static class Holder {           // 首次 get() 才触发加载
        static final Config I = new Config();
    }
    public static Config get() { return Holder.I; }
}
```

:::danger[单例最大的代价是测试]
一旦测试需要"各自独立的实例"（内存数据库）或并行跑用例，全局单例就是障碍。常见妥协：单例只放在进程边界（配置、连接池），业务类仍以构造函数参数接收它——测试传假货，生产传单例。
:::

## 工厂方法：把「哪个具体类」外包出去

**不用它**：调用处写死 `JsonParser()`；要支持 CSV 就加 if 分支，每个调用方跟着改。
**用了之后**：创建推迟到工厂（函数或子类），调用方只依赖产品的抽象接口。
**代价**：新增产品类型仍要碰工厂那一处注册；产品只有一种时，这层间接纯亏。

错误写法 → 正确写法：

```python
# 错误：具体类泄漏到调用现场，
# 新增一种格式 = 所有调用点都改
doc = JsonParser().parse(raw)

# 正确：工厂函数 + 注册表，新增格式 = 注册新类，
# 调用点终生只有这一行
PARSERS = {"json": JsonParser, "csv": CsvParser}

def parse_doc(raw, kind):
    return PARSERS[kind]().parse(raw)
```

GoF 的工厂方法是这个思路的**类版本**：父类把"造产品"声明为抽象方法，由子类决定具体类型，父类的模板流程只跟"未知产品"打交道。框架预留扩展点时最常用：

```java
abstract class Dialog {
    abstract Button createButton();        // 子类决定具体按钮
    void render() {
        Button b = createButton();         // 流程固定，创建点多态
        b.onClick();
    }
}
```

:::tip[Python 的捷径]
一等函数就是工厂：把构造函数放进字典、或当参数传递，即可顶掉八成工厂方法场景，不需要类层级。类继承的价值出现在**产品需要共享复杂装配流程**（模板方法）时——那已是第 5 章行为型的领域。
:::

## 抽象工厂：一次挡住「家族串牌」

**不用它**：UI 代码一处创建按钮、另一处创建滚动条，各按各的默认平台走——Windows 按钮配 Mac 滚动条，样式错乱还难查。
**用了之后**：传入一个工厂，整页产品保证出自同一"产品族"。
**代价**：族内新增一种产品（比如菜单），抽象接口和每个具体工厂都要跟着改。

```python
class WinUIFactory:                 # 每个工厂 = 一个产品族
    def create_button(self): return WinButton()
    def create_scrollbar(self): return WinScrollbar()

class MacUIFactory:
    def create_button(self): return MacButton()
    def create_scrollbar(self): return MacScrollbar()

def render_page(ui):                # 接收工厂 = 接收配套保证
    ui.create_button().draw()
    ui.create_scrollbar().draw()
```

与工厂方法一线之隔：**工厂方法造一种产品（子类决定造哪种），抽象工厂造一整套配套产品（工厂对象决定整个族）**。具体工厂内部常常再用工厂方法实现每个 `create_*`，实战中两者常搭配出现。

它的舒适区是"跨产品的配套不变式"：整族必须同源。产品之间互相独立时，抽象工厂就是过度设计，退回工厂方法即可。

## 建造者：参数爆炸与分步组装

**不用它**：构造器位置参数排到天际，同类型的相邻参数互换后编译器和运行时都不报错，只是结果全错。
**用了之后**：构建步骤与最终表示分离，分步装配、出口校验。
**代价**：一套样板类型；每次构造多几跳调用。

```python
# 错误：七个位置参数，"prod" 与端口、debug 与 workers
# 有两对错位也不报错——只是运行起来不对
srv = Server("prod", 8080, True, 4, 30, "/var/log", False)

# 正确（Python 原生解法）：keyword-only 参数 + 默认值，
# 消解八成参数爆炸，不需要任何新类型
class Server:
    def __init__(self, env, *, port=8080, workers=4, timeout=30,
                 log_path="/var/log", debug=False):
        self.env, self.port, self.workers = env, port, workers
        ...
```

GoF 的建造者针对更进一步的情形：**构建跨越多次调用，最后才能校验**（比如配置在不同阶段被增量装配）：

```python
class ServerBuilder:
    def __init__(self):
        self._cfg = {"env": "dev"}

    def port(self, p): self._cfg["port"] = p; return self
    def workers(self, n): self._cfg["workers"] = n; return self

    def build(self):
        if "port" not in self._cfg:
            raise ValueError("port is required")   # 出口统一校验
        return Server(**self._cfg)

srv = ServerBuilder().port(8080).workers(4).build()
```

:::tip[先试原生方案再上建造者]
keyword-only 参数、默认值、`dataclasses` 的 `field(default_factory=...)` 组合已覆盖大部分需求。只有当"装配步骤分散在不同调用、需要最终统一校验，或同一套步骤要产出不同表示"（如同一中间结构导出 PDF/HTML）时，才值得写真正的 Builder。
:::

## 原型：克隆批量生成，深浅拷贝是坑

**不用它**：循环里每次从零实例化对象，精灵树、连接上下文等昂贵成员反复初始化；而且"造哪个具体类型"被写死。
**用了之后**：复制一个模板实例再改少数字段——创建变成拷贝，改模板不用新增子类。
**代价**：拷贝语义要逐字段说清楚，对象图一复杂就容易踩坑。

```python
import copy

base = Enemy(speed=3, sprite=big_sprite)    # 模板实例
for _ in range(1000):
    e = copy.copy(base)                     # 浅拷贝：sprite 引用共享
    e.pos = random_spawn()                  # 只改该不同的部分
```

`copy.copy`（浅）与 `copy.deepcopy`（深）的语义差异是本模式最大的坑，对照：

```python
# 错误：浅拷贝共享嵌套容器——改克隆体，原主"有感觉"
game = GameState(items=[sword])
mini = copy.copy(game)
mini.items.append(shield)          # game.items 也变成 2 个了

# 正确：该深的深；但持有外部资源的成员要自己拦下拷贝
class GameState:
    def __deepcopy__(self, memo):  # 返回 self 或做受控重建
        ...
```

:::caution[deepcopy 的三个陷阱]
1. 性能：递归遍历整个对象图，可能比重新构造还慢一个量级；
2. 单例被克隆：对象图里的连接池等"全局唯一"成员被复制后，唯一性悄悄失效；
3. 不可拷贝成员：socket、文件句柄会直接抛异常——给它们实现 `__deepcopy__` 返回自身，让引用透传。
:::

实战提醒：Python 里 `dataclasses.replace()`（基于字段构造新实例）通常比克隆更清晰安全，改字段不用先想"这是共享引用还是独立副本"。

## 综合练习：给创建场景配模式

读五个场景，为每个写出最合适的创建型模式（或"不要用"）与理由，再看答案要点：

1. 报表导出器的配置项有十几个，不同场景只用其中一部分。
2. 系统唯一的序列号生成器，不能出现第二个实例，多处都要访问。
3. 消息模块要创建文本/图片/视频消息，业务代码不应知道具体类。
4. UI 组件库支持深浅两套主题，同屏的按钮、输入框、滚动条必须同源。
5. 关卡编辑器要从一个模板怪物批量生成上万个障碍物，仅位置与数值不同。

答案要点：

- 场景 1 → 建造者：分步装配 + `build()` 出口校验；若参数都有合理默认，keyword-only 参数即可。
- 场景 2 → 单例：模块级写法足够；但按 2.2 的妥协，业务类仍以参数接收它，测试才能换内存实现。
- 场景 3 → 工厂方法：`{"text": TextMsg, ...}` 注册表就是 Python 形态的答案。
- 场景 4 → 抽象工厂：产品族配套是它的经典主场，传工厂而非传散件。
- 场景 5 → 原型：模板克隆；先划清深/浅拷贝边界，再考虑是否 `replace()` 更稳。

## 本章小结

- 创建型模式共同做一件事：把"创建什么、何时、怎么组装"从业务代码搬走；每个模式按"不用的痛 → 用了的改善 → 交的代价"评估
- 单例本质是受控全局变量：首选模块级实例；惰性 + 多线程要双检锁；`__init__` 会重跑；测试性是它最大软肋
- 工厂方法造一种产品（子类/函数决定），抽象工厂造配套一族（防串牌），建造者处理分步构建与参数爆炸——Python 里一等函数与 keyword-only 参数常是第一答案
- 原型把创建变成拷贝：浅拷贝共享嵌套状态、深拷贝慢且会克隆单例，先想 `dataclasses.replace()` 是否够用
