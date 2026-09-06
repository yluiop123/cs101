---
title: 标准库精选与测试
---

# 第 9 章 · 标准库精选与测试

**本章目标：**

- 精通 strings/strconv/strconv 等高频包
- 掌握 time、encoding/json 的日常用法
- 建立 go test 的测试习惯

## 9.1 strings：字符串操作全家桶

```go
import (
    "fmt"
    "strings"
)

strings.Contains("hello", "ell")       // true
strings.HasPrefix("go101", "go")       // true
strings.Index("hello", "l")            // 2
strings.ToUpper("go")                  // GO
strings.TrimSpace("  hi  ")            // "hi"
strings.ReplaceAll("a-b-c", "-", "+")  // a+b+c
strings.Split("a,b,c", ",")            // [a b c]
strings.Join([]string{"a", "b"}, "-")  // a-b
strings.Fields("a  b\tc")              // [a b c]（按任意空白切，比 Split 更常用）
strings.Repeat("ab", 3)                // ababab

fmt.Sprintf("坐标(%d, %d)", 3, 5)      // 格式化（不打印，返回字符串）
// 动词：%s 字符串 %d 整数 %f 浮点 %.2f 两位 %q 带引号 %v 万能 %T 类型
```

## 9.2 strconv：字符串与数值转换

```go
import "strconv"

n, err := strconv.Atoi("42")           // string → int（可能失败！）
s := strconv.Itoa(42)                  // int → string
strconv.ParseFloat("3.14", 64)
strconv.ParseBool("true")
strconv.Quote("hi")                    // "hi"（带引号转义）
```

## 9.3 time：时间处理

```go
import "time"

now := time.Now()                      // 本地时间
year := now.Year(); now.Month(); now.Day()

// 格式化：Go 的奇葩参照时间（固定记住）
now.Format("2006-01-02 15:04:05")      // 2006-01-02 15:04:05（记忆：1 2 3 4 5 6 7）
now.Format(time.RFC3339)               // 2026-09-06T14:30:05+08:00（接口传输）

// 解析
t, _ := time.Parse("2006-01-02", "2026-09-06")

// 运算
now.Add(24 * time.Hour)                // 明天
now.Sub(past).Hours()                  // 间隔小时
time.Since(start)                      // 从 start 到现在（测耗时）
now.After(t); now.Before(t)

// 比较与休眠
time.Sleep(500 * time.Millisecond)
```

::: tip 参照时间记忆法
`2006-01-02 15:04:05` = `1 2 3 4 5` 递增（月日时分秒）——背下这一行，Go 时间格式永不错。
:::

## 9.4 encoding/json：JSON 序列化

```go
import "encoding/json"

type User struct {
    ID    int      `json:"id"`
    Name  string   `json:"name"`
    Email string   `json:"email,omitempty"`   // 空值省略
    Pass  string   `json:"-"`                 // 永不序列化
}

// 序列化（Marshal）
u := User{1, "Tom", "t@x.com", "secret"}
data, err := json.Marshal(u)                    // []byte
fmt.Println(string(data))                       // {"id":1,"name":"Tom","email":"t@x.com"}

// 反序列化（Unmarshal）
var u2 User
json.Unmarshal(data, &u2)                       // 指针传入！

// 未知结构的 JSON：map + any
var generic map[string]any
json.Unmarshal(data, &generic)

// 美化输出
pretty, _ := json.MarshalIndent(u, "", "  ")
```

::: warning Unmarshal 必传指针
`json.Unmarshal(data, u2)` ❌（拷贝进去，外面拿不到）——必须 `&u2`。错误一律检查（err != nil），JSON 解析是真实世界的失败重灾区。
:::

## 9.5 其他高频标准包

```go
import (
    "log/slog"        // 结构化日志（1.21+，Go 版 log4j）
    "os"              // 环境变量、文件
    "sort"            // 排序
    "slices"          // 泛型切片工具（1.21+）
    "maps"            // 泛型 map 工具
)

// slog：键值对结构化日志
slog.Info("用户登录", "user", "tom", "ip", "1.2.3.4")
slog.Error("请求失败", "err", err)

// os
os.Getenv("PORT")
os.Setenv("MODE", "dev")

// slices：泛型时代替代 sort 包
slices.Sort(nums)                          // 原地排序（需 Ordered 约束）
slices.Contains(nums, 42)
slices.Index(names, "Tom")
slices.Max(nums); slices.Min(nums)

// maps
maps.Keys(m); maps.Clone(m)
```

## 9.6 go test：测试即一等公民

```go
// calculator.go
package calc

func Add(a, b int) int { return a + b }

func Divide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("除数不能为零")
    }
    return a / b, nil
}
```

```go
// calculator_test.go —— 文件名以 _test.go 结尾，与源码同目录
package calc

import (
    "errors"
    "testing"
)

func TestAdd(t *testing.T) {               // 测试函数：TestXxx(t *testing.T)
    if got := Add(2, 3); got != 5 {
        t.Errorf("Add(2,3) = %d，期望 5", got)
    }
}

func TestDivide(t *testing.T) {
    _, err := Divide(1, 0)
    if err == nil {
        t.Fatal("除零应当返回错误")
    }
    if !errors.Is(err, errors.New("除数不能为零")) { ... }
}
```

```bash
go test ./...            # 跑全部
go test -v ./...         # 详细
go test -cover ./...     # 覆盖率
go test -run TestAdd     # 只跑指定
```

### 表驱动测试：Go 社区的标准姿势

```go
func TestAdd(t *testing.T) {
    tests := []struct {
        name    string
        a, b    int
        want    int
    }{
        {"正数", 2, 3, 5},
        {"负数", -1, -1, -2},
        {"零", 0, 0, 0},
    }
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {         // 子测试：单独跑/单独失败
            if got := Add(tt.a, tt.b); got != tt.want {
                t.Errorf("got %d, want %d", got, tt.want)
            }
        })
    }
}
```

## 9.7 benchmark 与模糊测试一瞥

```go
// 基准测试：BenchmarkXxx
func BenchmarkAdd(b *testing.B) {
    for i := 0; i < b.N; i++ {       // b.N 由框架自动调整
        Add(i, i)
    }
}
// go test -bench=.

// 模糊测试（1.18+）：随机输入找崩溃
func FuzzParseAge(f *testing.F) {
    f.Add("42")
    f.Fuzz(func(t *testing.T, s string) {
        _, _ = parseAge(s)           // 不允许 panic 即通过
    })
}
// go test -fuzz=FuzzParseAge
```

## 9.8 综合练习：为 To-Do 服务补测试

```go
// service_test.go
package todo

import "testing"

func TestAdd(t *testing.T) {
    list := NewTaskList()
    task, err := list.Add("学 Go 测试")
    if err != nil {
        t.Fatalf("不应出错: %v", err)
    }
    if task.ID != 1 || task.Text != "学 Go 测试" {
        t.Errorf("字段不符: %+v", task)
    }
}

func TestAddEmpty(t *testing.T) {
    list := NewTaskList()
    if _, err := list.Add(""); err == nil {
        t.Error("空内容应当报错")
    }
}

func TestToggle(t *testing.T) {
    list := NewTaskList()
    task, _ := list.Add("任务")
    if err := list.Toggle(task.ID); err != nil {
        t.Fatalf("toggle 失败: %v", err)
    }
    if err := list.Toggle(999); err == nil {
        t.Error("不存在的 ID 应当报错")
    }
}
```

## 本章小结

- strings.Fields/Join、strconv 两向转换、Sprintf 动词表
- time 格式化参照 `2006-01-02 15:04:05`；JSON 用 struct tag 精确控制
- go test 内置：表驱动测试是社区标准姿势；-race/-cover/-bench 全家桶
- slices/maps 泛型工具包已接管旧 sort 场景
