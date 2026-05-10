<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  type: 'reference',
  name: 'MongoDB',
  description: 'MongoDB 是最流行的文档型 NoSQL 数据库，以灵活的文档模型、高可用和水平扩展能力著称。',
  chapters: [
    {
      name: '数据模型',
      children: [
        '文档（Document）：BSON 格式，类似 JSON 对象',
        '集合（Collection）：文档的容器，类似于关系型数据库的表',
        '数据库（Database）：集合的容器',
        '动态 Schema：同一集合中的文档可以有不同的字段结构',
        '【BSON 数据类型】String、Integer、Double、Boolean、Date',
        '【BSON 数据类型】ObjectId（12 字节唯一标识）、Array、Embedded Document',
        '【BSON 数据类型】Decimal128（高精度小数）、Binary Data',
      ]
    },
    {
      name: 'CRUD 操作',
      children: [
        '【查询】条件查询：$eq、$gt、$in、$regex',
        '【查询】逻辑查询：$and、$or、$not',
        '【查询】数组查询：$all、$elemMatch',
        '【查询】投影：指定返回字段',
        '【查询】排序、分页：sort()、skip()、limit()',
        '【聚合管道】$match：过滤文档',
        '【聚合管道】$group：分组聚合',
        '【聚合管道】$project：字段投影与转换',
        '【聚合管道】$lookup：左外连接（类似 JOIN）',
        '【聚合管道】$unwind：数组展开',
        '【聚合管道】$sort / $limit / $skip',
        '【索引】单字段索引',
        '【索引】复合索引：多字段组合、ESR 规则',
        '【索引】多键索引：数组字段索引',
        '【索引】文本索引：全文搜索',
        '【索引】TTL 索引：自动过期删除',
        '【索引】哈希索引：分片键',
      ]
    },
    {
      name: '高可用与扩展',
      children: [
        '【副本集】1 主节点 + N 从节点',
        '【副本集】自动故障转移',
        '【副本集】读写分离（Secondary 读）',
        '【副本集】多数节点写入确认',
        '【分片集群】分片键：数据分布策略（范围/哈希/Zone）',
        '【分片集群】mongos：路由节点',
        '【分片集群】Config Server：元数据存储',
        '【分片集群】Chunk 分裂与均衡',
      ]
    },
    {
      name: '事务',
      children: [
        '多文档事务（4.0+）',
        'ACID 兼容',
        '适用于副本集和分片集群',
      ]
    },
  ],
  groups: [
    {
      name: "推荐资源",
      items: [
        { title: "MongoDB 官方文档", url: "https://www.mongodb.com/docs/" },
        { title: "MongoDB 大学免费课程", url: "https://university.mongodb.com/" }
      ],
    }
  ]
}
</script>
<ContentView :data="data" />
