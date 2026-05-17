<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'tmux',
  description: '终端复用器，允许在一个终端窗口中管理多个会话，支持分离与后台运行。',

  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: '工具简介',
          description: 'tmux（Terminal Multiplexer）是一个开源的终端复用器，允许用户在一个终端窗口中创建、访问和控制多个终端会话。其最核心的优势是会话持久化：即使在 SSH 连接断开或关闭终端窗口后，tmux 会话仍在后台运行，重新连接后可恢复到之前的完整工作状态。tmux 基于 C 语言编写，遵循 BSD 协议。',
          groups: [
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'tmux 官方仓库', url: 'https://github.com/tmux/tmux', icon: 'mdi-github' },
                { title: 'tmux 手册', url: 'https://man.archlinux.org/man/tmux.1', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '安装方式',
          description: '主流操作系统均可通过包管理器安装，macOS 使用 Homebrew，Linux 使用 apt/yum/pacman，Windows WSL 同样支持。',
          groups: [
            {
              name: '安装',
              icon: 'mdi-download',
              items: [
                { title: 'Homebrew 安装', url: 'https://formulae.brew.sh/formula/tmux', icon: 'mdi-flask' }
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
          title: '会话管理',
          description: 'tmux 采用三层结构：Session（会话）> Window（窗口）> Pane（窗格）。可以创建多个独立会话（tmux new -s name），在会话间切换（tmux switch -t name），分离会话（tmux detach）后重新附着（tmux attach）。适合同时管理多个项目环境。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'tmux 入门教程', url: 'https://github.com/tmux/tmux/wiki/Getting-Started', icon: 'mdi-play-circle-outline' },
                { title: '会话管理详解', url: 'https://www.ruanyifeng.com/blog/2019/10/tmux.html', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: '窗口与窗格',
          description: '每个会话可包含多个窗口（类似标签页），每个窗口可水平/垂直拆分为多个窗格。支持窗格大小调整、全屏切换、排列布局切换，实现终端多任务并行。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '窗口与窗格操作', url: 'https://tmuxcheatsheet.com/', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: '会话持久化',
          description: 'SSH 连接意外断开时，正在运行的命令不会中断，重新 SSH 连接后执行 tmux attach 即可恢复。也可在退出 tmux 前使用 tmux detach 手动分离。这对远程服务器管理和长时间任务（如数据迁移、模型训练）至关重要。',
          groups: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '持久化使用场景', url: 'https://www.man7.org/linux/man-pages/man1/tmux.1.html', icon: 'mdi-file-document-outline' }
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
          title: '自定义配置',
          description: '通过 ~/.tmux.conf 文件自定义快捷键、状态栏样式、颜色主题、鼠标支持等。社区提供了大量高质量配置模板。',
          optional: true,
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'tmux 配置指南', url: 'https://github.com/tmux/tmux/wiki/Configuration', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: 'tmux 插件管理',
          description: 'TPM（Tmux Plugin Manager）可方便地管理 tmux 插件，如 tmux-resurrect（保存/恢复会话）、tmux-continuum（自动保存）、tmux-yank（系统剪贴板集成）等。',
          optional: true,
          groups: [
            {
              name: '资源',
              icon: 'mdi-github',
              items: [
                { title: 'TPM 插件管理器', url: 'https://github.com/tmux-plugins/tpm', icon: 'mdi-github' },
                { title: 'tmux-resurrect', url: 'https://github.com/tmux-plugins/tmux-resurrect', icon: 'mdi-github' }
              ]
            }
          ]
        },
        {
          title: '复制模式与搜索',
          description: 'Prefix+[ 进入复制模式，支持 vi/emacs 键位绑定，可在终端历史输出中搜索和选择文本，配合 tmux-yank 可直接复制到系统剪贴板。',
          optional: true,
          groups: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '复制模式说明', url: 'https://man.openbsd.org/tmux.1#COPY_MODE', icon: 'mdi-file-document-outline' }
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
