<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'Claude Code',
  description: 'Anthropic 官方推出的 AI 编程助手，基于 Claude 模型，支持终端内交互式编码和自动化。',
  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: '工具简介',
          description: 'Claude Code 是 Anthropic 推出的 AI 编程代理工具，直接在终端中运行。它能够理解整个代码库上下文，执行代码编辑、Git 操作、调试和测试等任务，支持多文件编辑和复杂重构。',
          resources: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Claude Code 官网', url: 'https://claude.ai/code' }, { title: 'Anthropic 文档', url: 'https://docs.anthropic.com/en/docs/claude-code/overview' }] }]
        },
        {
          title: '安装方式',
          description: '通过 npm 全局安装：npm install -g @anthropic-ai/claude-code。安装完成后在终端输入 claude 即可启动交互会话。需要有效的 Anthropic API 密钥。',
          resources: [{ name: '安装指南', icon: 'mdi-download', items: [{ title: '安装说明', url: 'https://docs.anthropic.com/en/docs/claude-code/install' }] }]
        }
      ]
    },
    {
      name: '核心功能',
      children: [
        {
          title: '终端交互',
          description: '在终端中以对话形式与 AI 交互，Claude Code 可以读取文件、编写代码、执行命令、管理 Git 分支和提交，全程无需离开终端。',
          resources: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: '快速开始', url: 'https://docs.anthropic.com/en/docs/claude-code/overview#getting-started' }] }]
        },
        {
          title: '多文件编辑',
          description: '能够同时理解和编辑多个文件，适合跨文件重构、组件提取和大型代码变更。支持 lint 错误修复和类型注解添加。',
          resources: [{ name: '教程', icon: 'mdi-file-multiple-outline', items: [{ title: '使用指南', url: 'https://docs.anthropic.com/en/docs/claude-code/overview#core-workflows' }] }]
        },
        {
          title: 'Git 集成',
          description: '自动管理 Git 操作，包括创建分支、暂存文件、生成提交信息、创建 PR 等。每次修改前自动创建提交以确保安全回滚。',
          resources: [{ name: '教程', icon: 'mdi-source-branch', items: [{ title: 'Git 工作流', url: 'https://docs.anthropic.com/en/docs/claude-code/overview#git-workflows' }] }]
        }
      ]
    },
    {
      name: '进阶技巧', subtitle: '选修',
      children: [
        {
          title: 'CLAUDE.md 配置',
          description: '在项目根目录创建 CLAUDE.md 文件，定义项目规范、技术栈、命令等上下文信息，让 Claude Code 更准确理解项目。',
          optional: true,
          resources: [{ name: '参考', icon: 'mdi-book-open-variant', items: [{ title: 'CLAUDE.md 说明', url: 'https://docs.anthropic.com/en/docs/claude-code/overview#claudemd' }] }]
        },
        {
          title: '自定义工具和钩子',
          description: '通过配置自定义工具和钩子扩展 Claude Code 的能力，例如自动运行测试、部署脚本等。',
          optional: true,
          resources: [{ name: '参考', icon: 'mdi-cog-outline', items: [{ title: '自定义配置', url: 'https://docs.anthropic.com/en/docs/claude-code/overview#hooks' }] }]
        }
      ]
    }
  ]
}
</script>
<ContentView :data="data" />
