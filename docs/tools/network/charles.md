<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'Charles',
  description: '跨平台 HTTP 抓包代理工具，支持 SSL 解密、请求断点和限速模拟。',
  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: 'Charles 简介',
          description: 'Charles 是一款用 Java 编写的 HTTP 代理/监控工具，广泛用于 Web 和移动端开发调试。它可以查看浏览器和服务器之间的所有 HTTP/HTTPS 通信，支持请求和响应的修改、断点调试、流量限速等功能，是前后端开发和测试人员的得力工具。',
          resources: [
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Charles 官网', url: 'https://www.charlesproxy.com/', icon: 'mdi-web' },
                { title: '官方文档', url: 'https://www.charlesproxy.com/documentation/', icon: 'mdi-file-document-outline' },
              ],
            },
          ],
        },
        {
          title: '安装方式',
          description: 'Charles 支持 Windows、macOS 和 Linux。下载安装包后直接安装，macOS 也可通过 Homebrew 安装（brew install --cask charles）。',
          resources: [
            {
              name: '下载',
              icon: 'mdi-download',
              items: [
                { title: '下载 Charles', url: 'https://www.charlesproxy.com/download/', icon: 'mdi-download' },
              ],
            },
            {
              name: '学习资源',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Charles 入门教程', url: 'https://www.bilibili.com/video/BV1hW41117rG', icon: 'mdi-play-circle-outline' },
                { title: 'Charles 详细教程', url: 'https://www.youtube.com/watch?v=rPtzpzWvMY0', icon: 'mdi-play-circle-outline' },
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
          title: 'HTTPS 解密（SSL Proxying）',
          description: 'Charles 可以通过安装根证书并启用 SSL Proxying 来解密 HTTPS 流量，查看加密请求和响应的完整内容。支持指定域名或全局模式。',
          resources: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'SSL Proxying 设置', url: 'https://www.charlesproxy.com/documentation/proxying/ssl-proxying/', icon: 'mdi-play-circle-outline' },
              ],
            },
          ],
        },
        {
          title: '请求断点（Breakpoints）',
          description: '在请求发送前或响应返回前设置断点，可以实时修改请求参数、请求头、响应体等内容，非常适合测试边界条件和异常场景。',
          resources: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Breakpoints 文档', url: 'https://www.charlesproxy.com/documentation/tools/breakpoints/', icon: 'mdi-play-circle-outline' },
              ],
            },
          ],
        },
        {
          title: '流量限速（Throttling）',
          description: '模拟弱网环境（2G/3G/4G 或自定义带宽、延迟、丢包率），帮助开发者测试应用在较差网络条件下的表现。',
          resources: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Throttling 设置', url: 'https://www.charlesproxy.com/documentation/tools/throttling/', icon: 'mdi-play-circle-outline' },
              ],
            },
          ],
        },
        {
          title: 'Map Local / Map Remote',
          description: 'Map Local 可以将远程请求映射到本地文件，方便离线调试前端资源。Map Remote 可以将请求重定向到另一台服务器，用于环境切换或接口 Mock。',
          resources: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Map Local 文档', url: 'https://www.charlesproxy.com/documentation/tools/map-local/', icon: 'mdi-play-circle-outline' },
                { title: 'Map Remote 文档', url: 'https://www.charlesproxy.com/documentation/tools/map-remote/', icon: 'mdi-play-circle-outline' },
              ],
            },
          ],
        },
        {
          title: '移动端抓包',
          description: 'Charles 支持代理 iOS/Android 设备的 HTTP 流量。设备配置代理后安装 Charles 根证书即可解密 HTTPS，是移动端开发调试的核心功能。',
          resources: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '移动端代理设置', url: 'https://www.charlesproxy.com/documentation/configuration/proxying/', icon: 'mdi-play-circle-outline' },
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
          title: 'Rewrite 功能',
          description: 'Rewrite 工具允许自动修改请求或响应的特定部分（如 Header、Body、Status），无需手动设置断点，适合批量替换场景。',
          optional: true,
          resources: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Rewrite 文档', url: 'https://www.charlesproxy.com/documentation/tools/rewrite/', icon: 'mdi-file-document-outline' },
              ],
            },
          ],
        },
        {
          title: 'Auto Save 会话',
          description: '配置自动保存会话文件，便于长时间抓包后回溯分析。支持按大小或时间分割会话文件。',
          optional: true,
          resources: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Auto Save 设置', url: 'https://www.charlesproxy.com/documentation/configuration/auto-save/', icon: 'mdi-file-document-outline' },
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
