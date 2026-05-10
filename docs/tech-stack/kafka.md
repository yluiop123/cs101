<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  type: 'reference',
  name: 'Kafka',
  description: 'Apache Kafka 是分布式消息队列和流处理平台，以高吞吐、可持久化、可水平扩展著称，广泛应用于日志采集、事件驱动架构和实时数据管道。',
  chapters: [
    {
      name: '核心概念',
      children: [
        'Producer：消息生产者，发布消息到 Topic',
        'Consumer：消息消费者，订阅 Topic 处理消息',
        'Topic：消息的逻辑分类',
        'Partition：Topic 的分片单元，每个 Partition 是有序的日志',
        'Broker：Kafka 服务器节点',
        'Consumer Group：消费者组，组内消费者分摊 Partition 消费',
        'Offset：消息在 Partition 内的偏移量',
      ]
    },
    {
      name: '消息模型',
      children: [
        '发布-订阅模式：Producer → Topic → Consumer Group，一条消息可被多个 Consumer Group 消费',
        '消息顺序：单个 Partition 内保证顺序，跨 Partition 不保证全局顺序',
        '消息持久化：写入磁盘日志文件（Segment），基于偏移量的顺序读写性能极高，可配置保留策略（时间/大小）',
      ]
    },
    {
      name: '可靠性保证',
      children: [
        'ACK 机制：acks=0/all/1',
        '幂等 Producer：enable.idempotence=true，防止重复写入',
        '事务：跨 Partition 的原子写入',
        'ISR（In-Sync Replicas）：同步副本集合',
        'Leader/Follower：Partition 主从复制',
      ]
    },
    {
      name: '高级特性',
      children: [
        'Kafka Streams：轻量级流处理库，支持有状态处理（窗口聚合、Join），Exactly-once 语义',
        'Schema Registry：支持 Avro / JSON Schema / Protobuf，提供注册与兼容性管理',
        'Kafka Connect：Source Connector 从外部系统导入数据，Sink Connector 导出数据到外部系统',
      ]
    },
    {
      name: '生态对比',
      children: [
        'Kafka：高吞吐、持久化、流处理、日志场景',
        'RabbitMQ：AMQP 协议、灵活路由、低延迟',
        'RocketMQ：阿里巴巴开源、事务消息、顺序消息',
        'Pulsar：存储计算分离、多租户、分层存储',
      ]
    },
  ],
  groups: [
    {
      name: "推荐资源",
      items: [
        { title: "Kafka 官方文档", url: "https://kafka.apache.org/documentation/" }
      ],
    }
  ]
}
</script>
<ContentView :data="data" />
