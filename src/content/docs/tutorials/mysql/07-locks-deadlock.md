---
title: "第 7 章 · 锁与死锁"
description: "按粒度 全局锁 → 表级锁（含 MDL、意向锁）→ 行级锁（记录/间隙/next-key）"
series: mysql
sidebar:
  order: 7
  label: "锁与死锁"
difficulty: intermediate
duration: 7
tableOfContents: true
---

**本章目标：**

- 建立从全局锁到行锁的完整锁地图，知道每个场景实际加的是哪一层
- 看懂记录锁、间隙锁、next-key 锁的加锁规则与后果
- 独立排查锁等待与死锁，并用参数与写法把它们控制在可接受范围

## 7.1 锁的地图

```text
按粒度   全局锁 → 表级锁（含 MDL、意向锁）→ 行级锁（记录/间隙/next-key）
按模式   共享（S，读）/ 排他（X，写）
按来源   语句自动加（InnoDB）/ 显式语句加（LOCK TABLES、FOR UPDATE）
```

InnoDB 行锁的粒度是**索引记录**上的锁，这一点决定了第 7.4 节所有"看起来夸张"的加锁范围：条件走哪个索引、走到第几列，锁就落在那个范围的记录与间隙上。

```sql
-- 看当前锁状态（8.0，需要权限）
SELECT engine_thread_id, thread_id, trx_id, trx_state, trx_started, LEFT(trx_query, 60) AS q
FROM information_schema.innodb_trx
ORDER BY trx_started;

SELECT * FROM performance_schema.data_locks;        -- 8.0；5.7 是 information_schema.innodb_locks
SELECT * FROM performance_schema.data_lock_waits;   -- 谁在等谁
```

## 7.2 全局锁与表级锁

全局锁只有一件事要做：让整个库进入只读，用于**逻辑备份**。

```sql
FLUSH TABLES WITH READ LOCK;   -- 整库只读：DDL、更新语句、事务提交全部阻塞
UNLOCK TABLES;
```

:::caution[别在主库上随手 FTWRL]
主库执行全局锁期间，所有写入排队，锁释放瞬间积压请求可能打爆连接池（`Threads_running` 飙升）。备份 InnoDB 库应当用 `mysqldump --single-transaction`（靠 MVCC 拿一致性快照，不加全局锁，第 9 章详解），真正需要 FTWRL 的只有 MyISAM 表或需要冻结全局的切换动作。
:::

表级锁的三种常见形态：

```sql
-- 显式表锁（会话级，UNLOCK TABLES 或断开才释放）
LOCK TABLES orders READ, customers WRITE;
UNLOCK TABLES;

-- 意向锁：InnoDB 自动加，作用是让表锁与行锁能快速判断冲突
--   IS（行级读锁的意向）/ IX（行级写锁的意向），与表级锁互斥
--   你永远不会手动请求意向锁，看到它们也不要惊讶

-- 自动提交的每条语句结束时会释放；不自动提交时事务内的表锁持续到提交
```

MyISAM 只有表锁：一条慢 `SELECT` 就能阻塞同表所有 `UPDATE`。这是它被 InnoDB 取代的核心原因（第 1 章）。

## 7.3 MDL：卡住整张表的元数据锁

MDL（metadata lock）在 5.5+ 自动加，规则简单但后果严重：

```text
读操作     拿 MDL 读锁（SELECT、DML）—— 相互兼容
DDL 操作   拿 MDL 写锁 —— 与读写都互斥
关键坑     MDL 写锁请求会排队插在最前面，后续新的 MDL 读锁请求也得等它
```

于是经典事故链条是这样：

```text
1. 事务 A 开始，SELECT 了 orders（持有 MDL 读锁，且不释放直到提交）
2. 有人执行 ALTER TABLE orders ...（要 MDL 写锁，被 A 阻塞，开始排队）
3. 之后所有 SELECT/UPDATE orders（要 MDL 读锁）排在 ALTER 之后 → 全部阻塞
4. 连接堆积、超时、监控告警，看起来像"数据库突然挂了"
```

排查与处置：

```sql
-- 找出"最早那个还没结束的读事务"
SELECT object_schema, object_name, lock_type, lock_status, owner_thread_id
FROM performance_schema.metadata_locks
WHERE object_type = 'TABLE' AND object_name = 'orders';

-- 或直接看 processlist 里大量 "Waiting for table metadata lock"
SELECT id, user, time, state, LEFT(info, 60) FROM information_schema.processlist
WHERE state LIKE '%metadata lock%' ORDER BY time DESC;
```

`metadata_locks` 这张表依赖一个叫 `wait/lock/metadata/sql/mdl` 的采集项，如果你的实例查出来是空的，先开启再复现：

```sql
SELECT NAME, ENABLED FROM performance_schema.setup_instruments WHERE NAME LIKE '%mdl%';
UPDATE performance_schema.setup_instruments SET ENABLED = 'YES', TIMED = 'YES'
 WHERE NAME = 'wait/lock/metadata/sql/mdl';
```

:::danger[DDL 前先做两件事]
① 查 `information_schema.innodb_trx` 确认没有长事务持有该表；② 给 DDL 设上限：`SET SESSION lock_wait_timeout = 8;`（单位秒，控制 MDL 等待），拿不到锁就失败退出，比挂住整张表好得多。线上大表改结构请走 gh-ost / pt-osc（第 4 章）。
:::

## 7.4 InnoDB 行锁：记录锁、间隙锁、next-key 锁

```text
记录锁 Record Lock       只锁索引记录本身
间隙锁 Gap Lock          锁两个记录之间的开区间，阻止"插入"，不阻塞已有记录的读
next-key Lock            记录锁 + 它前面那个间隙 = 左开右闭区间 (prev, rec]
插入意向锁 Insert Intention  INSERT 前对间隙加的锁，与间隙锁冲突 → 这正是间隙锁生效的方式
```

在 RR 级别下，加锁的基本规则（`SELECT ... FOR UPDATE` / `UPDATE` 都会走同一套）：

```sql
-- 表：order_items，二级索引 idx_order_product (order_id, product_id)
-- 已有记录：(100, 5) (100, 10) (100, 20) (200, 7)
```

```text
情况                                     加锁范围（RR）
唯一索引等值，命中                 记录锁
唯一索引等值，未命中               间隙锁（锁住那个空隙）
非唯一索引等值，命中               命中记录的 next-key 锁 + 相等记录后的间隙锁
非唯一索引范围                     扫描到的记录的 next-key + 末尾间隙
走了二级索引                       上述范围 + 聚簇索引上对应记录的记录锁
不加任何索引条件（全表扫描）       每一行都加 next-key 锁 —— 效果等于锁全表
```

这就是最贵的一课：

```sql
-- 危险写法：product_name 上没有索引
UPDATE order_items SET quantity = 5 WHERE product_name = '键盘';
→ 全表扫描 + 逐行 next-key 锁 + 所有间隙 → 并发写入全部阻塞，其他行也改不了

-- 安全写法：条件走索引，或者补索引
UPDATE order_items SET quantity = 5 WHERE item_id = 88001;
ALTER TABLE order_items ADD KEY idx_name (product_name);   -- 补索引后再按原条件写
```

:::tip[RC 下锁范围小得多]
`READ COMMITTED` 基本不加间隙锁（只有外键/唯一冲突检查等少数场景），非唯一索引等值也只锁命中的记录，不锁扫描过的范围。这是 RC 吞吐更好、死锁更少的结构性原因，代价是放弃可重复读语义（第 6 章）。
:::

## 7.5 死锁：成因、排查、预防

标准死锁剧本 —— 两个事务以相反顺序更新同两行：

```sql
-- 会话 A                          -- 会话 B
START TRANSACTION;                 START TRANSACTION;
UPDATE orders SET status = 1
 WHERE order_id = 1001;            UPDATE orders SET status = 1
                                    WHERE order_id = 1002;
UPDATE orders SET status = 1
 WHERE order_id = 1002;  -- 等 B    UPDATE orders SET status = 1
                                    WHERE order_id = 1001;  -- 互等 → 死锁
```

InnoDB 的死锁检测默认开启，会**主动回滚代价较小的那个事务**并报错 1213：

```text
ERROR 1213 (40001): Deadlock found when trying to get lock; try restarting transaction
```

排查三步：

```bash
# 1. 最近的死锁详情（两个事务各持有什么锁、执行了什么 SQL）
mysql -e "SHOW ENGINE INNODB STATUS\G" | grep -A 60 'LATEST DETECTED DEADLOCK'

# 2. 实时等待关系（8.0）
mysql -e "SELECT waiting_pid, blocking_pid, wait_time, sql_text
          FROM sys.innodb_lock_waits;"

# 3. 死锁统计是否可接受
mysql -e "SHOW GLOBAL STATUS LIKE 'Innodb_row_lock%';"
```

预防清单（按有效性排序）：

```text
1. 固定访问顺序：多行/多表更新统一按主键升序执行（分账场景尤其重要）
2. 事务尽量小：一次只锁必需的行，别把整批业务包进一个事务
3. UPDATE 的 WHERE 必须走索引，避免升级成 next-key 大范围锁
4. 需要"锁住再改"时用 SELECT ... FOR UPDATE 一次到位，减少交叉持锁窗口
5. 用唯一索引 + INSERT ... ON DUPLICATE KEY UPDATE 替代"先查再插"（还能防重复）
6. 应用侧必须有重试：捕获 1213 后指数退避重试 2~3 次（幂等前提下）
7. 热点行（如秒杀库存）考虑拆分计数或改用 RC 级别降低冲突
```

:::caution[间隙锁死锁是隐藏款]
两个事务都对同一无命中间隙做 `INSERT`（各自先加 gap 锁再申请插入意向锁）会死锁，而它们操作的**不是同一行**。这类死锁常出现在"先查存在不存在、不存在就插入"的代码里 —— 解法是给业务键加唯一索引，直接 `INSERT` 让数据库判重。
:::

## 7.6 锁等待与超时参数

```sql
-- 行锁等待超时：超过就报 1205 并回滚当前语句（不是整个事务）
SELECT @@innodb_lock_wait_timeout;          -- 默认通常是 50 秒，以实际值为准
SET SESSION innodb_lock_wait_timeout = 5;   -- 在线业务建议调小，快速失败 + 重试

-- 元数据锁（MDL）与表锁的等待上限
SELECT @@lock_wait_timeout;                 -- 第 7.3 节的 DDL 保护就靠它

-- 死锁检测开关：极高并发热点行时可考虑关闭（危险，会让等待超时兜底）
SELECT @@innodb_deadlock_detect;

-- 全局锁/表锁类：控制会话最长空闲与最长执行
SHOW VARIABLES WHERE Variable_name IN ('wait_timeout','interactive_timeout','max_execution_time');
```

报错含义对照：

```text
ERROR 1205 (HY000): Lock wait timeout exceeded → 别人持锁太久，当前语句被回滚
ERROR 1213 (40001): Deadlock found            → 被死锁检测选中回滚，可安全重试
ERROR 1205 频繁出现时先查 innodb_trx 找持锁者，不要盲目调大超时
```

8.0 还提供两个"不等待"的工具，适合任务队列：

```sql
SELECT item_id FROM orders WHERE status = 0 LIMIT 10 FOR UPDATE SKIP LOCKED;  -- 跳过被别人锁走的行
SELECT order_id FROM orders WHERE order_id = 1001 FOR UPDATE NOWAIT;           -- 拿不到锁立刻报错
```

## 7.7 综合练习：复现一个死锁并解决它

1. 两个终端各开一个事务，交叉更新 `orders` 的 1001 与 1002 行（照抄 7.5 的代码），制造一次 1213。
2. 立刻执行 `SHOW ENGINE INNODB STATUS\G`，抄下 `LATEST DETECTED DEADLOCK` 段落里两个事务的 SQL 与各自持有/等待的锁，写出"谁是主动回滚者"以及判断依据（回滚量 `trx_rows_modified`）。
3. 把两个终端的更新改成"按 `order_id` 升序执行"，重跑 100 次脚本，确认死锁不再出现（`SHOW GLOBAL STATUS LIKE 'Innodb_row_lock_deadlocks';` 计数不增长，若你的版本无此状态项，以 `SHOW ENGINE INNODB STATUS` 为准）。
4. 在第三个终端复现 7.3 的 MDL 连锁阻塞：终端 A 开事务 `SELECT * FROM orders;` 不提交，终端 B 执行 `ALTER TABLE orders ADD KEY idx_pay (pay_method);`，终端 C 执行 `SELECT COUNT(*) FROM orders;`。观察 C 卡住，然后 `KILL` 掉 A，看 B、C 依次恢复。
5. 把 `innodb_lock_wait_timeout` 设为 3，重复第 4 步的 B，记录 DDL 因拿不到锁而失败报错的文本，并把"DDL 前先设 `lock_wait_timeout`"写进你的变更模板。

## 本章小结

- 锁的粒度链是全局锁 → 表锁/MDL → InnoDB 行锁，行锁加在索引记录上，因此"条件是否走索引"直接决定锁范围
- FTWRL 只用于备份场景，InnoDB 备份改用 `--single-transaction`；MDL 写锁排队会连带阻塞后续所有查询，DDL 前必须查长事务并设 `lock_wait_timeout`
- RR 下非唯一与范围条件使用 next-key 锁（含间隙），无索引的 UPDATE 等同锁全表；RC 基本不加间隙锁，冲突与死锁都更少
- 死锁靠固定访问顺序、走索引、小事务、唯一索引代替"先查再插"来预防，应用侧必须实现针对 1213 的有限重试
