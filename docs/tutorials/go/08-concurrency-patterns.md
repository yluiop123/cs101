---
title: 并发模式与 sync 包
---

# 第 8 章 · 并发模式与 sync 包

**本章目标：**

- 掌握 WaitGroup、Mutex、Once 三大 sync 利器
- 认识 sync.Map 与 atomic 原子操作
- 沉淀并发安全的三条铁律与经典模式

## 8.1 竞态条件重演与 sync 的位置

第 7 章用 channel 解决协作；**共享内存场景**用 sync 包：

```go
counter := 0
var wg sync.WaitGroup

for i := 0; i < 1000; i++ {
    wg.Add(1)
    go func() {
        defer wg.Done()
        counter++                  // ❌ 数据竞争（data race）
    }()
}
wg.Wait()
fmt.Println(counter)               // 随机 < 1000
```

检测工具先行（比肉眼强一万倍）：

```bash
go run -race main.go    # 竞态检测器：精确报告冲突的读写位置
```

## 8.2 sync.WaitGroup：等待一组 goroutine

```go
var wg sync.WaitGroup

for i := 0; i < 3; i++ {
    wg.Add(1)                      // 计数 +1（启动前！）
    go func(id int) {
        defer wg.Done()            // 完成 -1（defer 保证必执行）
        time.Sleep(time.Second)
        fmt.Println("worker", id, "完成")
    }(i)                           // 把 i 当参数传（闭包捕获变量陷阱见下）
}
wg.Wait()                          // 计数归零才继续

// 第 7 章爬虫骨架里的标准三件套：Add(启动前) / Done(defer) / Wait(收尾)
```

::: danger 循环变量捕获（Go 1.22 前的经典坑）
```go
for i := 0; i < 3; i++ {
    go func() {
        fmt.Println(i)             // 1.21 及以前：可能全打印 3（共享同一变量）
    }()
}
// 修复①：作为参数传入 go func(id int) {...}(i)
// 修复②：Go 1.22+ 循环变量每轮独立，天然安全（但团队规范仍建议显式传参）
```
:::

## 8.3 sync.Mutex：互斥锁

```go
type SafeCounter struct {
    mu     sync.Mutex               // 锁保护下面的字段
    counts map[string]int
}

func (c *SafeCounter) Inc(key string) {
    c.mu.Lock()                    // 上锁
    defer c.mu.Unlock()            // defer 解锁（绝不手动忘）
    c.counts[key]++
}

func (c *SafeCounter) Get(key string) int {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.counts[key]
}
```

铁律：**锁与它保护的数据绑定**（一起封进结构体）；**加锁范围最小化**；**永远 defer Unlock**。

```go
// 读写锁：读多写少场景的性能优化
var rw sync.RWMutex
rw.RLock() / rw.RUnlock()      // 读锁：可并发多个读
rw.Lock()  / rw.Unlock()       // 写锁：独占
```

## 8.4 sync.Once：全局只执行一次

```go
var (
    instance *Config
    once     sync.Once
)

func GetConfig() *Config {
    once.Do(func() {               // 无论多少 goroutine 并发调用，只执行一次
        instance = loadConfig()
    })
    return instance
}
```

单例、连接池初始化、懒加载——**Once = 并发安全的懒初始化**（不用自己 double-check 加锁）。

## 8.5 atomic：无锁原子操作

```go
import "sync/atomic"

var counter atomic.Int64         // Go 1.19+ 类型化原子类

counter.Add(1)                   // 原子加
counter.Load()                   // 原子读
counter.Store(42)                // 原子写
counter.CompareAndSwap(42, 43)   // CAS

// 适合：计数器、标志位、ID 发号器
// 不适合：保护多字段结构（那需要 Mutex）
```

**决策树**：

```text
只是计数/标志           → atomic
保护一组字段            → sync.Mutex
goroutine 间传数据      → channel（首选！）
一次性初始化            → sync.Once
```

## 8.6 sync.Map：特定场景的并发 map

```go
var m sync.Map                   // 内部优化过：读多写少、键集合稳定时快
m.Store("user1", 100)
v, ok := m.Load("user1")
m.Delete("user1")
m.Range(func(k, v any) bool {    // 遍历（无类型安全：any 出入）
    return true                  // 返回 false 停止
})
```

`sync.Map` 类型不安全（值都是 any）——**常规场景仍是 `Mutex + map[T]U`**（类型安全 + 直观），sync.Map 只在读多写少的缓存场景胜出。

## 8.7 经典模式：errgroup 与 worker pool 收编

```go
// golang.org/x/sync/errgroup：WaitGroup + 错误传递（第 7 章爬虫骨架的收编版）
import "golang.org/x/sync/errgroup"

func fetchAll(urls []string) error {
    g, ctx := errgroup.WithContext(context.Background())
    results := make([]string, len(urls))

    for i, url := range urls {
        i, url := i, url
        g.Go(func() error {              // 每个任务一个 goroutine
            r, err := fetch(ctx, url)
            if err != nil {
                return err               // 任意一个失败 → Wait 返回该错误
            }
            results[i] = r
            return nil
        })
    }
    return g.Wait()                      // 等全部完成 / 返回第一个错误
}

// context：并发任务的取消信号（第 11 章 Web 全链路的主角）
// ctx.Done() 关闭 → 所有监听者退出
```

## 8.8 综合练习：并发安全的限流计数器

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

type RateLimiter struct {
    mu       sync.Mutex
    requests map[string][]time.Time     // 每 key 的请求时间戳
    limit    int
    window   time.Duration
}

func NewRateLimiter(limit int, window time.Duration) *RateLimiter {
    return &RateLimiter{
        requests: make(map[string][]time.Time),
        limit:    limit,
        window:   window,
    }
}

func (rl *RateLimiter) Allow(key string) bool {
    rl.mu.Lock()
    defer rl.mu.Unlock()

    now := time.Now()
    // 清理窗口外的旧记录
    valid := rl.requests[key][:0]
    for _, t := range rl.requests[key] {
        if now.Sub(t) < rl.window {
            valid = append(valid, t)
        }
    }
    rl.requests[key] = valid

    if len(valid) >= rl.limit {
        return false
    }
    rl.requests[key] = append(valid, now)
    return true
}

func main() {
    limiter := NewRateLimiter(3, time.Second)   // 每秒 3 次

    var wg sync.WaitGroup
    for i := 0; i < 5; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            if limiter.Allow("user1") {
                fmt.Println("请求", id, "通过")
            } else {
                fmt.Println("请求", id, "被限流")
            }
        }(i)
    }
    wg.Wait()
    // 前 3 个通过，后 2 个被限流（顺序随机但数量确定）
}
```

Mutex 保护结构体 + 滑动窗口算法 + WaitGroup 并发验证——Web 后端限流器的完整雏形（第 12 章 Gin 中间件版会复用它）。

## 本章小结

- `go run -race` 检测数据竞争；WaitGroup Add/Done/Wait 三件套
- Mutex 保护绑定字段、defer Unlock、粒度最小；RWMutex 读多写少
- Once 懒初始化、atomic 计数标志、sync.Map 仅限读多写少
- 优先级：channel 传数据 > atomic > Mutex；errgroup 管错误传递
