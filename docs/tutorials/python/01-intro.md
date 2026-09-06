---
title: 初识 Python
---

# 第 1 章 · 初识 Python

**本章目标：**

- 理解 Python 的运行模型与适用场景
- 装好环境：解释器、venv、编辑器
- 跑通第一个程序并体验 REPL

## 1.1 Python 是什么

Python 是一门**解释执行**的高级语言（不用编译），以"代码即伪代码"的极简语法著称：

```python
# 同样输出 Hello，对比 Java
print("Hello, Python!")
```

它的统治级领域：**数据科学与 AI**（NumPy/PyTorch 全生态）、**自动化脚本**（运维/爬虫/办公）、**Web 后端**（Django/FastAPI）。

::: info 解释执行 vs 编译执行
Python 源码由**解释器（interpreter）**逐句执行——写完就跑，没有 Java 的 javac 环节。代价是启动慢、运行速度低于编译型语言；收益是开发迭代飞快。性能敏感的场景用 C 扩展（NumPy 的底层）补足。
:::

## 1.2 版本选择

只用 **Python 3**（2 已于 2020 年停止维护）。2026 年主流是 **3.12 / 3.13**：

```bash
python --version      # Python 3.12.x（Windows 上可能是 py）
python3 --version     # macOS/Linux 惯用命令
```

::: tip Windows 的 py 启动器
Windows 装多个版本时用 `py -3.12` 精确指定版本——`python` 命令可能被商店重定向，`py` 更可靠。
:::

## 1.3 三种运行方式

### ① 脚本文件（正式方式）

```python
# hello.py
print("Hello, Python!")
```

```bash
python hello.py        # Hello, Python!
```

### ② REPL 交互式解释器（试验场）

```bash
python
>>> 1 + 2
3
>>> name = "Python"
>>> name.upper()
'PYTHON'
>>> exit()             # 或 Ctrl+Z / Ctrl+D 退出
```

**REPL（Read-Eval-Print Loop）**：输入一行、立即看结果——学新 API 时最快的验证方式，本书代码片段都可以先在这里试。

### ③ IPython / Jupyter（增强版 REPL）

```bash
pip install ipython    # 第 12 章细讲 pip
ipython                # 语法高亮、自动补全的 REPL
```

## 1.4 虚拟环境 venv：项目隔离的第一课

**全局装包 = 依赖地狱**（A 项目要旧版库、B 项目要新版）。**虚拟环境（virtual environment）**为每个项目配一个独立解释器环境：

```bash
# 在项目目录里创建（目录名约定 .venv）
python -m venv .venv

# 激活
.venv\Scripts\activate        # Windows PowerShell / CMD
source .venv/bin/activate     # macOS/Linux

# 激活后：python / pip 都指向这个隔离环境
python --version
pip install requests          # 装到 .venv 里，不污染全局

# 退出虚拟环境
deactivate
```

**纪律：每个 Python 项目都先建 venv 再装包**——这是与 Node 教程"每项目一个 node_modules"同构的隔离思想（Node 是目录级隔离，Python 是环境级隔离）。

## 1.5 编辑器配置

- **VS Code + Python 扩展**（微软官方）：装好后打开 .py 文件即有智能提示；选择解释器（右下角 → 选中 .venv 里的 Python）
- **PyCharm Community**：纯 Python 项目的重型武器，venv 集成开箱即用

::: warning 缩进是语法的一部分
Python 用**缩进**表达代码块（4 个空格为约定）——不像 Java/JS 用大括号。缩进错误是语法错误，编辑器里把 Tab 自动替换成 4 空格可避坑（VS Code 默认如此）。
:::

## 1.6 第一个程序：输入、处理、输出

```python
# todo.py —— 最小命令行程序
def main():
    print("=== 待办清单 ===")
    while True:
        task = input("添加任务（回车空行退出）：")
        if task == "":
            break
        print(f"✓ 已记录：{task}")
    print("再见！")

if __name__ == "__main__":     # 主模块判断（第 7 章细讲）
    main()
```

```bash
python todo.py
# === 待办清单 ===
# 添加任务（回车空行退出）：学 Python
# ✓ 已记录：学 Python
# ...
```

两个新面孔提前混个脸熟：`f"..."` **f-string** 格式化字符串（第 2 章）、`if __name__ == "__main__"` 主模块守卫（第 7 章）。

## 1.7 动手：探索 REPL

在 REPL 里完成下面的小实验：

```python
>>> 10 / 3          # Python 的除法永远得到浮点数
3.3333333333333335
>>> 10 // 3         # 整除用 //
3
>>> 2 ** 10         # 幂运算
1024
>>> "py" * 3        # 字符串乘法
'pypypy'
>>> len("hello")    # 内置函数
5
```

`/` 与 `//` 的区别、`**` 幂、字符串 `*`——这些"Python 特产"与 Java 语义不同，注意区分。

## 本章小结

- 解释执行；REPL 即试即得；正式项目跑 .py 文件
- **venv 隔离每个项目的依赖**（对应 Node 的 node_modules 思想）
- 缩进是语法；f-string 与 `if __name__ == "__main__"` 已混脸熟
- 下一章进入语法主体
