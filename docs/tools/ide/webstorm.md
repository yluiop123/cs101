<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'WebStorm',
  description: 'WebStorm 是 JetBrains 出品的专业前端/全栈开发 IDE，为 JavaScript、TypeScript、CSS 和前端框架提供深度支持。',
  items: [
    {
      name: '简介与安装',
      children: [
        { title: '工具简介', description: 'WebStorm 基于 IntelliJ 平台构建，集成了对 React、Vue、Angular、Node.js 等主流前端/后端框架的一流支持。内置调试器、测试运行器、HTTP Client、终端等工具，开箱即用。', groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'WebStorm 官网', url: 'https://www.jetbrains.com/webstorm/' }, { title: '文档中心', url: 'https://www.jetbrains.com/help/webstorm/getting-started.html' }] }] },
        { title: '安装方式', description: '通过 JetBrains Toolbox App 安装和管理最为方便。支持 Windows、macOS、Linux，提供 30 天免费试用，学生可申请免费教育授权。', groups: [{ name: '下载', icon: 'mdi-download', items: [{ title: '下载 WebStorm', url: 'https://www.jetbrains.com/webstorm/download/' }] }, { name: '教育授权', icon: 'mdi-school-outline', items: [{ title: 'JetBrains 学生授权', url: 'https://www.jetbrains.com/community/education/' }] }] },
      ]
    },
    {
      name: '核心功能',
      children: [
        { title: 'JavaScript/TypeScript 支持', description: '智能代码补全、类型检查、快速修复、重构。对 TypeScript 有深度集成，支持类型定义跳转、快速修复类型错误、自动导入类型。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'TypeScript 支持', url: 'https://www.jetbrains.com/help/webstorm/typescript-support.html' }] }] },
        { title: '前端框架集成', description: '对 React（JSX 支持、Hooks 提示）、Vue（模板语法、Vuex/Pinia）、Angular（模板检查、依赖注入）提供专有支持。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Vue 开发指南', url: 'https://www.jetbrains.com/help/webstorm/vue-js.html' }] }] },
        { title: 'Node.js 调试', description: '内置 Node.js 调试器，支持断点调试、异步调用堆栈跟踪、CPU profile 分析。可直接运行和调试 Express、Koa、NestJS 等后端框架。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Node.js 调试', url: 'https://www.jetbrains.com/help/webstorm/running-and-debugging-node-js.html' }] }] },
        { title: '前端工具链', description: '深度集成 ESLint、Prettier、Stylelint，保存时自动格式化代码。内置 npm/pnpm/yarn 包管理器和构建工具（Webpack、Vite）视图。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'ESLint 集成', url: 'https://www.jetbrains.com/help/webstorm/eslint.html' }] }] },
      ]
    },
    {
      name: '进阶技巧', subtitle: '选修',
      children: [
        { title: 'HTTP Client', description: '内置 HTTP 请求编辑器，支持 .http 和 .rest 文件，可直接在 IDE 中编写、发送和调试 HTTP 请求，支持环境变量和响应断言。', optional: true },
        { title: '终端集成', description: '内置终端可直接运行 npm/pnpm 命令，支持分屏终端和 SSH 远程连接，无需切换到外部终端。', optional: true },
        { title: '数据库工具', description: '支持连接 MySQL、PostgreSQL、MongoDB 等数据库，执行 SQL 查询并查看结果。', optional: true },
      ]
    },
  ]
}
</script>
<ContentView :data="data" />
