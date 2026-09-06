---
title: 错误处理
---

# 第 7 章 · 错误处理

**本章目标：**

- 理解 Option\<T\> 与 Result\<T, E\> 的分工
- 掌握 `?` 运算符的错误传播链
- 学会 panic 的边界与自定义错误类型

## 7.1 两种"失败"：Option 与 Result

```rust
enum Option<T> {                  // 表达"可能没有值"（第 5 章）
    Some(T),
    None,
}

enum Result<T, E> {               // 表达"可能失败"（带原因）
    Ok(T),
    Err(E),
}
```

分工：

```text
值"逻辑上可能不存在"（查找、首个元素）  → Option<T>
操作"可能失败且有原因"（读文件、解析）  → Result<T, E>
```

两者都有大量方法互通（`.ok()` 转 Result、`.ok_or()` 转 Option）。

## 7.2 手动处理：match 全家桶

```rust
use std::fs::File;
use std::io::ErrorKind;

// match 版：最完整
let file = match File::open("hello.txt") {
    Ok(f) => f,
    Err(e) => match e.kind() {
        ErrorKind::NotFound => match File::create("hello.txt") {
            Ok(fc) => fc,
            Err(e) => panic!("创建失败: {e}"),
        },
        _ => panic!("打开失败: {e}"),
    },
};

// unwrap / expect：偷懒写法（失败即 panic —— 原型代码/确定不该失败时用）
let f = File::open("hello.txt").unwrap();
let f = File::open("hello.txt").expect("hello.txt 应该存在");   // 带上下文信息
```

::: danger unwrap 是临时脚手架
`unwrap/expect` 把错误变成 panic——库代码与正式业务路径禁用，测试代码可用。
:::

## 7.3 `?` 运算符：错误传播的语法糖

```rust
use std::io::{self, Read};
use std::fs::File;

// 手动传播：层层 match
fn read_username_verbose(path: &str) -> Result<String, io::Error> {
    let mut file = match File::open(path) {
        Ok(f) => f,
        Err(e) => return Err(e),          // 把错误往上抛
    };
    let mut username = String::new();
    match file.read_to_string(&mut username) {
        Ok(_) => Ok(username),
        Err(e) => Err(e),
    }
}

// ? 运算符版：一行一个——错误自动向上抛，成功自动拆出值
fn read_username(path: &str) -> Result<String, io::Error> {
    let mut file = File::open(path)?;
    let mut username = String::new();
    file.read_to_string(&mut username)?;
    Ok(username)
}

// 链式终极版
fn read_username_short(path: &str) -> Result<String, io::Error> {
    Ok(std::fs::read_to_string(path)?)
}
```

`?` 的语义：**Ok 则拆值继续，Err 则带上下文立刻 return**——它就是 Java try-catch + Python raise 的"值形态"，但每次传播都显式可见。

## 7.4 错误转换：From trait 与 `?` 的联动

`?` 会自动调用 `From::from` 把底层错误转换成函数的返回错误类型：

```rust
use std::fmt;
use std::io;

// 自定义错误类型
#[derive(Debug)]
enum AppError {
    Io(io::Error),
    Parse(std::num::ParseIntError),
}

impl fmt::Display for AppError {          // 用户可读输出
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            AppError::Io(e) => write!(f, "IO 错误: {e}"),
            AppError::Parse(e) => write!(f, "解析错误: {e}"),
        }
    }
}

impl std::error::Error for AppError {}    // 实现 Error trait（错误类型标准协议）

impl From<io::Error> for AppError {       // From：让 ? 自动转换
    fn from(e: io::Error) -> Self {
        AppError::Io(e)
    }
}

// 现在 ? 处的 io::Error 自动变成 AppError::Io
fn load(path: &str) -> Result<i32, AppError> {
    let text = std::fs::read_to_string(path)?;      // io::Error → AppError 自动转换
    let n: i32 = text.trim().parse()?;              // ParseIntError 需要补一个 From
    Ok(n)
}
```

## 7.5 thiserror：自定义错误的工业写法

手写 From/Display 是样板——**thiserror** 宏一行搞定：

```toml
# Cargo.toml
thiserror = "1"
```

```rust
use thiserror::Error;

#[derive(Debug, Error)]
enum ApiError {
    #[error("网络请求失败: {0}")]
    Network(#[from] std::io::Error),

    #[error("状态码异常: {status}")]
    BadStatus { status: u16 },

    #[error("解析失败: {0}")]
    Parse(#[from] serde_json::Error),
}
```

派生宏自动生成 Display/From/Error 实现——**业务代码定义错误的标准姿势**。

## 7.6 panic 的边界

```rust
// panic 的正确用途：程序员的 bug（而非运行环境问题）
// ① 数组越界/unwrap None 等内置 panic —— 逻辑漏洞
// ② assert!/assert_eq! —— 断言不变量（测试主力）
// ③ unreachable! —— "理论上到不了这里"，到了就是 bug

// 业务可预期失败（用户输错、文件不存在）一律 Result —— 别 panic
```

main 可返回 `Result`（1.0 惯例的反转版）：

```rust
fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = std::fs::read_to_string("app.toml")?;    // 出错时自动打印 Debug 信息退出
    Ok(())
}
```

`Box<dyn Error>` = "任意错误类型"（trait 对象，第 8 章展开）——快速原型/CLI 的通用返回。

## 7.7 综合练习：解析器错误处理链

```rust
#[derive(Debug, thiserror::Error)]
enum ParseError {
    #[error("空输入")]
    Empty,
    #[error("第 {index} 项不是数字: {raw}")]
    NotNumber { index: usize, raw: String },
}

fn parse_ints(line: &str) -> Result<Vec<i32>, ParseError> {
    if line.trim().is_empty() {
        return Err(ParseError::Empty);
    }
    line.split_whitespace()
        .enumerate()
        .map(|(i, raw)| {
            raw.parse::<i32>()
                .map_err(|_| ParseError::NotNumber { index: i, raw: raw.to_string() })
        })
        .collect()                     // Result<Vec<_>, _>：任一 Err 即整体 Err
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    match parse_ints("10 abc 30") {
        Ok(nums) => println!("{nums:?}"),
        Err(e) => println!("解析失败: {e}"),   // 解析失败: 第 1 项不是数字: abc
    }
    Ok(())
}
```

collect 聚合 Result、map_err 转换错误、thiserror 定义层次——错误处理日常三板斧。

## 本章小结

- Option 管缺失、Result 管失败；unwrap/expect 只在原型
- `?` 拆值传播 + From 自动转换；错误链显式可见
- thiserror 定义错误类型；panic 只留给真 bug
- main 可返回 Result（`Box<dyn Error>`）
