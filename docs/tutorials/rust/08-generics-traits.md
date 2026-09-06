---
title: 泛型与 trait
---

# 第 8 章 · 泛型与 trait

**本章目标：**

- 掌握泛型函数与泛型结构体
- 理解 trait：Rust 的"接口"与标准能力层
- 学会 trait bound 与 derive 的关系

## 8.1 泛型：类型的形参

```rust
// 泛型函数
fn largest<T: PartialOrd>(list: &[T]) -> &T {     // T: PartialOrd 是约束
    let mut max = &list[0];
    for item in list {
        if item > max {                            // 能比较大小 = 需要约束
            max = item;
        }
    }
    max
}

largest(&[1, 5, 3]);        // T = i32
largest(&["a", "z"]);       // T = &str
```

```rust
// 泛型结构体
struct Pair<T> {
    first: T,
    second: T,
}

impl<T> Pair<T> {                        // impl<T>：方法块也要声明 T
    fn new(first: T, second: T) -> Self {
        Self { first, second }
    }
}

// 只给特定类型加方法：impl Pair<i32>（类型特化）
impl Pair<i32> {
    fn sum(&self) -> i32 {
        self.first + self.second
    }
}
```

与 TS 的 `<T extends {...}>` 完全同构——Rust 的约束用 trait 表达。

## 8.2 trait：行为的契约

**trait（特征）**= 接口 + 默认方法 + 运算符能力的统一体：

```rust
pub trait Summary {
    fn author(&self) -> String;                    // 必须实现的方法

    fn preview(&self) -> String {                  // 默认实现（可不覆写）
        format!("作者：{}", self.author())
    }
}

struct Article {
    title: String,
    author: String,
}

impl Summary for Article {                         // 隐式实现（无 implements 关键字）
    fn author(&self) -> String {
        self.author.clone()
    }
    // preview 用默认实现
}

struct Tweet { user: String }

impl Summary for Tweet {
    fn author(&self) -> String {
        format!("@{}", self.user)
    }

    fn preview(&self) -> String {                  // 覆写默认实现
        format!("推文：{}", self.author())
    }
}
```

与 Go 接口一样是**隐式实现**；与 Java 接口一样有默认方法——Rust 取两者之长。

## 8.3 trait bound：约束的三种写法

```rust
// ① impl Trait 语法（简洁，最常用）
fn notify(item: &impl Summary) {                   // "任何实现了 Summary 的"
    println!("{}", item.preview());
}

// ② 泛型 bound 语法（与 ① 等价，多约束时更清晰）
fn notify2<T: Summary + Debug>(item: &T) {         // 多个 trait 用 +
    println!("{:?} / {}", item, item.preview());
}

// ③ where 子句（约束多时最可读）
fn process<T, U>(a: T, b: U) -> String
where
    T: Summary + Clone,
    U: Debug,
{
    format!("{:?} / {:?}", a, b)
}
```

**select-your-own convention**: 参数用 `impl Trait`、结构体字段与返回类型用泛型约束、复杂签名用 where。

## 8.4 返回 trait 对象 vs 泛型

```rust
// 返回 impl Summary：仍是"某种具体类型"（静态分发，第 11 章对照）
fn make_post() -> impl Summary {
    Tweet { user: String::from("tom") }
}

// trait 对象 dyn Summary：运行时多态（容器里放多种类型）
fn show_all(items: &[Box<dyn Summary>]) {
    for item in items {
        println!("{}", item.preview());
    }
}

let items: Vec<Box<dyn Summary>> = vec![
    Box::new(Tweet { user: String::from("a") }),
    Box::new(Article { title: String::from("t"), author: String::from("b") }),
];
```

| | `impl Trait` / 泛型 | `dyn Trait`（trait 对象） |
| --- | --- | --- |
| 分发 | 编译期（零开销） | 运行时（虚表 vtable） |
| 类型统一 | 各分支同类型 | 不同类型共存 |
| 代价 | 代码膨胀（单态化） | 动态分发开销 |

**默认泛型（快）；异构容器用 `Box<dyn Trait>`**。

## 8.5 常用标准 trait 速览

```rust
// Debug：{:?} 打印（derive 自动）
// Clone/Copy：复制语义（第 3 章）
// PartialEq/Eq：比较
// Hash：做 HashMap 键（需先 Eq）
// Default：默认值
// Display：{} 打印（手动实现，给用户看）
// Ord/PartialOrd：排序比较

// 运算符重载也是 trait！
use std::ops::Add;

#[derive(Debug, Clone, Copy, PartialEq)]
struct Vec2 { x: f64, y: f64 }

impl Add for Vec2 {
    type Output = Vec2;                              // 关联类型
    fn add(self, other: Vec2) -> Vec2 {
        Vec2 { x: self.x + other.x, y: self.y + other.y }
    }
}

let v = Vec2 { x: 1.0, y: 2.0 } + Vec2 { x: 3.0, y: 4.0 };   // 运算符就是 trait 的糖
```

## 8.6 derive 与常用宏的关系

```rust
#[derive(Debug, Clone, PartialEq, Default)]
struct Config {
    timeout: u64,                                    // Default 给 0
    enabled: bool,                                   // false
    name: String,                                    // ""
}

// derive 是"标准库替你写的实现"——自定义 trait 也能通过第三方宏派生
// （thiserror/serde 的 derive 就是这个机制，第 7/13 章）
```

## 8.7 综合练习：面积统计器（trait + 泛型 + 动态分发）

```rust
use std::fmt;

trait Shape: fmt::Display {                          // trait 继承：Shape 也要求 Display
    fn area(&self) -> f64;
}

#[derive(Debug)]
struct Circle { radius: f64 }

impl fmt::Display for Circle {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "圆(半径={})", self.radius)
    }
}

impl Shape for Circle {
    fn area(&self) -> f64 {
        std::f64::consts::PI * self.radius * self.radius
    }
}

#[derive(Debug)]
struct Rect { w: f64, h: f64 }

impl fmt::Display for Rect {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "矩形({}×{})", self.w, self.h)
    }
}

impl Shape for Rect {
    fn area(&self) -> f64 {
        self.w * self.h
    }
}

fn main() {
    let shapes: Vec<Box<dyn Shape>> = vec![          // 异构：动态分发
        Box::new(Circle { radius: 2.0 }),
        Box::new(Rect { w: 3.0, h: 4.0 }),
    ];

    for s in &shapes {
        println!("{} → 面积 {:.2}", s, s.area());    // Display + Shape 两能力
    }

    let total: f64 = shapes.iter().map(|s| s.area()).sum();
    println!("总面积 {:.2}", total);
}
```

## 本章小结

- 泛型 + trait bound；`impl Trait` 简洁、where 可读
- trait 隐式实现 + 默认方法；运算符/比较/打印全是 trait
- 静态分发（泛型/impl Trait）零开销 vs 动态分发（dyn Trait）异构
- thiserror/serde 的 derive 是同一机制
