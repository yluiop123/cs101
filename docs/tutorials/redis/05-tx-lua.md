---
title: 事务与 Lua 脚本
---

# 第 5 章 · 事务与 Lua 脚本

**本章目标：**

- 说清 `MULTI`/`EXEC` 到底保证了什么、没保证什么
- 用 `WATCH` 写一次乐观锁重试，并知道它的三个失效条件
- 用 Lua 脚本实现一个限流器和一段不会超卖的库存扣减

## 5.1 `MULTI`/`EXEC`/`DISCARD`：先攒命令，再一次性执行

事务的作用是**把多条命令打包，中间不插入其他客户端的命令**（原子性执行），不是「数据库事务」的那套语义。

```text
127.0.0.1:6379> SET stock:a 10
OK
127.0.0.1:6379> SET sold:a 0
OK
127.0.0.1:6379> MULTI
OK
127.0.0.1:6379> DECR stock:a
QUEUED
127.0.0.1:6379> INCR sold:a
QUEUED
127.0.0.1:6379> EXEC
1) (integer) 9
2) (integer) 1
```

`MULTI` 之后的命令**不立即执行**，只回 `QUEUED` 入队；`EXEC` 才顺序跑完并一次性返回结果数组。`DISCARD` 清空队列并解除所有 `WATCH`。想脚本化测试可以用 `printf 'MULTI\r\nDECR stock:a\r\nINCR sold:a\r\nEXEC\r\n' | redis-cli`，配合 `redis-cli -r 30 -i 1 GET stock:a`（重复 30 次、间隔 1 秒）轮询观察。

::: warning 事务里不能出现这些
- **`EXEC` 之前不能读**：入队阶段拿不到返回值，只有 `QUEUED`。「先读再判断」的逻辑在 `MULTI` 里写不出来，必须换成 Lua。
- **阻塞命令不阻塞**：`BLPOP`/`BRPOP` 放进 `MULTI` 不会真正等待，别把队列消费写进事务。
- **Cluster 下 key 必须同槽**：跨槽直接 `CROSSSLOT Keys in request don't hash to the same slot`（第 7 章讲 `{}` 哈希标签）。
:::

## 5.2 事务为什么没有回滚

Redis 把错误分成两类，处理完全不同：

```text
入队时错误（语法错、命令名不存在）→ 整个事务被拒绝，EXEC 报 EXECABORT，一条都不执行
执行时错误（类型不对、参数越界）    → 只跳过这一条，其余命令照常执行，不回滚
```

```text
127.0.0.1:6379> SET mykey hello
OK
127.0.0.1:6379> MULTI
OK
127.0.0.1:6379> LPUSH mykey a
QUEUED
127.0.0.1:6379> INCR mykey2
QUEUED
127.0.0.1:6379> EXEC
1) (error) WRONGTYPE Operation against a key holding the wrong kind of value
2) (integer) 1
```

第 1 条因为 `mykey` 是 String 而失败，第 2 条 `INCR` 依然生效——**没有任何回滚发生**。

这是刻意的设计取舍。要 ACID 的回滚就得引入撤销日志与状态机，与「单线程、极简、够快」的定位冲突，Redis 作者多次明确拒绝。工程结论很直接：

::: danger 反例：把 `MULTI` 当「要么全成要么全不做」
转账写成 `MULTI` + `DECR from` + `INCR to`，`from` 因余额不足（`DECR` 不会失败，但类型错误会）执行失败，`to` 却加成功——凭空造钱。

**正例**：涉及「先判断再改」的一致性问题一律用 Lua 脚本（5.4 节），判断与写入在同一段不可分割的执行里完成；真正需要强一致的账务写入数据库。
:::

## 5.3 `WATCH`：乐观锁与重试

`WATCH` 让客户端实现「读-改-写」的 CAS：监视的 key 在 `EXEC` 之前被别的连接改过，本次事务**放弃执行**，`EXEC` 返回 `nil`（Redis 4.0+ 是含 `null` 元素，客户端要判两种形状）。

```text
127.0.0.1:6379> WATCH stock:a
OK
127.0.0.1:6379> GET stock:a
"10"
127.0.0.1:6379> MULTI
OK
127.0.0.1:6379> DECR stock:a
QUEUED
127.0.0.1:6379> EXEC
(nil)
```

上面这条 `EXEC` 返回 `nil`，说明另一个客户端在 `WATCH` 之后改了 `stock:a`。重试逻辑由客户端写：

```python
import redis
r = redis.Redis()

def decr_with_cas(key, retries=5):
    for _ in range(retries):
        pipe = r.pipeline()
        try:
            pipe.watch(key)                       # 监视：此后该 key 被改动就放弃本次事务
            current = int(pipe.get(key) or 0)
            if current <= 0:
                pipe.unwatch(); return False
            pipe.multi()                          # watch 之后才能进入事务模式
            pipe.decr(key)
            pipe.execute()                        # 返回 None 表示 CAS 失败，需要重试
            return True
        except redis.WatchError:
            continue
        finally:
            pipe.reset()                          # 归还连接到池，避免残留监视
    raise RuntimeError("CAS 重试次数用尽")
```

`WATCH` 的三个坑：

- 必须在**同一连接**上完成 `WATCH → 读 → MULTI → EXEC`，连接池里换连接等于没监视。
- `EXEC` 或 `DISCARD` 之后监视自动解除；不调 `EXEC`/`DISCARD` 就让连接回池，会长期占用监视内存。
- 高并发热点下重试风暴比 Lua 更贵——CAS 竞争激烈时优先换脚本。

## 5.4 Lua 脚本：一次网络往返换一段原子逻辑

脚本在服务端**整体执行，中途不会被其他客户端命令打断**，因此「判断 + 修改」天然原子，还省掉多次往返。

```bash
# 直接执行：EVAL 脚本 键个数 key [key ...] arg [arg ...]
redis-cli EVAL "return redis.call('GET', KEYS[1])" 1 stock:a

# 推荐：脚本长就先加载，拿到 SHA 后只传哈希，省带宽也便于复用
redis-cli SCRIPT LOAD "return redis.call('INCR', KEYS[1])"
# → "5b99924e792f4fbf7f4f5a2b4f4b3b4e1a1f0c3d"（示例值，实际由脚本内容决定）
redis-cli EVALSHA 5b99924e792f4fbf7f4f5a2b4f4b3b4e1a1f0c3d 1 counter:hits
redis-cli SCRIPT FLUSH SYNC        # 清缓存：SYNC 参数表示主从同步清除
```

`EVALSHA` 命中缓存返回结果，实例重启或 `SCRIPT FLUSH` 后返回 `NOSCRIPT`，客户端的标准处理是**捕获 `NOSCRIPT` → 重新 `SCRIPT LOAD` → 重试一次**。Redis 7 的 `FUNCTION LOAD` / `FCALL` 是脚本的进化版：注册成有名字的库、随 RDB/AOF 持久化、不再需要客户端维护 SHA，本教程的脚本逻辑原样搬进去就能用。

## 5.5 Lua 编写约束

脚本运行在一个受限的 Lua 5.1 沙箱里，六条硬约束：

```text
1  只能用 redis.call / redis.pcall；禁止 open、网络、全局变量、pcall/xpcall
2  必须声明式使用 KEYS 与 ARGV：Cluster 靠 KEYS 做槽路由，把 key 拼进脚本正文是错误做法
3  数字要显式 tonumber(ARGV[1])，ARGV 取出来永远是字符串
4  长循环要自己收敛：超过 lua-time-limit（默认 5000 毫秒）后实例对其它命令回 -BUSY，只能 SCRIPT KILL 或 SHUTDOWN NOSAVE
5  只读脚本可用 SCRIPT KILL；一旦写过数据，SCRIPT KILL 无效，只能等它跑完
6  返回值要精简：返回一个几 MB 的表等于把网络当成管道，能返回状态码就别返回全量
```

```bash
redis-cli CONFIG GET lua-time-limit       # 默认值以本条命令实测为准
redis-cli INFO memory | grep number_of_cached_scripts
```

::: warning 反例：脚本里写死 100 万次循环
```lua
local sum = 0
for i = 1, 1000000 do sum = sum + redis.call('TTL', KEYS[1]) end
return sum
```
主线程被独占，实例上所有请求超时，且脚本已经调用了 `TTL`（只读），若中途改成写命令就 **无法 `SCRIPT KILL`**，只能重启实例。

**正例**：脚本只做「读少量 + 判一下 + 写少量」，批量遍历交给客户端的 `SCAN` 循环（第 3 章），一次处理一批并把总预算控制在毫秒级。
:::

## 5.6 实战一：滑动窗口限流器

用 ZSet 存每次请求的时间戳：先清窗口外的旧记录，再数窗口内的请求数。整段必须原子，否则并发下会「数完再加」突破限额。

```lua
-- ratelimit.lua   KEYS[1]=限流桶   ARGV: 窗口毫秒, 上限, 当前毫秒, 唯一请求号
local bucket = KEYS[1]
local window = tonumber(ARGV[1])
local limit  = tonumber(ARGV[2])
local now    = tonumber(ARGV[3])
local member = ARGV[4]
redis.call('ZREMRANGEBYSCORE', bucket, 0, now - window)
local used = redis.call('ZCARD', bucket)
if used >= limit then
  local oldest = redis.call('ZRANGE', bucket, 0, 0, 'WITHSCORES')
  local wait = window
  if oldest[2] then wait = tonumber(oldest[2]) + window - now end
  if wait < 0 then wait = 0 end
  return { 0, wait }                       -- 拒绝 + 建议等待毫秒
end
redis.call('ZADD', bucket, now, member)
redis.call('PEXPIRE', bucket, window)      -- 空闲桶自动回收
return { 1, limit - used - 1 }             -- 放行 + 剩余配额
```

```bash
redis-cli SCRIPT LOAD "$(cat ratelimit.lua)"      # 记下返回的 SHA
redis-cli EVALSHA "$SHA" 1 rl:api:uid:1001 1000 5 "$(date +%s%3N)" req-1
# 返回形如：1) "1"  2) "3"（放行，还剩 3 个配额）
```

唯一请求号必须由客户端生成（`uuid`、`时间戳+连接序号`）：ZSet 成员要求唯一，若用 `now` 当 member，同一毫秒的并发请求会被合并成一条，限流形同虚设。

::: tip 更便宜的两个变体
**固定窗口**只需 `INCR key` 加首次写入时的 `PEXPIRE`，代价是窗口边界可放过两倍流量；**令牌桶**把 ZSet 换成 `tokens` 与 `last_refill` 两个字段，按时间差补令牌再判断，能容忍突发。
:::

## 5.7 综合练习：库存扣减与并发验证

**需求**：商品库存 100，1000 个并发请求各抢 1 件，要求不超卖、同一订单号不重复扣。

```lua
-- stock_dec.lua  KEYS[1]=库存 Hash  KEYS[2]=已处理订单集合
-- ARGV[1]=扣减数量  ARGV[2]=订单号
local left = tonumber(redis.call('HGET', KEYS[1], 'stock'))
if left == nil then return -1 end                    -- 库存不存在
local qty = tonumber(ARGV[1])
if qty <= 0 then return -4 end
if redis.call('SADD', KEYS[2], ARGV[2]) == 0 then return -3 end   -- 幂等：重复订单号
if left < qty then
  redis.call('SREM', KEYS[2], ARGV[2])               -- 失败要撤回幂等标记，否则永远重试不了
  return -2                                          -- 库存不足
end
redis.call('HINCRBY', KEYS[1], 'stock', -qty)
redis.call('LPUSH', KEYS[1] .. ':log', ARGV[2] .. ':' .. qty)
return left - qty
```

```bash
# 准备数据并加载脚本
redis-cli DEL goods:1001:stock goods:1001:done goods:1001:stock:log
redis-cli HSET goods:1001:stock stock 100 price 1990
SHA=$(redis-cli SCRIPT LOAD "$(cat stock_dec.lua)")

# 1000 个并发：每个用唯一订单号，抢 1 件
for i in $(seq 1 1000); do
  redis-cli EVALSHA "$SHA" 2 goods:1001:stock goods:1001:done 1 "order-$i" &
done
wait

# 三条验收：剩余库存、去重集合大小、日志条数
redis-cli HGET goods:1001:stock stock      # 期望 0，绝不能是负数
redis-cli SCARD goods:1001:done            # 成功扣减的订单数
redis-cli LLEN goods:1001:stock:log        # 必须与上一行相等

# 再验证幂等：同一订单号连发两次，第二次应返回 -3
redis-cli EVALSHA "$SHA" 2 goods:1001:stock goods:1001:done 1 order-dup
redis-cli EVALSHA "$SHA" 2 goods:1001:stock goods:1001:done 1 order-dup
```

**自查清单**：

- [ ] 脚本里所有 key 是否都通过 `KEYS[n]` 传入（Cluster 迁移前必须满足）？
- [ ] 失败分支是否清理了幂等标记？`SREM`/`ZREM` 有没有漏？
- [ ] 单次执行耗时是否远低于 `lua-time-limit`，最坏输入下是否仍收敛？客户端是否处理了 `NOSCRIPT` 并重载？
- [ ] 返回码是否有文档化的语义表（`-1` 到 `-4` 各代表什么），业务侧有没有把它们误判成 0？

## 本章小结

- `MULTI`/`EXEC` 只保证「一批命令不被插队」，执行期错误不回滚，别把它当 ACID 事务
- `WATCH` 提供 CAS：`EXEC` 返回 `nil` 就要重试，同一连接、必须收尾是两条铁律
- Lua 脚本把「判断 + 修改」压进一次原子执行，`SCRIPT LOAD` + `EVALSHA` + `NOSCRIPT` 重试是标准用法
- 限流与扣库存这两个例子说明：需要条件写就用脚本，需要强一致就用数据库
