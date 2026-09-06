---
title: 模块与包
---

# 第 7 章 · 模块与包

**本章目标：**

- 掌握模块（module）的导入方式与搜索路径
- 理解包（package）的组织与 `__init__.py`
- 弄懂 `if __name__ == "__main__"` 的原理

## 7.1 模块：一个 .py 文件

每个 .py 文件就是一个**模块（module）**——代码复用与命名空间的基本单位：

```python
# utils.py
PI = 3.14159

def circle_area(r: float) -> float:
    return PI * r ** 2

def _internal():            # 单下划线约定："模块内部使用"（不强制）
    ...
```

```python
# main.py —— 四种导入方式
import utils                      # ① 导入模块
utils.circle_area(2)              # 用时带前缀

import utils as u                 # ② 起别名
u.circle_area(2)

from utils import circle_area, PI # ③ 导入指定成员（直接用名字）
circle_area(2)

from utils import *               # ④ 全部导入 —— ❌ 禁用：命名空间污染
```

**推荐**：①③ 为主（来源清晰）；别用 ④（冲突风险高，读代码找不到名字出处）。

## 7.2 模块只执行一次与 `__name__`

```python
# utils.py 顶层代码：import 时执行，且一个进程内只执行一次（模块缓存）
print("utils 被加载")        # 第一次 import 打印，后续 import 静默
```

**主模块守卫**——模块被直接运行 vs 被导入的区别：

```python
# utils.py 追加
def main():
    print("作为主程序运行")

if __name__ == "__main__":    # 直接 python utils.py 时 __name__ == "__main__"
    main()                    # 被别人 import 时 __name__ == "utils"，守卫内的代码不跑
```

**作用：让一个文件既能当库被导入，又能当脚本直接运行**——测试代码放守卫里，两不误。

## 7.3 包：模块的目录

**包（package）**= 带 `__init__.py` 的目录（Python 3.3+ 支持无 `__init__.py` 的命名空间包，但传统项目都写）：

```text
myproject/
├── main.py
└── services/               # 包
    ├── __init__.py         # 包标识（可留空，也可做导出门面）
    ├── todo.py             # services.todo 模块
    └── user.py             # services.user 模块
```

```python
# main.py 中的导入
import services.todo
services.todo.add("学 Python")

from services import todo           # 导入子模块
from services.todo import add       # 直接导入函数
from services.todo import add as add_task   # 避免同名冲突
```

**`__init__.py` 做导出门面**（包的"公共 API"）：

```python
# services/__init__.py
from services.todo import add, list_all
from services.user import login
# 使用方：from services import add —— 不用关心内部文件结构
```

## 7.4 模块搜索路径

```python
import sys
sys.path    # 解释器找模块的目录列表，顺序：
# ① 脚本所在目录
# ② PYTHONPATH 环境变量
# ③ 标准库目录
# ④ site-packages（pip 装的第三方库）
```

推论：**从项目根目录运行**（`python -m services.todo` 或 `python main.py`），import 才能找到顶层包——"ModuleNotFoundError: No module named 'services'" 十有八九是运行目录不对。

## 7.5 标准库与第三方库的分工

```python
import json                 # 标准库：无需安装
import requests             # 第三方：pip install requests（装进 venv）
```

```bash
pip install requests        # 安装到当前 venv
pip list                    # 已安装列表
pip show requests           # 版本与依赖详情
pip freeze > requirements.txt    # 导出依赖清单（项目交付物）
pip install -r requirements.txt  # 依据清单还原环境
```

`requirements.txt` = Python 世界的 package.json（第 12 章讲工程化的升级形态 pyproject.toml）。

## 7.6 常用内置模块一瞥

```python
import math
math.sqrt(2), math.ceil(3.2), math.floor(3.8)

import random
random.randint(1, 6)               # 掷骰子
random.choice(["a", "b", "c"])
random.shuffle(items)

import sys
sys.argv                            # 命令行参数列表
sys.exit(1)                         # 以退出码结束

import os
os.getenv("HOME")                   # 环境变量
```

（第 8 章精选 os/re/json/datetime/pathlib 展开讲。）

## 7.7 综合练习：多文件待办程序

```text
todoapp/
├── main.py
└── todoapp/                  # 包
    ├── __init__.py
    ├── storage.py
    └── service.py
```

```python
# todoapp/storage.py
import json
from pathlib import Path

def load(path: Path) -> list[dict]:
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return []

def save(path: Path, tasks: list[dict]) -> None:
    path.write_text(json.dumps(tasks, ensure_ascii=False, indent=2), encoding="utf-8")
```

```python
# todoapp/service.py
from dataclasses import dataclass, field
from . import storage                 # 包内相对导入

@dataclass
class Task:
    id: int
    text: str
    done: bool = False

class TaskService:
    def __init__(self, path: Path):
        self.path = path
        self.tasks = [Task(**d) for d in storage.load(path)]    # dict 解包构造
        self.next_id = max((t.id for t in self.tasks), default=0) + 1

    def add(self, text: str) -> Task:
        task = Task(self.next_id, text)
        self.tasks.append(task)
        self._persist()
        return task

    def _persist(self) -> None:                       # 单下划线：内部方法
        storage.save(self.path, [vars(t) for t in self.tasks])
```

```python
# main.py —— 包使用方
from todoapp.service import TaskService

service = TaskService(Path("tasks.json"))
service.add("学模块与包")
```

分层 + 相对导入（`.storage`）+ `__init__` 门面——中大型 Python 项目的骨架。

## 本章小结

- 模块 = .py 文件；import 方式选"模块 + 前缀"或"点名导入"，拒绝 `*`
- `if __name__ == "__main__"` 让文件可导可跑；模块只加载一次
- 包 = `__init__.py` 目录；`__init__` 当导出门面；包内相对导入 `.xxx`
- 从项目根运行；pip + requirements.txt 管第三方依赖
