<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: 'SQL / 数据库技能路线',
  description: '数据库是后端开发的基石，掌握 SQL 和数据建模是每个后端工程师的必修课。',

  items: [
    {
      name: 'SQL 基础与关系型数据库入门', subtitle: '必修',
      children: [
        { title: '数据库基本概念', description: '关系型 vs 非关系型、表/行/列、主键/外键' },
        { title: 'MySQL / PostgreSQL 安装与配置', description: '数据库创建、用户权限管理', groups: [{ name: "视频教程", icon: "mdi-play-circle-outline", items: [{ title: "尚硅谷MySQL基础教程", url: "https://www.bilibili.com/video/BV1ix411M7Rz", icon: "mdi-play-circle-outline" }] }] },
        { title: 'DDL 数据定义语言', description: 'CREATE/ALTER/DROP 表、字段类型、约束（NOT NULL/UNIQUE/CHECK）' },
        { title: 'DML 数据操作语言', description: 'SELECT/INSERT/UPDATE/DELETE 基本操作' },
        { title: '条件查询与排序', description: 'WHERE 子句、LIKE/IN/BETWEEN/IS NULL、ORDER BY' },
        { title: '聚合函数与分组', description: 'COUNT/SUM/AVG/MAX/MIN、GROUP BY、HAVING 过滤' },
        { title: '多表 JOIN 连接', description: 'INNER/LEFT/RIGHT/FULL JOIN、ON 连接条件、表别名' },
        { title: '子查询', description: '标量子查询、行子查询、EXISTS/NOT EXISTS、IN 子查询' },
        { title: '集合操作', description: 'UNION/UNION ALL、INTERSECT、EXCEPT' },
        { title: '常用函数', description: '字符串函数、日期函数、数值函数、转换函数' },
      ]
    },
    {
      name: '高级 SQL 与数据库设计', subtitle: '必修',
      children: [
        { title: '索引原理', description: 'B+ 树结构、聚簇索引与非聚簇索引、联合索引、覆盖索引' },
        { title: '索引优化实战', description: 'EXPLAIN 执行计划分析、type/rows/Extra 字段解读', groups: [{ name: "视频教程", icon: "mdi-play-circle-outline", items: [{ title: "尚硅谷MySQL高级教程", url: "https://www.bilibili.com/video/BV1Ah411z7qQ", icon: "mdi-play-circle-outline" }] }] },
        { title: '事务与隔离级别', description: 'ACID 特性、READ UNCOMMITTED/READ COMMITTED/REPEATABLE READ/SERIALIZABLE' },
        { title: '锁机制', description: '共享锁/排他锁、行锁/表锁、间隙锁（Next-Key Lock）、死锁排查' },
        { title: '存储引擎', description: 'InnoDB vs MyISAM、行格式、MVCC 多版本并发控制' },
        { title: '视图与存储过程', description: '创建视图、存储过程编写、游标、触发器' },
        { title: '数据库设计范式', description: '第一/二/三范式、BCNF、反范式化场景' },
        { title: 'ER 实体关系建模', description: '实体/属性/关系、一对多/多对多、逻辑设计' },
        { title: '数据库设计工具', description: 'MySQL Workbench / Navicat / DbSchema' },
        { title: '窗口函数', description: 'ROW_NUMBER/RANK/DENSE_RANK、LAG/LEAD、SUM OVER 累计计算', optional: true },
        { title: 'CTE 公共表表达式', description: 'WITH 递归查询、层级数据查询', optional: true },
      ]
    },
    {
      name: '性能优化与运维', subtitle: '必修',
      children: [
        { title: '慢查询日志', description: '开启配置、日志分析工具、pt-query-digest' },
        { title: 'SQL 优化策略', description: '避免索引失效、减少回表、优化 ORDER BY/GROUP BY' },
        { title: '分区表', description: 'RANGE/LIST/HASH 分区、分区裁剪、分区管理' },
        { title: '读写分离', description: '主从复制原理（Binlog/Relay log）、延迟监控' },
        { title: '主从复制', description: '异步复制、半同步复制、GTID 复制' },
        { title: '备份与恢复', description: 'mysqldump 逻辑备份、XtraBackup 物理备份、PITR 时间点恢复' },
        { title: '用户与权限管理', description: 'GRANT/REVOKE、角色管理、SSL 连接' },
        { title: '数据库监控', description: 'Prometheus + mysqld_exporter、Grafana 面板', optional: true },
        { title: '连接池配置', description: 'HikariCP / Druid 参数调优、连接泄漏排查', optional: true },
      ]
    },
    {
      name: 'NoSQL 数据库', subtitle: '选修',
      children: [
        { title: 'Redis 核心', description: '五大数据类型（String/Hash/List/Set/ZSet）、过期策略', groups: [{ name: "视频教程", icon: "mdi-play-circle-outline", items: [{ title: "尚硅谷Redis教程", url: "https://www.bilibili.com/video/BV1Jq4y1z7Yj", icon: "mdi-play-circle-outline" }] }], groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "Redis官方文档", url: "https://redis.io/docs/", icon: "mdi-file-document-outline" }] }] },
        { title: 'Redis 高级', description: '持久化 RDB/AOF、哨兵模式、Cluster 集群、Redis 管道' },
        { title: 'Redis 应用', description: '分布式锁 Redisson、缓存穿透/击穿/雪崩、布隆过滤器' },
        { title: 'MongoDB 基础', description: '文档/集合/数据库、CRUD 操作、索引类型', groups: [{ name: "视频教程", icon: "mdi-play-circle-outline", items: [{ title: "尚硅谷MongoDB教程", url: "https://www.bilibili.com/video/BV1Yb4y1d7gS", icon: "mdi-play-circle-outline" }] }] },
        { title: 'MongoDB 进阶', description: '聚合管道（$match/$group/$lookup）、副本集、分片集群' },
        { title: 'Elasticsearch 入门', description: '倒排索引原理、DSL 查询语言、分词器', groups: [{ name: "官方文档", icon: "mdi-file-document-outline", items: [{ title: "Elasticsearch官方指南", url: "https://www.elastic.co/guide/index.html", icon: "mdi-file-document-outline" }] }] },
        { title: 'Elasticsearch 进阶', description: '聚合分析、集群管理、Logstash 数据同步' },
        { title: 'Cassandra', description: '宽表存储、分区键与聚簇键、CQL 查询', optional: true },
        { title: 'ClickHouse', description: '列式存储、MergeTree 引擎、OLAP 分析查询', optional: true },
        { title: 'HBase', description: '行键设计、Region 分区、Hadoop 生态集成', optional: true },
      ]
    },
    {
      name: '分布式数据库与架构', subtitle: '选修',
      children: [
        { title: '分库分表', description: 'ShardingSphere / MyCat 中间件、分片策略（hash/range）', optional: true },
        { title: '分布式事务', description: 'XA 协议、TCC 模式、Seata 框架、Saga 模式', optional: true },
        { title: '分布式 ID 方案', description: 'UUID、雪花算法（Snowflake）、号段模式', optional: true },
        { title: '数据库高可用', description: 'MHA / Orchestrator 切换、ProxySQL 中间件', optional: true },
        { title: 'NewSQL', description: 'TiDB/TiKV 架构、Google Spanner、CockroachDB', optional: true },
        { title: 'HTAP 混合负载', description: 'TiFlash 列存引擎、PolarDB 计算存储分离', optional: true },
        { title: '数据迁移与同步', description: 'Canal（MySQL Binlog 订阅）、DataX、Debezium', optional: true },
      ]
    },
  ]
}
</script>
<ContentView :data="data" />
