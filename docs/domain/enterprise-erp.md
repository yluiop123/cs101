<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: '企业系统（ERP/CRM/OA）',
  description: '企业级系统对稳定性、安全性和数据一致性要求极高，通常采用成熟的架构方案。',

  items: [
    {
      name: '编程与数据库基础',
      subtitle: '必修',
      children: [
        {
          title: 'Java 核心基础',
          description: '面向对象、集合框架、IO、多线程、异常处理',
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
          title: 'SQL 与关系数据库',
          description: 'MySQL 增删改查、多表 JOIN、子查询、事务、索引',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 MySQL 教程", url: "https://www.bilibili.com/video/BV1iq4y1u7vj", icon: "mdi-play-circle-outline" },
                { title: "SQL Full Course", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MySQL 教程", url: "https://www.runoob.com/mysql/mysql-tutorial.html", icon: "mdi-file-document-outline" },
                { title: "SQL Tutorial", url: "https://www.w3schools.com/sql/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'JDBC / 连接池',
          description: '数据库连接管理、HikariCP / Druid 配置优化',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Druid 官方文档", url: "https://github.com/alibaba/druid/wiki", icon: "mdi-file-document-outline" },
                { title: "HikariCP Docs", url: "https://github.com/brettwooldridge/HikariCP", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Maven / Gradle',
          description: '项目构建、依赖管理、多模块配置',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Maven 教程", url: "https://www.bilibili.com/video/BV1fW411H7w6", icon: "mdi-play-circle-outline" },
                { title: "Gradle Tutorial", url: "https://www.youtube.com/watch?v=-dtcIn2uoSk", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Maven 官方文档", url: "https://maven.apache.org/guides/index.html", icon: "mdi-file-document-outline" },
                { title: "Gradle Docs", url: "https://docs.gradle.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        }
      ]
    },
    {
      name: '后端框架与业务开发',
      subtitle: '必修',
      children: [
        {
          title: 'Spring Boot 核心',
          description: 'IoC / DI、AOP、自动配置、YAML 配置',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 Spring Boot 教程", url: "https://www.bilibili.com/video/BV1gV4y1C7n7", icon: "mdi-play-circle-outline" },
                { title: "Spring Boot Quick Start", url: "https://www.youtube.com/playlist?list=PLqqD43D6Mqzjm6YlX7O1Ng3b0hPM7JSkI", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Spring Boot 官方文档", url: "https://spring.io/projects/spring-boot#learn", icon: "mdi-file-document-outline" },
                { title: "Baeldung Spring Boot", url: "https://www.baeldung.com/spring-boot", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'MyBatis / MyBatis-Plus',
          description: 'ORM 映射、动态 SQL、分页、代码生成器',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "MyBatis-Plus 教程", url: "https://www.bilibili.com/video/BV1PD4y1o7S7", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MyBatis-Plus 官方文档", url: "https://baomidou.com/", icon: "mdi-file-document-outline" },
                { title: "MyBatis Docs", url: "https://mybatis.org/mybatis-3/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Spring MVC',
          description: 'REST API、拦截器、统一异常处理、参数校验',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Spring MVC 教程", url: "https://www.youtube.com/watch?v=W0DBJ2m7hPs", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Spring MVC 官方文档", url: "https://docs.spring.io/spring-framework/reference/web.html", icon: "mdi-file-document-outline" },
                { title: "Spring MVC Guide", url: "https://spring.io/guides/gs/serving-web-content/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '业务建模',
          description: '实体关系设计（ER 图）、业务分层（Controller / Service / DAO）',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "业务建模方法", url: "https://www.zhihu.com/question/19759547", icon: "mdi-file-document-outline" },
                { title: "Domain-Driven Design", url: "https://domaindrivendesign.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Spring Data JPA / Hibernate',
          description: 'JPA 规范、级联、JPQL 查询',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Spring Data JPA 官方文档", url: "https://spring.io/projects/spring-data-jpa#learn", icon: "mdi-file-document-outline" },
                { title: "Hibernate ORM Docs", url: "https://hibernate.org/orm/documentation/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        }
      ]
    },
    {
      name: '权限系统与工作流',
      subtitle: '必修',
      children: [
        {
          title: 'RBAC 权限模型',
          description: '用户 / 角色 / 权限表设计、Spring Security / Shiro',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Spring Security 教程", url: "https://www.youtube.com/watch?v=TNt3GHuayXs", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Spring Security 官方文档", url: "https://spring.io/projects/spring-security#learn", icon: "mdi-file-document-outline" },
                { title: "Baeldung Spring Security", url: "https://www.baeldung.com/security-spring", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '数据权限',
          description: '行级权限过滤、部门数据隔离、数据脱敏',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MyBatis-Plus 数据权限", url: "https://baomidou.com/pages/ba298b/", icon: "mdi-file-document-outline" },
                { title: "Data Masking Guide", url: "https://www.imperva.com/learn/data-security/data-masking/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '操作审计',
          description: '操作日志记录、变更追踪、AOP 实现日志切面',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "AOP 日志教程", url: "https://www.bilibili.com/video/BV1G4411c7N4", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Spring AOP 官方文档", url: "https://docs.spring.io/spring-framework/reference/core/aop.html", icon: "mdi-file-document-outline" },
                { title: "工作流引擎", url: "https://flowable.com/open-source/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '动态表单',
          description: '自定义表单设计器、表单与流程绑定',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Form Generator", url: "https://github.com/JakHuang/form-generator", icon: "mdi-file-document-outline" },
                { title: "Vue Form Builder", url: "https://formbuilder.online/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        }
      ]
    },
    {
      name: '前端与报表',
      subtitle: '必修',
      children: [
        {
          title: 'Vue 或 React 企业级开发',
          description: '配合 Ant Design / Element Plus 搭建管理后台',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 Vue 教程", url: "https://www.bilibili.com/video/BV1Zy4y1K7SH", icon: "mdi-play-circle-outline" },
                { title: "React Admin Tutorial", url: "https://www.youtube.com/watch?v=5LrDIWYKK58", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Ant Design Vue", url: "https://next.antdv.com/docs/vue/getting-started-cn", icon: "mdi-file-document-outline" },
                { title: "RuoYi-Vue 开源框架", url: "https://gitee.com/y_project/RuoYi-Vue", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '动态报表',
          description: 'Apache POI / EasyExcel 导入导出、JasperReports / 帆软',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "EasyExcel 教程", url: "https://www.bilibili.com/video/BV1FY4y1S7Aq", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "EasyExcel 官方文档", url: "https://easyexcel.opensource.alibaba.com/", icon: "mdi-file-document-outline" },
                { title: "Apache POI Docs", url: "https://poi.apache.org/components/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '数据可视化',
          description: 'ECharts / AntV 图表库、大屏展示',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "ECharts 教程", url: "https://www.bilibili.com/video/BV1vZ4y1M7mQ", icon: "mdi-play-circle-outline" },
                { title: "ECharts Tutorial", url: "https://www.youtube.com/watch?v=Qhe3w0NM_rI", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "ECharts 官方教程", url: "https://echarts.apache.org/zh/tutorial.html", icon: "mdi-file-document-outline" },
                { title: "AntV 官方文档", url: "https://antv.vision/zh", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '低代码平台',
          description: '表单设计器、流程配置、页面拖拽搭建',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "JeecgBoot 低代码平台", url: "https://www.jeecg.com/", icon: "mdi-file-document-outline" },
                { title: "Low-Code Guide", url: "https://www.gartner.com/en/information-technology/glossary/low-code-development-platform", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        }
      ]
    },
    {
      name: '微服务与分布式架构',
      subtitle: '必修',
      children: [
        {
          title: 'Spring Cloud 微服务',
          description: 'Nacos 注册中心 / 配置中心、Gateway 网关',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 Spring Cloud 教程", url: "https://www.bilibili.com/video/BV1Km4y1C7yA", icon: "mdi-play-circle-outline" },
                { title: "Spring Cloud Tutorial", url: "https://www.youtube.com/watch?v=Q1R8pXP2fuY", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Spring Cloud Alibaba 官方文档", url: "https://sca.aliyun.com/", icon: "mdi-file-document-outline" },
                { title: "Spring Cloud Docs", url: "https://spring.io/projects/spring-cloud#learn", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Feign / OpenFeign',
          description: '服务间远程调用、负载均衡',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "OpenFeign 官方文档", url: "https://spring.io/projects/spring-cloud-openfeign#learn", icon: "mdi-file-document-outline" },
                { title: "Feign GitHub", url: "https://github.com/OpenFeign/feign", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '分布式事务',
          description: 'Seata、TCC 模式、可靠消息最终一致性',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Seata 教程", url: "https://www.bilibili.com/video/BV1iL4y1Y7M1", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Seata 官方文档", url: "https://seata.io/zh-cn/", icon: "mdi-file-document-outline" },
                { title: "Distributed Transactions", url: "https://www.baeldung.com/transactions-intro", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '接口幂等性与防重',
          description: '幂等表、Redis 分布式锁、Token 机制',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "接口幂等性设计", url: "https://javaguide.cn/system-design/idempotent.html", icon: "mdi-file-document-outline" },
                { title: "Idempotency Guide", url: "https://stripe.com/blog/idempotency", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Sentinel 熔断限流',
          description: '流量控制、熔断降级、系统自适应保护',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Sentinel 官方文档", url: "https://sentinelguard.io/zh-cn/", icon: "mdi-file-document-outline" },
                { title: "Sentinel GitHub", url: "https://github.com/alibaba/Sentinel", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        }
      ]
    },
    {
      name: '企业集成与运维',
      subtitle: '选修',
      children: [
        {
          title: 'SOA / ESB 集成',
          description: '企业服务总线、异构系统对接（SAP / 金蝶 / 用友）',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "SOA 架构", url: "https://www.ibm.com/cloud/learn/soa", icon: "mdi-file-document-outline" },
                { title: "ESB Pattern", url: "https://www.enterpriseintegrationpatterns.com/patterns/messaging/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '定时任务调度',
          description: 'XXL-JOB / Quartz 分布式调度',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "XXL-JOB 官方文档", url: "https://www.xuxueli.com/xxl-job/", icon: "mdi-file-document-outline" },
                { title: "Quartz Scheduler Docs", url: "http://www.quartz-scheduler.org/documentation/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '缓存架构',
          description: 'Redis 多级缓存、缓存穿透 / 击穿 / 雪崩解决方案',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Redis 缓存实战", url: "https://www.bilibili.com/video/BV1CJ4m1P7Rz", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Redis 缓存设计", url: "https://javaguide.cn/database/redis/redis-cache-design.html", icon: "mdi-file-document-outline" },
                { title: "Caching Patterns", url: "https://redis.io/docs/manual/caching/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '高可用设计',
          description: '数据库主从、读写分离、多活架构、备份恢复',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MySQL 高可用", url: "https://developer.aliyun.com/article/717193", icon: "mdi-file-document-outline" },
                { title: "High Availability Guide", url: "https://docs.microsoft.com/en-us/azure/architecture/framework/resiliency/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '容器化部署',
          description: 'Docker + K8s 部署微服务、Helm Charts',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Kubernetes 教程", url: "https://www.bilibili.com/video/BV1Qv4y1T7Fv", icon: "mdi-play-circle-outline" },
                { title: "Docker K8s Tutorial", url: "https://www.youtube.com/watch?v=X48VuDVv0do", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Kubernetes 官方文档", url: "https://kubernetes.io/zh-cn/docs/", icon: "mdi-file-document-outline" },
                { title: "Helm Docs", url: "https://helm.sh/docs/", icon: "mdi-file-document-outline" }
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
