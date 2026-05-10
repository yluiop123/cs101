<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: 'Web 开发 / SaaS 应用',
  description: 'Web 开发和 SaaS 是最广泛的软件开发领域，涉及从前端到后端的完整技术栈。',

  items: [
    {
      name: '前端基础入门',
      subtitle: '必修',
      children: [
        {
          title: 'HTML5 + CSS3',
          description: '语义化标签、Flex/Grid 布局、响应式设计',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 HTML+CSS 教程", url: "https://www.bilibili.com/video/BV1Kg4y1i7Fb", icon: "mdi-play-circle-outline" },
                { title: "HTML & CSS Full Course", url: "https://www.youtube.com/watch?v=G3e-cpL7ofc", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MDN Web Docs", url: "https://developer.mozilla.org/zh-CN/docs/Web", icon: "mdi-file-document-outline" },
                { title: "MDN HTML Basics", url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'JavaScript 核心',
          description: 'ES6+ 语法、DOM 操作、异步编程（Promise / async-await）',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 JavaScript 教程", url: "https://www.bilibili.com/video/BV1YW411T7GX", icon: "mdi-play-circle-outline" },
                { title: "JavaScript Full Course", url: "https://www.youtube.com/watch?v=PkZNo7MFNFg", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 JavaScript", url: "https://www.runoob.com/js/js-tutorial.html", icon: "mdi-file-document-outline" },
                { title: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '包管理器与构建工具',
          description: 'npm / yarn、Vite / Webpack 基础配置',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Vite 官方入门教程", url: "https://www.youtube.com/watch?v=KCrXgy8QtjM", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Webpack 中文文档", url: "https://www.webpackjs.com/", icon: "mdi-file-document-outline" },
                { title: "Vite 官方文档", url: "https://vitejs.dev/guide/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'TypeScript 入门',
          description: '类型系统、接口、泛型（前端进阶必备）',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 TypeScript 教程", url: "https://www.bilibili.com/video/BV1Xy4y1v7S2", icon: "mdi-play-circle-outline" },
                { title: "TypeScript Full Course", url: "https://www.youtube.com/watch?v=30LWjhZzg50", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "TypeScript 中文手册", url: "https://www.typescriptlang.org/zh/", icon: "mdi-file-document-outline" },
                { title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '前端框架与工程化',
      subtitle: '必修',
      children: [
        {
          title: 'React 或 Vue 选其一深入',
          description: '组件化、生命周期、Hooks / Composition API',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 React 教程", url: "https://www.bilibili.com/video/BV1wy4y1D7JT", icon: "mdi-play-circle-outline" },
                { title: "React Full Course", url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "React 官方文档", url: "https://zh-hans.react.dev/", icon: "mdi-file-document-outline" },
                { title: "Vue.js 官方教程", url: "https://cn.vuejs.org/guide/introduction.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '前端路由与状态管理',
          description: 'React Router / Vue Router、Redux / Zustand / Pinia',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "React Router 教程", url: "https://www.youtube.com/watch?v=Ul3y1LXx3UY", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "React Router 文档", url: "https://reactrouter.com/", icon: "mdi-file-document-outline" },
                { title: "Redux 官方文档", url: "https://redux.js.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'UI 组件库',
          description: 'Ant Design / Element Plus / ShadCN 快速搭建页面',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Ant Design 官方文档", url: "https://ant.design/index-cn", icon: "mdi-file-document-outline" },
                { title: "ShadCN 官方文档", url: "https://ui.shadcn.com/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Tailwind CSS',
          description: '原子化 CSS 方案，提升样式开发效率',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Tailwind CSS 教程", url: "https://www.youtube.com/watch?v=ft30zcMlFvs", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Tailwind CSS 官方文档", url: "https://tailwindcss.com/docs/installation", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '前端测试',
          description: 'Vitest / Jest、React Testing Library',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Vitest 官方文档", url: "https://cn.vitest.dev/", icon: "mdi-file-document-outline" },
                { title: "Jest 官方文档", url: "https://jestjs.io/docs/getting-started", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '后端核心',
      subtitle: '必修',
      children: [
        {
          title: '选择一门后端语言深入',
          description: 'Java（Spring Boot）或 Python（FastAPI）或 Node.js（Nest.js）',
          groups: [
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
                { title: "JavaGuide", url: "https://javaguide.cn/", icon: "mdi-file-document-outline" },
                { title: "Baeldung Spring Boot", url: "https://www.baeldung.com/spring-boot", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'RESTful API 设计',
          description: '路由、请求校验、状态码、API 文档（Swagger / OpenAPI）',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "REST API 教程", url: "https://www.youtube.com/watch?v=lsMQRaeKNDk", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "RESTful API 设计指南", url: "https://www.ruanyifeng.com/blog/2014/05/restful_api.html", icon: "mdi-file-document-outline" },
                { title: "REST API Tutorial", url: "https://restfulapi.net/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '数据库操作',
          description: 'SQL 基础、ORM（MyBatis / Prisma / SQLAlchemy）、迁移工具',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "SQL 教程", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MyBatis 官方文档", url: "https://mybatis.org/mybatis-3/zh/index.html", icon: "mdi-file-document-outline" },
                { title: "SQLAlchemy Docs", url: "https://docs.sqlalchemy.org/en/20/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '用户认证与授权',
          description: 'JWT、OAuth 2.0、Session 管理',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "JWT Authentication Tutorial", url: "https://www.youtube.com/watch?v=7Q17ubqLmwc", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "JWT 官方文档", url: "https://jwt.io/introduction", icon: "mdi-file-document-outline" },
                { title: "OAuth 2.0 Spec", url: "https://oauth.net/2/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'GraphQL',
          description: 'Apollo Server / Client，灵活的数据查询方案',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "GraphQL 入门", url: "https://www.youtube.com/watch?v=ed8SzALpx1Q", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "GraphQL 中文教程", url: "https://graphql.cn/learn/", icon: "mdi-file-document-outline" },
                { title: "Apollo GraphQL Docs", url: "https://www.apollographql.com/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '数据库与缓存',
      subtitle: '必修',
      children: [
        {
          title: 'MySQL / PostgreSQL',
          description: '表设计、索引优化、事务隔离级别、Explain 分析',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 MySQL 教程", url: "https://www.bilibili.com/video/BV1iq4y1u7vj", icon: "mdi-play-circle-outline" },
                { title: "MySQL Full Course", url: "https://www.youtube.com/watch?v=7S_tz1z_5bA", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MySQL 教程", url: "https://www.runoob.com/mysql/mysql-tutorial.html", icon: "mdi-file-document-outline" },
                { title: "PostgreSQL Docs", url: "https://www.postgresql.org/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Redis',
          description: '缓存策略、分布式锁、Session 共享、数据类型应用',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 Redis 教程", url: "https://www.bilibili.com/video/BV1CJ4m1P7Rz", icon: "mdi-play-circle-outline" },
                { title: "Redis Tutorial", url: "https://www.youtube.com/watch?v=OqCK95ASsQE", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Redis 设计与实现", url: "http://redisbook.com/", icon: "mdi-file-document-outline" },
                { title: "Redis Official Docs", url: "https://redis.io/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'MongoDB',
          description: 'NoSQL 设计模式、聚合管道（适合非结构化数据场景）',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "MongoDB 教程", url: "https://www.bilibili.com/video/BV1bJ411x7Vm", icon: "mdi-play-circle-outline" },
                { title: "MongoDB Full Course", url: "https://www.youtube.com/watch?v=ofme2o29ngU", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MongoDB 官方手册", url: "https://www.mongodb.com/docs/manual/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'ORM 进阶',
          description: 'N+1 查询优化、事务管理、级联操作',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MyBatis-Plus 官方文档", url: "https://baomidou.com/", icon: "mdi-file-document-outline" },
                { title: "Hibernate ORM Docs", url: "https://hibernate.org/orm/documentation/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '全栈整合与部署',
      subtitle: '必修',
      children: [
        {
          title: '前后端联调',
          description: 'Axios / Fetch、跨域处理（CORS）、接口 Mock',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Axios 教程", url: "https://www.youtube.com/watch?v=6LyagkoRWYA", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Axios 中文文档", url: "https://www.axios-http.cn/", icon: "mdi-file-document-outline" },
                { title: "MDN CORS", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Docker 容器化',
          description: 'Dockerfile 编写、docker-compose 多服务编排',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 Docker 教程", url: "https://www.bilibili.com/video/BV1gr4y1U7CY", icon: "mdi-play-circle-outline" },
                { title: "Docker Full Course", url: "https://www.youtube.com/watch?v=3c-iBn73dDE", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Docker 从入门到实践", url: "https://yeasy.gitbook.io/docker_practice/", icon: "mdi-file-document-outline" },
                { title: "Docker Official Docs", url: "https://docs.docker.com/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'CI/CD 基础',
          description: 'GitHub Actions / GitLab CI 自动化构建部署',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "GitHub Actions 教程", url: "https://www.youtube.com/watch?v=R8_veQiYBjI", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "GitHub Actions 官方文档", url: "https://docs.github.com/zh/actions", icon: "mdi-file-document-outline" },
                { title: "GitLab CI Docs", url: "https://docs.gitlab.com/ee/ci/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '云服务部署',
          description: '阿里云 ECS / AWS EC2、Nginx 反向代理、SSL 证书',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "AWS EC2 教程", url: "https://www.youtube.com/watch?v=ASf5_WyYmG8", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "阿里云 ECS 文档", url: "https://help.aliyun.com/product/25365.html", icon: "mdi-file-document-outline" },
                { title: "AWS EC2 Docs", url: "https://docs.aws.amazon.com/ec2/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Serverless',
          description: 'Vercel / AWS Lambda / 云函数，低成本部署方案',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Serverless 教程", url: "https://www.youtube.com/watch?v=W_VV2Fx32_Y", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Vercel 文档", url: "https://vercel.com/docs", icon: "mdi-file-document-outline" },
                { title: "AWS Lambda Docs", url: "https://docs.aws.amazon.com/lambda/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '进阶与架构',
      subtitle: '选修',
      children: [
        {
          title: '微服务架构',
          description: 'Spring Cloud / Nest.js 微服务、服务注册发现',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 Spring Cloud 教程", url: "https://www.bilibili.com/video/BV1Km4y1C7yA", icon: "mdi-play-circle-outline" },
                { title: "Microservices Full Course", url: "https://www.youtube.com/watch?v=rv4LlmLmVWk", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Spring Cloud 官方文档", url: "https://spring.io/projects/spring-cloud#overview", icon: "mdi-file-document-outline" },
                { title: "Microservices.io", url: "https://microservices.io/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '消息队列',
          description: 'RabbitMQ / Kafka 异步通信、削峰填谷',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "RabbitMQ 教程", url: "https://www.bilibili.com/video/BV1cb4y1o7zz", icon: "mdi-play-circle-outline" },
                { title: "Kafka Tutorial", url: "https://www.youtube.com/watch?v=U0-1kHMhQmY", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "RabbitMQ 中文文档", url: "https://www.rabbitmq.com/documentation.html", icon: "mdi-file-document-outline" },
                { title: "Kafka Official Docs", url: "https://kafka.apache.org/documentation/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '性能优化',
          description: '前端懒加载 / 后端缓存 / 数据库查询优化 / CDN',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MDN 前端性能优化", url: "https://developer.mozilla.org/zh-CN/docs/Web/Performance", icon: "mdi-file-document-outline" },
                { title: "Web Performance", url: "https://web.dev/learn/performance/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '监控与日志',
          description: 'Sentry、ELK、Grafana + Prometheus',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Sentry 文档", url: "https://docs.sentry.io/", icon: "mdi-file-document-outline" },
                { title: "Grafana Docs", url: "https://grafana.com/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'SaaS 多租户设计',
          description: '数据库隔离方案、租户路由、计费系统',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Azure 多租户架构", url: "https://learn.microsoft.com/zh-cn/azure/architecture/guide/multitenant/overview", icon: "mdi-file-document-outline" },
                { title: "Multi-tenant Architecture", url: "https://docs.microsoft.com/en-us/azure/architecture/guide/multitenant/overview", icon: "mdi-file-document-outline" }
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
