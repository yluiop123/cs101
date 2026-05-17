<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'Podman',
  description: 'Podman 是一款无守护进程（Daemonless）的容器引擎，由 Red Hat 开发，兼容 OCI 标准，无需 root 权限即可运行容器，是 Docker 的安全开源替代方案。',
  items: [
    {
      name: '简介与安装',
      children: [
        { title: '工具简介', description: 'Podman（Pod Manager）采用无守护进程架构，每个容器直接由 Podman 进程管理，无需后台常驻进程（如 Docker daemon）。完全兼容 Docker CLI 命令语法（docker 可 alias 为 podman）。支持 Pod、Kubernetes YAML 生成、Rootless 容器等高级特性。', groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Podman 官网', url: 'https://podman.io/' }, { title: 'GitHub 仓库', url: 'https://github.com/containers/podman' }] }] },
        { title: '安装方式', description: 'Linux：通过包管理器安装（dnf install podman、apt install podman）。macOS：使用 Podman Machine（podman machine init）。Windows：通过 WSL 2 或 Podman Machine 运行。还提供桌面版 Podman Desktop GUI。', groups: [{ name: '下载', icon: 'mdi-download', items: [{ title: '安装指南', url: 'https://podman.io/docs/installation' }, { title: 'Podman Desktop', url: 'https://podman.io/desktop/' }] }] },
      ]
    },
    {
      name: '核心功能',
      children: [
        { title: '无守护进程架构', description: '无需 root 权限和后台守护进程。每个容器直接由 fork/exec 方式启动，由 systemd 管理容器生命周期。安全性更高，避免 daemon 提权风险。', groups: [{ name: '文档', icon: 'mdi-file-document-outline', items: [{ title: '架构说明', url: 'https://podman.io/docs/overview' }] }] },
        { title: 'Docker 兼容', description: '命令语法与 Docker 高度一致，可设置 docker=podman 别名无缝切换。支持 Docker Compose（通过 podman-compose 或 podman play kube）。支持 Docker Hub 等镜像仓库。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Docker 迁移指南', url: 'https://podman.io/docs/migrating-from-docker' }] }] },
        { title: 'Pod 管理', description: 'Podman 可将多个容器组织成 Pod（灵感来自 Kubernetes Pod），共享网络命名空间和存储卷。一个 Pod 中的容器可以通过 localhost 互相通信。', groups: [{ name: '参考', icon: 'mdi-file-document-outline', items: [{ title: 'Pod 概念', url: 'https://docs.podman.io/en/latest/pods.html' }] }] },
        { title: 'Rootless 容器', description: '普通用户可以运行容器，无需 sudo 权限。容器内的 root 用户映射到宿主机的普通用户，限制容器逃逸风险。支持用户命名空间映射。' },
        { title: 'Kubernetes 集成', description: 'podman play kube 可以直接运行 Kubernetes Pod YAML。podman generate kube 可以将现有容器导出为 K8s 资源定义。在本地开发和生产部署间无缝切换。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Kubernetes 集成', url: 'https://docs.podman.io/en/latest/markdown/podman-play-kube.1.html' }] }] },
      ]
    },
    {
      name: '进阶技巧', subtitle: '选修',
      children: [
        { title: 'Podman Machine', description: '在 macOS/Windows 上使用 Podman Machine 管理虚拟机，用于运行 Linux 容器。支持多机器管理、自动启动、端口转发等。', optional: true },
        { title: 'Systemd 集成', description: 'Podman 容器可以生成为 systemd 服务单元，由 systemd 管理容器自动启动、健康检查和重启策略。适合生产环境的容器部署。', optional: true },
        { title: 'Quadlet 编排', description: 'Quadlet 是 Podman 的声明式容器编排工具，使用类似 Docker Compose 的配置文件定义容器。系统管理员可通过 Quadlet 将容器作为 systemd 服务管理。', optional: true },
      ]
    },
  ]
}
</script>
<ContentView :data="data" />
