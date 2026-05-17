<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'Insomnia',
  description: '跨平台开源 REST/GraphQL 客户端，以简洁的界面设计和强大的调试能力著称。',

  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: '工具简介',
          description: 'Insomnia 是一款跨平台的开源 API 客户端，早期专注于 GraphQL 调试而闻名，现已扩展为支持 REST、GraphQL、gRPC 和 WebSocket 的多协议 API 调试工具。其界面设计简洁现代，使用体验流畅，深受前端开发和全栈开发者喜爱。Insomnia 插件生态系统丰富，支持自定义插件扩展功能。',
          groups: [
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Insomnia 官网', url: 'https://insomnia.rest/', icon: 'mdi-file-document-outline' },
                { title: 'GitHub 仓库', url: 'https://github.com/Kong/insomnia', icon: 'mdi-github' }
              ]
            }
          ]
        },
        {
          title: '安装方式',
          description: '支持 Windows、macOS、Linux 桌面客户端，可从官网下载安装包。也可通过 Homebrew、Scoop 等包管理器安装。',
          groups: [
            {
              name: '下载',
              icon: 'mdi-download',
              items: [
                { title: 'Insomnia 下载', url: 'https://insomnia.rest/download', icon: 'mdi-download' },
                { title: 'Homebrew 安装', url: 'https://formulae.brew.sh/cask/insomnia', icon: 'mdi-flask' }
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
          title: 'GraphQL 调试',
          description: 'Insomnia 的 GraphQL 支持是其标志性功能。内置 GraphQL Schema 浏览器，可自动加载远程 schema 并提供字段自动补全、类型查看和文档侧边栏。支持 GraphQL 变量和片段定义，可快速构建和测试 GraphQL 查询和变更。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'GraphQL 调试指南', url: 'https://docs.insomnia.rest/insomnia/graphql-queries', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: 'REST 请求调试',
          description: '支持所有标准 HTTP 方法，提供直观的请求构造界面。支持请求头、请求体（JSON/XML/Form/File）、认证方式（Basic、Bearer、Digest、OAuth 1.0/2.0、AWS 签名）以及 Cookie 管理。响应支持多种格式查看和搜索。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'REST 请求基础', url: 'https://docs.insomnia.rest/insomnia/send-your-first-request', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: '环境变量与组织',
          description: '支持子环境嵌套（如开发环境下的不同配置变体），变量可通过 JSON 文件定义和管理。请求支持按工作区（Workspace）组织，每个工作区可包含多个集合和项目。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '环境变量配置', url: 'https://docs.insomnia.rest/insomnia/environment-variables', icon: 'mdi-play-circle-outline' },
                { title: '工作区管理', url: 'https://docs.insomnia.rest/insomnia/workspaces', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: '插件系统',
          description: '基于 npm 的插件系统，社区贡献了大量插件。支持主题定制、导出导入格式扩展、代码生成增强、请求前后处理钩子等。可满足不同团队的特殊需求。',
          groups: [
            {
              name: '资源',
              icon: 'mdi-puzzle',
              items: [
                { title: '插件列表', url: 'https://insomnia.rest/plugins', icon: 'mdi-puzzle' },
                { title: '插件开发指南', url: 'https://docs.insomnia.rest/insomnia/introduction-to-plugins', icon: 'mdi-file-document-outline' }
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
          title: '设计模式（Design Mode）',
          description: '通过 Insomnia Designer 可以基于 OpenAPI/Swagger 规范设计和定义 API，生成服务端骨架代码和客户端 SDK。支持规范版本管理和变更追踪。',
          optional: true,
          groups: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Design Mode 说明', url: 'https://docs.insomnia.rest/insomnia/design-mode', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'Inso CLI',
          description: 'Insomnia 的命令行伴侣工具 Inso，支持在终端中运行测试套件、导出规范和生成代码。可集成到 CI/CD 流程中实现 API 自动验证。',
          optional: true,
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Inso CLI 文档', url: 'https://docs.insomnia.rest/inso-cli/introduction', icon: 'mdi-play-circle-outline' }
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
