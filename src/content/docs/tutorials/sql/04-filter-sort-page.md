---
title: "第 4 章 · 过滤、排序与分页"
description: "SELECT title, price, stock"
series: sql
sidebar:
  order: 4
  label: "过滤、排序与分页"
difficulty: beginner
duration: 5
---

**本章目标：**

- 用比较与逻辑运算符写出准确的多条件过滤
- 掌握 `BETWEEN`、`IN`、`LIKE`、`IS NULL` 四个过滤工具各自的边界
- 会用 `ORDER BY` 定序、用 `LIMIT`/`OFFSET` 分页，并知道分页会在哪里翻车

## 4.1 比较运算符

```sql
SELECT title, price, stock
  FROM products
 WHERE price >= 100        -- 大于等于
   AND stock <> 0          -- 不等于（也写 !=，标准 SQL 是 <>）
   AND category = '数码';
```

| 运算符 | 含义 | 备注 |
| --- | --- | --- |
| `=` `<>` `!=` | 等于、不等于 | `<>` 是标准写法，MySQL 两个都收 |
| `<` `<=` `>` `>=` | 大小比较 | 字符串按排序规则（collation）比 |
| `IS NULL` `IS NOT NULL` | 判定未知 | 唯一能拿到 `NULL` 的方式 |
| `BETWEEN ... AND ...` | 闭区间 | 含两端 |
| `IN` / `NOT IN` | 属于集合 | 集合含 `NULL` 时有大坑 |
| `LIKE` | 模式匹配 | `%` 任意串，`_` 任意单字符 |

:::caution[字符串比较看排序规则]
MySQL 的 `utf8mb4_general_ci` 里 `_ci` 表示 case-insensitive，所以
`'SQL 实战教程' LIKE '%sql%'` 也能命中；PostgreSQL 默认区分大小写，要靠
`ILIKE`。跨库迁移时这类差异不会报错，只会让结果悄悄变多或变少。
:::

## 4.2 逻辑运算符与优先级

`AND` 比 `OR` 优先级高。这条规则每年制造无数 bug：

```sql
-- 需求：上海或北京的、余额大于 100 的客户
-- 错误：AND 先结合，等价于「上海」或「(北京 且 余额大于 100)」
SELECT name, city, balance
  FROM customers
 WHERE city = '上海'
    OR city = '北京'
   AND balance > 100;

-- 正确：括号显式分组，OR 的一侧是完整条件
SELECT name, city, balance
  FROM customers
 WHERE (city = '上海' OR city = '北京')
   AND balance > 100;
```

三个书写纪律：

- 每个 `OR` / `AND` 单独一行，行首带运算符（diff 时一眼看出改了哪条）
- 只要出现 `OR`，就无条件加括号——即使你觉得当前逻辑不需要
- `NOT` 优先级最高，`NOT city = '上海'` 实际是 `(NOT city) = '上海'` 的坑你别踩，写 `city <> '上海'` 或 `NOT (city = '上海')`

:::tip[同一列多值用 IN，别串 OR]
```sql
WHERE city = '上海' OR city = '北京' OR city = '广州'   -- 三遍同名列，易漏
WHERE city IN ('上海', '北京', '广州')                   -- 等价且好读
```
`IN` 还能直接换成子查询（[第 7 章 · 子查询与 CTE](./07-subquery-cte/)），`OR =` 不能。
:::

## 4.3 BETWEEN、IN 与 LIKE

```sql
-- 时间区间：BETWEEN 含两端，等价于 >= AND <=
SELECT order_id, created_at
  FROM orders
 WHERE created_at BETWEEN '2025-03-01' AND '2025-04-30';    -- 4 笔：订单 4、5、6、7

-- 状态集合
SELECT order_id, status
  FROM orders
 WHERE status IN ('paid', 'shipped');                        -- 3 笔：订单 2、6、10

-- 模糊匹配：前缀/包含/后缀
SELECT title FROM products WHERE title LIKE 'SQL%';    -- 以 SQL 开头
SELECT title FROM products WHERE title LIKE '%键盘%';  -- 含"键盘"
SELECT title FROM products WHERE title LIKE '__鼠%';   -- 前两个字符任意，第三个是"鼠"
```

`BETWEEN` 的两个雷区：

```sql
-- 错误：DATE 用 BETWEEN 到某天，以为"包含这一天"
WHERE created_at BETWEEN '2025-03-01' AND '2025-03-31'
-- 如果列是 DATETIME/TIMESTAMP，'2025-03-31' 被当成 03-31 00:00:00，当天其余时刻全丢

-- 正确：左闭右开，用"下一天"当上界，且不写 BETWEEN
WHERE created_at >= '2025-03-01' AND created_at < '2025-04-01'
```

:::tip[LIKE 的元字符要转义]
`%` 和 `_` 是通配符。搜"100% 纯棉"这类字面值时：MySQL 写 `LIKE '%100\% 纯棉%'`，
或用标准语法 `LIKE '%100!% 纯棉%' ESCAPE '!'`。SQLite 默认反斜杠不是转义符，
必须显式给 `ESCAPE`。另外 `LIKE '%关键字%'` 前面带 `%` 就用不上索引，
大表上这是性能红线，全文检索要另找工具。
:::

## 4.4 把"未知"显式写出来

[第 3 章 · 查询基础](./03-select-basics/)的结论在这里正式使用：任何比较运算碰到 `NULL`
都得 `UNKNOWN`，`WHERE` 一律丢弃。

```sql
-- 需求：不是上海的客户（含未填写城市的）
SELECT name, city
  FROM customers
 WHERE city IS NULL
    OR city <> '上海';           -- 5 行；漏掉 IS NULL 那一支只剩 3 行
```

同理，`NOT IN` 遇到 `NULL` 会整条件失效：

```sql
WHERE city NOT IN ('上海', '北京')          -- 得 1 行（广州）：两个 NULL 客户被吞了
WHERE city NOT IN ('上海', '北京', NULL)    -- 得 0 行：任何值与 NULL 比较都是 UNKNOWN
```

:::danger[`NOT IN` 的子查询绝不能返回 NULL]
第 7 章会看到 `WHERE product_id NOT IN (SELECT product_id FROM order_items)` 这种写法。
只要子查询结果里混进一个 `NULL`，整句就返回 0 行且不报错。
安全的替代是 `NOT EXISTS`——它按行判定，不受 `NULL` 传染。
:::

## 4.5 ORDER BY：排序是"结果"的属性

```sql
-- 多列排序：先按状态优先级，再按金额从大到小，最后按时间
SELECT order_id, status, total, created_at
  FROM orders
 ORDER BY status ASC, total DESC, created_at ASC;

-- 也可以按表达式或别名排序（别名在 ORDER BY 里是合法的）
SELECT title, price * 2 AS two_units
  FROM products
 ORDER BY two_units DESC
 LIMIT 5;
```

四条规则：

- 不写 `ORDER BY` 就没有顺序保证（哪怕只有 5 行、哪怕每次都一样）
- `NULL` 的排位是方言：MySQL 把 `NULL` 当最小（升序排最前），PostgreSQL 相反（升序排最后）；想控制就用表达式
- `ORDER BY` 只能引用 `SELECT` 里出现的列或其别名（`DISTINCT` 查询更是如此）
- 中文排序在 MySQL 靠排序规则（`utf8mb4_zh_0900_as_cs` 才有拼音序），默认 `general_ci` 按 Unicode 码位排

```sql
-- 跨库稳定地把 NULL 排到最后（三家都能跑的写法）
SELECT name, city
  FROM customers
 ORDER BY CASE WHEN city IS NULL THEN 1 ELSE 0 END, city;
```

## 4.6 LIMIT / OFFSET 分页与它的坑

```sql
-- 第 1 页
SELECT order_id, total
  FROM orders
 ORDER BY order_id
 LIMIT 5 OFFSET 0;

-- 第 2 页
SELECT order_id, total
  FROM orders
 ORDER BY order_id
 LIMIT 5 OFFSET 5;               -- MySQL 简写：LIMIT 5, 5（顺序是"偏移, 条数"，极易写反）
```

坑一：**排序不稳定 → 同一行重复出现或消失**。

```sql
-- 错误：按非唯一的 total 排序翻页
ORDER BY total DESC LIMIT 3 OFFSET 3;    -- total 相同的那几行落在页边界，翻页会重复/漏行

-- 正确：末尾补一个唯一列当"决胜键"
ORDER BY total DESC, order_id DESC LIMIT 3 OFFSET 3;
```

坑二：**深翻页越来越慢**。`OFFSET 100000` 意味着数据库要先取出、丢弃 10 万行。
数据量大时改用"游标分页"（keyset），把上一页最后一行的排序值写进条件：

```sql
-- 上一页最后一条的 order_id 是 5：下一页从它之后开始，永远走索引
SELECT order_id, total
  FROM orders
 WHERE order_id > 5
 ORDER BY order_id
 LIMIT 5;
```

:::caution[分页总数要单独查]
`SELECT COUNT(*) FROM orders` 才能知道一共有多少页；`LIMIT` 只给你这一页的行数。
很多前端把"本页返回 5 行"当成"总共只有 5 行"，就是这么来的。
:::

## 4.7 综合练习：商品列表分页

```sql
-- ① 在售商品按价格从低到高，取第 1 页（每页 4 条）
SELECT product_id, title, price
  FROM products
 WHERE on_sale = 1
 ORDER BY price ASC, product_id ASC
 LIMIT 4 OFFSET 0;

-- ② 同一页条件的第 2 页
SELECT product_id, title, price
  FROM products
 WHERE on_sale = 1
 ORDER BY price ASC, product_id ASC
 LIMIT 4 OFFSET 4;

-- ③ 数码或家居类、价格不低于 100 的在售商品，按价格从高到低
SELECT title, category, price
  FROM products
 WHERE category IN ('数码', '家居')
   AND price >= 100
   AND on_sale = 1
 ORDER BY price DESC;

-- ④ 未完成（既不是 done 也不是 cancelled）的订单，按下单时间从新到旧
SELECT order_id, customer_id, status, total
  FROM orders
 WHERE status NOT IN ('done', 'cancelled')
 ORDER BY created_at DESC, order_id DESC;
```

对答案：① 得 4 行，最便宜是保温杯 79.00；② 是剩下的 3 行（`on_sale = 1` 的商品共 7 个，
所以第 2 页不满一页）；③ 命中显示器、机械键盘、无线鼠标三件，台灯因为已下架被排除；
④ 是 pending、paid、shipped 的 4 笔订单，按时间从新到旧排列。
做完再自问一句：如果 ① 的需求改成"包含已下架商品"，第 2 页会变成几行？

## 本章小结

- `AND` 优先级高于 `OR`：出现 `OR` 就加括号，多值条件用 `IN` 而不是串 `OR`
- `BETWEEN` 含两端但对时间类型有"当天丢失"风险，日期区间推荐左闭右开写 `>= AND <`
- 一切比较碰到 `NULL` 都是 `UNKNOWN`，`NOT IN` 混入 `NULL` 会整句返回 0 行
- 分页必须有确定顺序：`ORDER BY` 补唯一决胜键，深翻页改用游标（keyset）条件
