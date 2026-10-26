---
title: "第 8 章 · 综合实战：缓存三兄弟与一个商品详情缓存"
description: "识别它们靠三个数据源同时看："
series: redis
sidebar:
  order: 8
  label: "综合实战：缓存三兄弟与一个商品详情缓存"
difficulty: intermediate
duration: 8
---

**本章目标：**

- 能区分穿透、击穿、雪崩的成因，并为每一种写出至少两个对策
- 实现一个带互斥重建与空值缓存的商品详情缓存，说清每一步防的是什么
- 用压测与 `INFO stats` 验证命中率，并知道什么指标该报警

## 8.1 三个经典故障：一张对照表

| 名称 | 一句话成因 | 现场特征 | 典型触发 |
| --- | --- | --- | --- |
| 缓存穿透 | 查的是**根本不存在**的数据，缓存永远不命中 | 数据库出现大量空结果查询，QPS 与流量同涨 | 恶意刷不存在的 ID、爬虫遍历 |
| 缓存击穿 | **单个热点 key 过期瞬间**，成千上万请求同时回源 | 数据库出现同一 SQL 的尖峰，几百毫秒后自愈 | 爆款商品缓存 TTL 到点 |
| 缓存雪崩 | **大量 key 同时过期**或 **Redis 整体不可用** | 数据库 CPU 打满、连接池耗尽，恢复慢 | 批量预热用了同一个 TTL；实例宕机/网络抖动 |

识别它们靠三个数据源同时看：

```bash
redis-cli INFO stats | grep -E 'keyspace_hits|keyspace_misses|expired_keys|evicted_keys|rejected_connections'
redis-cli --latency            # 客户端侧看 Redis 是否变慢
# 数据库侧：同一条 SQL 的调用量在故障瞬间是否暴涨（慢日志 / performance_schema）
```

`expired_keys` 短时暴涨 + 数据库打满 → 雪崩；`keyspace_misses` 高但 `expired_keys` 平静 → 更像穿透。

## 8.2 对策矩阵

**穿透**（目标是「不存在的 ID 也要有东西可返回」）：

- **空值缓存**：`SET cache:goods:999999 "" EX 60`——短 TTL（30~120 秒），别用 1 小时，否则真上架了也看不见。
- **布隆过滤器 / Ribbon**：把全量 ID 先装进去，`不可能存在` 直接拒绝。注意 RedisBloom 是**模块**，需要额外安装（`docker run redis/redis-stack-server` 或用应用层过滤器），命令形如 `BF.ADD` / `BF.EXISTS`；未装模块就不要写这类命令。
- **入口校验**：ID 格式、位数、负数在进入 Redis 之前就拦掉，成本最低。

**击穿**（目标是「同一时刻只有一个请求回源」）：

- **互斥重建**：`SET lock NX EX` 抢到锁的那个去查库，其余等待后重读缓存（8.4 节实现）。
- **逻辑过期**：value 里带 `expireAt` 字段，物理上**永不过期**；读到过期数据时旧值照常返回，同时异步触发重建。代价是可能读到几百毫秒前的旧数据。
- **热点 key 手动预热 + 延长 TTL**：爆款走「永不主动失效 + 后台定时刷新」。

**雪崩**（目标是「不要把失效时刻对齐」）：

- **TTL 加随机抖动**（第 3 章 3.2 节已实操过）：`EXPIRE key $((3600 + RANDOM % 600))`。
- **分级缓存**：进程内 LRU（1~5 秒）+ Redis，Redis 挂了还有本地兜底。
- **数据库侧限流与熔断**：回源有配额，超配额直接返回降级数据，而不是把库拖死。
- **Redis 高可用**：主从 + 哨兵（第 7 章），避免「实例宕机 = 全量穿透到库」。

:::caution[反例：用「缓存永不过期」一把梭解决三兄弟]
所有 key 都不设 TTL，`maxmemory-policy` 还是 `noeviction`。一周后内存触顶，写命令全部返回 `OOM command not allowed...`，缓存彻底瘫痪，比雪崩更彻底。

**正例**：永不过期**只用于**已确认的热点 key 且配合后台刷新任务；其余一律带 TTL + 抖动，实例统一 `allkeys-lru` 并给足内存（第 3 章 3.6 节）。
:::

## 8.3 更新策略：删除，而不是更新

```text
Cache-Aside（旁路缓存，主流）
  读：查缓存 → 命中返回；未命中查库 → 写缓存（带 TTL）→ 返回
  写：更新数据库 → 删除缓存
  关键：是「删除」不是「更新」——更新缓存要拼完整对象，容易与并发读交错写回旧值

Read-Through / Write-Through   把回源逻辑交给缓存层（框架实现），业务代码更薄
Write-Behind（异步刷库）        先写 Redis 再批量落库，吞吐高但可能丢数据，账务类禁用
```

**延迟双删**处理的是这个竞态：

```text
① 线程 A 读缓存未命中，去查数据库（拿到旧值 v1）
② 线程 B 更新数据库为 v2，并删除缓存
③ 线程 A 把 v1 写回缓存     ← 脏数据诞生，且会存活一整个 TTL
```

对策是写侧删两次：

```java
cache.delete(key);          // 第一次：删掉旧值
db.update(v2);              // 更新数据库
sleep(delayMs);             // 覆盖「一次读回源 + 回写」的耗时，通常 500~1000 毫秒
cache.delete(key);          // 第二次：清掉可能被回填的旧值
```

`delayMs` 不是拍脑袋：它要大于「单条读请求回源耗时 + 主从复制延迟」（第 7 章 7.2 节），从库读场景取不到就放大。第二删也可以用延迟队列（第 6 章 6.6 节的 ZSet 方案）异步做，别把它放在请求线程里 `sleep`。

:::danger[反例：先更新缓存再更新数据库]
```text
1  SET cache:goods:1001 <v2>
2  UPDATE goods SET ... WHERE id=1001   ← 这一步失败或超时
```
缓存里已经是新值，数据库仍是旧值；下一次读直接命中脏数据，且**没有任何机制会修正它**。

**正例**：数据库是唯一真相源，顺序固定为「更新库 → 删缓存」，删缓存失败就投进重试队列（或订阅 binlog 兜底，如 Canal 类方案），并保证缓存一定带 TTL——TTL 是最后一道自愈机制。
:::

## 8.4 互斥重建的边界

`SET lock:<key> <owner> NX EX 10` 拿到锁才允许回源，这里的三个细节决定正确性：

- **锁的 value 必须是本次请求的唯一标识**，释放时用 Lua 比对（第 5 章的脚本模式），否则会删掉别人的锁。
- **锁 TTL 要大于回源 P99**，太短会出现「锁过期后两个线程同时回源」；同时**不要用无限期锁**，客户端崩溃就永久卡死。
- **抢锁失败的一方要有等待策略**：短轮询重读缓存（`sleep 50ms`，最多 N 次），或返回降级值；绝不能直接落到数据库——那就退化成了没做互斥。

:::tip[Cluster 下的锁与数据 key 要同槽]
`lock:goods:1001` 与 `cache:goods:1001` 在集群里大概率分属不同槽，用 Lua 一次操作两者会直接 `CROSSSLOT`。写成 `{goods:1001}:lock` 与 `{goods:1001}:cache`（第 7 章 7.4 节）即可。
:::

## 8.5 落地：Node + ioredis 的商品详情缓存

```javascript
// goods-cache.js  ——  依赖安装：npm i ioredis
import Redis from 'ioredis';
import { randomUUID } from 'node:crypto';

const redis = new Redis({ host: '127.0.0.1', port: 6379, maxRetriesPerRequest: 2 });

const BASE_TTL = 3600;          // 秒
const EMPTY_TTL = 60;           // 空值缓存的短 TTL
const LOCK_TTL = 10;            // 互斥锁的秒数，需大于回源 P99
const WAIT_STEP = 50;           // 抢锁失败后的轮询间隔（毫秒）
const WAIT_MAX = 12;            // 最多轮询 12 次 ≈ 600 毫秒

// 释放锁：只有 owner 对得上才删（原子）
const UNLOCK = `
if redis.call('GET', KEYS[1]) == ARGV[1] then
  return redis.call('UNLINK', KEYS[1])
end
return 0`;

const keyOf = id => `{goods:${id}}:cache`;
const lockOf = id => `{goods:${id}}:lock`;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const parse = raw => (raw === '' ? null : JSON.parse(raw));

async function getGoods(id, loadFromDb) {
  const key = keyOf(id);
  const raw = await redis.get(key);
  if (raw !== null) {                              // 命中（空值缓存也算命中）
    await redis.hincrby('stats:cache', 'hit', 1);
    return parse(raw);
  }
  await redis.hincrby('stats:cache', 'miss', 1);

  const owner = randomUUID();
  const locked = await redis.set(lockOf(id), owner, 'EX', LOCK_TTL, 'NX');
  if (!locked) {                                   // 别人正在回源：等它，不要压数据库
    await redis.hincrby('stats:cache', 'wait', 1);
    for (let i = 0; i < WAIT_MAX; i++) {
      await sleep(WAIT_STEP);
      const cached = await redis.get(key);
      if (cached !== null) {
        await redis.hincrby('stats:cache', 'hit_after_wait', 1);
        return parse(cached);
      }
    }
    // 等待超时：降级直查一次且不写缓存，宁慢勿污染
    await redis.hincrby('stats:cache', 'bypass', 1);
    return (await loadFromDb(id)) ?? null;
  }

  try {
    const row = await loadFromDb(id);
    const ttl = row ? BASE_TTL + Math.floor(Math.random() * 600) : EMPTY_TTL;
    await redis.set(key, row ? JSON.stringify(row) : '', 'EX', ttl);
    await redis.hincrby('stats:cache', row ? 'miss_fill' : 'empty_fill', 1);
    return row ?? null;
  } finally {
    await redis.eval(UNLOCK, 1, lockOf(id), owner);
  }
}

// 失效：先更库，再删缓存；第二删走延迟队列（第 6 章 6.6 节的 ZSet 方案）
async function updateGoods(id, patch, saveToDb) {
  await saveToDb(id, patch);
  try {
    await redis.unlink(keyOf(id));
  } catch {
    // 删除失败不影响本次写：TTL 与下面排定的第二删会兜底
  }
  await redis.zadd('cache:invalidate', Date.now() + 800, keyOf(id));
}

export { getGoods, updateGoods, redis };
```

三处与前面章节的呼应：`{goods:1001}` 哈希标签（第 7 章）、TTL 抖动（第 3 章）、延迟双删的第二删走 ZSet 延迟队列（第 6 章）。消费侧起一个 worker 轮询 `cache:invalidate` 到期成员再 `DEL` 一次即可。

Java 侧等价方案：Spring Cache + `@Cacheable` 只能解决「读」，互斥重建要么用 Redisson 的 `RLock`，要么自定义 `CacheManager` 包装一层 `get(key, loader)`；不要指望 `@CachePut` 替代删除语义。

## 8.6 压测：让数字说话

```bash
# 1) 数据准备：库里只有 200 个真实商品，压测请求从 1~10000 里随机取 ID
#    （200 命中真实数据，其余制造穿透流量）

# 2) 三轮压测：无缓存 / 有缓存无互斥 / 有缓存有互斥
#    脚本自己写（20 行足够），或直接用 k6 打应用接口
k6 run -e MODE=none  --vus 50 --duration 30s bench.js
k6 run -e MODE=cache --vus 50 --duration 30s bench.js
k6 run -e MODE=mutex --vus 50 --duration 30s bench.js

# 3) 观测
redis-cli INFO stats | grep -E 'keyspace_hits|keyspace_misses|instantaneous_ops_per_sec'
redis-cli HGETALL stats:cache
redis-cli --latency
```

命中率算法与判读口径：

```text
命中率 = keyspace_hits / (keyspace_hits + keyspace_misses)

90% 以下    缓存基本没起作用，先查 TTL 是不是太短、key 是不是每次都不一样
95%~99%     正常业务水位；关注 miss 是否集中在同一批 key（穿透信号）
99% 以上    继续看数据库 QPS 是否同步下降，否则是统计口径有问题
```

数据库侧的对照指标更诚实：**同一 SQL 的调用次数**与**回源 QPS 峰值**。互斥重建生效时，热点 key 过期瞬间数据库上该 SQL 应该只出现 1 次调用，而不是几百次。

:::caution[反例：压测只测平均响应时间]
平均值 8 毫秒很漂亮，实际 P99 是 1200 毫秒——每次热点 key 过期时的那一波等待全被平均掉了。缓存类改动必须看 P99/P999，并单独统计 `wait` 与 `bypass` 计数。

**正例**：压测脚本同时输出 p50 / p99 / p999 与 `stats:cache` 各计数器；上线后对 `miss_fill` 突增与数据库 QPS 同时告警。
:::

## 8.7 自查清单

**上线前**

- [ ] 所有缓存 key 是否都带 TTL，且 TTL 有随机抖动？
- [ ] 不存在的 ID 是否有空值缓存（短 TTL）或前置校验，而不是每次直穿数据库？
- [ ] 互斥锁是否有 owner 校验与合理 TTL？锁与数据 key 在 Cluster 下同槽吗？
- [ ] 写路径是否严格「更新库 → 删缓存」，删除失败是否进了重试/延迟队列？
- [ ] 是否演练过「Redis 完全不可用」：应用是降级返回、熔断，还是雪崩到库？

**上线后持续盯**

- [ ] 命中率是否稳定在预期水位（用 `keyspace_hits` / `misses` 自己算，别只看曲线形状）？
- [ ] `evicted_keys` 是否在增长？增长意味着内存不足，缓存正在被无声淘汰（第 3 章 3.6 节）。
- [ ] 大 key 是否复现（`--bigkeys` 周期巡检）——商品详情这类聚合对象最容易长成大 value。
- [ ] 数据库 QPS 与缓存 miss 数是否同涨同落？不同步说明存在绕过缓存的调用路径。
- [ ] 是否演练过「杀掉主节点」并确认哨兵切换期间应用只是变慢而非全量回源打库？

**代码细节**

- [ ] 空值缓存的读取分支不会把 `""` 当成有效对象传给业务层？序列化格式变更时，读不懂的旧值是否按 miss 处理？
- [ ] 等待锁的循环有上限且有降级出口，不会无限阻塞请求线程？
- [ ] 缓存 key 前缀是否与第 3 章的命名规范一致，能一条 `--scan --pattern` 清干净？

## 本章小结

- 穿透查的是不存在的数据、击穿是单点过期、雪崩是批量过期或实例不可用——三者的解法不可互换
- Cache-Aside 的写侧永远是「更新库再删缓存」，延迟双删补的是回填竞态，TTL 是最后一条自愈线
- 互斥重建要同时满足：owner 校验、TTL 大于回源 P99、抢锁失败方等待而非回源，缺一就只是自我安慰
- 命中率与 P99 一起看，数据库侧的 SQL 调用次数才是缓存是否真正生效的判据
