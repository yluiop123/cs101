<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'Docker Desktop',
  description: 'Docker Desktop 是 Docker 官方出品的桌面应用程序，提供图形化界面管理容器、镜像、卷和网络，内置 Docker Engine、Kubernetes 和 Docker Compose，是本地容器开发的基石工具。',
  items: [
    {
      name: '简介与安装',
      children: [
        { title: '工具简介', description: 'Docker Desktop 提供了一个完整的容器开发环境，包含 Docker Engine（容器运行时）、Docker CLI（命令行工具）、Docker Compose（多容器编排）、Kubernetes（容器编排平台）以及图形化管理界面。支持在 Windows、macOS 上直接运行 Linux 容器。', groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Docker Desktop 官网', url: 'https://www.docker.com/products/docker-desktop/' }, { title: '官方文档', url: 'https://docs.docker.com/desktop/' }] }] },
        { title: '安装方式', description: '从 Docker 官网下载对应平台的安装包。Windows 需要启用 WSL 2 或 Hyper-V，macOS 支持 Intel 和 Apple Silicon 芯片。个人开发者可免费使用，大型企业需购买订阅。', groups: [{ name: '下载', icon: 'mdi-download', items: [{ title: '下载 Docker Desktop', url: 'https://docs.docker.com/desktop/release-notes/' }] }] },
      ]
    },
    {
      name: '核心功能',
      children: [
        { title: '仪表盘与容器管理', description: '可视化展示所有运行中和已停止的容器。支持一键启动/停止/重启容器，查看容器日志和资源使用情况（CPU、内存、网络）。可直接在容器中执行命令。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: '容器管理', url: 'https://docs.docker.com/desktop/use-desktop/container/' }] }] },
        { title: '镜像管理', description: '浏览本地 Docker 镜像列表，查看镜像分层历史和详细信息。支持从 Docker Hub 拉取镜像、构建新镜像、推送镜像到仓库，以及删除无用镜像释放磁盘空间。', groups: [{ name: '文档', icon: 'mdi-file-document-outline', items: [{ title: '镜像管理', url: 'https://docs.docker.com/desktop/use-desktop/images/' }] }] },
        { title: 'Docker Compose 集成', description: '图形化管理 Compose 项目，一键启动/停止多容器应用。查看 Compose 项目中的服务状态、端口映射和日志。支持 Compose Watch 实现热重载。' },
        { title: 'Kubernetes 支持', description: '内置单节点 Kubernetes 集群，一键启用/禁用。支持部署和管理 Pod、Service、Deployment 等 K8s 资源，方便本地开发和测试 K8s 工作负载。', groups: [{ name: '参考', icon: 'mdi-file-document-outline', items: [{ title: 'Kubernetes 集成', url: 'https://docs.docker.com/desktop/kubernetes/' }] }] },
        { title: '卷与网络管理', description: '可视化查看和管理数据卷（Volumes）和网络（Networks）。支持创建、删除卷和网络，方便容器间的数据持久化和通信配置。', groups: [{ name: '文档', icon: 'mdi-file-document-outline', items: [{ title: '资源管理', url: 'https://docs.docker.com/desktop/use-desktop/' }] }] },
      ]
    },
    {
      name: '进阶技巧', subtitle: '选修',
      children: [
        { title: '资源限制与配置', description: '调整 Docker Desktop 使用的 CPU、内存和磁盘配额。配置镜像加速器（如阿里云加速器）、HTTP 代理等，优化拉取速度和开发体验。', optional: true },
        { title: 'Docker Dev Environments', description: '使用 Dev Environments 功能快速创建可共享的开发环境。团队成员可以基于相同配置的容器化环境进行开发，消除环境不一致问题。', optional: true },
        { title: '扩展插件', description: 'Docker Desktop 支持安装扩展插件，如漏洞扫描器（Snyk）、磁盘空间分析等，通过 Extensions 市场浏览和安装。', optional: true },
      ]
    },
  ]
}
</script>
<ContentView :data="data" />
