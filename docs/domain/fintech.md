<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: '金融科技 / 风控系统',
  description: '金融科技结合金融业务与信息技术，对系统的准确性、安全性和实时性要求极高。涵盖支付系统、风控引擎、量化交易等领域。',

  items: [
    {
      name: '后端开发基础',
      subtitle: '必修',
      children: [
        {
          title: 'Java 核心',
          description: '集合、并发（JUC）、JVM 内存模型与调优',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 Java", url: "https://www.bilibili.com/video/BV1YP4y1o7zW", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "JavaGuide", url: "https://javaguide.cn/", icon: "mdi-file-document-outline" },
                { title: "Java Official Docs", url: "https://docs.oracle.com/en/java/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Spring Boot',
          description: '自动配置、Starter、Actuator、统一异常处理',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Spring Boot 教程", url: "https://www.bilibili.com/video/BV1PE411i7CV", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Spring 官方文档", url: "https://spring.io/projects/spring-boot", icon: "mdi-file-document-outline" },
                { title: "Spring Boot 中文指南", url: "https://springdoc.cn/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Spring Cloud 微服务',
          description: 'Nacos（注册中心/配置中心）、Gateway、Feign、Sentinel',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Sentinel 官方文档", url: "https://sentinelguard.io/", icon: "mdi-file-document-outline" },
                { title: "Spring Cloud 官方文档", url: "https://spring.io/projects/spring-cloud", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'MyBatis / MyBatis-Plus',
          description: 'ORM 映射、分页、多数据源',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MyBatis-Plus 文档", url: "https://baomidou.com/", icon: "mdi-file-document-outline" },
                { title: "MyBatis 官方文档", url: "https://mybatis.org/mybatis-3/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'MySQL 高级',
          description: '索引原理、事务隔离级别、MVCC、分库分表（ShardingSphere）',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MySQL 官方文档", url: "https://dev.mysql.com/doc/", icon: "mdi-file-document-outline" },
                { title: "MySQL 中文教程", url: "https://www.runoob.com/mysql/mysql-tutorial.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '单元测试与集成测试（JUnit + Mockito + H2）',
          description: '',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "必修", url: "https://www.bilibili.com/video/BV1Rv41177Au", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Mockito 文档", url: "https://site.mockito.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Kafka',
          description: 'Topic/Partition 机制、生产者/消费者 API、消息可靠性、幂等性',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Kafka 官方文档", url: "https://kafka.apache.org/documentation/", icon: "mdi-file-document-outline" },
                { title: "Kafka 中文教程", url: "https://www.kafka.org.cn/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'RocketMQ',
          description: '事务消息、顺序消息、延迟消息、死信队列',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "RocketMQ 官方文档", url: "https://rocketmq.apache.org/zh/docs/", icon: "mdi-file-document-outline" },
                { title: "RocketMQ 官方文档", url: "https://rocketmq.apache.org/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '分布式事务',
          description: 'Seata（AT/TCC/Saga）、可靠消息最终一致性方案',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Seata 官方文档", url: "https://seata.apache.org/", icon: "mdi-file-document-outline" },
                { title: "Seata 中文文档", url: "https://seata.apache.org/zh-cn/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '分布式 ID',
          description: '雪花算法、Leaf、号段模式',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "必修", url: "https://www.bilibili.com/video/BV1o54y1q7W8", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Leaf 分布式 ID", url: "https://tech.meituan.com/2017/04/21/mt-leaf.html", icon: "mdi-file-document-outline" },
                { title: "RabbitMQ 与 AMQP 协议场景对比", url: "https://www.rabbitmq.com/documentation.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Flink SQL',
          description: '动态表、维表关联、窗口聚合',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Flink SQL 文档", url: "https://nightlies.apache.org/flink/flink-docs-stable/docs/dev/table/sql/", icon: "mdi-file-document-outline" },
                { title: "规则引擎", url: "https://www.drools.org/learn/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '风控模型',
          description: '规则评分卡（Scorecard）、特征工程、机器学习风控（XGBoost / LightGBM）',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "XGBoost 文档", url: "https://xgboost.readthedocs.io/", icon: "mdi-file-document-outline" },
                { title: "LightGBM 文档", url: "https://lightgbm.readthedocs.io/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '实时特征计算',
          description: '滑动窗口统计、用户画像实时更新'
        },
        {
          title: 'Spark Streaming（微批处理模式）',
          description: '',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Spark Streaming 文档", url: "https://spark.apache.org/docs/latest/streaming-programming-guide.html", icon: "mdi-file-document-outline" },
                { title: "复杂事件处理（CEP）引擎", url: "https://nightlies.apache.org/flink/flink-docs-stable/docs/libs/cep/", icon: "mdi-file-document-outline" },
                { title: "选修", url: "https://developer.aliyun.com/article/1053753", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        }
      ]
    },
    {
      name: '金融业务与合规安全',
      subtitle: '选修',
      children: [
        {
          title: '支付系统设计',
          description: '账户体系、清结算、对账、差错处理',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "支付系统设计", url: "https://www.infoq.cn/article/payment-system-design/", icon: "mdi-file-document-outline" },
                { title: "交易系统", url: "https://icyfenix.cn/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '数据加密与安全',
          description: '国密（SM2/SM3/SM4）、TLS 1.3、HSM 硬件加密',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "国密算法规范", url: "https://www.oscca.gov.cn/", icon: "mdi-file-document-outline" },
                { title: "量化交易入门", url: "https://www.backtrader.com/docu/", icon: "mdi-file-document-outline" }
              ],
            },
            {
              name: "推荐资源",
              items: [
                { title: "监管报送" },
                { title: "审计日志" }
              ],
            }
          ]
        }
      ]
    }
  ]
}
</script>
<ContentView :data="data" />
