---
title: 综合实战：CLI 工具
---

# 第 14 章 · 综合实战：CLI 工具

**本章目标：**

- 用标准库 + serde 完成可运行的待办清单 CLI（add/list/done）
- 掌握「模型 / 持久化 / 分发 / 错误」四层拆分与模块组织
- 把第 6 章的 match、第 7 章的 `?`、第 4 章的借用规则落到真实代码里

## 14.1 项目目标与结构

`todo add <内容>` 追加任务，`todo list` 列出全部，`todo done <ID>` 标记完成；数据存 `tasks.json`，错误走 stderr、退出码非零。按职责分五个文件（模块与可见性见 [第 12 章 · 模块系统与测试](./12-modules-testing)）：

```text
todo-cli/
├── Cargo.toml
└── src/
    ├── main.rs      # 入口：拼装模块 + 决定退出码
    ├── cli.rs       # 参数解析 + 命令分发 + 命令实现
    ├── task.rs      # 数据模型
    ├── store.rs     # JSON 持久化
    └── error.rs     # 错误类型
```

```toml
# Cargo.toml
[package]
name = "todo"           # 包名就是产物名：cargo build 出来叫 todo
version = "0.1.0"
edition = "2021"
[dependencies]
serde = { version = "1", features = ["derive"] }   # derive 特性打开 #[derive(Serialize, Deserialize)]
serde_json = "1"
```

只有两个第三方依赖：标准库不带 JSON，所以 serde 必需，参数解析交给标准库（14.4 说明为什么这里不引 clap）。Go 版同类项目「标准库全包」是生态差异，不是优劣。

## 14.2 数据模型与 serde 序列化

```rust
// src/task.rs
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]      // derive：宏替你写实现（第 8 章）
pub struct Task {
    pub id: u64,
    pub text: String,
    #[serde(default)]            // 老存档缺这个字段时按 false，而不是整档解析失败
    pub done: bool,
}

impl Task {
    pub fn new(id: u64, text: String) -> Self { Self { id, text, done: false } }   // 构造函数只管字段
}

impl std::fmt::Display for Task {  // Display = 给用户看的 {}；Debug({:?}) 已由 derive 给
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "[{}] #{:<3} {}", if self.done { "x" } else { " " }, self.id, self.text)
    }
}
```

serde 常用字段属性三个够用很久：`#[serde(default)]` 缺字段给默认值（向前兼容的关键）、`#[serde(rename_all = "camelCase")]` 一次把所有字段换成小驼峰、`#[serde(skip)]` 让字段不参与序列化。想再加 `created_at: u64` 存 Unix 秒，用 `std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH)` 取值并以 `unwrap_or(0)` 兜底（时钟异常不是业务错误，不该 panic）；要显示成 `09-06 17:20` 才需要 `chrono = "0.4"`——它的 `Local.timestamp_opt` 返回「可能不存在」的结果类型，因为时间戳本身可能非法。Rust 连日期库都不肯给你一个会 panic 的接口。

## 14.3 持久化层：store.rs

```rust
// src/store.rs
use crate::error::AppError;
use crate::task::Task;
use std::fs;
use std::path::PathBuf;

pub struct Store { path: PathBuf }     // 路径是构造进来的依赖，不是写死的常量

impl Store {
    pub fn open() -> Self {            // 存档位置：环境变量 TODO_STORE 优先，否则 tasks.json
        let path = std::env::var("TODO_STORE").map(PathBuf::from)
            .unwrap_or_else(|_| PathBuf::from("tasks.json"));
        Self { path }
    }

    /// 读全表。"文件不存在"不是错误——首次运行的空表是正常状态
    pub fn load(&self) -> Result<Vec<Task>, AppError> {
        match fs::read_to_string(&self.path) {
            Ok(text) if text.trim().is_empty() => Ok(Vec::new()),   // 匹配守卫（第 6 章）
            Ok(text) => Ok(serde_json::from_str(&text)?),           // 内容坏 → AppError::Json
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(Vec::new()),
            Err(e) => Err(e.into()),                                // 权限等 → AppError::Io
        }
    }

    /// 写全表：整文件覆盖（原子写的取舍见本节末尾）
    pub fn save(&self, tasks: &[Task]) -> Result<(), AppError> {
        fs::write(&self.path, serde_json::to_string_pretty(tasks)?)?;   // ? + From 自动转换
        Ok(())
    }
}
```

这一层只干一件事：**在 `Vec<Task>` 和磁盘上的 JSON 之间搬运**，不掺业务判断。`save` 收 `&[Task]` 而不是 `Vec<Task>`：调用方保留所有权，函数也不关心容量——这是 [第 4 章 · 借用与引用](./04-borrowing) 里「输入用切片」惯例的落地。「查 ID、算新 ID」留在 14.5 的命令层，持久化层只会搬运。

::: warning 整文件覆盖不是原子写
`fs::write` 直接覆盖原文件：进程中途被杀死，存档可能只剩半截。正确做法是「写 `tasks.json.tmp` → `fs::rename` 覆盖」，靠 rename 的原子性保证要么旧版本要么新版本。本章数据量小，且 `load` 对损坏内容会明确报错而非静默清空，所以先不做——但要清楚这是取舍，不是终点。
:::

## 14.4 入口与参数解析：为什么不引 clap

```rust
// src/main.rs
mod cli; mod error; mod store; mod task;
use std::process::ExitCode;

fn main() -> ExitCode {
    // args() 是迭代器，args[0] 是程序自身路径；collect 成 Vec 才能按位置取参数
    let args: Vec<String> = std::env::args().collect();
    let store = store::Store::open();
    match cli::parse(&args).and_then(|cmd| cli::run(cmd, &store)) {   // 解析成功才执行
        Ok(()) => ExitCode::SUCCESS,
        Err(e) => {
            eprintln!("✗ {e}");    // 错误走 stderr，不污染可被管道消费的 stdout
            ExitCode::FAILURE       // 非零退出码：`todo done 99 && echo ok` 才不会误判
        }
    }
}
```

关于 `env::args`：`args()` 把参数解码成 `String`，遇到非法 UTF-8 会 panic；`args_os()` 返回 `OsString`，能表达任何文件名——处理路径要用后者（配 `PathBuf::from`），处理任务文本用前者足够。

**为什么不引 clap**：clap 给的是自动 help、短/长名合并（`-v/--verbose`）、子命令树、shell 补全。本项目三个子命令、每个只有位置参数，手写解析约 20 行；引依赖要付编译时间与一套 derive API 的学习成本。**参数形态稳定到「动词 + 位置参数」时，手写解析不会错在哪**——它把校验前置成 14.5 那个枚举，可读性与可测性都不差。反过来，一旦出现布尔取反、嵌套子命令、需要生成补全脚本，手写分支的复杂度就会反超依赖成本；届时只替换 `parse`，`Command` 枚举与 `run` 一行都不用改——这正是把「解析」和「执行」拆成两个函数的原因。

## 14.5 命令分发：match 驱动的 cli.rs

核心手法：**把字符串参数升级成有类型的枚举**——非法命令在解析阶段就被挡掉，`run` 拿到的一定是合法意图。穷尽性与解构的规则见 [第 6 章 · 模式匹配](./06-pattern-matching)。

```rust
// src/cli.rs
use crate::error::{usage, AppError};
use crate::store::Store;
use crate::task::Task;

const HELP: &str = "用法：todo add <任务内容> | list | done <ID>";
/// 解析结果：每个变体都是「参数已经校验过」的命令
pub enum Command {
    Add { text: String },
    List,
    Done { id: u64 },
}

pub fn parse(args: &[String]) -> Result<Command, AppError> {
    let Some(head) = args.get(1) else { return Err(usage(HELP)); };   // let-else：拿不到动词就出帮助
    match head.as_str() {                          // 呼应第 6 章：match 是命令分发的天然结构
        "help" | "--help" | "-h" => Err(usage(HELP)),
        "add" => {
            let text = args[2..].join(" ");        // 剩余参数合并成任务文本
            if text.trim().is_empty() { return Err(usage("add 需要任务内容")); }
            Ok(Command::Add { text })
        }
        "list" => Ok(Command::List),
        "done" => {
            let raw = args.get(2).ok_or_else(|| usage("done 需要任务 ID"))?;
            let id = raw.parse::<u64>()
                .map_err(|_| usage(format!("ID 必须是数字，收到：{raw}")))?;
            Ok(Command::Done { id })
        }
        other => Err(usage(format!("未知命令：{other}"))),   // _ 兜底保证穷尽
    }
}

/// 执行：这里不再碰字符串，只在枚举上做分支
pub fn run(cmd: Command, store: &Store) -> Result<(), AppError> {
    match cmd {
        Command::Add { text } => {
            let mut tasks = store.load()?;
            let id = tasks.iter().map(|t| t.id).max().unwrap_or(0) + 1;   // 不复用旧 ID
            tasks.push(Task::new(id, text));        // text 在此移动进 Task（第 3 章）
            store.save(&tasks)?;
            println!("✓ 已添加 #{id}");
        }
        Command::List => {
            let tasks = store.load()?;
            if tasks.is_empty() { println!("（空）"); }
            for t in &tasks { println!("{t}"); }    // &tasks 只读遍历；Display 自动生效
        }
        Command::Done { id } => {
            let mut tasks = store.load()?;
            let text = {
                let task = tasks.iter_mut().find(|t| t.id == id).ok_or(AppError::NotFound(id))?;
                task.done = true;
                task.text.clone()                   // 取走需要的数据，可变借用就此结束
            };
            store.save(&tasks)?;                    // 若仍在借用 tasks，这一行编译不过
            println!("✓ 已完成 #{id} {text}");
        }
    }
    Ok(())
}
```

`Command::Done` 那段是本章唯一「编译器替你排序」的地方：`task` 可变借用 `tasks`，若把要打印的文本留到 `save` 之后再取，就会撞上「可变借用与不可变借用重叠」——借用检查器在 CLI 里的存在感，通常就是这种「先取数据、再落盘」的顺序要求。`parse` 是纯函数，最适合单测：三条用例（add 合并剩余参数、`del 1` 与 `done abc` 都归为 `Usage`、无参数返回帮助）就能守住整条解析路径，写法见第 12 章。

## 14.6 错误处理：自定义 error enum + `?`

`?` 一路往上抛时，中间层要能说出「这是哪类失败」，出口才能决定措辞与退出码（详见 [第 7 章 · 错误处理](./07-error-handling)）。错误流向：`task.rs` 不产生错误；`store.rs` 的 `io::Error`/`serde_json::Error` 经 `From` 变成 `AppError`；`cli.rs` 新增 `Usage` 与 `NotFound`；`main.rs` 是唯一打印和定退出码的地方。

```rust
// src/error.rs
use std::fmt;

#[derive(Debug)]
pub enum AppError {
    Io(std::io::Error),        // 读写存档失败
    Json(serde_json::Error),   // 存档内容不合法
    Usage(String),             // 用户命令行写错
    NotFound(u64),             // 业务错误：ID 不存在
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            AppError::Io(e) => write!(f, "文件读写失败: {e}"),
            AppError::Json(e) => write!(f, "存档格式错误: {e}"),
            AppError::Usage(msg) => write!(f, "{msg}"),
            AppError::NotFound(id) => write!(f, "找不到 ID 为 {id} 的任务"),
        }
    }
}

impl std::error::Error for AppError {}    // 实现 Error：进入生态通用错误协议

// From：让 ? 在 io::Error / serde_json::Error 处自动包成 AppError（第 7 章的机制）
impl From<std::io::Error> for AppError { fn from(e: std::io::Error) -> Self { AppError::Io(e) } }
impl From<serde_json::Error> for AppError { fn from(e: serde_json::Error) -> Self { AppError::Json(e) } }

pub fn usage(msg: impl Into<String>) -> AppError { AppError::Usage(msg.into()) }
```

::: warning Usage 与 NotFound 别混成一种
都塞进 `Other(String)` 也能跑，但出口就无法区分：前者该打印帮助，后者只需一行错误。枚举的价值是**让调用点能按变体决策**——与第 6 章「给枚举加变体，所有 match 立刻标红」是同一种安全感。样板 `From`/`Display` 写多了就换 thiserror（见 7.5）。
:::

## 14.7 运行效果

```bash
cargo build --release
./target/release/todo add 学完 Rust 教程
# ✓ 已添加 #1
./target/release/todo add 写一个 CLI
# ✓ 已添加 #2
./target/release/todo list
# [ ] #1   学完 Rust 教程
# [ ] #2   写一个 CLI
./target/release/todo done 1
# ✓ 已完成 #1 学完 Rust 教程
./target/release/todo done 99; echo $?
# ✗ 找不到 ID 为 99 的任务
# 1
```

再跑一次 `todo list`，`#1` 的行首已变成 `[x]`——存档是 `to_string_pretty` 的产物，纯文本、可以直接手改。`cargo test` 应给出 `3 passed; 0 failed`。

## 14.8 自查清单

- [ ] 四个模块职责单一：模型不读盘、持久化不懂业务、分发不打印、main 只定退出码
- [ ] `Command` 枚举把字符串校验前置，`run` 只处理合法意图
- [ ] 首次运行/空文件不算错误，损坏存档明确报 `AppError::Json` 而不是静默清空
- [ ] 错误走 stderr、退出码非零；`todo done 99 && echo ok` 不会误判成功
- [ ] `#[serde(default)]` 保证以后加字段时老存档仍可读；列表打印靠 `Display` 而非 `{:?}`
- [ ] `parse` 是纯函数且有单测覆盖 add/list/done；知道换 clap、改原子写的触发条件

## 本章小结

- 「模型 / 持久化 / 分发 / 错误」四层 + 两个依赖，是 Rust 小工具最舒适的规模
- 字符串参数先升格成枚举再执行；match 的穷尽性天然适合命令分发
- 自定义 error enum + `From` 让 `?` 一路通行，出口只有一处决定措辞与退出码
- 借用规则在「先取数据再落盘」的顺序里替你把关；第 15 章把这份数据搬上 HTTP
