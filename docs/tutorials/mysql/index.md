---
title: MySQL 教程
---

# MySQL 教程

> 状态：可学习 · 共 10 章 · 预计 9 小时

MySQL 是互联网后端使用最广的关系型数据库。本教程不重复讲 SQL 语法，而是直接进入 MySQL（InnoDB）自己的机制：体系结构与日志、索引与 B+ 树、执行计划与优化、事务与 MVCC、锁与死锁、主从复制、高可用与备份，最后用一个千万级订单库把全流程走一遍。

## 前置教程

- [SQL 基础教程](/tutorials/sql/)：SELECT / JOIN / 聚合 / 子查询语法，以及本系列沿用的电商四表 `customers`、`orders`、`order_items`、`products`

## 章节目录

1. [第 1 章 · 安装与体系结构](./01-architecture)
2. [第 2 章 · 数据类型与表设计](./02-data-types-schema)
3. [第 3 章 · 索引与 B+ 树](./03-index)
4. [第 4 章 · 执行计划与查询优化](./04-explain-optimization)
5. [第 5 章 · 事务与 ACID](./05-transactions)
6. [第 6 章 · 隔离级别与 MVCC](./06-isolation-mvcc)
7. [第 7 章 · 锁与死锁](./07-locks-deadlock)
8. [第 8 章 · 主从复制与读写分离](./08-replication)
9. [第 9 章 · 高可用与备份恢复](./09-high-availability)
10. [第 10 章 · 综合实战：一个订单库的优化全过程](./10-project)

## 你将学到

- 拆清 MySQL 的连接层、Server 层与存储引擎，说得出 binlog、redo log、undo log 各自的位置与职责
- 用 `DECIMAL`、`utf8mb4`、自增主键等做出可长期演进的表结构，避开类型与字符集的经典坑
- 按 B+ 树的规则设计联合索引，识别回表、覆盖索引与索引失效的写法
- 用 `EXPLAIN`、慢查询日志定位瓶颈，改造深分页、文件排序与大表 DDL
- 掌握事务边界、隔离级别与 MVCC 快照读/当前读，理解不可重复读与幻读在 MySQL 的真实表现
- 排查锁等待与死锁，搭建主从复制与读写分离，完成备份恢复与综合优化实战
