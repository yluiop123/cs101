---
title: "第 6 章 · 隔离级别与 MVCC"
description: "准备一张表并在两个会话（A、B）里交替执行："
series: mysql
sidebar:
  order: 6
  label: "隔离级别与 MVCC"
difficulty: intermediate
duration: 6
---

**本章目标：**

- 用同一张表区分脏读、不可重复读、幻读三个异常
- 掌握 RC 与 RR 在 MySQL 里的实际行为差异与取舍
- 能说清 read view、行版本号如何决定"哪一版数据对我可见"

## 6.1 三个并发异常

准备一张表并在两个会话（A、B）里交替执行：

```sql
-- 表：shop.orders，行 order_id = 1001 的 status 当前为 0
-- 会话 A 先改但不提交
START TRANSACTION;
UPDATE orders SET status = 1 WHERE order_id = 1001;
-- 先不 COMMIT，去会话 B 做下面的读
```

```text
脏读        B 读到了 A 尚未提交的数据，随后 A ROLLBACK → B 拿到的值是伪造的
不可重复读  B 在事务里两次读同一行，中间 A 提交了 UPDATE → 两次结果不同
幻读        B 在事务里两次读同一个范围，中间 A 提交了 INSERT → 第二次多出一行"幽灵"
```

三个异常的关键区别在**被影响的对象**：不可重复读针对已有行的**修改**，幻读针对条件范围内**新增或删除的行**。脏读是"读到未提交"，后两者是"读到了别人已提交的新版本"。

:::tip[一次实验看清脏读]
在会话 B 执行 `SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;` 后 `START TRANSACTION; SELECT status FROM orders WHERE order_id = 1001;` 会看到 `1`；回到会话 A 执行 `ROLLBACK;` 再读一次变回 `0`。这就是脏读，也是为什么 `READ UNCOMMITTED` 在生产上几乎没有正当使用场景。
:::

## 6.2 四种隔离级别

```sql
-- 查看（全局 / 当前会话）
SELECT @@global.transaction_isolation, @@session.transaction_isolation;
-- 5.7 里变量名是 tx_isolation，8.0 起统一为 transaction_isolation

-- 设置：只影响当前会话，且对已开启的事务无效
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
SET GLOBAL transaction_isolation = 'READ-COMMITTED';   -- 影响之后建立的新连接
```

```text
READ UNCOMMITTED     不加读锁、不看快照 → 脏读 + 不可重复读 + 幻读
READ COMMITTED       快照读只看到"语句开始前已提交"的版本 → 避免脏读
REPEATABLE READ      整个事务共用一个快照 → 避免不可重复读；配合间隙锁抑制幻读（MySQL 默认）
SERIALIZABLE         普通读也加锁（或转成加锁读）→ 全避免，并发度最差
```

MySQL/InnoDB 的默认是 `REPEATABLE READ`（以 `SELECT @@transaction_isolation;` 实测为准）。互联网业务里 `READ COMMITTED` 同样常见，理由是并发更好、锁更少、语义更直观。

## 6.3 RC 与 RR 在 MySQL 的真实差别

差别只有一句话：**生成 read view 的时机**。

```text
RC   每条 SELECT 语句开始时都重新生成一份 read view → 总是看到"最新已提交"
     后果：同一事务里两次读同一行可能不同（不可重复读）
RR   事务内第一条快照读时生成 read view，之后一直复用
     后果：整个事务看到的都是那一刻的世界（可重复读）
     注意：如果事务里做过写操作（当前读），自己改的行始终可见
```

同一组数据、同一串操作，两个级别下的结果对照：

```sql
-- 会话 A（先执行）
START TRANSACTION;
SELECT status FROM orders WHERE order_id = 1001;   -- 第一次读

-- 会话 B（穿插执行）
START TRANSACTION;
UPDATE orders SET status = 2 WHERE order_id = 1001;
COMMIT;

-- 回到会话 A
SELECT status FROM orders WHERE order_id = 1001;   -- 第二次读
```

```text
READ COMMITTED      第一次 0，第二次 2   ← 不可重复读
REPEATABLE READ     两次都是 0          ← 快照保证可重复
```

工程上的选择影响：

```text
选 RR 的理由   事务内一致性视图（对账、结算、多次读同一份数据后写回）
              binlog 用 STATEMENT 格式时相对安全
选 RC 的理由   行锁与间隙锁大幅减少（RR 会加间隙锁，见第 7 章）
              热点行更新冲突少，吞吐高
              代价：必须把 binlog_format 设为 ROW，STATEMENT 在 RC 下不安全
```

:::caution[RC 下改 binlog 格式]
`READ COMMITTED` + `binlog_format = STATEMENT` 会得到不可预测的主从结果（同一语句在从库执行时看到的不是同一份数据）。切到 RC 时同步检查：`SELECT @@binlog_format;`，需要为 `ROW`（第 8 章）。
:::

## 6.4 行版本号：隐藏的两列

InnoDB 每行都带两个隐藏列（`information_schema` 里看不到，但真实存在）：

```text
DB_TRX_ID    最近一次修改这行的事务 ID（6 字节）
DB_ROLL_PTR  指向 undo log 里上一版本的指针（7 字节）
```

于是每行都是一条链：

```text
行 (status = 2, trx_id = 502, roll_ptr)
  → undo (status = 1, trx_id = 401)
    → undo (status = 0, trx_id = 100)      ← 插入时的初始版本
```

读的时候沿链往前找"第一个我看得见的版本"。这意味着：并发读**不加行锁**，读写互不阻塞 —— 这就是 MVCC（多版本并发控制）的全部精髓，也是 undo log 存在的第二个理由（第 5 章）。

```sql
-- 事务 ID 从哪来：全局递增的分配器
SELECT @@innodb_read_only;             -- 顺带确认实例角色
-- 看当前活动事务与它们的 trx_id
SELECT trx_id, trx_started FROM information_schema.innodb_trx ORDER BY trx_id;
```

## 6.5 Read View 的可见性算法

快照读生成一个 read view，核心是四个字段：

```text
m_ids           生成快照时"还没提交"的事务 ID 集合
min_trx_id      m_ids 中的最小值
max_trx_id      系统将要分配的下一个事务 ID
creator_trx_id  当前事务自己的 ID（未开启写事务时为 0）
```

判断行版本是否可见（对 `DB_TRX_ID = t` 逐个套用，不可见就沿 undo 链继续）：

```text
t == creator_trx_id           → 可见（自己改的，永远可见）
t <  min_trx_id               → 可见（早于快照，肯定已提交）
t >= max_trx_id               → 不可见（快照之后才开启的事务）
min_trx_id <= t < max_trx_id  → t 在 m_ids 里？在 → 不可见（当时还没提交）
                                          不在 → 可见（当时已提交）
```

RR 与 RC 的差别在这里变成一行代码：RC 每条语句重建 read view（`m_ids` 越来越小、`max_trx_id` 越来越大，所以总能看到新世界）；RR 只在第一条快照读时建一次。

:::tip[为什么长事务让快照读变慢]
最老活跃事务把 purge 挡在那里（第 5 章），版本链随之变长。一个跑了半小时的事务现在读一行，可能要沿 undo 链回溯几百个版本才能找到可见版本 —— MVCC 的"读不加锁"并不等于"读免费"。
:::

## 6.6 快照读与当前读

```sql
-- 快照读：读 MVCC 版本链，不加锁（绝大多数 SELECT）
SELECT * FROM orders WHERE customer_id = 1001;

-- 当前读：读"最新已提交版本"并加锁，且会写 undo 以备回滚
SELECT * FROM orders WHERE order_id = 1001 FOR UPDATE;        -- 排他锁
SELECT * FROM orders WHERE order_id = 1001 FOR SHARE;         -- 共享锁（8.0 语法）
SELECT * FROM orders WHERE order_id = 1001 LOCK IN SHARE MODE;-- 等价旧写法
UPDATE orders SET status = 3 WHERE order_id = 1001;           -- 隐含当前读
DELETE FROM orders WHERE order_id = 1001;                     -- 隐含当前读
INSERT ... ON DUPLICATE KEY UPDATE / REPLACE                  -- 都是当前读
```

两者混用会产生"看起来矛盾"的现象，这是最多人踩的坑：

```sql
-- 会话 A，RR 级别
START TRANSACTION;
SELECT COUNT(*) FROM orders WHERE customer_id = 1001;   -- 快照读：假设 5

-- 会话 B
INSERT INTO orders (order_no, customer_id, status) VALUES ('NO9', 1001, 0);
COMMIT;

-- 会话 A 继续
SELECT COUNT(*) FROM orders WHERE customer_id = 1001;   -- 仍是 5（快照不变）
SELECT * FROM orders WHERE customer_id = 1001 FOR UPDATE; -- 出现 6 行！（当前读）
UPDATE orders SET status = 9 WHERE customer_id = 1001;    -- 影响 6 行，包括那行"幽灵"
SELECT COUNT(*) FROM orders WHERE customer_id = 1001;   -- 现在变 6：自己的修改立刻可见
```

:::danger["RR 消除了幻读"是有条件的]
准确说法：**快照读**通过 MVCC 不会看到新插入的行；**当前读**在 RR 下靠 next-key 锁阻止别人往范围内插入。但如果别的会话已经插入并提交、你的事务此后才做当前读，就会同时看到"快照里的旧世界"和"当前读里的新世界" —— 即所谓"第二种丢失更新/幻读"。要么在同一事务里避免混用两种读，要么用 `SELECT ... FOR UPDATE` 起手把范围锁住（详见第 7 章）。
:::

## 6.7 综合练习：两个终端复现三种现象

用 `mysql -h 127.0.0.1 -u shop_app -p shop` 开两个终端，记为 A、B。每步都先写 SQL 再写预期。

1. **脏读**：A 设 `READ UNCOMMITTED`，B `UPDATE products SET stock = stock - 1 WHERE product_id = 2001;` 不提交，A 读同一行；B `ROLLBACK`。写出你看到的两个值。
2. **不可重复读**：A、B 都设 `READ COMMITTED`，按 6.3 的三段式脚本做一遍，记录 A 两次读的差别。
3. **幻读**：A 设 RR，`START TRANSACTION; SELECT COUNT(*) FROM order_items WHERE order_id = 88991;`；B 插入一行并提交；A 重复快照读、再做 `SELECT ... FOR UPDATE`、最后 `UPDATE order_items SET quantity = quantity + 0 WHERE order_id = 88991;` 观察影响行数。
4. **锁住的当前读**：把第 3 步的 RR 换成 RC 重做，比较 B 插入时是否被阻塞（提示：间隙锁在 RC 下基本不加）。
5. 用自己的话总结：为什么"读不加锁"能保证可重复读却不能阻止幻读？

## 本章小结

- 脏读读到未提交数据，不可重复读是已有行被改，幻读是范围内多了/少了行，三者对象不同
- RC 每条语句新建 read view（总看最新已提交），RR 事务内复用第一个（可重复读），MySQL 默认 RR，切 RC 要把 binlog 格式改为 ROW
- MVCC 靠行上的 `DB_TRX_ID`、`DB_ROLL_PTR` 串起 undo 版本链，read view 用 m_ids/min/max/creator 四元组判定可见性
- 快照读走版本链不加锁，当前读读最新版本并加锁；同一事务混用两种读会造成"幻读错觉"，要么全用快照，要么先 `FOR UPDATE` 占位
