<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'iTerm2',
  description: 'macOS 平台最受欢迎的终端模拟器替代品，功能强大且可高度定制。',

  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: '工具简介',
          description: 'iTerm2 是 macOS 上最流行的第三方终端模拟器，自 2006 年起持续维护。相比系统自带的 Terminal.app，iTerm2 提供了分屏、搜索高亮、自动补全、粘贴历史、热键窗口等大量增强功能，是 macOS 开发者几乎必备的工具。',
          groups: [
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'iTerm2 官方网站', url: 'https://iterm2.com/', icon: 'mdi-file-document-outline' },
                { title: 'GitHub 仓库', url: 'https://github.com/gnachman/iTerm2', icon: 'mdi-github' }
              ]
            }
          ]
        },
        {
          title: '安装方式',
          description: '推荐通过 Homebrew 安装，也可从官网下载 dmg 安装包。',
          groups: [
            {
              name: '下载',
              icon: 'mdi-download',
              items: [
                { title: '官网下载', url: 'https://iterm2.com/downloads.html', icon: 'mdi-download' },
                { title: 'Homebrew 安装', url: 'https://formulae.brew.sh/cask/iterm2', icon: 'mdi-flask' }
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
          title: '分屏与标签',
          description: '支持垂直/水平分割窗格（Cmd+D / Cmd+Shift+D），可同时管理多个终端会话。标签页管理流畅，支持拖拽重组、全屏沉浸模式。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '分屏操作指南', url: 'https://iterm2.com/documentation-one-page.html', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: '搜索与自动补全',
          description: 'Cmd+F 支持实时搜索高亮和正则匹配。自动补全功能（Cmd+; ）基于历史命令弹出补全建议，大幅提升命令行操作效率。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '搜索与补全说明', url: 'https://iterm2.com/documentation-search.html', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: '热键窗口',
          description: '可设置全局热键（如 Option+Space）快速呼出一个悬浮终端窗口，类似于 Quake 控制台风格。特别适合需要随时快速执行命令的工作流。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '热键窗口设置', url: 'https://iterm2.com/documentation-hotkey.html', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: '粘贴历史',
          description: 'Cmd+Shift+H 打开粘贴历史面板，记录最近复制/粘贴的所有内容，支持搜索浏览，再也不怕丢失复制过的文本。',
          groups: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '粘贴历史说明', url: 'https://iterm2.com/documentation-pasteboard-history.html', icon: 'mdi-file-document-outline' }
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
          title: '配置与主题美化',
          description: 'iTerm2 支持丰富的主题配色方案，社区维护了大量色彩方案。配合 Oh My Zsh 和 powerlevel10k 主题可打造极高颜值的工作环境。',
          optional: true,
          groups: [
            {
              name: '资源',
              icon: 'mdi-palette',
              items: [
                { title: 'iTerm2 色彩方案集', url: 'https://iterm2colorschemes.com/', icon: 'mdi-palette' }
              ]
            }
          ]
        },
        {
          title: 'Tmux 集成',
          description: 'iTerm2 内置 tmux 集成模式，可在原生 iTerm2 窗口中管理和查看 tmux 会话，同时享受 iTerm2 的渲染特性。',
          optional: true,
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Tmux 集成文档', url: 'https://iterm2.com/documentation-tmux-integration.html', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: 'Shell 集成',
          description: '通过 Shell 集成功能，可在终端侧边栏中查看命令历史、工作目录、退出码等信息。支持 Mark 标记功能快速导航到之前的位置。',
          optional: true,
          groups: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Shell 集成说明', url: 'https://iterm2.com/documentation-shell-integration.html', icon: 'mdi-file-document-outline' }
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
