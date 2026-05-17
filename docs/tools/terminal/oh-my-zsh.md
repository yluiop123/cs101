<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'Oh My Zsh / Oh My Posh',
  description: 'Shell 框架与美化工具，提升终端使用体验和开发效率。',

  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: '工具简介',
          description: 'Oh My Zsh 是 Zsh 社区最流行的配置管理框架，提供数千个插件和数百个主题，让终端变得更强大、更美观。Oh My Posh 则是跨平台的提示符美化引擎（支持 PowerShell、WSL、bash、zsh 等），专注于终端提示符的视觉定制，尤其以显示 Git 状态信息见长。两者可搭配使用，也可各自独立工作。',
          groups: [
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Oh My Zsh 官网', url: 'https://ohmyz.sh/', icon: 'mdi-file-document-outline' },
                { title: 'Oh My Zsh GitHub', url: 'https://github.com/ohmyzsh/ohmyzsh', icon: 'mdi-github' },
                { title: 'Oh My Posh 官网', url: 'https://ohmyposh.dev/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '安装方式',
          description: 'Oh My Zsh 通过 curl 或 wget 一键安装。Oh My Posh 通过包管理器安装，支持 Windows（PowerShell）、macOS 和 Linux。',
          groups: [
            {
              name: '安装指南',
              icon: 'mdi-download',
              items: [
                { title: 'Oh My Zsh 安装', url: 'https://ohmyz.sh/#install', icon: 'mdi-download' },
                { title: 'Oh My Posh 安装', url: 'https://ohmyposh.dev/docs/installation', icon: 'mdi-download' }
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
          title: '插件系统',
          description: 'Oh My Zsh 拥有超过 300 个插件，涵盖 git、docker、node、npm、python、vscode 等各类开发工具。插件可自动启用别名、命令补全和功能增强，极大提升日常 shell 操作效率。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '插件列表', url: 'https://github.com/ohmyzsh/ohmyzsh/wiki/Plugins', icon: 'mdi-play-circle-outline' },
                { title: '插件使用指南', url: 'https://github.com/ohmyzsh/ohmyzsh/wiki/Plugins-Overview', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: '主题美化',
          description: 'Oh My Zsh 内置数百种主题，修改 ZSH_THEME 变量即可切换。Oh My Posh 提供纯 JSON/YAML 配置的跨平台提示符主题，支持自定义图标、颜色、分段显示，并原生展示 Git 分支、状态、Python 虚拟环境等信息。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Oh My Zsh 主题列表', url: 'https://github.com/ohmyzsh/ohmyzsh/wiki/Themes', icon: 'mdi-play-circle-outline' },
                { title: 'Oh My Posh 主题库', url: 'https://ohmyposh.dev/docs/themes', icon: 'mdi-palette' }
              ]
            }
          ]
        },
        {
          title: '自动补全与语法高亮',
          description: '通过 zsh-autosuggestions 插件实现基于历史的命令自动建议（灰色提示），通过 zsh-syntax-highlighting 插件实现命令语法高亮。正确命令显示为绿色，错误命令显示为红色，让你在输入时即时获得反馈。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '自动补全插件', url: 'https://github.com/zsh-users/zsh-autosuggestions', icon: 'mdi-play-circle-outline' },
                { title: '语法高亮插件', url: 'https://github.com/zsh-users/zsh-syntax-highlighting', icon: 'mdi-play-circle-outline' }
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
          title: '自定义配置与别名',
          description: '在 ~/.zshrc 中定义个性化别名（如 g=git、gs=git status）和函数。Oh My Zsh 会自动加载 custom/ 目录下的自定义脚本，方便组织个人配置。',
          optional: true,
          groups: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '自定义配置指南', url: 'https://github.com/ohmyzsh/ohmyzsh/wiki/Customization', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'Oh My Posh 自定义主题',
          description: '可以自己编写 JSON/YAML 主题文件，控制提示符中每个片段的文字、颜色、背景和图标。支持显示时间、用户、路径、Git 状态、退出码、命令执行时长等信息。',
          optional: true,
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Oh My Posh 配置指南', url: 'https://ohmyposh.dev/docs/configuration', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: 'Powerlevel10k 主题',
          description: 'Oh My Zsh 最受欢迎的第三方主题，以其极致的性能和丰富的配置选项著称。配置向导交互式引导设置，支持即时提示符风格切换。',
          optional: true,
          groups: [
            {
              name: '资源',
              icon: 'mdi-github',
              items: [
                { title: 'Powerlevel10k GitHub', url: 'https://github.com/romkatv/powerlevel10k', icon: 'mdi-github' }
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
