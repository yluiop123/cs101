---
title: "聚合与分组"
description: "聚合把多行压成一行："
series: sql
sidebar:
  order: 5
  label: "聚合与分组"
difficulty: beginner
duration: 4
tableOfContents: true
---

**本章目标：**

- 熟练使用五个聚合函数，并说清它们各自怎么处理 `NULL`
- 掌握 `GROUP BY` 折叠分组、`HAVING` 过滤分组的分工
- 记住 SQL 的执行顺序，从此不再问"为什么 `WHERE` 里不能用别名"

## 五个聚合函数

聚合把**多行压成一行**：

```sql
SELECT COUNT(*)   AS n_orders,
       SUM(total)  AS gmv,
       AVG(total)  AS avg_total,
       MAX(total)  AS max_total,
       MIN(total)  AS min_total
  FROM orders;
```

```text
n_orders | gmv     | avg_total | max_total | min_total
11       | 7038.00 | 639.8182  | 1728.00   | 89.00
```

| 函数 | 作用 | 忽略 `NULL` | 典型误用 |
| --- | --- | --- | --- |
| `COUNT` | 计数 | 是（`COUNT(*)` 除外） | 用 `COUNT(col)` 统计总行数 |
| `SUM` | 求和 | 是 | 对非数值列求和 |
| `AVG` | 平均 | 是 | 想让"未填写"也算进分母 |
| `MAX` / `MIN` | 最大/最小 | 是 | 对字符串求最大（按排序规则比） |

:::tip[聚合函数只能待在它该待的地方]
`SELECT`、`HAVING`、`ORDER BY` 里可以用聚合；`WHERE` 里不行——
`WHERE` 在分组之前执行，那时候还没有"一组"可以聚合。
:::

## COUNT 的三种形态

```sql
SELECT COUNT(*)          AS n_all,        -- 8：所有行
       COUNT(city)      AS n_city,       -- 6：只数 city 非 NULL 的行
       COUNT(DISTINCT city) AS n_city_kind  -- 3：上海 / 北京 / 广州
  FROM customers;
```

三条结论：

- `COUNT(*)` 数**行**，`COUNT(表达式)` 数**该表达式非 NULL 的行**
- `COUNT(DISTINCT col)` 是"有几种"的标准答案，`DISTINCT` 写在括号里而不是前面
- 五个聚合里只有 `COUNT` 在不带 `DISTINCT` 时能对 `*` 或常量计数，`SUM(*)` 是语法错误

```sql
-- 用 COUNT 的 NULL 语义做"填写率"统计，非常顺手
SELECT COUNT(city) * 1.0 / COUNT(*) AS city_fill_rate
  FROM customers;                    -- 6 / 8 = 0.75
```

:::caution[空结果集上聚合返回什么]
`SELECT SUM(total) FROM orders WHERE 1 = 0;` 给 `NULL`，不是 0；
`COUNT` 给 0。把聚合结果直接送进算术表达式之前，先用
`COALESCE(SUM(total), 0)` 兜住，否则整个表达式会被 `NULL` 传染。
:::

## GROUP BY：把行折叠成组

`SELECT` 里出现的**每一个非聚合列**，都必须出现在 `GROUP BY` 里——这是铁律。

```sql
-- 每个客户的订单数与消费总额
SELECT customer_id,
       COUNT(*)     AS n_orders,
       SUM(total)   AS spent
  FROM orders
 GROUP BY customer_id
 ORDER BY spent DESC;
```

```text
customer_id | n_orders | spent
2           | 3        | 2504.00
6           | 1        | 1678.00
8           | 1        | 1127.00
1           | 3        | 883.00    -- 共 7 行，这里只显示按 spent 排序的前 4 行
```

按多列分组，组就是这些列的**组合**：

```sql
-- 每个客户每种状态的订单数
SELECT customer_id, status, COUNT(*) AS n
  FROM orders
 GROUP BY customer_id, status;

-- 按月分组：分组键可以是表达式（MySQL）
SELECT DATE_FORMAT(created_at, '%Y-%m') AS ym, COUNT(*) AS n
  FROM orders
 GROUP BY DATE_FORMAT(created_at, '%Y-%m')     -- MySQL：表达式要重写一遍
 ORDER BY ym;
```

```text
2025-01: 1   2025-02: 2   2025-03: 2   2025-04: 2   2025-05: 2   2025-06: 1   2025-07: 1
```

:::tip[方言差异：GROUP BY 能不能只写别名]
PostgreSQL / SQLite 允许 `GROUP BY ym`（按别名分组），MySQL 在 `ONLY_FULL_GROUP_BY`
模式下要求把表达式重写一遍。跨库时按最严格的写法来。
:::

## HAVING：过滤"组"，不是过滤"行"

`WHERE` 先筛行，再分组；`HAVING` 在分组之后筛组：

```sql
-- 消费总额超过 800 的客户
SELECT customer_id, SUM(total) AS spent
  FROM orders
 GROUP BY customer_id
 HAVING SUM(total) > 800;          -- 4 行：客户 1、2、6、8
```

```sql
-- 两个条件同时用：先只统计非取消单，再要求订单数大于 1
SELECT customer_id, COUNT(*) AS n, SUM(total) AS spent
  FROM orders
 WHERE status <> 'cancelled'      -- 分组前过滤行（走索引，成本低）
 GROUP BY customer_id
 HAVING COUNT(*) > 1              -- 分组后过滤组
 ORDER BY spent DESC;             -- 客户 1、2 两组
```

:::caution[`HAVING` 不是 `WHERE` 的替代品]
只依赖原始列的条件（`status <> 'cancelled'`）写在 `HAVING` 也能跑，但数据库要先把所有行
分完组再逐组丢弃，白白多做工作，而且优化器更难利用索引。
**判断标准很简单：条件里含聚合函数才用 `HAVING`。**
:::

## 执行顺序：一切困惑的答案

书写顺序与执行顺序不是一回事：

```text
书写：SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT
执行：FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT
```

```sql
SELECT customer_id, SUM(total) AS spent     -- ④ 才计算
  FROM orders                               -- ① 定位表
 WHERE status <> 'cancelled'                -- ② 逐行过滤
 GROUP BY customer_id                       -- ③ 折叠成组
 HAVING COUNT(*) > 1                        -- ⑤ 逐组过滤
 ORDER BY spent DESC                        -- ⑥ 用别名排序（此刻别名已存在）
 LIMIT 3;                                   -- ⑦ 截断
```

由此推出的四条可用性对照：

| 位置 | 能用列的别名 | 能用 `SELECT` 里的新别名 | 能用聚合函数 |
| --- | --- | --- | --- |
| `WHERE` | 是 | 否 | 否 |
| `GROUP BY` | 部分方言 | 否（MySQL 要重写表达式） | 否 |
| `HAVING` | 否（建议重写） | 部分方言 | 是 |
| `ORDER BY` | 是 | **是** | 是 |

## 聚合与 NULL、以及最常见的报错

```sql
-- 错误：SELECT 里出现既不聚合也不分组的列，MySQL 8 默认开 ONLY_FULL_GROUP_BY
SELECT customer_id, created_at, COUNT(*) AS n    -- created_at 不由 customer_id 决定
  FROM orders
 GROUP BY customer_id;
-- ERROR 1055 ... expression #2 of SELECT list is not in GROUP BY clause and
--                contains nonaggregated column 'shop.orders.created_at' ...

-- 正确 A：需要"组内最新时间"就把它聚合掉
SELECT customer_id, MAX(created_at) AS last_order, COUNT(*) AS n
  FROM orders
 GROUP BY customer_id;

-- 正确 B：需要那个维度，就把它一起分组
SELECT customer_id, status, COUNT(*) AS n
  FROM orders
 GROUP BY customer_id, status;
```

:::tip[主键能带来"函数依赖"豁免]
`SELECT c.customer_id, c.name, COUNT(*) FROM orders o JOIN customers c
ON ... GROUP BY c.customer_id` 在 MySQL 8 / PostgreSQL 是合法的：`customer_id`
是 `customers` 的主键，`c.name` 由它唯一决定。SQLite 不做这项检查，
非分组列会随便取一行的值——最容易埋雷。
:::

再回到 `NULL`：聚合会忽略 `NULL`，`AVG` 的分母因此可能不是你以为的行数。

```sql
-- 客户余额的平均：8 人行，但 balance 没有 NULL，所以分母就是 8
SELECT AVG(balance) FROM customers;          -- 55.687500（合计 445.50 / 8 行）

-- 城市填写率已经演示过：COUNT(city)=6 而 COUNT(*)=8
-- 想看"含未填写"的真实分布，得把 NULL 先变成具体值
SELECT COALESCE(city, '未填写') AS city, COUNT(*) AS n
  FROM customers
 GROUP BY COALESCE(city, '未填写')            -- MySQL：表达式重写
 ORDER BY n DESC;
-- 未填写 2 / 上海 3 / 北京 2 / 广州 1
```

## 综合练习：客户消费报表

```sql
-- 一张报表：每位客户的下单次数、总消费、最大单、平均单，排除取消单，
-- 只保留下过 2 单以上的客户，按总消费从高到低
SELECT c.customer_id,
       c.name,
       c.city,
       COUNT(o.order_id)  AS n_orders,
       SUM(o.total)       AS spent,
       MAX(o.total)       AS biggest,
       ROUND(AVG(o.total), 2) AS avg_total
  FROM customers c
  JOIN orders o ON o.customer_id = c.customer_id
 WHERE o.status <> 'cancelled'
 GROUP BY c.customer_id, c.name, c.city
 HAVING COUNT(o.order_id) >= 2
 ORDER BY spent DESC;
```

```text
customer_id | name | city | n_orders | spent   | biggest  | avg_total
2           | 李娜 | 北京 | 3        | 2504.00 | 1728.00  | 834.67
1           | 张伟 | 上海 | 3        | 883.00  | 488.00   | 294.33
```

三件事都在这两句结果里：

- 客户 3（王强）唯一的订单是取消单，被 `WHERE` 在分组前就丢掉了
- 客户 8（周洁）只有 1 单，被 `HAVING COUNT(...) >= 2` 挡在分组后
- 客户 7（孙芳）**从未出现在结果里**——她从没有过订单，`JOIN` 根本不会产生她的行

第三点是[第 6 章 · 多表连接](../06-joins/)的入口：想让"没下单的客户"也上报表，
得换一种连接方式。

## 本章小结

- 五个聚合都把多行压成一行且都忽略 `NULL`；`COUNT(*)` 数行、`COUNT(col)` 数非空、`COUNT(DISTINCT col)` 数种类
- `GROUP BY` 折叠分组，`SELECT` 里的非聚合列必须进 `GROUP BY`，否则严格模式报错
- `WHERE` 在分组前筛行、`HAVING` 在分组后筛组；条件含聚合函数才用 `HAVING`
- 执行顺序 `FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT` 决定了别名能不能用
