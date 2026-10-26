---
title: "第 10 章 · 集合、闭包与迭代器"
description: "第 3 章 · 所有权 说明 String、Vec<T>、HashMap 都是堆上、拥有所有权、可增长的容器。这一节把操作补齐。"
series: rust
sidebar:
  order: 10
  label: "集合、闭包与迭代器"
difficulty: advanced
duration: 5
---

**本章目标：**

- 用熟 Vec / String / HashMap 的日常操作与容量语义
- 分清闭包的 Fn / FnMut / FnOnce 三档捕获规则与 `move` 的时机
- 理解迭代器的 `next` 协议与惰性，能读懂并写出适配器链

## 10.1 三个常用集合

[第 3 章 · 所有权](./03-ownership/) 说明 `String`、`Vec<T>`、`HashMap` 都是堆上、拥有所有权、可增长的容器。这一节把操作补齐。

```rust
let mut v: Vec<i32> = Vec::new();
v.push(1);
v.push(2);                                   // 追加

let mut v2 = vec![3, 7, 1];                  // vec! 宏初始化
v2.sort();                                   // 原地排序 → [1, 3, 7]
let first = v2.remove(0);                    // 删除并返回该元素 → 1
v2.retain(|&x| x != 7);                      // 按条件保留（闭包见 10.2）

let x = v2.get(9);                           // 越界返回 None —— 业务代码首选
let total: i32 = v2.iter().sum();            // 空迭代器求和得 0，不会 panic
```

```rust
// v2[9] 会直接 panic：下标访问不返回 Option
// 只有能证明下标合法时才用 []
let safe = v2.first().copied();              // Option<i32>，空表也不炸
```

容量与增长的语义值得单独记住：`len` 是已存元素数，`capacity` 是已申请的槽位数，
`push` 触发扩容时按倍数申请，所以单次 `push` 的**摊还**成本是 O(1)，但会一次搬完全部元素。

```rust
let mut buf = Vec::with_capacity(1000);      // 规模已知就预留，省掉反复 realloc 与拷贝
println!("len={} cap={}", buf.len(), buf.capacity());
```

`String` 的三个坑都在切片上：

```rust
let mut s = String::from("中文");
s.push('!');                                 // push 收 char
s.push_str("? 尾巴");                        // push_str 收 &str
let owned: String = s.clone() + "尾部";      // `+` 夺取左侧所有权，所以左边不能再用

let head = &s[..3];                          // 按字节切：中文一个字 3 字节，切在中间会 panic
let two_chars: String = s.chars().take(2).collect();   // 按字符切才稳妥
println!("{} | {}", head, two_chars);
```

HashMap 的惯用法集中在 `entry`：

```rust
use std::collections::HashMap;

let mut scores: HashMap<String, i32> = HashMap::new();
scores.insert(String::from("Alice"), 90);
scores.insert(String::from("Bob"), 85);

scores.get("Alice");                         // Option<&i32>：可以用 &str 借查 String 键
*scores.entry(String::from("Bob")).or_insert(0) += 1;   // 累加一行式

let names: Vec<&String> = scores.keys().collect();
let total: i32 = scores.values().sum();
println!("{:?} 总分 {}", names, total);
```

:::caution[HashMap 两个老问题]
① 键必须同时实现 `Eq + Hash`（[第 5 章 · derive](./05-structs-enums/) 里给自定义类型 derive 过），所以 `f64` 不能直接做键；
② 拿着 `keys()`/`values()` 的迭代器时不能再 `insert`，不可变借用与可变借用打架，编译器直接拒收。
:::

## 10.2 闭包：能捕获环境的匿名函数

```rust
let factor = 3;
let scale = |x| x * factor;                  // 捕获所在作用域的变量，类型可省
println!("{}", scale(10));                   // 30

fn apply_twice(f: impl Fn(i32) -> i32, x: i32) -> i32 {   // 函数参数位收闭包
    f(f(x))
}
println!("{}", apply_twice(|x| x + 1, 5));                // 7
```

与普通函数的三点区别：

- 能捕获周围变量，函数只能通过参数拿数据
- 每个闭包是编译器**生成的匿名类型**（所以返回闭包要走 `impl Fn` 或 `Box<dyn Fn>`）
- 参数与返回类型通常可推断，只在推断失败时标注

```rust
let nums = vec![1, 2, 3];
let doubled: Vec<i32> = nums.iter().map(|x| x * 2).collect();   // 闭包 + 迭代器的日常形态
```

## 10.3 Fn / FnMut / FnOnce 与 move

编译器按闭包**怎么用捕获的变量**决定它实现哪个 trait，三档是一条继承链：
`Fn: FnMut`、`FnMut: FnOnce`，也就是 Fn 最宽松。

```rust
// 只读捕获 → Fn，可反复调用
let name = String::from("Rust");
let greet = || println!("Hello, {}", name);
greet();
greet();                                     // 借用只读，随便调
```

```rust
// 修改捕获 → FnMut，闭包绑定本身必须是 mut
let mut count = 0;
let mut bump = || { count += 1; count };
bump();
bump();                                      // 2
```

```rust
// 吃掉捕获（移动/丢弃它）→ FnOnce，只能调用一次
let once = String::from("一次性");
let consume = move || once;                  // 把所有权交出
let v: String = consume();
// consume();                               // ❌ 已被消耗
```

`move` 的作用不是"闭包变成 FnOnce"，而是**在创建闭包那一刻就把捕获值的所有权搬进闭包**。
最典型的必需场景是让闭包比当前作用域活得久：

```rust
fn make_counter() -> impl FnMut() -> usize {
    let mut n = 0;
    move || { n += 1; n }        // 不加 move：闭包借用局部变量 n，返回时 n 已失效
}

fn main() {
    let mut c = make_counter();
    println!("{} {}", c(), c());             // 1 2
}
```

:::tip[何时必须写 move]
闭包要被**转移出当前作用域**时：从函数返回、交给 `thread::spawn`（[第 13 章 · 并发](./13-concurrency/)）、
存进结构体字段。这三类报错的措辞几乎都含 `closure may outlive the current function`，看到就先试 `move`。
:::

## 10.4 Iterator 与 next 协议

集合侧有三个入口，区别就在所有权上：

```rust
let mut v = vec![1, 2, 3];

for x in v.iter() { }            // Item = &i32，借用，v 之后还能用
for x in v.iter_mut() { }        // Item = &mut i32，需要 mut v，可原地改
for x in v.into_iter() { }       // Item = i32，夺走所有权，v 到此结束
```

`Iterator` trait 本身只有一个必须实现的方法（关联类型见 [第 8 章](./08-generics-traits/)）：

```rust
pub trait Iterator {
    type Item;
    fn next(&mut self) -> Option<Self::Item>;   // 唯一的"必须"，其余方法都有默认实现
}
```

`for` 循环就是反复 `next()` 直到 `None` 的语法糖，手动走一遍最清楚：

```rust
let v = vec![1, 2, 3];
let mut it = v.iter();
assert_eq!(it.next(), Some(&1));
assert_eq!(it.next(), Some(&2));
assert_eq!(it.next(), Some(&3));
assert_eq!(it.next(), None);                    // 耗尽之后永远返回 None
```

:::danger[迭代器是一次性的]
适配器不消耗集合，但**返回的那个迭代器对象已被推进**。同一个 `it` 不能遍历两遍，
想再来一次要么重新 `v.iter()`，要么先 `collect` 成容器。
:::

惰性（lazy）是迭代器的灵魂：不消费就一行都不算。

```rust
let v = vec![1, 2, 3];
let mapped = v.iter().map(|x| {
    println!("处理 {}", x);      // 这一行定义时完全不执行
    x * 2
});
let sum: i32 = mapped.sum();     // 消费的一刻才逐个拉动 → 打印 处理 1 / 2 / 3
```

## 10.5 常用适配器速查

```rust
let nums = vec![1, 2, 3, 4, 5, 6, 7, 8];

let evens_x10: Vec<i32> = nums.iter()
    .filter(|&&x| x % 2 == 0)    // iter() 给 &i32，filter 再给 &&i32，所以写 |&&x|
    .map(|x| x * 10)             // 此处 Item 已是 &i32，*10 自动解引用
    .collect();                  // [10, 30, 50, 70]

let head: Vec<&i32> = nums.iter().take(3).collect();
let tail: Vec<&i32> = nums.iter().skip(5).collect();

for (i, w) in "one two three".split_whitespace().enumerate() {
    println!("{} → {}", i, w);
}

let a = vec![1, 2, 3];
let b = vec!["一", "二", "三"];
let paired: Vec<(&i32, &str)> = a.iter().zip(b.iter().copied()).collect();   // zip 长度取较短者
```

`chain` 要求两边 **Item 类型完全相同**，这是最常见的编译错误来源：

```rust
let a = vec![1, 2, 3];
let b = vec![4, 5];
let all: Vec<&i32> = a.iter().chain(b.iter()).copied().collect();   // 同为 &i32，可以串
```

嵌套结构摊平用 `flat_map`：

```rust
let rows = vec![vec![1, 2], vec![3, 4], vec![5]];
let flat: Vec<i32> = rows.iter().flat_map(|row| row.iter().copied()).collect();   // [1,2,3,4,5]
```

| 适配器 | 作用 | 要注意 |
| --- | --- | --- |
| `map(f)` | 逐个变形 | Item 类型可以换 |
| `filter(f)` | 按谓词保留 | 闭包参数比 Item 多一层引用 |
| `take(n)` / `skip(n)` | 取前 n / 跳前 n | 配合排序做 Top-N |
| `enumerate()` | 加下标 | Item 变 `(usize, T)` |
| `zip(other)` | 并排配对 | 长度取较短者 |
| `chain(other)` | 串接 | Item 类型必须相同 |
| `flat_map(f)` | 映射后摊平一层 | 嵌套集合首选 |
| `copied()` / `cloned()` | `&T` 迭代器 → `T` | 省掉满屏 `*x` |
| `rev()` / `inspect(f)` | 反向 / 窥视不改值 | `inspect` 是链式调试利器 |

## 10.6 消费器与自定义迭代器

消费器真正驱动 `next` 走完整个序列：

```rust
let words = vec!["apple", "fig", "banana", "cherry"];

println!("{}", words.iter().count());                        // 4
println!("{}", words.iter().map(|w| w.len()).sum::<usize>()); // 21
println!("{}", words.iter().map(|w| w.len()).max().unwrap()); // 6（先映射再比较，避开多层引用）
println!("{:?}", words.iter().max_by_key(|w| w.len()));      // Some("cherry")

let joined = words.iter()
    .fold(String::new(), |mut acc, w| { acc.push_str(w); acc.push(' '); acc });
println!("{}", joined.trim());
```

`collect` 是最特殊的消费器：目标类型靠推断决定，可以收进 `Vec`、`HashMap`、`String`，
甚至 `Result<Vec<T>, E>`——[第 7 章 · 错误处理](./07-error-handling/) 里 `collect::<Result<Vec<_>, _>>()`
的"任一失败就短路"就来自这个 impl。

自己实现迭代器只需要写 `next`，`map`/`filter`/`fold` 全部白送：

```rust
struct CountDown {
    n: u32,
}

impl Iterator for CountDown {
    type Item = u32;

    fn next(&mut self) -> Option<u32> {
        if self.n == 0 {
            None
        } else {
            self.n -= 1;
            Some(self.n + 1)
        }
    }
}

fn main() {
    let seq: Vec<u32> = CountDown { n: 3 }.collect();
    let odd: Vec<u32> = CountDown { n: 10 }.filter(|x| x % 2 == 1).collect();
    println!("{:?} / {:?}", seq, odd);        // [3, 2, 1] / [9, 7, 5, 3, 1]
}
```

外部迭代与内部迭代的分野值得记住，它解释了为什么 Rust 的链式组合如此自然：

```text
外部迭代（pull）：next() 由消费方驱动 —— 能 break、能惰性、能任意组合适配器
内部迭代（push）：forEach 由库驱动循环 —— 循环体只是回调，控制流受限
Rust 标准库选外部迭代：一切皆 Iterator，零成本抽象靠的是这套统一协议
```

## 10.7 综合练习：词频 Top N

把本章全部串起来：统计 → 排序 → 取前 N → 拼接输出。

```rust
use std::collections::HashMap;

fn word_frequencies(text: &str) -> Vec<(String, usize)> {
    let mut counts: HashMap<String, usize> = HashMap::new();
    for word in text.split_whitespace() {
        let clean: String = word.chars()
            .filter(|c| c.is_alphanumeric() || *c == '-')
            .collect();
        if !clean.is_empty() {
            *counts.entry(clean.to_lowercase()).or_insert(0) += 1;
        }
    }
    let mut pairs: Vec<(String, usize)> = counts.into_iter().collect();
    pairs.sort_by(|a, b| b.1.cmp(&a.1).then_with(|| a.0.cmp(&b.0)));   // 次数降序，词名升序
    pairs
}

fn top_text(text: &str, n: usize) -> String {
    word_frequencies(text)
        .into_iter()
        .take(n)
        .map(|(w, c)| format!("{}×{}", w, c))
        .collect::<Vec<_>>()
        .join("  ")
}

fn main() {
    let text = "to be or not to be that is the question";
    println!("Top 3: {}", top_text(text, 3));
}
```

```text
Top 3: be×2  to×2  is×1
```

链上每一步的所有权都要留意：`counts.into_iter()` 夺走 HashMap（之后不能再用它），
`collect::<Vec<_>>()` 把 `(String, usize)` 落到可排序的容器里，`take(n)` 之后才 `map` 成字符串——
先过滤再格式化，避免给被丢弃的元素做无用功。

:::tip[HashMap 是无序的]
`for` 出来的顺序不保证稳定，Top-N 必须先 `collect` 到 `Vec` 再 `sort_by`。
想要有序遍历就换 `BTreeMap`（`std::collections::BTreeMap`，键自然有序）。
:::

## 本章小结

- Vec/HashMap 优先用 `get`/`entry` 而不是下标与"先查再插"；`with_capacity` 在规模已知时值得写
- 闭包按用法自动选 Fn/FnMut/FnOnce；闭包要离开当前作用域就必须 `move`
- 迭代器只有一个必写方法 `next`，适配器惰性、消费器才真正干活，且迭代器一次性
- 数据处理的标准节奏是 `iter → filter/map → take/sort → collect/fold`，链式顺序影响性能
