<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'Bruno',
  description: '离线优先的开源 API 客户端，使用纯文本格式存储集合，支持 Git 版本控制。',

  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: '工具简介',
          description: 'Bruno 是一款新兴的离线优先 API 客户端，完全开源并采用 MIT 协议。与 Postman 不同，Bruno 的 API 集合以纯文本（Bru 标记语言）格式存储在本地文件系统中，不依赖任何云账号和远程同步服务。这意味着你可以将 API 集合纳入 Git 管理，与代码一起进行版本控制、代码审查和协作。Bruno 自称为 "Git 友好的 API 客户端"。',
          groups: [
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Bruno 官网', url: 'https://www.usebruno.com/', icon: 'mdi-file-document-outline' },
                { title: 'GitHub 仓库', url: 'https://github.com/usebruno/bruno', icon: 'mdi-github' }
              ]
            }
          ]
        },
        {
          title: '安装方式',
          description: 'Bruno 提供 Windows、macOS、Linux 桌面客户端，可从官网下载安装包。',
          groups: [
            {
              name: '下载',
              icon: 'mdi-download',
              items: [
                { title: '下载 Bruno', url: 'https://www.usebruno.com/downloads', icon: 'mdi-download' }
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
          title: '纯文本集合管理',
          description: 'API 集合以文件夹和 .bru 文件形式存储在磁盘上。每个 .bru 文件包含请求的 URL、方法、Headers 和 Body，使用自定的 Bru 标记语言。可直接用文本编辑器打开和编辑，Git diff 清晰可读，方便代码审查。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '集合文件格式说明', url: 'https://docs.usebruno.com/collection/overview', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: '请求调试',
          description: '支持所有标准 HTTP 方法，提供请求头和请求体编辑器。支持多种认证方式（Basic Auth、Bearer Token、API Key、OAuth 2.0）。响应区支持 JSON/XML/HTML 格式化查看、原始文本查看和图片预览。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '发送请求', url: 'https://docs.usebruno.com/requests/overview', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: '环境变量与秘密管理',
          description: '支持多环境配置（开发/测试/生产），变量可在请求中通过 {{变量名}} 引用。敏感信息可通过环境变量文件管理，并可配合 .gitignore 避免密钥泄露。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '环境变量配置', url: 'https://docs.usebruno.com/collections/environments', icon: 'mdi-play-circle-outline' },
                { title: '秘密管理', url: 'https://docs.usebruno.com/secrets-management/overview', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: 'Git 原生集成',
          description: '集合直接存储在代码仓库中，团队通过 Git 进行 API 集合的版本管理和协作。创建分支 -> 修改 API 请求 -> 发起 Pull Request -> 代码审查 -> 合并，流程与代码开发完全一致。Bruno 内置 Git 面板，可直接执行 git 操作。',
          groups: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Git 集成指南', url: 'https://docs.usebruno.com/version-control/git-integration', icon: 'mdi-file-document-outline' }
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
          title: '预请求与后响应脚本',
          description: '使用 JavaScript 编写预请求脚本（Pre-Request Script）和后响应脚本（Post-Response Script），实现动态参数计算、数据提取和断言验证。',
          optional: true,
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '脚本功能说明', url: 'https://docs.usebruno.com/collections/scripts', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: 'CLI 与 CI/CD',
          description: 'Bruno CLI（@usebruno/cli）允许在终端中运行 API 集合，适合集成到 CI/CD 流水线中执行接口测试。支持 JUnit XML 格式测试报告输出。',
          optional: true,
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Bruno CLI 文档', url: 'https://docs.usebruno.com/cli/overview', icon: 'mdi-play-circle-outline' }
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
