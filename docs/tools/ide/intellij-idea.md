<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'IntelliJ IDEA',
  description: 'IntelliJ IDEA 是 JetBrains 出品的 Java 集成开发环境，以其智能的代码分析、强大的重构能力和丰富的插件生态成为 Java 开发的行业标准。',
  items: [
    {
      name: '简介与安装',
      children: [
        { title: '工具简介', description: 'IntelliJ IDEA 提供 Ultimate（付费）和 Community（免费开源）两个版本。Ultimate 版支持更多企业级特性（Spring、Jakarta EE、数据库工具等），Community 版适合 Java SE 和 Android 开发。', groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'IntelliJ IDEA 官网', url: 'https://www.jetbrains.com/idea/' }, { title: '文档中心', url: 'https://www.jetbrains.com/help/idea/getting-started.html' }] }] },
        { title: '安装方式', description: '支持 Windows、macOS、Linux。Windows 提供 .exe 安装器和 JetBrains Toolbox App，推荐使用 Toolbox App 管理多个 JetBrains IDE 的安装和更新。', groups: [{ name: '下载', icon: 'mdi-download', items: [{ title: '下载 IntelliJ IDEA', url: 'https://www.jetbrains.com/idea/download/' }, { title: 'Toolbox App', url: 'https://www.jetbrains.com/toolbox-app/' }] }, { name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'IDEA 安装配置教程（Bilibili）', url: 'https://www.bilibili.com/video/BV1DJ411D7qP' }] }] },
      ]
    },
    {
      name: '核心功能',
      children: [
        { title: '代码智能与导航', description: '深度代码分析、上下文感知的代码补全、即时错误高亮、快速修复建议。支持类/方法/文件的快速跳转，查看继承层次和调用关系图。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'IntelliJ IDEA 导航技巧', url: 'https://www.jetbrains.com/help/idea/navigating-through-the-source-code.html' }] }] },
        { title: '重构引擎', description: 'JetBrains 的重构能力业界领先，支持重命名、提取方法/变量/接口、内联、移动、更改签名等数十种重构操作，且重构前后代码语法正确。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: '重构手册', url: 'https://www.jetbrains.com/help/idea/refactoring-source-code.html' }] }] },
        { title: '调试与测试', description: '支持条件断点、表达式求值、变量监视、帧回退等高级调试功能。深度集成 JUnit、TestNG、Mockito 等测试框架。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: '调试入门', url: 'https://www.jetbrains.com/help/idea/debugging-code.html' }] }] },
        { title: '构建工具集成', description: '原生支持 Maven 和 Gradle，自动解析依赖、执行构建任务。内置 HTTP Client 可用于快速测试 REST API。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Maven 集成', url: 'https://www.jetbrains.com/help/idea/maven-support.html' }] }] },
      ]
    },
    {
      name: '进阶技巧', subtitle: '选修',
      children: [
        { title: 'Live Templates', description: '通过预设代码模板快速生成常见代码结构（如 psfs、fori、try-catch），也可自定义模板提升编码效率。', optional: true },
        { title: '数据库工具', description: 'Ultimate 版内置 DataGrip 核心功能，支持多种数据库的连接、查询、ER 图可视化，无需额外安装数据库客户端。', optional: true },
        { title: '快捷键精通', description: '熟练掌握 Ctrl+Shift+A（查找操作）、Alt+Enter（快速修复）、Ctrl+Alt+T（包裹代码）等高频快捷键可大幅提升开发效率。', optional: true },
        { title: '远程开发', description: '支持通过 Gateway 远程连接到远程服务器上的开发环境，本地仅运行瘦客户端，计算在远端执行。', optional: true },
      ]
    },
  ]
}
</script>
<ContentView :data="data" />
