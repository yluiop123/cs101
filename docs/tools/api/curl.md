<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'cURL / HTTPie',
  description: '命令行 HTTP 工具，cURL 是通用数据传输工具，HTTPie 是更现代易用的 HTTP 客户端。',

  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: '工具简介',
          description: 'cURL 是一个自 1997 年开始开发的开源命令行工具和库，支持 HTTP、HTTPS、FTP、SFTP、SMTP 等数十种协议，几乎在所有操作系统和开发环境中预装。HTTPie（又称 httpie）是一个更年轻的开源工具，专注于让 HTTP 命令行交互变得更直观易用，提供彩色输出、JSON 自动处理、简洁的请求语法等特性，被誉为 "人类友好的 cURL"。',
          groups: [
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'cURL 官网', url: 'https://curl.se/', icon: 'mdi-file-document-outline' },
                { title: 'HTTPie 官网', url: 'https://httpie.io/', icon: 'mdi-file-document-outline' },
                { title: 'cURL GitHub', url: 'https://github.com/curl/curl', icon: 'mdi-github' }
              ]
            }
          ]
        },
        {
          title: '安装方式',
          description: 'cURL 通常已预装在 macOS 和 Linux 中，Windows 10/11 也内置了 curl.exe。HTTPie 通过 Python pip 或系统包管理器安装。',
          groups: [
            {
              name: '安装',
              icon: 'mdi-download',
              items: [
                { title: 'cURL 下载页面', url: 'https://curl.se/download.html', icon: 'mdi-download' },
                { title: 'HTTPie 安装指南', url: 'https://httpie.io/docs#installation', icon: 'mdi-download' }
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
          title: 'cURL 请求构建',
          description: 'cURL 的核心用法：curl [选项] URL。常用参数包括 -X（方法）、-H（请求头）、-d（请求体）、-b（Cookie）、-o（输出文件）、-v（详细输出）。支持 -u user:pass 基本认证、-k 跳过 SSL 验证。支持将网络资源直接下载到本地文件。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'cURL 入门指南', url: 'https://curl.se/docs/manpage.html', icon: 'mdi-play-circle-outline' },
                { title: 'cURL 常用示例', url: 'https://curl.se/docs/httpscripting.html', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: 'HTTPie 简洁语法',
          description: 'HTTPie 将常见操作简化为直观的命令：http GET https://api.example.com、http POST example.com name=John age:=30。自动识别 JSON 类型并格式化输出，响应头/体高亮显示。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'HTTPie 快速入门', url: 'https://httpie.io/docs/cli/quickstart', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: '脚本与自动化',
          description: 'cURL 是 shell 脚本中进行 HTTP 请求的首选工具。结合 jq 可解析 JSON 响应，结合循环可实现批量请求。CI/CD 流水线中也广泛使用 cURL 进行 API 健康检查和部署触发。',
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'cURL 脚本指南', url: 'https://everything.curl.dev/', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: '调试与诊断',
          description: 'curl -v 查看完整的请求响应流程，curl -w 可输出耗时统计（DNS 解析、TCP 连接、TLS 握手、传输等阶段）。支持 --resolve 指定 IP 地址进行域名劫持模拟测试。',
          groups: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'cURL 调试技巧', url: 'https://curl.se/docs/manpage.html#-w', icon: 'mdi-file-document-outline' }
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
          title: 'cURL 与 API 认证',
          description: '支持多种认证方式：Basic Auth (-u)、Bearer Token (-H "Authorization: Bearer xxx")、OAuth 2.0 流程、客户端证书 (-E, --cert)。可结合 --cookie-jar 管理会话 Cookie。',
          optional: true,
          groups: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'cURL 认证文档', url: 'https://curl.se/docs/manpage.html#-u', icon: 'mdi-play-circle-outline' }
              ]
            }
          ]
        },
        {
          title: 'HTTPie 会话与插件',
          description: 'HTTPie 支持持久会话（Session），自动跨请求管理 Cookie 和认证状态。插件系统支持添加自定义认证方式、序列化格式等扩展。',
          optional: true,
          groups: [
            {
              name: '资源',
              icon: 'mdi-github',
              items: [
                { title: 'HTTPie 会话管理', url: 'https://httpie.io/docs/cli/sessions', icon: 'mdi-play-circle-outline' },
                { title: 'HTTPie 插件', url: 'https://httpie.io/docs/cli/plugins', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'Postman 代码导出',
          description: 'Postman 和 Insomnia 都支持将请求导出为 cURL 命令，方便在团队间分享接口调用方式。也可以将 cURL 命令导入到这些 GUI 工具中。',
          optional: true,
          groups: [
            {
              name: '技巧',
              icon: 'mdi-lightbulb-outline',
              items: [
                { title: 'Postman 导出 cURL', url: 'https://learning.postman.com/docs/sending-requests/generate-code-snippets/', icon: 'mdi-lightbulb-outline' }
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
