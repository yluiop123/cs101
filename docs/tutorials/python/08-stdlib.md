---
title: 标准库精选
---

# 第 8 章 · 标准库精选

**本章目标：**

- 精通 pathlib 文件路径操作（现代首选）
- 掌握 json/datetime/re/os 四大高频模块
- 认识 collections 与 itertools 的利器

## 8.1 pathlib：路径的面向对象封装

比 os.path 字符串拼接现代得多——**路径操作一律 pathlib**：

```python
from pathlib import Path

# 构造：/ 运算符拼接（跨平台）
p = Path("data") / "logs" / "app.log"
p = Path.home() / "documents"        # 用户主目录

# 判断与元信息
p.exists(); p.is_file(); p.is_dir()
p.name; p.stem; p.suffix             # 'app.log' / 'app' / '.log'
p.parent                             # data/logs

# 读写（第 9 章展开）
p.read_text(encoding="utf-8")
p.write_text("hello")

# 目录遍历
for f in Path(".").glob("*.py"):     # 当前目录下所有 .py
    print(f)
Path(".").rglob("*.log")             # 递归所有层级

# 建目录
Path("data/logs").mkdir(parents=True, exist_ok=True)
```

## 8.2 json：数据交换的标准格式

```python
import json

data = {"name": "Tom", "tags": ["py", "web"], "ok": True}

# 序列化
text = json.dumps(data, ensure_ascii=False, indent=2)
Path("user.json").write_text(text, encoding="utf-8")

# 反序列化
user = json.loads(Path("user.json").read_text(encoding="utf-8"))

# None ↔ null、True ↔ true —— 类型映射表：
# dict↔object  list↔array  str↔string  int/float↔number  bool↔bool  None↔null
```

::: warning 中文与 ensure_ascii
`json.dumps(data)` 默认把中文转成 `\uXXXX` 转义——**面向人的文件加 `ensure_ascii=False`**，接口传输可保持默认。
:::

## 8.3 datetime：日期时间

```python
from datetime import datetime, date, timedelta, timezone

now = datetime.now()                       # 本地时间
now_utc = datetime.now(timezone.utc)       # 带时区（后端推荐）

# 创建与读取
d = date(2026, 9, 6)
dt = datetime(2026, 9, 6, 14, 30)
d.year; d.month; d.day
now.strftime("%Y-%m-%d %H:%M:%S")          # 格式化 → '2026-09-06 14:30:05'

# 解析
datetime.strptime("2026-09-06", "%Y-%m-%d")

# 运算（不可变，返回新对象 —— 与 Java java.time 同思想）
tomorrow = d + timedelta(days=1)
last_week = now - timedelta(weeks=1)
(now - dt).total_seconds()                 # 时间差（秒）

# ISO 8601 标准格式（接口传输首选）
dt.isoformat()                             # '2026-09-06T14:30:05'
datetime.fromisoformat("2026-09-06T14:30:05")
```

## 8.4 re：正则表达式

正则语法见[正则表达式教程](/tutorials/regex/)，这里只讲 Python 用法：

```python
import re

text = "联系方式：13812345678，邮箱 tom@example.com"

# search：找第一个匹配（最常用）
m = re.search(r"\d{11}", text)
m.group()                          # '13812345678'

# findall：找所有
re.findall(r"\w+@\w+\.\w+", text)  # ['tom@example.com']

# sub：替换
re.sub(r"\d{11}", "***", text)     # 联系方式：***，邮箱 tom@example.com

# match：从开头匹配（配 groups）
m = re.match(r"(\w+)@(\w+)", "tom@mail.com")
m.groups()                         # ('tom', 'mail')

# 分割与编译复用
re.split(r"[,;]", "a,b;c")
pattern = re.compile(r"\d+")       # 频繁使用先编译
pattern.findall("a1b22c")
```

## 8.5 os 与环境变量

```python
import os

os.getenv("API_KEY")                       # 读环境变量（部署配置的标准通道）
os.getenv("DEBUG", "false")                # 带默认值
os.environ["API_KEY"] = "xxx"              # 设置（当前进程）

os.cpu_count()                             # CPU 核数（线程池大小参考）
os.urandom(16)                             # 密码学安全随机字节
```

## 8.6 collections：增强容器

```python
from collections import Counter, defaultdict, deque

# Counter：计数器（第 3 章预告过）
Counter(["a", "b", "a"]).most_common(1)    # [('a', 2)]

# defaultdict：自动初始化缺失的键（分组神器）
groups = defaultdict(list)
for student in students:
    groups[student.clazz].append(student.name)   # 键不存在自动建空列表

# deque：双端队列（队列/栈高性能实现）
queue = deque()
queue.append("x"); queue.popleft()          # 尾进头出 O(1)（list.pop(0) 是 O(n)）
```

## 8.7 itertools：迭代器工具箱

```python
import itertools as it

it.chain([1, 2], [3, 4])              # 1 2 3 4（串接多个可迭代）
list(it.islice(fib(), 5))             # 取前 5 个（配生成器）
it.groupby(sorted(items, key=k), key=k)   # 分组（记得先排序！）
list(it.permutations("abc", 2))       # 排列
list(it.combinations([1,2,3], 2))     # 组合
```

## 8.8 综合练习：日志分析器（标准库全家桶）

```python
import re
from collections import Counter
from pathlib import Path
from datetime import datetime

LOG_PATTERN = re.compile(
    r"(?P<time>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) (?P<level>\w+) (?P<msg>.+)")

def analyze(path: Path) -> dict:
    levels = Counter()
    errors = []
    for line in path.read_text(encoding="utf-8").splitlines():
        m = LOG_PATTERN.match(line)
        if not m:
            continue
        levels[m["level"]] += 1                      # 命名分组像字典一样取
        if m["level"] == "ERROR":
            errors.append(m.group("msg"))
    return {"levels": dict(levels), "errors": errors}

result = analyze(Path("app.log"))
print(result["levels"])     # {'INFO': 120, 'WARN': 8, 'ERROR': 2}
```

pathlib 读文件、re 命名分组解析、Counter 统计——一段代码把本章四大模块拧在一起，也正是第 12 章实战的底座。

## 本章小结

- 路径用 pathlib（/ 拼接 + glob 遍历）；JSON 读写记得 ensure_ascii=False
- datetime 不可变 + timedelta 运算；接口传输用 isoformat
- re 三板斧 search/findall/sub；频繁用先 compile
- Counter 计数、defaultdict 分组、deque 队列——collections 三利器
