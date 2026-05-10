<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  type: 'reference',
  name: 'Elasticsearch',
  description: 'Elasticsearch 是基于 Lucene 的分布式搜索和分析引擎，是 Elastic Stack（ELK）的核心组件，广泛应用于日志分析、全文搜索和可观测性。',
  chapters: [
    {
      name: '核心概念',
      children: [
        '索引（Index）：文档的集合，类似于关系型数据库的表',
        '文档（Document）：JSON 格式的基本存储单元',
        '映射（Mapping）：定义字段类型和分析方式',
        '分片（Shard）：索引的水平分区单元',
        '副本（Replica）：分片的副本，提供高可用和查询扩展',
      ]
    },
    {
      name: '倒排索引',
      children: [
        '分词：将文本拆分为词项（Term）',
        '词典：词项到文档的映射表',
        '倒排列表：记录每个词项在哪些文档中出现',
      ]
    },
    {
      name: '查询 DSL',
      children: [
        'match：标准全文搜索',
        'match_phrase：短语匹配',
        'multi_match：多字段搜索',
        'query_string：复杂查询语法',
        'term：精确值查询',
        'terms：多值精确匹配',
        'range：范围查询（数字/日期）',
        'exists：字段存在性查询',
        'bool：must / should / filter / must_not',
        'constant_score：恒定评分',
        'function_score：自定义评分',
        '指标聚合：avg、sum、min、max、stats',
        '桶聚合：terms、range、date_histogram',
        '管道聚合：对聚合结果再次聚合',
      ]
    },
    {
      name: '集群架构',
      children: [
        '节点类型：Master、Data、Ingest、Coordinating',
        '发现与选主：Zen Discovery 或基于 Seed Hosts',
        '分片分配：基于磁盘水位线、分片总数',
        '跨集群搜索（CCS）',
      ]
    },
    {
      name: '生态工具',
      children: [
        'Logstash：数据采集与管道处理',
        'Kibana：可视化与管理界面',
        'Beats：轻量级数据采集器（Filebeat、Metricbeat）',
        'Elastic APM：应用性能监控',
      ]
    },
  ],
  groups: [
    {
      name: "推荐资源",
      items: [
        { title: "Elasticsearch 官方指南", url: "https://www.elastic.co/guide/index.html" },
        { title: "Elastic 中国社区", url: "https://elasticsearch.cn/" }
      ],
    }
  ]
}
</script>
<ContentView :data="data" />
