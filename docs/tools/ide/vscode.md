<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'VS Code',
  description: 'Visual Studio Code 是微软推出的轻量级但功能强大的代码编辑器，凭借丰富的插件生态和出色的开发体验成为当前最流行的编辑器之一。',
  items: [
    {
      name: '简介与安装',
      children: [
        { title: 'VS Code 简介', description: 'VS Code 基于 Electron 构建，内置了 IntelliSense 代码智能补全、调试器、Git 集成、终端等核心功能。通过插件市场可扩展支持几乎所有编程语言和框架，是前端开发、Python、Go 等多语言开发的首选编辑器。', groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'VS Code 官网', url: 'https://code.visualstudio.com/' }, { title: '文档中心', url: 'https://code.visualstudio.com/docs' }] }] },
        { title: '安装方式', description: '支持 Windows、macOS、Linux 三大平台。Windows 推荐使用系统安装器并勾选"添加到 PATH"；macOS 可通过官网下载或 Homebrew 安装。', groups: [{ name: '下载', icon: 'mdi-download', items: [{ title: 'VS Code 下载', url: 'https://code.visualstudio.com/download' }] }, { name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'VS Code 入门教程（Bilibili）', url: 'https://www.bilibili.com/video/BV1iL411k7dS' }] }] },
      ]
    },
    {
      name: '核心功能',
      children: [
        { title: 'IntelliSense 与编辑', description: '智能代码补全、参数提示、快速修复、重构支持。通过语言服务协议（LSP）实现对多种语言的深度代码分析。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'IntelliSense 详解', url: 'https://code.visualstudio.com/docs/editor/intellisense' }] }] },
        { title: '内置调试器', description: '支持 Node.js、Python、Java、Go 等多种运行时的调试。可设置断点、监视变量、查看调用堆栈，支持条件断点和日志断点。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'VS Code 调试入门', url: 'https://code.visualstudio.com/docs/editor/debugging' }] }] },
        { title: 'Git 集成', description: '内置完整的 Git 支持，包括暂存/提交、分支切换、冲突解决、查看 diff、Git Graph 可视化等，无需离开编辑器即可完成版本管理。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'VS Code Git 集成', url: 'https://code.visualstudio.com/docs/sourcecontrol/overview' }] }] },
        { title: '插件生态', description: 'VS Code MarketPlace 拥有数万个扩展插件，涵盖语言支持、主题、图标、代码格式化、AI 辅助等各个领域。', groups: [{ name: '市场', icon: 'mdi-store-outline', items: [{ title: 'VS Code MarketPlace', url: 'https://marketplace.visualstudio.com/vscode' }] }] },
      ]
    },
    {
      name: '进阶技巧', subtitle: '选修',
      children: [
        { title: 'Remote Development', description: '通过 Remote - SSH、Remote - Containers、Remote - WSL 扩展，可在远程服务器、Docker 容器或 WSL 中开发，本地获得完整 IDE 体验。', optional: true },
        { title: 'Tasks 与 Snippets', description: '使用 Tasks 自动化构建/测试流程，自定义 Snippets 提高代码输入效率，支持项目级和全局级别配置。', optional: true },
        { title: 'Settings Sync', description: '使用内置的 Settings Sync 功能或 GitHub 账号同步设置、快捷键和插件列表，实现多设备开发环境一致。', optional: true },
        { title: 'Vim 键位模拟', description: '安装 Vim 扩展可在 VS Code 中使用 Vim 键位操作，兼顾 VS Code 的现代化功能与 Vim 的高效编辑模式。', optional: true },
      ]
    },
  ]
}
</script>
<ContentView :data="data" />
