---
title: 主从复制与读写分离
---

# 第 8 章 · 主从复制与读写分离

**本章目标：**

- 分清 binlog 三种格式的差异与选择依据
- 搭起一主一从（GTID 模式），并能读懂复制状态里的关键指标
- 处理复制延迟、中断与主从数据不一致这三类日常故障

## 8.1 binlog 的三种格式

```sql
SELECT @@version, @@binlog_format, @@log_bin, @@binlog_row_image, @@expire_logs_days;
SHOW BINARY LOGS;                       -- 有哪些 binlog 文件
SHOW BINLOG EVENTS IN 'mysql-bin.000002' LIMIT 20;   -- 直接读事件内容
```

```text
STATEMENT   记"这条 SQL 本身"         日志小；但 uuid()/now()/rand()/无 ORDER BY 的 LIMIT
                                       等不确定语句会让主从结果不同
ROW         记"每一行改成什么样"      确定、可审计、可与任意隔离级别配合；日志大
MIXED       默认 STATEMENT，不确定时自动切 ROW  兼容折中，切换点不易预期
```

生产几乎一律 `ROW`（MySQL 8.0 的默认格式也是 ROW，以 `SELECT @@binlog_format;` 实测为准）：它是备份恢复（第 9 章）、CDC（binlog 订阅）和 RC 隔离级别的前提。

```sql
-- ROW 格式下控制日志量：只记被改动的列而不是整行前后镜像
SET SESSION binlog_row_image = MINIMAL;   -- 默认 FULL，以实际值为准
```

::: warning `binlog_format = STATEMENT` 的三个后果
① RC 隔离级别下不安全（官方明确要求 ROW）；② `INSERT ... SELECT`、分区表、非确定性函数可能造成主从不一致；③ 从库回放顺序与并发度受限。老项目里看到 STATEMENT 请把它当技术债记录。
:::

## 8.2 复制原理：一条链上的三个线程

```text
主库                          网络                    从库
写事务 → binlog（顺序追加）
              ↑ ①
        dump 线程（按位点/GTID 发送 binlog 内容） ──→ ② IO（receiver）线程
                                                      写入 relay log（中继日志）
                                                          ↓ ③
                                                      SQL（applier）线程
                                                      解析并重放事务 → 数据页
```

```text
主库只有 binlog；从库有 relay log（可删除、可配置 relay_log_purge）
位点坐标 = binlog 文件名 + 位置（File/Position），或 GTID 集合
单事务在主库执行完才写 binlog；从库以事务为最小回放单位 —— 这解释了
"一个大事务能让从库延迟几十秒，而期间数据看起来完全正常"
```

关键指标：

```sql
-- 8.0.22+ 新语法（旧版是 SHOW SLAVE STATUS）
SHOW REPLICA STATUS\G
```

```text
Replica_IO_Running / Replica_SQL_Running      必须都是 Yes 才算在正常复制
Seconds_Behind_Source                          延迟秒数（基于时间戳差，不可全信）
Retrieved_Gtid_Set / Executed_Gtid_Set         已取回 / 已回放，差集就是积压
Last_IO_Error / Last_SQL_Error                 中断原因，排错第一入口
Replica_SQL_Running_State                      "Waiting for ..." 之类状态说明卡在哪
```

::: tip 延迟的真实测量
`Seconds_Behind_Source` 依赖主从机器时钟。用 `pt-heartbeat` 在主库写时间戳心跳、在从库读回比较，才能得到不受时钟影响的延迟值。云数据库自带的监控多数就是这么算的。
:::

## 8.3 异步、半同步与并行回放

```text
异步复制（默认）  主库提交即返回，不等从库 → 最快，主库崩溃可能丢已确认事务
半同步复制        主库等到至少一个从库确认"收到并落盘 relay log"才返回 → 少丢数据，
                 代价是每个提交多一次网络往返；超时无确认则自动退回异步
组复制 / MGR      多数派确认才提交，接近同步（第 9 章）
```

从库回放慢的根源是"SQL 线程串行重放"。并行复制让它按事务分组并发：

```sql
-- 8.0.27+ 默认 WRITESET（按冲突检测并行，效果好且与主库提交顺序无关）
-- 旧版本常见 LOGICAL_CLOCK（按主库提交组并行）；参数名也随版本变化
SHOW VARIABLES WHERE Variable_name IN
  ('replica_parallel_workers', 'replica_parallel_type', 'replica_preserve_commit_order',
   'binlog_transaction_dependency_tracking');
SET GLOBAL replica_parallel_workers = 8;   -- 8.0.26 前叫 slave_parallel_workers
```

::: warning 参数名有版本断层
8.0.22 起 `SHOW SLAVE STATUS` → `SHOW REPLICA STATUS`，`CHANGE MASTER TO` → `CHANGE REPLICATION SOURCE TO`，8.0.26 起 `slave_*` 系列变量改名为 `replica_*`。查不到就试旧名：以 `SELECT VERSION();` 和 `SHOW VARIABLES LIKE '%parallel%';` 的实际输出为准，不要照抄别处的配置片段。
:::

## 8.4 动手：GTID 模式搭一主一从

```bash
# 两个容器：3307 主，3308 从（端口与密码按你的环境改）
docker run -d --name mysql-primary -p 3307:3306 -e MYSQL_ROOT_PASSWORD=Root@123 \
  mysql:8.0 --server-id=1 --log-bin=mysql-bin --binlog-format=ROW \
  --gtid-mode=ON --enforce-gtid-consistency=ON

docker run -d --name mysql-replica -p 3308:3306 -e MYSQL_ROOT_PASSWORD=Root@123 \
  mysql:8.0 --server-id=2 --log-bin=mysql-bin --binlog-format=ROW \
  --gtid-mode=ON --enforce-gtid-consistency=ON --super-read-only=ON
```

```sql
-- 主库：建复制账号，只给复制权限
CREATE USER 'repl'@'%' IDENTIFIED BY 'Repl@123';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';
FLUSH PRIVILEGES;
```

```bash
# 如果主库已在运行且 gtid_mode = OFF，需要在线分步切换（4 步，不能跳）
mysql -h 127.0.0.1 -P 3307 -uroot -p -e "
  SET GLOBAL gtid_mode = 'OFF_PERMISSIVE';
  SET GLOBAL enforce_gtid_consistency = 'ON';
  SET GLOBAL gtid_mode = 'ON_PERMISSIVE';
  SET GLOBAL gtid_mode = 'ON';"
mysql -h 127.0.0.1 -P 3307 -uroot -p -e "SELECT @@gtid_mode, @@enforce_gtid_consistency;"
```

```sql
-- 从库：指向主库并自动定位（GTID 模式下不用再手填文件名与位点）
CHANGE REPLICATION SOURCE TO
  SOURCE_HOST = 'host.docker.internal',
  SOURCE_PORT = 3306,
  SOURCE_USER = 'repl',
  SOURCE_PASSWORD = 'Repl@123',
  SOURCE_AUTO_POSITION = 1,
  GET_SOURCE_PUBLIC_KEY = 1;      -- 8.0 的 caching_sha2_password 需要它取公钥

START REPLICA;
SHOW REPLICA STATUS\G
```

```sql
-- 验证：主库写入，从库读取
INSERT INTO shop.products (product_no, title, price, stock) VALUES ('P9001', '机械键盘', 199.00, 50);
SELECT * FROM shop.products WHERE product_no = 'P9001';   -- 在从库执行
```

::: danger GTID 模式建表有禁令
`enforce_gtid_consistency = ON` 后，`CREATE TABLE ... SELECT`（会拆成两个事务）、事务内的临时表 DDL 之类都会被拒绝。老项目从 `STATEMENT` + 无 GTID 迁移过来时，这一步是最常见的中断原因，需要改写为"先建表、再 `INSERT ... SELECT`"。
:::

## 8.5 读写分离与分库分表一瞥

复制解决的第一个问题是**读扩展**：写走主库，读走一个或多个从库。

```text
实现位置   客户端/驱动层（自己实现路由，简单但侵入业务）
           代理层（ProxySQL、MySQL Router、ShardingSphere-Proxy 等，业务无感）
路由规则   写事务 → 主库；事务内所有读 → 主库（否则语义直接错）
           强一致读（下单后立刻查详情）→ 主库；报表/列表/搜索 → 从库
```

延迟带来的"读到旧数据"有三种标准解法：

```sql
-- ① 会话粘性：写完之后的 N 毫秒内所有读走主库（最常用，成本最低）
-- ② 等待指定位点/GTID 被从库回放后再读
SELECT WAIT_FOR_EXECUTED_GTID_SET('3E11F479-...:1-25', 1);   -- 超时 1 秒
-- ③ 把关键读直接放主库，并给主库加只读副本之外的缓存层
```

::: warning "延迟双删"不是数据库方案
面试常提的延迟双删属于缓存一致性话题。数据库侧的正解是：判断这个读请求能否容忍过期数据 —— 能则读从库，不能则读主库或等待 GTID 位点。别用"重试读从库"掩盖问题。
:::

单库撑不住时才有分库分表：

```text
垂直拆   按业务把表拆到不同库（订单库、商品库）—— 应用层拆分，跨库只能靠接口聚合
水平拆   同一张表按 sharding key 切成多张：orders_0000 ... orders_0015
         键选 customer_id 或 order_id 哈希（趋势递增利于写入，但范围查询会跨片）
痛点     跨分片 JOIN、跨分片排序分页、全局唯一 ID、分布式事务、扩容再平衡
结论     先用"索引 + SQL 改写 + 分区/归档"（第 4、10 章）榨干单实例，
         真到了容量上限再上分片，并且一开始就把 sharding key 定死
```

## 8.6 常见故障与处置

```text
现象                                    先看哪里 / 处置
IO 线程连不上                          Last_IO_Error：账号、网络、SSL、server_id 重复
1236: The slave is ... 位点找不到       主库 binlog 已过期 → 需重建从库或改 GTID 定位
SQL 线程报 1062 主键冲突                从库有脏数据（有人绕过只读写过从库）；
                                       定位差异后重做从库，别习惯性跳错
复制延迟持续增大                        大事务？从库并行度不足？从库磁盘 IO 打满？
                                       先在主库拆事务，再调 replica_parallel_workers
从库数据与主库不一致                     pt-table-checksum 校验，pt-table-sync 修复
                                       根因排查：STATEMENT 格式、从库被写、GTID 未开启
主库磁盘满 binlog 写不进                expire_logs_days/binlog_expire_logs_seconds 调整
                                       + 清理；不要手动 rm binlog 文件（用 PURGE BINARY LOGS TO）
```

跳错与恢复（谨慎使用，理解代价）：

```sql
-- 传统位点模式：跳过一个事件（会永久丢一个事务的数据）
STOP REPLICA;
SET GLOBAL sql_slave_skip_counter = 1;
START REPLICA;      -- 该变量在 GTID 模式下不可用，会直接报错

-- GTID：注入一个空事务占住出问题的编号，再恢复复制
STOP REPLICA;
SET GTID_NEXT = '3E11F479-...:26';   -- 出错的那个 GTID
BEGIN; COMMIT;
SET GTID_NEXT = 'AUTOMATIC';
START REPLICA;

-- 主动清理旧 binlog（主库磁盘压力）
PURGE BINARY LOGS BEFORE NOW() - INTERVAL 3 DAY;
```

::: danger 跳过错误等于制造不一致
每次跳错都在主从之间留下一条永久差异。跳之前先想清楚：这个事务能否在从库重放？如果不确定，正确做法是重建从库或用 `pt-table-sync` 对齐。线上禁止把 `sql_slave_skip_counter` 当常规运维手段。
:::

## 8.7 综合练习

1. 用 8.4 的脚本搭一主一从，`SHOW REPLICA STATUS\G` 抄下 `Seconds_Behind_Source`、`Executed_Gtid_Set`、`Replica_SQL_Running_State` 三项。
2. 在主库执行一条更新 200 万行的 `UPDATE`（例如把 `order_items` 某段范围的 `unit_price` 重算），同时每 2 秒在从库读一次延迟，记录延迟曲线；说明为什么延迟出现在**提交之后**。
3. 打开从库并行回放（`replica_parallel_workers` 从 1 调到 4/8），重复第 2 步，比较峰值延迟与追平时间。
4. 故意制造一次中断：在从库关闭复制、手动 `INSERT` 与主库相同主键的一行、重启复制，观察 `Last_SQL_Error`，然后用 GTID 空事务法恢复，最后用 `pt-table-checksum`（或 `CHECKSUM TABLE shop.products`）确认一致性。
5. 写出你的读写分离路由规则表：至少覆盖"事务内读"、"下单后查询订单详情"、"商家报表导出"三类场景，标明各走主库还是从库及理由。

## 本章小结

- binlog 是复制的唯一输入：ROW 格式确定、可审计，是 RC 隔离级别与 CDC 的前提；STATEMENT 只在不介意主从一致的边缘场景存在
- 复制是"dump → IO 写 relay log → SQL 回放"三级流水线，回放按事务串行，所以大事务必然造成延迟毛刺；并行回放靠 WRITESET / LOGICAL_CLOCK
- GTID 让切换与重建不再手填位点，但 `enforce_gtid_consistency` 会拒绝 `CREATE TABLE ... SELECT` 等语句，迁移时要先改写
- 读写分离的正解是按"能否容忍过期数据"路由，必要时用 GTID 等待；分库分表是最后手段，先榨干单实例
