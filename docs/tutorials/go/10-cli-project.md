---
title: 综合实战：CLI 工具
---

# 第 10 章 · 综合实战：CLI 工具

**本章目标：**

- 综合运用前 9 章完成"待办清单 CLI"
- 掌握 flag 与命令行参数处理
- 学会 JSON 持久化与错误处理分层

## 10.1 项目目标与结构

```text
todo-cli/
├── go.mod
├── main.go            # 入口：参数分发
├── task.go            # 数据模型
├── store.go           # JSON 持久化
└── task_test.go       # 测试
```

```text
用法：
  todo add "任务内容"      添加任务
  todo list                列出全部
  todo done 1              完成指定 ID
  todo del 1               删除指定 ID
```

对照 Java 版命令行待办：Go 的版本**不需要任何第三方依赖**——标准库全包。

## 10.2 数据模型

```go
// task.go
package main

import "time"

type Task struct {
    ID        int       `json:"id"`
    Text      string    `json:"text"`
    Done      bool      `json:"done"`
    CreatedAt time.Time `json:"created_at"`
}

func (t Task) String() string {          // 实现 Stringer（第 6 章）
    mark := " "
    if t.Done {
        mark = "x"
    }
    return fmt.Sprintf("[%s] #%d %s（%s）",
        mark, t.ID, t.Text, t.CreatedAt.Format("01-02 15:04"))
}
```

## 10.3 持久化层

```go
// store.go
package main

import (
    "encoding/json"
    "errors"
    "os"
)

const storeFile = "tasks.json"

func loadTasks() []Task {
    data, err := os.ReadFile(storeFile)
    if err != nil {
        return []Task{}                  // 文件不存在 = 空列表（首次运行）
    }
    var tasks []Task
    if err := json.Unmarshal(data, &tasks); err != nil {
        return []Task{}                  // 存档损坏：从空白开始（容错）
    }
    return tasks
}

func saveTasks(tasks []Task) error {
    data, err := json.MarshalIndent(tasks, "", "  ")
    if err != nil {
        return err
    }
    return os.WriteFile(storeFile, data, 0644)   // 0644：常规文件权限
}

// 查找任务（返回指针便于修改）
func findTask(tasks []Task, id int) (*Task, error) {
    for i := range tasks {
        if tasks[i].ID == id {
            return &tasks[i], nil
        }
    }
    return nil, errors.New("任务不存在")
}
```

## 10.4 命令实现

```go
// main.go
package main

import (
    "errors"
    "fmt"
    "os"
    "strconv"
    "strings"
)

func nextID(tasks []Task) int {
    max := 0
    for _, t := range tasks {
        if t.ID > max {
            max = t.ID
        }
    }
    return max + 1
}

func cmdAdd(text string) error {
    if text == "" {
        return errors.New("任务内容不能为空")
    }
    tasks := loadTasks()
    tasks = append(tasks, Task{ID: nextID(tasks), Text: text})
    if err := saveTasks(tasks); err != nil {
        return err
    }
    fmt.Println("✓ 已添加")
    return nil
}

func cmdList() error {
    tasks := loadTasks()
    if len(tasks) == 0 {
        fmt.Println("（空）")
        return nil
    }
    for _, t := range tasks {
        fmt.Println(t)                   // Stringer 自动生效
    }
    return nil
}

func cmdDone(rawID string) error {
    id, err := strconv.Atoi(rawID)
    if err != nil {
        return errors.New("ID 必须是数字")
    }
    tasks := loadTasks()
    task, err := findTask(tasks, id)
    if err != nil {
        return err
    }
    task.Done = true                     // 指针直接改
    if err := saveTasks(tasks); err != nil {
        return err
    }
    fmt.Println("✓ 已完成", task.Text)
    return nil
}

func cmdDel(rawID string) error {
    id, err := strconv.Atoi(rawID)
    if err != nil {
        return errors.New("ID 必须是数字")
    }
    tasks := loadTasks()
    for i, t := range tasks {
        if t.ID == id {
            tasks = append(tasks[:i], tasks[i+1:]...)    // 切片删除
            return saveTasks(tasks)
        }
    }
    return errors.New("任务不存在")
}

func main() {
    args := os.Args[1:]                  // os.Args[0] 是程序自身路径
    if len(args) == 0 {
        fmt.Println("用法：todo add|list|done|del [参数]")
        os.Exit(1)
    }

    var err error
    switch args[0] {
    case "add":
        err = cmdAdd(strings.Join(args[1:], " "))
    case "list":
        err = cmdList()
    case "done":
        err = requireArg(args, cmdDone)
    case "del":
        err = requireArg(args, cmdDel)
    default:
        err = fmt.Errorf("未知命令：%s", args[0])
    }

    if err != nil {
        fmt.Fprintln(os.Stderr, "✗", err)    // 错误走 stderr（工程惯例）
        os.Exit(1)                            // 非零退出码表示失败（脚本可判断）
    }
}

func requireArg(args []string, fn func(string) error) error {
    if len(args) < 2 {
        return errors.New("缺少参数")
    }
    return fn(args[1])
}
```

## 10.5 flag 包：标准参数解析

带选项的复杂工具用 flag：

```go
func main() {
    verbose := flag.Bool("v", false, "详细输出")
    limit := flag.Int("limit", 10, "列表条数上限")
    flag.Parse()                          // 解析后 flag.Args() 是剩余位置参数

    if *verbose {
        fmt.Println("详细模式开启")
    }
    // 运行：todo list -v -limit 5
}
```

经验法则：**子命令式工具**（add/list/done）用 os.Args 手动分发；**选项式工具**（-v -limit）用 flag。更大规模（带子命令+帮助生成）用 cobra 库——第 14 章部署时再用。

## 10.6 测试

```go
// task_test.go
package main

import "testing"

func TestNextID(t *testing.T) {
    tasks := []Task{{ID: 1}, {ID: 5}}
    if got := nextID(tasks); got != 6 {
        t.Errorf("nextID = %d, want 6", got)
    }
}

func TestFindTask(t *testing.T) {
    tasks := []Task{{ID: 1, Text: "a"}}
    if _, err := findTask(tasks, 1); err != nil {
        t.Error("存在的 ID 不应报错")
    }
    if _, err := findTask(tasks, 2); err == nil {
        t.Error("不存在的 ID 应当报错")
    }
}

func TestTaskString(t *testing.T) {
    task := Task{ID: 1, Text: "学 Go", Done: true}
    s := task.String()
    if s == "" {
        t.Error("String() 不应为空")
    }
}
```

## 10.7 运行效果

```bash
go build -o todo .
./todo add 学完 Go 教程
./todo add 写一个 CLI
./todo list
# [ ] #1 学完 Go 教程（09-06 17:20）
# [ ] #2 写一个 CLI（09-06 17:20）
./todo done 1
./todo list
# [x] #1 学完 Go 教程（09-06 17:20）
# [ ] #2 写一个 CLI（09-06 17:20）
go test ./...
```

## 10.8 自查清单

- [ ] 子命令分发 + stderr 错误 + 非零退出码（可脚本化）
- [ ] JSON 持久化带损坏容错（第 9 章 Unmarshal 指针）
- [ ] 切片删除/追加语义正确（第 3 章）
- [ ] Stringer/错误包装/表驱动测试齐备
- [ ] `go build -o` 产出单文件可执行（部署即拷贝）

## 本章小结

- os.Args 手动分发子命令；flag 管选项；错误走 stderr + os.Exit(1)
- JSON 持久化 + 首次运行/损坏容错
- 单文件二进制是 Go CLI 的天然优势
- 至此语言篇收官，第 11 章起进入 Web 后端
