---
title: key 设计与过期淘汰
---

# 第 3 章 · key 设计与过期淘汰

**本章目标：**

- 定出一套能 grep、能按前缀清理、不会互相撞名的 key 命名规范
- 掌握 `SCAN` 遍历与大 key / 热 key 的发现与治理手段
- 会选 `maxmemory-policy`，并能对一个实例做粗粒度内存估算

## 3.1 命名规范：key 是可运维性的第一道门

key 是纯字符串，Redis 不理解它的含义，但**人和工具**理解。约定：

```text
<业务>:<模块>:<实体类型>:<唯一标识>[:<时间粒度>]
```

```bash
cache:user:profile:1001            # 用户资料缓存
lock:order:timeout:8801            # 订单超时处理锁
counter:api:hits:2026-09-01        # 按天计数
rank:game:score:weekly             # 排行榜
```

四条硬规则：

1. **分隔符统一用 `:`**，段内不要出现空格、换行、制表符。key 是二进制安全的，塞空格不会报错，但会让 `SCAN MATCH` 和日志检索变成灾难。
2. **不要中文与 emoji 进 key**。value 里随便存，key 里请 ASCII——终端、脚本、监控系统对非 ASCII 前缀的处理参差不齐。
3. **前缀一旦发布就不要再加语义层级**。`cache:user:1001` 和 `cache:user:profile:1001` 混存时，按 `cache:user:*` 清理会误伤。
4. **长度要克制**。key 本身也占内存，几十上百字符的 key 乘以千万条是可观开销。

::: warning 反例：前缀与完整 key 撞名
先有 `user:1`（String 存序列化的对象），又新增 `user:1:ext`。清理时用 `redis-cli --scan --pattern 'user:1'` 只命中不带后缀的那条；写成 `user:1:*` 又**匹配不到** `user:1` 本身（glob 的 `*` 至少要吃掉一个字符位置，冒号后面的内容必须存在）。这类半前缀 key 让批量操作必然漏数据。

**正例**：给「主对象」也保留一段字段名 —— `user:1:base`、`user:1:ext`，于是 `user:1:*` 成为覆盖该用户全部数据的干净前缀。
:::

## 3.2 过期三件套：`EX`、`TTL`、`PERSIST`

```text
127.0.0.1:6379> SET session:abc "token-payload" EX 3600
OK
127.0.0.1:6379> TTL session:abc
(integer) 3573
127.0.0.1:6379> EXPIRE session:abc 60
(integer) 1
127.0.0.1:6379> PTTL session:abc
(integer) 58213
127.0.0.1:6379> PERSIST session:abc
(integer) 1
127.0.0.1:6379> TTL session:abc
(integer) -1
127.0.0.1:6379> GET nothing:here
(nil)
127.0.0.1:6379> TTL nothing:here
(integer) -2
```

`TTL` 的两个负数含义必须背下来：`-1` 是 key 存在但**没设过期**，`-2` 是 key **不存在**。把 `-2` 当成「永久」的代码，等于把缓存未命中当成命中。

过期行为上的几个反直觉点：

- **`SET` 不带 `EX` 会清掉旧 TTL**。想改值又保留过期时间用 `SET key val KEEPTTL`（6.0+）；只想续期不改值用 `GETEX key EX 60`（6.2+）。
- **结构内部修改不影响 TTL**：`HSET`/`LPUSH`/`ZADD` 都不重置过期时间，也不需要重置。
- **`RENAME` 会保留 TTL**，覆盖目标 key 时目标 key 被删除。
- `EXPIRE key 60 GT`（7.0+）只在「新时间更长」时续期，避免并发续期把过期时间改短。

::: danger 反例：定时任务里给一万个 key 设同一秒过期
```bash
# 每次全量重建缓存时
redis-cli EXPIRE "cache:user:profile:1001" 3600
```
一小时后这一万个 key 在同一个 `activeExpireCycle` 周期里集体失效，数据库瞬时被打穿。

**正例**：`EXPIRE key $((3600 + RANDOM % 300))`——固定 TTL 加随机抖动（0~300 秒），把失效摊平。这是缓存雪崩最便宜的一道防线，第 8 章会把它纳入完整方案。
:::

过期的实现是**惰性删除 + 定期抽样删除**双轨：访问时发现过期才删（省钱），后台每秒 `hz`（默认 10）次 tick 各抽一批 key 清理（兜底）。所以「过期时间到了 key 一定消失」是错的假设——别用 `KEYS`/`DBSIZE` 的数量去校验过期是否生效，更不要在业务逻辑里用「key 是否还在」表达精确时刻。

## 3.3 `SCAN` 替代 `KEYS`：非阻塞遍历

`KEYS pattern` 一次性遍历整个键空间并**在单线程里阻塞**，百万 key 规模下能让实例卡住几百毫秒，期间所有请求排队。

```bash
# 生产环境禁止
redis-cli KEYS 'cache:user:*'

# 正确：游标式分批
redis-cli --scan --pattern 'cache:user:*' | head -20
redis-cli SCAN 0 MATCH 'cache:user:*' COUNT 100
```

```text
127.0.0.1:6379> SCAN 0 MATCH "cache:*" COUNT 10
1) "17"                                   # 下一轮游标，不是命中数
2) 1) "cache:user:profile:1001"
   2) "cache:user:profile:1002"
127.0.0.1:6379> SCAN 17 MATCH "cache:*" COUNT 10
1) "0"                                    # 游标归 0，遍历结束
2) 1) "cache:user:profile:1003"
```

理解 `SCAN` 的三条契约，才不会用错：

1. 返回值第一行是**下一个游标**，游标回到 `0` 才算遍历结束——不是「从 0 开始返回 0 就结束了」。
2. 同一次遍历中**重复的 key 可能被返回多次**，客户端要去重。
3. `COUNT` 是**每轮扫描的桶数量提示**，不是「返回多少条」；元素可能多可能少。它保证的是「遍历期间一直存在的 key 至少被返回一次」。

::: tip `SCAN` 家族
同族还有 `HSCAN key cursor COUNT n`、`ZSCAN`、`SSCAN`，用来遍历大 Hash / 大 ZSet 的元素，避免 `HGETALL` 一次性拉全量。`--hotkeys` 也是基于 `SCAN` 的采样工具，可以直接 `redis-cli -p 6379 --hotkeys`。
:::

批量清理不要写 `KEYS ... | xargs DEL`，用 `redis-cli --scan --pattern 'tmp:job:*' --count 500 | xargs -r -L 200 redis-cli UNLINK`。

## 3.4 大 key：发现与治理

没有官方阈值，工程上通行的判断线：**String 值超过 10 KB，或集合元素超过 5000 个 / 序列化后超过 1 MB**。危害是三件事：删除阻塞、迁移倾斜（第 7 章 Cluster 的 rebalance 以 key 为单位）、网络突发。

```bash
redis-cli --bigkeys                                  # 采样扫描，每类型给出最大值
redis-cli MEMORY USAGE "article:77:body" SAMPLES 0    # 单 key 精确内存，重，低峰用
redis-cli HLEN "config:all"; redis-cli ZCARD "rank:game:score:weekly"   # 只看元素数，不取数据
```

治理手段按侵入性从低到高：

```bash
redis-cli UNLINK "config:all"                     # 1) 删除用 UNLINK，别用 DEL 阻塞主线程
redis-cli HSET user:shard:3:1001 nickname 阿柚    # 2) 大 Hash 按 ID 取模分桶
redis-cli SET article:77:body "https://cdn.example.com/a/77.json"   # 3) 内容外置，只留指针
```

::: warning 反例：`DEL` 删一个 200 万元素的 ZSet
```bash
redis-cli DEL "rank:game:score:history"
```
DEL 是同步释放，几百毫秒的主线程停顿 = 这段时间所有命令排队，客户端大面积超时。

**正例**：`UNLINK` 把内存回收丢给后台线程；若还要更平滑，先分批 `ZPOPMIN key 5000` 削到小量再 `UNLINK`。
:::

## 3.5 热 key：发现与治理

热 key 是单条命令 QPS 打满一个核（或把某个分片压垮）。发现路径：

```bash
redis-cli --hotkeys            # 需要 maxmemory-policy 为 lfu 系（采样 IDLETIME 也能出结果，准确度有限）
redis-cli OBJECT FREQ "rank:game:score:weekly"     # LFU 策略下才有意义，否则报错
redis-cli OBJECT IDLETIME "rank:game:score:weekly" # 秒级空闲时间，越小越热
redis-cli INFO commandstats    # 看命令维度分布，不是 key 维度
```

`MONITOR` 能把每条命令实时打出来，看得最清楚，但它本身**会让吞吐下降一半以上**：

::: danger `MONITOR` 只在低峰开、只开几秒
```bash
timeout 3 redis-cli MONITOR > /tmp/monitor.log
```
它是全量命令镜像输出，长开会把实例变成日志转发器。线上要看热 key 优先用 `--hotkeys`、`OBJECT FREQ`，或在客户端侧统计。
:::

治理四板斧：

- **本地缓存**：进程内 LRU 存 1~5 秒，把万级 QPS 削成个位数打到 Redis。
- **读写分离**：只读请求走 replica（第 7 章），注意复制延迟下的读旧数据。
- **key 拆分**：`counter:api:hits:2026-09-01` 拆成 `...:s{0..15}` 随机写，读取时 `MGET` 求和——把一次热点变成十六次散点。
- **多副本 key**：`hot:config:rep{1..8}`，客户端随机选一个读，纯读场景立竿见影。

## 3.6 `maxmemory-policy`：淘汰策略怎么选

内存触顶时的行为由两个配置项决定（`redis.conf`）：

```text
maxmemory 1gb                    # 上限；默认 0 = 不限制（64 位机器务必设值）
maxmemory-policy noeviction      # 默认值
maxmemory-samples 5              # 近似 LRU/LFU 每次采样个数
lfu-log-factor 10                # LFU 计数对数增长因子
lfu-decay-time 1                 # LFU 衰减分钟数
```

`noeviction` 加三依据乘两范围共六种淘汰行为，再叠一个 `volatile-ttl`，一共八个取值：

| 策略 | 淘汰范围 | 淘汰依据 |
| --- | --- | --- |
| `noeviction` | 不淘汰，写命令直接 OOM 报错 | — |
| `allkeys-lru` | 全部 key | 最久未用 |
| `allkeys-lfu` | 全部 key | 访问频率最低（4.0+） |
| `allkeys-random` | 全部 key | 随机 |
| `volatile-lru` | 仅设了 TTL 的 key | 最久未用 |
| `volatile-lfu` | 仅设了 TTL 的 key | 频率最低 |
| `volatile-random` | 仅设了 TTL 的 key | 随机 |
| `volatile-ttl` | 仅设了 TTL 的 key | 剩余 TTL 最短 |

选择口径：

```bash
# 纯缓存实例：全部 key 都可丢 → allkeys-lru（有明确热点分布时用 allkeys-lfu）
redis-cli CONFIG SET maxmemory-policy allkeys-lru
# 缓存与业务数据混部：只能淘汰带 TTL 的 → volatile-lru
redis-cli CONFIG SET maxmemory-policy volatile-lru
```

::: warning 反例：`volatile-lru` + 一个 key 都没设 TTL
`volatile-*` 只在「有 TTL 的 key 集合」里挑，集合空时无可淘汰 → 直接 `OOM command not allowed when used memory > 'maxmemory'.`，看起来像 Redis 坏了，其实是策略和数据对不上。

**正例**：缓存实例用 `allkeys-*`；确需保护部分 key 不被淘汰，就把它们**不设 TTL 并改用 `volatile-*`**——两条路只能选一条，别混着来。
:::

LRU 是**近似**的：Redis 不为全库维护链表，每个 key 记 24 位空闲时间，淘汰时采样 `maxmemory-samples` 个挑最旧。热点越集中，调大 `maxmemory-samples`（默认值以 `CONFIG GET maxmemory-samples` 实测为准）越接近理论 LRU，代价是 CPU。

## 3.7 综合练习：内存估算与一次体检

**目标**：给一个「千万级用户资料缓存」的实例估内存，并验证淘汰配置。

```bash
# 1) 造 1000 条真实形态的样本
for i in $(seq 1 1000); do
  redis-cli HSET "cache:user:profile:$i" nickname "user$i" level 3 points 1200 >/dev/null
done

# 2) 单条内存 × 总量，得到粗估
redis-cli MEMORY USAGE "cache:user:profile:1" SAMPLES 0
redis-cli INFO memory | grep -E 'used_memory_human|used_memory_dataset'

# 3) 改大字段触发编码切换，观察内存跳变
redis-cli HSET "cache:user:profile:1" avatar "https://cdn.example.com/very-long-avatar-url-path/2026/09/01.png"
redis-cli OBJECT ENCODING "cache:user:profile:1"
```

估算公式（粗粒度，够用）：

```text
总内存 ≈ key 数 × (对象与字典开销约 48 字节 + key 字节数 + value 实际字节数)
        + 编码切换带来的放大（listpack → hashtable 常见 3~10 倍）
        + 碎片（看 mem_fragmentation_ratio）
```

按这个式子，1000 万条「30 字节 key + 200 字节 value」大约在 2.3 GB 量级——真实数字请用第 2 步的 `MEMORY USAGE` 均值乘系数，别信任何人的口算。

**自查清单**：

- [ ] `mem_fragmentation_ratio` 大于 1.5 时是否考虑 `activedefrag yes`（`redis.conf`，需 jemalloc 编译）或重建实例？
- [ ] `evicted_keys` 在 `INFO stats` 里是否持续增长？增长说明内存给少了，不是「Redis 正常工作」。
- [ ] `expired_keys` 与业务预期 TTL 分布是否一致？不一致说明有 key 忘了设过期。
- [ ] `redis-cli --bigkeys` 输出的各类型最大 key，是否全部低于 3.4 节的判断线？
- [ ] 是否存在 `TTL` 返回 `-1`（永久）但按业务应该过期的缓存 key？逐条筛：`redis-cli --scan --pattern 'cache:*' --count 1000 | while read -r k; do [ "$(redis-cli TTL "$k")" = "-1" ] && echo "$k"; done | head`

## 本章小结

- key 命名用统一冒号分层，前缀即运维边界；半前缀撞名会让批量清理必然漏数据
- `TTL` 的 `-1` 与 `-2` 含义不同；过期是惰性 + 抽样双轨，不要拿 key 存在性表达精确时刻
- `KEYS` 阻塞主线程，一律换 `SCAN`（游标到 0 才结束、结果可能重复、`COUNT` 只是提示）
- 大 key 用 `--bigkeys`/`MEMORY USAGE` 发现、`UNLINK` 与拆分治理；热 key 靠本地缓存、读写分离与 key 拆分化解
