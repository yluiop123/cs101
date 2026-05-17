<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'Postman',
  description: '最流行的 API 开发和测试平台，提供图形化接口调试、集合管理与自动化测试功能。',

  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: '工具简介',
          description: 'Postman 是国内外最广泛使用的 API 调试工具，始于 2012 年作为 Chrome 插件，现已发展为功能全面的 API 开发协作平台。它支持 REST、GraphQL、gRPC、WebSocket 等多种协议，提供请求构造、集合管理、环境变量、自动化测试、Mock Server、API 文档生成和团队协作等全链路能力。',
          groups: [
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Postman 官网', url: 'https://www.postman.com/', icon: 'mdi-file-document-outline' },
                { title: 'Postman 文档', url: 'https://learning.postman.com/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '安装方式',
          description: 'Postman 提供 Windows、macOS、Linux 桌面客户端，也支持 Web 版。建议安装桌面客户端以获得完整功能体验。',
          groups: [
            {
              name: '下载',
              icon: 'mdi-download',
              items: [
                { title: 'Postman 下载', url: 'https://www.postman.com/downloads/', icon: 'mdi-download' }
              ]
            }
          ]
        }
      ]
    },
    {
      name: '核心功能',
      children: [
        {
          title: '请求构造与发送',
          description: '支持所有主流 HTTP 方法（GET、POST、PUT、DELETE、PATCH 等），可配置请求头、请求体（form-data、x-www-form-urlencoded、raw JSON/XML、binary）、认证方式（API Key、Bearer Token、OAuth 1.0/2.0）等。响应区提供格式化查看（JSON/XML/HTML）、Cookies 和请求耗时分析。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '发送第一个请求', url: 'https://learning.postman.com/docs/getting-started/sending-the-first-request/', icon: 'mdi-play-circle-outline' },
                { title: '请求认证配置', url: 'https://learning.postman.com/docs/sending-requests/authorization/', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: '集合与环境变量',
          description: '可创建集合（Collection）将相关 API 组织在一起，便于管理和复用。环境变量功能允许定义不同环境（开发、测试、生产）的配置参数（域名、token），一键切换，避免硬编码。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '集合管理', url: 'https://learning.postman.com/docs/collections/collections-overview/', icon: 'mdi-play-circle-outline' },
                { title: '环境变量', url: 'https://learning.postman.com/docs/sending-requests/variables/', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: '自动化测试与脚本',
          description: '支持 Pre-request Script（发送前执行）和 Tests（收到响应后执行），使用 JavaScript 编写断言。内置常用断言片段如检查状态码、响应时间、JSON 字段值等，可批量运行测试并生成报告。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '测试脚本入门', url: 'https://learning.postman.com/docs/writing-scripts/test-scripts/', icon: 'mdi-play-circle-outline' },
                { title: '自动化测试运行', url: 'https://learning.postman.com/docs/collections/running-collections/', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: 'API 文档与 Mock Server',
          description: '基于集合自动生成 API 文档，支持在线发布和分享。Mock Server 可在后端未就绪时模拟 API 响应，使前端开发不受后端进度影响。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'API 文档生成', url: 'https://learning.postman.com/docs/publishing-your-api/documenting-your-api/', icon: 'mdi-play-circle-outline' },
                { title: 'Mock Server', url: 'https://learning.postman.com/docs/designing-and-developing-your-api/mocking-data/', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        }
      ]
    },
    {
      name: '进阶技巧',
      subtitle: '选修',
      children: [
        {
          title: 'Postman 监控与 CI 集成',
          description: '可将集合设置为监控任务，定期运行并检查 API 可用性。同时支持 Newman（Postman 的命令行工具）集成到 CI/CD 流水线中。',
          optional: true,
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Newman 命令行工具', url: 'https://github.com/postmanlabs/newman', icon: 'mdi-github' },
                { title: 'CI 集成指南', url: 'https://learning.postman.com/docs/collections/using-newman-cli/continuous-integration/', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: '拦截器与代理',
          description: 'Postman 拦截器可捕获浏览器或客户端的 HTTP 请求并将其导入 Postman，便于调试和分析实际网络请求。',
          optional: true,
          groups: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Postman 拦截器', url: 'https://learning.postman.com/docs/sending-requests/interceptor/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        }
      ]
    }
  ]
}
</script>
<ContentView :data="data" />
