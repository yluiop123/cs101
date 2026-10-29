---
title: "第 8 章 · 数据修改与约束"
description: "-- ① 指定列名（推荐：列顺序变了也不会错）"
series: sql
sidebar:
  order: 8
  label: "数据修改与约束"
difficulty: beginner
duration: 5
tableOfContents: true
---

**本章目标：**

- 会写 `INSERT` / `UPDATE` / `DELETE`，并养成"改数据必先 `WHERE`"的肌肉记忆
- 掌握 `CREATE` / `ALTER` / `DROP` 与六大约束，理解数据库替你拦下了什么
- 会用 `BEGIN` / `COMMIT` / `ROLLBACK` 把多条语句绑成一次不可分割的变更

## 8.1 INSERT：写入行

```sql
-- ① 指定列名（推荐：列顺序变了也不会错）
INSERT INTO customers (name, email, city, joined_at, balance)
VALUES ('吴十', 'wushi@example.com', '深圳', '2025-08-01', 0.00);
-- ② 省略列名：必须按建表顺序给齐全部列，很脆弱，别用（`INSERT INTO customers VALUES (...)`）
-- ③ 一次多行
INSERT INTO products (title, category, price, stock) VALUES
  ('电动牙刷', '家居', 199.00, 30),
  ('蓝牙音箱', '数码', 259.00, 12);
-- ④ 从查询结果写入（造汇总表、迁移数据的标准手法）
INSERT INTO products (title, category, price, stock)
SELECT CONCAT(title, '（翻新）'), category, price * 0.8, 1
  FROM products
 WHERE on_sale = 0;
SELECT LAST_INSERT_ID();     -- 取回刚生成的自增 ID；PostgreSQL 用 INSERT ... RETURNING id
```
:::tip[冲突处理是方言重灾区，三家写法不同]
```sql
-- MySQL：冲突就忽略
INSERT IGNORE INTO customers (email, name, joined_at)
VALUES ('lina@example.com', '李娜', '2024-02-03');
-- MySQL：冲突就更新（与 IGNORE 二选一）
INSERT INTO customers (email, name, joined_at) VALUES ('lina@example.com', '李娜', '2024-02-03')
       ON DUPLICATE KEY UPDATE balance = balance + 10;
-- PostgreSQL / SQLite 3.24+
INSERT INTO customers (email, name, joined_at) VALUES ('lina@example.com', '李娜', '2024-02-03')
       ON CONFLICT (email) DO UPDATE SET balance = balance + 10;
```
`ON DUPLICATE KEY` 看的是"任意唯一键冲突"，`ON CONFLICT (email)` 明确指定冲突列，
跨库迁移时这段必改。
:::

## 8.2 UPDATE：WHERE 是安全带

```sql
-- 图书类全场九折：多个赋值用逗号，右侧读的都是旧值
UPDATE products
   SET price = ROUND(price * 0.9, 2),
       stock = stock - 1
 WHERE category = '图书';             -- ← 这一行就是安全带

-- 错误：没有 WHERE，整表更新
UPDATE products SET stock = 0;         -- 8 件商品库存全清零

-- 正确：先用同条件的 SELECT 确认影响范围，再执行 UPDATE
SELECT product_id, title, price FROM products WHERE category = '图书';   -- 2 行
```

`SET` 的右侧可以引用列本身（`balance = balance + 10`），也可以来自相关子查询：

```sql
-- 把每个客户的余额刷新为其未取消订单的总额
UPDATE customers c
   SET c.balance = (SELECT COALESCE(SUM(o.total), 0)
                      FROM orders o
                     WHERE o.customer_id = c.customer_id
                       AND o.status <> 'cancelled');
```

:::danger[安全模式与影响行数]
MySQL 的系统变量 `sql_safe_updates` 默认为 1：`WHERE` 里没有键列的 `UPDATE`/`DELETE`
会直接报 `ERROR 1175`，这是防手滑的救命设置，别为了省事关掉。
执行完一定要看回执 `Query OK, 2 rows affected`——行数与预期不符，立刻 `ROLLBACK`。
:::

## 8.3 DELETE 与 TRUNCATE

```sql
-- 删一行：先用同条件 SELECT 确认
SELECT customer_id, name FROM customers WHERE customer_id = 10;
DELETE FROM customers WHERE customer_id = 10;    -- 1 row affected

-- 错误：没有 WHERE 的 DELETE，整表清空
DELETE FROM orders;
```

`DELETE` 与 `TRUNCATE` 的差别：

| | `DELETE` | `TRUNCATE` |
| --- | --- | --- |
| 类别 | DML，逐行删 | DDL，直接重建表 |
| 条件 | 能带 `WHERE` | 不能，只能全清 |
| 触发器 / 级联 | 会触发 | 不触发 |
| 回滚 / 自增计数器 | 事务里可回滚，自增值保持 | 隐式提交不能回滚，自增重置为 1 |

:::caution[外键会拦住你删父行]
```sql
-- 错误：直接删还有订单的客户
DELETE FROM customers WHERE customer_id = 1;
-- ERROR 1451 (23000): Cannot delete or update a parent row: a foreign key constraint fails

-- 正确：自底向上删，明细 → 订单 → 客户
DELETE FROM order_items WHERE order_id IN (SELECT order_id FROM orders WHERE customer_id = 1);
DELETE FROM orders      WHERE customer_id = 1;
DELETE FROM customers   WHERE customer_id = 1;
```
删 `order_items` 时子查询读的是 `orders`，合法；MySQL 不允许在 `DELETE`/`UPDATE` 的
子查询里直接引用**正在改的那张表**（`ERROR 1093`），真要绕就再包一层派生表。
:::

## 8.4 DDL：CREATE / ALTER / DROP

```sql
CREATE TABLE monthly_sales (                     -- DDL 演示用，别动 shop 的四张主表
  ym       VARCHAR(7)    NOT NULL PRIMARY KEY,
  n_orders INT           NOT NULL DEFAULT 0,
  revenue  DECIMAL(12,2) NOT NULL DEFAULT 0.00
);

-- 加列 / 改类型 / 改名 / 删列 / 删表
ALTER TABLE monthly_sales ADD COLUMN note VARCHAR(50) NULL AFTER ym;
ALTER TABLE monthly_sales MODIFY COLUMN note VARCHAR(120) NOT NULL DEFAULT '';
ALTER TABLE monthly_sales CHANGE COLUMN note remark VARCHAR(120) NOT NULL DEFAULT '';
ALTER TABLE monthly_sales DROP COLUMN remark;
DROP TABLE IF EXISTS monthly_sales;      -- 生产环境不写不带 IF EXISTS 的 DROP
```

给真实表加 `NOT NULL` 列必须带 `DEFAULT`，否则已存在的行无法满足约束、语句直接失败。

:::danger[`DROP` 没有 undo]
`DROP TABLE` 连结构带数据一起消失，`TRUNCATE` 只清数据，`DELETE` 才有 `WHERE` 和事务。
执行前先确认当前库（`SELECT DATABASE();`）、确认有没有备份。
改列类型（`MODIFY`）在大表上会重建表，线上要走专门的变更流程。
:::

## 8.5 六大约束

约束是**写在表结构里的规则**，数据库每次写入都检查：

```sql
CREATE TABLE coupons (
  coupon_id   INT           NOT NULL AUTO_INCREMENT,     -- PRIMARY KEY：唯一且非空
  code        VARCHAR(20)   NOT NULL,
  customer_id INT           NULL,                        -- FOREIGN KEY 见下
  discount    DECIMAL(5,2)  NOT NULL DEFAULT 0.00,       -- DEFAULT：不给值就用它
  min_amount  DECIMAL(10,2) NOT NULL,
  used_at     DATE          NULL,                        -- 允许 NULL = 尚未使用
  PRIMARY KEY (coupon_id),
  UNIQUE KEY uk_coupon_code (code),                      -- UNIQUE：不允许重复
  CONSTRAINT chk_coupon_discount CHECK (discount > 0 AND discount < 100),
  CONSTRAINT fk_coupon_customer  FOREIGN KEY (customer_id)
    REFERENCES customers (customer_id)
);
```

| 约束 | 保证什么 | 违反时的报错（MySQL） |
| --- | --- | --- |
| `PRIMARY KEY` | 唯一 + 非空，一行的身份 | 1062 Duplicate entry |
| `UNIQUE` | 该列不重复（`NULL` 可多个） | 1062 Duplicate entry |
| `NOT NULL` | 必须有值 | 1048 Column cannot be null |
| `DEFAULT` | 缺省值，不是约束但常被并列讨论 | 无报错 |
| `CHECK` | 任意布尔表达式 | 3819 Check constraint violated |
| `FOREIGN KEY` | 引用的父行必须存在 | 1452 / 1451 |

```sql
-- 错误：MySQL 5.7 会"接受但不检查" CHECK
ALTER TABLE products ADD CONSTRAINT chk_stock CHECK (stock >= 0);
-- 5.7 静默忽略；8.0.16 起才真正生效。PostgreSQL / SQLite 一直是生效的
```

:::tip[`UNIQUE` 与 `NULL`]
MySQL/PG/SQLite 都允许同一列里有多个 `NULL` 通过唯一约束（`NULL` 不等于任何值）。
既要唯一又要必填，就写 `NOT NULL` + `UNIQUE`。
:::

## 8.6 外键级联与事务基础

外键的删除/更新策略写在 `REFERENCES` 后面：

```sql
-- 外键策略写在 REFERENCES 后面：NO ACTION（默认，拒绝改动父行）/ RESTRICT（MySQL 里同义）
-- CASCADE（父行被删则子行跟着删）/ SET NULL（子行外键列置 NULL，列须允许为 NULL）
ALTER TABLE order_items
  DROP FOREIGN KEY fk_items_order,
  ADD CONSTRAINT fk_items_order_cascade
    FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE;
-- 实验完请改回原约束，否则后续章节看到的删除行为会不一样
```

策略效果对照：删订单 5 时，它的明细 7、8 一起被 `CASCADE` 带走；
而删客户 2 会被 `NO ACTION` 拒绝，因为订单 3、5、10 还引用着它。

事务把多条语句绑成一个原子单元——要么全成，要么全无。骨架就三个词：

```sql
SET AUTOCOMMIT = 0;     -- MySQL 默认 1：每条语句自动提交，提交后回滚不了
BEGIN;                  -- 等价写法：START TRANSACTION
-- ……若干条 DML：要么全对，要么全不做……
COMMIT;                 -- 落库；中途出错（如外键 ERROR 1451）就改写成 ROLLBACK 整批撤销
```

8.7 的下单流程就是这套骨架的实战。要注意 `ROLLBACK` 撤销的是**本事务内**的所有改动，
不是只撤销最后一条失败的语句。

:::caution[DDL 不能回滚]
MySQL 里 `CREATE` / `ALTER` / `DROP` 会**隐式提交**当前事务。在事务中间执行 DDL，
之前的修改就已经落库、`ROLLBACK` 也救不回来。PostgreSQL 是主流库里唯一支持
事务内 DDL 的（`BEGIN; ALTER TABLE ...; ROLLBACK;` 可行）。
:::

## 8.7 综合练习：一次下单的完整流程

```sql
-- 客户 6 买 2 件保温杯 + 1 件机械键盘，一条事务搞定
SET AUTOCOMMIT = 0;
BEGIN;

INSERT INTO orders (customer_id, status, total, created_at)
VALUES (6, 'pending', 0.00, '2025-08-05');
SET @oid = LAST_INSERT_ID();

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
  (@oid, 6, 2, 79.00),
  (@oid, 3, 1, 399.00);

UPDATE orders
   SET total = (SELECT SUM(quantity * unit_price) FROM order_items WHERE order_id = @oid),
       status = 'paid'
 WHERE order_id = @oid;                 -- 557.00，由明细算出而非手填

UPDATE products SET stock = stock - 2 WHERE product_id = 6;
UPDATE products SET stock = stock - 1 WHERE product_id = 3;

COMMIT;
```

```sql
-- 验收：三处必须同时对
SELECT order_id, status, total FROM orders WHERE order_id = @oid;
SELECT product_id, stock FROM products WHERE product_id IN (3, 6);
SELECT COUNT(*) AS n_items FROM order_items WHERE order_id = @oid;   -- 2
```

把 `COMMIT` 换成 `ROLLBACK` 再跑一遍，验收三句会全部回到改动前——这就是事务的意义：
**订单、明细、库存不会只改到一半。**
思考题：`UPDATE products SET stock = stock - 500 WHERE product_id = 3;` 库存会被减成负数，
而现有约束拦不住（`CHECK` 只能做单行内的比较）。跨行/跨表校验要交给触发器或应用层。

## 本章小结

- `UPDATE`/`DELETE` 必带 `WHERE`，执行前用同条件 `SELECT` 预演，执行后核对影响行数
- 六大约束（主键、唯一、非空、默认、检查、外键）把规则写进表结构，`CHECK` 要 MySQL 8.0.16+
- 外键策略默认 `NO ACTION`，`CASCADE` 会连带删子行；删数据要自底向上（明细 → 订单 → 客户）
- 事务用 `BEGIN`/`COMMIT`/`ROLLBACK` 保证原子性，MySQL 中 DDL 隐式提交、不可回滚
