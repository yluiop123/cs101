---
title: 初识 Rust
---

# 第 1 章 · 初识 Rust

**本章目标：**

- 理解 Rust 解决的核心问题：内存安全 + 性能兼得
- 装好工具链，跑通第一个程序
- 认识 cargo 与 crate 生态

## 1.1 Rust 是什么

Rust 由 Mozilla 主导开发，2015 年发布 1.0。它同时做到了两件"不可能"的事：

```text
C/C++ 级性能（无 GC、零成本抽象）＋ 内存安全（编译期保证）
```

传统语言的困境：

```text
C/C++：快，但空指针/野指针/缓冲区溢出——安全漏洞重灾区
Java/Go/Python：安全（GC 或运行时托管），但有 GC 停顿/运行时开销
Rust：编译器替你管理内存——所有权（ownership）机制在编译期验证，运行时零开销
```

它连续多年是 Stack Overflow "最受喜爱语言"，落地领域：命令行工具（ripgrep/fd）、WebAssembly、区块链、操作系统（Linux 内核已接受 Rust 代码）、高性能后端（Discord/Cloudflare）。

::: info 所有权预告（第 3 章正式展开）
```rust
fn main() {
    let s = String::from("hello");
    let t = s;                 // 所有权移动（move）给 t
    println!("{}", s);         // ❌ 编译错误！s 已"失效"
}
```
第一眼"反直觉"，这正是 Rust 的独特之处——**编译器在你写的时候就告诉你谁拥有数据、谁能用多久**。所有空指针/UAF（use after free）在编译期被消灭。
:::

## 1.2 安装：rustup 一键全家桶

```bash
# 官方安装器 rustup（管理工具链版本）
# Windows：下载 rustup-init.exe；macOS/Linux：
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 验证（三件套）
rustc --version      # rustc 1.xx.x —— 编译器
cargo --version      # cargo 1.xx.x —— 构建工具 + 包管理器
rustup update        # 升级工具链
```

**cargo** 是 Rust 的核心体验：构建、依赖、测试、文档、发布一条命令全包（对标 Node 的 npm+Vite+jest 合体）。

## 1.3 Hello, World 与 Hello, Cargo

```rust
// main.rs —— 手写版
fn main() {
    println!("Hello, world!");
}

// 编译运行
rustc main.rs && ./main
```

**实际项目从不用 rustc**——用 cargo：

```bash
cargo new hello          # 创建项目（git init + Cargo.toml + src/main.rs）
cd hello
cargo run                # 编译 + 运行
cargo build --release    # 优化编译（产物在 target/release/）
cargo check              # 只检查类型不生成二进制（最快反馈，开发高频）
```

```text
hello/
├── Cargo.toml           # 项目说明书（对标 package.json）
└── src/
    └── main.rs          # 源码
```

## 1.4 Cargo.toml 与依赖（crate）

```toml
# Cargo.toml
[package]
name = "hello"
version = "0.1.0"
edition = "2021"                # 语言版本（2021 edition 主流）

[dependencies]
serde = { version = "1", features = ["derive"] }    # 第三方 crate：serde（序列化）
```

```bash
cargo add serde --features derive    # 命令行添加依赖（写进 Cargo.toml）
cargo build                          # 首次构建自动从 crates.io 下载依赖
```

- **crate** = Rust 的包单位（对标 npm package / Java 的 jar）
- **crates.io** = 官方仓库（对标 npmjs.com）
- `Cargo.lock` = 版本锁定（对标 package-lock.json）

## 1.5 编辑器：rust-analyzer

**VS Code + rust-analyzer 扩展**（官方推荐）：

```text
实时类型推断、跳转定义、行内错误提示、自动补全——
Rust 编译器报错以"教学级详细"著称：错误信息会告诉你怎么改，
配合 rust-analyzer 几乎是"编译器手把手教写代码"。
```

## 1.6 语法预览：眼熟三件事

```rust
fn main() {                              // fn 声明函数（同 Go）
    let x: i32 = 42;                     // let 绑定变量；类型后置
    let y = 3.14;                        // 类型推断

    if x > 40 {                          // 条件必须是 bool（无隐式转换）
        println!("大数字");
    }

    for i in 0..5 {                      // range 循环：0,1,2,3,4（含头不含尾）
        println!("{}", i);
    }

    // 宏调用带感叹号：println! / vec! / assert_eq! —— 不是函数，是编译期展开
    let v = vec![1, 2, 3];
    println!("{:?}", v);                 // {:?} 调试格式
}
```

先眼熟三件事：**`!` 宏调用**、**类型后置**、**表达式导向**（`if` 是表达式，能返回值——第 2 章讲）。

## 1.7 动手：第一个 cargo 项目

```bash
cargo new guess && cd guess
```

```rust
// src/main.rs
use std::io;                             // use 导入（对标 import）

fn main() {
    println!("猜数字游戏！");

    let mut guess = String::new();       // mut = 可变（默认不可变！第 2 章展开）
    io::stdin()
        .read_line(&mut guess)           // &mut：可变引用（第 4 章展开）
        .expect("读取输入失败");          // 失败即退出并显示信息

    println!("你猜的是：{}", guess.trim());
}
```

```bash
cargo run
```

四个关键词先混脸熟：`mut`（可变性）、`&mut`（可变引用）、`.expect()`（错误处理）、`use`（导入）——它们是理解 Rust 的四把钥匙。

## 本章小结

- Rust = 性能与内存安全兼得；所有权机制编译期验证
- rustup 管工具链、cargo 管一切（new/build/run/check/add）
- crate/crates.io/Cargo.lock 对标 npm 生态
- 报错信息教学级详细；rust-analyzer 是编辑器标配
