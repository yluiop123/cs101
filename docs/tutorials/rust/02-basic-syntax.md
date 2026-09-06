---
title: 变量、类型与流程控制
---

# 第 2 章 · 变量、类型与流程控制

**本章目标：**

- 理解不可变默认与 shadowing
- 掌握基本类型与表达式导向的控制流
- 会用枚举与元组组织数据

## 2.1 不可变默认与 shadowing

```rust
let x = 5;
x = 6;              // ❌ 编译错误：cannot assign twice to immutable variable

let mut y = 5;      // mut 声明可变（显式 opt-in）
y = 6;              // ✅

// shadowing（遮蔽）：同名重新绑定，类型可以变！
let spaces = "   ";     // &str
let spaces = spaces.len();   // usize —— "覆盖"而不是"修改"（原值未变，新绑定生效）
```

**设计哲学**：默认不可变让并发与推理更安全；需要变化时显式 `mut`——编译器错误信息会主动提示"考虑加 mut"。

**shadowing vs mut**：shadowing 能换类型（"复用名字"），mut 只是改值。

## 2.2 基本类型

```rust
// 整数：i8/i16/i32/i64/i128/isize 与 u8/.../usize（有/无符号）
let a: i32 = -42;              // i32 默认（不标注时的推断首选）
let b: u8 = 255;               // 上限 255
let big = 1_000_000;           // 数字下划线分隔（纯可读性）

// 浮点：f32/f64（默认 f64）
let pi = 3.14159_f64;

// 布尔与字符
let ok = true;
let c = '中';                  // char 是 4 字节 Unicode（Java 的 char 只有 2 字节）

// 元组：固定长度异构集合
let point: (i32, f64) = (3, 0.5);
let (x, y) = point;            // 解构
point.0                        // 按下标访问

// 数组：固定长度同类型（栈上）
let arr = [1, 2, 3];
let zeros = [0; 5];            // [0,0,0,0,0]
arr.len()

// 单元类型 ()
let nothing = ();              // "没有值"的类型（函数无返回值即返回 ()）
```

**整数溢出**：debug 构建直接 panic；release 构建回绕——别依赖回绕，用 `checked_add` 等方法显式处理。

## 2.3 字符串：两种类型

```rust
let s1: &str = "hello";              // 字符串字面量（切片引用，编译期固定）
let s2: String = String::from("hello");   // 堆上可增长字符串
let s3 = "hello".to_string();        // 等价转换

// 常用操作
s2.len();                            // 字节数（UTF-8！中文 3 字节）
s2.chars().count();                  // 字符数
s2.push_str(" world");               // 追加（需要 mut）
s2.contains("lo");
s2.replace("l", "L");
"a,b,c".split(',');                  // 迭代器
s2 + "!"                             // 拼接（注意所有权规则，第 3 章）
format!("{} 有 {} 字", "字符串", 3)   // 拼接首选（不夺取所有权）
```

::: tip &str vs String 一句话
`&str` 是"字符串切片"（借用视图）；`String` 是"拥有的字符串"（堆分配）。函数参数**优先收 `&str`**（两者都能用）；需要拥有/增长时用 `String`。所有权讲完（第 3/4 章）这里就通了。
:::

## 2.4 表达式导向：一切皆表达式

Rust 的 if/match/块**都是表达式**——能返回值：

```rust
let n = 5;
let level = if n >= 90 { "优" } else if n >= 60 { "及格" } else { "不及格" };
// ① 没有三元运算符：if 表达式直接用
// ② 分支末尾不带分号 = 表达式的值
// ③ 各分支类型必须一致

let total = {
    let a = 10;
    let b = 20;
    a + b            // 块的值 = 最后一个表达式（无分号）
};                   // 30 —— 块也是表达式
```

## 2.5 控制流

```rust
// loop：无限循环（可带返回值 break）
let mut count = 0;
let result = loop {
    count += 1;
    if count == 10 {
        break count * 2;         // break 带值 → loop 的值！
    }
};

// while
let mut n = 3;
while n > 0 {
    println!("{}", n);
    n -= 1;
}

// for + range（最常用）
for i in 0..5 { println!("{}", i) }          // 0~4
for i in (0..5).rev() { println!("{}", i) }  // 4~0
for x in [1, 2, 3] { println!("{}", x) }     // 直接遍历数组（所有权规则生效）

// 标签跳转（嵌套循环场景）
'outer: for i in 0..5 {                      // 生命周期符号 ' 也用于标签
    for j in 0..5 {
        if i * j > 10 { break 'outer; }
    }
}
```

## 2.6 枚举：变体的集合

Rust 的 enum 比 Java/Go 的强大——**每个变体可以携带数据**：

```rust
enum Shape {
    Circle { radius: f64 },          // 变体带字段
    Rectangle { w: f64, h: f64 },
    Point,                           // 变体不带数据
}

let s = Shape::Circle { radius: 2.0 };

// 与 match 搭配（第 6 章展开）
fn area(s: &Shape) -> f64 {
    match s {
        Shape::Circle { radius } => 3.14159 * radius * radius,
        Shape::Rectangle { w, h } => w * h,
        Shape::Point => 0.0,
    }
}
```

标准库的 `Option<T>`（"可能有值可能没有"）就是枚举——第 7 章它是错误处理的主角。

## 2.7 类型转换与比较

```rust
// as 显式转换（可能截断/溢出，谨慎用）
let x = 42_i32;
let y = x as i64;
let z = 3.9 as u8;          // 3（截断）

// TryFrom：安全转换（返回 Result）
let big: i64 = 300;
let small: Result<u8, _> = u8::try_from(big);    // Err：300 超出 u8

// 浮点比较：epsilon 手法
fn nearly_equal(a: f64, b: f64) -> bool {
    (a - b).abs() < 1e-9
}
```

## 2.8 综合练习：温度转换器

```rust
enum Temp {
    Celsius(f64),
    Fahrenheit(f64),
    Kelvin(f64),
}

impl Temp {                                   // impl 块：给类型挂方法（第 5 章展开）
    fn to_celsius(&self) -> f64 {             // &self：不可变借用（第 4 章）
        match self {
            Temp::Celsius(c) => *c,
            Temp::Fahrenheit(f) => (f - 32.0) * 5.0 / 9.0,
            Temp::Kelvin(k) => k - 273.15,
        }
    }
}

fn main() {
    let temps = vec![
        Temp::Celsius(25.0),
        Temp::Fahrenheit(98.6),
        Temp::Kelvin(300.0),
    ];
    for t in &temps {
        println!("{:.1}°C", t.to_celsius());
    }
}
```

enum 携带数据 + match 解构 + impl 方法——Rust 数据建模的最小闭环。

## 本章小结

- 默认不可变，mut 显式开启；shadowing 可换类型
- 一切皆表达式：if/match/块都能返回值（无三元运算符）
- &str vs String；char 是 4 字节 Unicode
- enum 变体可携带数据；`'标签` 用于嵌套循环跳转
