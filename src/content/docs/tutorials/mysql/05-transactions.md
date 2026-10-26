---
title: "第 5 章 · 事务与 ACID"
description: "-- 开启事务的三种等价写法"
series: mysql
sidebar:
  order: 5
  label: "事务与 ACID"
difficulty: intermediate
duration: 6
---

**本章目标：**

- 掌握事务边界语句与 `autocommit` 的真实行为
- 说清 redo log、undo log、刷盘参数如何换来原子性与持久性
- 识别并排查长事务，写出可回滚、不拖垮库的应用事务代码

## 5.1 事务边界：BEGIN / COMMIT / ROLLBACK

```sql
-- 开启事务的三种等价写法
START TRANSACTION;
BEGIN;

-- 一组操作要么全成，要么全败
START TRANSACTION;
  UPDATE products SET stock = stock - 1 WHERE product_id = 2001 AND stock > 0;
  INSERT INTO orders (order_no, customer_id, total_amount, status)
    VALUES ('NO20260301001', 1001, 199.00, 0);
  INSERT INTO order_items (order_id, product_id, quantity, unit_price)
    VALUES (LAST_INSERT_ID(), 2001, 1, 199.00);
COMMIT;
-- 任何一步出错就整体撤销
ROLLBACK;
```

保存点可以只回滚事务的一段：

```sql
START TRANSACTION;
  INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (1, 10, 1, 9.90);
  SAVEPOINT sp1;
  INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (1, 11, 1, 19.90);
  ROLLBACK TO SAVEPOINT sp1;   -- 只撤销第二条，第一条还在事务里
COMMIT;
```

`autocommit` 决定"每条语句是不是一个自带提交的事务"：

```sql
SELECT @@global.autocommit, @@session.autocommit;   -- 默认通常都是 1（以实际值为准）
SET SESSION autocommit = 0;      -- 之后必须显式 COMMIT，否则连接关闭时自动回滚
```

:::danger[这些语句会偷偷帮你提交]
DDL（`CREATE/ALTER/DROP`、`TRUNCATE`）、`GRANT`、`ANALYZE TABLE`、隐式提交类语句会在执行前后各提交一次当前事务；`LOCK TABLES` 也会先提交再上锁。所以"先 BEGIN 再 ALTER 再 ROLLBACK"是回滚不掉的——DDL 天生不可回滚，迁移脚本要按这个前提设计。
:::

其他两个实用形态：

```sql
START TRANSACTION READ ONLY;   -- 只读事务：优化器可少做锁簿记，误写会直接报错
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;  -- 只对下一个事务生效（第 6 章）
```

## 5.2 ACID 分别由谁实现

```text
A 原子性   undo log：先把"改之前长什么样"记下来，失败时反向恢复
C 一致性   约束（主键/唯一/NOT NULL/外键）+ 触发器 + 你的业务代码 + 事务边界
I 隔离性   锁 + MVCC：并发事务互相看不到不该看到的中间状态（第 6、7 章）
D 持久性   redo log（WAL）+ 刷盘策略 + doublewrite：提交了就认为不会丢
```

一致性是**目的**，其余三者是**手段**。数据库只能保证它认识的约束，"库存不能为负"这种规则要靠你写进 `CHECK` 约束、唯一索引或代码里 —— MySQL 8.0.16+ 才真正强制执行 `CHECK` 约束（更早版本只是解析后忽略，可用 `SELECT VERSION();` 确认）。

## 5.3 redo log：先写日志，再改数据

如果每次提交都把缓冲池里脏的 16KB 页刷到随机位置，成本会高得不可用。InnoDB 用 **WAL（Write-Ahead Logging）**：

```text
1. 修改先在内存页上做，同时把"哪个页改了什么"顺序追加进 redo log（在内存 redo buffer）
2. 提交时按策略把 redo log 落盘（fsync）
3. 脏页由后台线程择机刷盘（checkpoint 向前推进）
4. 崩溃后重启：redo buffer 里已落盘的记录重新应用到页上 → crash-safe
```

顺序写 + 组提交（多个事务的 redo 合并成一次 fsync）是 MySQL 写性能好的根本原因。

刷盘强度由参数控制：

```sql
SHOW VARIABLES WHERE Variable_name IN
  ('innodb_flush_log_at_trx_commit', 'sync_binlog', 'innodb_flush_log_at_trx_commit');

SELECT @@innodb_flush_log_at_trx_commit;   -- 以实际值为准，默认通常是 1
```

```text
innodb_flush_log_at_trx_commit
  1  每次提交都写 redo buffer + fsync  → 不丢事务（默认，最安全）
  2  每次提交写到 OS page cache，每秒 fsync → OS 崩溃可能丢 1 秒
  0  每秒才写一次 → mysqld 进程崩溃就可能丢 1 秒
sync_binlog
  1  每次提交 fsync binlog（主库标配，与上面组成"双一"）
  N  每 N 个事务 fsync 一次，性能换安全
```

:::caution[只调一半等于没调]
`innodb_flush_log_at_trx_commit = 1` 但 `sync_binlog = 0`：崩溃后可能出现"从库有这条 binlog、主库数据没了"或反之的错乱。主库要成对设置；纯分析型从库可以放宽两位以换吞吐。
:::

redo log 的容量决定崩溃恢复时长与刷脏压力：

```sql
-- 8.0.30+ 用单一容量参数；更早版本看 innodb_log_file_size × 组数
SHOW VARIABLES WHERE Variable_name LIKE 'innodb_log%';
SHOW VARIABLES LIKE 'innodb_redo_log_capacity';
```

## 5.4 undo log：回滚与快照的两个用途

一行被改了三次，undo log 里就串起一条**版本链**：

```text
当前行 (trx_id = 300, roll_ptr) → undo(值 C, trx 300) → undo(值 B, trx 200) → undo(值 A, trx 100)
```

它的两个用途：

```text
1. 回滚：ROLLBACK 时沿链逆向恢复 —— 原子性
2. 快照：别的事务读这行时，沿链找到"我可见的那一版" —— MVCC（第 6 章）
```

旧版本由 **purge 线程**在确认无人需要后清理。事务开始时间越老，需要保留的 undo 越多，这就是长事务让库爆炸的原因：

```sql
-- 回滚段里积压的未 purge 事务数：这个值持续上涨就该报警
SHOW ENGINE INNODB STATUS\G        -- 找 "History list length"
SELECT COUNT(*) FROM information_schema.innodb_trx;   -- 当前活动事务数
```

## 5.5 长事务的危害

长事务的定义不是"跑得久"，而是**持有快照或锁时间过久的连接**。

```text
1. undo 无法 purge → 回滚段膨胀，版本链变长 → 快照读要沿链走很远，查询越来越慢
2. 行锁/元数据锁长时间不放 → 后面的更新排队，DDL 卡住并连带阻塞全部查询（第 7 章）
3. RR 隔离级别下，事务内第一次快照读的 read view 会一直用到提交 → 看到的数据越来越旧
4. 复制延迟：从库按事务回放，一个大事务让从库停顿几十秒（第 8 章）
5. 连接归还到池里但事务没结束 → 下一个请求继承了这个未提交事务，故障极难复现
```

排查用这两条：

```sql
SELECT trx_id, trx_state, trx_started,
       TIMESTAMPDIFF(SECOND, trx_started, NOW()) AS run_sec,
       trx_mysql_thread_id, LEFT(trx_query, 80) AS q
FROM information_schema.innodb_trx
ORDER BY trx_started
LIMIT 10;

KILL 12345;   -- trx_mysql_thread_id：确认是问题连接后再杀
```

:::danger[事务里不要做这些事]
调用外部 HTTP/RPC、读写 Redis、发消息队列、遍历大结果集做复杂计算、等待人工输入 —— 都发生在事务持有锁与快照期间。正确姿势是：短事务读 → 事务外算 → 短事务写；远程调用放到事务提交后（或用本地消息表/事务性发件箱模式）。
:::

## 5.6 应用侧的事务姿势

批量写 1000 行的两种写法，性能差距可达一到两个数量级：

```sql
-- 慢写法：autocommit = 1，每行一次事务 → 1000 次 redo fsync
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (1, 10, 1, 9.90);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (1, 11, 1, 10.90);
-- …共 1000 条

-- 快写法 1：一条多值 INSERT，一个事务一次刷盘
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
  (1, 10, 1, 9.90),
  (1, 11, 1, 10.90),
  (1, 12, 2, 19.90);

-- 快写法 2：显式包一个事务，攒够一批再提交
START TRANSACTION;
  -- 500 条单行 INSERT
COMMIT;
```

但事务不是越大越好：单事务建议控制在**百毫秒级、几千行以内**，太大就分批提交，兼顾锁持有时间与崩溃恢复代价。

应用代码的通用约定（任何语言/ORM 都适用）：

```text
1. 事务必须绑定同一连接：开始事务时从池里借一个连接，全程不换
2. 用 try/finally（或语言提供的 with / defer）保证 COMMIT 或 ROLLBACK 必有一个被执行
3. 设置事务级超时：MAX_EXECUTION_TIME（只读语句）或业务侧超时 + KILL
4. 重试逻辑只针对"可重试错误"（死锁 1213、锁等待超时 1205），并限制次数
5. 对外接口不要在事务里做鉴权、缓存、日志上报
```

```bash
# 看当前有多少连接处于 Sleep 但事务未结束（8.0）
mysql -e "SELECT * FROM information_schema.innodb_trx WHERE trx_query IS NULL ORDER BY trx_started;"
```

## 5.7 综合练习：安全扣库存

需求：用户下单时扣减 3 个商品的库存，任一商品库存不足则整单失败。

```sql
-- 请实现并逐条验证
START TRANSACTION;
  UPDATE products
     SET stock = stock - 3
   WHERE product_id = 2001 AND stock >= 3;   -- 用条件保护，别先读再写
  -- 检查影响行数：ROW_COUNT() 为 0 说明库存不足 → ROLLBACK
  INSERT INTO orders (order_no, customer_id, total_amount, status) VALUES ('NO20260301002', 1001, 397.00, 0);
  INSERT INTO order_items (order_id, product_id, quantity, unit_price)
    VALUES (LAST_INSERT_ID(), 2001, 3, 199.00);
COMMIT;
```

练习清单：

1. 在两个终端里并发执行上面的事务（同一 `product_id`，`stock` 初始为 4），观察结果：为什么"读-改-写"三步分开写会超卖，而带 `stock >= 3` 条件的单条 `UPDATE` 不会？
2. 把第一个终端停在 `UPDATE` 之后不提交，去第二个终端执行同一语句，记录它卡住的现象；再用 `information_schema.innodb_trx` 查出阻塞者并 `KILL`。
3. 把 `innodb_flush_log_at_trx_commit` 从 1 改成 2（实验环境），用脚本插入 1 万行，比较耗时；说清你牺牲了什么。
4. 用 `SHOW ENGINE INNODB STATUS\G` 在事务前后各看一次 `History list length`，解释它为什么在长事务期间不上涨、提交后由 purge 慢慢降下来。

## 本章小结

- 事务边界靠 `START TRANSACTION`/`COMMIT`/`ROLLBACK`/`SAVEPOINT`；DDL 隐式提交且不可回滚，`autocommit = 0` 时会话必须显式收尾
- 原子性来自 undo log，持久性来自 redo log + WAL + 刷盘策略，"双一"是主库的安全基线
- undo log 同时支撑回滚和 MVCC 快照，purge 依赖最老活跃事务，因此长事务会让版本链膨胀、锁与 MDL 长期不释放
- 应用侧写事务：短事务、绑定连接、异常路径必回滚、事务里不做远程调用，批量写用多值 INSERT 或显式合并提交
