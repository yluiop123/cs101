---
title: 结构体与方法
---

# 第 5 章 · 结构体与方法

**本章目标：**

- 掌握 struct 定义、组合与标签
- 理解方法与接收者（值/指针）的选择
- 学会"组合优于继承"的 Go 风格建模

## 5.1 结构体：字段的聚合

Go 没有 class——**结构体（struct）** + 方法就是它的"面向对象"：

```go
type Course struct {
    Title     string      // 大写开头 = 导出（public）
    Hours     int
    published bool        // 小写开头 = 未导出（包内私有）
}

var c Course                   // 零值：{"", 0, false}
c.Title = "Go 教程"            // 点访问

// 三种创建方式
c1 := Course{"Go 教程", 12, true}                  // 按顺序（字段多了易错）
c2 := Course{Title: "Go 教程", Hours: 12}          // 命名字段（推荐）
c3 := &Course{Title: "Go 教程"}                    // 返回指针

fmt.Printf("%+v\n", c2)        // {Title:Go 教程 Hours:12 published:false}
```

**可见性规则**（Go 的"public/private"）：标识符首字母**大写 = 包外可见**，小写 = 包内私有——没有关键字，写在哪就是什么。

## 5.2 方法：带接收者的函数

**方法（method）**= 绑定到某个类型的函数，"接收者（receiver）"就是它的 self/this：

```go
type Rectangle struct {
    Width, Height float64
}

// 值接收者：拿到拷贝（适合只读）
func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

// 指针接收者：能修改原值 / 避免大结构体拷贝
func (r *Rectangle) Scale(factor float64) {
    r.Width *= factor
    r.Height *= factor
}

rect := Rectangle{3, 4}
rect.Area()          // 12
rect.Scale(2)        // Go 自动取地址（&rect）—— 语法糖
rect.Area()          // 48
```

### 接收者选择口诀

```text
需要修改接收者            → 指针接收者
结构体大（拷贝贵）        → 指针接收者
小且只读 + 保持一致性     → 统一都用指针接收者（工程惯例）
```

::: tip 一个类型统一用一种接收者
混合使用会造成"有些方法在值集合上、有些在指针集合上"的接口实现混乱（第 6 章）。**默认全用指针接收者**最省心。
:::

## 5.3 方法不存在继承：只有组合

Go 砍掉了继承——用**嵌套组合（embedding）**替代：

```go
type Animal struct {
    Name string
}

func (a Animal) Eat() string {
    return a.Name + " 在吃东西"
}

type Dog struct {
    Animal            // 嵌入（embedding）：不是字段名，是"提升"
    Breed string
}

dog := Dog{Animal{"旺财"}, "柴犬"}
dog.Name               // 字段提升：直接访问 Animal 的字段
dog.Eat()              // 方法提升：Animal 的方法直接可调（旺财 在吃东西）
```

嵌入是**组合不是继承**：Dog 没有"是一种 Animal"的声明，只是"内含一个 Animal"并把它的字段方法**提升（promote）**到表面。同名方法就近覆盖（Dog 自己定义 Eat 就遮蔽 Animal 的）。

## 5.4 构造函数惯例：NewXxx

Go 没有构造器语法——惯例是 `NewXxx` 工厂函数：

```go
type Server struct {
    host string        // 未导出：强制走构造函数（封装！）
    port int
}

func NewServer(host string, port int) (*Server, error) {
    if port <= 0 || port > 65535 {
        return nil, fmt.Errorf("端口非法: %d", port)
    }
    return &Server{host: host, port: port}, nil
}

srv, err := NewServer("localhost", 8080)
if err != nil {
    log.Fatal(err)
}
```

返回 `(*T, error)` 双值 + 参数校验——Go 版构造器的标准形态（Java 的 throw 构造器换了个位置）。

## 5.5 结构体标签（struct tag）

标签是字段的元数据——JSON 序列化的标准通道（第 9/13 章大量使用）：

```go
type User struct {
    ID        int      `json:"id"`
    Name      string   `json:"name"`
    Email     string   `json:"email,omitempty"`     // 空值时省略
    Password  string   `json:"-"`                   // 永不序列化（敏感字段）
}

user := User{1, "Tom", "", "secret"}
jsonBytes, _ := json.Marshal(user)
fmt.Println(string(jsonBytes))
// {"id":1,"name":"Tom"} —— 空 email 被省略、password 被隐藏
```

## 5.6 比较与拷贝

```go
// 全字段可比较的结构体可 == 比较（含指针字段时比较指针本身）
p1 := Point{1, 2}
p2 := Point{1, 2}
p1 == p2          // true

// 含切片/map 的结构体不可 == —— 用 reflect.DeepEqual 或手写比较

// 拷贝
p3 := p1          // 值拷贝
p4 := &p1         // 指针共享
```

## 5.7 综合练习：任务管理器模型

```go
package main

import (
    "fmt"
    "time"
)

type Task struct {
    ID        int
    Text      string
    Done      bool
    CreatedAt time.Time
}

type TaskList struct {
    tasks  []Task
    nextID int
}

func NewTaskList() *TaskList {
    return &TaskList{nextID: 1}
}

func (tl *TaskList) Add(text string) (Task, error) {
    if text == "" {
        return Task{}, fmt.Errorf("内容不能为空")
    }
    task := Task{ID: tl.nextID, Text: text, CreatedAt: time.Now()}
    tl.nextID++
    tl.tasks = append(tl.tasks, task)
    return task, nil
}

func (tl *TaskList) Toggle(id int) error {
    for i := range tl.tasks {                 // 用下标遍历才能修改元素
        if tl.tasks[i].ID == id {
            tl.tasks[i].Done = !tl.tasks[i].Done
            return nil
        }
    }
    return fmt.Errorf("任务 #%d 不存在", id)
}

func (tl TaskList) Pending() []Task {        // 值接收者只读
    var result []Task
    for _, t := range tl.tasks {
        if !t.Done {
            result = append(result, t)
        }
    }
    return result
}

func main() {
    list := NewTaskList()
    list.Add("学结构体")
    list.Add("学接口")
    list.Toggle(1)
    for _, t := range list.Pending() {
        fmt.Printf("#%d %s\n", t.ID, t.Text)
    }
}
```

结构体 + 指针接收者方法 + NewXxx 构造 + error——Go 版"任务服务"（对照 Java 版：没有类继承、没有注解，更扁平）。

## 本章小结

- struct + 方法 = Go 的面向对象；首字母大小写管可见性
- 接收者选指针（修改/大结构体/一致性）；NewXxx 工厂返回 (T, error)
- 嵌入组合替代继承，字段方法自动提升
- struct tag 是 JSON 等序列化的元数据通道
