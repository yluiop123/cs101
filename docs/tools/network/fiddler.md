<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'Fiddler',
  description: '经典的 Windows HTTP 调试代理工具，功能强大且拥有丰富的扩展生态。',
  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: 'Fiddler 简介',
          description: 'Fiddler 是由 Telerik 推出的 HTTP 调试代理工具，在 Windows 平台上拥有悠久历史。它以强大的会话管理、请求构造器和脚本扩展能力著称，支持 HTTP/HTTPS 流量的捕获、分析和修改。Fiddler Everywhere 是跨平台的新一代版本，支持 macOS 和 Linux。',
          resources: [
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Fiddler 官网', url: 'https://www.telerik.com/fiddler', icon: 'mdi-web' },
                { title: 'Fiddler Everywhere 文档', url: 'https://docs.telerik.com/fiddler-everywhere/', icon: 'mdi-file-document-outline' },
                { title: 'Fiddler Classic 文档', url: 'https://docs.telerik.com/fiddler/fiddler-classic', icon: 'mdi-file-document-outline' },
              ],
            },
          ],
        },
        {
          title: '安装方式',
          description: 'Fiddler Classic 仅支持 Windows 且免费。Fiddler Everywhere 是跨平台商业版，可通过官网下载或 Homebrew（macOS）安装。',
          resources: [
            {
              name: '下载',
              icon: 'mdi-download',
              items: [
                { title: '下载 Fiddler Everywhere', url: 'https://www.telerik.com/download/fiddler-everywhere', icon: 'mdi-download' },
                { title: 'Fiddler Classic 下载', url: 'https://www.telerik.com/download/fiddler/fiddler-classic', icon: 'mdi-download' },
              ],
            },
            {
              name: '学习资源',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Fiddler 入门教程', url: 'https://www.bilibili.com/video/BV1uW411m7RR', icon: 'mdi-play-circle-outline' },
                { title: 'Fiddler 全面教程', url: 'https://www.youtube.com/watch?v=QBaVlJwJ8Ig', icon: 'mdi-play-circle-outline' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: '核心功能',
      children: [
        {
          title: '会话列表与过滤',
          description: 'Fiddler 以会话（Session）为单位展示所有 HTTP 流量，支持按 URL、状态码、Host、请求方法等多种条件组合过滤，绿色高亮显示图片、蓝色显示 HTML 等直观标识。',
          resources: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '会话列表管理', url: 'https://docs.telerik.com/fiddler/fiddler-classic/Inspector/SessionList', icon: 'mdi-play-circle-outline' },
              ],
            },
          ],
        },
        {
          title: 'AutoResponder',
          description: 'Fiddler 的标志性功能之一。可以设置自动响应规则，将特定请求直接返回预设的响应内容（本地文件或自定义文本），非常适合前端 Mock 数据和离线调试。',
          resources: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'AutoResponder 文档', url: 'https://docs.telerik.com/fiddler/fiddler-classic/AutoResponder/', icon: 'mdi-play-circle-outline' },
              ],
            },
          ],
        },
        {
          title: 'Composer 请求构造器',
          description: '内置请求构造器，可以手动编辑并发送 HTTP 请求，支持设置方法、URL、Headers 和 Body，用于快速测试 API 接口。',
          resources: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Composer 使用指南', url: 'https://docs.telerik.com/fiddler/fiddler-classic/Composer/', icon: 'mdi-file-document-outline' },
              ],
            },
          ],
        },
        {
          title: 'FiddlerScript',
          description: 'Fiddler 内置基于 JScript.NET 的脚本引擎 FiddlerScript，可以在请求/响应生命周期的各个阶段注入自定义逻辑，实现复杂的流量处理和自动化。',
          resources: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'FiddlerScript 入门', url: 'https://docs.telerik.com/fiddler/fiddler-classic/FiddlerScript/', icon: 'mdi-play-circle-outline' },
              ],
            },
          ],
        },
        {
          title: 'HTTPS 解密',
          description: 'Fiddler 支持通过生成根证书来解密 HTTPS 流量，可以查看加密请求的完整内容。支持按域名排除、按进程过滤等灵活配置。',
          resources: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'HTTPS 解密设置', url: 'https://docs.telerik.com/fiddler/fiddler-classic/DecryptHTTPS/', icon: 'mdi-file-document-outline' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: '进阶技巧',
      subtitle: '选修',
      children: [
        {
          title: '扩展与插件',
          description: 'Fiddler 拥有丰富的扩展生态，包括 Traffic Differ（流量对比）、SyntaxView（语法高亮）、JavaScript Formatter 等数百款社区插件。',
          optional: true,
          resources: [
            {
              name: '扩展',
              icon: 'mdi-puzzle',
              items: [
                { title: 'Fiddler 扩展库', url: 'https://www.telerik.com/fiddler/add-ons', icon: 'mdi-puzzle' },
              ],
            },
          ],
        },
        {
          title: '命令行模式与 API',
          description: 'Fiddler 支持通过命令行参数自动化启动和配置，并提供 ExecAction 自动化接口，可与 CI/CD 流程集成。',
          optional: true,
          resources: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '命令行选项', url: 'https://docs.telerik.com/fiddler/fiddler-classic/CommandLine', icon: 'mdi-file-document-outline' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
</script>
<ContentView :data="data" />
