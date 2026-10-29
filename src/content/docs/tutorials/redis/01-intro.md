---
title: "第 1 章 · 为什么用 Redis 与安装"
description: "Redis 的全称是 REmote DIctionary Server，名字已经把本质说完了：远端（Remote）+ 字典（Dictionary）。进程内维护一张巨大的哈希表，key 是字符串，value 支持五种主体结构（第 2 章 …"
series: redis
sidebar:
  order: 1
  label: "为什么用 Redis 与安装"
difficulty: intermediate
duration: 5
tableOfContents: true
---

**本章目标：**

- 说清 Redis 的定位，判断一个需求该不该交给它
- 用包管理器与 Docker 各起一个实例，并用 redis-cli 跑通第一轮命令
- 会读 `INFO` 的关键指标，给实例出一份体检报告

## 1.1 Redis 是什么：把一张哈希表搬到网络上

Redis 的全称是 REmote DIctionary Server，名字已经把本质说完了：**远端（Remote）+ 字典（Dictionary）**。进程内维护一张巨大的哈希表，key 是字符串，value 支持五种主体结构（[第 2 章 · 五大数据类型](../02-data-types/)），所有读写都走内存。

它比关系型数据库快两到三个数量级，原因有三个：

```text
数据在内存里   →  没有磁盘寻道，没有页缓存换入换出
单线程执行命令 →  没有锁竞争、没有上下文切换，命令天然原子
协议极简RESP   →  解析成本几乎为零，一次往返能带多条命令（pipeline）
```

单线程是把双刃剑，理解清楚边界很重要：

:::tip[「单线程」只指命令执行]
Redis 6.0 起网络 I/O 可以多线程（`io-threads` 配置项，**默认关闭**，以 `CONFIG GET io-threads` 实测为准），但命令本身仍在主线程按到达顺序串行执行。所以一个 `redis-server` 进程大约吃满一个 CPU 核——多核机器上的正确姿势是**跑多个实例**或用 [第 7 章 · 主从、哨兵与集群](../07-cluster/) 的水平拆分，而不是指望单实例自动用上 16 个核。
:::

## 1.2 它能解决哪三类问题

| 场景 | 用到的能力 | 典型命令 |
| --- | --- | --- |
| 读多写少的热点数据 | 内存 + 类型丰富 | `GET` `HGETALL` `ZREVRANGE` |
| 高频小计与协调 | 原子自增、条件写 | `INCR` `SET NX EX` `EXPIRE` |
| 轻量分发与实时性 | 发布订阅、Stream | `PUBLISH` `XADD` `XREADGROUP` |

反过来说，下面这些需求**不该**交给 Redis：

:::caution[反例：把 Redis 当唯一数据源]
订单表全量放进 Redis，`appendonly no`，重启后 `dump.rdb` 因目录权限没落盘——上线第一晚订单消失。

**正例**：Redis 作为缓存/加速层，落库的责任仍在 MySQL；Redis 只在需要「丢了能重建」的位子上出现。真有强持久需求（[第 4 章 · 持久化：RDB 与 AOF](../04-persistence/)），也要理解 RDB 的时间窗口丢数据是**默认行为**，不是 bug。
:::

也不要指望它做复杂查询：Redis 没有二级索引、没有 `JOIN`、没有范围之外的过滤能力。需要「按多个条件查列表」时，先回到 SQL。

## 1.3 安装：包管理器、源码与验证

Redis 官方**不支持 Windows 原生运行**，Windows 上请走 Docker 或 WSL2。

```bash
# Debian / Ubuntu
sudo apt update && sudo apt install -y redis-server redis-tools
redis-server --version          # Redis server v=7.2.x ...

# macOS（Homebrew）
brew install redis
brew services start redis       # 装成后台服务，随登录自启

# 源码编译（想拿到最新版或需要自行打补丁时）
wget https://download.redis.io/redis-stable.tar.gz
tar xzf redis-stable.tar.gz && cd redis-stable
make -j4 && sudo make install
```

源码树里还会附带 `redis-benchmark`（压测）与 `redis-check-rdb`（快照体检），这三个可执行文件是日常排查的主力。

```bash
# 服务是否活着：三种验证方式，任选
systemctl status redis          # systemd 发行版上服务名可能是 redis-server
ps -ef | grep redis-server
redis-cli PING                  # 返回 PONG 即链路正常
```

:::caution[`PONG` 之外还有 `ERROR`]
`redis-cli PING` 若返回 `(error) NOAUTH Authentication required.`，说明实例设了 `requirepass`，后续每条命令都要带 `-a 密码`；若返回 `Could not connect to Redis`，先确认端口与 `bind` 而不是怀疑程序。
:::

## 1.4 redis-cli：第一轮命令与交互约定

```text
127.0.0.1:6379> PING
PONG
127.0.0.1:6379> SET visitor:count 1
(integer) 1
127.0.0.1:6379> INCR visitor:count
(integer) 2
127.0.0.1:6379> GET visitor:count
"2"
127.0.0.1:6379> TYPE visitor:count
string
127.0.0.1:6379> DBSIZE
(integer) 1
127.0.0.1:6379> SELECT 1
OK
127.0.0.1:6379[1]> DBSIZE
(integer) 0
```

提示符里方括号中的数字是当前**逻辑库编号**，默认 16 个库（`databases` 配置项），`SELECT` 切换。注意库编号不是命名空间，集群模式下只允许 `db 0`。

常用启动参数：

```bash
redis-cli -h 127.0.0.1 -p 6379 -n 0        # 指定主机/端口/库
redis-cli -a '你的密码' --no-auth-warning   # 带密码；脚本里建议用 REDISCLI_AUTH 环境变量
redis-cli -r 30 -i 1 DBSIZE                  # 间隔 1 秒重复 30 次（轮询必须 -r 与 -i 搭配）
redis-cli --stat                           # 实时刷 new连接数/ops/内存占用
redis-cli --latency -h 127.0.0.1           # 客户端到实例的网络延迟采样
redis-cli --hotkeys                        # 基于空闲时间找热 key（需 maxmemory-policy 为 lfu 类）
```

:::tip[把 `KEYS` 留在本机小库上]
`redis-cli KEYS '*'` 是 O(N) 且**阻塞主线程**的扫描。跟着教程在空实例上敲没问题，生产库请一律换成 `SCAN`（[第 3 章 · key 设计与过期淘汰](../03-keys-expiry/) 展开）。
:::

## 1.5 Docker：一分钟起一个可复现的实例

教程与团队协作推荐这种方式——版本、参数、数据目录全部锁死在一条命令里。

```bash
# 起一个带密码、开启 AOF、数据挂到本地目录的实例
docker run -d --name redis-747 \
  -p 127.0.0.1:6379:6379 \
  -v "$PWD/redis-data:/data" \
  redis:7.2 \
  redis-server \
    --requirepass 'dev-pass-please-change' \
    --appendonly yes \
    --maxmemory 256mb \
    --maxmemory-policy allkeys-lru

docker exec -it redis-747 redis-cli -a 'dev-pass-please-change' PING
docker logs --tail 50 redis-747            # 启动日志里能看到加载的每个配置项
```

镜像默认 `CMD ["redis-server"]`，命令行后置的参数会逐个覆盖 `redis.conf` 里的同名项，优先级最高。想固化配置就挂配置文件：

```bash
docker run -d --name redis-747 \
  -p 127.0.0.1:6379:6379 \
  -v "$PWD/redis.conf:/usr/local/etc/redis/redis.conf" \
  -v "$PWD/redis-data:/data" \
  redis:7.2 redis-server /usr/local/etc/redis/redis.conf
```

:::danger[反例：`-p 6379:6379` 不设密码]
写成 `0.0.0.0:6379` 且没配 `requirepass`，等于把一个能执行 `CONFIG SET dir` 的裸端口交给全网——历史上有大量挖矿木马正是靠这个入口写 crontab 落地的。

**正例**：端口映射显式绑定 `127.0.0.1`（如上例）、设置密码、生产环境再用防火墙/安全组限制来源 IP；能走内网就别走公网。
:::

## 1.6 别急着上线：持久化与安全的默认值

Redis 的出厂默认值偏保守、偏开发友好，几个必须知道的：

| 配置项（redis.conf） | 常见默认 | 上线前动作 |
| --- | --- | --- |
| `bind` | `127.0.0.1 -::1` | 保持内网地址，不要写成 `0.0.0.0` |
| `protected-mode` | `yes` | 别关；关掉又没密码等于裸奔 |
| `requirepass` | 空 | 至少内网也设一个；7.0 起可用 ACL 用户 |
| `appendonly` | `no` | 需要少丢数据就改 `yes`（第 4 章） |
| `save` | `3600 1 300 100 60 10000` | 理解它即 RDB 触发条件（第 4 章） |
| `maxmemory` | `0`（不限） | 64 位机器必须显式设，否则吃满物理内存 |
| `maxmemory-policy` | `noeviction` | 缓存场景通常改 `allkeys-lru`（第 3 章） |
| `timeout` | `0`（不断开空闲连接） | 防连接泄漏，可设 300 |

确认当前实例的真实值，永远以 `CONFIG GET` 实测为准：

```bash
redis-cli CONFIG GET protected-mode
redis-cli CONFIG GET maxmemory
redis-cli CONFIG GET appendonly
redis-cli CONFIG GET save
redis-cli CONFIG GET requirepass      # 设了密码时返回被隐藏，属正常
```

:::caution[`maxmemory 0` 不是「不用内存」]
`0` 表示**不设上限**：实例会一直吃到操作系统 OOM killer 来杀进程，被杀时内存里未落盘的数据一起消失。缓存型实例务必给一个低于物理内存的值（留 20%~30% 给 fork 时的写时复制，见第 4 章）。
:::

## 1.7 综合练习：用 INFO 出一份体检报告

`INFO` 是最被低估的调试入口，一段输出就是一份体检表。

```text
127.0.0.1:6379> INFO server
redis_version:7.2.4
os:Linux 5.15 x86_64
process_id:412
uptime_in_days:0
config_file:/usr/local/etc/redis/redis.conf

127.0.0.1:6379> INFO memory
used_memory_human:1.05M
used_memory_peak_human:1.11M
maxmemory_human:256.00M
mem_fragmentation_ratio:2.86
```

按段落取自己关心的行：

```bash
redis-cli INFO clients        # connected_clients / blocked_clients
redis-cli INFO stats          # keyspace_hits / keyspace_misses / evicted_keys / expired_keys
redis-cli INFO persistence    # rdb_last_bgsave_status / aof_enabled / loading
redis-cli INFO keyspace       # 每个 db 的 keys/expires 数量
redis-cli INFO replication    # role / master_link_status / connected_slaves
redis-cli INFO commandstats   # 每类命令的调用次数与耗时分布
```

命中率自己算，别猜：

```text
命中率 = keyspace_hits / (keyspace_hits + keyspace_misses)
```

**练习要求**：用 1.5 节的 Docker 命令起一个实例，依次完成——

1. 写入 `healthcheck:sample hello` 并读回，确认 `INFO keyspace` 里 `db0` 的 keys 变成 1。
2. 设一个 30 秒过期：`EXPIRE healthcheck:sample 30`，用 `TTL` 观察倒计时（第 3 章详解）。
3. 跑一次基准，记录 QPS 与 P99：

```bash
redis-benchmark -h 127.0.0.1 -p 6379 -a 'dev-pass-please-change' \
  -t set,get -n 20000 -c 50 -P 16
```

4. 用一行命令把关键指标抓成文本存档：

```bash
redis-cli -a 'dev-pass-please-change' INFO | grep -E \
  'redis_version|used_memory_human|maxmemory_human|mem_fragmentation_ratio|connected_clients|keyspace_hits|keyspace_misses|evicted_keys|rdb_last_bgsave_status|aof_enabled'
```

如果第 3 步的 `-P 16` 让 QPS 明显高于 `-P 1`，你就亲手验证了「一次网络往返带多条命令」的价值——这也是后面所有 pipeline 优化的根据。

## 本章小结

- Redis 是网络上的内存哈希表：内存 + 单线程串行 + 极简协议，换来两三个数量级的低延迟
- 它适合加速、计数与轻量分发，不适合当唯一数据源，也不适合复杂条件查询
- 安装用包管理器或 Docker，Docker 侧命令行参数会覆盖 `redis.conf` 同名项
- 上线前确认 `bind`/`requirepass`/`maxmemory`/`appendonly` 四件套，取值一律以 `CONFIG GET` 实测为准
