<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'Homebrew / Scoop / Chocolatey',
  description: '三大操作系统上的包管理器，用于命令行安装和管理系统级软件。',
  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: 'Homebrew（macOS / Linux）',
          description: 'Homebrew 是 macOS 上最流行的包管理器，也被称为"macOS 缺失的包管理器"。它支持安装开源软件、命令行工具和 GUI 应用，使用 Ruby 编写，社区活跃。',
          resources: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Homebrew 官网', url: 'https://brew.sh' }, { title: 'Homebrew 文档', url: 'https://docs.brew.sh' }] }]
        },
        {
          title: 'Scoop（Windows）',
          description: 'Scoop 是 Windows 上的命令行包管理器，专注于开发者工具。它安装到用户目录下，无需管理员权限，自动配置环境变量，且不会污染系统 PATH。',
          resources: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Scoop 官网', url: 'https://scoop.sh' }, { title: 'Scoop 文档', url: 'https://github.com/ScoopInstaller/Scoop/wiki' }] }]
        },
        {
          title: 'Chocolatey（Windows）',
          description: 'Chocolatey 是 Windows 上的系统级包管理器，类似 apt-get。它可以安装和管理 Windows 软件包，包括 GUI 应用和系统工具，但通常需要管理员权限。',
          resources: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Chocolatey 官网', url: 'https://chocolatey.org' }, { title: 'Chocolatey 文档', url: 'https://docs.chocolatey.org' }] }]
        }
      ]
    },
    {
      name: '核心功能',
      children: [
        {
          title: '软件安装与卸载',
          description: '通过命令行快速安装：brew install、scoop install、choco install。支持静默安装、版本管理和一键卸载清理，比手动下载安装更高效。',
          resources: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Homebrew 快速入门', url: 'https://docs.brew.sh/Installation' }, { title: 'Scoop 使用指南', url: 'https://github.com/ScoopInstaller/Scoop?tab=readme-ov-file#usage' }] }]
        },
        {
          title: '仓库与 Bucket',
          description: 'Homebrew 使用 Formula（配方）仓库，Scoop 使用 Bucket 管理软件包集，Chocolatey 使用社区仓库。用户可添加三方仓库扩展可用软件列表。',
          resources: [{ name: '教程', icon: 'mdi-database-outline', items: [{ title: 'Homebrew Taps', url: 'https://docs.brew.sh/Taps' }, { title: 'Scoop Buckets', url: 'https://github.com/ScoopInstaller/Scoop?tab=readme-ov-file#bucket' }] }]
        },
        {
          title: '依赖管理',
          description: '自动处理软件依赖关系，确保安装的软件正常运行。Homebrew 的 Bottle 机制预编译常见平台二进制，Scoop 通过 Manifest 声明依赖。',
          resources: [{ name: '教程', icon: 'mdi-link-variant', items: [{ title: 'Homebrew Bottles', url: 'https://docs.brew.sh/Bottles' }] }]
        }
      ]
    },
    {
      name: '对比与选型', subtitle: '选修',
      children: [
        {
          title: '平台对比',
          description: 'macOS 首选 Homebrew；Windows 上 Scoop 适合开发者命令行工具，Chocolatey 适合系统级应用和 GUI 软件。可按需搭配使用。',
          optional: true,
          resources: [{ name: '对比', icon: 'mdi-chart-bar', items: [{ title: 'Scoop vs Chocolatey', url: 'https://github.com/ScoopInstaller/Scoop/wiki/Chocolatey-Comparison' }] }]
        },
        {
          title: '进阶配置',
          description: 'Homebrew 支持 Cask 安装 GUI 应用；Scoop 支持全局安装（--global）和持久化配置；Chocolatey 支持自动升级和脚本化安装。',
          optional: true
        }
      ]
    }
  ]
}
</script>
<ContentView :data="data" />
