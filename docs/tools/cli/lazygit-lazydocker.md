<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'lazygit + lazydocker',
  description: '终端内的 Git 和 Docker 图形化界面工具，用 TUI 方式简化日常操作。',
  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: 'lazygit',
          description: 'lazygit 是一款终端 Git 图形化客户端，提供直观的 TUI（终端用户界面）。它让暂存文件、切换分支、交互式 rebase 和解决冲突等操作变得简单高效，无需记忆复杂 Git 命令。',
          groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'lazygit 官网', url: 'https://github.com/jesseduffield/lazygit' }, { title: 'lazygit 文档', url: 'https://github.com/jesseduffield/lazygit/tree/master/docs' }] }]
        },
        {
          title: 'lazydocker',
          description: 'lazydocker 是 lazgit 同作者开发的 Docker TUI 工具，提供终端内的 Docker 管理界面。可查看容器日志、监控资源占用、管理镜像和卷，操作直观。',
          groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'lazydocker 官网', url: 'https://github.com/jesseduffield/lazydocker' }] }]
        }
      ]
    },
    {
      name: '核心功能',
      children: [
        {
          title: 'Git 可视化操作',
          description: 'lazygit 提供分支图、文件变更面板、暂存区管理、提交历史等视图。支持键盘快捷键快速操作，如空格暂存文件、s 压缩提交、m 合并分支等。',
          groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'lazygit 使用指南', url: 'https://github.com/jesseduffield/lazygit?tab=readme-ov-file#keybindings' }] }]
        },
        {
          title: '交互式 Rebase',
          description: 'lazygit 的交互式 rebase 功能非常强大，可视化拖动即可调整提交顺序、合并提交和修改提交信息，极大简化 Git 历史编辑操作。',
          groups: [{ name: '教程', icon: 'mdi-source-commit', items: [{ title: '交互式 Rebase 说明', url: 'https://github.com/jesseduffield/lazygit/blob/master/docs/InteractiveRebase.md' }] }]
        },
        {
          title: 'Docker 容器管理',
          description: 'lazydocker 可以查看所有容器状态、实时日志、资源占用情况。支持一键启停容器、进入容器 Shell 和清理未使用的资源。',
          groups: [{ name: '教程', icon: 'mdi-docker', items: [{ title: 'lazydocker 入门', url: 'https://github.com/jesseduffield/lazydocker?tab=readme-ov-file#usage' }] }]
        }
      ]
    },
    {
      name: '进阶技巧', subtitle: '选修',
      children: [
        {
          title: '自定义配置',
          description: 'lazygit 支持深度自定义配置，包括主题配色、快捷键绑定和自定义命令。配置文件位于 ~/.config/lazygit/config.yml。',
          optional: true,
          groups: [{ name: '配置', icon: 'mdi-cog-outline', items: [{ title: 'lazygit 配置文档', url: 'https://github.com/jesseduffield/lazygit/blob/master/docs/Config.md' }] }]
        },
        {
          title: '工作流集成',
          description: '将 lazygit 设为 Git 默认编辑器用于提交信息或 rebase，配合 tmux 或 zellij 使用可打造高效的终端开发环境。',
          optional: true
        }
      ]
    }
  ]
}
</script>
<ContentView :data="data" />
