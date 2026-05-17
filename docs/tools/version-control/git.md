<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'Git',
  description: 'Git 是目前最流行的分布式版本控制系统，用于追踪代码变更、协作开发和分支管理。',
  items: [
    {
      name: '简介与安装',
      children: [
        { title: '版本控制简介', description: 'Git 是 Linus Torvalds 于 2005 年为 Linux 内核开发而创建的分布式版本控制系统。与 SVN 等集中式系统不同，每个开发者本地都拥有完整的仓库副本，支持离线提交和灵活的分支策略。', groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Git 官网', url: 'https://git-scm.com/' }, { title: 'Pro Git 中文版', url: 'https://git-scm.com/book/zh/v2' }] }] },
        { title: '安装方式', description: 'Windows 可通过 Git for Windows 或 winget 安装，macOS 可通过 Homebrew 安装，Linux 使用系统包管理器。安装后建议配置用户名和邮箱。', groups: [{ name: '下载', icon: 'mdi-download', items: [{ title: 'Git for Windows', url: 'https://git-scm.com/download/win' }, { title: 'Homebrew 安装', url: 'https://formulae.brew.sh/formula/git' }] }, { name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: '安装配置教程（Bilibili）', url: 'https://www.bilibili.com/video/BV1FE411P7B3' }] }] },
      ]
    },
    {
      name: '核心功能',
      children: [
        { title: '基本操作', description: 'git init、git clone、git add、git commit、git status、git log 是最常用的基础命令，覆盖了从初始化仓库到提交变更的完整工作流。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Git 入门教程（Bilibili）', url: 'https://www.bilibili.com/video/BV1VC4y1s77E' }] }] },
        { title: '分支与合并', description: 'Git 的分支模型极其轻量，创建和切换分支只需几毫秒。git branch、git checkout、git merge、git rebase 构成了分支管理的核心。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: '分支管理详解', url: 'https://git-scm.com/book/zh/v2/Git-%E5%88%86%E6%94%AF-%E5%88%86%E6%94%AF%E7%AE%80%E4%BB%8B' }] }] },
        { title: '远程协作', description: 'GitHub、GitLab、Gitee 等平台基于 Git 提供了远程仓库托管。git remote、git push、git pull、git fetch 是与远程仓库交互的核心命令。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'GitHub 协作流程', url: 'https://docs.github.com/zh/get-started/quickstart/hello-world' }] }] },
        { title: '后悔药系列', description: 'git reset、git revert、git stash、git cherry-pick 提供了在不同场景下的撤销和恢复能力，是日常开发中的高频操作。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Git 撤销操作指南', url: 'https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E9%87%8D%E7%BD%AE%E6%8F%AD%E5%AF%86' }] }] },
      ]
    },
    {
      name: '进阶技巧', subtitle: '选修',
      children: [
        { title: 'Git Hooks', description: '在 commit、push 等关键操作前后自动执行脚本，可用于代码格式化检查、测试运行等自动化场景。', optional: true },
        { title: 'Git Bisect', description: '通过二分查找法快速定位引入 bug 的提交，配合 git log 可大幅减少排查范围。', optional: true },
        { title: 'Git Reflog', description: '记录所有 HEAD 移动的历史，是误操作后的最后一道防线，可恢复看似丢失的提交。', optional: true },
        { title: '子模块与子树', description: 'git submodule 和 git subtree 用于管理多个相关仓库之间的依赖关系，适用于大型项目拆分为多个子仓库的场景。', optional: true },
      ]
    },
  ]
}
</script>
<ContentView :data="data" />
