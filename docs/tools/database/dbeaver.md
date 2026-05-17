<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'DBeaver',
  description: 'DBeaver 是一款免费、开源的通用数据库管理工具，支持 JDBC 驱动的所有数据库，提供可视化查询、ER 图、数据导出等功能，是开发者首选的跨平台数据库客户端。',
  items: [
    {
      name: '简介与安装',
      children: [
        { title: '工具简介', description: 'DBeaver 基于 Eclipse 平台开发，社区版免费开源，支持 MySQL、PostgreSQL、Oracle、SQL Server、SQLite 等数十种数据库。提供 SQL 编辑器、数据浏览器、ER 图、数据迁移等丰富功能。', groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'DBeaver 官网', url: 'https://dbeaver.io/' }, { title: 'GitHub 仓库', url: 'https://github.com/dbeaver/dbeaver' }] }] },
        { title: '安装方式', description: '支持 Windows、macOS、Linux 三大平台。Windows 提供安装包和绿色版，macOS 提供 DMG 安装包，Linux 提供 DEB/RPM 包和 Snap 安装方式。', groups: [{ name: '下载', icon: 'mdi-download', items: [{ title: '下载页面', url: 'https://dbeaver.io/download/' }] }] },
      ]
    },
    {
      name: '核心功能',
      children: [
        { title: 'SQL 编辑器', description: '提供智能 SQL 补全、语法高亮、格式化、执行计划分析等功能。支持多标签页编辑、查询历史记录、结果集排序过滤。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'SQL 编辑器使用指南', url: 'https://dbeaver.com/docs/wiki/SQL-Editor/' }] }] },
        { title: '数据浏览器', description: '以树形结构展示数据库对象（表、视图、索引、存储过程等），支持快速查看表结构、索引、DDL 定义，以及浏览和编辑表数据。', groups: [{ name: '文档', icon: 'mdi-file-document-outline', items: [{ title: '数据库导航', url: 'https://dbeaver.com/docs/wiki/Database-Navigator/' }] }] },
        { title: 'ER 图', description: '自动生成数据库实体关系图，直观展示表结构与外键关系，支持图形化编辑和导出为图片格式。' },
        { title: '数据导出与导入', description: '支持将查询结果或整表数据导出为 CSV、JSON、Excel、SQL 等多种格式。支持从外部文件导入数据到数据库。', groups: [{ name: '参考', icon: 'mdi-file-document-outline', items: [{ title: '数据导入导出', url: 'https://dbeaver.com/docs/wiki/Data-Import-and-Export/' }] }] },
      ]
    },
    {
      name: '进阶技巧', subtitle: '选修',
      children: [
        { title: '连接配置管理', description: '支持 SSH 隧道、SSL 加密连接、代理配置。可保存多个数据库连接配置，支持连接模板和环境变量。', optional: true },
        { title: '任务调度与脚本', description: '支持创建定时任务（备份、导出等），可通过命令行界面批量执行操作，适合自动化运维场景。', optional: true },
      ]
    },
  ]
}
</script>
<ContentView :data="data" />
