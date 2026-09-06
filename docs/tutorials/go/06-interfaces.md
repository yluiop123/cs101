---
title: 接口与组合
---

# 第 6 章 · 接口与组合

**本章目标：**

- 理解 Go 接口的隐式实现（鸭子类型）
- 掌握常用标准接口与空接口
- 学会"面向接口 + 组合"的 Go 设计

## 6.1 接口：方法的集合

**接口（interface）**= 一组方法签名。与 Java 的最大差异：**实现是隐式的**——不用声明 implements，方法凑齐就算实现：

```go
type Serializable interface {
    Serialize() string
}

type Course struct {
    Title string
}

// Course 没有声明"实现 Serializable"——有这个方法就自动算实现了
func (c Course) Serialize() string {
    return c.Title
}

var s Serializable = Course{"Go 教程"}     // ✅ 编译通过
```

这就是**鸭子类型（duck typing）**的静态化："走起来像鸭子、叫起来像鸭子，那它就是鸭子"——但编译期就校验，运行时不炸。

::: info 与 Java 接口的心智对比
Java：**先声明关系**（implements），编译器检查契约。
Go：**只看行为**（有方法就匹配），显式声明反而不存在。
收益：可以在**不改第三方类型**的前提下让它满足你的接口——给标准库类型"补"接口是日常操作。
:::

## 6.2 接口的多实现与组合

```go
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

// 接口可以嵌入接口 —— 小接口组合成大接口（Go 版"多继承"）
type ReadWriter interface {
    Reader
    Writer
}
```

**标准库就是小接口的教科书**：`io.Reader`、`io.Writer` 各只有一个方法——能用一个方法说清的绝不用两个。**接口越小，实现者越多，组合力越强**。

## 6.3 面向接口编程的 Go 姿态

```go
// 消费者定义接口（不是生产者！）—— Go 的独特惯例
type PaymentGateway interface {
    Charge(amountCents int) error
}

// 多个实现
type AlipayGateway struct{}
func (a AlipayGateway) Charge(n int) error { fmt.Println("支付宝扣款", n); return nil }

type MockGateway struct{}                 // 测试替身
func (m MockGateway) Charge(n int) error { return nil }

// 业务代码依赖接口
type Checkout struct {
    gateway PaymentGateway                // 注入的是接口
}

func (c Checkout) Pay(total int) error {
    return c.gateway.Charge(total)
}

// 组装时选择实现
checkout := Checkout{gateway: AlipayGateway{}}     // 生产
checkout := Checkout{gateway: MockGateway{}}       // 测试
```

注意方向：**接口定义在使用方**（Java 定义在提供方）——消费视角声明需求，实现方各显神通，解耦更彻底。

## 6.4 空接口 interface{} 与 any

**空接口**（没有任何方法）= 任何类型都实现它 = 万能容器（对应 Java Object，但更彻底）：

```go
func Print(v any) {          // any 是 interface{} 的别名（1.18+）
    fmt.Println(v)
}

Print(42); Print("hi"); Print([]int{1, 2})

// 从接口取回具体类型：类型断言
var v any = 42
n, ok := v.(int)             // 断言 + ,ok 惯用法（失败不 panic）
fmt.Println(n, ok)           // 42 true

s := v.(string)              // ❌ 不带 ok，失败直接 panic

// 类型 switch：批量分流
func describe(v any) string {
    switch x := v.(type) {   // 类型 switch（第 2 章预告）
    case int:
        return fmt.Sprintf("整数 %d", x)
    case string:
        return fmt.Sprintf("字符串 %q", x)
    case []int:
        return fmt.Sprintf("int 切片，长度 %d", len(x))
    default:
        return "未知类型"
    }
}
```

Go 1.18 前没有泛型，interface{} 是唯一出路；**现在优先泛型，interface{} 留给真正"类型未知"的场景**（JSON 解析、打印日志）。

## 6.5 接口值的两层结构

```go
var s Serializable            // nil 接口：类型为 nil + 值为 nil
s == nil                      // true

s = Course{}                  // 接口 = (动态类型 Course, 动态值 Course{})
```

::: danger 著名的"nil 接口陷阱"
```go
type MyErr struct{}
func (e *MyErr) Error() string { return "boom" }

func process(fail bool) error {
    var e *MyErr              // 具体类型的 nil 指针
    if fail {
        e = &MyErr{}
    }
    return e                  // ❌ 即便 fail=false，返回的接口 ≠ nil！
                              // （接口装着"类型 MyErr + 值 nil"）
}

err := process(false)
err == nil                    // false！—— 判空失败的经典 bug
```
**原则：函数返回错误时，正常路径直接 `return nil`**，不要返回"装着 nil 的接口"。
:::

## 6.6 常用标准接口速览

```go
// Stringer：自定义打印（Go 版 toString）
type Stringer interface { String() string }
func (t Task) String() string { return fmt.Sprintf("#%d %s", t.ID, t.Text) }

// error：第 4 章的主角
type error interface { Error() string }

// sort.Interface：排序三方法（或用泛型 slices.SortFunc 替代，第 9 章）
type Interface interface {
    Len() int
    Less(i, j int) bool
    Swap(i, j int)
}

// http.Handler：Web 服务的核心接口（第 11 章）
type Handler interface { ServeHTTP(ResponseWriter, *Request) }
```

**识别接口的敏感度**决定读 Go 代码的速度——看到"少方法小接口"就想到"万物皆可实现它"。

## 6.7 综合练习：接口驱动的通知系统

```go
package main

import "fmt"

// ① 消费方定义小接口
type Notifier interface {
    Send(to, message string) error
}

// ② 多种实现
type EmailNotifier struct{ SMTPAddr string }
func (e EmailNotifier) Send(to, msg string) error {
    fmt.Printf("[邮件→%s@%s] %s\n", to, e.SMTPAddr, msg)
    return nil
}

type SmsNotifier struct{ SignName string }
func (s SmsNotifier) Send(to, msg string) error {
    fmt.Printf("[短信→%s 签名:%s] %s\n", to, s.SignName, msg)
    return nil
}

// ③ 组合多个接口实现：广播器
type Broadcaster struct {
    channels []Notifier          // 通知渠道可插拔
}

func (b *Broadcaster) Broadcast(to, message string) {
    for _, ch := range b.channels {
        if err := ch.Send(to, message); err != nil {
            fmt.Println("发送失败:", err)
        }
    }
}

func main() {
    b := &Broadcaster{channels: []Notifier{
        EmailNotifier{SMTPAddr: "smtp.x.com"},
        SmsNotifier{SignName: "CS101"},
    }}
    b.Broadcast("tom", "课程更新啦")
    // [邮件→tom@smtp.x.com] 课程更新啦
    // [短信→tom 签名:CS101] 课程更新啦
}
```

小接口 + 多实现 + 组合注入——第 13 章 Gin 中间件与依赖注入的同一套思想。

## 本章小结

- 接口隐式实现（鸭子类型静态化）；接口越小组合力越强
- **接口由消费方定义**；io.Reader/Writer 是范式
- any/interface{} 万能容器，类型断言 `,ok` / 类型 switch 分流
- 警惕 nil 接口陷阱：正常路径 return nil
