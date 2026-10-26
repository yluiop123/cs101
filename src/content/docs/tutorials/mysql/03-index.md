---
title: "第 3 章 · 索引与 B+ 树"
description: "数据库索引的第一约束是数据在磁盘上：一次随机 IO 的成本是纳秒级内存访问的十万倍量级，所以结构要\"矮、宽、顺序友好\"。"
series: mysql
sidebar:
  order: 3
  label: "索引与 B+ 树"
difficulty: intermediate
duration: 7
---

**本章目标：**

- 理解 InnoDB 为什么用 B+ 树，以及聚簇索引决定的"表即索引"
- 会判断一次查询要不要回表，能否用覆盖索引消掉回表
- 按最左前缀设计联合索引，并认出索引失效的写法

## 3.1 为什么是 B+ 树

数据库索引的第一约束是**数据在磁盘上**：一次随机 IO 的成本是纳秒级内存访问的十万倍量级，所以结构要"矮、宽、顺序友好"。

```text
哈希表      等值 O(1)，但无范围查询、无排序、冲突退化 → 内存引擎用（Memory），InnoDB 不用
二叉搜索树  高度 log2(N)，节点一个键 → 树太高，千万级要 24 层 IO
B 树        非叶子节点也存数据 → 每页能放的键变少，树更宽不高但范围扫描要中序回溯
跳表        链表多层指针，随机 IO 不可控，内存结构友好（Redis zset）
B+ 树       非叶子只存键+页号，叶子全存键且用双向链表串起来
```

B+ 树的三个决定性优势：

```text
1. 矮：一个 16KB 页能放几百个"键 + 页号"，三两层就能装下千万级行
   —— 一次主键查找通常只需 2~3 次页访问，根页常驻内存
2. 范围与排序天然高效：定位到叶子后沿双向链表往后扫即可，不必回到父节点
3. 稳定：任何键的查找路径长度一致，都落到叶子层
```

在实例里可以直接看 B+ 树的高度与页统计：

```sql
SELECT TABLE_NAME, INDEX_NAME, HEIGHT, LEAF_PAGES, TOTAL_PAGES
FROM information_schema.INNODB_INDEX_STATS   -- 8.0 起；5.7 无此视图
WHERE SCHEMA_NAME = 'shop' AND TABLE_NAME = 'orders';
```

## 3.2 聚簇索引：表本身就是一棵 B+ 树

InnoDB 的表是**索引组织表**：叶子节点存的是整行数据，而这棵树按主键排序。

```text
orders 表 = 一棵以 order_id 为键的 B+ 树（聚簇索引）
           行数据就在叶子里，没有"另一个地方存数据"
MyISAM     = 索引树叶子存"数据文件偏移量"，索引与数据分离（堆表 + 索引）
```

由此推出三条重要结论：

```text
1. 每张 InnoDB 表只有一棵聚簇索引树，行只能按一种顺序排
2. 主键选得窄、插入趋势递增（第 2 章），全表写入才不产生页分裂
3. 没有显式主键时，InnoDB 依次尝试：第一个非空唯一索引 → 隐式生成 6 字节 ROW_ID
   —— 所以每张表都必须显式写主键
```

## 3.3 二级索引、回表与覆盖索引

二级索引（普通索引/唯一索引）的叶子存的是**索引列的值 + 主键值**，不存整行。

```sql
-- orders 上的索引
ALTER TABLE orders
  ADD KEY idx_customer_created (customer_id, created_at),
  ADD KEY idx_status_created   (status, created_at);

-- 这条查询要走两棵树：这就是"回表"
SELECT order_id, customer_id, created_at, total_amount
FROM orders
WHERE customer_id = 1001
ORDER BY created_at DESC
LIMIT 10;
```

```text
第一步  在 idx_customer_created 里定位 customer_id = 1001 的叶子，倒序取 10 个 order_id
第二步  拿每个 order_id 回到聚簇索引取整行（最多 10 次 B+ 树下降）
        如果 SELECT 的列不在索引里，就必须回表
```

让回表消失的办法是**覆盖索引**：查询需要的列全部包含在二级索引里。

```sql
-- 只取索引已有的列 → 不碰聚簇索引
SELECT order_id, customer_id, created_at
FROM orders
WHERE customer_id = 1001
ORDER BY created_at DESC
LIMIT 10;
```

`EXPLAIN` 的 `Extra` 出现 `Using index` 就说明覆盖成功（详见 [第 4 章 · 执行计划与查询优化](./04-explain-optimization/)）。

:::caution[`SELECT *` 是覆盖索引的头号敌人]
加了 `idx_customer_created`，只要还写着 `SELECT *`，优化器就必须回表取那些没用到的列。把查询列表收紧到真正要用的字段，是成本最低、收益最快的一次改写；写报表 SQL 时尤其明显。
:::

回表的代价还要看比例：命中 10 行时回表很便宜，命中 50 万行时"走二级索引 + 回表"往往比直接全表扫描更慢，优化器这时会主动放弃索引 —— 这不是索引失效，是它的合理选择。

## 3.4 最左前缀法则

联合索引 `(a, b, c)` 实质是一棵按 `a`、再按 `b`、再按 `c` 排序的树，因此使用条件必须**从最左列开始且连续**。

```sql
-- 索引：KEY idx_c_s_c (customer_id, status, created_at)
WHERE customer_id = 1001                              -- 用 1 列
WHERE customer_id = 1001 AND status = 1               -- 用 2 列
WHERE customer_id = 1001 AND status = 1 AND created_at >= '2026-01-01'  -- 用 3 列
WHERE status = 1 AND customer_id = 1001               -- 仍用 2 列：条件顺序不影响，优化器会交换
WHERE customer_id = 1001 AND created_at >= '2026-01-01'  -- 只用到 customer_id（断了 status）
WHERE created_at >= '2026-01-01'                      -- 索引用不上
WHERE customer_id = 1001 AND status IN (1, 2) AND created_at >= ...  -- status 是范围/多值，created_at 只能靠 ICP 过滤
```

范围之后的列为什么失效：`status IN (1,2)` 之后，`created_at` 在两个区间里各自有序但整体无序，无法继续二分。但它可以参与 **ICP（索引条件下推）**，在索引层就过滤掉不需要回表的行，省 IO 不省比较次数。

`ORDER BY` 同样吃最左前缀：

```sql
-- 有 idx_customer_created (customer_id, created_at)
ORDER BY created_at DESC                          -- 无法用索引排序 → filesort
WHERE customer_id = 1001 ORDER BY created_at DESC -- 能：等值列固定后，第二列天然有序
WHERE customer_id > 1001 ORDER BY created_at      -- 不等列做范围，排序只能 filesort
```

## 3.5 索引失效的常见写法

这是最值钱的一节：每一条都在真实故障单里出现过。

```sql
-- 错写法 1：对列做函数或运算
WHERE DATE(created_at) = '2026-03-01'
WHERE total_amount / 100 > 50
-- 正确写法：把运算移到常量一侧，让列"裸着"
WHERE created_at >= '2026-03-01' AND created_at < '2026-03-02'
WHERE total_amount > 5000

-- 错写法 2：隐式类型转换（列是字符串，条件给数字）
WHERE mobile = 13800001111          -- mobile 是 CHAR(11)，字符串列 = 数字 → 整列转数字比较
-- 正确写法
WHERE mobile = '13800001111'
-- 同理，JOIN 两表的关联列类型/字符集不一致也会失效：customers.customer_id 是 BIGINT，
-- orders.customer_id 就必须也是 BIGINT UNSIGNED

-- 错写法 3：前导通配的模糊查询
WHERE username LIKE '%shop%'        -- 无法定位起点
-- 正确写法：前缀匹配交给索引，后缀匹配考虑倒序冗余列或全文索引
WHERE username LIKE 'shop%'

-- 错写法 4：OR 里混入非索引列
WHERE customer_id = 1001 OR remark = '加急'
-- 正确写法：拆成两条走索引的查询再 UNION，或给 remark 建索引

-- 错写法 5：字符串比较用不同排序规则
WHERE name COLLATE utf8mb4_bin = 'ABC'   -- 显式改排序规则会使原索引不可用
```

:::caution[`NOT IN`、`<>` 不是"绝对不走索引"]
"否定条件不走索引"是简化后的传言。真实规则是**选择性**：满足 `status <> 3` 的行占 95% 时，走索引反而更慢，优化器按统计信息选全表扫描；占比 1% 时索引照样能用。判断请交给 `EXPLAIN`，别靠口诀。
:::

## 3.6 前缀索引与其他形态

长字符串列（`email`、`url`）不能整列索引，用前缀：

```sql
-- 先量化区分度，选最短的够用前缀
SELECT
  COUNT(DISTINCT email) / COUNT(*)                       AS full_ratio,
  COUNT(DISTINCT LEFT(email, 8)) / COUNT(*)              AS p8,
  COUNT(DISTINCT LEFT(email, 12)) / COUNT(*)             AS p12
FROM customers;

ALTER TABLE customers ADD KEY idx_email_prefix (email(12));
```

前缀索引的三条限制：区分度达不到全列就不能唯一约束；无法用于覆盖索引（索引里没有完整值，必然回表）；`ORDER BY email` 仍需排序。

其他形态：

```sql
-- 函数索引（8.0.13+）：给表达式建索引，本质是隐藏的生成列
ALTER TABLE orders ADD KEY idx_date_created ((DATE(created_at)));

-- 降序索引（8.0+）：让 ORDER BY ... DESC 也吃索引方向
ALTER TABLE orders ADD KEY idx_c_desc (customer_id ASC, created_at DESC);

-- 全文索引：中文需要 ngram 解析器
ALTER TABLE products ADD FULLTEXT INDEX ft_title (title) WITH PARSER ngram;
```

:::tip[唯一索引 vs 普通索引]
唯一索引不只是约束：优化器知道"最多一行"，命中即可停止扫描（普通索引要继续向右找边界）。代价是写入要检查冲突、并持有间隙锁（第 7 章）。业务上真唯一的列（`order_no`、`mobile`）就建唯一索引，不要偷懒建普通索引后靠代码判重。
:::

## 3.7 综合练习：为三个查询设计索引

给定电商四表上这三条高频 SQL：

```sql
-- Q1 商品列表页：按类目筛选、按销量与价格排序
SELECT product_id, title, price, sales
FROM products
WHERE category_id = 205 AND status = 1
ORDER BY sales DESC, price ASC
LIMIT 20;

-- Q2 后台对账：时间段 + 支付方式统计
SELECT pay_method, COUNT(*) AS cnt, SUM(total_amount) AS amt
FROM orders
WHERE created_at >= '2026-03-01' AND created_at < '2026-04-01'
GROUP BY pay_method;

-- Q3 订单详情：按订单号查明细
SELECT product_id, quantity, unit_price
FROM order_items
WHERE order_id = 88991;
```

参考答案与理由：

```sql
-- Q1：等值列在前，排序列紧随其后，方向要与 ORDER BY 一致
ALTER TABLE products ADD KEY idx_cat_status_sales_price (category_id, status, sales DESC, price ASC);

-- Q2：时间范围放首列；pay_method 与统计列可考虑加进去减少回表
ALTER TABLE orders ADD KEY idx_created_pay (created_at, pay_method, total_amount);

-- Q3：order_items 上本就该有以 order_id 打头的索引
ALTER TABLE order_items ADD KEY idx_order_product (order_id, product_id);
```

设计口诀：`等值 → 排序/分组 → 范围 → 要覆盖的列`。写完逐条验证：

```sql
EXPLAIN SELECT ... ;   -- 看 key 是否命中、key 是否为 NULL、Extra 有无 Using filesort
SHOW INDEX FROM products;   -- 检查是否新增了冗余索引（(a) 已存在时 (a, b) 才谈得上补充）
```

顺带清理冗余：如果已有 `idx_a (a)` 和 `idx_ab (a, b)`，前者通常可以删掉，`SHOW INDEX` 里的 `Cardinality` 与第 4 章的 `sys.schema_unused_indexes` 能帮你找出没人用的索引。

## 本章小结

- B+ 树矮（2~3 层装千万行）、叶子成双向链表，天生适合范围扫描与排序，这是 InnoDB 选它的原因
- 聚簇索引的叶子存整行、二级索引的叶子存主键值；不在索引里的列都要回表，收紧 SELECT 列可换取覆盖索引
- 联合索引按"等值 → 排序 → 范围"排列，使用必须命中最左前缀；范围列之后的列只能靠 ICP 过滤
- 索引失效四大元凶：列上套函数、隐式类型转换、前导通配 LIKE、排序规则不一致；判断请以 `EXPLAIN` 为准
