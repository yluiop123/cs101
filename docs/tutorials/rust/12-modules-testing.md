---
title: 模块系统与测试
---

# 第 12 章 · 模块系统与测试

**本章目标：**

- 掌握 `mod`、文件组织与 `pub` 可见性边界，会用 `use`/`pub use` 管理路径
- 分清二进制 crate 与库 crate（`main.rs` 与 `lib.rs`）的职责与依赖边界
- 写全三层测试：单元 `#[test]`、集成测试 `tests/`、文档测试 `///`

## 12.1 mod：模块与文件组织

**模块（module）= 命名空间 + 可见性边界**。单文件内也能声明模块：

```rust
// src/main.rs
mod front_of_house {                   // 模块：把相关代码归拢成一个命名空间
    pub mod hosting {                  // 不写 pub：外部就看不见 hosting
        pub fn add_to_waitlist() { println!("已加入等位名单"); }
    }
}

use crate::front_of_house::hosting;    // use 导入路径，之后可短名调用

fn main() {
    hosting::add_to_waitlist();        // 全路径也行：crate::front_of_house::hosting::add_to_waitlist()
}
```

代码一多就拆文件。`mod 名字;`（不带花括号）是**声明**："去别处找定义"，路径逐级对应文件：

```text
src/
├── main.rs                  # crate 根；`mod garden;` 找 src/garden.rs
├── garden.rs                # 内部再 `pub mod flowers;` 找 src/garden/flowers.rs
└── garden/
    └── flowers.rs           # 子模块必须逐级声明；旧式 garden/mod.rs 入口二选一
```

其他语言用 `include` 粘贴文本；Rust 的 `mod 名;` 只是把文件**挂到模块树上**——每个文件自己又是一个作用域，`use` 照常按需导入。

## 12.2 pub 与可见性边界

默认一切私有——但"私有"按**模块树**判定：条目对"定义它的模块及其后代"可见。放开有梯度：`私有 < pub(super) < pub(crate) < pub`：

```rust
mod config {
    pub struct AppConfig {
        pub name: String,              // 结构体 pub ≠ 字段 pub：字段要逐个放开
        port: u16,                     // 私有字段：外部看得见类型，碰不到数据
    }

    impl AppConfig {
        pub fn new(name: &str, port: u16) -> Self { Self { name: name.to_string(), port } }
        pub fn port(&self) -> u16 { self.port }        // 用方法开口控制读取
        pub(crate) fn debug_dump(&self) -> String {    // crate 内随处可用，
            format!("{}:{}", self.name, self.port)     // 发布出去外部用户看不到
        }
    }
}
fn main() {
    let cfg = config::AppConfig::new("web", 8080);
    println!("{} / {}", cfg.port(), cfg.debug_dump()); // pub 与 pub(crate) 都放行
}
```

`pub(crate)` 是库开发高频档位：模块间协作的实现细节全放开，对用户只留挑选过的 API。编译器按"从调用点到目标的路径上每一级是否都可见"判定，任何一级私有即报错。

## 12.3 use 与重导出（pub use）

`use` 惯例与标准库一致：**函数导入到模块一级**（调用保留出处，如 12.1 的 `hosting::add_to_waitlist()`），**类型直接导入名字**：

```rust
use crate::config::AppConfig;                  // 类型：直接用名字
use std::fmt::{self, Display};                 // self：把 fmt 本身和 Display 一起带入
use std::process::Command as ProcessCommand;   // as：重命名，解决同名冲突
```

库入口还有重导出（re-export）：内部模块分层再深，`pub use` 把常用条目"提到"顶层——用户不必记内部结构，日后重构目录也不破坏对外 API：

```rust
// src/lib.rs —— 包名 mylib：http 模块整个对外隐藏
mod http {
    pub mod request {
        pub struct Request { pub url: String }
        pub fn send(_r: &Request) { println!("已发送"); }
    }
}
pub use self::http::request::Request;          // 对外变成 mylib::Request
pub use self::http::request as client;         // 整模块重导出：mylib::client::send(&r)
```

记住：`use` 不复制条目也不改变原模块，`pub use` 定义的只是"从哪条路径可以访问"——对外的 **API 门面**。

## 12.4 分离执行与声明：main.rs 与 lib.rs

一个 Cargo 包可同时产出两种 **crate**：

```text
mytool/
├── Cargo.toml            # [package] name = "mytool"
├── src/
│   ├── lib.rs            # 库 crate 根：核心逻辑，供他人复用（"声明"）
│   └── main.rs           # 二进制 crate 根：可执行程序入口（"执行"）
└── tests/
    └── cli.rs            # 集成测试，依赖库 crate（12.6）
```

分工惯例：`main.rs` 只做解析参数、调用库的薄入口，逻辑全进 `lib.rs`——同一份代码既能 `cargo run`，又能被 `tests/` 和其他包 `[dependencies]` 使用。**crate 边界就是可见性边界**：`lib.rs` 里不 `pub` 的东西，连同包的 `main.rs` 也调不到（它是以"外部用户"身份依赖库的）：

```rust
// src/main.rs —— 通过包名引用同包的库（连字符自动转下划线）
use mytool::run;
fn main() { run(); }           // 二进制与库是两个独立 crate，各有自己的 mod 树
```

::: tip 新建项目就选好形态
`cargo new mytool` 生成二进制包，`cargo new --lib mylib` 生成库包。需要被测试驱动、被复用的核心逻辑，先写成 lib 再挂 main，测试会顺得多。
:::

## 12.5 单元测试：#[test] 与 #[should_panic]

单元测试与业务代码同文件，装在 `#[cfg(test)]` 模块里——**只有 `cargo test` 时才编译**，发布产物不含；`assert!` 失败即 panic，接的是[第 7 章 · 错误处理](./07-error-handling) 的断言工具：

```rust
pub fn guarantee_positive(n: i32) -> i32 {
    assert!(n > 0, "必须为正数, 收到 {n}");   // 断言失败即 panic（第 7 章）
    n
}

#[cfg(test)]
mod tests {
    use super::*;                              // 单测在被测代码的"后代模块"：可测私有项
    #[test]
    fn positive_ok() { assert_eq!(guarantee_positive(3), 3); }

    #[test]
    #[should_panic(expected = "必须为正数")]   // 期望 panic，且消息含此子串
    fn zero_panics() { guarantee_positive(0); }

    #[test]
    fn returns_result() -> Result<(), String> {   // 测试也能返回 Result
        if 2 + 2 == 4 { Ok(()) } else { Err("算术崩了".to_string()) }
    }
}
```

```text
cargo test                  # 跑全部三层测试
cargo test positive_ok      # 名字子串筛选
cargo test -- --ignored     # 只跑标了 #[ignore] 的昂贵测试
```

::: warning should_panic 与返回 Result 二选一
`#[should_panic]` 把 panic 本身当信号，返回 Result 的测试没有 panic 可捕获——两种风格不能同用于一个测试函数。
:::

## 12.6 集成测试、文档测试与基准/覆盖率

集成测试放包根 `tests/` 目录，**每个文件是独立的 crate**（黑盒：只能走公有 API），`cargo test` 自动发现：

```rust
// tests/greeting.rs —— 独立 crate，需自己 use 被测库（工程见 12.7）
use hello_lib::greeting::greet;

#[test]
fn greet_trims_input() {
    assert_eq!(greet("  Tom  "), "Hello, Tom!");
}
```

多个测试文件共用辅助代码？放 `tests/common/mod.rs`——路径含 `mod.rs` 的文件不会被当独立 crate 收集。

文档测试最易被忽视：`///` 注释里的代码围栏会被 `cargo test` 抽出**编译并运行**，文档示例因此保证不过期——12.7 里 `greet` 的文档注释就是标准形态。

再往进阶两步（简述）：**基准测试**——稳定版不支持内置 `#[bench]`，标准做法是 criterion：`Cargo.toml` 加 `[dev-dependencies] criterion = "0.5"`，`benches/` 目录写基准、`cargo bench` 运行；**覆盖率**——安装 `cargo-llvm-cov` 后一条命令 `cargo llvm-cov` 出报告。

## 12.7 综合练习：lib + tests 的最小完整工程

把本章拼成真项目（`cargo new hello_lib` 后改造）。文件清单：

```text
hello_lib/
├── Cargo.toml
├── src/
│   ├── lib.rs            # 库 crate 根：只做模块声明
│   ├── greeting.rs       # 业务逻辑 + 文档测试 + 单元测试
│   └── main.rs           # 二进制薄入口，以包名使用库
└── tests/
    └── greeting.rs       # 集成测试（黑盒）
```

```toml
# Cargo.toml
[package]
name = "hello_lib"
version = "0.1.0"
edition = "2021"
```

```rust
// src/lib.rs
pub mod greeting;                      // 声明：src/greeting.rs 挂入本 crate，且对外可见
```

````rust
// src/greeting.rs
/// 生成问候语，空名字回退为 world。
///
/// # Examples
///
/// ```
/// assert_eq!(hello_lib::greeting::greet("Rust"), "Hello, Rust!");
/// ```
pub fn greet(name: &str) -> String {
    let who = if name.trim().is_empty() { "world" } else { name.trim() };
    format!("Hello, {who}!")
}

#[cfg(test)]
mod tests {
    use super::*;                              // 单测与被测代码同文件：私有项也能测
    #[test]
    fn greet_named() { assert_eq!(greet("Rust"), "Hello, Rust!"); }
    #[test]
    fn greet_empty_falls_back() { assert_eq!(greet("   "), "Hello, world!"); }
}
````

```rust
// src/main.rs —— 二进制以"外部用户"身份使用库 crate
use hello_lib::greeting::greet;
fn main() { println!("{}", greet("Cargo")); }        // Hello, Cargo!
```

```rust
// tests/greeting.rs —— 只能走公有 API 的黑盒
use hello_lib::greeting::greet;
#[test]
fn greet_trims_spaces() { assert_eq!(greet("  Tom  "), "Hello, Tom!"); }
```

`cargo test` 一次跑完，三层测试各自成组：

```text
running 2 tests        # src/greeting.rs 的单元测试 mod tests
test greeting::tests::greet_named ... ok
test greeting::tests::greet_empty_falls_back ... ok
running 1 test         # tests/greeting.rs 集成测试
running 1 test         # /// 文档测试（注释里的示例被编译运行）
```

## 本章小结

- `mod` 归拢命名空间、`mod 名;` 挂载文件；可见性按模块树逐级判定，梯度 `pub(super) < pub(crate) < pub`
- `use` 只管导入路径；`pub use` 重导出定对外 API 门面，内部目录可随意重构
- `lib.rs` 承载逻辑与复用边界，`main.rs` 只是薄入口；`tests/` 每个文件也是独立 crate 的黑盒
- 三层测试各司其职：`#[cfg(test)]` 单测可测私有项、集成测试验公有 API、文档测试防示例过期
