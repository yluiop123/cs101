---
title: "第 13 章 · 并发编程"
description: "Rust 标准库直接给出操作系统线程（1:1 模型），入口只有一个；spawn 返回 JoinHandle<T>，T 就是闭包返回值类型："
series: rust
sidebar:
  order: 13
  label: "并发编程"
difficulty: advanced
duration: 6
---

**本章目标：**

- 会起线程（`spawn`/`join`），掌握**消息传递**与**共享状态**两种协作范式
- 理解 `Arc<Mutex<T>>` 为什么必须成对出现，以及 `lock().unwrap()` 的由来
- 说清 Send/Sync 如何把数据竞争挡在编译期，以及这道防线的边界

## 13.1 线程：spawn 与 join

Rust 标准库直接给出操作系统线程（1:1 模型），入口只有一个；`spawn` 返回 `JoinHandle<T>`，T 就是闭包返回值类型：

```rust
use std::thread;

fn main() {
    let data = String::from("交给线程的消息");
    let handle = thread::spawn(move || {                  // move：所有权一起搬进新线程
        println!("[子线程] {data} {:?}", thread::current().id());
        data.chars().count()                              // 闭包返回值 = 线程的产出
    });                                                   // spawn 不阻塞，主线程继续跑

    let count = handle.join().unwrap();                   // join 等结束并取回 usize
    println!("[主线程] 收到 {count} 个字符");
}
```

`join()` 返回 `Result`（子线程 panic 时是 Err，[第 7 章 · 错误处理](./07-error-handling/)的 unwrap/expect 规则同样适用）。为什么非 `move` 不可？**子线程可能比创建它的函数活得久**——借来的引用那时会悬空。所以 `spawn` 要求闭包 `Send + 'static`：自带全部数据，不引用局部变量。这条约束正是[第 3 章 · 所有权](./03-ownership/)"值有唯一主人"在线程边界的延长线。

:::caution[数据竞争的三个条件]
多个指针访问同一数据 + 至少一个在写 + 无同步。Rust 不是运行时崩给你看，而是让这种程序**编译不过**（见 13.4）。
:::

线程不免费（创建约几十微秒、各占一块栈），标准库也**没内置线程池**——常见做法是一个线程处理一整块数据，而不是一个元素起一个线程。

## 13.2 消息传递：mpsc 通道

Rust 官方第一原则："不要通过共享内存来通信，而要通过通信来共享内存。"

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();                   // 一次拿到发送端与接收端
    for i in 0..3 {
        let tx = tx.clone();                          // Sender 可克隆 → 多生产者
        thread::spawn(move || {
            tx.send(format!("线程 {i} 的消息")).unwrap();   // 发送失败 = 接收端已释放
        });
    }
    drop(tx);                                         // 关掉原始发送端，否则下面永不结束
    for msg in rx {                                   // rx 是迭代器：阻塞等待直到无人可等
        println!("收到: {msg}");                      // 顺序不确定——本来就是并发
    }
}
```

核心价值：**`send` 把值的所有权搬过线程边界**，之后原线程再也碰不到它——"两边同时改"在类型上不存在：

```rust
let (tx, rx) = mpsc::channel::<String>();             // 显式标注通道里跑什么类型
let data = String::from("交给通道");
tx.send(data).unwrap();                               // send 直接 move 走值
// println!("{data}");                                // ❌ 所有权已交出
let got = rx.recv().unwrap();                         // recv 取出唯一那个值
```

变体：`rx.try_recv()` 不阻塞（`Ok` / `Empty` / `Disconnected`）；`mpsc::sync_channel(容量)` 是有界通道，队列满时 `send` 阻塞——天然反压（backpressure）。

:::tip[接收端只有一个主人]
`Receiver` 不是 `Sync`，不能克隆给多个消费者；要多消费者就自己分发，硬套 `Arc<Mutex<Receiver<T>>>` 已经退化成 13.3 的共享状态。
:::

## 13.3 共享状态：`Arc` + `Mutex`

确实要共享的数据（进度计数、任务队列）必须两个机制**配对**：

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));            // Arc 管"多所有者"，Mutex 管"独写"
    let mut handles = vec![];
    for _ in 0..10 {
        let counter = Arc::clone(&counter);           // 每个线程一份 Arc 克隆（计数 +1）
        handles.push(thread::spawn(move || {
            let mut num = counter.lock().unwrap();    // 拿锁 → MutexGuard，可解引用成 &mut i32
            *num += 1;
        }));                                          // guard 离开作用域 → 自动 unlock
    }
    for h in handles { h.join().unwrap(); }           // 全部跑完再读，别抢在中间
    println!("结果：{}", *counter.lock().unwrap());
}
```

**为什么 `Mutex<T>` 要配 `Arc`**——三个需求各由一个机制满足，缺一不可（内部可变性见[第 11 章 · 智能指针与内部可变性](./11-smart-pointers/)）：

```text
多线程访问同一份数据 → 借用 & 不行（'static）、Rc 不行（非 Send） → Arc 提供共享所有权
多线程不能同时写     → lock() 才给得出 &mut T                    → Mutex 提供互斥
只持 &Arc<Mutex<i32>> 也能改内部值                              → 内部可变性
```

**`lock().unwrap()` 的由来**：`lock()` 返回 `LockResult`（一个 `Result`），失败的唯一原因是**中毒（poisoning）**——某线程持锁时 panic，数据可能停在非法中间态。不想被别的线程崩溃传染，就显式取回守卫：`counter.lock().unwrap_or_else(|poisoned| poisoned.into_inner())`。

锁的粒度要收窄，慢活儿放锁外：

```rust
let total = { let nums = data.lock().unwrap(); nums.iter().sum::<i64>() };
//          ↑ guard 在这对花括号末尾 drop → 锁释放；慢活儿（I/O、sleep）留在它外面
```

:::danger[死锁不在编译器的管辖范围]
两个线程按相反顺序抢两把锁，编译全过，运行时永远卡死——Mutex 只保证互斥，不保证活性。只有一个计数器时原子类型更轻：`AtomicUsize::fetch_add(1, Ordering::SeqCst)`。
:::

## 13.4 Send / Sync：编译器消灭数据竞争

两个 marker trait（没有方法的 trait，见[第 8 章 · 泛型与 trait](./08-generics-traits/)），由标准库**自动实现**，你几乎不用手写：

| trait | 含义 | 例子 |
| --- | --- | --- |
| `Send` | 值可**移动**到另一线程 | 几乎所有类型、`Arc`、`Mutex<T>`（T: Send）、`mpsc::Sender` |
| `Sync` | `&T` 可送到另一线程（即 `&T: Send`） | `i32`、`Arc<T>`（T: Send+Sync）；❌ `Rc`、`RefCell`、`Cell`、`mpsc::Receiver` |

规则一句话：`Mutex<T>` 只要 `T: Send` 就自动 `Sync`——这是"共享可变状态必须包 Mutex"的类型学表达；`RefCell` 是 `Send` 却非 `Sync`（它的运行时借用检查不是原子的），跨线程借出 `&RefCell` 直接编译失败。

```rust
fn assert_send<T: Send>() {}                          // 编译期探针：这类型能跨线程吗？

fn main() {
    assert_send::<String>();
    assert_send::<std::sync::Arc<std::sync::Mutex<i32>>>();
    // assert_send::<std::rc::Rc<i32>>();              // ❌ 不用真起线程就能拿到报错
}
```

:::danger["没有数据竞争"不等于"没有并发 bug"]
死锁/活锁、**先查后改**的逻辑竞态（两个线程各读余额再各扣款，每把锁都用对了结果依然错）、`unsafe` 块与 `static mut`（编译器让出责任，由你担保）。类型系统管内存安全，业务不变量得自己设计。
:::

## 13.5 scoped threads 与"忙等"反例

`move` 有时太笨重——想按[第 4 章 · 借用与引用](./04-borrowing/)的方式"只借不拿"，就用作用域线程（1.63 起稳定）。`scope` 结束前保证所有子线程已 join，所以借用局部数据是安全的：

```rust
use std::thread;

fn main() {
    let data = vec![String::from("rust"), String::from("safe")];
    thread::scope(|s| {                                // s 是作用域线程 API
        let handles = vec![
            s.spawn(|| data.len()),                    // 直接借用 data，无需 move / Arc
            s.spawn(|| data.iter().map(|w| w.chars().count()).sum::<usize>()),
        ];
        for h in handles { println!("{:?}", h.join().unwrap()); }
    });                                                // 此刻所有子线程已结束
    println!("{:?}", data);                            // ✅ 借用已终止，原变量照常可用
}
```

等待要交给**会阻塞的 API**，而不是自己转圈：

```rust
thread::sleep(std::time::Duration::from_millis(20));   // ✅ 睡 20 毫秒：CPU 完全让出
thread::yield_now();                                   // ✅ 主动交出时间片（偶尔需要）
loop { if *flag.lock().unwrap() { break; } }           // ❌ 忙等：空转烧满一核，还每轮抢锁
```

:::caution[忙等两宗罪]
① 白烧一个 CPU 核，同机其他线程反而更慢；② 高频抢锁挤压真正干活的线程。正解：`rx.recv()`（阻塞到有条目）或 `lock()`（阻塞到拿到锁）——需要等待时，标准库的阻塞 API 已经替你睡好了。
:::

## 13.6 数据并行：分块比加锁更重要

高频模式：输入切成 N 块，每块一个线程**独立算局部结果**，最后主线程合并——全程不共享可变状态，于是没有锁也没有竞态。线程数从硬件并行度取：

```rust
let cores = std::thread::available_parallelism().map(|p| p.get()).unwrap_or(1);
// 逻辑核心数；线程数 = min(cores, 数据块数)——一个线程一整块，见 13.7
```

需要更省心的数据并行就看生态：例如 **Rayon**，把 `iter()` 换成 `par_iter()` 即自动切分并跑在线程池上——本书后续示例只用标准库。

## 13.7 综合练习：多线程字频统计

完整可运行的 `src/main.rs`：分块 → 每线程一份局部统计表 → `join` 收集 → 主线程合并。**一把锁都没有**。

```rust
use std::collections::HashMap;

const LINES: &[&str] = &[
    "rust makes data races a compile error",
    "the borrow checker owns memory without a garbage collector",
    "message passing shares ownership across threads",
    "a mutex plus arc gives shared mutable state safely",
    "data races cannot compile the borrow checker guards memory",
    "threads send values and join collects results",
    "rust threads rust compile error without garbage collection",
];

fn count_words(text: &str) -> HashMap<String, usize> {        // 纯函数：无共享，可任意并发
    let mut map: HashMap<String, usize> = HashMap::new();
    for word in text.split_whitespace() {
        let w: String = word.chars()
            .filter(|c| c.is_alphanumeric())                  // 去标点
            .flat_map(|c| c.to_lowercase())                   // 统一小写
            .collect();
        if w.is_empty() { continue; }
        *map.entry(w).or_insert(0) += 1;                      // 计数三板斧
    }
    map
}

fn main() {
    let workers = std::thread::available_parallelism()
        .map(|p| p.get())
        .unwrap_or(1)
        .min(LINES.len());                                    // 别起比数据块更多的线程
    let per_worker = ((LINES.len() + workers - 1) / workers).max(1);   // 向上取整

    let mut handles = vec![];
    for chunk in LINES.chunks(per_worker) {
        let owned: String = chunk.join("\n");                 // 每块拷一份，move 给线程
        handles.push(std::thread::spawn(move || count_words(&owned)));
    }

    let mut total: HashMap<String, usize> = HashMap::new();
    for h in handles {
        let part = h.join().unwrap();                         // join 取回该线程的统计表
        for (w, n) in part {
            *total.entry(w).or_insert(0) += n;                // 主线程串行合并，无需加锁
        }
    }

    let mut top: Vec<(&String, &usize)> = total.iter().collect();
    top.sort_by(|a, b| b.1.cmp(a.1).then(a.0.cmp(b.0)));      // 次数降序，同次数按字母
    for (w, n) in top.iter().take(5) {
        println!("{w:<12} {n}");                      // 出现次数最多的 5 个词
    }
}
```

消息传递版可以这样改：worker 不返回 `HashMap`，而是 `tx.send((word, count))`，主线程 `for item in rx` 累加。取舍点在**结果形状**：一次性大块结果用 `join`，边算边冒小条目用通道。

## 本章小结

- `spawn` 要 `move` + `'static`：所有权是唯一能跨过线程边界的东西，`join` 取回返回值
- mpsc 传所有权——多生产者克隆 `Sender`，`drop` 掉原发送端后 `rx` 的迭代才会结束
- `Arc`（共享所有权）+ `Mutex`（互斥写）缺一不可；`lock()` 的 `Result` 来自中毒，锁粒度要收窄
- Send/Sync 在编译期消灭数据竞争，但管不了死锁与逻辑竞态；分块 + 归并通常比加锁更快
