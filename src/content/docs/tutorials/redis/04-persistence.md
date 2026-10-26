---
title: "第 4 章 · 持久化：RDB 与 AOF"
description: "Redis 有两条互相独立的持久化路线："
series: redis
sidebar:
  order: 4
  label: "持久化：RDB 与 AOF"
difficulty: intermediate
duration: 7
---

**本章目标：**

- 讲清 RDB 与 AOF 各自的写入机制、丢数据窗口与恢复顺序
- 会配 `appendfsync`、AOF 重写阈值与混合持久化，并说清选型理由
- 独立完成一次「删库→从快照恢复」的演练，并能解释延迟抖动的来源

## 4.1 两条路线：状态快照 vs 命令日志

Redis 有两条互相独立的持久化路线：

```text
RDB   某一时刻全量内存的二进制快照，一个文件，恢复时整体载入
AOF   以追加方式记录写命令（7.0 起记录的是「写后二进制值」而非命令文本），恢复时重放
```

两者可以同时开启，`appendonly yes` 时**恢复以 AOF 为准**，RDB 只是备用快照——这是最容易记错的一条规则。

先确认实例的真实状态：

```bash
redis-cli CONFIG GET appendonly      # yes / no
redis-cli CONFIG GET save            # 空字符串 = RDB 自动触发已关闭
redis-cli CONFIG GET dir             # 快照与 AOF 的落地目录
redis-cli CONFIG GET appendfsync
redis-cli INFO persistence           # 一份完整的持久化体检
```

:::caution[反例：`dir` 指向容器可写层]
Docker 里跑 `docker run redis:7.2` 未挂 `-v ...:/data`，重启容器后 `dump.rdb` 随可写层一起消失，配置再对也没用。

**正例**：`-v "$PWD/redis-data:/data"` 显式挂载（第 1 章 1.5 节），并且把 `dir` 与挂载点核对一致——`redis-cli CONFIG GET dir` 的输出必须是宿主机可读的路径。
:::

## 4.2 RDB：fork、写时复制与触发条件

自动触发由 `save` 配置项控制（`redis.conf`），默认值形如：

```text
save 3600 1 300 100 60 10000
```

含义是三段「或」关系：**1 小时内至少 1 次写 / 5 分钟内至少 100 次写 / 60 秒内至少 10000 次写**，任一满足就后台生成快照。想临时关闭：

```bash
redis-cli CONFIG SET SAVE ""         # 运行时关闭自动 RDB（默认值以 CONFIG GET save 实测为准）
redis-cli BGSAVE                     # 手动触发后台快照，立即返回 OK
redis-cli LASTSAVE                   # 上次成功快照的 Unix 时间戳
```

`BGSAVE` 的实现是 `fork()` 出一个子进程，子进程持有**那一刻的内存视图**并把它序列化到新 RDB 文件，父进程继续服务请求。fork 依靠操作系统的写时复制（Copy-On-Write）：

```text
fork 瞬间      → 不复制数据，只复制页表，耗时随内存规模与页表大小增长
父进程随后写入 → 被写的那一页才真正复制一份
```

由此得到两条必须接受的性质：

1. **快照是「fork 那一刻」的状态**，之后到下次快照之间的写入不在里面——RDB 的丢数据窗口由 `save` 规则决定，最长可能到几小时。
2. **fork 期间内存可能翻倍**：极端情况下父进程改遍所有页，每页都留下一份副本。经验值是预留 20%~30% 空闲内存，`maxmemory` 不要贴着物理内存设。

```text
127.0.0.1:6379> INFO persistence
rdb_bgsave_in_progress:0
rdb_last_save_time:1759321204
rdb_last_bgsave_status:ok
rdb_changes_since_last_save:412
latest_fork_usec:24512
```

`rdb_changes_since_last_save` 就是「现在宕机会丢多少条写」；`latest_fork_usec` 是最近一次 fork 的微秒耗时，主线程在这段是真的停住的。

:::danger[`SAVE` 与 `BGSAVE` 只差一个字母]
`SAVE` 在**主线程**同步写快照，期间实例完全不响应，百万级数据可停顿十几秒；`stop-writes-on-bgsave-error yes`（默认）还会让子进程写失败后**拒绝所有写命令**。生产环境只允许 `BGSAVE`。
:::

## 4.3 AOF：追加、刷盘与重写

AOF 把每个写变更追加到缓冲区，按策略刷盘，文件持续增长。核心配置（`redis.conf`）：

```text
appendonly yes                                   # 默认 no，必须显式打开
appendfilename "appendonly.aof"                  # 7.0 起多分片文件，目录由 appenddir 指定
appendfsync everysec                             # always / everysec / no
auto-aof-rewrite-percentage 100                  # 相对上次重写后体积增长 100% 触发重写
auto-aof-rewrite-min-size 64mb                   # 低于此体积永不自动重写
aof-use-rdb-preamble yes                         # 混合持久化（7.0 起默认开）
no-appendfsync-on-rewrite no                     # yes = 重写期间不 fsync，换吞吐丢更多
```

`appendfsync` 三档是** durability 与吞吐的直接交换**：

| 取值 | 语义 | 最大丢数据窗口 | 代价 |
| --- | --- | --- | --- |
| `always` | 每次写命令都 `fsync` | 约 0 | 最慢，磁盘 IOPS 成瓶颈 |
| `everysec` | 由独立线程每秒 `fsync` | 约 1 秒 | 默认推荐，性能几乎无损 |
| `no` | 只 `write` 不 `fsync`，交给 OS | 取决于内核，可能几十秒 | 最快，最不可靠 |

:::caution[反例：为了「绝不丢数据」上 `appendfsync always`]
库存计数与排行榜这类缓存型数据全开 `always`，压测显示吞吐掉到 `everysec` 的三分之一，还换来一堆 `aof_delayed_fsync` 计数增长（`INFO persistence` 里可见），P99 延迟被磁盘抖动作死。

**正例**：默认 `everysec`；确有「一条都不能丢」的写入，把它放回关系型数据库，或按 key 前缀拆成两个实例（第 3 章的命名规范天然支持这种拆分）。
:::

AOF 是日志，只追加不回收，跑一个月会变成几十 GB 而实际有效数据只有几 GB。**重写（rewrite）**就是压缩：读当前内存状态，生成一份等价的、最小的写序列写入新文件，然后原子替换。

```bash
redis-cli BGREWRITEAOF               # 手动触发一次重写
redis-cli CONFIG SET auto-aof-rewrite-percentage 60   # 调灵敏一些
redis-cli CONFIG SET auto-aof-rewrite-min-size 128mb
```

重写同样是 fork 子进程，父进程期间收到的新写命令先进缓冲区，重写完成后追加进新文件，不会丢。增量 fsync 由 `aof-rewrite-incremental-fsync yes` 控制，避免一次性刷盘造成文件系统级卡顿。

## 4.4 混合持久化与选型

`aof-use-rdb-preamble yes`（即 **混合持久化**）让重写出的新 AOF 文件**前半段是 RDB 二进制、后半段是重写期间的增量写命令**。于是：

- 载入速度接近 RDB（不用重放几百万条命令）
- 丢数据窗口接近 AOF `everysec`（一秒）
- 代价：文件不可读、不易人工修改，AOF 的「日志可审计」优势没了

选型口径：

```text
纯缓存，丢了能回源重建        → 只要 RDB（甚至两个都关，重启即冷启动）
配置类 / 计数类不能丢          → AOF + everysec + 混合持久化
强一致记账                   → 别只靠 Redis，写库为主，Redis 只做缓存与限流
大内存实例频繁重启            → AOF 关闭或拉长重写阈值，重启用 RDB 快速拉起
```

## 4.5 恢复演练：把「能恢复」变成肌肉记忆

载入优先级：**`appendonly yes` 时读 AOF（含 RDB preamble），忽略 `dump.rdb`；`appendonly no` 时读 `dump.rdb`**。恢复过程会阻塞到载入完成，`loading:1` 期间除 `SHUTDOWN` 外所有命令返回 `LOADING Redis is loading the dataset in memory`。

```bash
# 演练 1：从 RDB 恢复
redis-cli SET demo:key "recovery-test"
redis-cli BGSAVE
redis-cli SHUTDOWN NOSAVE               # 模拟崩溃：不写新快照
cp redis-data/dump.rdb /tmp/dump.rdb.bak
redis-server /etc/redis/redis.conf      # 重新启动，dir 指回原目录
redis-cli GET demo:key                  # 读到的是上次 BGSAVE 时刻的值

# 演练 2：只拿一个 RDB 文件在干净实例上拉起
redis-server --dir /tmp/restore-test --dbfilename dump.rdb.bak --save ""

# 演练 3：AOF 文件损坏，先体检再修复
redis-check-aof /data/appendonlydir/appendonly.aof.1.base.rdb
redis-check-aof --fix /data/appendonlydir/appendonly.aof.1.incr.aof
```

`redis-check-aof --fix` 会**截断**尾部无法解析的部分；`aof-load-truncated yes` 允许载入被截断的尾部 AOF（默认值以 `CONFIG GET aof-load-truncated` 实测为准）。

:::danger[恢复前先备份，别在原地修]
线上 AOF 出问题，直接对生产目录跑 `--fix` 等于二次破坏。正确顺序：`SHUTDOWN` → 完整拷贝 `dir` 目录 → 在副本上试验 → 确认无误再替换上线。RDB 与 AOF 至少一份保留 7 天，并做异地副本。
:::

## 4.6 持久化对延迟与内存的影响

持久化不是免费的，可观测的三处代价：

- **fork 停顿**：`latest_fork_usec` 随堆大小增长，几十 GB 实例 fork 可到上百毫秒，期间请求排队。
- **CPU 竞争**：子进程序列化 + 压缩（`rdbcompression yes`）吃掉约一个核，机器只剩双核时会明显拖慢主线程。
- **fsync 抖动**：`aof_delayed_fsync` 计数增长代表 fsync 超过 25 毫秒被观察到，磁盘是根因。

```bash
redis-cli INFO persistence | grep -E 'latest_fork_usec|aof_delayed_fsync|rdb_changes_since_last_save'
redis-cli --latency        # 客户端侧观察毛刺
redis-cli LATENCY HISTORY fork
```

:::tip[透明大页要关掉]
Redis 官方明确建议关闭 THP（`transparent_hugepage`），否则 fork 的 COW 复制粒度变大，快照耗时和内存放大都显著恶化。检查与关闭：

```bash
cat /sys/kernel/mm/transparent_hugepage/enabled   # 期望 [never]
echo never | sudo tee /sys/kernel/mm/transparent_hugepage/enabled
```
:::

## 4.7 综合练习：亲手量出「丢多少数据」

**目标**：用一组实验把「RDB 丢多少」「AOF 丢多少」变成可见数字。

```bash
# 1) 准备两个实例：只有 RDB / RDB+AOF(everysec)
docker run -d --name rdb-only -p 127.0.0.1:7379:6379 redis:7.2 \
  redis-server --save "900 1" --appendonly no
docker run -d --name aof-on -p 127.0.0.1:7380:6379 redis:7.2 \
  redis-server --appendonly yes --appendfsync everysec

# 2) 两边各灌 10 万条写入（--pipe 需要每行一条内联命令）
for p in 7379 7380; do
  for i in $(seq 1 100000); do echo "SET k:$p:$i $i"; done | redis-cli -p $p --pipe
done

# 3) 硬杀容器（不给任何落盘机会），再拉起，看还剩多少
docker kill rdb-only aof-on
docker start rdb-only aof-on
redis-cli -p 7379 DBSIZE      # 只有上次快照里的数据
redis-cli -p 7380 DBSIZE      # everysec：最多丢约 1 秒的写入
```

**记录三件事**：

1. 两个实例重启后 `DBSIZE` 的差值，与你预期的 `save` / `appendfsync` 语义是否一致。
2. `INFO persistence` 里 `loading` 字段在载入期间的表现，以及大实例载入耗时。
3. 手动 `BGSAVE` 后 `rdb_changes_since_last_save` 归零——这个字段就是当前丢数据窗口的度量。

**自查清单**：

- [ ] `appendonly` 打开后，是否理解「`dump.rdb` 不再参与恢复」？
- [ ] `dir` 是否指向持久卷，容器重启后文件仍在？
- [ ] 快照触发规则是否与业务写入频率匹配（低频实例可能几十天不出快照）？
- [ ] 是否做过至少一次「停进程→换文件→拉起」的完整演练而不只是备份？
- [ ] `stop-writes-on-bgsave-error` 打开时，磁盘满会导致全实例禁写，监控是否覆盖该场景？

## 本章小结

- RDB 是 fork + 写时复制的全量快照：恢复快、文件小，丢数据窗口由 `save` 规则决定
- AOF 是追加日志，`appendfsync` 的 `always`/`everysec`/`no` 三档直接交换安全性与吞吐；重写负责压缩体积
- 混合持久化把 AOF 的重写产物做成「RDB 底座 + 增量命令」，兼顾载入速度与一秒窗口
- 恢复以 AOF 优先；fork 耗时、fsync 抖动与 THP 是延迟毛刺最常见的三个源头
