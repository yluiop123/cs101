<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: '大数据 / 数据工程',
  description: '大数据领域处理海量数据的采集、存储、计算和分析，是数字化时代的核心基础设施。',

  items: [
    {
      name: '编程与基础',
      subtitle: '必修',
      children: [
        {
          title: 'Java SE 核心',
          description: '集合、IO、多线程、网络编程（大数据框架多基于 JVM）',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 Java 教程", url: "https://www.bilibili.com/video/BV1XT4y1M7Fg", icon: "mdi-play-circle-outline" },
                { title: "Java Full Course", url: "https://www.youtube.com/watch?v=grEKMHGYyns", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "JavaGuide", url: "https://javaguide.cn/", icon: "mdi-file-document-outline" },
                { title: "Java Tutorial", url: "https://docs.oracle.com/javase/tutorial/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Python 基础',
          description: '数据处理脚本编写、爬虫基础（辅助 ETL 开发）',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "黑马程序员 Python 教程", url: "https://www.bilibili.com/video/BV1ex411x7Em", icon: "mdi-play-circle-outline" },
                { title: "Python Full Course", url: "https://www.youtube.com/watch?v=rfscVS0vtbw", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 Python", url: "https://www.runoob.com/python3/python3-tutorial.html", icon: "mdi-file-document-outline" },
                { title: "Python Official Docs", url: "https://docs.python.org/3/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'SQL 进阶',
          description: '复杂查询、窗口函数、CTE、SQL 优化与执行计划',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "SQL 进阶教程", url: "https://www.youtube.com/watch?v=YfW0x0Ln0cM", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "SQL 教程", url: "https://www.runoob.com/sql/sql-tutorial.html", icon: "mdi-file-document-outline" },
                { title: "SQL Window Functions", url: "https://www.postgresql.org/docs/current/tutorial-window.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Linux 操作',
          description: '常用命令、Shell 脚本、权限管理、进程管理',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Linux 教程", url: "https://www.bilibili.com/video/BV1nW411L7xm", icon: "mdi-play-circle-outline" },
                { title: "Linux Full Course", url: "https://www.youtube.com/watch?v=ZtqEdQkrcwA", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Linux 命令大全", url: "https://www.runoob.com/linux/linux-command-manual.html", icon: "mdi-file-document-outline" },
                { title: "Linux Command Guide", url: "https://linuxcommand.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '数据结构与算法',
          description: '排序、Hash、树、分布式场景下的常用算法',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 数据结构教程", url: "https://www.bilibili.com/video/BV1a54y1b74k", icon: "mdi-play-circle-outline" },
                { title: "Algorithms Full Course", url: "https://www.youtube.com/watch?v=8hly31xKli0", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "数据结构与算法", url: "https://www.runoob.com/data-structures/data-structures-tutorial.html", icon: "mdi-file-document-outline" },
                { title: "DSA Tutorial", url: "https://www.geeksforgeeks.org/data-structures/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '数据仓库与建模',
      subtitle: '必修',
      children: [
        {
          title: '数据仓库理论',
          description: '维度建模（星型 / 雪花型）、分层架构（ODS / DWD / DWS / ADS）',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "数据仓库设计", url: "https://www.infoq.cn/article/data-warehouse-design", icon: "mdi-file-document-outline" },
                { title: "Kimball Dimensional Modeling", url: "https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Hive 数据仓库',
          description: 'HiveQL、分区表 / 分桶表、存储格式（Parquet / ORC）',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 Hive 教程", url: "https://www.bilibili.com/video/BV1EZ4y1G7iL", icon: "mdi-play-circle-outline" },
                { title: "Hive Tutorial", url: "https://www.youtube.com/watch?v=Z06h5JThXgA", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Hive 官方文档", url: "https://cwiki.apache.org/confluence/display/Hive", icon: "mdi-file-document-outline" },
                { title: "Hive Language Manual", url: "https://cwiki.apache.org/confluence/display/Hive/LanguageManual", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'HDFS 分布式存储',
          description: '文件读写原理、副本机制、NameNode / DataNode 架构',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "HDFS 架构讲解", url: "https://www.youtube.com/watch?v=1fHZpVFXNBc", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "HDFS 官方文档", url: "https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/HdfsUserGuide.html", icon: "mdi-file-document-outline" },
                { title: "HDFS Architecture", url: "https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '数据采集',
          description: 'Flume / Logstash 日志采集、DataX / Sqoop 数据同步',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "DataX 官方文档", url: "https://github.com/alibaba/DataX", icon: "mdi-file-document-outline" },
                { title: "Sqoop User Guide", url: "https://sqoop.apache.org/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Apache Hudi / Iceberg',
          description: '湖仓一体、ACID 事务、增量查询',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Hudi 官方文档", url: "https://hudi.apache.org/docs/overview", icon: "mdi-file-document-outline" },
                { title: "Apache Iceberg Docs", url: "https://iceberg.apache.org/docs/latest/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '分布式计算',
      subtitle: '必修',
      children: [
        {
          title: 'MapReduce 编程模型',
          description: 'Mapper / Reducer、Shuffle 原理、Combiner',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "MapReduce 教程", url: "https://www.youtube.com/watch?v=ht5F6aMZnNg", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MapReduce 官方文档", url: "https://hadoop.apache.org/docs/stable/hadoop-mapreduce-client/hadoop-mapreduce-client-core/MapReduceTutorial.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Apache Spark 核心',
          description: 'RDD、DataFrame / Dataset、Spark SQL、Spark Streaming',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 Spark 教程", url: "https://www.bilibili.com/video/BV1XQ4y1m7ex", icon: "mdi-play-circle-outline" },
                { title: "Spark Full Course", url: "https://www.youtube.com/watch?v=EXJD1hITtRw", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Apache Spark 官方文档", url: "https://spark.apache.org/docs/latest/", icon: "mdi-file-document-outline" },
                { title: "Spark Programming Guide", url: "https://spark.apache.org/docs/latest/rdd-programming-guide.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Spark 调优',
          description: '内存管理、Shuffle 调优、数据倾斜解决方案',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Spark 性能调优", url: "https://spark.apache.org/docs/latest/tuning.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Apache Flink 核心',
          description: 'DataStream API、时间语义、Watermark、状态管理',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 Flink 教程", url: "https://www.bilibili.com/video/BV1jf4y1U7aQ", icon: "mdi-play-circle-outline" },
                { title: "Flink Tutorial", url: "https://www.youtube.com/watch?v=bbGuhRq-sYk", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Apache Flink 官方文档", url: "https://nightlies.apache.org/flink/flink-docs-stable/zh/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Flink CDC',
          description: '实时数据同步、MySQL Binlog 捕获',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Flink CDC 官方文档", url: "https://ververica.github.io/flink-cdc-connectors/", icon: "mdi-file-document-outline" },
                { title: "CDC Pattern", url: "https://debezium.io/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Presto / Trino',
          description: '联邦查询、跨数据源分析',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Presto 官方文档", url: "https://prestodb.io/docs/current/", icon: "mdi-file-document-outline" },
                { title: "Trino Docs", url: "https://trino.io/docs/current/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '消息队列与实时管道',
      subtitle: '必修',
      children: [
        {
          title: 'Apache Kafka',
          description: '生产者 / 消费者、Topic / Partition、偏移量管理',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 Kafka 教程", url: "https://www.bilibili.com/video/BV1a4411B7B6", icon: "mdi-play-circle-outline" },
                { title: "Kafka Tutorial", url: "https://www.youtube.com/watch?v=U0-1kHMhQmY", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Kafka 官方文档", url: "https://kafka.apache.org/documentation/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Kafka 高阶特性',
          description: '幂等性、事务、Exactly-Once 语义、Kafka Streams',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Kafka 事务与幂等性", url: "https://kafka.apache.org/documentation/#transaction", icon: "mdi-file-document-outline" },
                { title: "Kafka Streams Docs", url: "https://kafka.apache.org/documentation/streams/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '实时数仓架构',
          description: 'Kafka + Flink + ClickHouse 实时管道搭建',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "实时数仓方案", url: "https://developer.aliyun.com/article/773884", icon: "mdi-file-document-outline" },
                { title: "Real-time Data Warehouse", url: "https://www.starburst.io/learn/data-fundamentals/real-time-data-warehouse/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Apache Pulsar',
          description: '多租户、分层存储、计算存储分离',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Pulsar 官方文档", url: "https://pulsar.apache.org/docs/zh-CN/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'RocketMQ',
          description: '事务消息、延时消息、顺序消息',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "RocketMQ 官方文档", url: "https://rocketmq.apache.org/zh/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '调度与数据治理',
      subtitle: '必修',
      children: [
        {
          title: '任务调度',
          description: 'Apache Airflow DAG 编写、Cron 触发、依赖管理',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Airflow 教程", url: "https://www.youtube.com/watch?v=K9AnJ9_ZAXE", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Airflow 官方文档", url: "https://airflow.apache.org/docs/", icon: "mdi-file-document-outline" },
                { title: "Airflow Tutorial", url: "https://airflow.apache.org/docs/apache-airflow/stable/tutorial/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'DolphinScheduler',
          description: '可视化工作流、定时调度、告警机制',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "DolphinScheduler 官方文档", url: "https://dolphinscheduler.apache.org/zh-cn/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '数据治理',
          description: '元数据管理（Atlas）、数据质量（Griffin）、血缘分析',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Apache Atlas 官方文档", url: "https://atlas.apache.org/#", icon: "mdi-file-document-outline" },
                { title: "Data Governance Guide", url: "https://www.dataversity.net/what-is-data-governance/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '数据可视化',
          description: 'Superset / Grafana 搭建报表平台',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Superset 官方文档", url: "https://superset.apache.org/docs/", icon: "mdi-file-document-outline" },
                { title: "Grafana Docs", url: "https://grafana.com/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '数据安全',
          description: '数据脱敏、访问控制、审计日志',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "数据安全指南", url: "https://www.alibabacloud.com/help/zh/dataworks/data-security", icon: "mdi-file-document-outline" },
                { title: "Data Security Best Practices", url: "https://cloud.google.com/security/best-practices", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '大数据平台与架构',
      subtitle: '选修',
      children: [
        {
          title: 'Lambda 架构',
          description: '批流一体化数据处理',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Lambda 架构", url: "https://www.infoq.cn/article/lambda-architecture/", icon: "mdi-file-document-outline" },
                { title: "Lambda Architecture", url: "https://www.oreilly.com/library/view/big-data/9781491943751/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Kappa 架构',
          description: '纯流式数据处理架构',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Kappa 架构", url: "https://www.zhihu.com/question/26354369", icon: "mdi-file-document-outline" },
                { title: "Kappa Architecture", url: "https://www.oreilly.com/radar/questioning-the-lambda-architecture/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'ClickHouse 实时 OLAP',
          description: '列式存储、MergeTree 引擎、查询优化',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "ClickHouse 教程", url: "https://www.bilibili.com/video/BV1iY411s7iF", icon: "mdi-play-circle-outline" },
                { title: "ClickHouse Tutorial", url: "https://www.youtube.com/watch?v=Q49PXJUqDls", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "ClickHouse 官方文档", url: "https://clickhouse.com/docs/zh", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Doris',
          description: '现代化 MPP 分析数据库、StarRocks',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Apache Doris 官方文档", url: "https://doris.apache.org/zh-CN/docs/dev/get-starting/", icon: "mdi-file-document-outline" },
                { title: "StarRocks Docs", url: "https://docs.starrocks.io/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '云原生大数据',
          description: 'EMR / Databricks / Snowflake 云数仓',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Databricks 教程", url: "https://www.youtube.com/watch?v=7U7JI27lYkg", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "AWS EMR 文档", url: "https://aws.amazon.com/cn/emr/", icon: "mdi-file-document-outline" },
                { title: "Snowflake Docs", url: "https://docs.snowflake.com/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
  ],
}
</script>
<ContentView :data="data" />
