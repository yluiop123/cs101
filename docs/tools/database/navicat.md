<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'Navicat',
  description: 'Navicat 是一套商业级数据库管理工具，以图形化界面和易用性著称，支持 MySQL、PostgreSQL、Oracle、SQL Server、MariaDB、SQLite 等多种数据库，提供数据建模、同步、备份等功能。',
  items: [
    {
      name: '简介与安装',
      children: [
        { title: '工具简介', description: 'Navicat 由香港 PremiumSoft 公司开发，提供直观的图形界面。包含 Navicat Premium（全能版）、Navicat for MySQL 等产品线。支持数据可视化设计、导入导出、数据同步等企业级功能。', groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Navicat 官网', url: 'https://www.navicat.com/' }] }] },
        { title: '安装方式', description: '支持 Windows、macOS、Linux 平台。提供 14 天全功能免费试用。购买授权后解锁完整功能。企业版支持站点许可证和云部署。', groups: [{ name: '下载', icon: 'mdi-download', items: [{ title: '下载页面', url: 'https://www.navicat.com/en/download' }] }] },
      ]
    },
    {
      name: '核心功能',
      children: [
        { title: '连接管理', description: '支持同时管理多种数据库类型的多个连接。提供 SSH 隧道、SSL 加密、HTTP 隧道等安全连接方式。支持连接模板和分组管理。', groups: [{ name: '文档', icon: 'mdi-file-document-outline', items: [{ title: '连接管理指南', url: 'https://www.navicat.com/manual/online_manual/NewNavicat/en/Navicat_Premium/connection.html' }] }] },
        { title: '数据建模', description: '提供可视化数据库设计器，支持创建 ER 图、设计表结构、定义索引和约束。支持正向工程（模型生成数据库）和逆向工程（数据库生成模型）。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: '数据建模教程', url: 'https://www.navicat.com/en/company/about-resources/learning-center' }] }] },
        { title: '数据同步与传输', description: '支持数据库结构和数据在不同环境间的同步与传输。可比较两个数据库的差异并生成同步脚本，适用于开发和生产环境的部署。', groups: [{ name: '参考', icon: 'mdi-file-document-outline', items: [{ title: '数据同步', url: 'https://www.navicat.com/manual/online_manual/NewNavicat/en/Navicat_Premium/data_sync.html' }] }] },
        { title: '备份与恢复', description: '支持数据库的完整备份和增量备份，提供自动定时备份功能。支持压缩备份文件，以及将备份恢复到指定时间点。' },
        { title: '导入/导出向导', description: '支持导入导出 CSV、JSON、Excel、XML、DBF 等多种格式。提供可视化映射界面，可自定义字段映射和转换规则。', groups: [{ name: '文档', icon: 'mdi-file-document-outline', items: [{ title: '导入向导', url: 'https://www.navicat.com/manual/online_manual/NewNavicat/en/Navicat_Premium/import_wizard.html' }] }] },
      ]
    },
    {
      name: '进阶技巧', subtitle: '选修',
      children: [
        { title: '自动化任务', description: '创建计划任务自动执行备份、数据同步、脚本运行等操作。支持任务链和条件判断，实现复杂运维流程自动化。', optional: true },
        { title: '协同合作', description: '支持连接配置共享、项目协同编辑。通过 Navicat Cloud 同步连接设置、查询、代码片段到多台设备。', optional: true },
      ]
    },
  ]
}
</script>
<ContentView :data="data" />
