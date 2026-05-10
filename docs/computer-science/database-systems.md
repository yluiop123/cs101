<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: '数据库系统原理',
  description: '数据库系统是信息管理的核心，理解其内部原理对设计高效、可靠的数据存储方案至关重要。',
  items: [
    {
      name: '关系模型',
      children: [
        { title: '**关系**：表、行、列' },
        { title: '**键**：主键、外键、候选键' },
        { title: '**完整性约束**：实体完整性、参照完整性、用户定义完整性' },
        { title: '**关系代数**：选择、投影、连接、除等' },
      ],
    },
    {
      name: 'SQL 语言',
      children: [
        { title: '**DDL**：CREATE、ALTER、DROP' },
        { title: '**DML**：SELECT、INSERT、UPDATE、DELETE' },
        { title: '**DCL**：GRANT、REVOKE' },
        { title: '**TCL**：COMMIT、ROLLBACK、SAVEPOINT' },
        { title: '**JOIN**：INNER、LEFT、RIGHT、FULL、CROSS' },
        { title: '**子查询**：标量子查询、相关子查询、EXISTS' },
        { title: '**窗口函数**：ROW_NUMBER、RANK、SUM OVER' },
        { title: '**CTE**：公用表表达式、递归 CTE' },
      ],
    },
    {
      name: '索引原理',
      children: [
        { title: 'B+ Tree 索引 | 范围查询高效，InnoDB 默认' },
        { title: '哈希索引 | 等值查询 O(1)，不支持范围查询' },
        { title: '全文索引 | 文本搜索' },
        { title: '空间索引 | GIS 数据' },
        { title: '**索引覆盖**：无需回表查询' },
        { title: '**最左前缀原则**：联合索引匹配规则' },
        { title: '**索引下推**：减少回表次数' },
      ],
    },
    {
      name: '查询优化',
      children: [
        { title: '**EXPLAIN**：查看执行计划' },
        { title: '**查询优化器**：基于成本的优化（CBO）' },
        { title: '**连接策略**：Nested Loop、Hash Join、Sort Merge Join' },
        { title: '**查询重写**：谓词下推、投影下推' },
        { title: '**统计信息**：基数估算、直方图' },
      ],
    },
    {
      name: '事务 ACID',
      children: [
        { title: '**A（原子性）**：事务不可分割，全部成功或全部回滚' },
        { title: '**C（一致性）**：事务前后数据完整性约束' },
        { title: '**I（隔离性）**：并发事务互不干扰' },
        { title: '**D（持久性）**：提交后数据永久保存' },
      ],
    },
    {
      name: '隔离级别与 MVCC',
      children: [
        { title: '**隔离级别**：读未提交、读已提交、可重复读、可序列化' },
        { title: '**MVCC**：多版本并发控制，快照读' },
        { title: '**Undo Log**：版本链、回滚操作' },
        { title: '**当前读 vs 快照读**：锁定读 vs 非锁定读' },
        { title: '**幻读**：间隙锁解决' },
      ],
    },
    {
      name: '锁机制',
      children: [
        { title: '**行锁**：记录锁、间隙锁、临键锁' },
        { title: '**表锁**：意向锁、自增锁' },
        { title: '**死锁检测**：等待图、超时机制' },
        { title: '**两阶段锁协议（2PL）**：加锁阶段、解锁阶段' },
      ],
    },
    {
      name: '存储引擎',
      children: [
        { title: '**InnoDB**：支持事务、行锁、MVCC，默认引擎' },
        { title: '**MyISAM**：表锁、全文索引、不支持事务' },
        { title: '**页结构**：数据页、索引页' },
        { title: '**行格式**：Compact、Redundant、Dynamic、Compressed' },
      ],
    },
    {
      name: '缓冲管理',
      children: [
        { title: '**Buffer Pool**：LRU 变体、预读' },
        { title: '**WAL**：Write-Ahead Logging，保证持久性' },
        { title: '**Checkpoint**：将脏页刷入磁盘' },
        { title: '**Redo Log / Undo Log**：崩溃恢复与回滚' },
        { title: '**双写缓冲**：防止部分页写入失败' },
      ],
    },
    {
      name: '范式设计',
      children: [
        { title: '**1NF**：属性不可再分' },
        { title: '**2NF**：消除部分依赖' },
        { title: '**3NF**：消除传递依赖' },
        { title: '**BCNF**：修正的 3NF' },
      ],
    },
    {
      name: '分布式数据库',
      children: [
        { title: '**分片**：水平分片、垂直分片' },
        { title: '**复制**：主从复制、多主复制' },
        { title: '**分布式事务**：两阶段提交（2PC）、三阶段提交（3PC）' },
        { title: '**BASE**：基本可用、软状态、最终一致性' },
      ],
    },
    {
      name: 'CAP 定理',
      children: [
        { title: '**C（一致性）**：所有节点数据一致' },
        { title: '**A（可用性）**：每次请求都能获得响应' },
        { title: '**P（分区容忍性）**：系统允许网络分区' },
        { title: '**CAP 权衡**：最多同时满足两个' },
        { title: '**PACELC 扩展**：分区时 vs 正常时的取舍' },
        { title: '**最终一致性**：DNS、CDN 等应用场景' },
      ],
    },
  ],
  groups: [
    {
      name: "推荐资源",
      items: [
        { title: "《数据库系统概念》" },
        { title: "《高性能 MySQL》" },
        { title: "《MySQL 技术内幕：InnoDB 存储引擎》" }
      ],
    }
  ]
}
</script>
<ContentView :data="data" />
