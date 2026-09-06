---
title: 所有权
---

# 第 3 章 · 所有权

**本章目标：**

- 理解所有权三规则与移动（move）语义
- 掌握 Copy 类型与 Clone 的区别
- 建立"值有唯一主人"的心智模型

## 3.1 内存管理三条路

```text
手动管理（C/C++）：malloc/free 手动配对 → 快，但悬空指针/泄漏是灾难
垃圾回收（Java/Go/Python）：运行时扫描回收 → 安全，但有停顿与开销
所有权（Rust）：编译期静态分析，规则不符直接编译失败 → 快且安全
```

**所有权（ownership）**是 Rust 的灵魂：没有 GC，内存的分配与释放**由编译器在编译期静态确定**——每个值恰好在作用域结束时释放。

## 3.2 三条铁律

```text
① Rust 中每个值都有一个"所有者"（owner）
② 同一时刻，值只能有一个所有者
③ 所有者离开作用域，值被"丢弃"（drop），内存立即释放
```

```rust
{
    let s = String::from("hello");   // s 是所有者；堆内存分配
    // ... 使用 s
}                                    // 作用域结束 → drop(s) 自动调用 → 内存立即释放
```

类比：**每个值是一个"苹果"，变量是"拿着苹果的手"**——一只手拿一个苹果；手松开（离开作用域），苹果被吃掉（drop）。

## 3.3 移动（move）：赋值 = 转移所有权

```rust
let s1 = String::from("hello");
let s2 = s1;                       // 所有权从 s1 移动到 s2！

println!("{}", s1);                // ❌ 编译错误：borrow of moved value: s1
println!("{}", s2);                // ✅ s2 是新主人
```

为什么这么设计？看 `String` 的结构：

```text
String ≈ [指针 → 堆数据, 长度, 容量]

如果浅拷贝指针：s1 与 s2 指向同一块堆内存
→ 作用域结束时会被 drop 两次 → 二次释放（double free）！
→ Rust 的解法：拷贝时直接"移动"所有权，旧变量立即失效
```

**没有深拷贝的性能开销，也没有二次释放的安全风险**——编译期一次静态检查全部搞定。

## 3.4 Copy 类型：栈上的值不走 move

不是所有类型都 move——**简单栈值默认按位拷贝（Copy trait）**：

```rust
let x = 5;
let y = x;              // 拷贝（i32 实现 Copy）
println!("{}", x);      // ✅ x 依然有效！

// Copy 类型：所有整数/浮点/bool/char、由 Copy 类型组成的元组/数组
// 非 Copy：String、Vec、Box 等"拥有堆数据"的类型
```

直觉：**栈上小值拷贝便宜 → Copy；堆上数据拷贝昂贵 → move**。

## 3.5 函数传参：同样遵循 move

```rust
fn take(s: String) {          // 参数接收 = 所有权转移给函数
    println!("{}", s);
}                             // s 在这里被 drop

fn main() {
    let s = String::from("hello");
    take(s);                  // 所有权交了出去
    println!("{}", s);        // ❌ 已 move，编译错误！
}
```

想"用了还想用"？两条路：

```rust
// 路线①：Clone 显式深拷贝（有性能代价）
let s2 = s.clone();           // 新的堆副本
take(s2);
println!("{}", s);            // ✅ 原值还在

// 路线②：借用（&引用）——不转移所有权（第 4 章主角）
fn peek(s: &String) {         // 只借不拿
    println!("{}", s);
}
peek(&s);
println!("{}", s);            // ✅
```

## 3.6 函数返回值：所有权交还

```rust
fn make_string() -> String {
    String::from("built here")     // 局部值移动给调用方（无拷贝）
}

let s = make_string();             // s 接收所有权

// 多值返回：元组
fn swap(s: String) -> (String, usize) {
    let len = s.len();             // 先取长度
    (s, len)                       // 一起交还
}
let (s2, len) = swap(String::from("hello"));
```

**Rust 的所有权流向**：传入（move）→ 处理 → 返回（move 回来）。编译器全程追踪，任何一处"用了已交出的值"都过不了编译。

## 3.7 所有权与 drop 顺序

```rust
struct Badge(&'static str);

impl Drop for Badge {              // Drop trait：自定义释放逻辑
    fn drop(&mut self) {
        println!("丢弃 {}", self.0);
    }
}

fn main() {
    let _a = Badge("A");
    let _b = Badge("B");
    println!("main 结束");
}
// 输出顺序：main 结束 → 丢弃 B → 丢弃 A（逆序释放，栈规则）
```

`impl Drop` 让自定义类型接入"离开作用域自动清理"——RAII（Resource Acquisition Is Initialization）思想的 Rust 实现（C++ 教程第 6 章会对照讲）。

## 3.8 编译器的"教学时刻"

```rust
let s = String::from("hi");
let t = s;
s.push_str("!");   // 编译错误原文：

// error[E0382]: borrow of moved value: `s`
//   --> src/main.rs:4:5
//    |
// 2  |     let s = String::from("hi");
//     |         - move occurs because `s` has type `String`, ...
// 3  |     let t = s;
//     |             - value moved here
// 4  |     s.push_str("!");
//     |     ^ value borrowed here after move
// help: consider cloning the value if allocating performance is not critical
//     |
// 3  |     let t = s.clone();
//     |              ++++++++
```

错误信息自带**原因（move occurs）+ 位置（三处标注）+ 修复建议（clone）**——被报错"教育"的过程就是学所有权的过程，人人如此。

## 3.9 综合练习：所有权流向追踪

```rust
fn main() {
    // 逐行预测哪些会编译失败，再运行验证
    let s1 = String::from("A");
    let s2 = s1;                        // move：s1 失效
    // println!("{}", s1);              // ❌

    let n1 = 5;
    let n2 = n1;                        // Copy：n1 有效
    println!("{} {}", n1, n2);          // ✅

    let s3 = give_back(String::from("B"));
    println!("{}", s3);                 // ✅ 所有权回来了

    let arr = [1, 2, 3];                // Copy（i32 数组）
    let arr2 = arr;
    println!("{:?} {:?}", arr, arr2);   // ✅

    let vec = vec![String::from("C")];  // 非 Copy（内含 String）
    let vec2 = vec;
    // println!("{:?}", vec);           // ❌ move
    println!("{:?}", vec2);             // ✅
}

fn give_back(s: String) -> String { s }
```

## 本章小结

- 三铁律：唯一所有者 / move 转移 / 离开作用域 drop
- 栈值 Copy、堆值 move；Clone 是显式深拷贝（有代价）
- 函数传参与返回都在"搬运所有权"；借用（&）不转移（第 4 章）
- 编译报错教学级详细——报错即学习
