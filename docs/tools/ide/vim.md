<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'Vim / Neovim',
  description: 'Vim 是经典的终端文本编辑器，以模式编辑和键盘驱动的操作理念著称。Neovim 是 Vim 的现代化分支，大幅改进了插件架构和可扩展性。',
  items: [
    {
      name: '简介与安装',
      children: [
        { title: 'Vim 与 Neovim', description: 'Vim 诞生于 1991 年，是 Vi 编辑器的改进版。Neovim 是 2014 年起从 Vim 分叉的现代化版本，支持异步插件执行、内置 LSP 客户端、Lua 配置语言和更友好的 API。两者操作方式基本相同。', groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Vim 官网', url: 'https://www.vim.org/' }, { title: 'Neovim 官网', url: 'https://neovim.io/' }] }] },
        { title: '安装方式', description: 'Linux/macOS 预装 Vim，Neovim 可通过包管理器安装。Windows 可通过 scoop/choco 安装或下载安装包。推荐初学者使用 Neovim，对现代开发支持更好。', groups: [{ name: '下载', icon: 'mdi-download', items: [{ title: 'Neovim 下载', url: 'https://github.com/neovim/neovim/releases' }] }, { name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Vim 教程（Bilibili）', url: 'https://www.bilibili.com/video/BV1nJ411J8S1' }] }] },
      ]
    },
    {
      name: '核心功能',
      children: [
        { title: '模式编辑', description: 'Vim 的核心理念是模式编辑：普通模式用于导航和操作命令，插入模式用于文本输入，可视模式用于选择文本，命令模式用于执行 Ex 命令。切换模式无需鼠标，纯键盘操作。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Vim 模式详解', url: 'https://vimhelp.org/intro.txt.html#vim-modes' }] }] },
        { title: '文本对象与动作', description: 'Vim 提供了丰富的文本对象（word、sentence、paragraph、tag、quotes 等）和动作命令（w、b、f、t、/ 搜索等），组合后可实现精确高效的文本操作。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Vim 文本对象', url: 'https://vimhelp.org/motion.txt.html' }] }] },
        { title: '缓冲区与窗口管理', description: 'Vim 通过缓冲区管理多个文件，支持水平/垂直分屏、标签页（tabpage）和工作区布局。:bnext、:vsplit、:tabnew 是高频命令。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: '窗口管理', url: 'https://vimhelp.org/windows.txt.html' }] }] },
        { title: '搜索与替换', description: '支持正则表达式搜索（/pattern）、全局替换（:s/old/new/g）、多文件查找替换（:vimgrep、:cdo）。Neovim 内置了更好的模糊查找支持。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: '搜索技巧', url: 'https://vimhelp.org/pattern.txt.html' }] }] },
      ]
    },
    {
      name: '进阶技巧', subtitle: '选修',
      children: [
        { title: '插件管理（Neovim）', description: '使用 lazy.nvim 或 packer.nvim 管理插件，可实现文件树、语法高亮、LSP 客户端、代码补全（nvim-cmp）、模糊搜索（telescope.nvim）等现代 IDE 功能。', optional: true },
        { title: '内置 LSP 客户端', description: 'Neovim 内置了 LSP 客户端，配合 mason.nvim 可自动安装各种语言的 LSP 服务器，获得代码补全、跳转定义、重构等 IDE 级体验。', optional: true },
        { title: '自定义配置', description: 'Neovim 使用 Lua 配置（init.lua），Vim 使用 VimL 配置（vimrc）。可自定义键映射、自动命令、配色方案等，打造完全个性化的编辑环境。', optional: true },
        { title: 'Vim 速度', description: '熟练掌握常用技巧后，编辑速度可远超传统编辑器：. 命令重复上次操作、宏录制 q 自动执行复杂编辑、ciw/da" 等组合操作实现精准编辑。', optional: true },
      ]
    },
  ]
}
</script>
<ContentView :data="data" />
