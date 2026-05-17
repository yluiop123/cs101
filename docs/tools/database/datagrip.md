<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'DataGrip',
  description: 'DataGrip 是 JetBrains 出品的跨平台数据库 IDE，提供智能 SQL 补全、重构、版本控制集成等功能，深度集成 JetBrains 生态，是专业开发者的高效数据库工具。',
  items: [
    {
      name: '简介与安装',
      children: [
        { title: '工具简介', description: 'DataGrip 基于 IntelliJ 平台，支持 MySQL、PostgreSQL、Oracle、SQL Server、MongoDB、Redis 等主流数据库。提供上下文感知的代码补全、实时语法检查、快速重构等高级功能。', groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'DataGrip 官网', url: 'https://www.jetbrains.com/datagrip/' }] }] },
        { title: '安装方式', description: '通过 JetBrains Toolbox App 统一管理安装和更新。也支持直接下载安装包。提供 30 天免费试用，学生和开源项目可申请免费许可证。', groups: [{ name: '下载', icon: 'mdi-download', items: [{ title: '下载页面', url: 'https://www.jetbrains.com/datagrip/download/' }] }] },
      ]
    },
    {
      name: '核心功能',
      children: [
        { title: '智能 SQL 编辑器', description: '提供数据库感知的代码补全（表名、字段、关键字）、实时语法高亮与错误检测、SQL 格式化、代码折叠。支持多种数据库方言自动切换。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'SQL 编辑器指南', url: 'https://www.jetbrains.com/help/datagrip/sql-editor.html' }] }] },
        { title: '查询执行与结果', description: '支持多结果集、查询计划分析（EXPLAIN）、结果排序过滤、导出为 CSV/Excel/Markdown。提供查询控制台和历史记录。', groups: [{ name: '文档', icon: 'mdi-file-document-outline', items: [{ title: '查询结果处理', url: 'https://www.jetbrains.com/help/datagrip/results-pane.html' }] }] },
        { title: '数据库导航', description: '树形浏览数据库对象，快速查看表结构、索引、触发器、存储过程。支持数据库和表级别的快速搜索（按名称搜索对象）。', groups: [{ name: '参考', icon: 'mdi-file-document-outline', items: [{ title: '数据库浏览器', url: 'https://www.jetbrains.com/help/datagrip/database-explorer.html' }] }] },
        { title: '数据编辑', description: '支持直接在表格中编辑数据、添加删除行、批量修改。提供内联编辑器处理长文本和 JSON 字段。' },
        { title: '版本控制集成', description: '将数据库对象定义（DDL）纳入版本控制，支持与 Git 对比差异，追踪数据库结构变更历史。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: '数据库版本控制', url: 'https://www.jetbrains.com/help/datagrip/version-control-with-databases.html' }] }] },
      ]
    },
    {
      name: '进阶技巧', subtitle: '选修',
      children: [
        { title: '代码重构', description: '支持安全重命名表/字段（自动更新所有引用）、提取子查询、引入别名等 SQL 重构操作。', optional: true },
        { title: '数据源管理', description: '支持 SSH/SSL 隧道、代理配置、连接池设置。可导入/导出数据源配置，方便团队共享。', optional: true },
        { title: '扩展插件', description: 'DataGrip 兼容 IntelliJ 插件生态，可安装数据库驱动、可视化插件、代码生成器等扩展。', optional: true },
      ]
    },
  ]
}
</script>
<ContentView :data="data" />
