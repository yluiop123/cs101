---
title: 函数与错误处理
---

# 第 4 章 · 函数与错误处理

**本章目标：**

- 掌握多返回值、命名返回值与 defer
- 理解 Go 的错误处理哲学（error 即值）
- 学会 panic/recover 的边界

## 4.1 函数基础与多返回值

```go
func add(a, b int) int {            // 同类型参数可简写
    return a + b
}

// 多返回值：Go 的招牌（第 3 章 ,ok 惯用法的来源）
func divmod(a, b int) (int, int) {
    return a / b, a % b
}

q, r := divmod(7, 2)                // 3, 1
_, r2 := divmod(7, 2)               // 不要的用 _ 丢弃
```

**可变参数**与**匿名函数**：

```go
func sum(nums ...int) int {          // 可变参数（切片形态）
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}
sum(1, 2, 3)
sum([]int{1, 2, 3}...)               // 展开切片传入

// 匿名函数 + 立即执行
result := func(x int) int { return x * 2 }(21)   // 42
```

## 4.2 命名返回值与 defer

```go
// 命名返回值：函数体内可直接当变量用
func split(sum int) (x, y int) {     // (x, y int) 是命名返回
    x = sum * 4 / 9
    y = sum - x
    return                           // 裸 return（短函数可用，长函数建议显式）
}

// defer：延迟执行，函数返回前逆序执行（栈式）
func readFile() error {
    f, err := os.Open("data.txt")
    if err != nil {
        return err
    }
    defer f.Close()                  // 注册清理：无论从哪条路径返回都会执行
    // ... 使用 f
    return nil
}
```

`defer` 三大用途：释放资源、解锁、恢复 panic。**defer 在 return 之后执行**，多个 defer 逆序（后注册先执行）：

```go
defer fmt.Println(1)
defer fmt.Println(2)
defer fmt.Println(3)      // 输出 3 2 1
```

## 4.3 错误处理：error 即值

Go 没有 try-catch——**错误是普通返回值**，用多返回值传出：

```go
// error 是内置接口：只有一个 Error() string 方法
// 约定：错误放最后一个返回值；无错时为 nil

func parseAge(s string) (int, error) {
    n, err := strconv.Atoi(s)
    if err != nil {
        return 0, fmt.Errorf("年龄格式错误: %q", s)     // 包装原错误
    }
    if n < 0 || n > 150 {
        return 0, fmt.Errorf("年龄超出范围: %d", n)
    }
    return n, nil
}

// 调用方：if err != nil 是 Go 的心跳节奏
age, err := parseAge("abc")
if err != nil {
    fmt.Println("处理失败:", err)
    return
}
fmt.Println("年龄:", age)
```

::: tip 为什么不用异常？
Go 团队认为**错误是可预期的、异常是控制流滥用**。`if err != nil` 把每个可能失败的点摆在眼前——啰嗦但诚实（工具 golangci-lint 会帮你查漏）。这是 Go 与 Java/Python 最大的哲学分歧，写代码时 embracing 它。
:::

### 错误包装与判断

```go
import (
    "errors"
    "fmt"
)

// %w 包装：保留错误链（errors.Is/As 能穿透判断）
func loadConfig(path string) error {
    _, err := os.ReadFile(path)
    if err != nil {
        return fmt.Errorf("加载配置失败: %w", err)     // %w = wrap
    }
    return nil
}

// errors.Is：判断错误链中是否有目标错误（== 的增强版）
if errors.Is(err, os.ErrNotExist) { ... }

// 自定义错误类型 + errors.As：从错误链中"提取"特定类型
type ValidationError struct {
    Field string
}
func (e *ValidationError) Error() string { return "字段无效: " + e.Field }

var ve *ValidationError
if errors.As(err, &ve) {              // 穿透包装找到 ValidationError
    fmt.Println("无效字段:", ve.Field)
}

// 哨兵错误（sentinel error）：预定义的可比较错误
var ErrEmpty = errors.New("内容为空")
if errors.Is(err, ErrEmpty) { ... }
```

## 4.4 panic 与 recover：最后的保险丝

```go
// panic：不可恢复的严重错误（数组越界、nil 解引用、显式 panic）
func mustParse(s string) int {
    n, err := strconv.Atoi(s)
    if err != nil {
        panic(err)                    // 💥 程序崩溃（除非被 recover）
    }
    return n
}

// recover：在 defer 中接住 panic（框架层用，业务层别碰）
func safeCall(fn func()) (err error) {
    defer func() {                    // defer + 匿名函数：recover 只能在 defer 里生效
        if r := recover(); r != nil {
            err = fmt.Errorf("panic 恢复: %v", r)
        }
    }()
    fn()
    return nil
}
```

**原则**：业务代码用 error 表达一切可预期失败；panic 只用于"程序员犯错"（如必应存在的配置缺失）；HTTP 框架会帮你 recover 每个请求的 panic（第 11 章）。

## 4.5 泛型函数（1.18+）

```go
// 类型参数：[T any] 声明；约束控制能力
func Map[T, R any](items []T, fn func(T) R) []R {
    result := make([]R, 0, len(items))
    for _, item := range items {
        result = append(result, fn(item))
    }
    return result
}

doubled := Map([]int{1, 2, 3}, func(n int) int { return n * 2 })
// [2 4 6]

// 约束：内建的 comparable（可 == 比较）与自定义约束
type Number interface {
    ~int | ~int64 | ~float64          // 联合约束
}
func Sum[T Number](nums []T) T {
    var total T
    for _, n := range nums {
        total += n
    }
    return total
}
Sum([]int{1, 2, 3})          // 6
Sum([]float64{1.5, 2.5})     // 4
```

泛型解决"容器与算法的类型安全"，但**别滥用**——接口（第 6 章）在 Go 里仍是第一选择。

## 4.6 综合练习：带重试的函数执行器

```go
package main

import (
    "errors"
    "fmt"
    "time"
)

var ErrRetry = errors.New("重试次数用尽")

// 泛型 + 多返回值 + 错误包装的综合演练
func withRetry[T any](times int, fn func() (T, error)) (T, error) {
    var zero T
    var lastErr error
    for attempt := 1; attempt <= times; attempt++ {
        result, err := fn()
        if err == nil {
            return result, nil
        }
        lastErr = err
        fmt.Printf("第 %d 次失败: %v\n", attempt, err)
        time.Sleep(100 * time.Millisecond)
    }
    return zero, fmt.Errorf("%w: 最后错误 %v", ErrRetry, lastErr)
}

func main() {
    value, err := withRetry(3, func() (string, error) {
        return "", errors.New("连接超时")     // 模拟一直失败
    })
    if errors.Is(err, ErrRetry) {
        fmt.Println("彻底失败:", err)
    }
    _ = value
}
```

多返回值、error 包装链、泛型、defer——Go 错误处理全景在这 40 行里。

## 本章小结

- 多返回值 + `if err != nil` 是 Go 的错误哲学
- defer 逆序执行管清理；命名返回值 + 裸 return 短函数可用
- `fmt.Errorf("%w")` 包装、errors.Is/As 判断、哨兵错误是标准三件套
- panic/recover 留给框架与真 bug；泛型 `[T any]` 克制使用
