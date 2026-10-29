---
title: "第 3 章 · 查询基础"
description: "SELECT name, city -- 取哪些列"
series: sql
sidebar:
  order: 3
  label: "查询基础"
difficulty: beginner
duration: 4
tableOfContents: true
---

**本章目标：**

- 记住一条查询的骨架：`SELECT` 取什么、`FROM` 从哪取、`WHERE` 挑哪些
- 会用列别名、`DISTINCT`、`LIMIT` 控制输出的形状
- 建立对 `NULL` 与三值逻辑的正确直觉，避开最常见的空结果事故

## 3.1 一条查询的骨架

```sql
SELECT name, city            -- 取哪些列
  FROM customers             -- 从哪张表
 WHERE city = '上海';         -- 挑哪些行
```

```text
name | city
张伟 | 上海
王强 | 上海
周洁 | 上海
```

三句话各管一件事，顺序固定（`WHERE` 永远在 `FROM` 之后）。写法上有一个排版习惯值得学：
把 `SELECT`/`FROM`/`WHERE` 顶格、后续行缩进两空格并让关键字对齐，条件一长就读得清楚：

```sql
SELECT name, city, joined_at
  FROM customers
 WHERE city = '上海'
   AND balance > 0;
```

`WHERE` 里可以放：列、常量、比较运算符、`AND`/`OR`/`NOT`、函数调用。
但**不能放聚合函数**（`WHERE COUNT(*) > 3` 是语法错误），那是[第 5 章 · 聚合与分组](../05-aggregate-group/)里 `HAVING` 的活。

## 3.2 选列、算列与列别名

列可以是表里的列，也可以是表达式：

```sql
SELECT name,
       price,
       price * 0.9 AS price_after_10pct_off   -- 表达式 + 列别名
  FROM products
 WHERE category = '数码';
```

别名（`AS`）的两个用途：

```sql
-- ① 给算出来的列起个能看懂的名字（AS 可省，但别省，读代码的人不是你）
SELECT name AS customer_name FROM customers;

-- ② 给表起短名，多表连接时省下大量字符（第 6 章主力用法）
SELECT c.name, o.total
  FROM customers c
  JOIN orders o ON o.customer_id = c.customer_id;
```

:::caution[`SELECT *` 只在探索时用]
```sql
-- 错误：生产代码 / 应用里的 SQL
SELECT * FROM products;

-- 正确：明确列出需要的列
SELECT product_id, title, price FROM products;
```
`SELECT *` 的三个代价：加了列就改变结果结构、白读不需要的字段拖慢网络、
`ORDER BY`/索引覆盖优化全部失效。临时探索用它没问题，写进代码就不要留。
:::

:::tip[别名不能出现在 `WHERE` 里]
```sql
-- 错误：WHERE 先于 SELECT 执行，此时别名还不存在
SELECT title, price * 0.9 AS discounted
  FROM products
 WHERE discounted < 100;          -- MySQL 报 Unknown column 'discounted'

-- 正确：条件里把表达式重写一遍
SELECT title, price * 0.9 AS discounted
  FROM products
 WHERE price * 0.9 < 100;
```
执行顺序是[第 5 章 · 聚合与分组](../05-aggregate-group/)的正式主题，先记住结论：**别名只能在 `SELECT` 与 `ORDER BY` 里用**。
:::

## 3.3 DISTINCT：去重而不是"取不同"

`DISTINCT` 作用于**整行结果**，不是紧跟它的那一列：

```sql
SELECT DISTINCT city FROM customers;          -- 城市清单
```

```text
city
上海
北京
广州
NULL      -- 四行：DISTINCT 把所有 NULL 视为"相同"，只保留一行
```

```sql
-- 去重的是 (city, category) 这个组合，不是单独某一列
SELECT DISTINCT c.city, p.category
  FROM customers c
  JOIN orders o ON o.customer_id = c.customer_id
  JOIN order_items it ON it.order_id = o.order_id
  JOIN products p ON p.product_id = it.product_id;    -- 第 6 章细讲连接
```

三处细节：

- `DISTINCT` 必须写在列清单最前面，写在中途就是语法错误
- `DISTINCT` + `ORDER BY` 时，排序列必须出现在结果列里（`SELECT DISTINCT city ... ORDER BY name` 非法）
- 只想知道"有几种"要用 `COUNT(DISTINCT city)`，第 5 章讲

:::caution[别用 DISTINCT 去"修补"重复行]
如果 `SELECT DISTINCT` 之后行数才正常，十有八九是你的查询本来就产生了重复行
（连接条件写错、漏了条件）。第 6 章会演示：用 `DISTINCT` 掩盖重复行，
下一步 `SUM` 就会算错。正确做法是修好连接条件。
:::

## 3.4 LIMIT：只要前几行

MySQL / SQLite 的写法：

```sql
SELECT order_id, total
  FROM orders
 ORDER BY total DESC
 LIMIT 3;                     -- 前 3 行

SELECT order_id, total
  FROM orders
 ORDER BY total DESC
 LIMIT 3 OFFSET 2;            -- 跳过 2 行再取 3 行
```

标准 SQL（PostgreSQL 也支持，MySQL 8 部分支持）：

```sql
SELECT order_id, total
  FROM orders
 ORDER BY total DESC
 FETCH FIRST 3 ROWS ONLY;
```

:::danger[`LIMIT` 不跟 `ORDER BY` 就是随机结果]
```sql
-- 错误：「取 3 笔订单」每次跑可能给出不同的 3 行
SELECT order_id FROM orders LIMIT 3;

-- 正确：先定序再截断
SELECT order_id FROM orders ORDER BY created_at DESC LIMIT 3;
```
没有 `ORDER BY` 时，哪 3 行由执行计划决定——今天稳定不代表升级索引后还稳定。
分页的完整坑位在[第 4 章 · 过滤、排序与分页](../04-filter-sort-page/)。
:::

## 3.5 NULL 是"未知"，不是空也不是零

`NULL` 的语义是**这个值当前未知/不适用**，于是它不等于任何东西，包括它自己：

```sql
SELECT NULL = NULL;     -- NULL（既不是 1 也不是 0）
SELECT NULL <> 1;       -- NULL
SELECT NULL + 10;       -- NULL（任何运算碰到 NULL 都传染为 NULL）
SELECT NULL = '';       -- NULL：空字符串是"已知为空"，NULL 是"未知"，两者不同
SELECT NULL = 0;        -- NULL：0 是已知的零
```

`shop` 库里的两处 `NULL`：客户 5、7 的 `city`；订单里没有 `NULL` 列，
第 6 章连接之后才会凭空产生 `NULL`。

:::tip[判断 NULL 只有一个办法]
```sql
-- 错误
SELECT name FROM customers WHERE city = NULL;      -- 永远返回 0 行

-- 正确
SELECT name FROM customers WHERE city IS NULL;
SELECT name FROM customers WHERE city IS NOT NULL;
```
`IS NULL` / `IS NOT NULL` 不是"比较"，是"判定"，所以它们是唯一能拿到结果的写法。
:::

## 3.6 三值逻辑：条件只认「真」

`WHERE` 只保留判定为 `TRUE` 的行，`FALSE` 和 `UNKNOWN` 一起被丢掉。于是：

```sql
-- 需求：所有不是上海的客户
SELECT name FROM customers WHERE city <> '上海';    -- 得 3 行，客户 5、7 消失了
```

`NULL <> '上海'` 是 `UNKNOWN`（也许她就在上海，只是没填），于是那两行被过滤掉。
**"排除某值"永远不会带上未知值**，这是三值逻辑最反直觉的一条。

```sql
-- 正确：把未知显式接住
SELECT name
  FROM customers
 WHERE city <> '上海'
    OR city IS NULL;                                 -- 得 5 行

-- 或者用 COALESCE 把 NULL 换成一个具体值再比较（MySQL/PG/SQLite 都有这函数）
SELECT name
  FROM customers
 WHERE COALESCE(city, '未知') <> '上海';
```

同理，`NOT (city = '上海')` 也不等于"非上海"——它对 `NULL` 依然给 `UNKNOWN`。
`NOT` 只是把 `TRUE`/`FALSE` 互换，`UNKNOWN` 保持不动。

## 3.7 综合练习：客户名单初筛

```sql
-- ① 输出「城市 + 注册时间」，城市为空的显示"未填写"，按时间从新到旧取 5 行
SELECT COALESCE(city, '未填写') AS city,
       joined_at
  FROM customers
 ORDER BY joined_at DESC
 LIMIT 5;

-- ② 一共有几种城市？（注意 DISTINCT 与 COUNT 的组合）
SELECT COUNT(DISTINCT city) FROM customers;     -- 3：NULL 不计入

-- ③ 找出余额为零且不是上海的客户
SELECT name, city, balance
  FROM customers
 WHERE balance = 0
   AND city <> '上海';                          -- 想一想：结果里有几个人？

-- ④ 把 ③ 改成"包含未填城市"的版本
SELECT name, city, balance
  FROM customers
 WHERE balance = 0
   AND (city <> '上海' OR city IS NULL);
```

余额为零的客户是王强（上海）、陈晨（城市为空）、孙芳（城市为空）三人。
第 ③ 题把它们**全滤掉了**：王强被 `city <> '上海'` 排除，另两位因为 `city` 是 `NULL`
得 `UNKNOWN`——结果是 0 行。第 ④ 题补上 `OR city IS NULL` 才返回陈晨、孙芳。

这组题的全部差异都来自 `NULL`。把"0 行 vs 2 行"这个差记住，
[第 4 章 · 过滤、排序与分页](../04-filter-sort-page/)就按同样的直觉写条件。

## 本章小结

- 骨架是 `SELECT` 选列、`FROM` 定表、`WHERE` 挑行，别名只能在 `SELECT`/`ORDER BY` 使用
- `DISTINCT` 作用于整行结果；用它"修"重复行往往是连接写错的信号
- `LIMIT` 必须配 `ORDER BY`，否则返回哪几行由执行计划决定；标准写法是 `FETCH FIRST n ROWS ONLY`
- `NULL` 是未知：比较一律得 `UNKNOWN`，只有 `IS NULL` / `IS NOT NULL` 能判定，`WHERE` 会丢掉未知行
