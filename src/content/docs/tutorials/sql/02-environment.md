---
title: "环境与客户端"
description: "docker run -d --name mysql8 -e MYSQLROOTPASSWORD=123456 \"
series: sql
sidebar:
  order: 2
  label: "环境与客户端"
difficulty: beginner
duration: 4
tableOfContents: true
---

**本章目标：**

- 装好一个连得上的 MySQL 8，并知道 SQLite 这条零配置退路
- 会用命令行客户端与图形工具执行 SQL、看结果
- 建好并灌满本教程唯一的样例库 `shop`（电商四表）

## 安装 MySQL 8

```bash
# 方式 A：Docker，最干净（删容器即卸载）
docker run -d --name mysql8 -e MYSQL_ROOT_PASSWORD=123456 \
  -e MYSQL_DATABASE=shop -p 3306:3306 mysql:8.0

# 方式 B：官方安装包（Windows 用 MySQL Installer，选 Server Only）
# 方式 C：包管理器
brew install mysql              # macOS
sudo apt install mysql-server   # Debian/Ubuntu
```

```bash
mysql -h 127.0.0.1 -P 3306 -u root -p   # -p 会提示输密码，别把密码写在命令行里
mysql> SELECT VERSION();                -- 8.0.x / 8.4.x 均可，必须 8.0 以上
```

:::caution[8.0 与 5.7 的差距是本教程的前提]
[第 7 章 · 子查询与 CTE](../07-subquery-cte/) 的 `WITH`、递归 CTE 与窗口函数在 MySQL 5.7
直接报语法错误。先跑 `SELECT VERSION();`，别在 5.7 上跟 8.0 的写法较劲。
:::

## 退路：SQLite，零配置

不想装服务就用 SQLite——一个文件就是一个数据库，手机 App 与测试环境里到处都是它：

```bash
sqlite3 shop.db     # 未安装：官网下载 sqlite-tools 压缩包；macOS 自带
```

```sql
-- SQLite 与 MySQL 的三处语法差别（后续用到时逐条标注）
CREATE TABLE demo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,   -- MySQL 写 INT PRIMARY KEY AUTO_INCREMENT
  name TEXT NOT NULL,                     -- SQLite 是"亲和类型"，写 VARCHAR(50) 也接受
  created_at TEXT                         -- 日期存 TEXT，取年份用 strftime('%Y', created_at)
);
```

:::tip[SQLite 记得开外键]
SQLite 出于历史原因**默认不检查外键**，每个新会话都要先手动执行
`PRAGMA foreign_keys = ON;`，否则[第 8 章 · 数据修改与约束](../08-dml-ddl/)的级联实验会得到错误结论。
:::

## 客户端：命令行与图形工具

| 工具 | 类型 | 适合场景 |
| --- | --- | --- |
| `mysql` / `sqlite3` CLI | 命令行 | 跟教程逐条敲，练手感 |
| DBeaver Community | 图形 | 免费跨平台，MySQL/PG/SQLite 通吃 |
| TablePlus | 图形 | macOS 手感最好，免费版限 10 个标签 |
| VS Code + MySQL 扩展 | 编辑器 | 不切窗口就能跑查询 |

MySQL 命令行常用元命令：

```sql
SHOW DATABASES;             -- 所有库
USE shop;                   -- 切换到 shop 库
SHOW TABLES;                -- 当前库的表
DESCRIBE orders;            -- 看列定义
SOURCE C:/sql/schema.sql;   -- 执行本地 SQL 文件
```

:::tip[结果只有 200 行？先怀疑工具]
图形客户端普遍有默认行数上限（DBeaver 是 200）。看到"刚好 200 行"先调工具设置，
再怀疑 SQL——你没写 `LIMIT` 的那些行一直都在表里。
:::

## 样例数据库：schema.sql

后续 6 章的所有查询都打这四张表，照抄即可执行（MySQL 8）：

```sql
-- schema.sql
DROP DATABASE IF EXISTS shop;
CREATE DATABASE shop CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE shop;

CREATE TABLE customers (
  customer_id INT           NOT NULL AUTO_INCREMENT,
  name        VARCHAR(50)   NOT NULL,
  email       VARCHAR(100)  NOT NULL,
  city        VARCHAR(50),                       -- 允许 NULL：客户可以不填城市
  joined_at   DATE          NOT NULL,
  balance     DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (customer_id),
  UNIQUE KEY uk_customers_email (email)
);

CREATE TABLE products (
  product_id INT           NOT NULL AUTO_INCREMENT,
  title      VARCHAR(100)  NOT NULL,
  category   VARCHAR(30)   NOT NULL,
  price      DECIMAL(10,2) NOT NULL,
  stock      INT           NOT NULL DEFAULT 0,
  on_sale    TINYINT       NOT NULL DEFAULT 1,   -- 1 在售 0 下架（MySQL 没有真 BOOLEAN）
  PRIMARY KEY (product_id),
  CONSTRAINT chk_products_price CHECK (price >= 0)
);

CREATE TABLE orders (
  order_id    INT           NOT NULL AUTO_INCREMENT,
  customer_id INT           NOT NULL,
  status      VARCHAR(12)   NOT NULL DEFAULT 'pending',
  total       DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at  DATE          NOT NULL,
  PRIMARY KEY (order_id),
  CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
);

CREATE TABLE order_items (
  item_id    INT           NOT NULL AUTO_INCREMENT,
  order_id   INT           NOT NULL,
  product_id INT           NOT NULL,
  quantity   INT           NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,             -- 下单当时的价格快照
  PRIMARY KEY (item_id),
  CONSTRAINT fk_items_order   FOREIGN KEY (order_id)   REFERENCES orders (order_id),
  CONSTRAINT fk_items_product FOREIGN KEY (product_id) REFERENCES products (product_id),
  CONSTRAINT chk_items_quantity CHECK (quantity > 0)
);
```

:::tip[两处刻意的设计]
`unit_price` 与 `products.price` 分开，是因为"成交价"和"现价"属于两个不同时刻的事实；
`orders.total` 冗余一份，是为了让账单查询不必每次重算明细，代价是要靠事务保证一致（第 8 章）。
:::

## 样例数据：seed.sql

```sql
-- seed.sql（显式写主键，方便跨章节引用固定 ID）
INSERT INTO customers (customer_id, name, email, city, joined_at, balance) VALUES
  (1, '张伟', 'zhangwei@example.com',  '上海', '2024-01-12', 120.00),
  (2, '李娜', 'lina@example.com',      '北京', '2024-02-03',  80.50),
  (3, '王强', 'wangqiang@example.com', '上海', '2024-03-18',   0.00),
  (4, '赵敏', 'zhaomin@example.com',   '广州', '2024-05-06',  30.00),
  (5, '陈晨', 'chenchen@example.com',   NULL,  '2024-06-21',   0.00),
  (6, '刘洋', 'liuyang@example.com',   '北京', '2024-08-09',  15.00),
  (7, '孙芳', 'sunfang@example.com',    NULL,  '2025-01-15',   0.00),
  (8, '周洁', 'zhoujie@example.com',   '上海', '2025-03-02', 200.00);

INSERT INTO products (product_id, title, category, price, stock, on_sale) VALUES
  (1, 'SQL 实战教程',       '图书',   89.00,  20, 1),
  (2, '数据系统设计与应用', '图书',  129.00,   8, 1),
  (3, '机械键盘',           '数码',  399.00,  15, 1),
  (4, '无线鼠标',           '数码',  129.00,   0, 1),
  (5, '27 寸显示器',        '数码', 1599.00,   5, 1),
  (6, '保温杯',             '家居',   79.00,  40, 1),
  (7, '护眼台灯',           '家居',  159.00,  12, 0),   -- 已下架
  (8, '三合一冲锋衣',       '服饰',  499.00,   6, 1);

INSERT INTO orders (order_id, customer_id, status, total, created_at) VALUES
  (1,  1, 'done',      488.00, '2025-01-05'),
  (2,  1, 'paid',      158.00, '2025-02-11'),
  (3,  2, 'done',     1728.00, '2025-02-20'),
  (4,  3, 'cancelled', 499.00, '2025-03-02'),
  (5,  2, 'done',      518.00, '2025-03-15'),
  (6,  4, 'shipped',   258.00, '2025-04-01'),
  (7,  5, 'done',       89.00, '2025-04-18'),
  (8,  1, 'pending',   237.00, '2025-05-06'),
  (9,  6, 'done',     1678.00, '2025-05-22'),
  (10, 2, 'paid',      258.00, '2025-06-09'),
  (11, 8, 'done',     1127.00, '2025-07-14');

INSERT INTO order_items (item_id, order_id, product_id, quantity, unit_price) VALUES
  (1,  1, 1, 1,   89.00),  (2,  1, 3, 1,  399.00),
  (3,  2, 6, 2,   79.00),  (4,  3, 5, 1, 1599.00),
  (5,  3, 4, 1,  129.00),  (6,  4, 8, 1,  499.00),
  (7,  5, 3, 1,  359.00),  (8,  5, 7, 1,  159.00),   -- 明细 7 是活动价
  (9,  6, 2, 2,  129.00),  (10, 7, 1, 1,   89.00),
  (11, 8, 6, 3,   79.00),  (12, 9, 5, 1, 1599.00),
  (13, 9, 6, 1,   79.00),  (14, 10, 4, 2, 129.00),
  (15, 11, 2, 1, 129.00),  (16, 11, 8, 2, 499.00);
```

数据形状里埋了四处故意的"坑"，后面章节会专门踩：

- 客户 5、7 的 `city` 是 `NULL` —— 第 3、4 章的三值逻辑
- 客户 7（孙芳）**一笔订单都没有** —— 第 6 章的 `LEFT JOIN`
- 订单 4 状态是 `cancelled`，但 `total` 仍占着 —— 第 5 章聚合要不要排除它
- 明细 7 的 `unit_price`（359）与商品现价（399）不同 —— 第 6 章算营业额该用谁

## 导入、验证与常见报错

```bash
mysql -h 127.0.0.1 -u root -p < schema.sql   # 先结构
mysql -h 127.0.0.1 -u root -p < seed.sql     # 再数据
```

```sql
-- 四张表行数一次性确认，期望 8 / 8 / 11 / 16
SELECT (SELECT COUNT(*) FROM customers)   AS n_customers,
       (SELECT COUNT(*) FROM products)    AS n_products,
       (SELECT COUNT(*) FROM orders)      AS n_orders,
       (SELECT COUNT(*) FROM order_items) AS n_items;
```

三个高频报错：

```text
ERROR 2003 Can't connect to MySQL server     → 服务没启动，或端口不是 3306
ERROR 1045 Access denied for user 'root'     → 密码错（MySQL 8 默认插件 caching_sha2_password）
ERROR 1452 Cannot add or update a child row  → 外键指向不存在的父行，检查插入顺序
```

:::danger[导入顺序不能乱]
必须先建表再灌数据，且父表在前：`customers` → `products` → `orders` → `order_items`。
反过来插会撞 `ERROR 1452`，反过来建表会撞 `ERROR 3780`（被引用的表还不存在）。
:::

## 综合练习：把样例库跑起来

```sql
-- ① 版本与当前库
SELECT VERSION(), DATABASE();

-- ② 表结构确认（MySQL）
SHOW TABLES;
DESCRIBE order_items;

-- ③ 确认外键真的在拦你：这一句必须失败
INSERT INTO orders (customer_id, status, total, created_at)
VALUES (999, 'pending', 0.00, '2025-08-01');

-- ④ 手算订单 3 的明细金额，与 orders.total 对照
SELECT SUM(quantity * unit_price) AS calc_total
  FROM order_items
 WHERE order_id = 3;                 -- 期望 1728.00

SELECT total AS stored_total
  FROM orders
 WHERE order_id = 3;                 -- 期望 1728.00
```

两句查询应给出同一个 `1728.00`。把 11 笔订单全算一遍，所有 `total` 都能由明细复现——
这份自洽就是[第 5 章 · 聚合与分组](../05-aggregate-group/)与[第 6 章 · 多表连接](../06-joins/)
结果的对照基准。若第 ③ 句居然成功了，说明你连的是 SQLite 且忘了开 `PRAGMA foreign_keys`。

## 本章小结

- MySQL 走 Docker 或官方安装包，版本必须 8.0+；SQLite 是零配置退路但要先开外键开关
- 命令行练手感、图形工具看数据，先确认客户端行数上限再怀疑 SQL
- 样例库 `shop`：customers 8 行 / products 8 行 / orders 11 行 / order_items 16 行
- seed 刻意留下 `NULL` 城市、零订单客户、取消单、价格快照四处伏笔，供后续章节踩
