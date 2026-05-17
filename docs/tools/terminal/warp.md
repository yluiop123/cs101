<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'Warp',
  description: '使用 Rust 编写的现代化终端，内置 AI 辅助、智能编辑和协作功能。',

  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: '工具简介',
          description: 'Warp 是一款从头开始构建的现代化终端模拟器，底层使用 Rust 语言编写，追求高性能和低资源占用。Warp 突破了传统终端的设计思路，将命令输入区与输出区分离，支持类似 IDE 的文本编辑体验。内置 Warp AI 可解释错误、生成命令、调试脚本，大幅提升终端操作效率。',
          resources: [
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Warp 官方网站', url: 'https://www.warp.dev/', icon: 'mdi-file-document-outline' },
                { title: 'Warp 文档', url: 'https://docs.warp.dev/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '安装方式',
          description: 'Warp 提供 macOS 和 Linux 版本（Windows 版本开发中），可通过官网下载或 Homebrew 安装。',
          resources: [
            {
              name: '下载',
              icon: 'mdi-download',
              items: [
                { title: '官网下载', url: 'https://www.warp.dev/download', icon: 'mdi-download' },
                { title: 'Homebrew 安装', url: 'https://docs.warp.dev/getting-started/quick-start', icon: 'mdi-flask' }
              ]
            }
          ]
        }
      ]
    },
    {
      name: '核心功能',
      children: [
        {
          title: '智能编辑器',
          description: 'Warp 将终端输入区改为类似代码编辑器的体验：支持光标导航、多行编辑、语法高亮、括号匹配。命令输出分块展示，可单独折叠或复制，告别传统终端的纯文本滚动流。',
          resources: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '智能编辑功能介绍', url: 'https://docs.warp.dev/features/editor', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: 'Warp AI',
          description: '内置 AI 助手，可以直接用自然语言描述想要的操作，AI 会生成对应的命令。也可以选中错误信息让 AI 解释原因并给出修复建议，极大降低命令行学习门槛。',
          resources: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Warp AI 使用指南', url: 'https://docs.warp.dev/features/warp-ai', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: '工作流与保存命令',
          description: '可以将常用命令保存为工作流（Workflows），支持自定参数占位符。团队还可以共享工作流，统一开发和运维操作规范。',
          resources: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '工作流说明', url: 'https://docs.warp.dev/features/workflows', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: '协作功能',
          description: 'Warp Drive 提供团队共享的笔记和命令集合。支持终端会话分享，团队成员可以实时查看对方终端操作，方便远程结对编程和技术支持。',
          resources: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '协作功能文档', url: 'https://docs.warp.dev/features/warp-drive', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        }
      ]
    },
    {
      name: '进阶技巧',
      subtitle: '选修',
      children: [
        {
          title: '自定义主题与配置',
          description: 'Warp 支持深色/浅色主题切换，可通过主题配置文件进行深度定制。社区提供了大量主题可供选择。',
          optional: true,
          resources: [
            {
              name: '资源',
              icon: 'mdi-palette',
              items: [
                { title: '主题配置文档', url: 'https://docs.warp.dev/features/themes', icon: 'mdi-palette' }
              ]
            }
          ]
        },
        {
          title: '快捷键与效率',
          description: 'Warp 提供了大量快捷键，包括命令导航、多光标编辑、输出搜索等。熟练掌握后可大幅提升终端操作效率。',
          optional: true,
          resources: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '快捷键大全', url: 'https://docs.warp.dev/features/keyboard-shortcuts', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        }
      ]
    }
  ]
}
</script>
<ContentView :data="data" />
