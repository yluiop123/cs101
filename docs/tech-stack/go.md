<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: 'Go 技术路线',
  description: 'Go 语言以简洁的并发模型和出色的性能著称，是云原生时代的首选后端语言之一。',

  items: [
    {
      name: 'Go 语言基础入门', subtitle: '必修',
      children: [
        { title: 'Go 语言概述与环境搭建', description: 'Go 安装配置、GOPATH 与 Go Modules、IDE（GoLand/VS Code）', groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "Go语言之旅", url: "https://go.dev/tour/welcome/1/", icon: "mdi-file-document-outline" }] }] },
        { title: '基础语法', description: '变量与常量、数据类型（int/float/string/bool）、类型推导' },
        { title: '流程控制', description: 'if/else、for 循环（Go 只有 for）、switch、goto' },
        { title: '函数', description: '多返回值、命名返回值、可变参数、defer 延迟执行' },
        { title: '数组与切片', description: '数组声明、切片底层结构、append/copy、slice 扩容机制' },
        { title: '映射 map', description: 'map 声明与初始化、增删改查、键值迭代' },
        { title: '字符串处理', description: 'strings 包、strconv 类型转换、unicode/utf8 编码' },
        { title: '结构体与方法', description: 'struct 定义、嵌套结构体、方法接收器（值/指针）' },
        { title: '接口 interface', description: '接口定义与实现、空接口、类型断言、接口组合' },
        { title: '错误处理', description: 'error 接口、自定义错误、panic/recover 异常恢复' },
        { title: '包管理与模块化', description: 'go mod 命令、模块导入、init 函数、访问权限' },
      ]
    },
    {
      name: '并发编程', subtitle: '必修',
      children: [
        { title: 'goroutine 入门', description: 'go 关键字启动、Goroutine 调度 GMP 模型', groups: [{ name: "视频教程", icon: "mdi-play-circle-outline", items: [{ title: "Go并发编程实战", url: "https://www.bilibili.com/video/BV1fD4y1m7TD", icon: "mdi-play-circle-outline" }] }] },
        { title: 'channel 通信', description: '有无缓冲 channel、单向 channel、select 多路复用' },
        { title: 'WaitGroup 同步', description: 'sync.WaitGroup 计数器、任务编排' },
        { title: 'Mutex 与 RWMutex', description: '互斥锁、读写锁、锁竞争避免' },
        { title: 'sync.Map 与 atomic', description: '并发安全 map、原子操作' },
        { title: '并发模式', description: '工作池（worker pool）、扇出/扇入（fan-out/fan-in）' },
        { title: 'context 包', description: '超时控制、取消传播、WithCancel/WithTimeout/WithValue' },
        { title: '竞态检测', description: 'go race detector、数据竞态排查' },
        { title: '高级并发模式', description: 'Pipeline 流水线、信号量、单例模式 sync.Once', optional: true },
      ]
    },
    {
      name: '网络编程与 Web 开发', subtitle: '必修',
      children: [
        { title: 'net/http 标准库', description: '路由处理、HTTP 客户端、请求/响应处理' },
        { title: 'template 模板引擎', description: '文本/HTML 模板、模板继承' },
        { title: 'Gin 框架', description: '路由分组、中间件机制、参数绑定与验证', groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "Gin框架官方文档", url: "https://gin-gonic.com/zh-cn/docs/", icon: "mdi-file-document-outline" }] }] },
        { title: 'RESTful API', description: 'JSON 序列化、状态码规范、版本控制' },
        { title: '数据库操作', description: 'database/sql 标准库、GORM ORM 框架、迁移', groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "GORM官方文档", url: "https://gorm.io/zh_CN/docs/", icon: "mdi-file-document-outline" }] }] },
        { title: 'Redis 集成', description: 'go-redis 库、缓存策略、分布式锁' },
        { title: '日志库', description: 'zap / logrus 结构化日志、日志级别、文件轮转' },
        { title: '单元测试与基准测试', description: 'testing 包、表格驱动测试、httptest、覆盖率' },
        { title: '中间件开发', description: '认证中间件、限流中间件、恢复中间件', optional: true },
        { title: 'WebSocket', description: 'gorilla/websocket 库、实时通信', optional: true },
      ]
    },
    {
      name: '微服务与云原生', subtitle: '必修',
      children: [
        { title: 'gRPC 框架', description: 'Protocol Buffers 定义、protoc 编译、一元/流式 RPC', groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "gRPC Go官方指南", url: "https://grpc.io/docs/languages/go/", icon: "mdi-file-document-outline" }] }] },
        { title: '服务注册与发现', description: 'Consul / etcd / Nacos 集成' },
        { title: '配置管理', description: 'Viper 配置库、环境变量解析、热加载' },
        { title: '消息队列', description: 'RabbitMQ / Kafka Go 客户端、生产消费模式' },
        { title: 'Docker 容器化', description: '多阶段 Go 镜像构建、scratch/alpine 基础镜像' },
        { title: 'Docker Compose', description: '多服务编排、网络配置、健康检查' },
        { title: 'Kubernetes 基础', description: 'Pod/Deployment/Service/ConfigMap 资源对象', groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "Kubernetes官方文档", url: "https://kubernetes.io/zh-cn/docs/", icon: "mdi-file-document-outline" }] }] },
        { title: 'Prometheus 监控', description: 'metrics 暴露、Grafana 仪表盘、AlertManager' },
        { title: '服务网格 Istio', description: '流量管理、安全策略、可观测性', optional: true },
        { title: 'Helm 包管理', description: 'Chart 结构、模板渲染、版本管理', optional: true },
        { title: 'CI/CD 流水线', description: 'GitHub Actions / GitLab CI 自动化构建与部署', optional: true },
      ]
    },
    {
      name: '进阶与生态拓展', subtitle: '选修',
      children: [
        { title: 'Go-zero / Kratos 微服务框架', description: '微服务工程化实践、代码生成', optional: true },
        { title: 'Go-kit 工具包', description: '服务分层、端点/传输层、中间件链', optional: true },
        { title: '高性能网络库', description: 'netpoll、gnet 事件驱动框架', optional: true },
        { title: '分布式追踪', description: 'OpenTelemetry Go SDK、Jaeger/Zipkin', optional: true },
        { title: '性能优化', description: 'pprof 性能分析、trace 追踪、逃逸分析', optional: true },
        { title: 'CGO 编程', description: 'Go 调用 C 代码、类型转换、内存管理', optional: true },
        { title: '设计模式在 Go 中的应用', description: '选项模式、函数选项、策略模式', optional: true },
      ]
    },
  ]
}
</script>
<ContentView :data="data" />
