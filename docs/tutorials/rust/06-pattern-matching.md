---
title: 模式匹配
---

# 第 6 章 · 模式匹配

**本章目标：**

- 掌握 match 的穷尽性与解构能力
- 熟练 if let / while let 的简洁写法
- 学会 @ 绑定、守卫与组合模式

## 6.1 match：穷尽性的 switch

```rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value(coin: &Coin) -> u32 {
    match coin {                     // match 表达式：能返回值
        Coin::Penny => 1,            // 分支末尾无分号 = 返回值
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }                                // ❌ 少写一个变体 = 编译错误！
}
```

**穷尽性（exhaustiveness）**：match 必须覆盖所有可能——枚举加新变体后，所有 match 处编译器立刻标红（对照 Java switch：漏 case 只会静默走 default）。这把"枚举 + match"变成**可演进的健壮建模**。

通配符与兜底：

```rust
match value {
    1 => "一",
    2 | 3 => "二三",                  // 或模式
    4..=9 => "四到九",                // 范围模式
    _ => "其他",                      // _：兜底（必须放最后）
}
```

## 6.2 解构：模式撕开数据结构

match 的模式不止匹配值，还**绑定内部数据**：

```rust
// 枚举解构（第 5 章的 Message）
match msg {
    Message::Move { x, y } => move_to(x, y),
    Message::Write(text) => println!("{}", text),
    Message::Quit => quit(),
}

// 元组解构
let point = (3, -2);
match point {
    (0, y) => println!("在 Y 轴，y={}", y),
    (x, 0) => println!("在 X 轴，x={}", x),
    (x, y) => println!("({},{})", x, y),
}

// 嵌套解构
match msg {
    Message::ChangeColor(r, g, b) if r == 0 => println!("无红色"),   // 守卫
    Message::ChangeColor(r, g, b) => set_color(r, g, b),
    _ => {}
}
```

## 6.3 守卫（guard）：条件附加

```rust
let n = 5;
match n {
    x if x < 0 => println!("负数"),
    x if x == 0 => println!("零"),
    x if x % 2 == 0 => println!("偶数 {}", x),
    x => println!("奇数 {}", x),      // 捕获的值可继续使用
}
```

守卫在模式后加 `if 条件`——匹配模式后再验条件，不满足则继续尝试下一分支。

## 6.4 @ 绑定：匹配的同时捕获

```rust
match age {
    n @ 1..=12 => println!("儿童（{} 岁）", n),      // 范围匹配 + 绑定
    n @ 13..=17 => println!("青少年（{} 岁）", n),
    n => println!("成人（{} 岁）", n),
}
```

## 6.5 if let：单分支的简洁写法

只需要处理一种模式时，match 显得啰嗦——**if let**：

```rust
// match 版
let maybe = Some("hello");
match maybe {
    Some(text) => println!("{}", text),
    _ => {}                       // 只为满足穷尽性
}

// if let 版
if let Some(text) = maybe {       // 模式 = 表达式
    println!("{}", text);
}

// 带else
if let Some(text) = maybe {
    println!("{}", text);
} else {
    println!("没有值");
}

// while let：持续解构（迭代器模式）
let mut stack = vec![1, 2, 3];
while let Some(top) = stack.pop() {
    println!("{}", top);          // 3 2 1（空了返回 None，退出循环）
}
```

## 6.6 解构赋值与 let 模式

```rust
// let 也是模式匹配！
let (x, y) = (1, 2);                          // 元组解构
let (a, _, c) = (1, 2, 3);                    // _ 忽略
let [first, .., last] = [1, 2, 3, 4];        // 数组首尾（数组模式）
let (a @ 1, b) = (1, 2);                      // @ 绑定
let Some(v) = Some(42) else {                 // let-else（1.65+）：不匹配就提前退出
    return;                                    // else 分支必须发散（return/panic）
};
println!("{}", v);                             // 此后 v 确定存在
```

## 6.7 综合练习：JSON 值解析器

```rust
// 用枚举 + match 实现迷你 JSON 值模型（真实 serde 库的思想原型）
#[derive(Debug)]
enum Json {
    Null,
    Bool(bool),
    Number(f64),
    Str(String),
    Array(Vec<Json>),
    Object(Vec<(String, Json)>),
}

impl Json {
    fn type_name(&self) -> &'static str {
        match self {
            Json::Null => "null",
            Json::Bool(_) => "boolean",
            Json::Number(_) => "number",
            Json::Str(_) => "string",
            Json::Array(_) => "array",
            Json::Object(_) => "object",
        }
    }

    fn stringify(&self) -> String {
        match self {
            Json::Null => "null".to_string(),
            Json::Bool(b) => b.to_string(),
            Json::Number(n) => n.to_string(),
            Json::Str(s) => format!("{:?}", s),
            Json::Array(items) => {
                let parts: Vec<String> = items.iter().map(|j| j.stringify()).collect();
                format!("[{}]", parts.join(","))
            }
            Json::Object(pairs) => {
                let parts: Vec<String> = pairs
                    .iter()
                    .map(|(k, v)| format!("{:?}:{}", k, v.stringify()))
                    .collect();
                format!("{{{}}}", parts.join(","))
            }
        }
    }
}

fn main() {
    let json = Json::Object(vec![
        ("name".to_string(), Json::Str("Rust".to_string())),
        ("stars".to_string(), Json::Number(96.0)),
        ("tags".to_string(), Json::Array(vec![
            Json::Str("safe".to_string()),
            Json::Str("fast".to_string()),
        ])),
    ]);
    println!("{}", json.stringify());
    // {"name":"Rust","stars":96,"tags":["safe","fast"]}
}
```

枚举建模 + match 穷尽 + 递归解构——Rust 处理"结构化未知数据"的标准范式（第 13 章实战的 serde 就是它的工业级版本）。

## 本章小结

- match 穷尽性让枚举演进安全；`_` 兜底、`|` 或、`..=` 范围
- 模式可解构：枚举字段/元组/嵌套；守卫加条件；@ 绑定值
- if let / while let 处理单模式场景；let-else 提前退出
- let 本身就是模式匹配——解构无处不在
