<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  type: 'reference',
  name: 'PostgreSQL',
  description: 'PostgreSQL 是功能最强大的开源关系型数据库，以其扩展性、标准合规性和高级特性著称。',
  chapters: [
    {
      name: '核心特性',
      children: [
        'ACID 兼容：完整的事务支持',
        '扩展性：支持自定义数据类型、函数、操作符',
        '并发控制：MVCC 实现高并发读写',
        '表继承与分区：内置分区表支持',
        'JSON/JSONB：文档与关系混合存储',
      ]
    },
    {
      name: '基础操作',
      children: [
        '【DDL】CREATE TABLE / ALTER TABLE / DROP TABLE',
        '【DDL】字段类型：INTEGER、VARCHAR、TEXT、NUMERIC、JSONB、ARRAY 等',
        '【DDL】序列（SERIAL）与自增列',
        '【DDL】约束：PRIMARY KEY、FOREIGN KEY、UNIQUE、CHECK、EXCLUSION',
        '【DML】SELECT / INSERT / UPDATE / DELETE',
        '【DML】高级查询：窗口函数、CTE 递归查询、LATERAL JOIN',
        '【DML】聚合与统计：GROUPING SETS、CUBE、ROLLUP',
      ]
    },
    {
      name: '高级特性',
      children: [
        '【索引】B-Tree：默认索引',
        '【索引】Hash：等值查询',
        '【索引】GiST / GIN：全文搜索、几何数据、JSONB 索引',
        '【索引】BRIN：大表顺序数据索引',
        '【索引】SP-GiST：空间数据分区索引',
        '【事务与并发】隔离级别：读已提交（默认）、可重复读、可序列化',
        '【事务与并发】锁机制：表级锁、行级锁、咨询锁（Advisory Lock）',
        '【事务与并发】SSI（可序列化快照隔离）',
        '【函数与扩展】存储过程与函数（PL/pgSQL）',
        '【函数与扩展】触发器（Trigger）与事件触发器',
        '【函数与扩展】扩展（Extension）：PostGIS、pg_stat_statements、pg_partman',
        '【函数与扩展】外部数据包装器（FDW）：访问外部数据源',
      ]
    },
    {
      name: '运维',
      children: [
        '流复制：物理复制与逻辑复制',
        'PITR：时间点恢复、WAL 归档',
        'VACUUM：垃圾回收与事务 ID 管理',
        '连接池：PgBouncer、Pgpool-II',
        '监控：pg_stat_activity、pg_stat_statements',
      ]
    },
  ],
  groups: [
    {
      name: "推荐资源",
      items: [
        { title: "PostgreSQL 官方文档", url: "https://www.postgresql.org/docs/" },
        { title: "PostgreSQL 实战" }
      ],
    }
  ]
}
</script>
<ContentView :data="data" />
