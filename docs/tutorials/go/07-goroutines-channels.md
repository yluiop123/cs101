---
title: goroutine 与 channel
---

# 第 7 章 · goroutine 与 channel

**本章目标：**

- 理解 goroutine 与系统线程的区别
- 掌握 channel 的方向、缓冲与关闭语义
- 学会用 channel 组织并发协作

## 7.1 goroutine：轻到可以开几万个

**goroutine** = Go 的用户级"线程"，由运行时调度（非操作系统线程）：

```go
go doWork()            // 一个关键字，立即返回（不阻塞）
```

```go
package main

import (
    "fmt"
    "time"
)

func say(s string) {
    for i := 0; i < 3; i++ {
        time.Sleep(100 * time.Millisecond)
        fmt.Println(s)
    }
}

func main() {
    go say("world")         // 新 goroutine：并发跑
    say("hello")            // 主 goroutine
    time.Sleep(500 * time.Millisecond)   // 临时手段：等子 goroutine（第 7.4 节有正式方案）
}
```

| | 系统线程 | goroutine |
| --- | --- | --- |
| 栈大小 | 默认 ~1-8 MB | **起始 2KB**，按需伸缩 |
| 创建成本 | 微秒~毫秒级 | 纳秒级 |
| 数量级 | 几千个就吃力 | **百万级无压力** |
| 调度 | OS 内核调度 | Go 运行时调度（M:N 模型） |

::: warning main 退出 = 全体 goroutine 立即死亡
没有"等子 goroutine"的隐式机制——main 一返回，一切戛然而止。等待需要显式协作（WaitGroup/channel）。
:::

## 7.2 channel：goroutine 之间的传送带

**channel（通道）**是 goroutine 间通信的类型安全管道：

```go
ch := make(chan string)      // 无缓冲通道：发送会阻塞到有人接收

go func() {
    ch <- "ping"             // 发送（阻塞直到有人取）
}()

msg := <-ch                  // 接收（阻塞直到有人发）
fmt.Println(msg)             // ping
```

**"用通信共享内存，而不是用共享内存通信"**——Go 并发的核心理念：数据通过 channel 流动，而不是多个 goroutine 抢同一块内存。

### 缓冲通道

```go
ch := make(chan int, 3)      // 缓冲 3：塞满前不阻塞
ch <- 1
ch <- 2
ch <- 3                      // 满；第 4 次发送阻塞
fmt.Println(<-ch)
```

| | 无缓冲 | 有缓冲 |
| --- | --- | --- |
| 发送时机 | 有人接收才继续 | 缓冲没满就继续 |
| 语义 | 同步交接（双方会合） | 异步队列 |

## 7.3 通道的方向与关闭

```go
// 方向限制：编译器约束通道用途
func producer(out chan<- int) {     // 只能发送
    for i := 0; i < 5; i++ {
        out <- i
    }
    close(out)                      // 关闭：表示不再发送
}

func consumer(in <-chan int) {      // 只能接收
    for v := range in {             // range 通道：自动接收直到 close
        fmt.Println(v)
    }
}

func main() {
    ch := make(chan int)
    go producer(ch)
    consumer(ch)
}
```

关闭语义三条军规：

```text
① 关闭由发送方负责（接收方不知道何时没有更多数据）
② 向已关闭通道发送 → panic
③ 从已关闭通道接收 → 立即返回零值；,ok 判断是否真有数据
   v, ok := <-ch    // ok=false 表示通道已关闭且取空
```

## 7.4 select：多路复用

**select** = channel 版的 switch：同时等待多个通道，谁先就绪处理谁：

```go
func worker(done chan bool, timeout <-chan time.Time) { ... }

select {
case msg := <-ch1:
    fmt.Println("收到", msg)
case ch2 <- 42:                     // 也可以是发送分支
    fmt.Println("已发送")
case <-time.After(2 * time.Second): // 超时控制（惯用法！）
    fmt.Println("超时了")
}

// 非阻塞收发：default 分支
select {
case v := <-ch:
    fmt.Println("有数据", v)
default:
    fmt.Println("先干别的")
}
```

## 7.5 单向数据流：流水线模式

```go
// 生成 → 加工 → 消费 的流水线（pipeline）
func generate(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for _, n := range nums {
            out <- n
        }
    }()
    return out                                  // 返回只读通道

func square(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for n := range in {                     // 从上游取
            out <- n * n                        // 加工后给下游
        }
    }()
    return out

func main() {
    for v := range square(generate(1, 2, 3, 4)) {   // 1 4 9 16
        fmt.Println(v)
    }
}
```

每个环节一个 goroutine、通道串联、`defer close` 层层收尾——数据流式处理的 Go 标准范式。

## 7.6 综合练习：并发爬虫骨架

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

type Result struct {
    URL    string
    Status string
}

// 并发抓取：worker pool 模式雏形
func fetchAll(urls []string, workers int) []Result {
    jobs := make(chan string)             // 任务队列
    results := make(chan Result, len(urls))   // 结果队列（带缓冲防泄漏）
    var wg sync.WaitGroup

    // 启动 N 个 worker
    for i := 0; i < workers; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            for url := range jobs {       // 不断领任务
                time.Sleep(100 * time.Millisecond)      // 模拟请求
                results <- Result{URL: url, Status: "200 OK"}
            }
        }(i)
    }

    // 投递任务 + 收结果
    for _, u := range urls {
        jobs <- u
    }
    close(jobs)                           // 没有更多任务 → worker 自然退出
    go func() {
        wg.Wait()
        close(results)                    // 全部完成后关结果通道
    }()

    var out []Result
    for r := range results {
        out = append(out, r)
    }
    return out
}

func main() {
    for _, r := range fetchAll([]string{"a.com", "b.com", "c.com", "d.com"}, 2) {
        fmt.Println(r.URL, r.Status)
    }
}
```

任务通道 + worker 池 + WaitGroup + 关闭协议——生产级并发骨架（第 8 章把它收编成惯用模式）。

## 本章小结

- goroutine 轻量（2KB 起步，百万级）；main 退出全体死亡
- channel 是类型安全管道：无缓冲=会合、有缓冲=队列
- 发送方 close、range 收尾、`,ok` 判空；select 多路复用 + 超时
- 流水线：单向通道串联 + defer close 层层传递
