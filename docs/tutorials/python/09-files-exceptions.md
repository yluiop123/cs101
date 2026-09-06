---
title: 文件与异常
---

# 第 9 章 · 文件与异常

**本章目标：**

- 掌握 with 语句读写文本/二进制文件
- 理解异常体系与 try-except-else-finally
- 学会自定义异常与"异常即文档"的设计

## 9.1 读写文本文件

```python
# 写文件
with open("notes.txt", "w", encoding="utf-8") as f:
    f.write("第一行\n")
    f.writelines(["第二行\n", "第三行\n"])

# 读文件
with open("notes.txt", encoding="utf-8") as f:
    content = f.read()                    # 全部读入（小文件）

with open("notes.txt", encoding="utf-8") as f:
    for line in f:                        # 逐行迭代（大文件友好，内存 O(1)）
        print(line.rstrip("\n"))

# 常用模式
# "r" 读（默认）   "w" 写（覆盖！）  "a" 追加
# "x" 独占创建（存在则报错）  "b" 二进制  "+" 读写
with open("log.txt", "a", encoding="utf-8") as f:
    f.write("追加一行\n")
```

::: tip with 是铁律
`with` 在代码块结束（包括异常）时自动关闭文件——**忘了 close 在 Windows 上会锁文件、Linux 上耗尽句柄**。直接 `open()` 不用 with 是新手重大禁忌。
:::

::: danger encoding 必须显式
Windows 默认编码是 GBK——**读写文本一律显式 `encoding="utf-8"`**，否则跨机器乱码（Python 3.15 起才默认 UTF-8）。
:::

## 9.2 二进制与 shutil

```python
# 二进制：图片复制
with open("in.png", "rb") as src, open("out.png", "wb") as dst:
    dst.write(src.read())

# 大文件分块
with open("big.mp4", "rb") as src, open("copy.mp4", "wb") as dst:
    while chunk := src.read(1024 * 1024):     # 海象运算符：读 1MB、非空继续
        dst.write(chunk)

# shutil：高层文件操作
import shutil
shutil.copy("a.txt", "backup/a.txt")
shutil.copytree("project", "project-backup")
shutil.rmtree("temp-dir")                    # 删整棵目录树（谨慎！）
```

## 9.3 异常体系

```text
BaseException
└── Exception
    ├── ValueError        值不合适（int("abc")）
    ├── TypeError         类型不对（"1" + 1）
    ├── KeyError          字典键不存在
    ├── IndexError        下标越界
    ├── FileNotFoundError  文件不存在
    ├── ZeroDivisionError 除零
    └── 自定义异常（继承 Exception）
```

## 9.4 try / except / else / finally

```python
def parse_config(path):
    try:
        text = path.read_text(encoding="utf-8")
    except FileNotFoundError:
        print("配置文件不存在，使用默认配置")
        return {}
    except (PermissionError, UnicodeDecodeError) as e:   # 多类型合并捕获
        print(f"读取失败：{e}")
        return {}
    else:
        return parse(text)            # else：没有异常才执行（成功路径）
    finally:
        print("解析流程结束")          # finally：无论如何都执行（清理）
```

**精确捕获**比裸捕更专业：

```python
try:
    risky()
except Exception:          # 太宽：连 bug 也吞了
    pass                   # ❌ pass 吞异常 = 静默失败，重大反模式

try:
    risky()
except (ValueError, KeyError) as e:    # ✅ 只接住预期的
    log(f"预期错误：{e}")
```

## 9.5 raise：抛出与异常链

```python
def withdraw(balance: float, amount: float) -> float:
    if amount <= 0:
        raise ValueError(f"金额必须为正，收到 {amount}")
    if amount > balance:
        raise ValueError(f"余额不足：现有 {balance}，请求 {amount}")
    return balance - amount

# 异常链：包装底层异常并保留现场（from 语法）
def load_settings(path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        raise RuntimeError(f"配置文件损坏：{path}") from e    # __cause__ 保留原始异常
```

## 9.6 自定义异常：业务语义层

```python
class AppError(Exception):
    """业务异常基类：带错误码，前端可识别"""
    code = "APP_ERROR"

class NotFoundError(AppError):
    code = "NOT_FOUND"

class ValidationError(AppError):
    code = "VALIDATION_FAILED"

# 业务代码
def find_task(tasks, task_id):
    for task in tasks:
        if task["id"] == task_id:
            return task
    raise NotFoundError(f"任务 #{task_id} 不存在")

# 统一处理层（CLI/HTTP 都适用）
try:
    find_task(tasks, 999)
except AppError as e:
    print(f"[{e.code}] {e}")     # [NOT_FOUND] 任务 #999 不存在
```

异常类层次 = 错误的分类学：**外层按类型分流处理，内层只管抛**——与 Java 第 7 章 BizException 同构。

## 9.7 EAFP vs LBYL：Python 的风格哲学

```python
# LBYL（Look Before You Leap）：先检查再操作（Java 风格）
if "email" in user:
    email = user["email"]

# EAFP（Easier to Ask Forgiveness than Permission）：先干、错了再接（Python 惯用）
try:
    email = user["email"]
except KeyError:
    email = None

# 更 Python 的答案：get() 这类"安全 API"优先，异常留给真正的意外
email = user.get("email")
```

原则：**能用安全 API 就不用异常控制流程；异常表达"意外"，不表达"分支"**。

## 9.8 综合练习：带容错的词频统计

```python
from collections import Counter
from pathlib import Path
import json

def word_freq(path: Path) -> Counter:
    if not path.exists():
        raise FileNotFoundError(f"文件不存在：{path}")
    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        text = path.read_text(encoding="gbk", errors="ignore")   # 编码兜底
    return Counter(word for word in text.split() if len(word) > 1)

def save_report(counter: Counter, out: Path) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)               # 目录不存在自动建
    with out.open("w", encoding="utf-8") as f:
        json.dump(counter.most_common(20), f, ensure_ascii=False, indent=2)

try:
    freq = word_freq(Path("data/article.txt"))
    save_report(freq, Path("output/report.json"))
    print("前 5 高频词：", freq.most_common(5))
except FileNotFoundError as e:
    print(f"跳过：{e}")
except OSError as e:
    print(f"IO 错误：{e}")
```

## 本章小结

- 文本读写 with + **显式 utf-8**；大文件逐行迭代；shutil 管批量操作
- except 精确到预期类型；else 管成功路径、finally 管清理；绝不静默吞异常
- raise 抛出 + `from e` 保留异常链；自定义异常继承 Exception 表达业务语义
- EAFP 是风格不是教条：安全 API 优先，异常留给意外
