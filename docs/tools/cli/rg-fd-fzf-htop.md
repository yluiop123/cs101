<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'ripgrep + fd + fzf + htop',
  description: '现代命令行效率工具集——超快搜索、模糊查找和系统监控。',
  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: 'ripgrep (rg)',
          description: 'ripgrep 是一款基于 Rust 编写的超快速文本搜索工具，比 grep 快数倍。它默认遵守 .gitignore，支持递归搜索、正则表达式和多种编码，是代码搜索的首选。',
          groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'ripgrep GitHub', url: 'https://github.com/BurntSushi/ripgrep' }, { title: 'ripgrep 文档', url: 'https://docs.rs/regex/latest/regex/' }] }]
        },
        {
          title: 'fd',
          description: 'fd 是 Rust 编写的高性能 find 替代工具，比 find 快 5 倍以上。它默认遵循 .gitignore，支持正则查找、文件类型过滤和智能大小写匹配。',
          groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'fd GitHub', url: 'https://github.com/sharkdp/fd' }] }]
        },
        {
          title: 'fzf',
          description: 'fzf 是通用的命令行模糊搜索工具，可以搜索文件、命令历史、进程等任意列表。支持预览窗口、多选和自定义绑定，常与其他命令配合使用。',
          groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'fzf GitHub', url: 'https://github.com/junegunn/fzf' }] }]
        },
        {
          title: 'htop',
          description: 'htop 是交互式系统监控工具，是 top 的增强版。支持彩色显示、鼠标操作、树状视图和进程管理，可直观查看 CPU、内存和 swap 使用情况。',
          groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'htop 官网', url: 'https://htop.dev' }, { title: 'htop GitHub', url: 'https://github.com/htop-dev/htop' }] }]
        }
      ]
    },
    {
      name: '核心功能',
      children: [
        {
          title: '快速搜索代码 (rg)',
          description: 'rg pattern 在当前目录递归搜索匹配行，支持 -g（文件通配）、-t（按类型）、-C（上下文行）等参数。--no-ignore 可搜索忽略文件中的内容。',
          groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'ripgrep 使用指南', url: 'https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md' }] }]
        },
        {
          title: '快速查找文件 (fd)',
          description: 'fd pattern 快速查找文件名匹配的文件，支持 -e（扩展名）、-x（执行命令）、-H（搜索隐藏文件）等。fd -e js 查找所有 JS 文件。',
          groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'fd 使用说明', url: 'https://github.com/sharkdp/fd#quickstart' }] }]
        },
        {
          title: '模糊搜索 (fzf)',
          description: 'Ctrl+T 搜索当前目录文件、Ctrl+R 搜索命令历史、Alt+C cd 到子目录。fzf 可与其他命令管道组合：git branch | fzf 模糊选择分支。',
          groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'fzf 入门', url: 'https://github.com/junegunn/fzf?tab=readme-ov-file#installation' }, { title: 'fzf 快捷键', url: 'https://github.com/junegunn/fzf?tab=readme-ov-file#key-bindings-for-command-line' }] }]
        },
        {
          title: '系统监控 (htop)',
          description: 'htop 以彩色柱状图显示 CPU 和内存占用，支持按 CPU/内存排序、搜索进程、树视图和信号发送。F9 可直接发送 KILL/TERM 等信号。',
          groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'htop 使用指南', url: 'https://htop.dev/faq.html' }] }]
        }
      ]
    },
    {
      name: '组合工作流', subtitle: '选修',
      children: [
        {
          title: 'rg + fzf 联动',
          description: 'rg --line-number "pattern" | fzf 实现在搜索结果中交互式选择，回车后用 \$EDITOR 打开指定行。这是代码浏览的高效工作流。',
          optional: true,
          groups: [{ name: '示例', icon: 'mdi-lightning-bolt', items: [{ title: 'fzf 与 rg 集成', url: 'https://github.com/junegunn/fzf?tab=readme-ov-file#fuzzy-completion-for-bash' }] }]
        },
        {
          title: 'fd + fzf 文件查找',
          description: 'fd --type f | fzf --preview "bat --color=always {}" 实现带语法高亮预览的文件模糊搜索，比传统文件管理器更快。',
          optional: true,
          groups: [{ name: '示例', icon: 'mdi-file-find-outline', items: [{ title: 'fd 与 bat 配合', url: 'https://github.com/sharkdp/fd#integration-with-fzf' }] }]
        },
        {
          title: '替代工具生态',
          description: '了解 bat（带语法高亮的 cat）、duf（磁盘使用）、procs（现代 ps）、tldr（简化 man）等现代 CLI 替代工具，全面提升终端效率。',
          optional: true
        }
      ]
    }
  ]
}
</script>
<ContentView :data="data" />
