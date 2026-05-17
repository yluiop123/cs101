<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'Proxyman',
  description: 'macOS 原生 HTTP 调试代理工具，以高性能和现代化界面著称。',
  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: 'Proxyman 简介',
          description: 'Proxyman 是一款专门为 macOS 打造的 HTTP/HTTPS 调试代理工具，基于 Swift 原生开发，拥有流畅的界面和出色的性能。它支持 SSL 解密、请求断点、网络限速、脚本注入等功能，并针对 Apple Silicon 进行了深度优化，是 macOS 开发者的首选抓包工具之一。',
          resources: [
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Proxyman 官网', url: 'https://proxyman.io/', icon: 'mdi-web' },
                { title: '官方文档', url: 'https://docs.proxyman.io/', icon: 'mdi-file-document-outline' },
              ],
            },
          ],
        },
        {
          title: '安装方式',
          description: 'Proxyman 可通过官网直接下载或通过 Homebrew 安装（brew install --cask proxyman）。支持免费基础版和付费高级版。',
          resources: [
            {
              name: '下载',
              icon: 'mdi-download',
              items: [
                { title: '下载 Proxyman', url: 'https://proxyman.io/download', icon: 'mdi-download' },
                { title: 'App Store', url: 'https://apps.apple.com/app/proxyman/id1546064666', icon: 'mdi-apple' },
              ],
            },
            {
              name: '学习资源',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Proxyman 入门指南', url: 'https://docs.proxyman.io/getting-started', icon: 'mdi-play-circle-outline' },
                { title: 'Proxyman 视频教程', url: 'https://www.youtube.com/watch?v=YxRlLhQKY0s', icon: 'mdi-play-circle-outline' },
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
          title: 'HTTPS 解密',
          description: '自动生成并安装根证书，一键启用 SSL Proxying。支持按域名或规则选择性解密，性能优于 Java 实现的其他代理工具。',
          resources: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'SSL 解密配置', url: 'https://docs.proxyman.io/ssl-pinning/', icon: 'mdi-play-circle-outline' },
              ],
            },
          ],
        },
        {
          title: '左侧面板与搜索',
          description: '天然的 macOS 风格的左侧面板设计，支持多标签浏览、全文搜索、正则过滤，以及颜色标签分类管理请求。',
          resources: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '界面概览', url: 'https://docs.proxyman.io/basics/interface', icon: 'mdi-file-document-outline' },
              ],
            },
          ],
        },
        {
          title: '脚本与自定义工具',
          description: '支持自定义脚本（JS）在请求/响应生命周期中注入逻辑，可以自动修改 Header、Body 或实现复杂的 Mock 策略。',
          resources: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '脚本工具文档', url: 'https://docs.proxyman.io/scripting/', icon: 'mdi-play-circle-outline' },
              ],
            },
          ],
        },
        {
          title: 'Simultaneous Proxy',
          description: 'Proxyman 可以同时监听多个端口，支持同时代理 iOS 模拟器和真机流量，并分别展示在独立标签页中。',
          resources: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '多代理配置', url: 'https://docs.proxyman.io/basics/proxy-settings', icon: 'mdi-file-document-outline' },
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
          title: 'gRPC 调试',
          description: 'Proxyman 支持 gRPC 流量的抓包和解码，可以查看 Protobuf 格式的请求和响应内容，适合微服务架构下的调试场景。',
          optional: true,
          resources: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'gRPC 调试文档', url: 'https://docs.proxyman.io/grpc/', icon: 'mdi-file-document-outline' },
              ],
            },
          ],
        },
        {
          title: '迁移助手',
          description: 'Proxyman 提供从 Charles 和 Fiddler 导入配置和证书的迁移工具，方便用户从其他代理工具无缝切换到 Proxyman。',
          optional: true,
          resources: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '迁移指南', url: 'https://docs.proxyman.io/migration/', icon: 'mdi-file-document-outline' },
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
