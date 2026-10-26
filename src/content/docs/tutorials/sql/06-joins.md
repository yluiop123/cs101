---
title: "第 6 章 · 多表连接"
description: "不加条件地把两张表配对，行数相乘："
series: sql
sidebar:
  order: 6
  label: "多表连接"
difficulty: beginner
duration: 4
---

**本章目标：**

- 理解连接就是"按条件做笛卡尔积再筛行"，从而能预测结果行数
- 分清 `INNER` / `LEFT` / `RIGHT` / `FULL` 各保留谁，并会写 MySQL 的 `FULL` 替代式
- 搞懂连接条件写进 `ON` 和写进 `WHERE` 的差别，以及连接把金额算翻倍的成因

## 6.1 笛卡尔积：连接的起点

不加条件地把两张表配对，行数相乘：

```sql
SELECT c.name, p.title
  FROM customers c
 CROSS JOIN products p;        -- 8 × 8 = 64 行
```

这就是**笛卡尔积**。所谓连接，就是在它上面加一个配对条件——老式写法把条件塞进
`WHERE`（`FROM customers c, orders o WHERE ...`），现代写法写进 `ON`，推荐后者：

```sql
SELECT c.name, o.total
  FROM customers c
  JOIN orders o ON o.customer_id = c.customer_id;    -- 11 行
```

:::caution[漏掉连接条件就是笛卡尔积]
`FROM a, b` 忘了写 `WHERE` 条件，10 万行 × 10 万行 = 100 亿行，数据库会跑到天荒地老。
显式 `JOIN ... ON` 的好处正在于此：**不写 `ON` 直接语法报错**，忘了也跑不起来。
:::

## 6.2 INNER JOIN：只留配对成功的行

`JOIN` 默认就是 `INNER JOIN`，两边都能配上对才留下：

```sql
SELECT c.name, o.order_id, o.total
  FROM customers c
  JOIN orders o ON o.customer_id = c.customer_id
 ORDER BY c.name, o.order_id;      -- 11 行：订单总数就是结果行数
```

三点观察：8 个客户只出来 7 个——孙芳配不上对就消失；每笔订单恰好配一个客户，
所以仍是 11 行；连接键可以带多个条件（`ON a.x = b.x AND a.y = b.y`）。

```sql
-- 错误：两张表只写在 FROM 里，配对条件漏了
SELECT o.order_id, it.product_id
  FROM orders o, order_items it;          -- 11 × 16 = 176 行，全是无效组合

-- 正确：配对条件进 ON
SELECT o.order_id, it.product_id, it.quantity
  FROM orders o
  JOIN order_items it ON it.order_id = o.order_id;   -- 16 行

-- 不等号连接也合法（6.5 的自连接就用它）
```

:::tip[一对多连接会让行数"膨胀"]
`orders` 连 `order_items` 是 1 对多：11 笔订单配 16 条明细 → 结果 16 行。此时去
`SUM(orders.total)`，同一笔订单的 `total` 会被加多次——**先数行数，再决定能不能求和**（6.6 演示事故）。
:::

## 6.3 LEFT JOIN 与 RIGHT JOIN

`LEFT JOIN` 保住左表全部行，右表配不上的位置填 `NULL`：

```sql
-- 所有客户 + 各自的订单，没下过单的也要出现
SELECT c.customer_id, c.name, COUNT(o.order_id) AS n_orders
  FROM customers c
  LEFT JOIN orders o ON o.customer_id = c.customer_id
 GROUP BY c.customer_id, c.name
 ORDER BY n_orders DESC, c.customer_id;
```

```text
customer_id | name | n_orders
1           | 张伟 | 3
2           | 李娜 | 3
3           | 王强 | 1
4           | 赵敏 | 1
5           | 陈晨 | 1
6           | 刘洋 | 1
8           | 周洁 | 1
7           | 孙芳 | 0      -- COUNT(o.order_id) 数的是非 NULL，正好得到 0
```

`RIGHT JOIN` 只是把左右调换，语义完全对称：

```sql
SELECT c.name, o.order_id
  FROM customers c
 RIGHT JOIN orders o ON o.customer_id = c.customer_id;
-- 与 FROM orders o LEFT JOIN customers c ON ... 完全等价，实际项目里几乎只用 LEFT
```

:::tip[找"配不上的行"就靠 IS NULL]
```sql
-- 从未下单的客户
SELECT c.customer_id, c.name
  FROM customers c
  LEFT JOIN orders o ON o.customer_id = c.customer_id
 WHERE o.order_id IS NULL;      -- 连接没成功的标记
```
`COUNT(o.order_id)` 给 0、`WHERE o.order_id IS NULL` 给行——这两个工具覆盖 90% 的"找缺失"需求。
注意别用 `COUNT(*)`，它会把孙芳那一行也数成 1。
:::

## 6.4 FULL OUTER JOIN：MySQL 没有，自己拼

`FULL OUTER JOIN` 两边都保：配上的正常输出，两边配不上的各补一行 `NULL`。
PostgreSQL、SQLite 3.39+ 支持，**MySQL 直接报语法错误**。替代式是"左外连 + 右表独有的行"：

```sql
-- MySQL 版 FULL OUTER JOIN：customers ⟷ orders
SELECT c.name, o.order_id
  FROM customers c
  LEFT JOIN orders o ON o.customer_id = c.customer_id

UNION ALL                                     -- UNION ALL 不去重，性能更好

SELECT c.name, o.order_id
  FROM customers c
 RIGHT JOIN orders o ON o.customer_id = c.customer_id
 WHERE c.customer_id IS NULL;                 -- 只要"订单有、客户没有"那部分
```

结果 12 行：孙芳那一行的 `order_id` 是 `NULL`；本样例没有孤儿订单，
所以右半句贡献 0 行，整体与单独的 `LEFT JOIN` 相同。

:::danger[为什么必须加 `WHERE c.customer_id IS NULL`]
不加这个条件，右半句返回的就是完整的内连接结果，`UNION ALL` 之后每一笔订单都会出现两次。
:::

## 6.5 自连接：一张表扮演两个角色

同一张表连自己，用来在表内部配对。找同城客户对：

```sql
-- 同城的"人对"，用 customer_id 大小关系避免重复与自配
SELECT a.name AS name_a, b.name AS name_b, a.city
  FROM customers a
  JOIN customers b ON b.city = a.city
                 AND a.customer_id < b.customer_id
 ORDER BY a.city, name_a, name_b;
```

```text
name_a | name_b | city
张伟   | 王强   | 上海      -- 上海三人 → (1,3) (1,8) (3,8)
张伟   | 周洁   | 上海
王强   | 周洁   | 上海
李娜   | 刘洋   | 北京      -- 北京两人 → (2,6)
```

自连接的三个要点：

- 必须给两个角色分别起别名，否则列名全部歧义
- 加 `a.id < b.id` 去掉 `(x,y)` 与 `(y,x)` 的镜像重复，同时排除自己配自己
- `city` 为 `NULL` 的两位客户配不出对（比较得 `UNKNOWN`），要连"未填写城市"配对一起看，条件换成 `<=>`（MySQL）或手写 `IS NOT DISTINCT FROM` 思路（第 7 章）

## 6.6 ON 还是 WHERE：LEFT JOIN 的分水岭

对 `INNER JOIN`，条件放 `ON` 或 `WHERE` 结果一样；对 `LEFT JOIN`，完全不一样。

```sql
-- ① 条件在 ON：先决定"谁能配上"，配不上的左行仍然保留
SELECT c.customer_id, c.name, COUNT(o.order_id) AS n
  FROM customers c
  LEFT JOIN orders o ON o.customer_id = c.customer_id
                    AND o.status <> 'cancelled'
 GROUP BY c.customer_id, c.name;      -- 8 行，王强 n = 0

-- ② 条件在 WHERE：左连接先生成 12 行，再把行删掉
SELECT c.customer_id, c.name, COUNT(o.order_id) AS n
  FROM customers c
  LEFT JOIN orders o ON o.customer_id = c.customer_id
 WHERE o.status <> 'cancelled'
 GROUP BY c.customer_id, c.name;      -- 6 行：王强（只有取消单）和孙芳（无订单）都被删了
```

②的灾难在于：`WHERE` 把右表补出来的 `NULL` 行也当作"不满足条件"删掉了，
`LEFT JOIN` 被降级成 `INNER JOIN`。

```sql
-- 错误：想要所有客户的订单数，右表条件却写进 WHERE
 WHERE o.status <> 'cancelled'
-- 正确：条件留在 ON 里；若非要写 WHERE，就显式接住 NULL
 WHERE o.status <> 'cancelled' OR o.order_id IS NULL
```

:::caution[连接产生的重复行会毁掉聚合]
把 `orders` 连 `order_items` 后再 `SUM(o.total)`：订单 1 有两条明细，`488.00` 被加了两次，
全库结果变成 `12577.00`，而真实营业额是 `7038.00`。
修法有两种：① 只连一层，明细金额用 `SUM(it.quantity * it.unit_price)` 求（同样得 7038.00）；
② 先在子查询里按订单聚合，再连接（[第 7 章 · 子查询与 CTE](./07-subquery-cte/)）。
:::

## 6.7 综合练习：订单明细报表

四表串起来，输出每一行卖了什么、卖给了谁：

```sql
SELECT o.order_id,
       o.created_at,
       c.name              AS customer,
       COALESCE(c.city, '未知') AS city,
       p.title,
       it.quantity,
       it.unit_price,
       it.quantity * it.unit_price AS line_amount
  FROM order_items it
  JOIN orders    o ON o.order_id   = it.order_id
  JOIN customers c ON c.customer_id = o.customer_id
  JOIN products  p ON p.product_id  = it.product_id
 WHERE o.status <> 'cancelled'
 ORDER BY o.created_at, o.order_id, it.item_id;   -- 15 行
```

行数怎么核对：`order_items` 一共 16 行，去掉取消单（订单 4）的那 1 行 → 15 行；
每条明细都能配上订单、客户、商品，所以连接既不增也不减行。

```sql
-- 追问一：每个类别的销售额（用明细的成交价快照，不用 products.price）
SELECT p.category, SUM(it.quantity * it.unit_price) AS revenue
  FROM order_items it
  JOIN orders   o ON o.order_id   = it.order_id AND o.status <> 'cancelled'
  JOIN products p ON p.product_id = it.product_id
 GROUP BY p.category
 ORDER BY revenue DESC;

-- 追问二：每个城市的订单数，没下单的也要露出来
SELECT COALESCE(c.city, '未填写') AS city, COUNT(o.order_id) AS n_orders
  FROM customers c
  LEFT JOIN orders o ON o.customer_id = c.customer_id
 GROUP BY COALESCE(c.city, '未填写')
 ORDER BY n_orders DESC;             -- 上海 5 / 北京 4 / 广州 1 / 未填写 1，合计 11
```

追问一的顺序是：数码 4343、服饰 998、家居 633、图书 565，相加等于 6539——
正好是全部营业额 7038 减去被排除的取消单 499。想一想：为什么销售额要用
`it.unit_price` 而不是 `p.price`？（提示：明细 7 的机械键盘成交价 359，现价 399。）

## 本章小结

- 连接 = 笛卡尔积 + 配对条件；写显式 `JOIN ... ON`，忘条件时报错而不是产出十亿行
- `INNER` 只留配对成功的行，`LEFT`/`RIGHT` 保住一侧全部行并用 `NULL` 补另一侧，找缺失靠 `IS NULL`
- MySQL 没有 `FULL OUTER JOIN`，用 `LEFT JOIN UNION ALL RIGHT JOIN ... WHERE 左键 IS NULL` 拼
- `LEFT JOIN` 的右表条件要放 `ON`；放 `WHERE` 会把它降级成内连接，一对多连接还会让聚合金额翻倍
