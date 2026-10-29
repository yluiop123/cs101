---
title: "第 10 章 · 综合实战：一个订单库的优化全过程"
description: "背景：单实例 MySQL 8，shop 库，orders 1200 万行、orderitems 三千万行。近期三类问题集中爆发：商家后台列表页超时、财务对账报表跑不完、磁盘被数据与 binlog 撑满。四表结构与 SQL 基础教程及 第…"
series: mysql
sidebar:
  order: 10
  label: "综合实战：一个订单库的优化全过程"
difficulty: intermediate
duration: 5
tableOfContents: true
---

**本章目标：**

- 用一千万行的 `orders` 表跑完"定位 → 改造 → 验证"的完整闭环
- 把索引、SQL 改写、分区与归档四种手段按顺序落到实处
- 建立可复用的压测脚本与优化前后对比方法

## 10.1 场景与目标表结构

背景：单实例 MySQL 8，`shop` 库，`orders` 1200 万行、`order_items` 三千万行。近期三类问题集中爆发：商家后台列表页超时、财务对账报表跑不完、磁盘被数据与 binlog 撑满。四表结构与 SQL 基础教程及 [第 2 章 · 数据类型与表设计](../02-data-types-schema/) 一致，本章主角是 `orders`：

```sql
CREATE TABLE orders (
  order_id     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_no     VARCHAR(32) NOT NULL COMMENT '对外业务单号',
  customer_id  BIGINT UNSIGNED NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  status       TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '0待付1已付2发货3完成4取消',
  pay_method   TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '0未付1微信2支付宝3银行卡',
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paid_at      DATETIME NULL COMMENT '未支付为 NULL',
  PRIMARY KEY (order_id),
  UNIQUE KEY uk_order_no (order_no),
  KEY idx_customer_created (customer_id, created_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
```

其余三表本章用到的列与现有索引：`customers` 只有主键与 `uk_username`、`uk_mobile`；`products` 除主键与 `uk_product_no` 外没有二级索引；`order_items` 有 `idx_order_product (order_id, product_id)`。隐患很清楚：`orders` 只有 `(customer_id, created_at)` 一条二级索引，没有状态维度也没有独立时间索引。

## 10.2 造数据：灌进一千万行

逐行 `INSERT` 一千万次是不可接受的（第 5 章），这里用"递归 CTE 造序号 + 集合化插入 + 分批提交"：

```sql
CREATE TABLE seq (n BIGINT UNSIGNED NOT NULL, PRIMARY KEY (n));

-- 8.0 递归 CTE：默认递归深度较小，必须显式放大（SELECT @@cte_max_recursion_depth 看默认值）
SET SESSION cte_max_recursion_depth = 10000000;
INSERT INTO seq (n)
WITH RECURSIVE s (n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM s WHERE n < 10000000)
SELECT n FROM s;

-- 50 万客户、5 万商品（customers 的造法同理：用 n 派生唯一的 username/mobile/email）
INSERT INTO products (product_no, title, category_id, price, stock, sales, status)
SELECT CONCAT('P', LPAD(n, 10, '0')), CONCAT('商品-', n), 100 + n % 600,
       ROUND(1 + (n % 9000) / 10, 2), 1000 + n % 5000, n % 20000, 1 + n % 2
FROM seq WHERE n <= 50000;

-- 一千万订单：每批 100 万行一条 INSERT ... SELECT，一条就是一个事务，别攒成巨型事务
INSERT INTO orders (order_no, customer_id, total_amount, status, pay_method, created_at, paid_at)
SELECT CONCAT('NO', LPAD(1000000000 + n, 16, '0')), 1 + n % 500000,
       ROUND(10 + (n % 200000) / 100, 2), n % 5, n % 4,
       NOW() - INTERVAL (n % 100000) MINUTE,
       IF(n % 5 = 0, NULL, NOW() - INTERVAL (n % 100000) MINUTE + INTERVAL 30 MINUTE)
FROM seq WHERE n BETWEEN 1 AND 1000000;
-- 区间依次改成 1000001~2000000 …… 9000001~10000000，再执行 9 次

-- 明细：order_items 用同样的思路插入，join 命中的商品数决定倍数
--   （想放大到三千万行，就让每单命中三行商品）
INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, created_at)
SELECT o.order_id, p.product_id, p.title, 1 + o.order_id % 3, p.price, o.created_at
FROM orders AS o INNER JOIN products AS p ON p.product_id = 1 + o.order_id % 50000;
```

:::tip[放宽刷盘只限实验环境]
数据灌完后用 `SELECT TABLE_NAME, TABLE_ROWS, DATA_LENGTH FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'shop';` 核对规模（`TABLE_ROWS` 是估算值，精确数还要 `COUNT(*)`）。另外 `SET GLOBAL innodb_flush_log_at_trx_commit = 2;` 与 `SET GLOBAL unique_checks = 0;` 能显著提速，但生产禁止，灌完必须改回 1，回到第 5 章的"双一"基线。
:::

## 10.3 第一步：定位问题 SQL

```bash
mysql -e "SET GLOBAL slow_query_log = ON; SET GLOBAL long_query_time = 1;"
mysqldumpslow -s t -t 8 /var/lib/mysql/localhost-slow.log   # 按累计耗时取前 8 条
```

```sql
-- Q1 商家后台：某客户订单列表，用户翻到了很后面
SELECT * FROM orders
WHERE customer_id = 1001 AND status IN (1, 2)
ORDER BY created_at DESC LIMIT 500000, 20;

-- Q2 财务对账：按月统计各支付方式的笔数与金额
SELECT DATE(created_at) AS d, pay_method, COUNT(*) AS cnt, SUM(total_amount) AS amt
FROM orders
WHERE created_at >= '2026-01-01' AND created_at < '2026-02-01'
GROUP BY DATE(created_at), pay_method;

-- Q3 商品列表：类目筛选 + 销量与价格排序
SELECT product_id, title, price, sales FROM products
WHERE category_id = 205 AND status = 1
ORDER BY sales DESC, price ASC LIMIT 20;
```

用第 4 章的方法逐条 `EXPLAIN`，把结论写成对照表：

```text
Q1  key = idx_customer_created，key_len = 8（只吃到 customer_id）
    Extra = Using where; Using filesort  → status 与排序没进索引 + 深分页 + SELECT *
Q2  type = ALL，rows 接近全表，Extra = Using temporary; Using filesort
Q3  type = ALL，rows 约等于商品总数，Extra = Using where; Using filesort
```

## 10.4 第二步：索引改造

顺序按第 3 章口诀：等值 → 多值/范围 → 排序 → 需要覆盖的列。

```sql
ALTER TABLE orders
  ADD KEY idx_c_s_created (customer_id, status, created_at),
  ADD KEY idx_created_pay_amount (created_at, pay_method, total_amount),
  ALGORITHM = INPLACE, LOCK = NONE;

-- sales DESC, price ASC 需要 8.0 的降序索引；5.7 只能把排序改成同方向
ALTER TABLE products
  ADD KEY idx_cat_status_sales_price (category_id, status, sales DESC, price ASC),
  ALGORITHM = INPLACE, LOCK = NONE;

ANALYZE TABLE orders, products;   -- 让优化器拿到新统计信息
-- idx_customer_created 已被新索引的最左前缀覆盖，确认后删除以省写入开销
ALTER TABLE orders DROP KEY idx_customer_created, ALGORITHM = INPLACE, LOCK = NONE;
SELECT * FROM sys.schema_unused_indexes WHERE object_schema = 'shop';
```

:::caution[千万级表建索引要挑执行窗口]
先查 `information_schema.innodb_trx` 确认没有长事务（第 7 章的 MDL 连锁阻塞），再 `SET SESSION lock_wait_timeout = 8;` 让拿不到锁的 DDL 快速失败。单次建索引要几十分钟以上或主从延迟敏感时（第 8 章），改用 gh-ost / pt-osc，并按内存余量调整 8.0.27+ 的 `innodb_ddl_threads`、`innodb_ddl_buffer_size`（`SHOW VARIABLES LIKE 'innodb_ddl%';`）。
:::

## 10.5 第三步：SQL 改写

Q1 用延迟关联，把"扫描 50 万行宽记录"变成"在索引里定位 50 万个主键 + 回表 20 次"：

```sql
-- 慢写法：扫描并丢弃 50 万行，还取回整行所有列
SELECT * FROM orders
WHERE customer_id = 1001 AND status IN (1, 2)
ORDER BY created_at DESC LIMIT 500000, 20;
-- 快写法：内层只在索引里取主键，外层只回表 20 次
SELECT o.order_id, o.order_no, o.total_amount, o.status, o.created_at
FROM orders AS o
INNER JOIN (
  SELECT order_id FROM orders
  WHERE customer_id = 1001 AND status IN (1, 2)
  ORDER BY created_at DESC LIMIT 500000, 20
) AS t ON t.order_id = o.order_id;
```

产品端若能放弃"跳页"，用上一页末行做游标，成本与偏移量彻底无关（`AND (created_at < '2026-02-11 09:30:00' OR (created_at = '2026-02-11 09:30:00' AND order_id < 8899000))`）。Q2 则要消除列上的函数：

```sql
-- 慢写法：上界缺失 + 对列套函数分组，依赖临时表
SELECT DATE(created_at) AS d, pay_method, COUNT(*) AS cnt FROM orders
WHERE created_at >= '2026-01-01' GROUP BY DATE(created_at), pay_method;

-- 快写法：裸列区间 + 分组键与索引同序，统计列被索引覆盖
SELECT DATE(created_at) AS d, pay_method, COUNT(*) AS cnt, SUM(total_amount) AS amt
FROM orders
WHERE created_at >= '2026-01-01' AND created_at < '2026-02-01'
GROUP BY created_at, pay_method;
```

:::tip[报表类查询不该在主库跑]
`GROUP BY` 千万行会撑爆磁盘临时表并冲刷缓冲池。做法：固定路由到从库（第 8 章），或按天预聚合成 `orders_daily_stats` 小表由夜间任务写入、报表只读它 —— 对第 4 章的 `Created_tmp_disk_tables` 指标改善最直接。
:::

## 10.6 第四步：分区与归档

`orders` 的写入集中在最近三个月，历史行只查不改，适合按时间 RANGE 分区，让冷数据能被整块摘走：

```sql
-- 分区键必须包含在所有唯一键内：主键要从 (order_id) 扩成 (order_id, created_at)
ALTER TABLE orders DROP PRIMARY KEY, ADD PRIMARY KEY (order_id, created_at);

ALTER TABLE orders PARTITION BY RANGE (TO_DAYS(created_at)) (
  PARTITION p2025q4 VALUES LESS THAN (TO_DAYS('2026-01-01')),
  PARTITION p2026q1 VALUES LESS THAN (TO_DAYS('2026-04-01')),
  PARTITION pmax    VALUES LESS THAN (MAXVALUE)
);

-- 冷数据摘除：一条 DDL，不产生海量行级 undo 与 binlog 事件
ALTER TABLE orders DROP PARTITION p2025q4;
```

:::danger[分区不是索引的替代品]
条件里没有分区键时，MySQL 要扫**所有**分区（裁剪失效），可能比不分区更慢：上线前用 `EXPLAIN SELECT COUNT(*) FROM orders WHERE created_at >= '2026-01-01' AND created_at < '2026-02-01';` 确认 `partitions` 列只剩一个分区。改主键与 `PARTITION BY` 都是全表重建级别的 DDL（第 4 章），必须在维护窗口或用影子表工具完成；`SELECT partition_name, table_rows FROM information_schema.partitions WHERE table_schema = 'shop' AND table_name = 'orders';` 应成为常规巡检项。
:::

分区覆盖不到的历史数据用归档脚本搬到归档库：

```bash
#!/usr/bin/env bash
# archive_orders.sh —— 把 18 个月前的订单搬到归档库再从主库删除
set -euo pipefail
SRC="shop"; DST="shop_archive"; MONTHS=18; BATCH=2000

while :; do
  # 只按主键操作：条件走索引、锁范围可控（第 7 章）；GROUP_CONCAT 长度要先放大
  ids=$(mysql -N -B -uroot -p "$SRC" -e \
    "SET SESSION group_concat_max_len = 4194304;
     SELECT GROUP_CONCAT(order_id) FROM (
       SELECT order_id FROM orders
        WHERE created_at < DATE_SUB(CURDATE(), INTERVAL $MONTHS MONTH)
        ORDER BY created_at LIMIT $BATCH) t")
  if [ -z "${ids:-}" ] || [ "$ids" = "NULL" ]; then break; fi
  mysql -uroot -p "$SRC" -e \
    "START TRANSACTION;
     INSERT INTO ${DST}.orders SELECT * FROM ${SRC}.orders WHERE order_id IN ($ids);
     DELETE FROM ${SRC}.orders WHERE order_id IN ($ids);
     COMMIT;"
  sleep 0.5
done

# 生产更常用 pt-archiver：限速、可 --dry-run、自带主从延迟保护
pt-archiver --source h=127.0.0.1,D=shop,t=orders --dest h=127.0.0.1,D=shop_archive,t=orders \
  --where "created_at < DATE_SUB(CURDATE(), INTERVAL 18 MONTH)" \
  --limit 2000 --commit-each --sleep 0.5 --max-lag 1 --progress 10000
```

## 10.7 第五步：压测验证与自查清单

```bash
#!/usr/bin/env bash
# bench.sh DIR —— 目录内每条 SQL 各跑 50 次，输出累计耗时；可重复、可留档
set -euo pipefail
for f in "$1"/*.sql; do
  s=$(date +%s.%N)
  for i in $(seq 1 50); do mysql -N -B -uroot -p shop < "$f" > /dev/null; done
  printf '%-28s %8.2fs\n' "$(basename "$f")" "$(echo "$(date +%s.%N) - $s" | bc)"
done
```

```text
下表是作者本机实验数据上的量级示意：绝对数字一定因机而异，要看的是同一环境的前后倍数
用例                    优化前    优化后   EXPLAIN 关键变化
01-customer-list        48.6 s    1.9 s   type=ALL→range；filesort 消失；rows 显著下降
02-daily-report         96.2 s    3.4 s   全表→区间；Using index；temporary 消失
03-product-rank          6.1 s    0.4 s   key=NULL→新联合索引；排序沿索引完成
orders + 索引体积        8.4 GB   6.7 GB  归档 18 个月前数据 + 删除被覆盖的冗余索引
```

自查清单（可直接抄进团队 checklist）：

- [ ] 优化对象按"累计耗时"排序，有慢日志聚合结果作依据
- [ ] 每条改动 SQL 都留有前后两份 `EXPLAIN`，`key`/`key_len`/`rows`/`Extra` 四项可比
- [ ] 新增索引都对应真实查询，被前缀覆盖的冗余索引已清理，统计信息已更新
- [ ] 无 `SELECT *`、无列上函数、无隐式类型转换、无前导通配 `LIKE`
- [ ] 深分页有游标或延迟关联方案；报表走从库或预聚合表
- [ ] 大表 DDL 有执行窗口、长事务检查、`lock_wait_timeout` 与回滚方案；分区或归档前确认查询带分区键，且有第 9 章的可验证备份兜底
- [ ] 压测脚本可重复执行，前后数字写入变更单；未达标不算完成

## 本章小结

- 闭环固定五步：慢日志定位 → `EXPLAIN` 定性 → 索引改造 → SQL 与架构改写 → 压测对比，每步都留下前后证据
- 索引顺序遵循"等值 → 多值/范围 → 排序"，改完必须 `ANALYZE TABLE` 并清理被覆盖的旧索引
- 深分页交给游标或延迟关联，报表交给从库或预聚合表，冷数据交给 `DROP PARTITION` 或 `pt-archiver`
- 一切数字以你自己的实例与数据分布实测为准，本章的容量参数与耗时只用于说明方法
