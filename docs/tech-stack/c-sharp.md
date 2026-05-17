<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: 'C# 技术路线',
  description: 'C# 是微软推出的现代化编程语言，在游戏开发（Unity）、企业应用和桌面开发领域占据重要地位。',

  items: [
    {
      name: 'C# 语言基础',
      subtitle: '必修',
      children: [
        {
          title: 'C# 语法核心',
          description: '数据类型、运算符、流程控制、数组与字符串',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 C# 教程", url: "https://www.bilibili.com/video/BV1vK411n7Wn", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 C#", url: "https://www.runoob.com/csharp/csharp-tutorial.html", icon: "mdi-file-document-outline" },
                { title: "Microsoft C# Docs", url: "https://docs.microsoft.com/en-us/dotnet/csharp/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '面向对象编程',
          description: '类与对象、继承、多态、接口、抽象类',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "C# OOP 教程", url: "https://www.bilibili.com/video/BV1qJ411j7Xe", icon: "mdi-play-circle-outline" },
                { title: "IAmTimCorey OOP", url: "https://youtube.com/playlist?list=PLrTbP4W4gjnqC4Ud3wXR_Jp23K5IQb7_J", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Microsoft OOP Guide", url: "https://docs.microsoft.com/en-us/dotnet/csharp/fundamentals/tutorials/oop", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
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
          description: 'try-catch、StreamReader/Writer、异步文件操作'
        }
      ]
    },
    {
      name: '.NET 框架',
      subtitle: '必修',
      children: [
        {
          title: '.NET 运行时',
          description: 'CLR、GC 垃圾回收、JIT 编译、程序集（Assembly）',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: ".NET 官方文档", url: "https://docs.microsoft.com/zh-cn/dotnet/", icon: "mdi-file-document-outline" },
                { title: "Microsoft .NET Docs", url: "https://docs.microsoft.com/en-us/dotnet/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'ASP.NET Core Web API',
          description: '控制器、路由、中间件、依赖注入',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 .NET Core", url: "https://www.bilibili.com/video/BV1c4411E7iS", icon: "mdi-play-circle-outline" },
                { title: "FreeCodeCamp ASP.NET", url: "https://www.youtube.com/watch?v=ZxQ0JUMz-wE", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "ASP.NET Core 官方文档", url: "https://docs.microsoft.com/zh-cn/aspnet/core/", icon: "mdi-file-document-outline" },
                { title: "Microsoft ASP.NET Docs", url: "https://docs.microsoft.com/en-us/aspnet/core/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Entity Framework Core',
          description: 'Code First、迁移、LINQ 查询、关系映射'
        },
        {
          title: 'REST API 设计',
          description: 'Swagger/OpenAPI、版本控制、认证（JWT）'
        },
        {
          title: 'Blazor',
          description: 'WebAssembly 和 Server 模式、组件化 UI、数据绑定'
        }
      ]
    },
    {
      name: '游戏开发',
      subtitle: '选修',
      children: [
        {
          title: 'Unity 引擎入门',
          description: '场景编辑、预制体、物理系统、协程',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Unity 中文教程", url: "https://www.bilibili.com/video/BV1ct41137aX", icon: "mdi-play-circle-outline" },
                { title: "Brackeys Unity", url: "https://www.youtube.com/@Brackeys", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Unity 官方教程", url: "https://learn.unity.com/", icon: "mdi-file-document-outline" },
                { title: "Unity Manual", url: "https://docs.unity3d.com/Manual/", icon: "mdi-file-document-outline" }
              ],
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
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Godot 官方文档", url: "https://docs.godotengine.org/", icon: "mdi-file-document-outline" },
                { title: "Godot C# 教程", url: "https://docs.godotengine.org/en/stable/tutorials/scripting/csharp/index.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        }
      ]
    },
    {
      name: '企业级与桌面开发',
      subtitle: '选修',
      children: [
        {
          title: 'WPF 桌面应用',
          description: 'XAML、数据绑定、MVVM 模式、控件模板',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "WPF 入门教程", url: "https://www.bilibili.com/video/BV1VJ411h7cF", icon: "mdi-play-circle-outline" },
                { title: "IAmTimCorey WPF", url: "https://youtube.com/playlist?list=PLrTbP4W4gjnqM1f9WQMiJA9y0Qpms6Yrn", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Microsoft WPF Docs", url: "https://docs.microsoft.com/en-us/dotnet/desktop/wpf/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'MAUI 跨平台',
          description: '单一项目支持 Android/iOS/Windows/Mac',
          optional: true
        },
        {
          title: '微服务架构',
          description: '.NET 微服务、gRPC、Ocelot 网关、Dapper ORM',
          optional: true,
          resources: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: ".NET 微服务架构指南", url: "https://docs.microsoft.com/en-us/dotnet/architecture/microservices/", icon: "mdi-file-document-outline" }] }]
        }
      ]
    },
    {
      name: '学习资源推荐',
      children: [
        {
          title: 'Microsoft Learn',
          description: 'C# 和 .NET 交互式教程',
          resources: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "Microsoft Learn", url: "https://docs.microsoft.com/zh-cn/learn/", icon: "mdi-file-document-outline" }] }]
        },
        {
          title: '.NET 官方文档',
          description: '完整的框架参考',
          resources: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: ".NET 官方文档", url: "https://docs.microsoft.com/en-us/dotnet/", icon: "mdi-file-document-outline" }] }]
        },
        {
          title: 'Unity Learn',
          description: 'Unity 游戏开发教程',
          resources: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "Unity Learn", url: "https://learn.unity.com/", icon: "mdi-file-document-outline" }] }]
        },
        {
          title: 'Brackeys',
          description: 'Unity 最受欢迎的教程频道',
          resources: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "Brackeys", url: "https://www.youtube.com/@Brackeys", icon: "mdi-file-document-outline" }] }]
        },
        {
          title: 'IAmTimCorey',
          description: 'C#/.NET 全栈开发教程',
          resources: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "IAmTimCorey", url: "https://www.youtube.com/@IAmTimCorey", icon: "mdi-file-document-outline" }] }]
        }
      ]
    }
  ]
}
</script>
<ContentView :data="data" />
