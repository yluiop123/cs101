---
title: 工程化与综合实战
---

# 第 12 章 · 工程化与综合实战

**本章目标：**

- 掌握 Python 工程化四件套：pyproject、类型检查、格式化、测试
- 综合运用全教程知识完成"日志分析 CLI"
- 沉淀 Python 项目自查清单

## 12.1 pyproject.toml：项目统一说明书

现代 Python 项目的标准入口（取代散落的 setup.py/requirements 分家）：

```toml
# pyproject.toml
[project]
name = "logkit"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [                 # 运行依赖（对应 package.json dependencies）
    "rich>=13.0",
]

[project.optional-dependencies]  # 开发依赖（对应 devDependencies）
dev = [
    "pytest>=8.0",
    "mypy>=1.8",
    "ruff>=0.4",
]

[build-system]
requires = ["setuptools>=68"]
build-backend = "setuptools.build_meta"
```

```bash
pip install -e ".[dev]"     # 可编辑安装本项目 + 开发依赖
```

venv（第 1 章）+ pyproject + pip freeze 三者配合，就是 Python 世界的"环境还原三件套"。

## 12.2 代码质量四件套

```bash
# ① ruff：Linter + 格式化（速度碾压旧组合 flake8+black，2024 起的事实标准）
ruff check .              # 静态检查
ruff format .             # 格式化

# ② mypy：类型检查（type hints 不检查就白标了）
mypy src/

# ③ pytest：测试（事实标准，取代内置 unittest）
pytest                    # 跑全部测试
pytest -v                 # 详细模式
pytest --cov=src          # 覆盖率（需 pytest-cov）
```

### pytest 三分钟上手

```python
# test_service.py —— 测试文件以 test_ 开头、函数也以 test_ 开头
from logkit.analyzer import parse_level

def test_parse_level():
    line = "2026-09-06 14:30:01 INFO login success"
    assert parse_level(line) == "INFO"       # assert 直接断言（比 JUnit 简洁）

def test_parse_bad_line():
    assert parse_level("乱七八糟") is None

def test_error_raises():
    with pytest.raises(ValueError):          # 断言抛异常
        parse_level(None)
```

```python
# fixture：共享的测试准备
import pytest

@pytest.fixture
def sample_log(tmp_path):                    # tmp_path：pytest 内置临时目录
    p = tmp_path / "app.log"
    p.write_text("2026-09-06 14:30:01 INFO ok\n", encoding="utf-8")
    return p

def test_analyze(sample_log):
    result = analyze(sample_log)
    assert result["levels"]["INFO"] == 1
```

## 12.3 项目结构与目标

```text
logkit/
├── pyproject.toml
├── src/
│   └── logkit/
│       ├── __init__.py
│       ├── models.py        # 数据模型（dataclass）
│       ├── analyzer.py      # 解析与统计
│       └── cli.py           # 命令行入口（argparse）
└── tests/
    ├── test_analyzer.py
    └── test_cli.py
```

目标功能：解析日志文件 → 统计各级别数量 → 找 ERROR 明细 → 输出报告。

## 12.4 数据模型与解析层

```python
# src/logkit/models.py —— 类型提示 + dataclass（第 5/8 章）
from dataclasses import dataclass, field
from datetime import datetime

@dataclass(frozen=True)
class LogEntry:
    time: datetime
    level: str
    message: str

@dataclass
class LogReport:
    total: int = 0
    by_level: dict[str, int] = field(default_factory=dict)
    errors: list[LogEntry] = field(default_factory=list)

    def summary(self) -> str:
        parts = [f"{level}={count}" for level, count in sorted(self.by_level.items())]
        return f"共 {self.total} 条：{'，'.join(parts)}"
```

```python
# src/logkit/analyzer.py —— 生成器 + re 命名分组（第 6/8 章）
import re
from pathlib import Path
from collections import Counter
from datetime import datetime
from .models import LogEntry, LogReport

LINE_RE = re.compile(
    r"(?P<time>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) (?P<level>[A-Z]+) (?P<msg>.+)")

def parse_line(line: str) -> LogEntry | None:
    m = LINE_RE.match(line)
    if not m:
        return None
    return LogEntry(
        time=datetime.strptime(m["time"], "%Y-%m-%d %H:%M:%S"),
        level=m["level"],
        message=m["msg"],
    )

def iter_entries(path: Path):
    """惰性逐行解析：大文件内存 O(1)（第 6 章生成器）"""
    with path.open(encoding="utf-8", errors="ignore") as f:
        for line in f:
            entry = parse_line(line.rstrip("\n"))
            if entry is not None:
                yield entry

def analyze(path: Path) -> LogReport:
    report = LogReport()
    for entry in iter_entries(path):
        report.total += 1
        report.by_level[entry.level] = report.by_level.get(entry.level, 0) + 1
        if entry.level == "ERROR":
            report.errors.append(entry)
    return report
```

## 12.5 CLI 入口

```python
# src/logkit/cli.py —— argparse 标准库参数解析
import argparse
import json
import sys
from pathlib import Path
from .analyzer import analyze

def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="logkit", description="日志统计分析工具")
    parser.add_argument("logfile", type=Path, help="日志文件路径")
    parser.add_argument("--errors", action="store_true", help="打印 ERROR 明细")
    parser.add_argument("--json", action="store_true", help="输出 JSON")
    args = parser.parse_args(argv)

    if not args.logfile.exists():
        print(f"文件不存在：{args.logfile}", file=sys.stderr)
        return 1

    report = analyze(args.logfile)
    print(report.summary())

    if args.errors:
        for e in report.errors:
            print(f"[{e.time:%H:%M:%S}] {e.message}")
    if args.json:
        print(json.dumps({
            "total": report.total,
            "levels": report.by_level,
        }, ensure_ascii=False))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
```

```bash
python -m logkit.cli app.log --errors
# 共 130 条：ERROR=2，INFO=120，WARN=8
# [16:02:11] 数据库连接超时
```

## 12.6 测试

```python
# tests/test_analyzer.py
import pytest
from logkit.analyzer import parse_line, analyze

GOOD = "2026-09-06 14:30:01 INFO user login"

def test_parse_line():
    entry = parse_line(GOOD)
    assert entry is not None
    assert entry.level == "INFO"
    assert entry.message == "user login"

def test_parse_bad():
    assert parse_line("not a log") is None

def test_analyze_counts(tmp_path):
    log = tmp_path / "app.log"
    log.write_text(
        GOOD + "\n2026-09-06 14:31:00 ERROR db timeout\n",
        encoding="utf-8",
    )
    report = analyze(log)
    assert report.total == 2
    assert report.by_level == {"INFO": 1, "ERROR": 1}
    assert len(report.errors) == 1
```

```bash
pytest -v        # 3 passed
ruff check .     # All checks passed
mypy src/        # Success
```

## 12.7 Python 项目自查清单

- [ ] venv 隔离 + pyproject.toml 声明依赖
- [ ] 类型提示覆盖公共 API，mypy 通过
- [ ] ruff check + format 零告警
- [ ] 核心逻辑有 pytest 测试（含异常路径）
- [ ] 大数据处理用生成器/流式（不整读进内存）
- [ ] 文件 IO 显式 utf-8；异常精确捕获、不静默吞
- [ ] 入口带 argparse + `if __name__ == "__main__"`

## 12.8 下一步

Python 主线毕业。两条延伸：

- Web 方向：Django 教程 / FastAPI 教程（批次 2）
- 数据方向：Python 数据科学教程（NumPy/Pandas）

## 本章小结

- pyproject.toml 统一项目声明；venv + pip 还原环境
- ruff（检查+格式化）/ mypy（类型）/ pytest（测试）是质量三件套
- 实战串联：dataclass 建模、生成器流式解析、argparse CLI、pytest 验证
- 项目即工具：能被 import 也能被 python -m 执行
