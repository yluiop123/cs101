---
title: 鉴权与部署
---

# 第 14 章 · 鉴权与部署

**本章目标：**

- 实现 JWT 登录鉴权全流程
- 掌握 Gin 中间件保护路由
- 学会编译部署与环境变量管理

## 14.1 认证方案：JWT 是什么

**JWT（JSON Web Token）**= 服务端签名的令牌，客户端每次请求携带：

```text
登录 → 服务端签发 token（含用户 ID + 过期时间 + 签名）
请求 → Header 带 Authorization: Bearer <token>
校验 → 服务端验签 + 查过期，通过则放行
```

无状态（服务端不用存 session）是它成为**前后端分离/微服务标配**的原因。Go 生态用 `golang-jwt` 库：

```bash
go get github.com/golang-jwt/jwt/v5
```

## 14.2 用户模型与密码哈希

```go
import "golang.org/x/crypto/bcrypt"    // go get golang.org/x/crypto

type User struct {
    gorm.Model
    Username string `gorm:"uniqueIndex;size:50" json:"username"`
    Password string `gorm:"size:100" json:"-"`            // 永不序列化！
}

// 注册：密码绝不存明文 —— bcrypt 哈希
func hashPassword(plain string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(plain), bcrypt.DefaultCost)
    return string(bytes), err
}

// 登录：比对哈希
func checkPassword(hash, plain string) bool {
    return bcrypt.CompareHashAndPassword([]byte(hash), []byte(plain)) == nil
}
```

## 14.3 签发与校验 JWT

```go
import (
    "time"
    "github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))      // 密钥从环境变量读（绝不硬编码）

type Claims struct {
    UserID uint   `json:"user_id"`
    jwt.RegisteredClaims                             // 标准字段（exp/iat/jti...）
}

// 签发
func issueToken(userID uint) (string, error) {
    claims := Claims{
        UserID: userID,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
            IssuedAt:  jwt.NewNumericDate(time.Now()),
            Issuer:    "go101",
        },
    }
    return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(jwtSecret)
}

// 校验
func parseToken(tokenStr string) (*Claims, error) {
    claims := &Claims{}
    _, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (any, error) {
        if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {     // 防算法替换攻击
            return nil, errors.New("非法签名算法")
        }
        return jwtSecret, nil
    })
    if err != nil {
        return nil, err
    }
    return claims, nil
}
```

## 14.4 Gin 中间件保护路由

```go
func Auth() gin.HandlerFunc {
    return func(c *gin.Context) {
        header := c.GetHeader("Authorization")
        if !strings.HasPrefix(header, "Bearer ") {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "缺少凭证"})
            return
        }
        claims, err := parseToken(strings.TrimPrefix(header, "Bearer "))
        if err != nil {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "凭证无效"})
            return
        }
        c.Set("userID", claims.UserID)      // 传给下游处理函数
        c.Next()
    }
}

func main() {
    r := gin.Default()

    auth := r.Group("/api/auth")
    {
        auth.POST("/register", register)     // 注册（无需 token）
        auth.POST("/login", login)           // 登录（无需 token）
    }

    api := r.Group("/api")
    api.Use(Auth())                          // 以下全部需要 token
    {
        api.GET("/todos", list)
        api.POST("/todos", create)
    }
    r.Run(":8080")
}

// 登录处理
func login(c *gin.Context) {
    var req struct {
        Username string `json:"username" binding:"required"`
        Password string `json:"password" binding:"required"`
    }
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    var user User
    if err := db.Where("username = ?", req.Username).First(&user).Error; err != nil ||
        !checkPassword(user.Password, req.Password) {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "用户名或密码错误"})   // 模糊提示（防撞库探测）
        return
    }

    token, err := issueToken(user.ID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "签发失败"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"token": token})
}

// 受保护的处理函数：从中间件取用户
func create(c *gin.Context) {
    userID := c.GetUint("userID")
    // ... 创建任务时记录 task.UserID = userID（数据隔离）
}
```

## 14.5 配置管理：环境变量

```go
// config.go —— 启动时统一读取并校验
type Config struct {
    Port      string
    DBDSN     string
    JWTSecret string
}

func LoadConfig() (*Config, error) {
    cfg := &Config{
        Port:      getenv("PORT", "8080"),
        DBDSN:     os.Getenv("DB_DSN"),
        JWTSecret: os.Getenv("JWT_SECRET"),
    }
    if cfg.DBDSN == "" || cfg.JWTSecret == "" {
        return nil, errors.New("缺少必需环境变量：DB_DSN / JWT_SECRET")
    }
    return cfg, nil
}

func getenv(key, fallback string) string {
    if v := os.Getenv(key); v != "" {
        return v
    }
    return fallback
}
```

```bash
# 本地：.env 文件（gitignore！）或直接设置
export JWT_SECRET=$(openssl rand -hex 32)
# 生产：密钥来自密钥管理服务，绝不进代码库
```

## 14.6 部署：单文件二进制的胜利

```bash
# 交叉编译：在 Mac/Windows 上直接编译 Linux 产物
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o todo-server .

# 上传服务器（或 CI 产物）直接运行
chmod +x todo-server
JWT_SECRET=xxx DB_DSN="..." PORT=8080 ./todo-server
```

### Dockerfile（标准 Go 部署形态）

```dockerfile
# 多阶段构建：编译环境与运行环境分离
FROM golang:1.22 AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download                      # 先缓存依赖层
COPY . .
RUN CGO_ENABLED=0 go build -o /server .

# 运行镜像：极小（无 Go 工具链）
FROM alpine:3.19
COPY --from=builder /server /server
EXPOSE 8080
ENTRYPOINT ["/server"]
```

```bash
docker build -t todo-server .
docker run -p 8080:8080 -e JWT_SECRET=xxx -e DB_DSN="..." todo-server
```

::: info 静态二进制 + CGO_ENABLED=0
Go 默认可静态编译；关闭 CGO 后二进制不依赖系统 libc——**Scratch/alpine 极简镜像**的前提。Docker 系统知识见 Docker 教程（运维系列）。
:::

### systemd 托管（裸机部署）

```ini
# /etc/systemd/system/todo.service
[Unit]
Description=Todo Server
After=network.target

[Service]
ExecStart=/opt/todo/todo-server
EnvironmentFile=/opt/todo/.env
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
systemctl enable --now todo    # 开机自启 + 立即启动
```

## 14.7 Go Web 全链路自查清单

- [ ] 密码 bcrypt 哈希、响应永不带密码（`json:"-"`）
- [ ] JWT 密钥走环境变量；校验签名算法
- [ ] 鉴权中间件 `c.Set("userID")` 传数据，按用户隔离数据
- [ ] 错误响应统一格式；模糊登录错误提示
- [ ] CGO_ENABLED=0 交叉编译 + 多阶段 Docker 构建
- [ ] 环境变量三件套：PORT / DB_DSN / JWT_SECRET

## 本章小结

- JWT 无状态鉴权：签发（登录）→ 携带（Header）→ 校验（中间件）
- bcrypt 哈希密码；`json:"-"` 隐藏敏感字段
- Go 部署优势：交叉编译单文件；Docker 多阶段构建压到极小
- 配置全走环境变量，密钥绝不硬编码

**Go 教程全 14 章完** 🎉 —— 后端批次 1 继续：Rust（第 1 章从所有权讲起）。
