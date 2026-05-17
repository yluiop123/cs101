<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  type: 'reference',
  name: 'Redis',
  description: 'Redis 是一个开源的内存数据结构存储系统，可用作数据库、缓存和消息代理，以极低的延迟和高吞吐量著称。',
  chapters: [
    {
      name: '数据结构',
      children: [
        'String：字符串、数字、二进制数据，命令：SET / GET / INCR / DECR / MSET',
        'Hash：键值对集合，适合对象存储，命令：HSET / HGET / HGETALL / HDEL',
        'List：有序字符串列表（链表），命令：LPUSH / RPUSH / LPOP / RPOP / LRANGE',
        'Set：无序唯一集合，命令：SADD / SMEMBERS / SINTER / SUNION',
        'ZSet：有序集合（带分数排序），命令：ZADD / ZRANGE / ZRANK / ZSCORE',
        'Bitmap：位图操作，命令：SETBIT / GETBIT / BITCOUNT',
        'HyperLogLog：基数统计，命令：PFADD / PFCOUNT',
        'Stream：消息流（类似消息队列），命令：XADD / XREAD / XGROUP',
        'GeoSpatial：地理空间索引，命令：GEOADD / GEORADIUS',
      ]
    },
    {
      name: '核心机制',
      children: [
        '【持久化】RDB：快照持久化，定期保存全量数据',
        '【持久化】AOF：追加写日志，每条写入命令记录',
        '【持久化】混合持久化：RDB + AOF 结合',
        '【过期策略】定时删除 + 惰性删除 + 定期删除',
        '【过期策略】内存淘汰：noeviction / allkeys-lru / volatile-lru / allkeys-random',
        '【事务】MULTI / EXEC / DISCARD / WATCH',
        '【事务】乐观锁（WATCH 实现 CAS）',
      ]
    },
    {
      name: '高可用',
      children: [
        '主从复制：全量同步 + 增量同步',
        '哨兵模式（Sentinel）：自动故障转移、监控、通知',
        'Cluster 集群：数据分片（16384 个槽位）、去中心化架构、节点通信（Gossip）',
      ]
    },
    {
      name: '常见应用场景',
      children: [
        '缓存：热点数据缓存、穿透/击穿/雪崩防护',
        '分布式锁：Redisson、SETNX + Lua 脚本',
        '计数器：文章阅读量、点赞数',
        '排行榜：ZSet 实现实时排行',
        '消息队列：List / Pub-Sub / Stream',
        'Session 共享：分布式会话管理',
      ]
    },
  ],
  resources: [
    {
      name: "推荐资源",
      items: [
        { title: "Redis 官方文档", url: "https://redis.io/docs/" },
        { title: "Redis 命令参考", url: "https://redis.io/commands/" }
      ],
    }
  ]
}
</script>
<ContentView :data="data" />
