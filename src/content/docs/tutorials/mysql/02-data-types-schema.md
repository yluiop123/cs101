---
title: "数据类型与表设计"
description: "-- 常见整型的取值范围（UNSIGNED 只影响非负一侧的上限）"
series: mysql
sidebar:
  order: 2
  label: "数据类型与表设计"
difficulty: intermediate
duration: 7
tableOfContents: true
---

**本章目标：**

- 为金额、时间、字符串选出不会返工的列类型
- 理解 utf8mb4 与排序规则对存储、索引和查询结果的影响
- 定下一张表的主键策略与 NULL 取舍

## 整型与小数：先定范围，再定精度

```sql
-- 常见整型的取值范围（UNSIGNED 只影响非负一侧的上限）
-- TINYINT      -128 ~ 127      /  UNSIGNED 0 ~ 255
-- SMALLINT     -32768 ~ 32767  /  UNSIGNED 0 ~ 65535
-- INT          约 ±21 亿       /  UNSIGNED 0 ~ 约 42.9 亿
-- BIGINT       约 ±9.2e18      /  UNSIGNED 0 ~ 约 1.8e19
SELECT COLUMN_NAME, COLUMN_TYPE, DATA_TYPE
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'shop' AND TABLE_NAME = 'orders';
```

选型口诀：**按业务最大值上浮一档**。订单量可能过亿的 `orders.order_id` 直接上 `BIGINT UNSIGNED`，因为整型扩宽（`MODIFY order_id BIGINT`）是**拷贝全表**的大 DDL，而一开始用大整数只多占几个字节。

```text
状态码/类型码     TINYINT UNSIGNED（配合注释或字典表说明含义）
是否布尔         TINYINT UNSIGNED（约定 0/1）；MySQL 的 BOOL 只是它的别名
计数/库存         INT 起步，可能超 21 亿就 BIGINT
外键、主键        BIGINT UNSIGNED（与上游表类型必须完全一致，否则索引失效，第 3 章）
```

小数的选择只有一条分界线：

```sql
-- 精确计算：DECIMAL 按十进制存储，不会丢位
ALTER TABLE products MODIFY price DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

-- 近似计算：FLOAT/DOUBLE 是二进制浮点，0.1 无法精确表示
SELECT 0.1 + 0.2 = 0.3;              -- 结果看起来像 1，实际依赖实现，别赌
SELECT CAST('0.1' AS DOUBLE) * 3;    -- 尾数可能不是你要的 0.30000000000000004
```

:::caution[钱用 FLOAT 存是事故现场]
`FLOAT`/`DOUBLE` 存金额会导致：对账差几分钱、`WHERE total_amount = 99.99` 命中不了、聚合误差累积。正确写法是 `DECIMAL(M, D)`：`M` 是总位数、`D` 是小数位数，`DECIMAL(12, 2)` 足够装万亿级金额。另一种方案是"分为单位存 `BIGINT`"，性能更好但要全链路统一，别一半元一半分。
:::

## 字符串：CHAR、VARCHAR、TEXT 与 JSON

```text
CHAR(n)      定长：不足补空格，最多 255 个字符；适合哈希值、国家码这类长度恒定的列
VARCHAR(n)   变长：n 是"字符"上限而非字节；额外 1~2 字节记长度；行总长受 65535 字节约束
TEXT 家族    TINYTEXT/TEXT/MEDIUMTEXT/LONGTEXT（最大 64KB/16MB/...），超长时溢出到页外存储
JSON         8.0 起为二进制文档类型，内部会自动校验与规范化，可建函数索引
```

```sql
-- 电商四表里的典型选择
CREATE TABLE customers (
  customer_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username    VARCHAR(32)  NOT NULL COMMENT '登录名，长度按业务上限定',
  mobile      CHAR(11)     NOT NULL COMMENT '手机号定长，用 CHAR',
  email       VARCHAR(128) NULL COMMENT '可空，非必填',
  city        VARCHAR(32)  NOT NULL DEFAULT '' COMMENT '未知用空串或 NULL，全库统一',
  level       TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '会员等级 1~5',
  preferences JSON         NULL COMMENT '偏好标签等半结构化数据',
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (customer_id),
  UNIQUE KEY uk_username (username),
  UNIQUE KEY uk_mobile (mobile)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
```

TEXT 的代价：

```text
1. 超长内容存到溢出页，读一行要多几次随机 IO
2. 不能直接索引整列，只能前缀索引（第 3 章）
3. 参与排序/分组时可能撑爆排序内存，落磁盘临时表
所以：列表页需要的字段留在主表，长正文拆到单独的文章内容表。
```

:::tip[JSON 适合什么]
"属性集合不确定"的列（如订单扩展信息、商品参数）用 `JSON` 比堆几十个稀疏 `VARCHAR` 更合适。查询走 `JSON_EXTRACT` / `->>` 语法，但**普通索引建不上**，高频条件要抽成生成列再索引：
```sql
ALTER TABLE products
  ADD COLUMN color VARCHAR(16)
    GENERATED ALWAYS AS (JSON_UNQUOTE(JSON_EXTRACT(attrs, '$.color'))) STORED,
  ADD KEY idx_color (color);
```
以 `SELECT VERSION()` 确认 5.7+ 才支持生成列。
:::

## 时间类型：DATETIME 与 TIMESTAMP

```text
DATETIME   范围 1000-01-01 ~ 9999-12-31，8 字节，"墙上时钟"，不涉及时区换算
TIMESTAMP  范围 1970 ~ 2038-01-19，4 字节，内部存 UTC，按会话 time_zone 显示
两者都可带小数秒：DATETIME(3) / DATETIME(6)（毫秒/微秒）
```

```sql
SHOW VARIABLES LIKE 'time_zone';            -- 先看服务器与会话时区
SELECT NOW(), UTC_TIMESTAMP(), @@session.time_zone;

-- 建表默认值：8.0 的 DATETIME 也支持 CURRENT_TIMESTAMP，不再非 TIMESTAMP 不可
ALTER TABLE orders
  MODIFY created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '下单时间',
  MODIFY paid_at    DATETIME NULL COMMENT '支付成功时间，未支付为 NULL';
```

选择依据：

```text
业务时间（下单、支付、发货）→ DATETIME：不受会话时区影响，跨时区一致
需要"自动更新"审计列        → 任一种都能写 ON UPDATE CURRENT_TIMESTAMP
日志类高频写入想要省空间     → TIMESTAMP（4 字节，但记住 2038 上限）
```

:::caution[同名字段两种时区语义]
把 `TIMESTAMP` 列的数据迁移到另一个 `time_zone` 不同的实例，读出来的钟点会变；`DATETIME` 不会。团队里必须统一：应用侧传字符串还是传时间戳、数据库列存哪种，全库一致并在注释里写明时区（例如"本列按东八区存储"）。
:::

## 字符集与排序规则

MySQL 的 `utf8` 不是完整 UTF-8，它是 `utf8mb3`（每字符最多 3 字节），存不了 emoji 和生僻字。

```sql
-- 查看版本支持的字符集与排序规则
SHOW CHARACTER SET LIKE 'utf8mb4';
SHOW COLLATION WHERE Charset = 'utf8mb4';

-- 建库统一 utf8mb4；排序规则 8.0 默认 *_0900_ai_ci，5.7 常见 general_ci/unicode_ci
CREATE DATABASE shop
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_general_ci;

-- 已经在跑的库改字符集（大表 DDL，先看第 4 章 online DDL）
ALTER TABLE customers CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

排序规则（collation）决定三件事：比较是否区分大小写与重音、字符串怎么排序、以及**索引能否被复用**。

```text
utf8mb4_general_ci    ci = case insensitive，'Abc' = 'abc' 成立
utf8mb4_bin           按字节比较，区分大小写，适合存 token / 编码
utf8mb4_0900_ai_ci    8.0 新默认（基于 Unicode 9.0 规则），性能与准确性更好
```

:::danger[连接层字符集不一致会乱码]
表是 `utf8mb4` 但客户端连接是 `latin1`，中文会存成乱码（`???` 或"娴烽」式乱码）。排查用 `SHOW VARIABLES LIKE 'character_set_%';`，重点是 `character_set_client`、`_connection`、`_results`；连接串显式写 `charset=utf8mb4`。
:::

## NULL 的取舍与列属性

```sql
-- NULL 参与的三件事，结果常常出乎意料
SELECT COUNT(email) FROM customers;        -- 只数非 NULL 行，与 COUNT(*) 不同
SELECT * FROM customers WHERE level <> 3;  -- level 为 NULL 的行不会被返回
SELECT NULL + 1, CONCAT('a', NULL);        -- 都是 NULL
SELECT IFNULL(city, '未知') FROM customers;-- 需要显式兜底
```

实践建议：

```text
优先 NOT NULL + 明确的默认值/哨兵值
  · 数值：0；字符串：''（或统一用 NULL 表示"未填"，二选一并全库一致）
  · 语义上真的"未知"（如未支付订单的 paid_at）→ 保留 NULL
索引：NULL 也能进索引，"NULL 不走索引"是误解；真正的问题是含 NULL 的列
      难以做唯一约束语义与统计（多行 NULL 不算重复）
行开销：可为 NULL 的列在记录头里要占 NULL 位图（1 字节起），不是主要矛盾
```

:::tip[一个可复用的写法约定]
金额、数量、状态这类"业务上必有值"的列一律 `NOT NULL DEFAULT ...`；只有"事件尚未发生"的列（`paid_at`、`cancel_reason`）允许 `NULL`。这样第 6 章统计、第 10 章归档脚本都能少写一半 `IFNULL`。
:::

## 主键：自增、业务主键与分布式 ID

```sql
-- 三种候选
order_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,   -- A. 自增整型（推荐默认）
order_no VARCHAR(32) NOT NULL,                     -- B. 业务单号（做成唯一二级索引）
id CHAR(36) NOT NULL,                              -- C. UUID（随机字符串，慎做主键）
UNIQUE KEY uk_order_no (order_no)
```

InnoDB 是**索引组织表**：主键就是数据的存放顺序（第 3 章详解）。

```text
自增主键   顺序写入 → 页不分裂、碎片少、二级索引存的主键短小
业务主键   例如手机号做主键：长度大且会变，UPDATE 主键 = 删一行插一行 + 所有二级索引跟着改
UUID 主键  16/36 字节 + 完全随机 → 写入在 B+ 树里到处跳，页分裂、缓存命中率低
```

结论：内部用自增 `BIGINT` 做主键，对外暴露业务单号（`order_no`）并加唯一索引。分库分表场景需要预先生成全局 ID 时，用**趋势递增**的方案（雪花 ID / 号段模式），别用随机 UUID。

:::caution[自增不是"绝对不重复也不连续"]
`AUTO_INCREMENT` 是"分配即递增"：事务回滚、批量插入预分配、实例重启都可能留下空洞。任何业务都不允许把 `order_id` 的连续性当成正确性前提。当前值可看 `SHOW TABLE STATUS WHERE Name = 'orders';` 的 `Auto_increment` 列。
:::

## 综合练习：给 orders 做一次 DDL 评审

下面是一段"能跑但会返工"的建表语句：

```sql
-- 慢/错写法
CREATE TABLE orders (
  id           INT AUTO_INCREMENT,
  order_no     VARCHAR(255),
  customer_id  INT,
  total_amount FLOAT,
  status       VARCHAR(20),
  create_time  TIMESTAMP,
  remark       TEXT,
  PRIMARY KEY (id)
);
```

问题与修正：

```sql
-- 正确写法
CREATE TABLE orders (
  order_id     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '内部主键，趋势递增',
  order_no     VARCHAR(32)  NOT NULL COMMENT '对外业务单号',
  customer_id  BIGINT UNSIGNED NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT '订单总额，单位元',
  status       TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '0待付1已付2发货3完成4取消',
  pay_method   TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '0未付1微信2支付宝3银行卡',
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paid_at      DATETIME NULL,
  remark       VARCHAR(255) NOT NULL DEFAULT '',
  PRIMARY KEY (order_id),
  UNIQUE KEY uk_order_no (order_no),
  KEY idx_customer_status_created (customer_id, status, created_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT '订单主表';
```

逐条说明原因：`INT` 主键会在过 21 亿时被迫做全表大 DDL；`VARCHAR(255)` 存单号浪费空间且鼓励超长脏数据；`FLOAT` 存钱丢精度；`VARCHAR(20)` 存状态浪费且无法约束取值；`TIMESTAMP` 有 2038 上限且受时区影响；`id`/`create_time` 命名与四表其余字段风格不统一。

自查清单：

- [ ] 每个数值列都写明了 `UNSIGNED` 与 `NOT NULL` 决策
- [ ] 金额列全部是 `DECIMAL(M, D)`，且小数位一致
- [ ] 时间列全部是 `DATETIME`（或全部 `TIMESTAMP`），命名统一 `*_at`
- [ ] 表和库都显式声明 `utf8mb4` + 排序规则
- [ ] 主键是窄的、趋势递增的整型；业务单号是二级唯一索引
- [ ] 用 `SHOW CREATE TABLE orders;` 复查过一遍输出

## 本章小结

- 整型按业务范围上浮一档，金额只用 `DECIMAL(M, D)` 或"分为单位的整数"，不用 `FLOAT`
- `VARCHAR(n)` 的 n 是字符数；长文本用 `TEXT` 但要接受溢出页与前缀索引限制，半结构化用 `JSON` + 生成列索引
- `DATETIME` 存墙上时间不受会话时区影响，`TIMESTAMP` 省空间但有 2038 上限，全库统一一种风格
- 字符集统一 `utf8mb4`（不是 `utf8`），排序规则决定大小写敏感与索引复用；主键选趋势递增整型，业务号做唯一索引
