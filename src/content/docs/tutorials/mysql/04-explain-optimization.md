---
title: "第 4 章 · 执行计划与查询优化"
description: "EXPLAIN 打印的是优化器打算怎么执行，不是实际耗时。语法是把 EXPLAIN 加在任何 SELECT 前面："
series: mysql
sidebar:
  order: 4
  label: "执行计划与查询优化"
difficulty: intermediate
duration: 6
tableOfContents: true
---

**本章目标：**

- 读懂 `EXPLAIN` 输出里的 type、key、key_len、rows、Extra
- 用慢查询日志把"最该优化的 SQL"捞出来并量化
- 改造深分页与文件排序，安全地给大表做 DDL

## 4.1 EXPLAIN 全景：先跑起来

`EXPLAIN` 打印的是优化器**打算怎么执行**，不是实际耗时。语法是把 `EXPLAIN` 加在任何 `SELECT` 前面：

```sql
EXPLAIN
SELECT order_id, customer_id, total_amount, created_at
FROM orders
WHERE customer_id = 1001 AND status = 1
ORDER BY created_at DESC
LIMIT 10;
```

终端里用 `\G` 竖排更好读；也可以看 JSON 形态获得代价估算：

```sql
EXPLAIN FORMAT=JSON SELECT ...;    -- 含 cost_info：read_cost / eval_cost / prefix_cost
EXPLAIN ANALYZE
SELECT ...;                        -- 8.0.18+：真的执行一遍，输出实际行数与耗时
```

`EXPLAIN ANALYZE` 会**执行**语句（对 `SELECT` 安全，别拿它跑 `UPDATE`），它是"估算 vs 实测"最直接的对比工具：如果 `rows` 估算 1 行而实际返回 20 万行，就说明统计信息或数据倾斜出了问题。

一次输出里最值得盯的四列：

```text
type        访问类型（好坏阶梯）
key         实际用到的索引（NULL 就是没用上）
rows        预计要扫描的行数（估算值，不是返回行数）
Extra       执行细节与警告信号
```

:::tip[统计信息可能过期]
`rows` 来自采样统计。刚做完大批量导入后，执行 `ANALYZE TABLE orders;` 重新采样（8.0 下它对 InnoDB 只更新统计、不锁写），优化器可能立刻改变索引选择。
:::

## 4.2 type 与 key_len：命中了多少索引

type 从好到坏的经典阶梯：

```text
system / const      主键或唯一索引等值，最多一行 —— 直接拿
eq_ref              JOIN 时被驱动侧按主键/唯一索引等值匹配，每行一次
ref                 非唯一索引等值匹配，或唯一索引的最左前缀等值
range               索引范围扫描：IN、BETWEEN、>、<、前导 LIKE 'abc%'
index               扫整棵索引树（覆盖索引时可行，否则等于全表 + 额外回表）
ALL                 全表扫描 —— 大表上这是报警信号
```

中间还有 `index_merge`（多个索引结果合并，常提示索引设计不佳）、`ref_or_null`、`fulltext`。

key_len 告诉你**联合索引用到了第几列**。它按"索引定义顺序"累加，不是按 WHERE 书写顺序：

```sql
-- 索引 idx_c_s_c (customer_id BIGINT UNSIGNED NOT NULL,
--                status TINYINT UNSIGNED NOT NULL,
--                created_at DATETIME NULL)
```

```text
定长部分   BIGINT 8 / INT 4 / SMALLINT 2 / TINYINT 1 / DATETIME 5 / TIMESTAMP 4 / DATE 3
可空加 1   该列允许 NULL 再 +1 字节
变长加 2   VARCHAR / 字符串列还要 +2 字节长度前缀；CHAR(n) 是 n × 每字符字节数
utf8mb4    每字符最多按 4 字节算：VARCHAR(50) → 50 × 4 + 2
```

于是上面索引的 key_len：只用 `customer_id` → 8；加 `status` → 9；再加 `created_at` → 9 + 5 + 1 = 15。看到 `key_len = 8` 而你期望三列都用上，就说明最左前缀断了（回顾 第 3 章 · 索引与 B+ 树）。

:::caution[`possible_keys` 有值不等于会用]
优化器按成本决定最终 `key`。小表、命中比例过高、`SELECT *` 导致大量回表，都会让它宁选 `ALL`。想让优化器"再看看"，先更新统计信息，再考虑 `FORCE INDEX`——但强制索引是双刃剑，数据分布一变就可能更慢，线上慎用并留下说明。
:::

## 4.3 Extra、rows 与 filtered

```text
Using index              覆盖索引，没有回表（好）
Using index condition    ICP：在引擎层用索引剩余条件先过滤，减少回表次数（好）
Using where              需要 Server 层再过滤一遍行
Using filesort           需要在排序缓冲区/临时文件里重排（关注）
Using temporary          需要临时表，常见于 GROUP BY 与 DISTINCT（关注）
Using join buffer        被驱动表没走索引，靠连接缓冲区或哈希连接（关注）
```

组合起来的典型判读：

```text
type=range + key_len 只有一列 + Extra=Using where; Using filesort
→ 索引用得不完整，还额外排序：优先调索引顺序

type=ALL + rows 很大 + filtered 很小
→ 扫全表丢掉了绝大多数行：条件列缺索引，或选择性判断有误
```

`filtered` 是"预计过滤后剩余行占 rows 的百分比"。`rows = 100000, filtered = 0.11` 意味着扫十万行只为留一百行——这种查询是加联合索引的头号目标。

## 4.4 慢查询日志：把最该改的 SQL 捞出来

```sql
SHOW VARIABLES LIKE 'slow_query_log%';
SHOW VARIABLES LIKE 'long_query_time';

-- 运行时打开（重启失效，正式配置写进 my.cnf）
SET GLOBAL slow_query_log = ON;
SET GLOBAL long_query_time = 1;
SET GLOBAL log_queries_not_using_indexes = OFF;  -- 打开会淹没有价值的大查询
```

```bash
# 日志位置
sudo tail -f /var/lib/mysql/localhost-slow.log

# 官方聚合工具：按耗时排序取前 10
mysqldumpslow -s t -t 10 /var/lib/mysql/localhost-slow.log

# 更专业的：pt-query-digest（Percona Toolkit，输出指纹聚合报告）
pt-query-digest /var/lib/mysql/localhost-slow.log | head -60
```

不想依赖日志，也可以问内存里的统计表：

```sql
SELECT DIGEST_TEXT, COUNT_STAR,
       ROUND(SUM_TIMER_WAIT / 1e12, 2) AS total_sec,
       AVG_ROWS_EXAMINED, AVG_CREATED_TMP_DISK_TABLES
FROM performance_schema.events_statements_summary_by_digest
ORDER BY SUM_TIMER_WAIT DESC
LIMIT 10;

SELECT * FROM sys.statement_analysis LIMIT 10;   -- 需 sys 库（8.0 默认自带）
```

:::tip[优化顺序]
先看"总耗时最大"的语句（累计效应），而不是"单次最慢"的那条。低频大查询可以靠拆任务解决，高频中等查询才通常是系统瓶颈。
:::

## 4.5 深分页与文件排序

慢写法与快写法：

```sql
-- 慢写法：偏移 100 万，MySQL 必须取出 1000010 行再丢掉前 100 万行
SELECT order_id, customer_id, created_at, total_amount
FROM orders
ORDER BY order_id
LIMIT 1000000, 10;

-- 快写法 1（游标/连续翻页）：用上一页的最大主键当起点，永远只扫 10 行
SELECT order_id, customer_id, created_at, total_amount
FROM orders
WHERE order_id > 1000000
ORDER BY order_id
LIMIT 10;

-- 快写法 2（延迟关联）：先在索引里定位主键，再回表 10 次
SELECT o.order_id, o.customer_id, o.created_at, o.total_amount
FROM orders AS o
INNER JOIN (
  SELECT order_id
  FROM orders
  ORDER BY order_id
  LIMIT 1000000, 10
) AS t ON t.order_id = o.order_id;
```

延迟关联快的原因：子查询只碰聚簇索引的键，不回表取宽行，服务器不需要搬运一百万行的其他列；外层只对 10 个主键做点查。

文件排序（filesort）：

```sql
-- 慢写法：ORDER BY 与索引顺序无关 → 取出全部满足条件的行再排序
SELECT order_id, created_at
FROM orders
WHERE customer_id = 1001
ORDER BY total_amount DESC
LIMIT 10;

-- 快写法：把排序列纳入索引，让它沿着树走
ALTER TABLE orders ADD KEY idx_c_amount (customer_id, total_amount DESC);

-- 万不得已要排大结果集时，确认排序内存（以实际值为准）
SELECT @@sort_buffer_size;   -- 按连接分配，不是全局内存；调到 8M 级别通常够用
```

:::caution[排序方向必须与索引方向匹配]
`ORDER BY a DESC, b ASC` 这种混合方向，5.7 及以前无法用索引满足；8.0 支持降序索引，可以显式建 `(a DESC, b ASC)`。先 `SELECT VERSION();` 再决定写法。
:::

## 4.6 大表 DDL 与 online DDL

千万级表上加一列、建一个索引，能不能不锁表？取决于算法：

```sql
-- 8.0.19+ 可以先问一句：要不要重建表、能否并发 DML
EXPLAIN ALTER TABLE orders ADD COLUMN remark VARCHAR(255) NOT NULL DEFAULT '';
```

```text
INSTANT   只改元数据，秒级完成，不碰历史行 —— 8.0.12+ 的加列默认走它
INPLACE   在原表结构上就地改，多数操作允许并发读写（LOCK = NONE）
COPY      建临时表全量拷贝再切换，期间开销大 —— 需要避免
```

```sql
-- 显式声明意图：达不到就报错，而不是悄悄退化成 COPY
ALTER TABLE orders
  ADD KEY idx_status_created (status, created_at),
  ALGORITHM = INPLACE,
  LOCK = NONE;
```

即便如此，INPLACE 也要在最后阶段短暂拿元数据锁，若此时有长事务占着表，DDL 会排队并且**把它后面的所有查询一起堵住**（第 7 章详解 MDL 连锁阻塞）。稳妥做法：

```sql
-- 先看有没有长事务，再动手
SELECT trx_id, trx_started, trx_mysql_thread_id, trx_query
FROM information_schema.innodb_trx
WHERE trx_started < NOW() - INTERVAL 10 SECOND;
```

超大表或有严格 SLA 时，用第三方工具：`gh-ost`（伪装从库读 binlog 增量拷贝，可随时暂停回滚）或 `pt-online-schema-change`（影子表 + 触发器 + 原子改名）。它们的共同套路是"影子表 + 增量同步 + 切换"，代价是需要额外磁盘空间与更长的总时长。

## 4.7 综合练习

给 `order_items`（千万行）做一次完整诊断。原始 SQL：

```sql
SELECT oi.item_id, oi.product_id, oi.quantity, oi.unit_price, p.title
FROM order_items AS oi
INNER JOIN products AS p ON p.product_id = oi.product_id
WHERE oi.order_id = 88991
ORDER BY oi.item_id
LIMIT 20;
```

请按以下步骤操作并记录结论：

1. `EXPLAIN` 逐列抄下 type、key、key_len、rows、Extra，判断 `order_items` 上以 `order_id` 打头的索引是否存在。
2. 缺索引就补：`ALTER TABLE order_items ADD KEY idx_order_product (order_id, product_id), ALGORITHM = INPLACE, LOCK = NONE;`，然后复跑 `EXPLAIN` 对比 `rows` 变化。
3. 确认 `products.product_id` 与 `oi.product_id` 类型完全一致（`SHOW CREATE TABLE`），否则 JOIN 侧的 `eq_ref` 会退化成 `ALL`。
4. 用慢查询日志验证：把 `long_query_time` 临时调到 0，让这条语句进日志，再用 `mysqldumpslow -s t` 看它的累计耗时。
5. 自查：这次改动前后，扫描行数下降了几倍？有没有引入冗余索引？

## 本章小结

- `EXPLAIN` 的四列主判据是 type（访问阶梯）、key + key_len（用了哪条索引的第几列）、rows/filtered（扫多少行、留多少行）、Extra（覆盖、ICP、filesort、temporary）
- 慢查询定位靠 `slow_query_log` + `mysqldumpslow` / `pt-query-digest`，或直接读 `performance_schema` 的聚合表；优先优化累计耗时最大的语句
- 深分页用游标条件或延迟关联改造，让扫描行数与偏移量脱钩；排序尽量交给与 `ORDER BY` 方向一致的联合索引
- 大表 DDL 依次争取 `INSTANT`、`INPLACE + LOCK = NONE`，先查长事务，超大表用 gh-ost / pt-osc 的影子表方案
