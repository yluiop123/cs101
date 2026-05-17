<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'Vagrant / Multipass',
  description: 'Vagrant 和 Multipass 都是虚拟机管理工具，用于快速创建、配置和管理开发环境虚拟机。Vagrant 是通用方案，支持多种虚拟化后端；Multipass 是 Canonical 出品，专注于快速启动 Ubuntu 实例。',
  items: [
    {
      name: '简介与安装',
      children: [
        { title: 'Vagrant 简介', description: 'Vagrant 使用 HashiCorp Configuration Language（HCL）或 Ruby DSL 定义虚拟机配置（Vagrantfile），支持 VirtualBox、VMware、Hyper-V、Libvirt 等多种 Provider。提供 Provisioning（Shell、Ansible、Puppet 等）和网络端口转发、同步文件夹等功能。', groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Vagrant 官网', url: 'https://www.vagrantup.com/' }, { title: '文档中心', url: 'https://developer.hashicorp.com/vagrant/docs' }] }] },
        { title: 'Multipass 简介', description: 'Multipass 由 Ubuntu 的发行商 Canonical 开发，使用原生虚拟化技术（macOS 的 HyperKit、Windows 的 Hyper-V、Linux 的 KVM/QEMU），可在秒级启动完整的 Ubuntu 虚拟机。提供 CLI 和 GUI 两种操作方式。', groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'Multipass 官网', url: 'https://multipass.run/' }, { title: 'GitHub 仓库', url: 'https://github.com/canonical/multipass' }] }] },
        { title: '安装方式', description: 'Vagrant：从官网下载安装包，或通过包管理器安装。需额外安装虚拟机 Provider（如 VirtualBox）。Multipass：Windows/macOS 提供安装包，Linux 通过 Snap 安装（snap install multipass）。', groups: [{ name: '下载', icon: 'mdi-download', items: [{ title: 'Vagrant 下载', url: 'https://developer.hashicorp.com/vagrant/downloads' }, { title: 'Multipass 下载', url: 'https://multipass.run/install' }] }] },
      ]
    },
    {
      name: '核心功能',
      children: [
        { title: 'Vagrantfile 配置', description: '通过 Vagrantfile 声明式定义虚拟机配置（镜像、CPU、内存、网络、启动脚本）。配置文件可纳入版本控制，确保团队成员使用一致的开发环境。', groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'Vagrant 入门', url: 'https://developer.hashicorp.com/vagrant/tutorials/getting-started' }] }] },
        { title: 'Provisioning 自动化', description: '支持 Shell、Ansible、Puppet、Chef、Salt 等多种配置管理工具。虚拟机启动后自动执行 Provisioning 脚本，完成软件安装和环境配置。', groups: [{ name: '文档', icon: 'mdi-file-document-outline', items: [{ title: 'Provisioning', url: 'https://developer.hashicorp.com/vagrant/docs/provisioning' }] }] },
        { title: 'Multipass 快速启动', description: 'multipass launch --name myvm --cpus 2 --memory 4G --disk 20G 命令可在 10 秒内启动一个 Ubuntu 实例。支持挂载宿主机目录、端口转发、执行命令。', groups: [{ name: '参考', icon: 'mdi-file-document-outline', items: [{ title: 'Multipass 命令参考', url: 'https://multipass.run/docs/multipass-cli-commands' }] }] },
        { title: '同步文件夹', description: 'Vagrant 的 synced_folder 和 Multipass 的 mount 功能实现宿主机与虚拟机之间的文件双向同步。代码在宿主机编辑，在虚拟机中运行。' },
        { title: '网络与端口转发', description: '支持端口转发（宿主机端口映射到虚拟机端口）、私有网络（仅宿主机访问）、公有网络（局域网可访问）等多种网络模式，灵活配置网络拓扑。', groups: [{ name: '文档', icon: 'mdi-file-document-outline', items: [{ title: 'Vagrant 网络配置', url: 'https://developer.hashicorp.com/vagrant/docs/networking' }] }] },
      ]
    },
    {
      name: '进阶技巧', subtitle: '选修',
      children: [
        { title: '多机器部署', description: 'Vagrant 支持在单个 Vagrantfile 中定义多台虚拟机，用于模拟分布式集群环境（如数据库主从、微服务集群）。', optional: true },
        { title: 'Box 制作与分享', description: '使用 Vagrant package 将配置好的虚拟机打包为自定义 Box，团队内部分享或发布到 Vagrant Cloud，快速复用标准环境。', optional: true },
        { title: 'Multipass 自动化', description: '通过 Multipass 的 cloud-init 支持在启动时自动执行配置脚本，实现批量创建和配置多个 Ubuntu 实例。', optional: true },
      ]
    },
  ]
}
</script>
<ContentView :data="data" />
