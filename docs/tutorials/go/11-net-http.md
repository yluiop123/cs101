---
title: net/http 与 Web 基础
---

# 第 11 章 · net/http 与 Web 基础

**本章目标：**

- 理解 Handler 接口与 http.ServeMux 路由
- 掌握请求读取与响应写出
- 学会 JSON API 的最小可用实现

## 11.1 net/http：零依赖的 Web 服务

标准库 `net/http` 就能直接起服务——**20 行一个 API**：

```go
package main

import (
    "fmt"
    "net/http"
)

func home(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintln(w, "Hello, Web!")       // 写响应体
}

func main() {
    http.HandleFunc("/", home)           // 注册路由（模式 → 处理函数）
    http.ListenAndServe(":8080", nil)    // 监听 8080，用默认路由器
}
```

```bash
go run .
curl localhost:8080/        # Hello, Web!
```

::: info Handler 与 HandlerFunc
```go
// 核心接口：任何"能处理 HTTP 请求"的东西
type Handler interface {
    ServeHTTP(ResponseWriter, *Request)
}

// HandlerFunc：函数适配器（函数即处理器）
type HandlerFunc func(ResponseWriter, *Request)

// http.HandleFunc 内部帮你做了 func → Handler 的转换
```
第 6 章的接口思想在 Web 层的直接应用。
:::

## 11.2 ServeMux 路由（1.22 新语法）

Go 1.22 起默认路由器支持**方法匹配与路径参数**——简单服务不再需要第三方框架：

```go
func main() {
    mux := http.NewServeMux()

    // 方法 + 路径精确匹配
    mux.HandleFunc("GET /api/todos", listTodos)
    mux.HandleFunc("POST /api/todos", createTodo)
    mux.HandleFunc("GET /api/todos/{id}", getTodo)        // {id} 路径参数
    mux.HandleFunc("DELETE /api/todos/{id}", deleteTodo)

    http.ListenAndServe(":8080", mux)
}

func getTodo(w http.ResponseWriter, r *http.Request) {
    id := r.PathValue("id")               // 取路径参数（1.22+）
    fmt.Fprintln(w, "任务", id)
}
```

旧版通配规则（了解）：`/api/` 结尾斜杠 = 前缀匹配；`r.URL.Query()` 取查询参数。

## 11.3 读取请求

```go
func handle(w http.ResponseWriter, r *http.Request) {
    // 路径与查询参数
    r.URL.Path
    r.URL.Query().Get("page")             // /x?page=2 → "2"

    // 请求头
    r.Header.Get("Content-Type")
    r.Header.Get("Authorization")

    // 请求体（JSON）
    var body struct {
        Text string `json:"text"`
    }
    if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
        http.Error(w, "请求体格式错误", http.StatusBadRequest)   // 400
        return
    }

    // 表单
    r.ParseForm()
    r.FormValue("name")
}
```

## 11.4 写响应

```go
func ok(w http.ResponseWriter, data any) {
    w.Header().Set("Content-Type", "application/json")    // 头要先于 Body 写
    w.WriteHeader(http.StatusOK)                          // 状态码（默认 200）
    json.NewEncoder(w).Encode(data)
}

// 常用状态码
http.StatusOK          // 200
http.StatusCreated     // 201（POST 创建成功）
http.StatusBadRequest  // 400
http.StatusUnauthorized// 401
http.StatusNotFound    // 404
http.StatusInternalServerError // 500

// 重定向
http.Redirect(w, r, "/login", http.StatusFound)           // 302
```

::: info 自动 recover：net/http 的安全网
每个请求由独立 goroutine 处理（**天然并发**！），且 ServeHTTP 外层自动 recover panic 返回 500——单请求崩溃不会拖垮整个服务。这也意味着 handler 里可以放心并发（注意共享数据加锁）。
:::

## 11.5 中间件雏形：包装 HandlerFunc

```go
// 日志中间件：函数包装函数（装饰器思想的 Go 版）
func logging(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next(w, r)                                     // 调用下一个处理器
        slog.Info("请求", "method", r.Method, "path", r.URL.Path,
            "耗时", time.Since(start).String())
    }
}

func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("GET /api/todos", logging(listTodos))   // 手动套壳
    http.ListenAndServe(":8080", mux)
}
```

手动套壳繁琐——第 12 章的 Gin 用 `r.Use(middleware)` 一行注册。

## 11.6 JSON 待办 API（标准库完整版）

```go
package main

import (
    "encoding/json"
    "net/http"
    "strconv"
    "sync"
)

type Task struct {
    ID   int    `json:"id"`
    Text string `json:"text"`
    Done bool   `json:"done"`
}

type TodoStore struct {
    mu    sync.Mutex                       // 请求是并发的！共享数据必须加锁（第 8 章）
    tasks []Task
    nextID int
}

func (s *TodoStore) list(w http.ResponseWriter, r *http.Request) {
    s.mu.Lock()
    defer s.mu.Unlock()
    writeJSON(w, http.StatusOK, s.tasks)
}

func (s *TodoStore) create(w http.ResponseWriter, r *http.Request) {
    var body struct {
        Text string `json:"text"`
    }
    if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Text == "" {
        http.Error(w, `{"error":"text 必填"}`, http.StatusBadRequest)
        return
    }
    s.mu.Lock()
    task := Task{ID: s.nextID, Text: body.Text}
    s.nextID++
    s.tasks = append(s.tasks, task)
    s.mu.Unlock()
    writeJSON(w, http.StatusCreated, task)               // 201
}

func (s *TodoStore) remove(w http.ResponseWriter, r *http.Request) {
    id, err := strconv.Atoi(r.PathValue("id"))
    if err != nil {
        http.Error(w, "ID 非法", http.StatusBadRequest)
        return
    }
    s.mu.Lock()
    defer s.mu.Unlock()
    for i, t := range s.tasks {
        if t.ID == id {
            s.tasks = append(s.tasks[:i], s.tasks[i+1:]...)
            w.WriteHeader(http.StatusNoContent)          // 204
            return
        }
    }
    http.Error(w, `{"error":"未找到"}`, http.StatusNotFound)
}

func writeJSON(w http.ResponseWriter, status int, data any) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(data)
}

func main() {
    store := &TodoStore{nextID: 1}
    mux := http.NewServeMux()
    mux.HandleFunc("GET /api/todos", store.list)
    mux.HandleFunc("POST /api/todos", store.create)
    mux.HandleFunc("DELETE /api/todos/{id}", store.remove)
    http.ListenAndServe(":8080", mux)
}
```

Mutex（并发安全）+ ServeMux（路由）+ JSON 编解码——**一个零依赖的真实 API**。再往后就要引入框架解决"样板多、缺校验、缺鉴权"的问题了（第 12 章）。

## 本章小结

- net/http 零依赖起服务；每个请求独立 goroutine + 自动 recover
- 1.22 路由语法：`"GET /path/{id}"` + PathValue
- 响应顺序：Header → WriteHeader → Body
- 中间件 = 函数包装 HandlerFunc；共享状态用 Mutex
