<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: 'Go 技术路线',
  description: 'Go 语言以简洁的并发模型和出色的性能著称，是云原生时代的首选后端语言之一。',

  items: [
    {
      name: '入门 · 环境与语法基础', subtitle: '必修',
      children: [
        {
          title: '本站原创教程：Go（14 章）',
          description: '从零开始的 Go 中文原创教程，共 14 章：前 6 章讲语法与类型系统（仅需任意语言编程经验），7-9 章进入并发、标准库与测试，10-14 章完成 CLI 工具与 Web 服务两个综合项目。建议按顺序学习，配合下方路线图逐节点对照。',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: '教程封面 · Go', url: '/tutorials/go/' },
                { title: '初识 Go', url: '/tutorials/go/01-intro' },
                { title: '基础语法与流程控制', url: '/tutorials/go/02-basic-syntax' },
                { title: '复合类型：数组、切片、map', url: '/tutorials/go/03-slices-maps' },
                { title: '函数与错误处理', url: '/tutorials/go/04-functions-errors' },
                { title: '结构体与方法', url: '/tutorials/go/05-structs-methods' },
                { title: '接口与组合', url: '/tutorials/go/06-interfaces' },
                { title: 'goroutine 与 channel', url: '/tutorials/go/07-goroutines-channels' },
                { title: '并发模式与 sync 包', url: '/tutorials/go/08-concurrency-patterns' },
                { title: '标准库精选与测试', url: '/tutorials/go/09-stdlib-testing' },
                { title: '综合实战：CLI 工具', url: '/tutorials/go/10-cli-project' },
                { title: 'net/http 与 Web 基础', url: '/tutorials/go/11-net-http' },
                { title: 'Gin 路由与中间件', url: '/tutorials/go/12-gin' },
                { title: 'GORM 数据库与 REST 实战', url: '/tutorials/go/13-gorm-rest' },
                { title: '鉴权与部署', url: '/tutorials/go/14-auth-deploy' },
              ]
            }
          ]
        },
        { title: 'Go 语言概述与环境搭建', description: 'Go 安装配置、GOPATH 与 Go Modules、IDE（GoLand/VS Code）', resources: [
          { name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Go语言之旅', url: 'https://go.dev/tour/welcome/1/' }] },
          { name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '初识 Go', url: '/tutorials/go/01-intro' }] },
        ] },
        { title: '基础语法', description: '变量与常量、数据类型（int/float/string/bool）、类型推导', resources: [
          { name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '基础语法与流程控制', url: '/tutorials/go/02-basic-syntax' }] },
        ] },
        { title: '流程控制', description: 'if/else、for 循环（Go 只有 for）、switch、goto', resources: [
          { name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '基础语法与流程控制', url: '/tutorials/go/02-basic-syntax' }] },
        ] },
        { title: '函数', description: '多返回值、命名返回值、可变参数、defer 延迟执行', resources: [
          { name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '函数与错误处理', url: '/tutorials/go/04-functions-errors' }] },
        ] },
        { title: '数组与切片', description: '数组声明、切片底层结构、append/copy、slice 扩容机制', resources: [
          { name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '复合类型：数组、切片、map', url: '/tutorials/go/03-slices-maps' }] },
        ] },
        { title: '映射 map', description: 'map 声明与初始化、增删改查、键值迭代', resources: [
          { name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '复合类型：数组、切片、map', url: '/tutorials/go/03-slices-maps' }] },
        ] },
        { title: '字符串处理', description: 'strings 包、strconv 类型转换、unicode/utf8 编码' },
        { title: '结构体与方法', description: 'struct 定义、嵌套结构体、方法接收器（值/指针）', resources: [
          { name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '结构体与方法', url: '/tutorials/go/05-structs-methods' }] },
        ] },
        { title: '接口 interface', description: '接口定义与实现、空接口、类型断言、接口组合', resources: [
          { name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '接口与组合', url: '/tutorials/go/06-interfaces' }] },
        ] },
        { title: '错误处理', description: 'error 接口、自定义错误、panic/recover 异常恢复', resources: [
          { name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '函数与错误处理', url: '/tutorials/go/04-functions-errors' }] },
        ] },
        { title: '包管理与模块化', description: 'go mod 命令、模块导入、init 函数、访问权限' },
      ]
    },
    {
      name: '进阶 · 核心机制与标准库', subtitle: '必修',
      children: [
        { title: '泛型（Go 1.18+）', description: '类型参数与类型推断、constraints 约束、泛型函数/泛型类型、与接口实现的对比取舍' },
        { title: '标准库精选', description: 'fmt 格式化、strings/strconv、time 与 duration、context 生命周期、os 文件与环境、sort 排序', resources: [
          { name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '标准库精选与测试', url: '/tutorials/go/09-stdlib-testing' }] },
        ] },
        { title: '内存分配与逃逸分析', description: '栈与堆分配、变量逃逸规则、指针与值传递的内存代价、go build -gcflags 查看逃逸' },
        { title: '垃圾回收与调试', description: '三色标记与写屏障、GC 触发时机与 GOGC 调优、finalizer、delve 调试器' },
        { title: '单元测试与基准测试', description: 'testing 包、表格驱动测试、httptest、覆盖率', resources: [
          { name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '标准库精选与测试', url: '/tutorials/go/09-stdlib-testing' }] },
        ] },
      ]
    },
    {
      name: '精通 · 并发、内存与性能', subtitle: '必修',
      children: [
        { title: 'goroutine 入门', description: 'go 关键字启动、Goroutine 调度 GMP 模型', resources: [
          { name: '视频教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Go并发编程实战', url: 'https://www.bilibili.com/video/BV1fD4y1m7TD' }] },
          { name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: 'goroutine 与 channel', url: '/tutorials/go/07-goroutines-channels' }] },
        ] },
        { title: 'channel 通信', description: '有无缓冲 channel、单向 channel、select 多路复用', resources: [
          { name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: 'goroutine 与 channel', url: '/tutorials/go/07-goroutines-channels' }] },
        ] },
        { title: 'GMP 调度模型', description: 'G/M/P 三者关系、work stealing 工作窃取、sysmon 抢占式调度、GOMAXPROCS' },
        { title: 'WaitGroup 同步', description: 'sync.WaitGroup 计数器、任务编排', resources: [
          { name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '并发模式与 sync 包', url: '/tutorials/go/08-concurrency-patterns' }] },
        ] },
        { title: 'Mutex 与 RWMutex', description: '互斥锁、读写锁、锁竞争避免', resources: [
          { name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '并发模式与 sync 包', url: '/tutorials/go/08-concurrency-patterns' }] },
        ] },
        { title: 'sync.Map 与 atomic', description: '并发安全 map、原子操作', resources: [
          { name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '并发模式与 sync 包', url: '/tutorials/go/08-concurrency-patterns' }] },
        ] },
        { title: '并发模式', description: '工作池（worker pool）、扇出/扇入（fan-out/fan-in）', resources: [
          { name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '并发模式与 sync 包', url: '/tutorials/go/08-concurrency-patterns' }] },
        ] },
        { title: 'context 包', description: '超时控制、取消传播、WithCancel/WithTimeout/WithValue' },
        { title: '竞态检测', description: 'go race detector、数据竞态排查' },
        { title: '高级并发模式', description: 'Pipeline 流水线、信号量、单例模式 sync.Once', optional: true, resources: [
          { name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '并发模式与 sync 包', url: '/tutorials/go/08-concurrency-patterns' }] },
        ] },
        { title: 'pprof 与基准性能分析', description: 'cpu/heap/goroutine profile、go test -bench 基准测试、trace 执行追踪、优化热点定位', optional: true },
        { title: 'unsafe 与 reflect', description: 'reflect 运行时反射与类型信息、unsafe.Pointer 内存操作、使用代价与边界', optional: true },
        { title: '性能优化', description: 'pprof 性能分析、trace 追踪、逃逸分析', optional: true },
        { title: 'CGO 编程', description: 'Go 调用 C 代码、类型转换、内存管理', optional: true },
      ]
    },
    {
      name: '实战与生态 · 框架、工程化与部署', subtitle: '选修',
      children: [
        { title: 'CLI 工具综合实战', description: '命令行参数解析、子命令组织、标准输入输出与错误提示，完成一个完整 CLI 项目', resources: [
          { name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '综合实战：CLI 工具', url: '/tutorials/go/10-cli-project' }] },
        ] },
        { title: 'net/http 标准库', description: '路由处理、HTTP 客户端、请求/响应处理', resources: [
          { name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: 'net/http 与 Web 基础', url: '/tutorials/go/11-net-http' }] },
        ] },
        { title: 'template 模板引擎', description: '文本/HTML 模板、模板继承' },
        { title: 'Gin 框架', description: '路由分组、中间件机制、参数绑定与验证', resources: [
          { name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Gin框架官方文档', url: 'https://gin-gonic.com/zh-cn/docs/' }] },
          { name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: 'Gin 路由与中间件', url: '/tutorials/go/12-gin' }] },
        ] },
        { title: 'RESTful API', description: 'JSON 序列化、状态码规范、版本控制', resources: [
          { name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: 'GORM 数据库与 REST 实战', url: '/tutorials/go/13-gorm-rest' }] },
        ] },
        { title: '数据库操作', description: 'database/sql 标准库、GORM ORM 框架、迁移', resources: [
          { name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'GORM官方文档', url: 'https://gorm.io/zh_CN/docs/' }] },
          { name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: 'GORM 数据库与 REST 实战', url: '/tutorials/go/13-gorm-rest' }] },
        ] },
        { title: 'Redis 集成', description: 'go-redis 库、缓存策略、分布式锁' },
        { title: '日志库', description: 'zap / logrus 结构化日志、日志级别、文件轮转' },
        { title: '中间件开发', description: '认证中间件、限流中间件、恢复中间件', optional: true, resources: [
          { name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '鉴权与部署', url: '/tutorials/go/14-auth-deploy' }] },
        ] },
        { title: 'WebSocket', description: 'gorilla/websocket 库、实时通信', optional: true },
        { title: 'gRPC 框架', description: 'Protocol Buffers 定义、protoc 编译、一元/流式 RPC', resources: [
          { name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'gRPC Go官方指南', url: 'https://grpc.io/docs/languages/go/' }] },
        ] },
        { title: '服务注册与发现', description: 'Consul / etcd / Nacos 集成' },
        { title: '配置管理', description: 'Viper 配置库、环境变量解析、热加载' },
        { title: '消息队列', description: 'RabbitMQ / Kafka Go 客户端、生产消费模式' },
        { title: 'Docker 容器化', description: '多阶段 Go 镜像构建、scratch/alpine 基础镜像' },
        { title: 'Docker Compose', description: '多服务编排、网络配置、健康检查' },
        { title: 'Kubernetes 基础', description: 'Pod/Deployment/Service/ConfigMap 资源对象', resources: [
          { name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Kubernetes官方文档', url: 'https://kubernetes.io/zh-cn/docs/' }] },
        ] },
        { title: 'Prometheus 监控', description: 'metrics 暴露、Grafana 仪表盘、AlertManager' },
        { title: '服务网格 Istio', description: '流量管理、安全策略、可观测性', optional: true },
        { title: 'Helm 包管理', description: 'Chart 结构、模板渲染、版本管理', optional: true },
        { title: 'CI/CD 流水线', description: 'GitHub Actions / GitLab CI 自动化构建与部署', optional: true, resources: [
          { name: '站内教程', icon: 'mdi-book-open-variant', items: [{ title: '鉴权与部署', url: '/tutorials/go/14-auth-deploy' }] },
        ] },
        { title: 'Go-zero / Kratos 微服务框架', description: '微服务工程化实践、代码生成', optional: true },
        { title: 'Go-kit 工具包', description: '服务分层、端点/传输层、中间件链', optional: true },
        { title: '高性能网络库', description: 'netpoll、gnet 事件驱动框架', optional: true },
        { title: '分布式追踪', description: 'OpenTelemetry Go SDK、Jaeger/Zipkin', optional: true },
        { title: '设计模式在 Go 中的应用', description: '选项模式、函数选项、策略模式', optional: true },
      ]
    },
  ]
}
</script>
<ContentView :data="data" />
