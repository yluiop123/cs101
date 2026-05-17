<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'GoLand',
  description: 'GoLand 是 JetBrains 出品的 Go 语言 IDE，为 Go 开发提供智能代码分析、调试、测试和性能分析等全方位的开发体验。',
  items: [
    {
      name: '简介与安装',
      children: [
        { title: '工具简介', description: 'GoLand 基于 IntelliJ 平台，内置 Go 编译器和工具链集成。支持 Go Modules、代码补全、重构、调试器、覆盖率和性能分析。对 Go 1.21+ 的新特性（泛型、错误处理等）提供了及时更新。', groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'GoLand 官网', url: 'https://www.jetbrains.com/go/' }, { title: '文档中心', url: 'https://www.jetbrains.com/help/go/getting-started.html' }] }] },
        { title: '安装方式', description: '推荐通过 JetBrains Toolbox App 安装。支持 Windows、macOS、Linux 三大平台。提供 30 天免费试用，学生可申请免费教育授权。', groups: [{ name: '下载', icon: 'mdi-download', items: [{ title: '下载 GoLand', url: 'https://www.jetbrains.com/go/download/' }] }] },
      ]
    },
    {
      name: '核心功能',
      children: [
        { title: 'Go 代码智能', description: '智能代码补全（包括 Go 泛型）、实时错误检查、代码导航。理解 Go 的包结构、接口实现关系和并发模型，提供精准的代码建议。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: '代码导航', url: 'https://www.jetbrains.com/help/go/navigating-through-the-source-code.html' }] }] },
        { title: '调试器', description: '基于 Delve 的图形化调试器，支持断点、变量监视、表达式求值。对 goroutine 调试有专项优化，可查看各 goroutine 的堆栈和状态。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'GoLand 调试指南', url: 'https://www.jetbrains.com/help/go/debugging-code.html' }] }] },
        { title: '测试与覆盖率', description: '集成 go test，支持一键运行/调试单个测试函数。内置覆盖率可视化工具，可直观查看哪些代码行被测试覆盖。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Go 测试支持', url: 'https://www.jetbrains.com/help/go/testing.html' }] }] },
        { title: 'Go Modules 管理', description: '可视化查看和管理 Go Modules 依赖关系，支持模块版本更新、依赖图浏览、在 go.mod 中直接添加依赖。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Go Modules 支持', url: 'https://www.jetbrains.com/help/go/go-modules-support.html' }] }] },
      ]
    },
    {
      name: '进阶技巧', subtitle: '选修',
      children: [
        { title: 'SQL 数据库工具', description: '内置数据库客户端，支持 PostgreSQL、MySQL 等，可连接数据库并在 Go 代码中直接执行 SQL 语句。', optional: true },
        { title: 'Docker 集成', description: '支持 Dockerfile 编辑提示、Docker Compose 运行配置、容器内 Go 应用的调试。', optional: true },
        { title: 'Profile 分析', description: '集成 Go 性能分析工具（pprof），可直接在 IDE 中生成和查看 CPU、内存、goroutine 的 profile 火焰图。', optional: true },
        { title: 'HTTP Client', description: '内置 REST Client，支持 .http 文件，可用于快速测试开发中的 API 接口。', optional: true },
      ]
    },
  ]
}
</script>
<ContentView :data="data" />
