<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'MongoDB Compass',
  description: 'MongoDB Compass 是 MongoDB 官方出品的图形化管理工具，用于浏览、查询、分析 MongoDB 数据，支持聚合管道可视化构建、索引管理和性能优化。',
  items: [
    {
      name: '简介与安装',
      children: [
        { title: '工具简介', description: 'MongoDB Compass 提供丰富的 GUI 功能来管理 MongoDB 数据库。支持文档浏览与编辑、智能查询构建、聚合管道可视化、索引分析、服务器监控等功能。社区版免费使用，企业版额外提供数据导出、模式分析等高级功能。', groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'MongoDB Compass 官网', url: 'https://www.mongodb.com/products/compass' }] }] },
        { title: '安装方式', description: '支持 Windows、macOS、Linux 平台。提供社区版（免费）和企业版（付费）两个版本。通过 MongoDB 官网直接下载安装包，也支持通过 Homebrew (macOS) 安装。', groups: [{ name: '下载', icon: 'mdi-download', items: [{ title: '下载页面', url: 'https://www.mongodb.com/try/download/compass' }] }] },
      ]
    },
    {
      name: '核心功能',
      children: [
        { title: '文档浏览与编辑', description: '以 JSON 树形或表格视图浏览集合中的文档。支持直接增删改文档内容，实时预览变更。支持按字段排序和投影显示。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: '文档浏览指南', url: 'https://www.mongodb.com/docs/compass/current/documents/' }] }] },
        { title: '智能查询', description: '通过可视化查询构建器快速搭建查询条件，支持字段自动补全、索引提示。支持保存常用查询供后续复用。语法支持 MongoDB 查询操作符（$gt、$regex、$lookup 等）。', groups: [{ name: '文档', icon: 'mdi-file-document-outline', items: [{ title: '查询文档', url: 'https://www.mongodb.com/docs/compass/current/query/filter/' }] }] },
        { title: '聚合管道', description: '可视化构建聚合管道（Aggregation Pipeline），以拖拽方式添加 $match、$group、$sort、$lookup 等阶段。实时预览各阶段输出结果，并支持将管道导出为代码。', groups: [{ name: '参考', icon: 'mdi-file-document-outline', items: [{ title: '聚合管道构建', url: 'https://www.mongodb.com/docs/compass/current/aggregation-pipeline/' }] }] },
        { title: '索引管理', description: '查看集合中的现有索引及其性能统计（使用频率、大小）。支持创建、删除索引，获取索引建议以优化查询性能。' },
        { title: '模式分析', description: '扫描集合文档样本，自动分析字段类型分布、值范围、唯一性等统计信息。帮助理解数据结构，发现数据质量问题。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: '模式分析', url: 'https://www.mongodb.com/docs/compass/current/schema/' }] }] },
      ]
    },
    {
      name: '进阶技巧', subtitle: '选修',
      children: [
        { title: '实时性能监控', description: '展示数据库实时操作状态，包括读/写操作数、连接数、网络流量、队列等待等指标。帮助快速定位性能瓶颈。', optional: true },
        { title: '地理空间查询可视化', description: '支持 2dsphere 索引的地理空间查询。在地图上可视化 GeoJSON 数据，直观验证地理空间查询结果。', optional: true },
      ]
    },
  ]
}
</script>
<ContentView :data="data" />
