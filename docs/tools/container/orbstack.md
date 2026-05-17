<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'OrbStack',
  description: 'OrbStack 是一款专为 macOS 设计的高性能轻量级容器运行工具，被誉为"Docker Desktop 的最佳替代品"，以极快的启动速度、低资源占用和无缝的 macOS 集成体验著称。',
  items: [
    {
      name: '简介与安装',
      children: [
        { title: '工具简介', description: 'OrbStack 使用原生虚拟化技术（Apple Virtualization.framework），在 macOS 上高效运行 Docker 容器和 Linux 发行版。相比 Docker Desktop，OrbStack 启动更快（秒级）、内存占用更低（约 200MB）、文件系统性能更好（约 5-10 倍提升）。', groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'OrbStack 官网', url: 'https://orbstack.dev/' }] }] },
        { title: '安装方式', description: '仅支持 macOS（Intel 和 Apple Silicon），通过官网下载 DMG 安装包，或使用 Homebrew 安装：brew install orbstack。安装后自动替换 Docker CLI 路径，向下兼容所有 Docker 命令和 Docker Compose。', groups: [{ name: '下载', icon: 'mdi-download', items: [{ title: '下载 OrbStack', url: 'https://orbstack.dev/download' }] }] },
      ]
    },
    {
      name: '核心功能',
      children: [
        { title: '容器管理', description: '提供清晰美观的 GUI 仪表盘，展示所有容器状态。支持一键启动/停止/重启容器，查看实时日志和资源统计。容器冷启动时间通常在 1-2 秒内。', groups: [{ name: '文档', icon: 'mdi-file-document-outline', items: [{ title: 'OrbStack 文档', url: 'https://docs.orbstack.dev/' }] }] },
        { title: 'Docker 兼容', description: '完全兼容 Docker CLI 和 Docker Compose，可直接运行现有 Docker 工作流。支持 Docker Socket 代理，无需修改任何配置即可使用 docker、docker-compose 命令。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: '快速开始', url: 'https://docs.orbstack.dev/quick-start' }] }] },
        { title: 'Linux 虚拟机', description: '支持创建和管理轻量级 Linux 发行版（Ubuntu、Fedora、Arch 等）作为独立虚拟机运行。提供终端集成，可直接在 OrbStack 中打开 Linux shell。' },
        { title: '文件系统共享', description: '自动共享 macOS 文件系统到容器，无需手动配置挂载卷。文件读写性能接近本地速度，显著优于 Docker Desktop 的 gRPC FUSE 方案。', groups: [{ name: '参考', icon: 'mdi-file-document-outline', items: [{ title: '文件性能对比', url: 'https://orbstack.dev/blog/speed' }] }] },
        { title: '网络功能', description: '提供本地网络代理，容器 IP 可直接在宿主机访问。内置 DNS 解析、端口转发、TLS 终止等网络功能。支持自定义域名映射到容器。', groups: [{ name: '文档', icon: 'mdi-file-document-outline', items: [{ title: '网络配置', url: 'https://docs.orbstack.dev/network/' }] }] },
      ]
    },
    {
      name: '进阶技巧', subtitle: '选修',
      children: [
        { title: '集成终端', description: 'OrbStack 提供内置终端模拟器，可在容器和 Linux 虚拟机中直接运行命令。支持分屏、标签页、主题定制等现代终端特性。', optional: true },
        { title: '远程开发支持', description: '通过 SSH 或 VS Code Remote 连接到 OrbStack 中的 Linux 发行版进行远程开发。适合需要原生 Linux 环境的开发场景。', optional: true },
      ]
    },
  ]
}
</script>
<ContentView :data="data" />
