---
title: Rust 教程
---

# Rust 教程

> 状态：可学习 · 共 15 章 · 预计 14 小时

Rust 是系统级语言的现代答案：**没有 GC 却内存安全**（所有权机制在编译期消灭空指针与数据竞争）、性能对标 C/C++、工具链体验对标现代语言。它连续多年霸榜"最受喜爱语言"，正快速进入后端、CLI 与基础设施领域。本教程从所有权讲到并发与测试，尾部以 CLI 实战和 Axum Web 服务收尾。

## 前置教程

- [VS Code 教程](/tutorials/vscode/)：编辑器与 rust-analyzer 扩展配置
- [Git 教程](/tutorials/git/)：代码版本管理

## 章节目录

1. [第 1 章 · 初识 Rust](./01-intro)
2. [第 2 章 · 变量、类型与流程控制](./02-basic-syntax)
3. [第 3 章 · 所有权](./03-ownership)
4. [第 4 章 · 借用与引用](./04-borrowing)
5. [第 5 章 · 结构体与枚举](./05-structs-enums)
6. [第 6 章 · 模式匹配](./06-pattern-matching)
7. [第 7 章 · 错误处理](./07-error-handling)
8. [第 8 章 · 泛型与 trait](./08-generics-traits)
9. [第 9 章 · 生命周期](./09-lifetimes)
10. [第 10 章 · 集合、闭包与迭代器](./10-collections-closures-iterators)
11. [第 11 章 · 智能指针与内部可变性](./11-smart-pointers)
12. [第 12 章 · 模块系统与测试](./12-modules-testing)
13. [第 13 章 · 并发编程](./13-concurrency)
14. [第 14 章 · 综合实战：CLI 工具](./14-cli-project)
15. [第 15 章 · Axum 初见：Web 服务](./15-axum-web)

## 你将学到

- cargo 工具链与 crate 生态
- 所有权、借用与生命周期（Rust 的灵魂）
- 结构体/枚举/模式匹配与 Result 错误处理
- 泛型与 trait、闭包与迭代器、智能指针与内部可变性
- 模块划分与测试组织、线程/通道/共享状态并发
- CLI 工程实战与 Axum Web 服务初见
