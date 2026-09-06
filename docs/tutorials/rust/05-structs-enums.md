---
title: 结构体与枚举
---

# 第 5 章 · 结构体与枚举

**本章目标：**

- 掌握结构体的三种形态与更新语法
- 学会用 impl 定义方法（关联函数）
- 理解枚举携带数据与 Option

## 5.1 结构体：数据聚合

```rust
struct User {
    username: String,
    email: String,
    active: bool,
}

// 创建（所有字段必须全部显式赋值）
let user = User {
    username: String::from("tom"),
    email: String::from("t@x.com"),
    active: true,
};

// 更新：不可变结构体的字段单独可变（需要 mut 绑定）
let mut user = user;
user.email = String::from("new@x.com");

// 结构体更新语法：.. 拷贝剩余字段（未 move 的字段仍可用）
let user2 = User {
    email: String::from("copy@x.com"),
    ..user                     // 其余字段从 user 搬（String 会 move！）
};
// user.username 已被 move，user.email 可用（未被搬）

// 元组结构体：字段不具名
struct Point(i32, i32);
struct Meters(f64);
let p = Point(3, 5);
p.0

// 单元结构体：无字段（标记类型）
struct AlwaysEqual;
```

## 5.2 方法：impl 块

```rust
#[derive(Debug)]                       // 派生调试打印（标准库帮实现）
struct Rectangle {
    width: f64,
    height: f64,
}

impl Rectangle {                       // impl：给类型挂方法
    // 关联函数（没有 self）：构造器惯例叫 new
    fn new(width: f64, height: f64) -> Self {
        Self { width, height }         // Self = 本类型；字段简写（名同值）
    }

    // 方法：第一个参数 &self（不可变借用，第 4 章）
    fn area(&self) -> f64 {
        self.width * self.height
    }

    // &mut self：需要修改自身
    fn scale(&mut self, factor: f64) {
        self.width *= factor;
        self.height *= factor;
    }

    // self（拿走所有权）：转为其他类型的场景才用（少见）
    fn into_tuple(self) -> (f64, f64) {
        (self.width, self.height)
    }
}

let mut rect = Rectangle::new(3.0, 4.0);    // :: 调关联函数
println!("{}", rect.area());                // . 调方法（自动借用）
rect.scale(2.0);
println!("{:?}", rect);                     // Rectangle { width: 6.0, height: 8.0 }
```

三种 self 的对照（对应第 3/4 章所有权）：

| 签名 | 语义 | 类比 |
| --- | --- | --- |
| `&self` | 只读借用 | Java 普通方法 |
| `&mut self` | 可变借用 | 修改内部状态 |
| `self` | 拿走所有权 | 构建新值/消费型转换 |

## 5.3 枚举：携带数据的变体

第 2 章预览过——枚举是 Rust 建模的核心武器：

```rust
enum Message {
    Quit,                                  // 无数据
    Move { x: i32, y: i32 },               // 匿名字段
    Write(String),                         // 携带一个值
    ChangeColor(i32, i32, i32),            // 携带元组
}

impl Message {
    fn describe(&self) -> String {
        match self {                       // 第 6 章的模式匹配
            Message::Quit => "退出".to_string(),
            Message::Move { x, y } => format!("移动到 ({}, {})", x, y),
            Message::Write(text) => format!("写入 {}", text),
            Message::ChangeColor(r, g, b) => format!("颜色 rgb({},{},{})", r, g, b),
        }
    }
}
```

## 5.4 Option：没有 null 的世界

Rust **没有 null**——"可能没有值"用标准库枚举 `Option<T>` 表达：

```rust
enum Option<T> {                  // 标准库定义（T 是泛型，第 8 章）
    Some(T),                      // 有值
    None,                         // 没值
}

// 到处都是它
let numbers = vec![1, 3, 5];
let first = numbers.first();      // Option<&i32> —— 可能是 None！

// 取值必须"显式处理两种情况"
match first {
    Some(&n) => println!("第一个是 {}", n),
    None => println!("空列表"),
}

// 常用方法链
let n = numbers.first().copied().unwrap_or(0);   // 有值取值，没值给默认
let n2 = numbers.first().copied().expect("列表不应为空");   // None 时 panic（确定不该为空时）
```

::: info Option vs Java/TS 的 null
Java 的 null 是"隐形炸弹"——任何引用都可能突然是 null（NPE 运行时爆炸）。
Rust：**类型系统强制区分"一定有值"（T）与"可能有值"（Option\<T\>）**——想用 T 的方法必须先拆开 Option（编译器盯着）。空指针这一类 bug 从语言层面消失。
:::

## 5.5 derive：自动实现常用 trait

```rust
#[derive(Debug, Clone, PartialEq)]      // 编译器生成实现
struct Task {
    id: u64,
    text: String,
    done: bool,
}

let t1 = Task { id: 1, text: String::from("x"), done: false };
let t2 = t1.clone();                    // Clone：显式深拷贝（第 3 章）
t1 == t2;                               // PartialEq：值比较（对照第 9 章 trait）
println!("{:?}", t1);                   // Debug：{:?} 格式
```

常用 derive 一览：

```text
Debug     {:?} 打印      Clone      显式深拷贝
Copy      隐式按位拷贝    PartialEq  == 比较
Eq        全等（哈希键需要）Hash      可做 HashMap 键
Default   全零值构造      Ord        排序比较
```

## 5.6 综合练习：任务管理器建模

```rust
#[derive(Debug, Clone, PartialEq)]
enum Status {
    Todo,
    Doing,
    Done,
}

#[derive(Debug, Clone)]
struct Task {
    id: u64,
    text: String,
    status: Status,
}

impl Task {
    fn new(id: u64, text: &str) -> Self {
        Task { id, text: text.to_string(), status: Status::Todo }
    }

    fn finish(&mut self) {
        self.status = Status::Done;
    }

    fn summary(&self) -> String {
        let mark = match self.status {
            Status::Done => "✓",
            Status::Doing => "…",
            Status::Todo => " ",
        };
        format!("[{}] #{} {}", mark, self.id, self.text)
    }
}

fn main() {
    let mut tasks = vec![
        Task::new(1, "学所有权"),
        Task::new(2, "学借用"),
    ];
    tasks[0].finish();
    for t in &tasks {
        println!("{}", t.summary());
    }
    // [✓] #1 学所有权
    // [ ] #2 学借用
}
```

struct + enum + impl + Vec 遍历——Rust 业务建模的标准组合。

## 本章小结

- 结构体更新语法 `..`；元组结构体适合轻量包装
- impl 块：`::new` 关联函数 + `&self/&mut self/self` 三种方法
- enum 变体携带数据；Option\<T\> 取代 null（编译期强制处理）
- derive 自动实现 Debug/Clone/PartialEq 等
