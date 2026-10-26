---
title: "第 1 章 · 关系模型与 SQL 方言"
description: "一张订单表用 Excel 也能存，但一到多人协作、数据量上百万、要\"按客户统计消费\"时，表格就开始崩："
series: sql
sidebar:
  order: 1
  label: "关系模型与 SQL 方言"
difficulty: beginner
duration: 6
---

**本章目标：**

- 建立"表—行—列—主键—外键"的关系模型心智图
- 分清 SQL 标准与 MySQL / PostgreSQL / SQLite 三家方言的差异
- 说清为什么要先学标准 SQL，再贴具体方言

## 1.1 从 Excel 到数据库

一张订单表用 Excel 也能存，但一到多人协作、数据量上百万、要"按客户统计消费"时，表格就开始崩：

```text
Excel 的做法（一张大宽表塞下所有信息）：
订单号 | 客户名  | 客户城市 | 商品标题       | 单价  | 数量
1001   | 张伟    | 上海     | SQL实战        | 89    | 1
1001   | 张伟    | 上海     | 机械键盘       | 399   | 1
1002   | 李娜    | 北京     | SQL实战        | 89    | 2
```

三个致命问题：

- **重复**：同一个客户名、城市在每一行重复一遍，改一次地址要找全所有行
- **异常**：删掉最后一笔订单，可能连客户本身也一起消失了
- **矛盾**：第 3 行把"张伟"的城市写成"杭州"，Excel 不会拦你

关系模型（relational model）就是为解决这三件事而设计的。

## 1.2 表、行、列：术语对齐

关系模型有一套数学术语，工程现场用的是另一套口语，两者必须同时记住：

| 数学说法 | 数据库说法 | 通俗说法 |
| --- | --- | --- |
| 关系（Relation） | 表（Table） | 一张二维表 |
| 元组（Tuple） | 行（Row）/ 记录 | 一条数据 |
| 属性（Attribute） | 列（Column）/ 字段 | 一个特征 |
| 域（Domain） | 数据类型 | 该列允许取值的范围 |

```sql
-- customers（客户表）的一行
customer_id | name | email                | city   | joined_at | balance
----------  | ---- | -------------------- | ------ | --------- | -------
1           | 张伟 | zhangwei@example.com | 上海   | 2024-01-12| 120.00
```

:::tip[表是"集合"，不是"文件"]
行与行之间**没有顺序**，列与列之间也没有。你以为的"第一行"只是显示结果。
所以任何时候想要顺序，都必须显式写 `ORDER BY`——第 4 章会把这个坑讲透。
:::

## 1.3 关系模型的三条纪律

**① 列的值必须原子**：一个格子只能放一个值。

```sql
-- 错误：一行塞多值，无法查询"买过机械键盘的人"
nickname_tags: '张伟,数码爱好者,金牌会员'

-- 正确：拆成多列，或拆成多行的关联表
```

**② 同一张表不允许完全相同的两行**：靠主键保证（下一节）。

**③ 不依赖"位置"表达含义**：第 3 列是什么，由列名决定，不由顺序决定。生产代码里
`SELECT *` 之后再按位置取列，一旦有人加列就全线错位。

## 1.4 主键：一行的身份证

**主键（Primary Key）**是唯一标识一行的列（或列组合），两条硬规则：非空、不重复。

```sql
CREATE TABLE customers (
  customer_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY   -- 主键
);
```

设计主键的常见三种选择：

```text
自然键   用业务里本来就唯一的列，如手机号、身份证号
代理键   与业务无关的自增整数，如 customer_id
业务复合键  order_items 用 (order_id, product_id) 两列联合唯一
```

:::caution[别拿业务字段当主键]
手机号会换、邮箱会被用户改、身份证号也有修正的时候。主键一旦确定就不该变，
所以工程上更推荐**代理键**（自增整数或 UUID），业务字段只做唯一约束。
:::

## 1.5 外键：关系从哪里来

"关系模型"里的**关系**（relation），落到物理层就是**外键引用**：一列指向另一张表的主键。

```sql
CREATE TABLE orders (
  order_id    INT     NOT NULL AUTO_INCREMENT PRIMARY KEY,
  customer_id INT     NOT NULL,                    -- 外键列
  created_at  DATE    NOT NULL,
  CONSTRAINT fk_orders_customer                    -- 约束起名字，报错才认得出
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
```

外键换来三样东西：

- **插入检查**：`customer_id = 999` 的客户不存在，数据库直接拒绝
- **删除保护**：还有订单的客户删不掉（除非声明级联，第 8 章）
- **可读的连接**：`ON orders.customer_id = customers.customer_id` 是数据库自己知道的事实，不靠口头约定

```text
customers 1 ──── N orders 1 ──── N order_items N ──── 1 products

读法：一个客户有多笔订单；一笔订单有多条明细；一条明细指向一个商品
```

第 2 章就会把这四张表建成真表。

## 1.6 SQL 标准与三种方言

SQL 是标准（ISO/IEC 9075），但**没有一家数据库完整实现它**。三家主流方言：

| 维度 | MySQL 8 | PostgreSQL 16 | SQLite 3 |
| --- | --- | --- | --- |
| 定位 | Web 应用最流行 | 功能最全的开源企业库 | 单文件嵌入式，手机/App 内置 |
| 引用标识符 | 反引号 | 双引号 | 双引号或反引号 |
| 字符串拼接 | `CONCAT(a, b)` | `a || b` | `a || b` |
| 分页写法 | `LIMIT 10 OFFSET 20` | `LIMIT 10 OFFSET 20` | 同 MySQL |
| 标准分页写法 | `FETCH FIRST 10 ROWS ONLY`（8.0 支持但不完整） | 支持 | 支持 |
| CTE（`WITH`） | 8.0 起支持 | 早于 8.0 即支持 | 3.8.3 起支持 |
| 窗口函数 | 8.0 起支持 | 支持 | 3.25 起支持 |
| `FULL OUTER JOIN` | **不支持**，要手写替代 | 支持 | 3.39 起支持 |
| `CHECK` 约束 | 8.0.16 起真正生效 | 生效 | 生效 |
| 布尔类型 | 没有真 BOOLEAN，用 `TINYINT` | 有原生 `BOOLEAN` | 无，用 0/1 |

三句结论：

1. **`SELECT`/`JOIN`/`GROUP BY` 这部分三家几乎一样**——这是教程的主干。
2. **日期函数是方言重灾区**：MySQL 用 `YEAR(d)`、`DATE_FORMAT(d, '%Y-%m')`，PostgreSQL 用 `EXTRACT(YEAR FROM d)`、`to_char()`，SQLite 用 `strftime('%Y', d)`。
3. **MySQL 会静默放宽标准**：类型不匹配时它偷偷转换而不报错，PostgreSQL 则严格拒绝。从标准 SQL 学起，遇到 MySQL 的宽松才会警觉。

:::caution[反引号不是"markdown 转义"]
在 MySQL 里写 `` `name` `` 是给标识符加引号，换成 PostgreSQL 就是语法错误。
本教程只在必要处（列名撞保留字）使用反引号，并注明方言。
:::

### SQL 的四类语句

SQL 不是一门"查询语言"，它按用途分成四类，缩写要记住：

| 类别 | 关键字 | 干什么 | 本教程 |
| --- | --- | --- | --- |
| DQL 查询 | `SELECT` | 读数据 | 第 3—7 章 |
| DML 操作 | `INSERT` / `UPDATE` / `DELETE` | 改数据 | 第 8 章 |
| DDL 定义 | `CREATE` / `ALTER` / `DROP` | 改结构 | 第 2、8 章 |
| DCL 控制 | `GRANT` / `REVOKE` | 改权限 | 超出范围 |

```sql
-- 四类各来一句，感受语气差别
CREATE TABLE products (product_id INT);      -- DDL：定义结构
INSERT INTO products VALUES (1);             -- DML：写入数据
SELECT product_id FROM products;             -- DQL：读取数据
-- GRANT SELECT ON products TO app_readonly;  -- DCL：授权（需 DBA 权限）
```

:::tip[事务控制（TCL）算第五类]
`BEGIN` / `COMMIT` / `ROLLBACK` 常被单列一类叫 TCL，第 8 章末尾会用到。
:::

### 同一需求的多种写法

需求："取消费最高的前 3 笔订单"。看标准写法与方言写法的差别：

```sql
-- 标准 SQL（SQL:2008）：三家都认，最推荐
SELECT order_id, total
  FROM orders
 ORDER BY total DESC
 FETCH FIRST 3 ROWS ONLY;

-- MySQL / SQLite 惯用写法
SELECT order_id, total
  FROM orders
 ORDER BY total DESC
 LIMIT 3;

-- 错误：把 LIMIT 写成 MySQL 独有的逗号形式后又忘了顺序
SELECT order_id, total FROM orders LIMIT 3 ORDER BY total DESC;
-- 解析器直接把 ORDER BY 当成语法错误（正确写法见上）
```

## 1.7 综合练习：把需求翻译成表与列

不碰数据库，先在纸上做完这五题（答案依据本章的电商模型）：

```text
① "记录客户下单时间" → orders 表的哪一列？为什么不是 customers 的列？
② "查某笔订单买了哪些商品" → 需要动到几张表？连接路径怎么走？
③ "机械键盘现在库存 15" → 这个事实属于哪张表？
④ "下单时的价格是 359，商品现价 399" → 为什么 order_items 要另存 unit_price？
⑤ "客户可以不填城市" → 这一列该允许什么值？
```

第 ④ 题值得多说一句：**事实要存在发生它的那一层**。订单明细里的 `unit_price`
是当时的价格快照，商品表的 `price` 是此刻的售价，两者语义不同，不能合并。
这条设计原则在第 6 章连接、第 8 章更新时会反复出现。

## 本章小结

- 关系模型用"表 + 主键 + 外键"消灭重复、异常与矛盾，行与列都没有顺序
- 主键推荐代理键，业务字段只做唯一约束；外键让引用关系变成数据库里的硬事实
- 三家方言的查询主干几乎一致，差异集中在标识符引号、日期函数、分页与高级特性
- CTE、窗口函数在 MySQL 需要 8.0+，`FULL OUTER JOIN` 是 MySQL 的空白区
