---
title: 子查询与 CTE
---

# 第 7 章 · 子查询与 CTE

**本章目标：**

- 会按位置选择子查询形态：`SELECT` 里、`WHERE` 里、`FROM` 里
- 分清 `IN`、`EXISTS`、相关子查询各自的适用场景与 `NULL` 风险
- 用 `WITH` 把复杂查询拆成可读的步骤，并认识递归 CTE 能做什么

## 7.1 子查询就是"把一个查询当值用"

按它出现的位置分四类：

```text
SELECT 里   标量子查询（必须只返回一行一列）
WHERE  里   IN / EXISTS / 比较运算
FROM   里   派生表（返回一张表）
WITH   里   CTE，命名的临时结果集
```

```sql
-- 标量子查询：比平均金额高的订单
SELECT order_id, total,
       (SELECT AVG(total) FROM orders) AS avg_all   -- 一个值填进每一行
  FROM orders
 WHERE total > (SELECT AVG(total) FROM orders)
 ORDER BY total DESC;      -- 3 行：订单 3（1728.00）、9（1678.00）、11（1127.00）
```

三点值得注意：`avg_all` 每行都是同一个 639.8182（全局平均只算一次）；订单 5 的 518.00
进不来，因为它不大于 639.8182；`WHERE` 里的子查询与 `SELECT` 里的是**两次独立计算**，
写成 CTE 只算一次更省。

## 7.2 IN 子查询与 EXISTS 子查询

```sql
-- IN：买过数码类商品的客户（换成 JOIN 也能写，但要把中间表全列出来再去重）
SELECT customer_id, name
  FROM customers
 WHERE customer_id IN (
         SELECT o.customer_id
           FROM orders o
           JOIN order_items it ON it.order_id = o.order_id
           JOIN products p ON p.product_id = it.product_id
          WHERE p.category = '数码'
       );        -- 结果：张伟、李娜、刘洋 3 人
```

`EXISTS` 只问"有没有"，找到一行就停：

```sql
-- 下过单的客户
SELECT c.customer_id, c.name
  FROM customers c
 WHERE EXISTS (SELECT 1                  -- 写 SELECT 1 或 SELECT * 都一样，只看有没有行
                 FROM orders o
                WHERE o.customer_id = c.customer_id);   -- 引用外层的 c → 相关子查询
```

::: warning `NOT IN` + `NULL` = 空结果
```sql
-- 错误：从未被下单的商品
SELECT product_id, title
  FROM products
 WHERE product_id NOT IN (SELECT product_id FROM order_items);

-- 一旦 order_items.product_id 允许 NULL（本例恰好 NOT NULL，换个库就中招），
-- 子查询里混进一个 NULL，整句就返回 0 行且不报错

-- 正确：NOT EXISTS 按行判定，不受 NULL 传染
SELECT p.product_id, p.title
  FROM products p
 WHERE NOT EXISTS (SELECT 1
                     FROM order_items it
                    WHERE it.product_id = p.product_id);
```
:::

本样例里 8 件商品全都被下单过，两句都返回 0 行。想看到差异，先删掉一条明细再跑。

## 7.3 相关子查询：对外层每一行都重跑一次

```sql
-- 每位客户最近一笔订单
SELECT c.customer_id, c.name,
       (SELECT MAX(o.created_at)
          FROM orders o
         WHERE o.customer_id = c.customer_id) AS last_order
  FROM customers c
 ORDER BY last_order DESC NULLS LAST;   -- NULLS LAST 是 PG/SQLite 语法，MySQL 用 CASE（第 4 章）
```

执行模型是"外层每行跑一次内层"：8 个客户 → 内层跑 8 遍。
所以相关子查询必须有索引支撑（`orders.customer_id` 上有外键索引，正好），
否则大数据量下会退化成 nested loop 灾难。

```sql
-- 常见用法：找"组内最大"。每件商品里金额最高的一条明细
SELECT it.item_id, it.order_id, it.product_id,
       it.quantity * it.unit_price AS line_amount
  FROM order_items it
 WHERE it.quantity * it.unit_price = (
         SELECT MAX(it2.quantity * it2.unit_price)
           FROM order_items it2
          WHERE it2.product_id = it.product_id);
```

::: tip 相关子查询 vs 派生表
同一个需求两种写法：相关子查询好读、逐行执行；派生表 / CTE 一次算完全量再连接。
数据量大时后者通常快得多。别凭感觉选，用 `EXPLAIN` 看执行计划（第 8 章末尾提一句）。
:::

## 7.4 派生表：FROM 里的子查询

派生表返回的是"一张表"，外层可以像对表一样对它 `WHERE`、`GROUP BY`、再连接：

```sql
-- 先算每位客户的消费总额（内层聚合），外层再挑走高档客户
SELECT t.customer_id, c.name, t.spent
  FROM (SELECT customer_id, SUM(total) AS spent
          FROM orders
         WHERE status <> 'cancelled'
         GROUP BY customer_id) t        -- 派生表必须有别名（MySQL 强制）
  JOIN customers c ON c.customer_id = t.customer_id
 WHERE t.spent >= 800
 ORDER BY t.spent DESC;                 -- 李娜 2504 / 周洁 1127 / 张伟 883 / 刘洋 1678 → 按 DESC 排 4 行
```

它的代价是嵌套越深越难读：子查询套三层以上谁来都看不懂。把每一层提出来起名，
就是下一节的 `WITH`。

## 7.5 WITH：给中间结果起名

`WITH`（CTE，Common Table Expression）把派生表提到查询前面：

```sql
-- MySQL 8.0+ / PostgreSQL / SQLite 3.8.3+
WITH customer_spend AS (
        SELECT customer_id, SUM(total) AS spent
          FROM orders
         WHERE status <> 'cancelled'
         GROUP BY customer_id
     ),
     tiered AS (
        SELECT cs.customer_id,
               c.name,
               cs.spent,
               CASE WHEN cs.spent >= 1000 THEN '高'
                    WHEN cs.spent >= 300  THEN '中'
                    ELSE '低' END AS tier
          FROM customer_spend cs
          JOIN customers c ON c.customer_id = cs.customer_id
     )
SELECT tier, COUNT(*) AS n, ROUND(AVG(spent), 2) AS avg_spent
  FROM tiered
 GROUP BY tier
 ORDER BY avg_spent DESC;      -- 高 3 人 / 中 1 人 / 低 2 人（共 6 位客户有有效订单）
```

三个要点：

- CTE 能被同一条语句的后面多次引用，比复制粘贴派生表可靠
- 多个 CTE 用逗号相连，后一个可引用前一个（`tiered` 就用了 `customer_spend`）；
  最外层 `SELECT` 与 `WITH` 属于同一条语句，中间不能加分号
- CTE 只在这一条语句内存在；想跨语句复用要建临时表或视图

::: warning MySQL 5.7 及以下不认识 WITH
`WITH ... SELECT` 在 5.7 报语法错误。老版本上只能退回派生表嵌套，
或升级到 8.0。同理，窗口函数（下一节）也需要 8.0+。
:::

## 7.6 递归 CTE 一瞥

`WITH RECURSIVE` 能沿"父子结构"一路往下走。给 `customers` 加一列推荐人，模拟三级分销：

```sql
ALTER TABLE customers ADD COLUMN referrer_id INT NULL;   -- 第 8 章细讲 ALTER
UPDATE customers SET referrer_id = 1 WHERE customer_id IN (2, 3);
UPDATE customers SET referrer_id = 2 WHERE customer_id = 4;
UPDATE customers SET referrer_id = 3 WHERE customer_id = 5;
```

```sql
WITH RECURSIVE tree AS (
        -- ① 起点：张伟本人
        SELECT customer_id, name, referrer_id, 1 AS depth
          FROM customers
         WHERE customer_id = 1

        UNION ALL

        -- ② 递推：找出"上一步结果"里每个人的直接下级
        SELECT c.customer_id, c.name, c.referrer_id, t.depth + 1
          FROM customers c
          JOIN tree t ON t.customer_id = c.referrer_id
         WHERE t.depth < 10          -- 必须设上限，数据有环时会无限递归
     )
SELECT REPEAT('  ', depth - 1) || name AS org_chart, depth
  FROM tree
 ORDER BY depth, customer_id;
```

```text
org_chart   | depth
张伟        | 1
  李娜      | 2
  王强      | 2
    赵敏    | 3
    陈晨    | 3      -- 注意：4、5 的上级是 2 和 3，缩进深度由递推算出
```

固定三段：起点查询、`UNION ALL`、引用自身的递推查询。MySQL 8.0 / PostgreSQL /
SQLite 3.8.3+ 语法几乎一致；只有字符串拼接要换：`||` 在 MySQL 里是逻辑或，
得写 `CONCAT(REPEAT('  ', depth - 1), name)`。

::: danger 递归 CTE 三条军规
① 关键字 `RECURSIVE` 必须写（MySQL/PG）；② 递推部分一定要引用自身，否则是普通 CTE；
③ 一定要有终止条件或深度上限，环形数据会让查询永远跑不完并吃掉全部内存。
:::

## 7.7 综合练习：找出"高价值但沉默"的客户

```sql
-- 需求：累计消费不低于 800、但最近 90 天内没有下单的客户
WITH spend AS (
        SELECT customer_id, SUM(total) AS spent, MAX(created_at) AS last_order
          FROM orders
         WHERE status <> 'cancelled'
         GROUP BY customer_id
     )
SELECT c.customer_id,
       c.name,
       COALESCE(c.city, '未填写') AS city,
       s.spent,
       s.last_order
  FROM customers c
  JOIN spend s ON s.customer_id = c.customer_id
 WHERE s.spent >= 800
   AND s.last_order < DATE_SUB('2025-09-01', INTERVAL 90 DAY)   -- MySQL 日期函数
 ORDER BY s.spent DESC;      -- 2 行：刘洋 1678.00（末单 05-22）、张伟 883.00（末单 05-06）
```

SQLite 把最后一行换成 `s.last_order < DATE('2025-09-01','-90 day')`，
PostgreSQL 换成 `s.last_order < DATE '2025-09-01' - INTERVAL '90 days'`——
**这正是本教程反复强调的：查询主干三家通用，日期函数一定要查方言表。**

再做两个变体，检验理解：

- ① 把 `JOIN` 改成 `LEFT JOIN`，并把条件从 `WHERE` 挪进 `ON`，没下过单的客户会出现吗？
  （提示：`spend` 里没有他的行，`s.spent` 是 `NULL`，条件判定为 `UNKNOWN`）
- ② 用相关子查询重写 `spend` CTE，结果行数会不会变？跑 `EXPLAIN` 比较两种计划的成本。

## 本章小结

- 子查询按位置分工：`SELECT` 里取标量、`WHERE` 里做集合判定、`FROM` 里当派生表、`WITH` 里命名
- `NOT IN` 的子查询混入 `NULL` 会让整句返回 0 行，找缺失一律用 `NOT EXISTS`
- 相关子查询逐行重跑，必须有索引；量大时改写成派生表或 CTE 一次聚合再连接
- `WITH` 提升可读性、支持多次引用与链式定义，递归 CTE 处理父子结构但必须设终止条件
