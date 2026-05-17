<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: '软件测试 / QA',
  description: '软件测试是保证软件质量的关键环节，从手工测试到自动化测试，覆盖面广泛。掌握测试技能可以显著提升软件交付的质量和效率。',

  items: [
    {
      name: '测试理论基础',
      subtitle: '必修',
      children: [
        {
          title: '软件测试基础',
          description: '测试目的、测试原则、测试类型（功能 / 非功能）',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "软件测试入门", url: "https://www.bilibili.com/video/BV1Cv411Y7S6", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "软件测试基础", url: "https://www.runoob.com/w3cnote/software-testing.html", icon: "mdi-file-document-outline" },
                { title: "ISTQB 官方", url: "https://www.istqb.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '测试设计方法',
          description: '等价类划分、边界值分析、因果图、正交实验法',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "必修", url: "https://www.bilibili.com/video/BV1kb411j7J8", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "测试设计方法", url: "https://www.cnblogs.com/softwaretesting/", icon: "mdi-file-document-outline" },
                { title: "测试用例编写", url: "https://www.51testing.com/", icon: "mdi-file-document-outline" }
              ],
            },
            {
              name: "推荐资源",
              items: [
                { title: "测试流程" },
                { title: "Bug 生命周期" },
                { title: "测试文档" },
                { title: "探索性测试与基于风险的测试策略" }
              ],
            }
          ]
        },
        {
          title: 'HTTP 协议',
          description: '请求方法（GET / POST / PUT / DELETE）、状态码、Headers',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MDN HTTP 文档", url: "https://developer.mozilla.org/zh-CN/docs/Web/HTTP", icon: "mdi-file-document-outline" },
                { title: "RestAssured（Java）", url: "https://rest-assured.io/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Supertest（Node.js）',
          description: 'Express / Koa 接口测试',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "必修", url: "https://www.bilibili.com/video/BV1kb411j7J8", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Supertest 文档", url: "https://github.com/ladjs/supertest", icon: "mdi-file-document-outline" },
                { title: "Mock 服务", url: "https://wiremock.org/docs/", icon: "mdi-file-document-outline" }
              ],
            },
            {
              name: "推荐资源",
              items: [
                { title: "接口测试框架搭建" },
                { title: "GraphQL 接口测试" }
              ],
            }
          ]
        },
        {
          title: 'Playwright',
          description: '多浏览器支持、自动等待、网络拦截、截图对比',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Playwright 官方文档", url: "https://playwright.dev/docs/intro", icon: "mdi-file-document-outline" },
                { title: "Playwright 中文文档", url: "https://playwright.dev/zh-cn/docs/intro", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Cypress',
          description: '端到端测试、时间旅行调试、Dashboard 集成',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Cypress 官方文档", url: "https://docs.cypress.io/", icon: "mdi-file-document-outline" },
                { title: "Cypress 中文文档", url: "https://docs.cypress.io/zh-cn/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '数据驱动测试',
          description: 'Excel / CSV / YAML 数据源 + TestNG 参数化 / Pytest parametrize',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Pytest 官方文档", url: "https://docs.pytest.org/", icon: "mdi-file-document-outline" },
                { title: "Pytest 中文文档", url: "https://docs.pytest.org/zh-cn/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '持续集成集成',
          description: 'Jenkins / GitHub Actions 触发自动化测试',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "GitHub Actions 文档", url: "https://docs.github.com/zh/actions", icon: "mdi-file-document-outline" },
                { title: "Appium（移动端自动化测试）", url: "https://appium.io/docs/en/latest/", icon: "mdi-file-document-outline" },
                { title: "必修", url: "https://www.guru99.com/performance-testing.html", icon: "mdi-file-document-outline" }
              ],
            },
            {
              name: "推荐资源",
              items: [
                { title: "爬虫辅助" }
              ],
            }
          ]
        },
        {
          title: 'k6',
          description: 'JavaScript 脚本、指标监控、阈值设定、云执行',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "k6 官方文档", url: "https://k6.io/docs/", icon: "mdi-file-document-outline" },
                { title: "k6 入门指南", url: "https://grafana.com/docs/k6/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '性能瓶颈分析',
          description: 'CPU / 内存 / 磁盘 / 网络 / 数据库慢查询',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "性能分析指南", url: "https://www.brendangregg.com/linuxperf.html", icon: "mdi-file-document-outline" },
                { title: "APM 工具", url: "https://arthas.aliyun.com/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Gatling（Scala 编写的高性能测试框架）',
          description: '',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Gatling 官方文档", url: "https://gatling.io/docs/", icon: "mdi-file-document-outline" },
                { title: "Locust（Python 分布式压测工具）", url: "https://docs.locust.io/", icon: "mdi-file-document-outline" },
                { title: "选修", url: "https://junit.org/junit5/docs/current/user-guide/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'BDD（行为驱动开发）',
          description: 'Cucumber / SpecFlow / Behave 框架',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Cucumber 官方文档", url: "https://cucumber.io/docs/", icon: "mdi-file-document-outline" },
                { title: "Behave 文档", url: "https://behave.readthedocs.io/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '持续测试',
          description: '流水线中分层测试策略（单元/集成/E2E）',
          optional: true
        },
        {
          title: '代码覆盖率',
          description: 'JaCoCo / Istanbul / Coverage.py',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "JaCoCo 文档", url: "https://www.jacoco.org/jacoco/trunk/doc/", icon: "mdi-file-document-outline" },
                { title: "质量门禁", url: "https://docs.sonarqube.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '测试左移',
          description: '静态代码分析、代码审查、开发者测试',
          optional: true
        }
      ]
    }
  ]
}
</script>
<ContentView :data="data" />
