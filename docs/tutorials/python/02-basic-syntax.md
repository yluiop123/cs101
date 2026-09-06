---
title: 基础语法与流程控制
---

# 第 2 章 · 基础语法与流程控制

**本章目标：**

- 掌握变量、动态类型与常用运算
- 熟练 if / for / while 与 match 分支
- 会用 f-string 格式化字符串

## 2.1 变量与动态类型

Python 变量**不声明类型**，类型跟着值走（动态类型）：

```python
x = 42              # int
x = "hello"         # 现在 x 是 str —— 合法但慎用
name, age = "Tom", 18        # 多重赋值
a = b = c = 0                # 链式赋值
x, y = y, x                  # 交换变量——一行搞定（Python 名场面）
```

`type()` 查看类型：

```python
type(42)          # <class 'int'>
type(3.14)        # <class 'float'>
type("hi")        # <class 'str'>
type(True)        # <class 'bool'>
type(None)        # <class 'NoneType'> —— None 表示"没有值"（对应 Java 的 null）
```

::: info 动态类型与类型提示
动态类型灵活但大项目难维护——Python 3.5+ 引入**类型提示（type hints）**（配合 mypy 静态检查），FastAPI 教程会重度使用。本教程前期不强制标注，第 12 章介绍。

```python
def add(a: int, b: int) -> int:    # 提示不影响运行，只是给人和工具看
    return a + b
```
:::

## 2.2 数值与字符串

```python
# 数值
int("42")        # 字符串转整数
float("3.14")
int(3.9)         # 3 —— 截断，不是四舍五入！
round(3.5)       # 4（银行家舍入：.5 取偶）

# 字符串：单双引号等价，三引号多行
s = 'hello'
s = "hello"
s = """多行
字符串"""

# 常用操作
len("hello")             # 5
"Hello".upper()          # 'HELLO'
"  hi  ".strip()         # 'hi'
"a,b,c".split(",")       # ['a', 'b', 'c']
"-".join(["a", "b"])     # 'a-b'
"hello"[0]               # 'h'
"hello"[-1]              # 'o' —— 负下标从尾数！
"hello"[1:4]             # 'ell' —— 切片：含头不含尾
"py" in "python"         # True —— 成员判断
```

## 2.3 f-string：格式化首选

```python
name, score = "Tom", 92.5
f"姓名：{name}，分数：{score}"        # '姓名：Tom，分数：92.5'
f"提升：{score + 5}"                  # 表达式直接算
f"{score:.1f}"                        # '92.5' —— 保留 1 位小数
f"{1234567:,}"                        # '1,234,567' —— 千分位
f"{0.85:.0%}"                         # '85%' —— 百分比
```

f-string 表达式里可以直接调函数、做运算——Java 的 String.format + "%d" 世界从此远离。

## 2.4 运算符差异提示（对 Java/JS 老手）

```python
10 / 3       # 3.333... —— 普通除法永远得 float（Java 是 3！）
10 // 3      # 3 —— 整除
10 % 3       # 1 —— 取余
2 ** 10      # 1024 —— 幂（Java 用 Math.pow）
1 < x < 10   # 链式比较：x 在 1 到 10 之间（Java 要 x>1 && x<10）
None is None # is 判"同一个对象"；None 比较用 is，不用 ==
not / and / or   # 逻辑运算符是单词（Java 是 !/&&/||）
```

## 2.5 条件：if / elif / else

```python
score = 85

if score >= 90:
    print("优秀")
elif score >= 60:
    print("及格")
else:
    print("不及格")

# 三元写法：值 if 条件 else 值
level = "及格" if score >= 60 else "不及格"
```

::: tip 真值判断（truthiness）
Python 惯用"直接判断"而不是比较：

```python
if items:            # 列表非空即为真（不用 len(items) > 0）
if name:             # 字符串非空
if x is not None:    # 明确判"有没有值"时用 is not None
```
:::

## 2.6 循环：for 与 while

```python
# for 遍历序列（不是 C 式计数循环！）
for ch in "abc":
    print(ch)

for n in [1, 2, 3]:
    print(n)

# range：数字序列（含头不含尾）
for i in range(5):        # 0 1 2 3 4
    print(i)
for i in range(2, 10, 2): # 2 4 6 8（起、止、步长）
    print(i)

# enumerate：带下标遍历（替代 Java 的 i 索引法）
for i, ch in enumerate("abc"):
    print(i, ch)

# zip：并行遍历多个序列
for name, score in zip(["Tom", "Lucy"], [92, 88]):
    print(name, score)

# break / continue / else
for n in range(2, 100):
    for d in range(2, n):
        if n % d == 0:
            break           # 有因数，非质数
    else:                   # 循环没被 break 时执行（Python 特色）
        print(n, "是质数")
```

## 2.7 match：结构化分支（3.10+）

```python
def handle(command):
    match command.split():
        case ["add", item]:
            print(f"添加 {item}")
        case ["del", id]:
            print(f"删除 #{id}")
        case ["list"]:
            print("列出全部")
        case _:
            print("未知命令")
```

类比 Java 的 switch 箭头语法，但 match 能**按结构匹配**（列表模式、解构）——处理命令行参数非常顺手。

## 2.8 综合练习：BMI 计算器

```python
def bmi(height_m: float, weight_kg: float) -> float:
    return weight_kg / height_m ** 2

def level(bmi_value: float) -> str:
    if bmi_value < 18.5:
        return "偏瘦"
    elif bmi_value < 24:
        return "正常"
    elif bmi_value < 28:
        return "偏胖"
    else:
        return "肥胖"

while True:
    try:
        h = float(input("身高(m)："))
        w = float(input("体重(kg)："))
    except ValueError:
        print("请输入数字"); continue
    if h <= 0:
        break
    b = bmi(h, w)
    print(f"BMI = {b:.1f}，属于【{level(b)}】")
```

## 本章小结

- 动态类型 + 多重赋值/交换；None 用 is 判断
- `/` 永远得浮点、`//` 整除、`**` 幂、链式比较是 Python 特产
- f-string 是格式化标准答案；range/enumerate/zip 三件套驱动 for
- 真值判断简化 if；match 按结构分支（3.10+）
