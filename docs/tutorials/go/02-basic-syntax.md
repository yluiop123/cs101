---
title: 基础语法与流程控制
---

# 第 2 章 · 基础语法与流程控制

**本章目标：**

- 掌握变量、常量与基本类型
- 熟练 if / for / switch 的 Go 写法
- 会用指针的基础形态

## 2.1 变量与常量

```go
var count int = 42            // 完整声明：var 名字 类型 = 值
var name = "Go"               // 类型推断
count2 := 100                 // 短声明（只能在函数内用！）—— 日常首选

const pi = 3.14               // 常量（编译期确定）
const (
    StatusOK    = 200
    StatusFound = 302
)

// 批量声明（包级别）
var (
    host = "localhost"
    port = 8080
)
```

::: danger 未使用变量 = 编译错误
```go
x := 10
fmt.Println("hi")     // ❌ 编译失败：x declared and not used
```
Go 强制你处理每个声明的变量——**没有死代码的宽容**。真想占位用 `_`（空白标识符）。
:::

## 2.2 基本类型

```go
// 整数（与 Java 差异：没有隐式类型转换！）
int        // 平台相关（64 位系统 = int64），日常默认
int8 / int16 / int32 / int64          // 定长
uint / uint32 / uint64                // 无符号
byte = uint8；rune = int32（一个 Unicode 码点）

// 浮点
float32 / float64（默认选 float64）

// 布尔与字符串
bool          // true/false（if 条件必须是 bool，没有"真值"机制）
string        // 不可变 UTF-8 字符串（len 按字节算，中文一个字 3 字节）
```

**类型转换必须显式**：

```go
i := 42
f := float64(i)       // ✅
var j int = f         // ❌ 编译错误：mismatched types
s := strconv.Itoa(i)  // int → string（strconv 包）
n, err := strconv.Atoi("42")   // string → int（可能失败，第 4 章错误处理）
```

## 2.3 零值（zero value）：没有未初始化变量

Go 没有"未初始化"状态——每个类型都有零值：

```go
var i int        // 0
var s string     // ""（不是 null！）
var b bool       // false
var p *int       // nil（指针的零值）
var f float64    // 0.0
```

**string 的零值是空串而不是 null**——Java 的 NPE 灾难在 Go 里少了一大来源。

## 2.4 指针：有限但够用

Go 有指针但**没有指针运算**——比 C 安全，比 Java 灵活：

```go
x := 42
p := &x          // & 取地址
fmt.Println(*p)  // 42（* 解引用）
*p = 100         // 通过指针改值
fmt.Println(x)   // 100

// 为什么需要指针？—— 让函数能修改实参 / 避免大结构体拷贝
func bump(n *int) {
    *n++
}
bump(&x)
```

::: info 值传递与引用
Go 的函数参数**全部值传递**——传结构体会拷贝整个结构体。想"传引用"就传指针（拷贝的是 8 字节地址）。第 5 章方法的接收者会再遇它。
:::

## 2.5 if：条件是表达式，不用括号

```go
score := 85

if score >= 90 {
    fmt.Println("优秀")
} else if score >= 60 {
    fmt.Println("及格")
} else {
    fmt.Println("不及格")
}

// 带初始化语句的 if（作用域限定在 if 内 —— 惯用法）
if n, err := strconv.Atoi("42"); err == nil {
    fmt.Println("解析成功", n)
} else {
    fmt.Println("解析失败")
}
```

## 2.6 for：唯一的循环关键字

```go
// 三段式（同 C 家族）
for i := 0; i < 5; i++ { fmt.Println(i) }

// while 的等价物（只有条件）
n := 10
for n > 1 { n /= 2 }

// 死循环
for { break }

// range：遍历一切（数组/切片/map/字符串/channel，第 3 章展开）
sum := 0
for _, v := range []int{1, 2, 3} {
    sum += v
}
```

`range` 返回两个值：`index, value`——**不需要的用 `_` 丢弃**。

## 2.7 switch：默认不穿透

```go
// 默认每个 case 自动 break（没有 fall-through！）
switch score / 10 {
case 10, 9:
    fmt.Println("优秀")        // 逗号多值匹配
case 8, 7:
    fmt.Println("良好")
default:
    fmt.Println("继续加油")
}

// 无表达式 switch：比 if-else 链清爽
switch {
case score >= 90:
    fmt.Println("A")
case score >= 60:
    fmt.Println("及格")
}

// 带初始化 + 类型 switch（第 6 章）
switch v := interface{}(42).(type) {
case int:
    fmt.Println("整数", v)
case string:
    fmt.Println("字符串", v)
}
```

## 2.8 综合练习：猜数字游戏

```go
package main

import (
    "fmt"
    "math/rand"
)

func main() {
    target := rand.Intn(100) + 1        // 1~100
    fmt.Println("猜一个 1~100 的数")

    for attempts := 0; ; attempts++ {
        var guess int
        if _, err := fmt.Scan(&guess); err != nil {
            fmt.Println("请输入数字")
            continue
        }
        switch {
        case guess < target:
            fmt.Println("小了")
        case guess > target:
            fmt.Println("大了")
        default:
            fmt.Printf("答对了！共猜 %d 次\n", attempts+1)
            return
        }
    }
}
```

## 本章小结

- `:=` 短声明日常首选；未使用变量直接编译失败
- 零值机制消灭"未初始化"；类型转换必须显式
- 指针有限够用（无指针运算）；if/switch 可带初始化语句
- for 是唯一循环关键字；switch 默认不穿透
