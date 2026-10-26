---
title: "第 9 章 · 高可用与备份恢复"
description: "RPO（能丢多少数据） 由备份频率 + binlog 保留决定"
series: mysql
sidebar:
  order: 9
  label: "高可用与备份恢复"
difficulty: intermediate
duration: 7
---

**本章目标：**

- 会做可恢复的备份：逻辑备份与物理备份各自的适用边界
- 用全量备份 + binlog 把数据恢复到误操作前的某一秒
- 说清主从切换的手动流程、自动化方案的能力与风险，并建立监控基线

## 9.1 备份版图：先定 RPO 与 RTO

```text
RPO（能丢多少数据）    由备份频率 + binlog 保留决定
RTO（多久能恢复服务）  由备份方式与实例大小决定 —— 100 GB 级用逻辑导入可能要数小时
```

三种手段的定位：

```text
逻辑备份   mysqldump / mydumper：导出 SQL 语句，跨版本、可挑选、可读可改
           恢复要重放语句 → 慢；适合中小库、迁移、单表救急
物理备份   直接拷贝数据文件（XtraBackup、Clone 插件）：接近文件系统复制速度
           同版本同配置才能用；适合大库全量与搭新从库
快照/CDP  云盘快照或存储层快照：秒级、含 binlog；但要确认"崩溃一致性"
```

:::danger[没有验证过的备份不算备份]
至少每季度做一次"真恢复演练"：把备份导入一个空实例，抽查关键表行数与最新一条业务记录的时间。同时确认 binlog 保留时长足够覆盖"全量备份间隔 + 演练/追责需要"（`SELECT @@binlog_expire_logs_seconds;` 或旧版 `@@expire_logs_days`，以实际值为准）。
:::

## 9.2 mysqldump 的正确姿势

```bash
# 单库逻辑备份（InnoDB）——参数逐个都有理由
mysqldump \
  --single-transaction \        # 一致性快照读，不加全局锁（第 7 章 FTWRL 的替代方案）
  --source-data=2 \             # 在输出里以注释记录 binlog 位点（8.0.26+；旧名 --master-data）
  --routines --events \         # 存储过程与事件默认不导出，必须显式带上
  --triggers \                  # 触发器默认导出，写出来便于 review
  --set-gtid-purged=ON \        # GTID 实例需要，避免从库复制拓扑断裂
  --default-character-set=utf8mb4 \
  --databases shop | gzip > shop-$(date +%F).sql.gz

# 只要一张表 + 按条件裁剪（救急或做数据迁移）
mysqldump --single-transaction shop orders --where="created_at >= '2026-01-01'" > orders-2026.sql

# 恢复：导入是"重放 SQL"，先建库再导（压缩过的用 gunzip -c）
mysql -h 127.0.0.1 -P 3306 -uroot -p shop < shop-2026-03-01.sql
gunzip -c shop-2026-03-01.sql.gz | mysql -h 127.0.0.1 -uroot -p shop
```

:::caution[`--master-data` 的两个副作用]
它（等价 `--source-data`）在导出开始时会短暂拿一次全局锁来读位点；如果不想有任何停顿，用 `--source-data=2` 的注释形式或事后从 `SHOW MASTER STATUS` 手工对齐。另外大版本升级后不要用旧版本 dump 直接导回旧实例，跨版本恢复请走第 9.3 的迁移路径。
:::

数据量大时 `mysqldump` 单线程太慢，用并行工具：

```bash
mydumper -h 127.0.0.1 -u root -p -B shop -T 8 -o /backup/shop-dump   # 8 线程分表导出
myloader -d /backup/shop-dump -o 8 -B shop                            # 并行导入
```

## 9.3 物理备份与大库策略

物理备份的关键是"拿到一个崩溃一致的数据目录"。

```text
停机拷贝      最可靠但不可用：shutdown → cp -r /var/lib/mysql → start
只读一致性    主库不可接受长时间 FTWRL 时，从从库备份（要容忍延迟）或专门拉一台备份实例
热备份工具    Percona XtraBackup：复制数据文件同时应用 redo log，产出可崩溃恢复的目录
Clone 插件    8.0.17+：MySQL Shell 一条命令从实例整体克隆，搭从库/新节点最快
```

```bash
# XtraBackup 形态示意（工具需自行安装，命令与版本请以官方文档为准）
xtrabackup --backup --target-dir=/backup/base --user=root --password=...
xtrabackup --prepare --target-dir=/backup/base      # 回放 redo，得到一致状态
xtrabackup --copy-back --target-dir=/backup/base    # 拷回 datadir（需空目录 + 停实例）
```

```sql
-- Clone 插件形态（8.0.17+）：先确认版本与插件状态
SELECT VERSION(), PLUGIN_NAME, PLUGIN_STATUS
FROM information_schema.PLUGINS WHERE PLUGIN_NAME = 'clone';

INSTALL PLUGIN clone SONAME 'mysql_clone.so';           -- 未安装时
SET GLOBAL clone_valid_donor_list = '127.0.0.1:3307';   -- 允许的来源实例
CLONE INSTANCE FROM 'root'@'127.0.0.1':3307 IDENTIFIED BY 'Root@123';
-- 目标实例会自动重启并变成来源实例的数据副本，是搭从库最快的方式
-- MySQL Shell 里等价写法：db.clone_instance('root@127.0.0.1:3307', {reboot: true})
```

大库组合策略（电商订单库常见形态）：

```text
全量     每周日 03:00 物理备份（从延迟从库或备份专用实例上跑）
增量     binlog 常开 + 每小时归档到对象存储
逻辑     每天 mysqldump 关键小表（配置表、字典表）方便单表恢复
冷数据   超过 1 年的 orders/order_items 归档到归档库（第 10 章演示）
```

## 9.4 时间点恢复（PITR）：把库恢复到误删前的那一秒

场景：15:42 有人执行了 `DELETE FROM orders WHERE created_at < '2020-01-01';`，删掉了 300 万行。你需要恢复到 15:41:50。

```bash
# ① 确认手里有 15:00 的全量备份，并知道它对应的 binlog 位点
grep -m1 -E "CHANGE REPLICATION SOURCE TO|mysql-bin" shop-2026-03-01.sql | head -1

# ② 在空实例上恢复全量
mysql -uroot -p shop < shop-2026-03-01.sql

# ③ 找出误删语句在 binlog 里的位置（先用 SHOW BINLOG EVENTS 定位，再精确解析）
mysql -uroot -p -e "SHOW BINLOG EVENTS IN 'mysql-bin.000018' FROM 4 LIMIT 200;"
mysqlbinlog --no-defaults --base64-output=DECODE-ROWS -v \
  --start-position=1024 --stop-position=988421 \
  /var/lib/mysql/mysql-bin.000018 > /tmp/replay.sql

# ④ 只重放到误删语句之前
mysql -uroot -p shop < /tmp/replay.sql
```

PITR 的四条铁律：

```text
1. 恢复必须在全新实例上做，验证无误后再迁回生产 —— 不要在生产库上直接重放
2. --stop-position 要停在误删事务**开始之前**，而不是它之后
3. 全量备份与 binlog 必须在同一套 GTID/位点体系下才能对齐
4. ROW 格式的 binlog 可用 mysqlbinlog -v 还原成可读语句，误删数据也常被直接
   反向拼成 INSERT（社区有 flashback 类工具），但正式恢复仍走完整 PITR 流程
```

:::danger[`DROP TABLE` 也能 PITR 回来，但代价不同]
`DELETE` 有 undo 与 binlog 前镜像，找回相对温和；`DROP TABLE` / `TRUNCATE` 会让表空间消失，只能靠备份 + binlog 重放，且期间所有写入都要一起回放。这就是"延迟从库"存在的意义：

```sql
-- 从库故意晚 1 小时应用，误操作后先在这个"时光机"上取数据
CHANGE REPLICATION SOURCE TO SOURCE_DELAY = 3600;   -- 秒，需 STOP REPLICA 后设置
```
:::

## 9.5 主从切换：手动流程与不可省略的检查

计划内切换（机房迁移、版本升级）的标准动作：

```sql
-- ① 确认所有从库都追平了（Executed_Gtid_Set 覆盖主库已提交的全部事务）
SHOW REPLICA STATUS\G
-- ② 冻结主库写入：先业务降级/停写，再
FLUSH TABLES WITH READ LOCK;
SET GLOBAL read_only = ON;      -- 或 super_read_only = ON
-- ③ 目标从库停止复制并脱离拓扑
STOP REPLICA; RESET REPLICA ALL;
SET GLOBAL read_only = OFF; SET GLOBAL super_read_only = OFF;
-- ④ 其他从库改指向新主库
STOP REPLICA FOR CHANNEL '';
CHANGE REPLICATION SOURCE TO SOURCE_HOST = 'new-primary', SOURCE_AUTO_POSITION = 1;
START REPLICA;
-- ⑤ 应用侧连接串/VIP/代理后端切到新主库，观察写入成功与延迟归零
```

:::danger[自动切换最难的一步是"确认旧主库真的死了"]
如果旧主库只是网络抖动而仍在接受写入，把它下线又上线就形成**双主双写**（brain split），数据分叉后极难合并。可靠方案必须有 fencing：把旧主库的连接切断/隔离（改权重、下 VIP、调云接口关机），而不是只"标记为不可用"。切换脚本里 90% 的复杂度都在这一步。
:::

## 9.6 自动化高可用：MGR 与 Orchestrator

```text
MGR（MySQL Group Replication，8.0 核心能力）
  · 组内节点用类 Paxos 协议对事务达成多数派，多数派写成功才提交
  · 单主模式：一个可写节点，故障自动选新主；多主模式：都可写但冲突处理复杂，慎用
  · 强制要求 GTID、`report_host`、固定端口范围、从库共享存储不是必须
  · 局限：跨机房延迟敏感、网络分区时少数派侧不可写、运维心智负担高
InnoDB Cluster = MGR + MySQL Shell（配置/运维）+ MySQL Router（智能路由）
  · 一条命令建集群：adminapi 创建、自动选主、读写自动路由到主库
Orchestrator（GitHub 开源）
  · 拓扑发现 + 人类友好界面 + 故障切换钩子；不改变复制本质，只是"自动化的手"
  · 常与半同步配合：切换时优先选数据最全的从库
MHA / 云 RDS 高可用     历史方案与托管方案，思路同上：探测 → 选主 → 补齐 → fencing → 路由
```

选型建议（务实版）：

```text
单实例 + 良好备份 + PITR 演练      大多数中小团队的第一优先级，比任何 HA 框架都值钱
一主一从 + 手动切换手册            读扩展 + 冷备，切换 RTO 分钟级
半同步（AFTER_SYNC）+ Orchestrator 需要更少丢数据且有人运维时
InnoDB Cluster / 云托管多可用区     要 RTO 秒级、又不想自研探活与 fencing 时
```

## 9.7 综合练习：误删救援 + 监控基线

任务一（演练）：在本地实例上完整走一遍 PITR。

1. 建一张 `shop.audit_demo`，插入 1 万行并每秒继续插入，保持 5 分钟。
2. 做全量 `mysqldump --single-transaction --source-data=2 shop > /tmp/full.sql`，记下位点。
3. 继续写入 3 分钟，然后执行 `DELETE FROM shop.audit_demo WHERE id % 7 = 0;`。
4. 用 `SHOW BINLOG EVENTS` + `mysqlbinlog --start-position/--stop-position` 把库恢复到删除前 5 秒，验证 `SELECT COUNT(*), MAX(id)` 与删除前的记录数一致。

任务二（监控）：把下面这些指标做成一张基线表，每天抄一次（或接 `mysqld_exporter` + Grafana）。

```sql
SHOW GLOBAL STATUS WHERE Variable_name IN
  ('Questions','Com_commit','Com_rollback','Threads_connected','Threads_running',
   'Innodb_row_lock_waits','Innodb_row_lock_time_avg','Innodb_buffer_pool_reads',
   'Innodb_buffer_pool_read_requests','Created_tmp_disk_tables','Select_full_join',
   'Slow_queries','Aborted_connects','Uptime');
SHOW GLOBAL STATUS LIKE 'Innodb_data%';
SHOW REPLICA STATUS\G          -- 关注 Seconds_Behind_Source
```

```text
QPS ≈ Questions 每秒增量        TPS ≈ Com_commit + Com_rollback 每秒增量
缓冲池命中率 = 1 - reads / read_requests        低于 99% 说明内存不足或扫描过量
Threads_running 持续高（与核数比 4 倍以上）      说明在排队，先看慢查询与锁
Created_tmp_disk_tables 增长快                  分组/排序没有吃到索引
Slow_queries 与 Select_full_join                优化工作的周榜
Seconds_Behind_Source 峰值                      复制健康度，配合大事务排查
磁盘剩余与 binlog 占用                           第 8 章"主库磁盘满"事故的预警线
```

告警最低配：实例不可达、磁盘剩余低于阈值、复制中断、复制延迟高于业务容忍值、连接数接近 `max_connections`、慢查询速率异常上升。

## 本章小结

- 逻辑备份灵活可挑选但恢复慢，物理备份快但绑版本；主库备份用 `--single-transaction` 而不是全局锁，且必须定期做"真恢复演练"
- PITR = 全量备份 + 重放 binlog 到误操作前一个位置：一定在空实例上做，`--stop-position` 停在误删事务开始之前，延迟从库可作为时光机
- 主从切换的难点不在命令而在顺序：确认追平 → 冻结旧主 → 提升新主 → 重挂其他从库 → 切流量，并必须有 fencing 防双写
- MGR / InnoDB Cluster / Orchestrator 解决的是自动探测与自动切换，不替你解决备份、延迟与容量；先把备份与指标基线建起来收益更大
