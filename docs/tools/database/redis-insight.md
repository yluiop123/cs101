<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'Redis Insight',
  description: 'Redis Insight 是 Redis 官方出品的图形化管理工具，用于可视化管理 Redis 数据、监控 Redis 实例性能、调试和分析查询，是 Redis 开发的必备前端工具。',
  items: [
    {
      name: '简介与安装',
      children: [
        { title: '工具简介', description: 'Redis Insight 提供直观的 GUI 来浏览 Redis 数据、执行命令、监控服务器指标。支持 Redis 7 及以上版本的所有数据结构（String、Hash、List、Set、Sorted Set、Stream、JSON 等），同时支持 Redis Stack 和 Redis Enterprise。', groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Redis Insight 官网', url: 'https://redis.com/redis-enterprise/redis-insight/' }, { title: 'GitHub 仓库', url: 'https://github.com/RedisInsight/RedisInsight' }] }] },
        { title: '安装方式', description: '支持 Windows、macOS、Linux 桌面端安装，也提供 Web 版（无需安装，通过浏览器访问）。桌面版支持自动更新检测。', groups: [{ name: '下载', icon: 'mdi-download', items: [{ title: '下载页面', url: 'https://redis.com/redis-enterprise/redis-insight/#insight-form' }] }] },
      ]
    },
    {
      name: '核心功能',
      children: [
        { title: '数据浏览', description: '以树形和表格形式浏览 Redis 键空间。支持按前缀、类型、TTL 等条件过滤键。可查看和编辑任意 Redis 数据结构的值，支持 JSON、MessagePack 等格式的自动解析。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: '使用指南', url: 'https://docs.redis.com/latest/ri/using-redisinsight/' }] }] },
        { title: '内建 CLI', description: '内置 Redis CLI 命令行终端，可以直接执行任意 Redis 命令。支持命令提示和自动补全，方便快速调试。', groups: [{ name: '文档', icon: 'mdi-file-document-outline', items: [{ title: 'CLI 使用', url: 'https://docs.redis.com/latest/ri/using-redisinsight/cli/' }] }] },
        { title: '性能监控', description: '实时展示 Redis 实例的关键性能指标，包括 CPU 使用率、内存占用、连接数、命令执行速率、缓存命中率等。支持自定义监控面板和告警阈值。', groups: [{ name: '参考', icon: 'mdi-file-document-outline', items: [{ title: '性能监控', url: 'https://docs.redis.com/latest/ri/using-redisinsight/profiler/' }] }] },
        { title: '慢查询分析', description: '监控和记录执行时间超过阈值的命令，帮助识别和优化性能瓶颈。支持按执行时间、频率等维度排序分析。' },
        { title: '内存分析', description: '可视化分析 Redis 内存使用分布，识别内存占用最大的键和数据类型，帮助优化内存使用策略。', groups: [{ name: '文档', icon: 'mdi-file-document-outline', items: [{ title: '内存分析', url: 'https://docs.redis.com/latest/ri/using-redisinsight/memory-analysis/' }] }] },
      ]
    },
    {
      name: '进阶技巧', subtitle: '选修',
      children: [
        { title: 'Redis Stack 集成', description: '连接 Redis Stack 实例时可使用文档搜索、时间序列、图数据库等高级模块的专用可视化界面。', optional: true },
        { title: '批量操作', description: '支持对符合模式的多个键执行批量删除、设置 TTL、导出值等操作，提高运维效率。', optional: true },
      ]
    },
  ]
}
</script>
<ContentView :data="data" />
