---
title: "第 11 章 · 智能指针与内部可变性"
description: "第 4 章 · 借用与引用 里的 &T 只是\"看一眼\"；智能指针拥有数据、能移动、离开作用域自动清理，并且实现 Deref trait——于是能像普通引用一样调用内部类型的方法。先亲手做一个最小的："
series: rust
sidebar:
  order: 11
  label: "智能指针与内部可变性"
difficulty: advanced
duration: 5
---

**本章目标：**

- 理解 `Deref` 与自动解引用，会用 `Box` 组织堆数据（递归类型、trait 对象）
- 掌握 `Rc` 共享所有权与 `RefCell` 内部可变性，以及两者的组合 `Rc<RefCell<T>>`
- 识别循环引用导致的内存泄漏，会用 `Weak` 破环；顺带认识 `Cow` 与 `Drop`

## 11.1 智能指针与 Deref：像引用一样用

[第 4 章 · 借用与引用](./04-borrowing/) 里的 `&T` 只是"看一眼"；**智能指针**拥有数据、能移动、离开作用域自动清理，并且实现 `Deref` trait——于是能像普通引用一样调用内部类型的方法。先亲手做一个最小的：

```rust
use std::ops::Deref;

struct MyBox<T>(T);                      // 元组结构体：包裹一个值

impl<T> MyBox<T> {
    fn new(x: T) -> MyBox<T> { MyBox(x) }
}

impl<T> Deref for MyBox<T> {
    type Target = T;                     // 关联类型：解引用后得到什么
    fn deref(&self) -> &T { &self.0 }    // 返回内部数据的引用
}

fn hello(name: &str) { println!("你好, {name}!"); }   // 参数明明是 &str

fn main() {
    let m = MyBox::new(String::from("Rust"));
    hello(&m);                           // &MyBox<String> → &String → &str：连续自动解引用
}
```

`hello(&m)` 能编译靠的是 **Deref 强制转换**：函数调用处沿 `Deref` 链一路转换到目标类型。方法查找同理——`m.len()` 在 `MyBox` 上找不到 `len`，就解引用到 `String` 再找。

## 11.2 Box：把值搬到堆上（递归类型）

`Box<T>` = "值在堆上，指针在栈上"。第一个经典用途是补上[第 5 章 · 结构体与枚举](./05-structs-enums/) 的坑：**递归类型大小编译期无法确定**，必须装箱：

```rust
enum List {
    Cons(i32, Box<List>),                // 不装箱：Cons 套 Cons 无限展开，编译报错
    Nil,                                 // 装箱后：节点 = i32 + 指针，大小固定
}
use List::{Cons, Nil};

fn sum(list: &List) -> i32 {
    match list {
        Cons(v, next) => v + sum(next),  // next: &Box<List>，调用处自动解引用成 &List
        Nil => 0,
    }
}

fn main() {
    let list = Cons(1, Box::new(Cons(2, Box::new(Cons(3, Box::new(Nil))))));
    println!("元素和 = {}", sum(&list)); // 6
}
```

第二个用途回顾[第 8 章 · 泛型与 trait](./08-generics-traits/)：`dyn Trait` 大小编译期未知，异构容器必须装箱——

```rust
let shapes: Vec<Box<dyn Shape>> = vec![Box::new(Circle { radius: 2.0 })];
println!("{:.2}", shapes[0].area());     // 经两次自动解引用调到方法
```

:::tip[Box 何时用]
值太大、转移所有权又不想整块拷贝；trait 对象；递归类型。这三类之外 `Box` 并不神奇，别为装箱而装箱。
:::

## 11.3 Rc：同一份数据的多个所有者

所有权规则说"一个值只有一个所有者"（[第 3 章 · 所有权](./03-ownership/)）。树/图这类结构确实需要多处共享同一份只读数据时，用 `Rc<T>`（Reference Counter）：克隆只加一次计数，计数归零才释放。

```rust
use std::rc::Rc;

enum RcList {
    Cons(i32, Rc<RcList>),               // 尾部节点可被多个列表共享
    Nil,
}
use RcList::{Cons, Nil};

fn main() {
    let a = Rc::new(Cons(5, Rc::new(Cons(10, Rc::new(Nil)))));
    println!("创建后计数 = {}", Rc::strong_count(&a));    // 1
    let _b = Cons(3, Rc::clone(&a));     // 共享 a：计数 +1
    let _c = Cons(4, Rc::clone(&a));     // 再共享：计数 +1
    println!("共享后计数 = {}", Rc::strong_count(&a));    // 3
}                                        // 作用域结束计数减回 0，堆内存释放
```

`Rc::clone(&a)` 与 `a.clone()` 效果相同，但前者一眼看出"只加计数、不深拷贝"，是社区惯例。

:::caution[Rc 是单线程的]
`Rc` 的计数加减不带原子操作，多线程环境编译直接拒绝——线程间共享所有权是并发章 `Arc`（原子引用计数）的活。
:::

`Rc` 只解决"多所有者"，不解决"所有者想改"：`Rc<T>` 对外永远是 `&T`，借用规则卡死写入。要改，请出下一位。

## 11.4 RefCell：内部可变性——把借用检查搬到运行期

[第 4 章 · 借用与引用](./04-borrowing/) 的"多个 `&` 或一个 `&mut`，编译器判定"是**静态**的。`RefCell<T>` 把同一套规则改在**运行期**执行：每次借用记一个计数，违规不报编译错而是当场 panic。代价换来的是——拿着 `&self` 也能改内部数据（**内部可变性**）。

```rust
use std::cell::RefCell;

fn main() {
    let cell = RefCell::new(vec![1, 2, 3]);
    {
        let r1 = cell.borrow();          // 只读借用，可同时存在多个
        let r2 = cell.borrow();
        println!("{r1:?} {r2:?} 长度 {}", r1.len());
    }                                    // r1/r2 离开作用域，读借用计数归零
    cell.borrow_mut().push(4);           // 独占写借用（同一时刻只允许一个）
    println!("追加后 = {:?}", cell.borrow());
}
```

:::danger[panic 从编译期挪到了运行期]
`RefCell` 没有消灭借用规则，只是推迟执行：`let _w = data.borrow_mut(); data.borrow();` 会当场 panic 而非编译报错。用它就要对 borrow 冲突负责——确认旧借用的作用域已结束。
:::

典型场景正是"签名只有 `&self`，内部却要动缓存/计数器"：

```rust
struct Cache { hits: RefCell<u32> }      // 对外只暴露 &self，内部照样能写
impl Cache {
    fn record(&self) { *self.hits.borrow_mut() += 1; }   // 借用检查推迟到运行期
    fn hits(&self) -> u32 { *self.hits.borrow() }
}
```

## 11.5 `Rc<RefCell<T>>`：共享 + 可变的组合拳

分工记忆：**`Rc` 管"谁拥有"，`RefCell` 管"能不能改"**。单独 `Rc` 不能改、单独 `RefCell` 不能多方共享，套起来是最常用的一对：

```rust
use std::cell::RefCell;
use std::rc::Rc;

fn main() {
    let shared = Rc::new(RefCell::new(vec![String::from("启动")]));
    shared.borrow_mut().push(String::from("服务A 就绪"));  // 通过 & 也能写
    let snapshot = shared.borrow().join("\n");             // 读借用结束于语句末尾

    let another = Rc::clone(&shared);    // 第二个所有者，指向同一份 Vec
    another.borrow_mut().push(String::from("服务B 就绪"));
    println!("快照:{}\n最新:\n{}", snapshot, shared.borrow().join("\n"));
    println!("持有者 = {}", Rc::strong_count(&shared));    // 2
}
```

这也是让 trait 对象"活起来"的常见形态：`Vec<Rc<RefCell<dyn Trait>>>`——多所有者、可就地修改、运行时多态一次满足。

## 11.6 循环引用与 Weak；Cow 与 Drop 掠影

`Rc` 最危险的用法是"你指我、我指你"：两个节点互指，强计数永远 ≥ 1，**编译全部通过，内存静静泄漏**。破环靠 `Weak<T>`——只观察、不养活的引用。

```rust
use std::cell::RefCell;
use std::rc::{Rc, Weak};

#[derive(Debug)]
struct Node {
    value: i32,
    children: RefCell<Vec<Rc<Node>>>,    // 父 → 子：强引用（父亲养活孩子）
    parent: RefCell<Weak<Node>>,         // 子 → 父：弱引用（回指不减弱就泄漏）
}

fn main() {
    let leaf = Rc::new(Node { value: 3, children: RefCell::new(vec![]), parent: RefCell::new(Weak::new()) });
    let branch = Rc::new(Node { value: 5, children: RefCell::new(vec![Rc::clone(&leaf)]), parent: RefCell::new(Weak::new()) });
    *leaf.parent.borrow_mut() = Rc::downgrade(&branch);    // 建弱回指，不加计数

    if let Some(p) = leaf.parent.borrow().upgrade() { println!("父亲值 = {}", p.value); }  // Weak → Option<Rc<T>>：先验活
    println!("branch 强/弱 = {}/{}", Rc::strong_count(&branch), Rc::weak_count(&branch));  // 1/1
}   // 作用域结束：branch 计数归零释放，leaf 随之归零——Weak 不阻碍回收
```

:::danger[全强引用成环 = 静默泄漏]
强计数不会因为节点已不可达而下降，析构永远不执行。经验法则：所有权单向（父指子用 `Rc`），回指一律 `Weak`，用前 `upgrade()` 判活。
:::

顺带认识两位同族：`Cow<T>`（Clone-on-Write：能借用就借用，要改才克隆）与 `Drop`（析构钩子，RAII 的清扫端）：

```rust
use std::borrow::Cow;

fn slugify(s: &str) -> Cow<str> {
    if s.contains(' ') { Cow::Owned(s.replace(' ', "-")) }  // 需要改：才分配
    else { Cow::Borrowed(s) }                               // 不用改：零拷贝借用
}

struct Guard;
impl Drop for Guard { fn drop(&mut self) { println!("释放资源"); } }   // 离开作用域自动执行

fn main() {
    println!("{}", slugify("hello world"));   // hello-world
    println!("{}", slugify("rust"));          // rust（借用原串，无分配）
    let _g = Guard;
    println!("准备离开作用域");                // 下一行输出：释放资源
}
```

`Drop` 不手动调用，它保证"无论从哪条路径退出作用域（包括第 7 章的错误路径），清理都发生"。

## 11.7 综合练习：共享计数器（多所有者写同一值）

把本章两块拼图合起来：一个可克隆分发、但所有副本写同一份计数的结构。

```rust
use std::cell::RefCell;
use std::rc::Rc;

#[derive(Clone)]
struct SharedCounter {
    count: Rc<RefCell<u32>>,             // Rc 负责共享所有权，RefCell 负责可写
}

impl SharedCounter {
    fn new() -> Self { Self { count: Rc::new(RefCell::new(0)) } }
    fn increment(&self) {                // 三个方法都只需要 &self
        let mut c = self.count.borrow_mut();   // 写借用显式进出作用域
        *c += 1;
    }
    fn value(&self) -> u32 { *self.count.borrow() }
    fn owners(&self) -> usize { Rc::strong_count(&self.count) }
}

fn main() {
    let base = SharedCounter::new();
    base.increment();                    // 1
    let worker = base.clone();           // 同一份 count，多一个所有者
    worker.increment();
    worker.increment();                  // 3
    println!("worker 视角 = {}", worker.value());
    {
        let tmp = base.clone();
        tmp.increment();                 // 4
        println!("临时持有者存在时 = {}", base.owners());  // 3：base/worker/tmp
    }                                    // tmp 释放，强计数 -1
    println!("最终值 = {}，剩余所有者 = {}", base.value(), base.owners());  // 4，2：写入留在共享数据里
}
```

要点复盘：`clone` 复制的只是指针（计数 +1），数据始终一份；写入靠 `borrow_mut` 在运行期独占；所有者减少不丢数据，计数归零才释放。

## 本章小结

- `Deref` 让智能指针像引用一样用；`Box` 上堆，解锁递归类型与 `Box<dyn Trait>` 异构容器
- `Rc` 多所有者共享（只读、单线程）；`RefCell` 把借用检查搬到运行期，`&self` 也能写
- `Rc<RefCell<T>>` = 共享 + 可变；全强引用成环静默泄漏，回指用 `Weak` + `upgrade`
- `Cow` 按需分配省拷贝，`Drop` 保证作用域退出必清理
