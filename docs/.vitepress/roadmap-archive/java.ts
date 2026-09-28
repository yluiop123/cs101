// 技术路线数据（卡片与拓展资源）。当前页面渲染站内教程，此数据暂未被引用，保留备用。
export default {
  name: 'Java 技术路线',
  description: 'Java 全栈技术图谱，涵盖从基础到架构、微服务与云原生生态',

  items: [
    {
      name: '入门 · 环境与语法基础',
      subtitle: '必修',
      children: [
        {
          title: 'Java',
          description: '无需编程基础，跟着 15 章从零走到第一个 Web 项目',
          resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [
            { title: '教程封面 · Java', url: '/tutorials/java/' },
            { title: '初识 Java', url: '/tutorials/java/01-intro' },
            { title: '基础语法与流程控制', url: '/tutorials/java/02-basic-syntax' },
            { title: '数组与字符串', url: '/tutorials/java/03-arrays-strings' },
            { title: '面向对象：类与对象', url: '/tutorials/java/04-oop-classes' },
            { title: '继承、多态与抽象类', url: '/tutorials/java/05-inheritance-polymorphism' },
            { title: '接口与内部类', url: '/tutorials/java/06-interfaces' },
            { title: '异常处理', url: '/tutorials/java/07-exceptions' },
            { title: '常用 API 与工具类', url: '/tutorials/java/08-common-api' },
            { title: '集合框架', url: '/tutorials/java/09-collections' },
            { title: '泛型深入', url: '/tutorials/java/10-generics' },
            { title: 'IO 与文件', url: '/tutorials/java/11-io-files' },
            { title: '多线程基础', url: '/tutorials/java/12-threads' },
            { title: '线程池与并发工具', url: '/tutorials/java/13-concurrency' },
            { title: '反射与注解', url: '/tutorials/java/14-reflection-annotations' },
            { title: 'Maven、JVM 入门与综合实战', url: '/tutorials/java/15-maven-jvm-project' },
          ]}],
        },
        {
          title: 'Java基础',
          description: 'Java视频教程，java入门神器（附300道Java面试题剖析）',
          resources: [
            { name: '站内教程', icon: 'mdi-book-open-variant', items: [
              { title: '初识 Java', url: '/tutorials/java/01-intro' },
              { title: '基础语法与流程控制', url: '/tutorials/java/02-basic-syntax' },
              { title: '数组与字符串', url: '/tutorials/java/03-arrays-strings' },
              { title: '面向对象：类与对象', url: '/tutorials/java/04-oop-classes' },
              { title: '继承、多态与抽象类', url: '/tutorials/java/05-inheritance-polymorphism' },
              { title: '接口与内部类', url: '/tutorials/java/06-interfaces' },
              { title: '异常处理', url: '/tutorials/java/07-exceptions' },
              { title: '常用 API 与工具类', url: '/tutorials/java/08-common-api' },
            ]},
            { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
              { title: '尚硅谷Java教程- 宋红康）', url: 'https://www.bilibili.com/video/BV1PY411e7J6/' },
            ]},
          ],
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
          resources: [
            { name: '站内教程', icon: 'mdi-book-open-variant', items: [
              { title: 'Maven、JVM 入门与综合实战', url: '/tutorials/java/15-maven-jvm-project' },
            ]},
            { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
              { title: '尚硅谷Maven教程', url: 'https://www.bilibili.com/video/BV1JN411G7gX' },
            ]},
          ],
        },
      ]
    },
    {
      name: '进阶 · 核心机制与标准库',
      subtitle: '必修',
      children: [
        {
          title: '面向对象三大特性与多态实现机制',
          description: '封装继承多态，虚方法表与动态绑定的运行时机制',
          resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [
            { title: '面向对象：类与对象', url: '/tutorials/java/04-oop-classes' },
            { title: '继承、多态与抽象类', url: '/tutorials/java/05-inheritance-polymorphism' },
            { title: '接口与内部类', url: '/tutorials/java/06-interfaces' },
          ]}],
        },
        {
          title: '异常体系（checked/unchecked）',
          description: '异常分类、调用栈与 try-with-resources 的正确用法',
          resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [
            { title: '异常处理', url: '/tutorials/java/07-exceptions' },
          ]}],
        },
        {
          title: '集合框架源码级',
          description: 'ArrayList/HashMap 扩容机制与红黑树转换条件',
          resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [
            { title: '集合框架', url: '/tutorials/java/09-collections' },
          ]}],
        },
        {
          title: '泛型与类型擦除',
          description: '通配符、边界约束以及擦除带来的限制与绕过套路',
          resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [
            { title: '泛型深入', url: '/tutorials/java/10-generics' },
          ]}],
        },
        {
          title: 'IO 流与 NIO/AIO',
          description: '流的装饰器体系、缓冲、字符集与通道缓冲区模型',
          resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [
            { title: 'IO 与文件', url: '/tutorials/java/11-io-files' },
          ]}],
        },
        {
          title: '反射与注解',
          description: '运行时获取类结构，注解处理器与框架的底层入口',
          resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [
            { title: '反射与注解', url: '/tutorials/java/14-reflection-annotations' },
          ]}],
        },
        {
          title: 'SPI 机制',
          description: 'ServiceLoader 面向接口的插件式扩展与加载顺序',
        },
        {
          title: '序列化',
          description: 'Serializable、serialVersionUID 与常见替代方案',
          resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [
            { title: 'IO 与文件', url: '/tutorials/java/11-io-files' },
          ]}],
        },
        {
          title: '日期时间与 Optional',
          description: 'java.time 不可变时间 API 与空值安全容器',
          resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [
            { title: '常用 API 与工具类', url: '/tutorials/java/08-common-api' },
          ]}],
        },
        {
          title: 'Lambda 与 Stream API',
          description: '函数式接口、流式管道与常见收集归约操作',
          resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [
            { title: '集合框架', url: '/tutorials/java/09-collections' },
          ]}],
        },
        {
          title: 'Java 新特性（Records/Sealed/模式匹配）',
          description: '记录类、密封类与模式匹配等现代语法演进',
        },
        {
          title: '数据结构与算法',
          optional: true,
          description: '数据结构系统学习，大厂面试算法与 LeetCode 刷题',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '黑马数据结构与算法（上）', url: 'https://www.bilibili.com/video/BV1Lv4y1e7HL' },
            { title: '黑马数据结构与算法（下）', url: 'https://www.bilibili.com/video/BV1rv4y1H7o6' },
          ]}],
        },
      ]
    },
    {
      name: '精通 · 并发、内存与性能',
      subtitle: '必修',
      children: [
        {
          title: 'JMM 与 volatile',
          description: '可见性、原子性、有序性与内存屏障的作用边界',
          resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [
            { title: '多线程基础', url: '/tutorials/java/12-threads' },
          ]}],
        },
        {
          title: 'JUC 并发工具',
          description: 'Lock/Condition/AQS 与三大同步器的工作原理',
          resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [
            { title: '线程池与并发工具', url: '/tutorials/java/13-concurrency' },
          ]}],
        },
        {
          title: '线程池 7 参数与拒绝策略',
          description: '核心线程数计算、队列选择与四种拒绝策略',
          resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [
            { title: '线程池与并发工具', url: '/tutorials/java/13-concurrency' },
          ]}],
        },
        {
          title: 'synchronized 锁升级',
          description: '偏向锁、轻量级锁到重量级锁的膨胀与降级过程',
          resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [
            { title: '多线程基础', url: '/tutorials/java/12-threads' },
          ]}],
        },
        {
          title: 'JVM 内存区域与对象布局',
          description: '堆栈方法区划分、对象头、逃逸分析与内存分配',
          resources: [{ name: '站内教程', icon: 'mdi-book-open-variant', items: [
            { title: 'Maven、JVM 入门与综合实战', url: '/tutorials/java/15-maven-jvm-project' },
          ]}],
        },
        {
          title: '垃圾回收器（G1/ZGC）与调优',
          description: '回收算法、分代收集与停顿目标调优实战',
        },
        {
          title: '类加载机制与双亲委派',
          description: '加载阶段、类加载器层次与打破委派的场景',
        },
        {
          title: 'JVM 参数与线上问题排查',
          description: '关键参数、dump 分析与 CPU/内存/OOM 定位路径',
        },
        {
          title: '虚拟线程（Project Loom）',
          description: '协作式调度与结构化并发对线程池模型的改变',
        },
        {
          title: 'JVM',
          description: '尚硅谷JVM全套教程（详解java虚拟机）',
          resources: [
            { name: '站内教程', icon: 'mdi-book-open-variant', items: [
              { title: 'Maven、JVM 入门与综合实战', url: '/tutorials/java/15-maven-jvm-project' },
            ]},
            { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
              { title: '尚硅谷宋红康JVM全套', url: 'https://www.bilibili.com/video/BV1PJ411n7xZ' },
            ]},
          ],
        },
        {
          title: 'JVM进阶',
          optional: true,
          description: '深入 JVM 底层原理、内存模型、GC 调优实战',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '黑马JVM进阶教程', url: 'https://www.bilibili.com/video/BV1r94y1b7eS' },
          ]}]},
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
      name: '实战与生态 · 框架、工程化与部署',
      subtitle: '选修',
      children: [
        {
          title: 'Spring 事务与传播机制',
          description: '七种传播行为、隔离级别与事务失效的典型场景',
        },
        {
          title: '单元测试（JUnit5/Mockito）',
          description: '测试金字塔、Mock 注入与 Spring 切片测试',
        },
        {
          title: '日志框架（SLF4J/Logback）',
          description: '门面与实现分离、滚动策略与异步日志配置',
        },
        {
          title: '代码质量（Checkstyle/Sonar）',
          description: '规范检查、静态扫描与质量门禁接入流水线',
          optional: true,
        },
        {
          title: '分布式事务',
          description: '2PC、TCC、本地消息表与最终一致性方案对比',
          optional: true,
        },
        {
          title: 'DDD 与分层架构',
          description: '聚合根、限界上下文与六边形架构落地方式',
          optional: true,
        },
        {
          title: 'GraalVM Native Image',
          description: 'AOT 编译、封闭世界假设与反射配置适配',
          optional: true,
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
          title: 'JavaWeb',
          description: 'JavaWeb全套教程，javaweb真正主流技术栈，直接上手独立开发项目',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '尚硅谷JavaWeb全新版', url: 'https://www.bilibili.com/video/BV1UN411x7xe' },
          ]}],
        },
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
        {
          title: 'Netty',
          optional:true,
          description: 'Netty 网络编程框架：NIO/Reactor 模型、编解码、RPC 底层通信基石',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '尚硅谷Netty教程', url: 'https://www.bilibili.com/video/BV1DJ411m7NR' },
          ]}],
        },
        {
          title: 'MySQL进阶', optional:true, description: 'MySQL 高级调优、索引优化、读写分离、分库分表',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '黑马MySQL进阶教程', url: 'https://www.bilibili.com/video/BV1Kr4y1i7ru' },
          ]}]},
        {
          title: 'SSM进阶', optional:true, description: 'Spring+SpringMVC+MyBatis 整合进阶实战',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '黑马SSM进阶教程', url: 'https://www.bilibili.com/video/BV1Fi4y1S7ix' },
          ]}]},
        {
          title: 'SpringBoot进阶', optional:true, description: 'SpringBoot 底层原理与高级应用',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '黑马SpringBoot进阶教程', url: 'https://www.bilibili.com/video/BV14z4y1N7pg' },
          ]}]},
        {
          title: 'Spring高级', optional:true, description: 'Spring 框架源码级深入，IoC/AOP 底层机制',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '黑马Spring高级教程', url: 'https://www.bilibili.com/video/BV1P44y1N7QG' },
          ]}]},
        {
          title: 'SpringCloud进阶', optional:true, description: '微服务架构深入，服务治理与分布式组件',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '黑马SpringCloud进阶教程', url: 'https://www.bilibili.com/video/BV1kH4y1S7wz' },
          ]}]},
        {
          title: 'Docker进阶', optional:true, description: '容器化进阶，Docker Compose/K8s 部署实战',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '黑马Docker进阶教程', url: 'https://www.bilibili.com/video/BV1HP4118797' },
          ]}]},
        {
          title: 'Git', optional:true, description: 'Git 版本控制进阶，分支策略与团队协作',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '黑马Git教程', url: 'https://www.bilibili.com/video/BV1MU4y1Y7h5' },
          ]}]},
        {
          title: 'Gradle', optional:true, description: '尚硅谷】Gradle教程入门到进阶（从gradle安装到项目实战）',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '尚硅谷Gradle', url: 'https://www.bilibili.com/video/BV1yT41137Y7' },
          ]}]},
        {
          title: 'Maven', optional:true, description: 'Maven 构建工具进阶，多模块管理与私服搭建',
          resources: [
            { name: '站内教程', icon: 'mdi-book-open-variant', items: [
              { title: 'Maven、JVM 入门与综合实战', url: '/tutorials/java/15-maven-jvm-project' },
            ]},
            { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
              { title: '黑马Maven教程', url: 'https://www.bilibili.com/video/BV1Ah411S7ZE' },
            ]},
          ]},
        {
          title: 'Dubbo', optional:true, description: 'Apache Dubbo RPC 框架，微服务远程调用与治理',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '黑马Dubbo教程', url: 'https://www.bilibili.com/video/BV1VE411q7dX' },
          ]}]},
        {
          title: 'Zookeeper', optional:true, description: 'Zookeeper 分布式协调服务，集群管理与选主',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '黑马Zookeeper教程', url: 'https://www.bilibili.com/video/BV1M741137qY' },
          ]}]},
        {
          title: 'Redis进阶', optional:true, description: 'Redis 底层数据结构与高级应用，缓存策略与集群',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '黑马Redis进阶教程', url: 'https://www.bilibili.com/video/BV1cr4y1671t' },
          ]}]},
        {
          title: 'MongoDB', optional:true, description: 'NoSQL 文档数据库，海量数据存储与高并发读写',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '黑马MongoDB教程', url: 'https://www.bilibili.com/video/BV1bJ411x7mq' },
          ]}]},
        {
          title: 'RabbitMQ', optional:true, description: 'RabbitMQ 消息中间件，异步解耦与可靠消息投递',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '黑马RabbitMQ教程', url: 'https://www.bilibili.com/video/BV1mN4y1Z7t9' },
          ]}]},
        {
          title: 'RocketMQ进阶', optional:true, description: 'RocketMQ 消息中间件进阶，事务消息与高可用',
          resources: [{ name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '黑马RocketMQ进阶教程', url: 'https://www.bilibili.com/video/BV1L4411y7mn' },
          ]}]},
      ]
    }
  ]
}
