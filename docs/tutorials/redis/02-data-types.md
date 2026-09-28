---
title: 五大数据类型实战
---

# 第 2 章 · 五大数据类型实战

**本章目标：**

- 五种类型各自的建模能力与典型命令能熟练写出
- 会用 `OBJECT ENCODING` / `MEMORY USAGE` 判断底层结构与真实内存
- 建立「先想访问模式，再选类型」的决策顺序

## 2.1 String：计数、开关与整对象缓存

String 是唯一「value 就是裸字节」的类型，上限 512 MB，但真正用它时应当远小于这个数。

```text
127.0.0.1:6379> SET page:views:2026-09-01 0
OK
127.0.0.1:6379> INCR page:views:2026-09-01
(integer) 1
127.0.0.1:6379> INCRBY page:views:2026-09-01 99
(integer) 100
127.0.0.1:6379> GET page:views:2026-09-01
"100"
127.0.0.1:6379> SET lock:job:sync SOMEOWNER NX EX 30
OK
127.0.0.1:6379> SET lock:job:sync OTHER NX EX 30
(nil)
```

`INCR` 的**原子性来自单线程串行执行**，这是 Redis 做计数器最省心的地方——不需要任何锁。

SET 的扩展参数取代了老命令：

```bash
redis-cli SET key val EX 60        # 写入同时设 60 秒过期（PX 为毫秒，EXAT 为 Unix 秒时间戳）
redis-cli SET key val NX           # 只在不存在时写（取代已废弃的 SETNX）
redis-cli SET key val XX           # 只在已存在时写
redis-cli SET key val GET          # 返回旧值，旧值不存在则报错
redis-cli GETDEL key               # 取值并删除，原子（6.2+）
redis-cli GETEX key EX 60          # 取值同时刷新过期（6.2+）
```

小对象可以直接序列化成 JSON 存进 String：

```bash
redis-cli SET "user:1001:profile" '{"nickname":"阿柚","level":5}' EX 3600
redis-cli GET "user:1001:profile"
```

代价是**改一个字段必须整体读改写**，并发下会互相覆盖——这正是下一节 Hash 存在的理由。

## 2.2 Hash：字段级读写的对象

```text
127.0.0.1:6379> HSET user:1001 nickname 阿柚 level 5 points 1200
(integer) 3
127.0.0.1:6379> HGET user:1001 level
"5"
127.0.0.1:6379> HINCRBY user:1001 points 30
(integer) 1230
127.0.0.1:6379> HGETALL user:1001
1) "nickname"
2) "阿柚"
3) "level"
4) "5"
5) "points"
6) "1230"
127.0.0.1:6379> HLEN user:1001
(integer) 3
127.0.0.1:6379> HEXISTS user:1001 nickname
(integer) 1
127.0.0.1:6379> HDEL user:1001 points
(integer) 1
```

字段级 `HSET`/`HGET` 天然避免读改写竞态，是「一个实体若干属性」的标准建模方式。

::: warning `HGETALL` 与 `KEYS` 一样是无底洞
字段数上千时 `HGETALL` 一次返回全部数据，既占带宽也拉长主线程。只取需要字段用 `HMGET key f1 f2 f3`；需要遍历用 `HSCAN key cursor COUNT 100`（第 3 章讲 `SCAN` 家族）。
:::

## 2.3 List：队列、动态与「最新 N 条」

```text
127.0.0.1:6379> LPUSH feed:hot 视频A 视频B 视频C
(integer) 3
127.0.0.1:6379> LRANGE feed:hot 0 -1
1) "视频C"
2) "视频B"
3) "视频A"
127.0.0.1:6379> LTRIM feed:hot 0 99
(integer) 0
127.0.0.1:6379> RPOP feed:hot
"视频A"
127.0.0.1:6379> LLEN feed:hot
(integer) 2
```

`LTRIM` 是「只保留最新 N 条」的核心：每次 `LPUSH` 之后紧跟一次 `LTRIM key 0 99`，容量恒定，不会无界增长。

```bash
redis-cli LPUSH queue:email '{"to":"a@x.com"}'   # 生产：左进
redis-cli BRPOP queue:email 30                   # 消费：右出，最多阻塞 30 秒（超时返回 nil）
redis-cli LMOVE src dst LEFT RIGHT               # 原子搬运（6.2+，取代 RPOPLPUSH 写法）
redis-cli LPOP mylist 3                          # 一次弹多个（6.2+）
```

::: tip `BLPOP` 的超时单位是秒
`BRPOP key 0` 表示**永久阻塞**（6.0 起允许 0）， worker 池里最常用；轮询式 `LLEN` + `RPOP` 组合则会白白消耗 QPS，看到这种写法就该换成阻塞弹出。
:::

## 2.4 Set：去重与集合运算

```text
127.0.0.1:6379> SADD tag:redis 缓存 内存 KV
(integer) 3
127.0.0.1:6379> SADD tag:redis 缓存
(integer) 0
127.0.0.1:6379> SMEMBERS tag:redis
1) "缓存"
2) "内存"
3) "KV"
127.0.0.1:6379> SISMEMBER tag:redis 内存
(integer) 1
127.0.0.1:6379> SADD user:liked 1001 1002 1003
(integer) 3
127.0.0.1:6379> SADD user:liked:friend 1002 1005
(integer) 2
127.0.0.1:6379> SINTER user:liked user:liked:friend
1) "1002"
127.0.0.1:6379> SDIFF user:liked user:liked:friend
1) "1001"
2) "1003"
```

交集「共同喜欢」、差集「我朋友还没看过」、并集「候选池合并」——这三步在 SQL 里是三张表的 JOIN，在 Redis 里是三条命令。Set 元素**无序**，需要顺序就换 ZSet。

结果集很大时不要把它拉回客户端，用 `STORE` 系列原地落盘：`SINTERSTORE dest s1 s2`；只想要数量用 `SCARD`，7.0+ 有 `SINTERCARD 2 s1 s2 LIMIT 100`。

## 2.5 ZSet：排行榜与延迟队列

有序集合每个元素挂一个 `score`（双精度浮点），元素唯一，按 score 再按字典序排序。

```text
127.0.0.1:6379> ZADD rank:weekly 1500 阿柚 2200 小舟 900 老陈
(integer) 3
127.0.0.1:6379> ZINCRBY rank:weekly 300 阿柚
"1800"
127.0.0.1:6379> ZREVRANGE rank:weekly 0 2 WITHSCORES
1) "小舟"
2) "2200"
3) "阿柚"
4) "1800"
5) "老陈"
6) "900"
127.0.0.1:6379> ZREVRANK rank:weekly 阿柚
(integer) 1
127.0.0.1:6379> ZCOUNT rank:weekly 1000 +inf
(integer) 2
127.0.0.1:6379> ZRANGEBYSCORE rank:weekly 1000 2000 LIMIT 0 10
1) "阿柚"
```

`ZREVRANK` 给出「你排第几名」，`ZCOUNT` 给出「你超过了多少人」，`ZADD GT`（只在分数变大时更新）可以做「只刷最高分」的榜单。score 换成 `时间戳` 时，ZSet 就变成延迟队列（第 6 章细讲），轮询 `ZRANGEBYSCORE key 0 now LIMIT 0 100` 取出到期任务。

## 2.6 底层编码与选错类型的代价

同一个类型可能对应多种内存布局，用小数据量测试时看到的形态会骗人：

```text
127.0.0.1:6379> SET s 42
OK
127.0.0.1:6379> OBJECT ENCODING s
"int"
127.0.0.1:6379> SET s "hello world, this is a longer payload"
OK
127.0.0.1:6379> OBJECT ENCODING s
"raw"
127.0.0.1:6379> HSET h a 1 b 2
(integer) 2
127.0.0.1:6379> OBJECT ENCODING h
"listpack"
127.0.0.1:6379> MEMORY USAGE h
(integer) 144
```

编码切换由这些 `redis.conf` 项决定（默认值以 `CONFIG GET hash-max-listpack-entries` 之类命令实测为准）：

```text
hash-max-listpack-entries 128      # Hash 超过条目数 → hashtable
hash-max-listpack-value 64         # 字段或值超过字节数 → hashtable
set-max-intset-entries 512         # 纯整数 Set → 超阈值 hashtable
zset-max-listpack-entries 128      # ZSet → skiplist
zset-max-listpack-value 64
```

::: warning 反例：把排行榜存成 String
`SET rank:weekly '{"阿柚":1800,"小舟":2200}'`，每次加分都要 GET→解析→改→SET。后果：并发加分互相丢分（读改写非原子）、无法问「第一名是谁」「阿柚第几名」，只能全量拉回内存自己排序，一万人榜单直接把带宽打满。

**正例**：`ZADD rank:weekly score member` + `ZINCRBY` 增量更新，取名次用 `ZREVRANK`，取 TopN 用 `ZREVRANGE ... 0 9 WITHSCORES`。O(log N)，且每条命令都是原子的。
:::

::: danger 反例：一个大 Hash 装全站配置
`HSET config:all <三万个字段>` 变成典型的**大 key**：编码早早从 listpack 退化、`HGETALL` 一次吐出几十 MB、`UNLINK` 删除时阻塞主线程。正确做法是按模块拆分多个小 Hash（`config:pay`、`config:search`），详见 [第 3 章 · key 设计与过期淘汰](./03-keys-expiry)。
:::

选类型的口诀：**按访问模式选，不按数据长相选**。

```text
整读整写一个值        → String
按字段读写一个实体     → Hash
要顺序 / 最新 N 条     → List
要去重 / 集合交并差    → Set
要按分数排序 / 排名    → ZSet
```

## 2.7 综合练习：五种类型建模一篇文章

需求：一篇文章要有浏览量、点赞用户集合、标签、置顶时间、以及「最新 20 篇」列表。

```bash
# 1) 正文与浏览量：String 计数 + Hash 存字段
redis-cli HSET article:77 title "Redis 类型怎么选" author "阿柚" status published
redis-cli HINCRBY article:77 views 1

# 2) 点赞：Set 天然去重，SISMEMBER 判断是否已赞
redis-cli SADD article:77:liked 1001 1002 1003
redis-cli SISMEMBER article:77:liked 1002
redis-cli SCARD article:77:liked

# 3) 标签 → 文章的倒排索引（一个 Set 装该标签下所有文章 ID）
redis-cli SADD tag:redis 77 78 90

# 4) 最新列表：ZSet 用时间戳当 score，随时可按时间窗口取
redis-cli ZADD feed:new $(date +%s) 77
redis-cli ZREVRANGE feed:new 0 19 WITHSCORES

# 5) 简单队列版最新列表 + 定长裁剪
redis-cli LPUSH feed:simple 77
redis-cli LTRIM feed:simple 0 19

# 6) 「共同点赞」推荐：交集
redis-cli SINTER article:77:liked article:88:liked
```

自查三问：

1. `OBJECT ENCODING article:77` 现在是什么？再 `HSET` 130 个字段后变成什么？
2. `MEMORY USAGE article:77` 的数值随字段增长的曲线，在编码切换点是否出现跳变？
3. 点赞数需要「今天/本周/总计」三个粒度时，key 应该怎么命名（提示：`article:77:liked:2026-09-01`，第 3 章的命名规范）？

## 本章小结

- String 负责计数与整块缓存，`SET ... NX EX` 一步完成加锁与过期，别再拆开写
- Hash 提供字段级读写，避开读改写竞态；`HGETALL` 只用于小对象
- List 管顺序与最新 N 条，`LPUSH` + `LTRIM` 组合控容量，消费侧换 `BRPOP`/`LMOVE`
- Set 去重与交并差、ZSet 排名与延迟队列——选类型永远先问访问模式，再看 `OBJECT ENCODING` 的真实代价
