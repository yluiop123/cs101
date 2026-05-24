<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: 'Java 技术路线',
  description: 'Java 全栈技术图谱，涵盖从基础到架构、微服务与云原生生态',

  items: [
    {
      name: '基础必备',
      subtitle: '必修',
      children: [
        {
          title: 'Java基础',
          description: 'Java视频教程，java入门神器（附300道Java面试题剖析）',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '尚硅谷Java教程- 宋红康）', url: 'https://www.bilibili.com/video/BV1PY411e7J6/' },
          ]}],
        },
        {
          title: 'MySQL',
          description: 'MySQL数据库入门到大牛，mysql安装到优化，百科全书级，全网天花板',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '尚硅谷MySQL百科全书', url: 'https://www.bilibili.com/video/BV1iq4y1u7vj' }
          ]}],
        },
        {
          title: 'JDBC',
          optional:true,
          description: '尚硅谷JDBC教程 | jdbc基础到高级一套通关！',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '尚硅谷JDBC核心技术', url: 'https://www.bilibili.com/video/BV1eJ411c7rf' },
          ]}],
        },
        {
          title: 'IDEA',
          description: 'IDEA使用指南，idea教程，idea从安装到使用技巧',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '尚硅谷IDEA使用指南', url: 'https://www.bilibili.com/video/BV1CK411d7aA' },
          ]}],
        },
        {
          title: 'MAVEN',
          description: 'Maven教程，maven安装及使用，5小时上手maven又快又稳',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '尚硅谷Maven教程', url: 'https://www.bilibili.com/video/BV1JN411G7gX' },
          ]}],
        },                
        {
          title: 'JavaWeb',
          description: 'JavaWeb全套教程，javaweb真正主流技术栈，直接上手独立开发项目',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '尚硅谷JavaWeb全新版', url: 'https://www.bilibili.com/video/BV1UN411x7xe' },
          ]}],
        },
        {
          title: 'JVM',
          description: '尚硅谷JVM全套教程（详解java虚拟机）',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '尚硅谷宋红康JVM全套', url: 'https://www.bilibili.com/video/BV1PJ411n7xZ' },
          ]}],
        },
        {
          title: 'Arthas 线上诊断',
          description: '阿里开源在线诊断工具：在线反编译、方法追踪、动态热更。配合 JMC + JFR 监控',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '黑马Arthas教程', url: 'https://www.bilibili.com/video/BV19k4y1k7o9/' },
          ]}],
        },
      ]
    },
    {
      name: '微服务核心',
      subtitle: '核心',
      children: [
        {
          title: 'Springframework',
          description: '尚硅谷Spring零基础入门到进阶，一套搞定spring6全套视频教程（源码级讲解）',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '尚硅谷Spring6教程', url: 'https://www.bilibili.com/video/BV1kR4y1b7Qc' },
          ]}],
        },
        {
          title: 'SpringMVC',
          description: 'SpringMVC教程，一套快速上手spring mvc，springmvc入门到实战',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '尚硅谷SpringMVC教程', url: 'https://www.bilibili.com/video/BV1Ry4y1574R' },
          ]}],
        },
        {
          title: 'MyBatis',
          description: 'MyBatis零基础教程，mybatis快速上手，mybatis入门到项目实战',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '尚硅谷MyBatis零基础入门', url: 'https://www.bilibili.com/video/BV1VP4y1c7j7' },
          ]}],
        },
        {
          title: 'MyBatisPlus',
          description: 'MyBatisPlus教程，一套玩转mybatisplus框架，mybatis-plus轻松上手',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '尚硅谷MyBatisPlus教程', url: 'https://www.bilibili.com/video/BV12R4y157Be' },
          ]}],
        },
        {
          title: 'SSM',
          description: '尚硅谷最新版SSM教程，基于AI的全新ssm框架实战',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '尚硅谷SSM教程（AI版）', url: 'https://www.bilibili.com/video/BV14WtLeDEit' },
          ]}],
        },
        {
          title: 'Redis7',
          description: 'Redis教程，redis7零基础到进阶（附redis大厂面试题）',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '尚硅谷Redis7教程', url: 'https://www.bilibili.com/video/BV13R4y1v7sP' },
          ]}],
        },
        {
          title: 'SpringBoot3',
          description: 'springboot教程，SpringBoot3干活拉满，从零开始轻松拿下面试&加薪',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '尚硅谷SpringBoot3教程', url: 'https://www.bilibili.com/video/BV1Es4y1q7Bf' },
          ]}],
        },
        {
          title: 'SpringCloud',
          description: '尚硅谷SpringCloud教程，springcloud从入门到大牛',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '尚硅谷SpringCloud教程', url: 'https://www.bilibili.com/video/BV1UJc2ezEFU/' },
          ]}],
        },
        {
          title: 'Spring Data JPA',
          optional:true,
          description: 'java进阶教程数据层全栈方案Spring Data高级应用',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '黑马SpringData教程', url: 'https://www.bilibili.com/video/BV1RE41167Pk/' },
          ]}],
        },        
        {
          title: 'SpringSecurity',
          optional:true,
          description: '尚硅谷Java项目SpringSecurity+OAuth2权限管理实战教程',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '尚硅谷SpringSecurity教程', url: 'https://www.bilibili.com/video/BV14b4y1A7Wz' },
          ]}],
        },
      ]
    },
    {
      name: '微服务生态',
      subtitle: '生态',
      children: [
        {
          title: 'Docker',
          description: 'Docker实战教程，跟架构师学docker，docker入门到大神',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '尚硅谷Docker教程', url: 'https://www.bilibili.com/video/BV1Zn4y1X7AZ' },
            { title: 'Docker与微服务实战', url: 'https://www.bilibili.com/video/BV1gr4y1U7CY' },
          ]}],
        },
        {
          title: 'Elasticsearch',
          description: 'ElasticSearch教程入门到精通（基于ELK技术栈elasticsearch 7.x+8.x新特性）',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '尚硅谷ES教程', url: 'https://www.bilibili.com/video/BV1hh411D7sb' },
          ]}],
        },
        {
          title: 'Zookeeper',
          description: '大数据技术之Zookeeper 3.5.7版本教程',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '尚硅谷Zookeeper教程', url: 'https://www.bilibili.com/video/BV1to4y1C7gw' },
          ]}],
        },
        {
          title: 'Nginx',
          description: '尚硅谷Nginx教程（亿级流量nginx架构设计）',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '尚硅谷Nginx教程', url: 'https://www.bilibili.com/video/BV1yS4y1N76R' },
          ]}],
        },
        {
          title: 'RocketMQ',
          description: 'RocketMQ教程丨深度掌握MQ消息中间件',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '尚硅谷RocketMQ教程', url: 'https://www.bilibili.com/video/BV1cf4y157sz' },
          ]}],
        },
        {
          title: 'Git全套教程',
          description: 'Git全套教程，git技术大全（GitHub、Gitee码云、GitLab）',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: 'Git全套教程', url: 'https://www.bilibili.com/video/BV1vy4y1s7k6' },
          ]}],
        },
      ]
    },
    {
    name: '选修内容',
    // subtitle: '选修',
    children:[
      {
          title: 'Netty',
          optional:true,
          description: 'Netty 网络编程框架：NIO/Reactor 模型、编解码、RPC 底层通信基石',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '尚硅谷Netty教程', url: 'https://www.bilibili.com/video/BV1DJ411m7NR' },
          ]}],
        },
      { title: 'MySQL进阶', optional:true, description: 'MySQL 高级调优、索引优化、读写分离、分库分表',
        resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '黑马MySQL进阶教程', url: 'https://www.bilibili.com/video/BV1Kr4y1i7ru' },
        ]}]},
      { title: 'JVM进阶', optional:true, description: '深入 JVM 底层原理、内存模型、GC 调优实战',
        resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '黑马JVM进阶教程', url: 'https://www.bilibili.com/video/BV1r94y1b7eS' },
        ]}]},
      { title: '数据结构与算法', optional:true, description: '数据结构系统学习，大厂面试算法与 LeetCode 刷题',
        resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '黑马数据结构与算法（上）', url: 'https://www.bilibili.com/video/BV1Lv4y1e7HL' },
          { title: '黑马数据结构与算法（下）', url: 'https://www.bilibili.com/video/BV1rv4y1H7o6' },
        ]}]},
      { title: 'SSM进阶', optional:true, description: 'Spring+SpringMVC+MyBatis 整合进阶实战',
        resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '黑马SSM进阶教程', url: 'https://www.bilibili.com/video/BV1Fi4y1S7ix' },
        ]}]},
      { title: 'SpringBoot进阶', optional:true, description: 'SpringBoot 底层原理与高级应用',
        resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '黑马SpringBoot进阶教程', url: 'https://www.bilibili.com/video/BV14z4y1N7pg' },
        ]}]},
      { title: 'Spring高级', optional:true, description: 'Spring 框架源码级深入，IoC/AOP 底层机制',
        resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '黑马Spring高级教程', url: 'https://www.bilibili.com/video/BV1P44y1N7QG' },
        ]}]},
      { title: 'SpringCloud进阶', optional:true, description: '微服务架构深入，服务治理与分布式组件',
        resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '黑马SpringCloud进阶教程', url: 'https://www.bilibili.com/video/BV1kH4y1S7wz' },
        ]}]},
      { title: 'Docker进阶', optional:true, description: '容器化进阶，Docker Compose/K8s 部署实战',
        resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '黑马Docker进阶教程', url: 'https://www.bilibili.com/video/BV1HP4118797' },
        ]}]},
      { title: 'Git', optional:true, description: 'Git 版本控制进阶，分支策略与团队协作',
        resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '黑马Git教程', url: 'https://www.bilibili.com/video/BV1MU4y1Y7h5' },
        ]}]},
      { title: 'Gradle', optional:true, description: '尚硅谷】Gradle教程入门到进阶（从gradle安装到项目实战）',
        resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '尚硅谷Gradle', url: 'https://www.bilibili.com/video/BV1yT41137Y7' },
        ]}]},        
      { title: 'Maven', optional:true, description: 'Maven 构建工具进阶，多模块管理与私服搭建',
        resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '黑马Maven教程', url: 'https://www.bilibili.com/video/BV1Ah411S7ZE' },
        ]}]},
      { title: 'Dubbo', optional:true, description: 'Apache Dubbo RPC 框架，微服务远程调用与治理',
        resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '黑马Dubbo教程', url: 'https://www.bilibili.com/video/BV1VE411q7dX' },
        ]}]},
      { title: 'Zookeeper', optional:true, description: 'Zookeeper 分布式协调服务，集群管理与选主',
        resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '黑马Zookeeper教程', url: 'https://www.bilibili.com/video/BV1M741137qY' },
        ]}]},
      { title: 'Redis进阶', optional:true, description: 'Redis 底层数据结构与高级应用，缓存策略与集群',
        resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '黑马Redis进阶教程', url: 'https://www.bilibili.com/video/BV1cr4y1671t' },
        ]}]},
      { title: 'MongoDB', optional:true, description: 'NoSQL 文档数据库，海量数据存储与高并发读写',
        resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '黑马MongoDB教程', url: 'https://www.bilibili.com/video/BV1bJ411x7mq' },
        ]}]},
      { title: 'RabbitMQ', optional:true, description: 'RabbitMQ 消息中间件，异步解耦与可靠消息投递',
        resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '黑马RabbitMQ教程', url: 'https://www.bilibili.com/video/BV1mN4y1Z7t9' },
        ]}]},
      { title: 'RocketMQ进阶', optional:true, description: 'RocketMQ 消息中间件进阶，事务消息与高可用',
        resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '黑马RocketMQ进阶教程', url: 'https://www.bilibili.com/video/BV1L4411y7mn' },
        ]}]},
    ]
    }
  ]
}
</script>
<ContentView :data="data" />
