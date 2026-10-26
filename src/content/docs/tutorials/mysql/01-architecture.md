---
title: "第 1 章 · 安装与体系结构"
description: "客户端敲下 SELECT  FROM orders WHERE customerid = 1001;，请求在 MySQL 内部大致这样流动："
series: mysql
sidebar:
  order: 1
  label: "安装与体系结构"
difficulty: intermediate
duration: 6
---

**本章目标：**

- 说出 MySQL 连接层、Server 层、存储引擎层各自负责什么
- 分清 binlog、redo log、undo log 的归属层与作用
- 用容器起一个可用的 MySQL 8，并会改 `my.cnf` 里的关键参数

## 1.1 一条 SQL 走过的三层

客户端敲下 `SELECT * FROM orders WHERE customer_id = 1001;`，请求在 MySQL 内部大致这样流动：

```text
连接器（网络协议 / 权限校验 / 线程）
    ↓
Server 层（解析器 → 优化器 → 执行器）  +  binlog
    ↓
存储引擎层（InnoDB / MyISAM ...）      +  redo log / undo log
    ↓
磁盘（表空间文件）
```

三层各司其职：

```text
连接层  管"谁能连、怎么连"：TCP 握手、账号与密码验证、权限检查、
        每个连接一个线程、连接池与超时（wait_timeout）
Server 层 管"这句话怎么理解、怎么执行"：SQL 解析、语法检查、
        语义分析、查询优化（选哪个索引、JOIN 顺序）、内置函数、
        视图、系统变量；binlog 就在这层产生
存储引擎层 管"数据怎么存、怎么取"：表的建/删/查/写实际执行者，
        负责内存结构与磁盘文件；redo log、undo log 属于 InnoDB
```

:::tip[查询缓存去哪了]
5.7 及以前有个"查询缓存"（结果级缓存），因为失效粒度太粗、命中率低，8.0 起被整体移除。看到教程里讲 `query_cache_size` 却查不到这个变量，不是你的问题：以 `SELECT VERSION()` 的实际版本为准，8.0 里它已不存在（`SHOW VARIABLES LIKE 'query_cache%';` 无输出）。
:::

## 1.2 InnoDB 与 MyISAM

MySQL 是"一库多引擎"的架构，同一实例里不同表可以用不同引擎。生产上几乎只有 InnoDB 一个选项，但理解差异有助于看懂老项目。

```sql
-- 查看某张表用的引擎
SHOW TABLE STATUS WHERE Name = 'orders';

-- 建表时显式指定（不写则用默认引擎，通常是 InnoDB）
CREATE TABLE orders (
  order_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  customer_id BIGINT UNSIGNED NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (order_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
```

关键差异：

```text
能力            InnoDB                     MyISAM
事务            支持（ACID）                不支持，语句自动提交
行锁/表锁       行锁为主（细节见第 7 章）    只有表锁
外键            支持                        不支持
崩溃恢复        redo log 保证               易损坏，需 repair table
存储            聚簇索引即数据（索引组织表）  数据(.MYD)与索引(.MYI)分离
全文索引        支持                        支持（实现较原始）
COUNT(*) 无 WHERE  需扫一遍索引计数        直接读元数据，瞬间返回
```

:::caution[还在用 MyISAM 的表请优先改造]
MyISAM 只有表锁：一条 `UPDATE` 就能阻塞整张表的所有写入，且掉电后索引损坏需要修复。遇到 `Engine=MyISAM` 的老表，转换方式是 `ALTER TABLE t ENGINE = InnoDB;`——注意这是**复制整表**的大 DDL，大表请配合第 4 章的 online DDL 或 gh-ost。
:::

## 1.3 三份日志分别住在哪

这是面试与排障都绕不开的一张图：

```text
binlog（归档日志 / Server 层）
  ├─ 逻辑日志：记录"这条语句改变了什么"，格式由 binlog_format 决定（第 8 章）
  ├─ 追加写：不覆盖，可长期保存 → 主从复制、数据恢复、审计都靠它
  └─ 文件：mysql-bin.000001 ...，索引文件 mysql-bin.index

redo log（重做日志 / InnoDB 层）
  ├─ 物理日志：记录"某个页做了什么修改"
  ├─ 循环写：固定大小，写满就擦除最旧的（checkpoint 推进）
  └─ 作用：crash-safe —— 断电重启后把未刷盘的页改回来

undo log（回滚日志 / InnoDB 层）
  ├─ 记录反向操作（INSERT 对应 DELETE 的逆操作）
  ├─ 作用一：ROLLBACK 时把数据改回去 → 原子性
  └─ 作用二：多版本并发控制（MVCC）的快照来源 → 第 6 章
```

两者为什么要一起工作？因为一次更新要同时写 redo log 和 binlog，MySQL 用**两阶段提交**保证它们不矛盾：

```text
1. InnoDB 把修改写进 redo log，标记为 prepare
2. Server 层把这条变更写入 binlog 并落盘
3. InnoDB 把 redo log 标记为 commit
```

崩溃发生在第 2 步之前 → 回滚；发生在第 2、3 步之间 → 由 binlog 是否完整来决定提交与否。规则是"binlog 写了就提交"，所以从库和备份永远不会拿到主库没承认的数据。

## 1.4 my.cnf：配置文件与常用参数

先看配置文件从哪读、读了什么：

```bash
# 找出 MySQL 真正读取的配置文件顺序（最后一行 "Default options" 就是答案）
mysqld --verbose --help 2>/dev/null | grep -A 1 'Default options'
# 常见顺序：/etc/my.cnf  /etc/mysql/my.cnf  ~/.my.cnf  （以实际版本输出为准）

# 服务实际生效的参数（推荐直接问服务器，别看文件猜）
mysql -uroot -p -e "SHOW VARIABLES LIKE 'innodb_buffer_pool_size';"
mysql -uroot -p -e "SHOW VARIABLES WHERE Variable_name IN ('max_connections','character_set_server','lower_case_table_names');"
```

新手需要理解的参数清单：

```ini
# /etc/my.cnf —— 生产起步配置（数值请按机器内存换算，不要照抄）
[mysqld]
# 缓冲池：InnoDB 缓存数据与索引的主内存，独占机器给物理内存的 50%~70%
innodb_buffer_pool_size = 4G

# 最大连接数：应用侧连接池总数之和要明显小于它
max_connections = 600

# 事务日志刷盘策略：1 = 每次提交都刷盘（最安全，双一配置的一半）
innodb_flush_log_at_trx_commit = 1

# 单个事务能用的临时表内存，超了落磁盘临时表
tmp_table_size = 256M
max_heap_table_size = 256M

# 字符集：统一 utf8mb4（第 2 章解释为什么不是 utf8）
character_set_server = utf8mb4

# 慢查询日志：优化工作的入口（第 4 章）
slow_query_log = ON
long_query_time = 2
log_queries_not_using_indexes = OFF

# 复制相关（第 8 章）
server_id = 1
log_bin = mysql-bin
binlog_format = ROW
expire_logs_days = 7
```

:::caution[改完配置必须确认生效]
`my.cnf` 改动需要重启 mysqld；带 `SET GLOBAL` 的运行时改动**重启即失效**，两者不能互相替代。查全部配置值：`SHOW VARIABLES LIKE '%参数名片段%';`；查非默认配置：`SELECT * FROM performance_schema.variables_info WHERE variable_source <> '';`（需 8.0 且有权限）。
:::

## 1.5 容器方式起一个 MySQL

学习阶段最省事的方式是 Docker，不污染本机也方便销毁重来。

```bash
# 起一个 MySQL 8，数据与配置挂载到宿主目录，方便改 my.cnf 和备份
mkdir -p ~/mysql-data/{conf,data}

cat > ~/mysql-data/conf/my.cnf <<'EOF'
[mysqld]
default_time_zone = '+08:00'
character_set_server = utf8mb4
innodb_buffer_pool_size = 512M
max_connections = 200
slow_query_log = ON
long_query_time = 1
EOF

docker run -d --name mysql8 \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=Root@123 \
  -e MYSQL_DATABASE=shop \
  -v ~/mysql-data/conf:/etc/mysql/conf.d \
  -v ~/mysql-data/data:/var/lib/mysql \
  mysql:8.0

# 进入实例（-e 执行一条语句，不用起交互 shell）
docker exec -it mysql8 mysql -uroot -pRoot@123 -e "SELECT VERSION(), @@character_set_server;"
docker exec -it mysql8 mysql -uroot -pRoot@123 shop
```

`-e MYSQL_DATABASE=shop` 会自动建好一个空库，本系列所有示例都在 `shop` 库上做。

:::tip[把电商四表建起来]
SQL 基础教程里的 `customers`、`orders`、`order_items`、`products` 四张表在本系列继续使用，字段名保持一致。若本地还没有，按 [第 2 章 · 数据类型与表设计](./02-data-types-schema/) 给出的 DDL 建表即可，第 10 章的实战也从这份结构出发。
:::

## 1.6 连接器与账号：常见姿势

```bash
# 连接：主机、端口、用户、库名
mysql -h 127.0.0.1 -P 3306 -u shop_app -p shop

# 连接后先看全局
SHOW DATABASES;
SHOW TABLES;
SHOW CREATE TABLE orders\G     -- \G 让结果竖排，DDL 长的时候比表格好读
STATUS;                        -- 等价于 \s，看当前连接、引擎、内存与临时表计数
```

账号与权限的最小可用姿势：

```sql
-- 业务账号只给需要的库、需要的权限；root 不给应用使用
CREATE USER 'shop_app'@'%' IDENTIFIED BY 'App@123456';
GRANT SELECT, INSERT, UPDATE, DELETE ON shop.* TO 'shop_app'@'%';
FLUSH PRIVILEGES;

-- 查权限
SHOW GRANTS FOR 'shop_app'@'%';
```

```text
ERROR 2003: Can't connect to MySQL server → 服务没起 / 端口没映射 / 防火墙
ERROR 1045: Access denied for user         → 账号、密码或 host 段不匹配
ERROR 2013: Lost connection during query   → 连接被杀、超时或实例重启
```

:::caution[别把密码写在命令行里]
`mysql -uroot -p123456` 会出现在 `ps` 输出和 shell history 中。用 `-p` 交互输入，或写入 `~/.my.cnf`（权限设 600）：`[client] user=... password=...`。
:::

## 1.7 综合练习

1. 起一个容器实例，用 `SELECT VERSION(), @@innodb_buffer_pool_size, @@max_connections;` 记录三个实际值，并注明你的版本。
2. 执行 `SHOW TABLE STATUS WHERE Name = 'orders';`，找出 `Engine`、`Rows`、`Data_length`、`Index_length` 四列，说出 `Engine` 是 InnoDB 还是 MyISAM。
3. 把 `slow_query_log` 通过 `SET GLOBAL slow_query_log = ON;` 打开，再执行 `SHOW VARIABLES LIKE 'slow_query_log_file';` 找到日志文件路径，`tail -f` 看它长什么样。
4. 用自己的话回答：一条 `UPDATE` 语句从执行到落盘，Server 层和 InnoDB 层各自写了哪份日志？为什么需要两阶段提交？

## 本章小结

- MySQL 分连接层、Server 层、存储引擎层：解析优化在 Server 层，数据存取与 redo/undo 在引擎层
- binlog 是 Server 层的逻辑归档日志（复制与恢复靠它），redo log 保证崩溃安全，undo log 支撑回滚与 MVCC
- InnoDB 支持事务与行锁、MyISAM 只有表锁且不可崩溃恢复，新项目一律 InnoDB
- 配置看 `my.cnf`，生效值一律用 `SHOW VARIABLES` 向实例确认；改文件要重启，`SET GLOBAL` 不持久
