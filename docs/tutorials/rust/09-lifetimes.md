---
title: 生命周期
---

# 第 9 章 · 生命周期

**本章目标：**

- 理解生命周期标注要解决的真问题：引用的有效范围
- 掌握函数、结构体、impl 块三种位置的 `'a` 写法与省略规则
- 能判断一个类型该「拥有数据」还是「借用数据」

## 9.1 从一段编译不过的代码开始

[第 3 章 · 所有权](./03-ownership) 里立过的规矩：引用不能比它指向的数据活得久。把这条规矩推到函数上，就会遇到新麻烦：

```rust
fn invalid() -> &str {          // ❌ 编译错误：缺少生命周期标注
    let s = String::from("临时值");
    &s
}
```

这段代码错在返回局部变量的引用，任何标注都救不了它——数据在函数结束时就被 drop 了。
但编译器为什么不直接接受 `-> &str`？因为函数签名里没有局部变量，只有**传进来的引用和返回的引用**，编译器需要知道它们之间的寿命关系：

```rust
fn first_word(s: &str) -> &str {      // 签名里两个 &str，谁保证谁？
    let bytes = s.as_bytes();
    for (i, &b) in bytes.iter().enumerate() {
        if b == b' ' {
            return &s[..i];
        }
    }
    s
}
```

写 `&str` 时其实是省略写法：`&'x str`，那个 `'x` 就是生命周期。
调用的时候不用管它，编译器会自己填；需要标注的场景是「省略规则推不出来」的时候。

## 9.2 函数签名里的 `'a`

生命周期参数不是"让引用活得更久"，而是**一份约束声明**：告诉编译器，返回的引用与参数的存活期绑在一起。

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {   // 'a 是形参的名字
    if x.len() > y.len() { x } else { y }
}

fn main() {
    let s1 = String::from("长长的字符串");
    let s2 = String::from("短");
    let result = longest(&s1, &s2);
    println!("最长的是 {}", result);      // ✅ result 借用 s1/s2，二者仍在作用域内
}
```

把生命周期写进签名的效果体现在调用点。下面这个用法会被同一个签名挡下：

```rust
fn main() {
    let result;
    {
        let s2 = String::from("短");     // s2 在这个块结束时被 drop
        let s1 = String::from("长长的字符串");
        result = longest(&s1, &s2);      // 'a 被收缩成两个参数中较短的寿命
    }
    println!("{}", result);              // ❌ 借用错误：result 可能指向已释放内存
}
```

::: danger 生命周期是"契约"不是"处方"
标注只能**描述**已有借用关系的边界，不能延长任何变量的寿命。
如果编译器报 `missing lifetime specifier`，含义通常是：返回的引用无法确定该跟哪个输入绑定——
这时候正确的反应是改设计（返回拥有所有权的 `String`），而不是补一个 `'a`。
:::

## 9.3 结构体持有引用

结构体可以只存引用，代价是结构体实例不能比它引用的数据活得久：

```rust
struct Excerpt<'a> {              // 'a 出现在类型名上：这个类型带着借用的账
    part: &'a str,
}

fn main() {
    let novel = String::from("第一句话。第二句话。");
    let excerpt;
    {
        let s = String::from("Call me Ishmael. Some years ago...");
        let first = s.split_whitespace().next().unwrap();
        excerpt = Excerpt { part: first };   // ❌ s 在块结束时 drop，excerpt 还在用
    }
    println!("{}", excerpt.part);
}
```

把内层块去掉就正常了：`excerpt` 与 `s` 同生死，`s` 比 `excerpt` 活得久即可。

经验法则与 [第 5 章 · 结构体与枚举](./05-structs-enums) 呼应：

```rust
struct Owner {                    // 拿不准就拥有：没有生命周期参数，字段随便搬
    part: String,
}
```

::: tip 什么时候值得用带引用的结构体
只在**性能敏感 + 数据不拥有权明确**的场景：解析器切片、临时视图、只读缓存。
业务代码里的结构体优先存 `String`/`Vec<T>`，因为带 `'a` 的类型名会一路传染到函数签名和 trait 实现上。
:::

## 9.4 生命周期省略三规则

大多数签名不用标注，因为编译器能按三条静态规则推出唯一答案（不查任何运行期信息）：

```rust
fn first(s: &str) -> &str { ... }
// 规则 1：每个引用参数各自拿到一个生命周期 → fn first<'a>(s: &'a str) -> &'a str

fn longest(x: &str, y: &str) -> &str { ... }
// 规则 2：只有一个输入生命周期时，它赋给所有输出 → 这条能救 first，救不了 longest（两个输入）

impl Calendar { fn add(&self, s: &str) -> &str { ... } }
// 规则 3：方法里有 &self 时，self 的生命周期赋给所有输出
```

```rust
// 规则 1 的副作用：这两个引用的寿命无关，所以可以一个长一个短
fn count_words(text: &str, sep: &str) -> usize {
    text.split(sep).count()
}
```

推不出来时报错的形式固定是 `expected one named lifetime parameter`。补 `'a` 即可，但先问自己：
返回的到底该跟哪个参数？如果答案是"看分支"，那这就是 9.2 的坑。

## 9.5 `'static`

`'static` 表示这份数据在整个程序运行期间都有效，有两种常见出现场景，含义完全不同。

```rust
let s: &'static str = "字符串字面量";   // 场景一：字面量被编进二进制，永远有效

fn leak_me() {
    let v: Vec<i32> = vec![1, 2, 3];
    std::mem::forget(v);               // 故意不释放，才敢转成 'static
}
```

```rust
fn spawnable<T: Send + 'static>(_t: T) {}   // 场景二：约束"T 内部不含短命引用"
```

::: warning `T: 'static` 不等于"必须是静态数据"
它说的是这个类型**自身拥有全部数据**（`String`、`i32`、`Vec<u8>` 都满足），
而不是"值必须活在静态区"。`&'static str` 与 `T: 'static` 是两码事，混淆会让线程相关的报错难以看懂。
:::

## 9.6 impl 块与方法上的生命周期

结构体带了 `'a`，impl 就得接住它：

```rust
struct Text<'a> {
    content: &'a str,
}

impl<'a> Text<'a> {                 // 先声明 'a，再在类型名上用它
    fn new(content: &'a str) -> Self {
        Text { content }
    }

    fn words(&self) -> impl Iterator<Item = &'a str> {   // 输出绑到 'a，而非 &self
        self.content.split_whitespace()
    }

    fn head(&self) -> &str {        // 规则 3：省略后等价于 &'_ self → &'_ str
        self.content.split_whitespace().next().unwrap_or("")
    }
}

fn main() {
    let t = String::from("a b c");
    let view = Text::new(&t);
    let total = view.words().count();
    println!("{} 个词，首词 {}", total, view.head());
}
```

`words` 为什么必须写 `'a`？返回的 `&str` 指向 `content`，而 `content` 的寿命是 `'a`，
比 `&self` 的借用期长。写成省略形式（返回 `&str`）会被限制成只能在 `view` 存活期内使用。

泛型与生命周期可以叠加（[第 8 章 · 泛型与 trait](./08-generics-traits)）：

```rust
fn longest3<'a, T>(x: &'a T, y: &'a T) -> &'a T
where
    T: PartialOrd,
{
    if x > y { x } else { y }
}
```

## 9.7 多个生命周期与 `'a: 'b`

当一个函数涉及两份不同寿命的借用，就各自命名；需要表达"a 至少和 b 一样长"时用**生命周期约束**：

```rust
fn pick<'a, 'b>(a: &'a str, b: &'b str) -> &'a str {
    a                                   // ✅ 只返回 a，与 b 无关，合法
}

fn either<'a: 'b, 'b>(a: &'a str, b: &'b str, flag: bool) -> &'b str {
    if flag { a } else { b }            // 'a: 'b 保证 a 至少活到 b 的寿命，才能一起返回 &'b str
}

fn main() {
    let long = String::from("长");
    let result;
    {
        let short = String::from("短");
        result = either(&long, &short, true);
        println!("{}", result);          // ✅ 块内使用，short 仍存活
    }
}
```

读法：`'a: 'b` = 「`'a` outlives `'b`」。泛型 + 生命周期的完整形态通常写成 `where` 子句，比挤在尖括号里可读：

```rust
fn merge<T, U>(a: T, b: U) -> String
where
    T: std::fmt::Display,
    U: std::fmt::Display,
{
    format!("{a} / {b}")
}
```

## 9.8 综合练习：只读文本视图

实现一个「取第一行」的视图类型，全程借用不拷贝：

```rust
struct FirstLine<'a> {
    line: &'a str,
}

impl<'a> FirstLine<'a> {
    fn of(text: &'a str) -> Self {
        let line = text.split('\n').next().unwrap_or("");
        FirstLine { line }
    }

    fn words(&self) -> usize {
        self.line.split_whitespace().count()
    }

    fn is_empty(&self) -> bool {
        self.line.is_empty()
    }
}

fn summarize<'a>(views: &[FirstLine<'a>]) -> String {
    let mut parts: Vec<String> = Vec::new();
    for v in views {
        parts.push(format!("{}词", v.words()));
    }
    parts.join(", ")
}

fn main() {
    let doc1 = String::from("第一行 有三个词\n第二行");
    let doc2 = String::from("another line here\nrest");
    let views = vec![FirstLine::of(&doc1), FirstLine::of(&doc2)];
    println!("{:?}", summarize(&views));        // ["3词", "3词"] 的等价输出：3词, 3词
    println!("空? {}", views[0].is_empty());
}
```

三个自查点，覆盖了本章全部陷阱：

- `summarize` 里 `v.words()` 返回 `usize`（拷贝），没有把 `&'a str` 漏出函数作用域
- `FirstLine::of(&doc1)` 借的是 `doc1`，两个 `String` 都必须活得比 `views` 久
- 把 `line` 改成 `String` 就能去掉 `'a`——代价是一次堆拷贝，这是设计选择而非对错

::: tip 决策顺序
需要返回引用时依次问：① 能不能返回拥有所有权的值（`String`/`Vec`）？② 能不能用 `impl Iterator` 之类内部迭代？
③ 都不行，才引入 `'a`；一旦引入，类型名就会带上它，尽量只让最外层的视图类型带生命周期。
:::

## 本章小结

- 生命周期标注是描述借用关系的契约，不能延长任何数据的寿命
- 结构体带 `'a` 意味着实例不能比数据活得久，业务类型优先拥有数据
- 省略三规则解释了为什么多数签名不用写 `'a`；推不出来才需要手写
- `'static` 有两种含义，`T: 'static` 说的是"不含短命引用"；多生命中用 `'a: 'b` 表达 outlives
