---
title: GORM 数据库与 REST 实战
---

# 第 13 章 · GORM 数据库与 REST 实战

**本章目标：**

- 安装 MySQL 并用 GORM 建模
- 掌握 CRUD 与关联查询
- 把第 12 章的内存存储升级为真实数据库

## 13.1 前置：MySQL 环境

```bash
# 安装 MySQL（Windows 安装包 / brew install mysql / docker 最快）
docker run -d --name mysql -p 3306:3306 \
    -e MYSQL_ROOT_PASSWORD=123456 -e MYSQL_DATABASE=golang101 mysql:8

# 数据库基础（建库/SQL 语法）见 SQL 基础与 MySQL 教程；本章专注 Go 侧
```

## 13.2 GORM：Go 的事实标准 ORM

**ORM（对象关系映射）**= 用结构体描述表、用方法代替 SQL 拼接：

```bash
go get gorm.io/gorm
go get gorm.io/driver/mysql
```

```go
package main

import (
    "gorm.io/driver/mysql"
    "gorm.io/gorm"
)

type Task struct {
    gorm.Model                 // 内嵌：ID/CreatedAt/UpdatedAt/DeletedAt 四件套
    Text  string `gorm:"size:200;not null"`
    Done  bool   `gorm:"default:false"`
}

func openDB() (*gorm.DB, error) {
    dsn := "root:123456@tcp(127.0.0.1:3306)/golang101?charset=utf8mb4&parseTime=True&loc=Local"
    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        return nil, err
    }
    // 自动迁移：按结构体建表/补列（开发期便利；生产用迁移工具）
    if err := db.AutoMigrate(&Task{}); err != nil {
        return nil, err
    }
    return db, nil
}
```

`gorm.Model` 四件套说明：

```text
ID         主键自增
CreatedAt  创建时间（自动填充）
UpdatedAt  更新时间（自动填充）
DeletedAt  软删除标记（Delete 变成打标记，查询自动过滤 —— 不真删！）
```

## 13.3 CRUD 全景

```go
// 增
task := Task{Text: "学 GORM"}
db.Create(&task)                       // ID/CreatedAt 自动回填

// 查
var tasks []Task
db.Find(&tasks)                                    // 全量
db.Where("done = ?", false).Find(&tasks)           // 条件（? 占位防注入！）
db.First(&task, 1)                                 // 按主键查（没找到返回 ErrRecordNotFound）
db.Take(&task, "text = ?", "学 GORM")              // 条件取一条

// 改
db.Model(&task).Update("done", true)               // 单字段
db.Model(&task).Updates(Task{Done: true, Text: "改名"})   // 多字段（零值被忽略！）
db.Model(&task).Updates(map[string]any{"done": true})     // map 版保留零值

// 删（软删除：DeletedAt 打标记）
db.Delete(&task)

// 真删（很少用）
db.Unscoped().Delete(&task)

// 计数与分页
var count int64
db.Model(&Task{}).Where("done = ?", false).Count(&count)
db.Order("created_at DESC").Limit(10).Offset(20).Find(&tasks)
```

::: danger 零值更新陷阱
`Updates(Task{Done: false})` 会**跳过零值字段**（false 与"未设置"无法区分）——需要写零值时用 `map[string]any` 或 `Select` 指定字段。
:::

## 13.4 事务与错误

```go
// 事务：闭包内自动提交/回滚
err := db.Transaction(func(tx *gorm.DB) error {
    if err := tx.Create(&taskA).Error; err != nil {
        return err                     // 返回 error = 自动回滚
    }
    if err := tx.Create(&taskB).Error; err != nil {
        return err
    }
    return nil                         // nil = 提交
})

// ErrRecordNotFound：标准判断
if errors.Is(err, gorm.ErrRecordNotFound) {
    // 404
}
```

## 13.5 分层：存储接口 + 依赖注入

```go
// 存储接口：业务层不关心"存在哪"（第 6 章面向接口思想）
type TaskStore interface {
    All() ([]Task, error)
    Create(text string) (Task, error)
    Toggle(id uint) (Task, bool)
    Delete(id uint) bool
}

// GORM 实现
type gormStore struct {
    db *gorm.DB
}

func NewGormStore(db *gorm.DB) *gormStore {
    return &gormStore{db: db}
}

func (s *gormStore) All() ([]Task, error) {
    var tasks []Task
    err := s.db.Order("created_at DESC").Find(&tasks).Error
    return tasks, err
}

func (s *gormStore) Create(text string) (Task, error) {
    task := Task{Text: text}
    err := s.db.Create(&task).Error
    return task, err
}

func (s *gormStore) Toggle(id uint) (Task, bool) {
    var task Task
    if err := s.db.First(&task, id).Error; err != nil {
        return Task{}, false
    }
    s.db.Model(&task).Update("done", !task.Done)
    return task, true
}
```

## 13.6 REST 实战：Gin + GORM 全链路

```go
package main

import (
    "errors"
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)

// 复用第 12 章的 handler 骨架，把内存 Store 换成 gormStore
func main() {
    db, err := openDB()
    if err != nil {
        panic("数据库连接失败: " + err.Error())
    }
    store := NewGormStore(db)

    r := gin.Default()
    api := r.Group("/api")
    {
        api.GET("/todos", func(c *gin.Context) {
            tasks, err := store.All()
            if err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
                return
            }
            c.JSON(http.StatusOK, tasks)
        })

        api.POST("/todos", func(c *gin.Context) {
            var req struct {
                Text string `json:"text" binding:"required,min=1"`
            }
            if err := c.ShouldBindJSON(&req); err != nil {
                c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
                return
            }
            task, err := store.Create(req.Text)
            if err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
                return
            }
            c.JSON(http.StatusCreated, task)
        })

        api.PATCH("/todos/:id", func(c *gin.Context) {
            id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
            task, ok := store.Toggle(uint(id))
            if !ok {
                c.JSON(http.StatusNotFound, gin.H{"error": "未找到"})
                return
            }
            c.JSON(http.StatusOK, task)
        })
    }

    r.Run(":8080")
}
```

```bash
go run .
curl -X POST localhost:8080/api/todos -H "Content-Type: application/json" -d '{"text":"学 GORM"}'
curl localhost:8080/api/todos
# 重启服务数据还在 —— 真持久化达成
```

## 13.7 关联查询一瞥

```go
// 一对多：清单 → 任务
type List struct {
    gorm.Model
    Name  string
    Tasks []Task               // has-many
}

type Task struct {
    gorm.Model
    Text  string
    Done  bool
    ListID uint             // 外键（ListID = List 的 ID）
}

// 预加载（避免 N+1 查询）
db.Preload("Tasks").Find(&lists)
// lists[0].Tasks 直接可用

// 反向：查任务连同所属清单
db.Preload("List").Find(&tasks)
```

## 本章小结

- GORM：gorm.Model 四件套 + AutoMigrate + DSN 连接
- CRUD 方法族；零值更新用 map；软删除是默认行为
- 存储接口 + GORM 实现：业务与存储解耦（可换可测）
- Preload 解 N+1；事务用 Transaction 闭包
