<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'Windows Terminal',
  description: '微软推出的现代开源终端模拟器，支持多标签、GPU 加速渲染和高度自定义。',

  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: '工具简介',
          description: 'Windows Terminal 是微软于 2019 年发布的开源终端模拟器，支持命令提示符、PowerShell、WSL 等多个命令行环境在同一窗口中切换。采用 GPU 加速渲染，提供流畅的字体渲染和低延迟体验。支持完整的 Unicode（包括中日韩字符）、主题配色、背景图片和亚克力模糊效果。',
          groups: [
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Windows Terminal 官方文档', url: 'https://learn.microsoft.com/zh-cn/windows/terminal/', icon: 'mdi-file-document-outline' },
                { title: 'GitHub 仓库', url: 'https://github.com/microsoft/terminal', icon: 'mdi-github' }
              ]
            }
          ]
        },
        {
          title: '安装方式',
          description: 'Windows Terminal 可通过 Microsoft Store、GitHub Releases 或 WinGet / Chocolatey / Scoop 等包管理器安装。推荐使用 Microsoft Store 安装以获得自动更新功能。',
          groups: [
            {
              name: '下载',
              icon: 'mdi-download',
              items: [
                { title: 'Microsoft Store 安装', url: 'https://apps.microsoft.com/detail/9n0dx20hk701', icon: 'mdi-microsoft-windows' },
                { title: 'GitHub Releases', url: 'https://github.com/microsoft/terminal/releases', icon: 'mdi-github' },
                { title: 'WinGet 安装命令', url: 'https://learn.microsoft.com/zh-cn/windows/package-manager/winget/', icon: 'mdi-terminal' }
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
          title: '多标签与窗格',
          description: '支持同时打开多个标签页，每个标签页可运行不同的 shell（CMD、PowerShell、WSL）。支持垂直/水平拆分窗格（Alt+Shift+D），在一个标签页内同时查看多个终端。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '快捷操作指南', url: 'https://learn.microsoft.com/zh-cn/windows/terminal/panes', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: '配置文件与自定义',
          description: '基于 JSON 文件配置，支持自定义 shell 启动项、配色方案、字体、背景图片、透明度等。内置多种配色主题（One Half Dark、Campbell、Solarized 等），并可导入社区分享的主题。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '配置教程', url: 'https://learn.microsoft.com/zh-cn/windows/terminal/customize-settings/profile-general', icon: 'mdi-play-circle-outline' },
                { title: '配色方案库', url: 'https://windowsterminalthemes.dev/', icon: 'mdi-palette' }
              ]
            }
          ]
        },
        {
          title: 'GPU 加速渲染',
          description: '利用 GPU 进行文本渲染，显著提升渲染性能和字体清晰度。支持文本反走样、连字（Ligatures）和丰富的 Unicode 字符显示，特别适合在需要高频刷新的场景（如日志追踪、实时监控）中使用。',
          groups: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '渲染引擎说明', url: 'https://learn.microsoft.com/zh-cn/windows/terminal/install', icon: 'mdi-file-document-outline' }
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
          title: 'SSH 配置与连接',
          description: 'Windows Terminal 原生支持 OpenSSH 客户端，可以保存 SSH 连接为独立配置文件，实现一键连接远程服务器。',
          optional: true,
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Windows SSH 配置', url: 'https://learn.microsoft.com/zh-cn/windows/terminal/tutorials/ssh', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: '与 WSL 深度集成',
          description: '自动检测已安装的 WSL 发行版并添加到启动菜单中。可在 Windows Terminal 中直接使用 Linux 命令行环境，实现 Windows + Linux 无缝开发体验。',
          optional: true,
          groups: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'WSL 集成指南', url: 'https://learn.microsoft.com/zh-cn/windows/wsl/setup/environment', icon: 'mdi-file-document-outline' }
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
