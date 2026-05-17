<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'Wireshark',
  description: '最流行的网络协议分析器，支持数百种协议的实时抓包与离线分析。',
  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: 'Wireshark 简介',
          description: 'Wireshark（原名 Ethereal）是目前全球使用最广泛的开源网络协议分析工具。它可以实时捕获网络接口上的数据包，并提供强大的过滤、分析和可视化功能，是网络工程师、安全从业者和开发者的必备工具。支持 Windows、macOS 和 Linux 三大平台。',
          resources: [
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Wireshark 官网', url: 'https://www.wireshark.org/', icon: 'mdi-web' },
                { title: '官方用户手册', url: 'https://www.wireshark.org/docs/wsug_html_chunked/', icon: 'mdi-file-document-outline' },
                { title: 'Wireshark Wiki', url: 'https://gitlab.com/wireshark/wireshark/-/wikis/home', icon: 'mdi-book-open-variant' },
              ],
            },
            {
              name: '学习资源',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Wireshark 入门教程', url: 'https://www.bilibili.com/video/BV1iJ411j7kD', icon: 'mdi-play-circle-outline' },
                { title: 'Wireshark Full Course', url: 'https://www.youtube.com/watch?v=rlR4PJn8b8I', icon: 'mdi-play-circle-outline' },
              ],
            },
          ],
        },
        {
          title: '安装方式',
          description: 'Wireshark 提供各平台的安装包和源码，安装过程会自动集成 Npcap/WinPcap 驱动用于底层抓包。',
          resources: [
            {
              name: '下载',
              icon: 'mdi-download',
              items: [
                { title: '下载 Wireshark', url: 'https://www.wireshark.org/download.html', icon: 'mdi-download' },
                { title: 'GitHub Releases', url: 'https://github.com/wireshark/wireshark/releases', icon: 'mdi-github' },
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
          title: '实时抓包',
          description: '选择网络接口即可开始实时捕获数据包，支持同时捕获多个接口、设置捕获过滤规则（BPF 语法），以及使用环形缓冲区限制内存占用。',
          resources: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '捕获入门教程', url: 'https://www.wireshark.org/docs/wsug_html_chunked/ChapterCapture.html', icon: 'mdi-play-circle-outline' },
              ],
            },
          ],
        },
        {
          title: '显示过滤',
          description: 'Wireshark 最强大的功能之一。使用表达式语法（如 http.request、tcp.port==80、ip.addr==192.168.1.1）快速筛选目标数据包，支持逻辑运算符组合和颜色高亮规则。',
          resources: [
            {
              name: '参考文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '显示过滤参考', url: 'https://www.wireshark.org/docs/wsug_html_chunked/ChWorkBuildDisplayFilterSection.html', icon: 'mdi-file-document-outline' },
                { title: '过滤表达式示例', url: 'https://wiki.wireshark.org/DisplayFilters', icon: 'mdi-book-open-variant' },
              ],
            },
          ],
        },
        {
          title: '协议解析',
          description: 'Wireshark 内置数千种协议解析器，支持 HTTP、TCP/IP、DNS、TLS、HTTP/2、gRPC、WebSocket 等常见协议的结构化解析，并能自动识别协议版本和字段含义。',
          resources: [
            {
              name: '协议列表',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '支持的协议列表', url: 'https://www.wireshark.org/docs/dfref/', icon: 'mdi-format-list-bulleted' },
              ],
            },
          ],
        },
        {
          title: '统计分析',
          description: '提供丰富的统计功能，包括协议分层统计、会话列表、端点统计、IO 图表、TCP 流图（时序图/吞吐量）、服务响应时间分析等，帮助快速定位网络性能瓶颈。',
          resources: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '统计功能文档', url: 'https://www.wireshark.org/docs/wsug_html_chunked/ChapterStatistics.html', icon: 'mdi-file-document-outline' },
              ],
            },
          ],
        },
        {
          title: '追踪 TCP 流',
          description: '右键点击数据包即可完整追踪 TCP 流，自动重组并展示应用层数据传输全过程，支持 HTTP 请求/响应、文件传输等内容的完整查看与导出。',
          resources: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '追踪 TCP 流教程', url: 'https://www.wireshark.org/docs/wsug_html_chunked/ChAdvFollowTCPSection.html', icon: 'mdi-play-circle-outline' },
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
          title: 'TLS 解密',
          description: '通过导入服务器私钥或配置 SSLKEYLOGFILE 环境变量（浏览器支持），Wireshark 可以解密 HTTPS 流量，查看 TLS 握手详情和加密后的应用数据。',
          optional: true,
          resources: [
            {
              name: '教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'TLS 解密设置指南', url: 'https://wiki.wireshark.org/TLS', icon: 'mdi-play-circle-outline' },
                { title: 'SSLKEYLOGFILE 用法', url: 'https://wiki.wireshark.org/SSLKEYLOGFILE', icon: 'mdi-file-document-outline' },
              ],
            },
          ],
        },
        {
          title: '命令行工具 tshark',
          description: 'Wireshark 提供命令行版的 tshark，可用于服务器端抓包和自动化脚本，支持与 grep/awk 等工具配合进行批量数据处理。',
          optional: true,
          resources: [
            {
              name: '文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'tshark 手册', url: 'https://www.wireshark.org/docs/man-pages/tshark.html', icon: 'mdi-file-document-outline' },
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
