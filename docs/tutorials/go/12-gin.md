---
title: Gin 路由与中间件
---

# 第 12 章 · Gin 路由与中间件

**本章目标：**

- 安装 Gin 并理解路由分组
- 掌握参数绑定（JSON/URI/Query）与校验
- 学会编写中间件与统一错误处理

## 12.1 为什么需要 Web 框架

标准库 API 写到 5 个接口就露出痛点：

```text
① 每个接口手动 json.NewDecoder/Encoder 样板
② 参数校验手写 if
③ 中间件手动套壳
④ 错误响应格式不统一
```

**Gin** 是 Go 最流行的 Web 框架（API 性能标杆）：路由树高效、绑定+校验内置、中间件生态齐全。

```bash
go get github.com/gin-gonic/gin
```

## 12.2 第一个 Gin 服务

```go
package main

import (
    "net/http"
    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()                       // 引擎 + 日志/恢复两个默认中间件

    r.GET("/ping", func(c *gin.Context) {    // 上下文贯穿整个请求
        c.JSON(http.StatusOK, gin.H{         // gin.H = map[string]any 简写
            "message": "pong",
        })
    })

    r.Run(":8080")                           // 监听（内部封装 http.ListenAndServe）
}
```

`c *gin.Context` 是 Gin 的核心对象：取参数、绑数据、写响应全靠它。

## 12.3 路由与参数

```go
r := gin.Default()

// 路径参数
r.GET("/todos/:id", func(c *gin.Context) {
    id := c.Param("id")                      // /todos/3 → "3"
    c.String(200, "任务 %s", id)
})

// 查询参数（?page=2&size=10）
r.GET("/todos", func(c *gin.Context) {
    page := c.DefaultQuery("page", "1")      // 带默认值
    size := c.Query("size")
    c.JSON(200, gin.H{"page": page, "size": size})
})

// 路由分组：统一前缀 + 共享中间件
api := r.Group("/api")
{
    v1 := api.Group("/v1")
    {
        v1.GET("/todos", listHandler)
        v1.POST("/todos", createHandler)
    }
}
// /api/v1/todos
```

## 12.4 参数绑定：ShouldBindJSON

**绑定（binding）**= 反序列化 + 校验一步到位：

```go
type CreateTodoReq struct {
    Text  string `json:"text" binding:"required,min=1,max=200"`   // 校验标签
    Tags  []string `json:"tags" binding:"omitempty,dive,min=1"`
}

func create(c *gin.Context) {
    var req CreateTodoReq
    if err := c.ShouldBindJSON(&req); err != nil {          // 绑定+校验失败
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusCreated, gin.H{"id": 1, "text": req.Text})
}
```

常用校验标签（validator 库）：

```text
required 必填    min/max 长度或数值    email 邮箱格式
oneof=a b 枚举   gt/gte/lt/lte 数值比较   dive 逐元素校验
```

其他绑定源：

```go
c.ShouldBindUri(&req)      // 路径参数绑定
c.ShouldBindQuery(&req)    // 查询参数绑定
```

## 12.5 中间件：洋葱模型

```go
// 中间件签名：c.Next() 前是"进入"，之后是"返回"（洋葱包裹）
func Timer() gin.HandlerFunc {
    return func(c *gin.Context) {
        start := time.Now()
        c.Next()                                    // 执行后续处理链
        cost := time.Since(start)
        slog.Info("请求", "path", c.Request.URL.Path, "耗时", cost)
    }
}

// 认证中间件：未通过就中断链（不调 c.Next，直接返回）
func Auth() gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")
        if token == "" {
            c.AbortWithStatusJSON(http.StatusUnauthorized,
                gin.H{"error": "未登录"})           // 中断后续处理
            return
        }
        c.Set("userID", parseToken(token))          // 向下游传数据
        c.Next()
    }
}

// 注册
r := gin.Default()
r.Use(Timer())                                     // 全局
api := r.Group("/api", Auth())                     // 组级
api.GET("/me", func(c *gin.Context) {
    userID, _ := c.Get("userID")                   // 取上游中间件的数据
    c.JSON(200, gin.H{"user": userID})
})
```

对照第 11 章手动包装——`Use()` 让中间件按声明顺序自动组成洋葱。

## 12.6 统一错误响应与 panic 恢复

```go
// gin.Default 自带 Recovery 中间件：panic 自动变 500（服务不倒）

// 自定义错误处理中间件：统一响应格式
func ErrorHandler() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Next()
        if len(c.Errors) > 0 {                     // 收集处理链中的错误
            err := c.Errors.Last().Err
            c.JSON(http.StatusInternalServerError, gin.H{
                "code":    500,
                "message": err.Error(),
            })
        }
    }
}

// 业务处理函数中：c.Error(err) 上报，让中间件统一输出
func list(c *gin.Context) {
    tasks, err := store.All()
    if err != nil {
        c.Error(err)
        return
    }
    c.JSON(200, tasks)
}
```

## 12.7 综合练习：Gin 版待办 API

```go
package main

import (
    "net/http"
    "strconv"
    "sync"
    "github.com/gin-gonic/gin"
)

type Task struct {
    ID   int    `json:"id"`
    Text string `json:"text"`
    Done bool   `json:"done"`
}

type Store struct {
    mu     sync.Mutex
    tasks  []Task
    nextID int
}

func (s *Store) All() []Task {
    s.mu.Lock()
    defer s.mu.Unlock()
    return append([]Task(nil), s.tasks...)       // 拷贝防外部修改
}

func (s *Store) Create(text string) Task {
    s.mu.Lock()
    defer s.mu.Unlock()
    task := Task{ID: s.nextID, Text: text}
    s.nextID++
    s.tasks = append(s.tasks, task)
    return task
}

func (s *Store) Toggle(id int) (Task, bool) {
    s.mu.Lock()
    defer s.mu.Unlock()
    for i := range s.tasks {
        if s.tasks[i].ID == id {
            s.tasks[i].Done = !s.tasks[i].Done
            return s.tasks[i], true
        }
    }
    return Task{}, false
}

func (s *Store) Delete(id int) bool {
    s.mu.Lock()
    defer s.mu.Unlock()
    for i, t := range s.tasks {
        if t.ID == id {
            s.tasks = append(s.tasks[:i], s.tasks[i+1:]...)
            return true
        }
    }
    return false
}

func main() {
    store := &Store{nextID: 1}
    r := gin.Default()

    api := r.Group("/api")
    {
        api.GET("/todos", func(c *gin.Context) {
            c.JSON(http.StatusOK, store.All())
        })

        api.POST("/todos", func(c *gin.Context) {
            var req struct {
                Text string `json:"text" binding:"required,min=1"`
            }
            if err := c.ShouldBindJSON(&req); err != nil {
                c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
                return
            }
            c.JSON(http.StatusCreated, store.Create(req.Text))
        })

        api.PATCH("/todos/:id", func(c *gin.Context) {
            id, _ := strconv.Atoi(c.Param("id"))
            task, ok := store.Toggle(id)
            if !ok {
                c.JSON(http.StatusNotFound, gin.H{"error": "未找到"})
                return
            }
            c.JSON(http.StatusOK, task)
        })

        api.DELETE("/todos/:id", func(c *gin.Context) {
            id, _ := strconv.Atoi(c.Param("id"))
            if !store.Delete(id) {
                c.JSON(http.StatusNotFound, gin.H{"error": "未找到"})
                return
            }
            c.Status(http.StatusNoContent)
        })
    }

    r.Run(":8080")
}
```

## 本章小结

- Gin：`gin.Default()` 自带日志+Recovery；`c *gin.Context` 贯穿请求
- ShouldBindJSON + validator 标签 = 绑定校验一步到位
- 中间件洋葱模型：`c.Next()` 前后分"进/出"；`c.Abort` 中断、`c.Set/Get` 传值
- 路由分组统一前缀与中间件；完整 CRUD 不过百行
