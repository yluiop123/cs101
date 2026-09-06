---
title: 借用与引用
---

# 第 4 章 · 借用与引用

**本章目标：**

- 理解借用（borrowing）不转移所有权
- 掌握不可变引用与可变引用的规则
- 学会识别并修复"借用检查器"报错

## 4.1 为什么需要借用

第 3 章的困境：函数用一下数据就得交出所有权：

```rust
fn length(s: String) -> usize {
    s.len()
}                                   // s 在这里被 drop！

let s = String::from("hello");
let len = length(s);
println!("{}", s);                  // ❌ 所有权已经没了
```

每次传参都 move，写业务会疯掉。解法：**借用（borrowing）**——用 `&` 创建引用，"借来用但不拿走"：

```rust
fn length(s: &String) -> usize {    // 参数类型：&String（借用）
    s.len()
}

let s = String::from("hello");
let len = length(&s);               // 传引用（借出去）
println!("{} 的长度是 {}", s, len); // ✅ 所有权还在手里
```

引用 = 指针的安全版（编译器保证**永远指向有效数据**——悬空指针在编译期即被拒绝）。

## 4.2 不可变引用：可以同时多个

```rust
let s = String::from("hello");

let r1 = &s;         // 不可变引用：只读
let r2 = &s;         // ✅ 多个不可变引用共存（都在"看书"，互不干扰）
let r3 = &s;         // ✅

println!("{} {} {}", r1, r2, r3);
```

类比：**不可变引用 = 图书馆的阅览室**——任意多人同时看书，谁都不能改书。

## 4.3 可变引用：同一时刻只能一个

```rust
let mut s = String::from("hello");

let r1 = &mut s;     // 可变引用：需要 s 本身是 mut
r1.push_str("!");

// let r2 = &mut s;  // ❌ 编译错误：second mutable borrow
// println!("{}", s);// ❌ 借用期间原变量不可用

println!("{}", r1);  // 借用结束后才能再用 s
```

类比：**可变引用 = 独占的编辑权**——一次只有一个人能改。

### 核心规则：读写不共存

```text
规则：同一作用域内
  多个不可变引用 ✅（多读）
  一个可变引用   ✅（独写）
  可变 + 不可变  ❌（写时不能有读者！）
```

为什么这么严？**数据竞争（data race）**的定义就是"多个指针访问同一数据 + 至少一个写 + 无同步"——Rust 的规则让数据竞争在**编译期**不可能发生（Java/Go 里要靠运行时锁与工具检测）。

```rust
let mut s = String::from("hello");

let r1 = &s;              // 不可变借用开始
let r2 = &mut s;          // ❌ 与 r1 的借用重叠
println!("{} {}", r1, r2);
```

修复：**缩小借用作用域**（NLL，非词法作用域——借用"最后一次使用"后即结束）：

```rust
let mut s = String::from("hello");

let r1 = &s;
println!("{}", r1);       // r1 最后一次使用 → 借用到此结束
let r2 = &mut s;          // ✅ 与 r1 不再重叠
r2.push_str("!");
```

## 4.4 悬空引用：编译期直接拒绝

```rust
fn dangle() -> &String {
    let s = String::from("hello");
    &s                // 返回局部值的引用
}                     // s 被释放 → 引用指向已释放内存！

// ❌ 编译错误：cannot return reference to local variable
// Rust 不允许悬空引用 —— 想返回就转移所有权：
fn no_dangle() -> String {
    String::from("hello")    // ✅ move 出去
}
```

C/C++ 里这是运行时灾难；Rust 里是编译错误——**内存安全的杀手锏**。

## 4.5 引用作为参数：设计惯用法

```rust
// 参数优先收"借用"而非所有权
fn print_len(s: &String) { ... }        // 能用，但更惯用的：

// 接收 &str 更通用（String 能自动转，字面量也能传）
fn print_len2(s: &str) {
    println!("{}", s.len());
}

print_len2(&s);          // String → &str 自动解引用转换
print_len2("literal");   // 字面量直接传 ✅
```

**参数类型选型**（从宽到窄）：

```text
只读                  → &T（不可变借用）
需要修改              → &mut T（可变借用）
需要拥有/存起来/返回  → T（所有权）
```

## 4.6 切片：引用的"部分视图"

```rust
// 字符串切片：&str 本身就是 String 的部分借用
let s = String::from("hello world");
let hello = &s[0..5];        // "hello"（字节下标）
let world = &s[6..11];       // "world"
let whole = &s[..];          // 全部

fn first_word(s: &str) -> &str {        // 收 &str 最通用
    for (i, ch) in s.char_indices() {
        if ch == ' ' {
            return &s[..i];
        }
    }
    s
}

// 切片借用保护：底层数据变动时借用检查器拦截
let mut s2 = String::from("hello");
let word = first_word(&s2);
// s2.clear();                  // ❌ word 还在借用
println!("{}", word);           // 借用结束后 clear 才合法
```

数组/Vec 同理：`&v[1..3]` 是切片 `&[T]`。

## 4.7 综合练习：修复借用错误

```rust
// 练习：让下面的代码通过编译（三种修法）
fn main() {
    let mut scores = vec![90, 85, 78];

    // 修法①：先算完再改
    let max_ref = scores.iter().max();     // 不可变借用
    println!("最高分 {:?}", max_ref);       // 借用到此结束
    scores.push(95);                       // ✅ 可变操作

    // 修法②：直接拿值不用引用
    let max_value = *scores.iter().max().unwrap();
    scores.push(88);
    println!("最高分 {}", max_value);

    // 修法③：把可变操作放借用之前
    let sum: i32 = scores.iter().sum();
    scores = scores.into_iter().map(|x| x + 1).collect();   // into_iter 拿走所有权
    println!("总分 {}，加一后 {:?}", sum, scores);
}
```

## 本章小结

- `&` 借用不转移所有权；引用永远指向有效数据（无悬空）
- 多读 ✅、独写 ✅、读写共存 ❌——数据竞争编译期消灭
- NLL：借用持续到最后一次使用，不是到块结束
- 参数选型：读 `&T`、改 `&mut T`、拥有 `T`；字符串参数优先 `&str`
