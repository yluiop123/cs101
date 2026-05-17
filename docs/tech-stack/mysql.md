<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  type: 'reference',
  name: 'MySQL',
  description: 'MySQL 是最流行的开源关系型数据库管理系统，广泛用于 Web 应用、企业系统和 OLTP 场景。',
  chapters: [
    {
      name: '核心特性',
      children: [
        '存储引擎：InnoDB（默认）、MyISAM、Memory',
        '事务支持：ACID 兼容，支持提交、回滚、崩溃恢复',
        '外键约束：保证数据参照完整性',
        '复制：主从复制、组复制、半同步复制',
      ]
    },
    {
      name: '基础操作',
      children: [
        '【DDL】CREATE / ALTER / DROP 数据库与表',
        '【DDL】字段类型：INT、VARCHAR、TEXT、DATETIME、JSON 等',
        '【DDL】约束：PRIMARY KEY、FOREIGN KEY、UNIQUE、NOT NULL、CHECK',
        '【DML】SELECT / INSERT / UPDATE / DELETE',
        '【DML】条件查询、排序、分组、聚合函数',
        '【DML】多表 JOIN（INNER / LEFT / RIGHT / FULL）',
        '【DML】子查询与 CTE（公共表表达式）',
        '【DML】窗口函数（ROW_NUMBER、RANK、LAG/LEAD）',
      ]
    },
    {
      name: '索引与优化',
      children: [
        '【索引类型】B+ Tree 索引：InnoDB 默认索引结构',
        '【索引类型】聚簇索引：主键索引，数据行按主键顺序存储',
        '【索引类型】二级索引：非主键索引，回表查询',
        '【索引类型】联合索引：多列组合索引，最左前缀原则',
        '【索引类型】全文索引：文本搜索',
        '【优化技巧】EXPLAIN 分析执行计划',
        '【优化技巧】慢查询日志定位性能问题',
        '【优化技巧】覆盖索引避免回表',
        '【优化技巧】分区表管理大表数据',
      ]
    },
    {
      name: '事务与锁',
      children: [
        '隔离级别：读未提交、读已提交、可重复读（默认）、可序列化',
        'MVCC：多版本并发控制，快照读',
        '锁：行锁、表锁、间隙锁、Next-Key Lock',
        '死锁：排查与避免',
      ]
    },
    {
      name: '高可用与运维',
      children: [
        '主从复制：Binlog 异步复制、半同步复制、GTID',
        '读写分离：ProxySQL、MySQL Router',
        '备份恢复：mysqldump、XtraBackup、PITR',
        '监控：Prometheus + mysqld_exporter + Grafana',
        '连接池：HikariCP、Druid 配置调优',
      ]
    },
  ],
  resources: [
    {
      name: "推荐资源",
      items: [
        { title: "MySQL 官方文档", url: "https://dev.mysql.com/doc/" },
        { title: "高性能 MySQL" }
      ],
    }
  ]
}
</script>
<ContentView :data="data" />
