---
title: "第 7 章 · 主从、哨兵与集群"
description: "replicaof 127.0.0.1 6379"
series: redis
sidebar:
  order: 7
  label: "主从、哨兵与集群"
difficulty: intermediate
duration: 7
tableOfContents: true
---

**本章目标：**

- 说清主从复制的全量/增量两条路径，以及异步复制留下的数据缺口
- 会配哨兵的四个关键参数，理解故障转移期间写入会发生什么
- 掌握 Cluster 的分槽规则与哈希标签，能解释并修掉跨槽命令

## 7.1 复制：先握手，再决定全量还是增量

```bash
# 方式一：配置文件（redis.conf，主从两端都可写）
replicaof 127.0.0.1 6379
masterauth '你的主库密码'        # 主库设了 requirepass 时从库必须带
replica-read-only yes

# 方式二：运行时切换，立即生效
redis-cli -p 6380 REPLICAOF 127.0.0.1 6379
redis-cli -p 6380 REPLICAOF NO ONE       # 断开复制，回到独立实例
redis-cli -p 6380 INFO replication        # role / master_link_status / master_repl_offset
```

握手用 `PSYNC`（取代早期的一次性 `SYNC`，2.8 起引入）。从库上报自己的 `replid + offset`，主库据此二选一：

```text
部分重同步（增量）  offset 仍落在主库复制积压缓冲区里 → 只补发缺口命令，秒级完成
全量重同步         对不上（首次连接、断连太久、缓冲区被覆盖）→ 主库 BGSAVE/无盘复制整份 RDB
```

断连后能否走增量，几乎完全由 `repl-backlog-size` 决定（`redis.conf`，默认值以 `CONFIG GET repl-backlog-size` 实测为准）。经验算法：

```text
repl-backlog-size 约等于 写增量速率（字节/秒）× 可容忍的最长断连秒数
```

```bash
redis-cli INFO stats | grep -E 'master_repl_offset|repl_backlog_active|repl_backlog_size|repl_backlog_first_byte_offset'
redis-cli INFO replication | grep -E 'sync_full|sync_partial_ok|sync_partial_err'
```

`sync_partial_err` 持续增长就说明 backlog 太小，从库反复全量同步，主库 fork 与带宽都被吃掉。

:::tip[无盘复制]
`repl-diskless-sync yes` 让主库直接把 RDB 流写到 socket，不先落本地磁盘，磁盘慢机器上更快；代价是期间不能有新副本加入（由 `repl-diskless-sync-delay` 控制等待）。`repl-diskless-load` 默认 `disabled`，从库侧谨慎开启。
:::

## 7.2 异步复制：你「丢」的那几毫秒去哪了

主库是**先本地执行、再异步推送**给从库，因此主库确认给客户端时从库还不知道这条命令。三个直接后果：

1. 主库崩溃，最后若干条写入未及传播 → **切到从库后这些写消失**。
2. 从库读到的是复制进度内的旧值（第 3 章的热 key 治理用「读写分离」时就必须接受这点）。
3. 想缩小窗口只有缓解手段，没有根治：

```bash
redis-cli WAIT 1 100          # 等至少 1 个从库确认收到，最多等 100 毫秒；返回已确认的副本数
redis-cli CONFIG GET min-replicas-to-write    # 默认 0 = 不启用
redis-cli CONFIG GET min-replicas-max-lag     # 默认 10（秒）
```

`min-replicas-to-write 1` + `min-replicas-max-lag 5` 的含义是「至少 1 个从库 5 秒内不落后，否则主库拒绝写入」。

:::danger[反例：把 `WAIT` 当成「已落盘」或「已生效」]
`WAIT` 只保证从库**收到并写进它的 AOF/缓冲区**，不保证从库已 apply，更不保证任何一方的 `fsync`。用它做「扣款成功」的依据，故障切换后照样出现两边不一致。

**正例**：`WAIT` 用于「降低」丢失概率与运维可视化的健康判断（返回值长期低于期望副本数就该告警）；真正不能丢的写入回到关系型数据库事务，Redis 只做缓存与计数。
:::

## 7.3 哨兵：自动把从库抬成主库

哨兵（Sentinel）做四件事：监控、通知、自动故障转移、给客户端提供当前主库地址。它**不提供读写代理**，客户端必须自己会问路。

```text
# sentinel.conf（独立进程，默认端口 26379）
sentinel monitor mymaster 127.0.0.1 6379 2
sentinel down-after-milliseconds mymaster 5000
sentinel parallel-syncs mymaster 1
sentinel failover-timeout mymaster 180000
sentinel auth-pass mymaster '你的主库密码'
sentinel resolve-hostnames yes
```

四个参数分别管：判定主观下线的超时、故障转移期间同时向新主库同步的副本数、整个转移流程的超时、访问主库的密码。`2` 是**投票法定数**：至少 2 个哨兵同意才认定客观下线并发起选举。

```bash
redis-sentinel /etc/redis/sentinel.conf
redis-cli -p 26379 SENTINEL get-master-addr-by-name mymaster
redis-cli -p 26379 SENTINEL masters
redis-cli -p 26379 SENTINEL replicas mymaster
redis-cli -p 26379 SENTINEL ckquorum mymaster     # 检查哨兵数量是否够发起转移
redis-cli -p 26379 SENTINEL failover mymaster     # 手动触发一次演练
```

故障转移的代价要写进容量预案：转移期间哨兵会让所有实例进入**只读**约几秒到几十秒，旧主库恢复后自动变成新主库的从库，其在转移前那部分未传播的写入被覆盖丢失。

:::caution[反例：两个哨兵 + `parallel-syncs` 拉满]
哨兵只有 2 个时，挂 1 个就凑不齐法定数，故障转移**不会发生**，看起来「哨兵失灵」。`parallel-syncs` 设成副本总数时，全量重同步期间所有从库同时不可读，读流量瞬间压回主库。

**正例**：哨兵 **3 个或以上、取奇数、分部署到不同机器**；副本较多时 `parallel-syncs 1`，保证转移期间始终还有可读的从库。
:::

## 7.4 Cluster：16384 个槽与哈希标签

集群把键空间切成 **16384 个哈希槽**，槽分配给各主节点；某个 key 属于哪个槽由算法固定决定：

```text
slot = CRC16(最终参与哈希的 key) mod 16384
```

想让多个 key 落到同一槽，用 `{ }` 哈希标签——**只有第一对花括号之间的内容参与哈希**：

```bash
redis-cli -p 6379 CLUSTER KEYSLOT order:1001:items     # 例：3124
redis-cli -p 6379 CLUSTER KEYSLOT order:1001:address   # 例：9077（不同槽）
redis-cli -p 6379 CLUSTER KEYSLOT '{order:1001}':items    # 同一个数
redis-cli -p 6379 CLUSTER KEYSLOT '{order:1001}':address   # 与上一行相同
```

```bash
redis-cli -p 6379 CLUSTER INFO      # cluster_state:ok / slots_assigned / cluster_size
redis-cli -p 6379 CLUSTER SHARDS    # 7.0+ 推荐，结构比 CLUSTER NODES 好读
redis-cli -p 6379 CLUSTER NODES     # 传统视图：节点 ID、槽区间、主从与 flags
redis-cli -p 6379 CLUSTER COUNTKEYSINSLOT 3124
redis-cli -p 6379 CLUSTER COUNT-FAILURE-REPORTS 节点ID
```

配置项（`redis.conf`）：

```text
cluster-enabled yes
cluster-config-file nodes-6379.conf    # 由节点自己维护，不要手改
cluster-node-timeout 15000             # 毫秒，超时即判下线
cluster-require-full-coverage yes      # 有槽无人认领时整集群拒写
```

## 7.5 迁移槽与两种重定向

扩容/缩容本质是把槽从节点 A 搬到节点 B，标准流程用 `redis-cli` 完成：

```bash
# 建集群：6 个节点、每主 1 从（先起 6 个 cluster-enabled 实例）
redis-cli --cluster create 127.0.0.1:6379 127.0.0.1:6380 127.0.0.1:6381 \
                           127.0.0.1:6382 127.0.0.1:6383 127.0.0.1:6384 \
                           --cluster-replicas 1 --cluster-yes
redis-cli --cluster info 127.0.0.1:6379
redis-cli --cluster check 127.0.0.1:6379
redis-cli --cluster reshard 127.0.0.1:6379        # 交互式：槽数量、来源节点、目标节点
redis-cli --cluster fix 127.0.0.1:6379            # 修复悬空槽与配置不一致
redis-cli --cluster call 127.0.0.1:6379 CLIENT LIST
```

迁移期间客户端可能遇到两个错误，含义完全不同：

```text
-MOVED 3124 127.0.0.1:6381   →  槽已归属新节点，更新本地拓扑表，以后都去新节点
-ASK 3124 127.0.0.1:6380     →  槽正在迁移中：本次请求先发 ASKING，再重试到回复里指定的目的节点，
                                只影响这一次，不改客户端拓扑（迁移未完成时 key 可能已在对侧）
```

:::danger[反例：跨槽 `MGET`]
```text
127.0.0.1:6391> MGET user:1001:name user:2002:name
(error) CROSSSLOT Keys in request don't hash to the same slot
```
把这类逻辑写成「批量取一批用户」的功能，测试环境单实例一切正常，上集群立刻全线报错。

**正例**：三选一——① 按用户分桶时用哈希标签把同属一实体的 key 收到同槽（`{user:1001}:name`）；② 保持 key 独立，客户端拆成单 key 命令 + pipeline，一次连接并发下发；③ 跨槽聚合逻辑（`SINTERSTORE`、`MULTI`、多 key Lua）改成应用层做。事务与 Lua 脚本同样要求全部 key 同槽。
:::

## 7.6 客户端选型：集群模式会打断哪些假设

换客户端配置前，先确认这些限制：

```text
只有 db 0                     SELECT 1 在集群下直接报错
SCAN 要逐主节点遍历            --scan 加 -c 只覆盖当前拓扑，扩容后要重新枚举
Pub/Sub 全网泛洪               广播到所有主节点；7.0 起用 SSUBSCRIBE 走分片频道
代理与直连的差别               Proxy 模式兼容旧命令但拿不到 -ASK 语义；直连模式需要客户端支持拓扑刷新
读写分离                     需要客户端把只读命令路由到 replica 节点（多数客户端有独立开关）
连接池要小要多                单实例大池在 6 节点集群会变成 6 倍连接数，注意 maxclients
```

:::tip[主从 / 哨兵 / Cluster 怎么选]
- 数据量与 QPS 单实例扛得住，只要高可用 → **主从 + 哨兵**，运维心智最轻。
- 单实例内存或写入吞吐到顶（一般 10 GB / 8 万 QPS 量级就该考虑） → **Cluster** 水平拆分。
- 只想要「读扩展」不想要 HA → 主从 + 客户端读写分离即可，别提前上哨兵。
- 三者的 key 设计原则不同：Cluster 下第 3 章的命名规范要额外考虑哈希标签，避免热点集中在同一槽。
:::

## 7.7 综合练习：三主三从与一次故障转移演练

```bash
# 1) 起 6 个集群节点（本地演示用一条命令，生产请用容器/机器编排）
for port in 6379 6380 6381 6382 6383 6384; do
  mkdir -p "nodes/$port"
  redis-server --port $port --cluster-enabled yes --cluster-config-file nodes.conf \
    --cluster-node-timeout 5000 --appendonly yes --dir "$PWD/nodes/$port" \
    --daemonize yes --logfile "$PWD/nodes/$port/redis.log"
done
redis-cli --cluster create 127.0.0.1:6379 127.0.0.1:6380 127.0.0.1:6381 \
  127.0.0.1:6382 127.0.0.1:6383 127.0.0.1:6384 --cluster-replicas 1 --cluster-yes

# 2) 用 -c 进入集群模式写一批 key，观察自动分槽
redis-cli -c -p 6379 SET '{user:1001}':name 阿柚
redis-cli -c -p 6379 SET '{user:1001}':level 5
redis-cli -c -p 6379 MGET '{user:1001}':name '{user:1001}':level    # 同槽，成功

# 3) 看每个槽的归属与 key 分布
redis-cli -p 6379 CLUSTER SHARDS
for p in 6379 6380 6381; do echo "== $p"; redis-cli -p $p CLUSTER COUNTKEYSINSLOT $(redis-cli -p $p CLUSTER KEYSLOT '{user:1001}':name); done

# 4) 杀掉一个主节点，验证从库是否被提升、客户端能否自愈
redis-cli -p 6382 CLUSTER NODES | grep myself
kill -9 $(pgrep -f "port 6382") ; redis-cli -c -p 6379 GET '{user:1001}':name
```

**自查清单**：

- [ ] 第 4 步的 `GET` 是否只出现一次重定向就拿到值（说明客户端拓扑刷新正常）？
- [ ] `cluster-require-full-coverage` 保持 `yes` 时，杀掉一个主节点且其从库同时不可用，整个集群的行为是什么？
- [ ] 同一实体的多个 key 是否都带哈希标签，且标签粒度不会造成新的热点槽？
- [ ] 哨兵/集群的监控是否覆盖 `master_link_status:down`、`sync_partial_err`、`cluster_state` 三项？
- [ ] 从库上的 `REPLICAOF` 关系是否与 `CLUSTER NODES` 输出一致，没有历史遗留的孤儿副本？

## 本章小结

- 复制走 `PSYNC`：offset 命中 backlog 就增量，否则全量；`sync_partial_err` 增长是 backlog 太小的信号
- 主库先本地执行再异步推送，`WAIT` 与 `min-replicas-to-write` 只能缩小窗口，不能消灭窗口
- 哨兵要 3 个以上取奇数、分机器部署；故障转移期间全实例只读，旧主库未传播的写入会被覆盖
- Cluster 用 `CRC16 mod 16384` 分槽，`-MOVED` 与 `-ASK` 语义不同；跨槽的 `MGET`/事务/Lua 必须靠哈希标签或客户端拆分解决
