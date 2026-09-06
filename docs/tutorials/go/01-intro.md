---
title: 初识 Go
---

# 第 1 章 · 初识 Go

**本章目标：**

- 理解 Go 的设计取舍与适用场景
- 装好环境：工具链、模块系统、编辑器
- 跑通第一个程序并掌握 go 命令族

## 1.1 Go 是什么

Go 由 Google 于 2009 年发布，目标直指**大规模服务端开发**的痛点：

```text
编译慢 → Go 编译极快（秒级百万行）
依赖地狱 → 语言内置模块系统（go mod）
并发难写 → goroutine/channel 语言级支持
风格不一 → 强制统一格式（gofmt，连缩进都不用争论）
```

它的统治级领域是**云原生基础设施**：Docker、Kubernetes、etcd、Prometheus 全是 Go 写的；后端微服务、CLI 工具也是它的主场。

设计哲学：**少即是多**。关键字只有 25 个（Java 是 50+）；没有类继承、没有枚举类型、没有三元运算符——每个"缺失"背后都有替代方案（第 5、6 章揭晓）。

## 1.2 安装与验证

```bash
# 官网下载安装包（或 brew install go / 官方 zip）
go version    # go version go1.22.x ...（2026 年主流 1.22/1.23+）
```

::: tip Go 的版本策略
每 6 个月一个版本（2 月/8 月），最新两个版本受支持。本教程代码兼容 1.21+。
:::

## 1.3 第一个程序：不再需要 class

```go
// main.go
package main          // 包声明：可执行程序的入口包叫 main

import "fmt"          // 导入标准库（格式化输出）

func main() {         // 入口函数：包 main 的 main 函数
    fmt.Println("Hello, Go!")
}
```

```bash
go run main.go     # 编译 + 运行（开发常用）
go build           # 编译成可执行文件（main.exe / main）—— 部署产物！
./main.exe         # 直接运行，无需任何运行时
```

对比 Java：没有 class 包裹、没有分号、大括号必须同行——语法就这一层皮。

::: info Go 编译出的是"真"可执行文件
`go build` 产出的二进制**自带运行时**（无 JVM、无解释器依赖），拷贝到服务器就能跑——部署体验是三大脚本语言里最好的（Java 需 JRE，Python 需解释器）。
:::

## 1.4 模块系统 go mod

Go 1.16 起，依赖管理是语言内置能力（对标 Node 的 package.json）：

```bash
mkdir hello && cd hello
go mod init hello          # 初始化模块（生成 go.mod）
```

```text
# go.mod —— 模块说明书（对标 package.json）
module hello

go 1.22

require github.com/gin-gonic/gin v0.110.0   # 第三方依赖自动记录
```

```bash
go get github.com/gin-gonic/gin    # 添加依赖（自动写入 go.mod + go.sum）
go mod tidy                        # 整理依赖：补齐/删除未用的
```

`go.sum` 记录每个依赖的校验哈希（对标 pnpm-lock.yaml 的锁定作用）。

## 1.5 go 命令族速查

```bash
go run main.go        # 编译并运行（开发）
go build              # 编译产物
go test ./...         # 跑测试（第 9 章）
go fmt ./...          # 统一格式化（团队风格自动统一）
go vet ./...          # 静态检查
go install            # 安装命令行工具
gofmt -w .            # 格式化（go fmt 的底层）
```

::: info 编辑器配置
**VS Code + Go 官方扩展**（装完提示自动安装 gopls/gofmt 等工具，全点确认即可）——保存自动格式化、悬停看文档、报错即时显示。Go 的编辑器体验是"官方全家桶"，没有 Java IDEA/VS Code 之争。
:::

## 1.6 语法速写：30 秒预览

```go
package main

import "fmt"

// 变量：类型写在名字后面（与 Java 相反）
func greet(name string) string {
    return "你好，" + name
}

func main() {
    var count int = 42          // 显式类型
    total := 100                // 短变量声明（类型推断，90% 场景用这个）
    const pi = 3.14             // 常量

    if total > 50 {             // 没有小括号！大括号必须的
        fmt.Println(greet("Go"), count, total, pi)
    }

    // for 是唯一的循环关键字
    for i := 0; i < 3; i++ {
        fmt.Println(i)
    }
}
```

先眼熟三件事：**类型后置**、`:=` 短声明、**if/for 不带括号**——第 2 章正式展开。

## 1.7 动手：模块初体验

```bash
mkdir go101 && cd go101
go mod init go101
```

```go
// main.go
package main

import "fmt"

func main() {
    for i := 1; i <= 5; i++ {
        fmt.Printf("%d × 7 = %d\n", i, i*7)    // Printf 风格化输出（C 家族传统）
    }
}
```

```bash
go run .
```

`go run .`（点 = 当前包）与 `go run main.go` 等价（单文件时）；多文件项目一律用 `go run .`。

## 本章小结

- Go 为大规模服务端而生：编译快、统一格式、语言级并发
- `go run` 开发、`go build` 产出自包含二进制（部署零依赖）
- go mod 内置依赖管理：init/get/tidy（对标 package.json）
- 语法预览：类型后置、`:=`、if/for 无括号
