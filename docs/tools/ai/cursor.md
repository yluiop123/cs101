<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'Cursor',
  description: '基于 AI 的代码编辑器，深度集成大语言模型以提供智能编程体验。',
  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: '工具简介',
          description: 'Cursor 是一款基于 VS Code 的 AI-first 代码编辑器，内置了 Chat、Composer 和智能补全功能。它支持多文件编辑、代码库理解和上下文感知的 AI 交互，能够大幅提升开发效率。',
          groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Cursor 官网', url: 'https://cursor.sh' }, { title: '官方文档', url: 'https://docs.cursor.sh' }] }]
        },
        {
          title: '安装方式',
          description: '从 Cursor 官网下载对应操作系统的安装包，支持 Windows、macOS 和 Linux。安装后可通过 Settings 登录账号并配置 AI 模型。',
          groups: [{ name: '下载', icon: 'mdi-download', items: [{ title: '下载页面', url: 'https://cursor.sh/downloads' }] }]
        }
      ]
    },
    {
      name: '核心功能',
      children: [
        {
          title: 'Chat 与 Composer',
          description: 'Chat 提供侧边栏对话，Composer 支持多文件同时编辑。AI 能够理解整个项目结构，生成跨多个文件的代码变更。',
          groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Chat 与 Composer 指南', url: 'https://docs.cursor.sh/chat' }] }]
        },
        {
          title: '代码库感知',
          description: 'Cursor 自动索引整个代码库，在回答问题时能够引用相关文件和上下文，提供更准确的建议。支持 @file、@folder 等引用语法。',
          groups: [{ name: '教程', icon: 'mdi-database-outline', items: [{ title: '代码库索引', url: 'https://docs.cursor.sh/context/@-symbols' }] }]
        },
        {
          title: '内联编辑',
          description: '选中代码后通过 Ctrl+K 触发内联编辑，可以要求 AI 修改、重构或解释选中的代码片段，支持 Diff 视图预览变更。',
          groups: [{ name: '教程', icon: 'mdi-code-tags', items: [{ title: '内联编辑说明', url: 'https://docs.cursor.sh/inline-editing' }] }]
        }
      ]
    },
    {
      name: '进阶技巧', subtitle: '选修',
      children: [
        {
          title: '自定义规则',
          description: '通过 .cursorrules 文件为项目定义 AI 行为规则，包括代码风格、框架偏好和命名规范等，确保 AI 输出符合项目要求。',
          optional: true,
          groups: [{ name: '参考', icon: 'mdi-book-open-variant', items: [{ title: '规则配置', url: 'https://docs.cursor.sh/custom-rules' }] }]
        },
        {
          title: 'AI 模型选择',
          description: 'Cursor 支持多种 AI 模型（GPT-4、Claude 等），可在设置中切换。不同模型在不同任务上各有优势，可根据场景灵活选择。',
          optional: true
        }
      ]
    }
  ]
}
</script>
<ContentView :data="data" />
