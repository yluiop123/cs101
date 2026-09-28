<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: 'C# 技术路线',
  description: 'C# 是微软推出的现代化编程语言，在游戏开发（Unity）、企业应用和桌面开发领域占据重要地位。',

  items: [
    {
      name: '入门 · 环境与语法基础',
      subtitle: '必修',
      children: [
        {
          title: 'C# 语法核心',
          description: '数据类型、运算符、流程控制、数组与字符串',
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '尚硅谷 C# 教程', url: 'https://www.bilibili.com/video/BV1vK411n7Wn', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '菜鸟教程 C#', url: 'https://www.runoob.com/csharp/csharp-tutorial.html', icon: 'mdi-file-document-outline' },
                { title: 'Microsoft C# Docs', url: 'https://docs.microsoft.com/en-us/dotnet/csharp/', icon: 'mdi-file-document-outline' },
                { title: 'Microsoft Learn', url: 'https://docs.microsoft.com/zh-cn/learn/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'dotnet CLI 与项目结构',
          description: '.NET SDK 安装、dotnet new/build/run 命令、csproj 与 sln 解决方案组织'
        },
        {
          title: 'NuGet 包管理',
          description: '包源与版本范围、dotnet add package、中央包管理与私有源'
        },
        {
          title: 'IDE 与调试',
          description: 'Rider 与 Visual Studio、断点/监视/即时窗口、热重载与诊断工具'
        },
        {
          title: '类型系统总览',
          description: '值类型与引用类型、装箱与拆箱、栈与堆的存储差异'
        },
        {
          title: '面向对象编程',
          description: '类与对象、继承、多态、接口、抽象类',
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'C# OOP 教程', url: 'https://www.bilibili.com/video/BV1qJ411j7Xe', icon: 'mdi-play-circle-outline' },
                { title: 'IAmTimCorey OOP', url: 'https://youtube.com/playlist?list=PLrTbP4W4gjnqC4Ud3wXR_Jp23K5IQb7_J', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Microsoft OOP Guide', url: 'https://docs.microsoft.com/en-us/dotnet/csharp/fundamentals/tutorials/oop', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        }
      ]
    },
    {
      name: '进阶 · 类型系统与基础库',
      subtitle: '必修',
      children: [
        {
          title: '泛型与集合',
          description: 'List、Dictionary、LINQ 查询、泛型约束'
        },
        {
          title: '委托与事件',
          description: 'delegate、event、Action/Func、Lambda 表达式'
        },
        {
          title: '异常处理与文件 IO',
          description: 'try-catch-finally 语义、异常过滤与自定义异常、StreamReader/Writer、异步文件操作'
        },
        {
          title: 'LINQ 与 IEnumerable',
          description: '延迟执行与表达式树、标准查询运算符、IEnumerable 与 IQueryable 的区别'
        },
        {
          title: '扩展方法与部分类',
          description: '静态扩展方法、partial 类与分部方法、源生成器初探'
        },
        {
          title: '属性、索引器与记录类型',
          description: '自动属性与后备字段、索引器实现、record 与 class/struct 的取舍'
        },
        {
          title: '可空引用类型',
          description: 'NRT 注解与流分析、nullable 上下文开关、告警升级与代码规约'
        },
        {
          title: '模式匹配',
          description: 'is 模式与 switch 表达式、结构模式、位置模式与递归模式'
        },
        {
          title: '字符串与 Span 基础',
          description: '字符串不可变性与内部结构、字符串插值与 StringBuilder、文化与敏感比较'
        },
        {
          title: '反射与 Attribute',
          description: 'Type 与 MemberInfo 查询、自定义 Attribute 定义与运行时读取、与框架扫描机制的关系'
        }
      ]
    },
    {
      name: '精通 · 异步、内存与运行时',
      subtitle: '必修',
      children: [
        {
          title: 'async/await 与 Task 状态机',
          description: 'Task 与 ValueTask、异步状态机原理、ConfigureAwait 与死锁场景、取消与进度报告'
        },
        {
          title: '线程与 Task 并行',
          description: '线程池调度、Parallel 与 PLINQ、WhenAll/WhenAny 与并行度控制'
        },
        {
          title: 'lock、Interlocked 与并发集合',
          description: '监视器与竞态条件、原子操作、ConcurrentQueue/Channel 与生产者消费者模型'
        },
        {
          title: 'GC 分代与 Dispose/终结器',
          description: '分代回收与大对象堆、IDisposable 规范模式、using 声明与终结器的关系'
        },
        {
          title: 'Span<T>/Memory<T> 与高性能编码',
          description: '栈上内存与 ref struct、避免分配与拷贝、SIMD 与向量化处理'
        },
        {
          title: '.NET 运行时',
          description: 'CLR、GC 垃圾回收、JIT 编译、程序集（Assembly）',
          resources: [
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '.NET 官方文档', url: 'https://docs.microsoft.com/zh-cn/dotnet/', icon: 'mdi-file-document-outline' },
                { title: 'Microsoft .NET Docs', url: 'https://docs.microsoft.com/en-us/dotnet/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'CLR/JIT/AOT 与 ReadyToRun',
          description: 'IL 与 JIT 分层编译、NativeAOT 与 ReadyToRun 映像、启动与体积权衡'
        },
        {
          title: '性能剖析',
          description: 'BenchmarkDotNet 微基准、dotnet-counters/dotnet-trace/dotnet-dump 定位瓶颈'
        }
      ]
    },
    {
      name: '实战与生态 · .NET 框架、工程化与部署',
      subtitle: '选修',
      children: [
        {
          title: 'ASP.NET Core Web API',
          description: '控制器、路由、中间件、依赖注入',
          optional: true,
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '尚硅谷 .NET Core', url: 'https://www.bilibili.com/video/BV1c4411E7iS', icon: 'mdi-play-circle-outline' },
                { title: 'FreeCodeCamp ASP.NET', url: 'https://www.youtube.com/watch?v=ZxQ0JUMz-wE', icon: 'mdi-play-circle-outline' },
                { title: 'IAmTimCorey', url: 'https://www.youtube.com/@IAmTimCorey', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'ASP.NET Core 官方文档', url: 'https://docs.microsoft.com/zh-cn/aspnet/core/', icon: 'mdi-file-document-outline' },
                { title: 'Microsoft ASP.NET Docs', url: 'https://docs.microsoft.com/en-us/aspnet/core/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'ASP.NET Core 最小 API 与 MVC',
          description: '端点路由与控制器两种风格、Model-View-Controller 分层、模型绑定与过滤器',
          optional: true
        },
        {
          title: '中间件管道与依赖注入',
          description: '请求管道顺序与自定义中间件、服务生命周期、Options 模式与容器最佳实践',
          optional: true
        },
        {
          title: '认证与授权',
          description: 'JWT Bearer 与 ASP.NET Identity、策略/角色/声明授权、Cookie 与外部登录集成',
          optional: true
        },
        {
          title: 'Entity Framework Core',
          description: 'Code First、迁移、LINQ 查询、关系映射',
          optional: true
        },
        {
          title: 'Entity Framework Core 进阶',
          description: '迁移策略与并发冲突处理、变更跟踪模式、编译查询与 N+1 性能优化',
          optional: true
        },
        {
          title: 'gRPC 与消息通信',
          description: 'Protobuf 契约定义、四种调用模式、RabbitMQ/Kafka 异步消息集成',
          optional: true
        },
        {
          title: '单元测试',
          description: 'xUnit 测试组织与断言、Moq 依赖模拟、测试覆盖率与 CI 集成',
          optional: true
        },
        {
          title: '日志与可观测性',
          description: 'ILogger 结构化日志、OpenTelemetry 分布式追踪、健康检查与指标暴露',
          optional: true
        },
        {
          title: 'REST API 设计',
          description: 'Swagger/OpenAPI、版本控制、认证（JWT）',
          optional: true
        },
        {
          title: 'Blazor',
          description: 'WebAssembly 和 Server 模式、组件化 UI、数据绑定',
          optional: true
        },
        {
          title: '微服务架构',
          description: '.NET 微服务、gRPC、Ocelot 网关、Dapper ORM',
          optional: true,
          resources: [
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '.NET 微服务架构指南', url: 'https://docs.microsoft.com/en-us/dotnet/architecture/microservices/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'Unity 引擎入门',
          description: '场景编辑、预制体、物理系统、协程',
          optional: true,
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Unity 中文教程', url: 'https://www.bilibili.com/video/BV1ct41137aX', icon: 'mdi-play-circle-outline' },
                { title: 'Brackeys Unity', url: 'https://www.youtube.com/@Brackeys', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Unity 官方教程', url: 'https://learn.unity.com/', icon: 'mdi-file-document-outline' },
                { title: 'Unity Manual', url: 'https://docs.unity3d.com/Manual/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'C# 脚本进阶',
          description: 'MonoBehaviour 生命周期、协程、序列化、JSON 数据持久化',
          optional: true
        },
        {
          title: 'Godot 引擎',
          description: 'GDScript 对比 C#、场景树、信号系统',
          optional: true,
          resources: [
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Godot 官方文档', url: 'https://docs.godotengine.org/', icon: 'mdi-file-document-outline' },
                { title: 'Godot C# 教程', url: 'https://docs.godotengine.org/en/stable/tutorials/scripting/csharp/index.html', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'WPF 桌面应用',
          description: 'XAML、数据绑定、MVVM 模式、控件模板',
          optional: true,
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'WPF 入门教程', url: 'https://www.bilibili.com/video/BV1VJ411h7cF', icon: 'mdi-play-circle-outline' },
                { title: 'IAmTimCorey WPF', url: 'https://youtube.com/playlist?list=PLrTbP4W4gjnqM1f9WQMiJA9y0Qpms6Yrn', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Microsoft WPF Docs', url: 'https://docs.microsoft.com/en-us/dotnet/desktop/wpf/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'MAUI 跨平台',
          description: '单一项目支持 Android/iOS/Windows/Mac',
          optional: true
        }
      ]
    }
  ]
}
</script>
<ContentView :data="data" />
