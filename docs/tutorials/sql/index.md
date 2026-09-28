---
title: SQL 基础教程
---

# SQL 基础教程

> 状态：可学习 · 共 8 章 · 预计 6 小时

SQL 是数据库世界的通用语言，也是后端、数据、测试岗位的共同底座。本教程从关系模型讲起，用一套「电商：customers / orders / order_items / products」样例库贯穿 8 章，走完单表查询、过滤排序分页、聚合分组、多表连接、子查询与 CTE，最后落到数据修改、约束与事务。凡是 MySQL 8、PostgreSQL、SQLite 有分歧的地方都会就地标注，让你学的是标准，用的是方言。

## 前置教程

- [VS Code 教程](/tutorials/vscode/)：编辑器与数据库扩展配置
- [Git 教程](/tutorials/git/)：把 `schema.sql` 与查询脚本纳入版本管理

## 章节目录

1. [第 1 章 · 关系模型与 SQL 方言](./01-relational-model)
2. [第 2 章 · 环境与客户端](./02-environment)
3. [第 3 章 · 查询基础](./03-select-basics)
4. [第 4 章 · 过滤、排序与分页](./04-filter-sort-page)
5. [第 5 章 · 聚合与分组](./05-aggregate-group)
6. [第 6 章 · 多表连接](./06-joins)
7. [第 7 章 · 子查询与 CTE](./07-subquery-cte)
8. [第 8 章 · 数据修改与约束](./08-dml-ddl)

## 你将学到

- 表、行、列、主键、外键的关系模型思维，以及 SQL 标准与三大方言的边界在哪
- 单表查询全套：列与别名、`DISTINCT`、条件过滤、`NULL` 与三值逻辑、多列排序与分页
- 聚合与分组：`COUNT`/`SUM`/`AVG` 怎么处理 `NULL`，`WHERE` 与 `HAVING` 的分工，SQL 的真实执行顺序
- 多表连接：`INNER`/`LEFT`/`RIGHT`、MySQL 缺失的 `FULL OUTER JOIN` 替代写法、`ON` 与 `WHERE` 的区别
- 子查询与 CTE：标量子查询、`IN`/`EXISTS`、相关子查询、派生表、`WITH` 链式定义与递归 CTE
- 数据修改与约束：`INSERT`/`UPDATE`/`DELETE`、六大约束、外键级联规则与 `BEGIN`/`COMMIT`/`ROLLBACK`

## 学习建议

第 2 章建好的样例库是后面 6 章唯一的工作现场，别跳过。每章的查询都亲手跑一遍，
再改一个条件、猜一次结果、对照真实输出——猜错的地方，通常就是 `NULL` 或执行顺序在作怪。
