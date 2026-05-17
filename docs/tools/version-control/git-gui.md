<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'Git GUI 工具',
  description: 'Git GUI 工具通过图形界面降低了 Git 的使用门槛，让可视化的版本管理、分支操作和冲突解决更加直观高效。',
  items: [
    {
      name: '工具概览',
      children: [
        { title: 'GitHub Desktop', description: 'GitHub 官方出品的免费桌面客户端，界面简洁直观，与 GitHub 深度集成。支持拖拽式分支管理、一键 PR 创建和冲突可视化解决，适合个人开发者和 GitHub 重度用户。', groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'GitHub Desktop 官网', url: 'https://desktop.github.com/' }] }, { name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'GitHub Desktop 使用教程', url: 'https://docs.github.com/zh/desktop' }] }] },
        { title: 'Sourcetree', description: 'Atlassian 推出的免费 Git GUI 客户端，功能全面且支持 Windows 和 macOS。内置分支可视化图、交互式变基（rebase）、Git Flow 工作流支持，适合团队协作场景。', groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Sourcetree 官网', url: 'https://www.sourcetreeapp.com/' }] }, { name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Sourcetree 入门指南', url: 'https://confluence.atlassian.com/get-started-with-sourcetree' }] }] },
        { title: 'GitKraken', description: '跨平台的高颜值 Git GUI 客户端，以其精美的界面和强大的功能著称。支持 Git Flow、内置合并冲突编辑器、代码审查集成，提供免费版和付费 Pro 版。', groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'GitKraken 官网', url: 'https://www.gitkraken.com/' }] }, { name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'GitKraken 教程', url: 'https://help.gitkraken.com/gitkraken-client/guide/' }] }] },
      ]
    },
    {
      name: '核心功能',
      children: [
        { title: '可视化提交历史', description: '以图形化的方式展示分支拓扑、提交记录和标签信息，轻松追踪每次代码变更的来源与去向。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Git 可视化入门', url: 'https://learngitbranching.js.org/?locale=zh_CN' }] }] },
        { title: '冲突解决', description: '提供图形化的合并冲突编辑器，直观显示冲突区域，支持一键接受当前/传入更改，降低解决冲突的心智负担。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Git 冲突解决指南', url: 'https://www.atlassian.com/git/tutorials/using-branches/merge-conflicts' }] }] },
        { title: 'Git Flow 集成', description: '内置对 Git Flow 工作流的支持，一键创建 feature/release/hotfix 分支，规范团队协作流程。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Git Flow 详解', url: 'https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow' }] }] },
      ]
    },
    {
      name: '对比与选择', subtitle: '选读',
      children: [
        { title: '如何选择', description: '初学者推荐 GitHub Desktop，操作最简单；团队协作推荐 Sourcetree，功能全面且免费；追求颜值和跨平台体验可选 GitKraken。', optional: true },
        { title: '命令行与 GUI', description: 'GUI 工具不能完全替代命令行。建议先掌握 git 基础命令，再使用 GUI 工具提升日常操作效率，两者互补。', optional: true },
      ]
    },
  ]
}
</script>
<ContentView :data="data" />
