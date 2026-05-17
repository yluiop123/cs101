<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'GitHub Copilot',
  description: '由 GitHub 和 OpenAI 提供的 AI 编程助手，支持代码补全、内联聊天和智能建议。',
  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: '工具简介',
          description: 'GitHub Copilot 是一个基于大型语言模型的 AI 编程助手，能够在 VS Code、JetBrains、Neovim 等主流编辑器中提供实时代码补全和建议。它可以根据上下文和注释自动生成代码片段、函数乃至整个文件。',
          resources: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'GitHub Copilot 官网', url: 'https://github.com/features/copilot' }, { title: '官方文档', url: 'https://docs.github.com/copilot' }] }]
        },
        {
          title: '安装方式',
          description: '在 VS Code 扩展市场搜索 "GitHub Copilot" 安装插件，登录 GitHub 账号并启用订阅即可使用。JetBrains 用户可通过插件市场安装。',
          resources: [{ name: '安装指南', icon: 'mdi-download', items: [{ title: 'VS Code 安装指南', url: 'https://marketplace.visualstudio.com/items?itemName=GitHub.copilot' }, { title: 'JetBrains 安装指南', url: 'https://plugins.jetbrains.com/plugin/17718-github-copilot' }] }]
        }
      ]
    },
    {
      name: '核心功能',
      children: [
        {
          title: '代码补全',
          description: '根据当前文件和上下文自动提供代码补全建议，支持多种编程语言。Tab 键即可接受建议，Alt+] 切换不同建议。',
          resources: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: '代码补全入门', url: 'https://docs.github.com/copilot/using-github-copilot/getting-started-with-github-copilot' }] }]
        },
        {
          title: 'Copilot Chat',
          description: '通过内联聊天面板与 AI 对话，询问代码解释、调试建议、重构方案等。支持上下文感知的交互式编程。',
          resources: [{ name: '教程', icon: 'mdi-forum-outline', items: [{ title: 'Copilot Chat 文档', url: 'https://docs.github.com/copilot/github-copilot-chat' }] }]
        },
        {
          title: '内联建议',
          description: '在编辑器中直接触发内联建议，选中代码后可请求解释、优化或测试生成。支持斜杠命令快速操作。',
          resources: [{ name: '教程', icon: 'mdi-lightbulb-on-outline', items: [{ title: '使用技巧', url: 'https://docs.github.com/copilot/using-github-copilot/getting-started-with-github-copilot?tool=vscode#seeing-multiple-suggestions-in-quick-succession' }] }]
        }
      ]
    },
    {
      name: '进阶技巧', subtitle: '选修',
      children: [
        {
          title: '自定义提示词',
          description: '通过 .github/copilot-instructions.md 文件定义项目级别的自定义指令，让 Copilot 更了解你的项目规范和偏好。',
          optional: true,
          resources: [{ name: '参考', icon: 'mdi-book-open-variant', items: [{ title: '自定义指令文档', url: 'https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot' }] }]
        },
        {
          title: '快捷键与高效操作',
          description: '掌握 Ctrl+Enter（查看全部建议）、Ctrl+Shift+I（打开聊天）、Ctrl+I（内联聊天）等快捷键可大幅提升使用效率。',
          optional: true
        }
      ]
    }
  ]
}
</script>
<ContentView :data="data" />
