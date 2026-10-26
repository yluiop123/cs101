---
title: "第 6 章 · 发布订阅与 Stream"
description: "127.0.0.1:6379> SUBSCRIBE order:paid"
series: redis
sidebar:
  order: 6
  label: "发布订阅与 Stream"
difficulty: intermediate
duration: 6
---

**本章目标：**

- 分清 Pub/Sub 与 Stream 的语义差别，知道各自能承担什么、不能承担什么
- 会用 `XADD`/`XREADGROUP`/`XACK`/`XPENDING`/`XCLAIM` 搭一个可靠消费的消费者组
- 能说出 Redis 与专业消息队列的差距，并写出一个基于 ZSet 的延迟队列

## 6.1 Pub/Sub：发完即忘的广播

```text
终端 A
127.0.0.1:6379> SUBSCRIBE order:paid
Reading messages... (press Ctrl-C to quit)
1) "subscribe"
2) "order:paid"
3) (integer) 1

终端 B
127.0.0.1:6379> PUBLISH order:paid '{"id":8801,"amount":1990}'
(integer) 1
```

终端 A 随即收到：

```text
1) "message"
2) "order:paid"
3) "{\"id\":8801,\"amount\":1990}"
```

`PUBLISH` 的返回值是**当前在线订阅者数量**，不是「已入队条数」。这就是 Pub/Sub 的全部语义：模式匹配用 `PSUBSCRIBE news.*`，取消订阅 `UNSUBSCRIBE`，观测用：

```bash
redis-cli PUBSUB CHANNELS 'order:*'   # 当前有订阅者的频道
redis-cli PUBSUB NUMSUB order:paid    # 该频道订阅者数
redis-cli PUBSUB NUMPAT               # PSUBSCRIBE 的模式数
```

:::caution[Pub/Sub 的三个「没有」]
- **没有持久化**：消息只投递给此刻已连接的订阅者，没人订阅就直接蒸发，重启也找不回来。
- **没有确认**：订阅者崩溃期间发生的消息永远丢失，重连不会补发。
- **没有背压**：慢消费者导致输出缓冲区堆积，超过 `client-output-buffer-limit pubsub` 会被**直接断开连接**（默认值以 `CONFIG GET client-output-buffer-limit` 实测为准），日志里是 `Client ... output buffer limit reached`。
:::

Redis 7.0 起 Cluster 环境还有**分片 Pub/Sub**：`SPUBLISH` / `SSUBSCRIBE` / `SUNSUBSCRIBE`，消息只在承载该频道的分片内广播，避免传统 `PUBLISH` 全网泛洪。跨集群广播需求请改用普通 `PUBLISH` 或专门的总线。

## 6.2 键空间通知：让 Redis 自己喊话

订阅特殊频道，能拿到「某个 key 发生了什么事件」——缓存失效、对象存储回填、审计日志都靠它。

```bash
# 默认全部关闭（notify-keyspace-events 为空字符串），必须显式打开
redis-cli CONFIG SET notify-keyspace-events x        # x = 过期事件；A = 全部事件（代价大）
redis-cli CONFIG GET notify-keyspace-events
```

```text
127.0.0.1:6379> PSUBSCRIBE "__keyevent@0__:expired"
127.0.0.1:6379> SET tmp:job:42 payload EX 3
OK
# 3 秒后收到：message / __keyevent@0__:expired / tmp:job:42
```

两种频道形态：`__keyspace@<db>__:<key>` 的消息体是事件名，`__keyevent@<db>__:<事件名>` 的消息体是 key。开关字符是分层的：`K` 键空间、`g` 通用、`l` List、`s` Set、`h` Hash、`z` ZSet、`x` 过期、`e` keyevent、`A` 全部。

:::danger[过期通知不能当准点定时器]
第 3 章说过，删除是惰性 + 抽样双轨：key 的实际过期时刻与通知到达时刻可能差好几秒，实例阻塞或重启期间通知直接丢失。用「收到 expired 就执行补偿」的架构，缺的那次触发没人补——需要精确延时请用下面的延迟队列。
:::

## 6.3 Stream：带 ID、可回溯的消息日志

Stream 是**追加-only 的多项日志**（entries），每条消息有单调递增 ID（`毫秒-序号`），有消费者组与确认机制，这才是「Redis 版消息队列」。

```text
127.0.0.1:6379> XADD order:events * uid 1001 amount 1990
"1759321204512-0"
127.0.0.1:6379> XLEN order:events
(integer) 1
127.0.0.1:6379> XRANGE order:events - +
1) 1) "1759321204512-0"
   2) 1) "uid"
      2) "1001"
      3) "amount"
      4) "1990"
127.0.0.1:6379> XREAD COUNT 10 BLOCK 0 STREAMS order:events $
```

`XREAD` 的游标语义：给某个 ID 表示「从该 ID 之后继续读」，`$` 表示「只要新消息」，`0` 表示「从最早开始」。控制体积靠裁剪：

```bash
redis-cli XADD order:events MAXLEN ~ 100000 '*' uid 1002 amount 88
redis-cli XTRIM order:events MAXLEN ~ 100000      # ~ 表示按节点近似裁剪，效率高得多
redis-cli XINFO STREAM order:events               # length / entries-added / last-generated-id
```

:::tip[为什么要用 `~`]
不带 `~` 是**精确**裁剪到恰好 N 条，会拆散内部节点、产生大量小节点；`~` 允许略多于 N 条，按整节点丢弃，代价是内存略超上限。高吞吐流一律用 `~`，容量口径（`redis.conf`）：`stream-node-max-entries 100`、`stream-node-max-bytes 4096`。
:::

## 6.4 消费者组：认领、确认与待处理清单

```bash
# 建组：0 表示从流的第一条开始消费；$ 表示只消费新消息
redis-cli XGROUP CREATE order:events billing 0 MKSTREAM
redis-cli XGROUP CREATECONSUMER order:events billing worker-1

# 消费：> 表示未投递过的新消息；BLOCK 5000 最多阻塞 5 秒
redis-cli XREADGROUP GROUP billing worker-1 COUNT 10 BLOCK 5000 STREAMS order:events '>'

# 处理成功后确认（务必在处理完成之后再 XACK，不要拿到就确认）
redis-cli XACK order:events billing 1759321204512-0

# 观测
redis-cli XPENDING order:events billing                     # 组内未确认总数与 ID 区间
redis-cli XPENDING order:events billing IDLE 30000 - + 10   # 卡了 30 秒以上的条目
redis-cli XINFO GROUPS order:events                          # pending / last-delivered-id
redis-cli XINFO CONSUMERS order:events billing
```

崩溃的消费者留下的「已投递未确认」条目（PEL）不会自动回来，必须由其它消费者**认领**：

```bash
redis-cli XAUTOCLAIM order:events billing worker-2 30000 0 COUNT 20
# 逐个认领指定 ID
redis-cli XCLAIM order:events billing worker-2 30000 1759321204512-0
```

`XAUTOCLAIM` 的第四个参数是**最小空闲毫秒**，`0` 是扫描起点；返回的新游标要继续传入直到归 `0` 才扫完——和第 3 章 `SCAN` 的游标逻辑同构。

:::caution[反例：只用 `XREAD`，不做 `XACK`]
消费端写成 `XREAD COUNT 10 STREAMS order:events $`，看似简单，实际是「自己维护游标的广播」：任何一个消费者重启，期间未读到的消息只能靠重放全流找回；多个消费者也无法分摊，因为 Redis 不知道谁拿了哪条。

**正例**：`XGROUP CREATE` + `XREADGROUP ... >` 拿任务，处理完 `XACK`；把 `XAUTOCLAIM` 放进一个每分钟跑一次的守护协程，负责回收死掉 worker 的 PEL。
:::

## 6.5 与专业消息队列的差距

Redis 能做「够用的小流量消息」，但下面的能力它没有，别硬凑：

```text
分区与再平衡    Stream 就是一个流，没有多分区、没有消费者自动分配，扩容靠拆多个 stream key
顺序与分区键    无法「同一订单的消息保证同序」这种按 key 路由到固定分区的语义
过滤/路由       没有 topic 层级、没有基于内容的路由规则
死信队列        需自建：重试次数存进业务字段，超限就 XADD 到 order:events:dlq
精确一次        只有至少一次 + 自己幂等；重复投递是常态
消息大小        大消息直接把内存与延迟打爆，超过几十 KB 应放对象存储只传引用
事务/消息回溯   有 XREVRANGE 回溯，但没有按时间点的消费位点管理
```

选型速判：单机 QPS 万级以内、消费者 3~5 个、允许自己写幂等与重试 → Stream 可以；需要分区、需要跨服务可靠投递、需要运维化的死信与延迟级别 → 上 Kafka / RabbitMQ / RocketMQ，把 Redis 留回缓存本职。

## 6.6 延迟队列：ZSet 方案与 Stream 方案

**ZSet 方案**（最常用）：score 存「应投递的毫秒时间戳」，worker 轮询到期项，一次 Lua 取出批量并删除，保证不重复投递。

```lua
-- delay_pop.lua  KEYS[1]=延迟队列   ARGV[1]=当前毫秒  ARGV[2]=单批最多条数
local due = redis.call('ZRANGEBYSCORE', KEYS[1], 0, ARGV[1],
                       'LIMIT', 0, tonumber(ARGV[2]))
if #due == 0 then return {} end
redis.call('ZREM', KEYS[1], unpack(due))     -- 与取出原子完成，避免多 worker 抢同一任务
return due
```

```bash
# 入队：30 秒后处理「订单超时关闭」
redis-cli ZADD order:delay $(($(date +%s%3N) + 30000)) 'order-8801'
# 消费循环
SHA=$(redis-cli SCRIPT LOAD "$(cat delay_pop.lua)")
while true; do redis-cli EVALSHA "$SHA" 1 order:delay "$(date +%s%3N)" 100; sleep 0.2; done
```

任务体建议是**定长 ID**（`order-8801`），处理时再回源查数据库，避免把大 payload 塞进 score 关联成员。多 worker 时上面这段 Lua 让「取 + 删」原子化，天然互斥。

**Stream 方案**：不需要精确延时、只需要「失败后稍后再试」时，直接用 PEL 当延时表——`XPENDING IDLE <毫秒>` 找出冷却够久的条目，再 `XCLAIM` 给自己重试，重试次数超过阈值就搬进死信流。

## 6.7 综合练习：一条带重试与死信的订单流水线

需求：订单支付成功后异步发优惠券、加积分、更新 GMV，失败要重试，重复消息要幂等。

```bash
# 1) 生产者
redis-cli XADD order:paid '*' order 8801 uid 1001 amount 1990 ts "$(date +%s%3N)"

# 2) 三个独立消费者组（每组一份完整拷贝，互不影响）
redis-cli XGROUP CREATE order:paid coupon-g 0 MKSTREAM
redis-cli XGROUP CREATE order:paid point-g  0 MKSTREAM
redis-cli XGROUP CREATE order:paid gmv-g    0 MKSTREAM

# 3) 各组消费 + 确认
redis-cli XREADGROUP GROUP coupon-g w1 COUNT 5 BLOCK 3000 STREAMS order:paid '>'
redis-cli XACK order:paid coupon-g 1759321204512-0

# 4) 幂等：用消息 ID 做去重标记，重复投递直接跳过
redis-cli SET "dedup:coupon:1759321204512-0" 1 NX EX 86400

# 5) 死信：空闲超过 60 秒且重试已达 3 次的条目搬到死信流
redis-cli XPENDING order:paid coupon-g IDLE 60000 - + 20
redis-cli XADD order:paid:dlq '*' group coupon-g order 8801 reason timeout
```

**自查清单**：

- [ ] 三个组是否共享同一条流、各自的 `last-delivered-id` 是否独立推进（`XINFO GROUPS`）？
- [ ] 消费端有没有「先 `XACK` 后处理」的反向操作？崩溃时消息会不会永久丢失？
- [ ] 幂等 key 是否带了业务动作名（`dedup:coupon:` 而不是 `dedup:`），避免互相污染？
- [ ] 流是否有裁剪策略（`MAXLEN ~`），还是任由 `entries-added` 无限增长？
- [ ] `XREADGROUP ... BLOCK` 的连接是否被 worker 独占；连接池里做阻塞读会不会饿死其它命令？
- [ ] Pub/Sub 是否被误用成了业务消息通道（重启即丢）？

## 本章小结

- Pub/Sub 是「在线广播」：不落盘、不确认、不背压，只适合在线通知与实时推送
- 键空间通知默认全关，靠 `notify-keyspace-events` 打开；过期事件有延迟，不能当定时器
- Stream 用消息 ID、消费者组、PEL 与 `XACK`/`XAUTOCLAIM` 实现了至少一次投递，是 Redis 里唯一像样的队列
- 需要分区、路由、精确一次时换专业 MQ；Redis 侧的延迟队列用 ZSet + 一段原子 Lua 最稳
