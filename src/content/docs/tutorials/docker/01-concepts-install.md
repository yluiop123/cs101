---
title: "第 1 章 · 容器概念与安装"
description: "同一份代码，在你的机器上能跑，同事机器上跑不起来，服务器上又换了个错法——这就是经典的「在我机器上是好的」问题。差异来自运行环境：系统版本、依赖库、环境变量、端口占用、文件路径。"
series: docker
sidebar:
  order: 1
  label: "容器概念与安装"
difficulty: intermediate
duration: 6
---

**本章目标：**

- 说清容器与虚拟机的区别，建立「镜像 / 容器 / 仓库」三件套的心智模型
- 在 Linux 上装好 Docker Engine，并知道 Docker Desktop 的差异在哪
- 跑通第一个容器，配置好镜像加速与日志轮转

## 1.1 容器要解决什么问题

同一份代码，在你的机器上能跑，同事机器上跑不起来，服务器上又换了个错法——这就是经典的「在我机器上是好的」问题。差异来自运行环境：系统版本、依赖库、环境变量、端口占用、文件路径。

容器的思路是：**把应用和它需要的一切环境一起打包**，交给标准化运行时执行。

```text
打包内容 = 应用代码 + 语言运行时 + 依赖库 + 配置 + 启动命令
运行保证 = 宿主机装了 Docker Engine，容器内的世界就完全一致
```

Docker 由 dotCloud 于 2013 年开源，名字来自「码头工人」——它把软件交付变成了集装箱运输：不管箱子里装的是 Node 还是 Python，吊装、堆叠、运输的流程完全一样。整个生态只围绕三个名词：

| 概念 | 角色 | 类比 |
| --- | --- | --- |
| 镜像（image） | 只读的打包产物 | 装箱清单 + 标准集装箱模板 |
| 容器（container） | 镜像运行起来的实例 | 真正在货轮上的那个箱子 |
| 仓库（registry） | 镜像的存储与分发中心 | 港口与调度中心 |

## 1.2 容器 vs 虚拟机

两者都能在单机上隔离出多个环境，但隔离层次完全不同。

```text
虚拟机：硬件层虚拟化
  宿主机 OS
    └─ Hypervisor（KVM / Hyper-V / VMware）
         └─ 客户机：完整 Guest OS（自己的内核 + init + ...）
              └─ 你的应用

容器：内核层隔离（共享宿主机内核）
  宿主机 OS（同一个 Linux 内核）
    └─ Docker Engine
         └─ 容器 1 / 容器 2 / 容器 3（各自一套文件系统视图与进程空间）
              └─ 你的应用
```

关键差别一句话：**容器没有自己的内核**，它只是宿主机内核眼里一组「可见范围被限制、用量被限额」的进程。

```text
启动耗时：虚拟机 30 秒起，常见几分钟     容器 亚秒到几秒
内存开销：虚拟机要为 Guest OS 预留整块   容器只算进程自己的 RSS
镜像体积：GB 级                          常见 base 镜像 MB 级
隔离强度：虚拟机更强（独立内核）         容器共享内核，攻击面更大
```

:::tip[什么时候仍然该上虚拟机]
需要不同内核（Linux 宿主机上跑 Windows）、需要对抗不可信租户的强隔离、或需要某些内核模块能力时，虚拟机（以及 Kata/Firecracker 这类安全容器）更合适。日常应用交付，容器是默认答案。
:::

## 1.3 三件套怎么协作

**镜像是一叠只读文件系统层**（layer）加一份 JSON 配置，不是压缩包。每层只记录相对下一层的增改，因此层能被多个镜像共用——`nginx:alpine` 和 `node:alpine` 就共享同一批底层 alpine 层。

```bash
docker pull nginx:alpine     # 从仓库拉到本地
docker images                # 列出本地镜像（含 SIZE 与 IMAGE ID）
```

`nginx:alpine` 由「镜像名 + 冒号 + 标签（tag）」组成。省略 tag 时默认 `latest`，这是很多线上事故的源头，[第 7 章 · 镜像仓库与 CI 发布](./07-registry-ci/) 会专门拆它。完整引用形式是：

```text
[仓库主机名[:端口]/][命名空间/]镜像名[:tag][@sha256:摘要]
```

省略主机名去 Docker Hub；省略命名空间是官方镜像；`@` 后的摘要（digest）指向不可变的某次构建产物，是生产锁版本的正解。

**容器 = 镜像只读层 + 一层自己的可写层。**

```bash
docker run -d --name web1 -p 8081:80 nginx:alpine
docker run -d --name web2 -p 8082:80 nginx:alpine
docker ps
```

```text
CONTAINER ID   IMAGE          STATUS         PORTS                                   NAMES
3f2a1c9d8e7b   nginx:alpine   Up 3 seconds   0.0.0.0:8082->80/tcp, :::8082->80/tcp   web2
9b8c7d6e5f4a   nginx:alpine   Up 5 seconds   0.0.0.0:8081->80/tcp, :::8081->80/tcp   web1
```

两个容器共用同一份镜像层，各自只多占一层薄可写层。

:::caution[容器默认可写层随容器一起消失]
`docker rm` 之后，写在容器里的文件（上传目录、SQLite 文件、日志）全没了。持久化必须走数据卷或 bind mount——见 [第 4 章 · 数据卷与网络](./04-volumes-networks/)。
:::

## 1.4 namespaces 与 cgroups 点到为止

Linux 内核提供两样能力，Docker 把它们组合成「容器」：

**namespaces 负责「看不见」**：

```text
PID    进程号视图：容器里 ps 只看到自己的 1 号进程
NET    独立网卡/IP/端口表（所以两个容器都能监听 80）
MNT    独立挂载视图（容器内的 / 是镜像层拼出来的）
UTS    独立主机名（--name 设置的就是它）
IPC    独立信号量与共享内存
USER   独立 UID/GID 映射（rootless 容器的基础）
```

**cgroups 负责「用不了太多」**：

```bash
# 内存上限 256MB、CPU 约半核：这两个参数最终由 cgroups 落实
docker run -d --name small --memory 256m --cpus 0.5 nginx:alpine
docker inspect small | grep -E '"Memory"|"NanoCpus"'    # 看限制落到哪个字段
```

记一句就够：**namespaces 决定容器能看见什么，cgroups 决定容器能用多少**。深入调优属于运维进阶，本教程不展开。

## 1.5 安装 Docker Engine（Linux）

以 Ubuntu/Debian 为例，两条官方路径。

**方式一：官方便捷脚本（最快）**

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
# 先打开脚本看一眼再执行：任何 pipe-to-shell 都该如此
sudo sh get-docker.sh
```

**方式二：发行版仓库（可控、便于后续升级）**

```bash
sudo apt-get update && sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin
```

`docker-ce` 是引擎本体，`docker-compose-plugin` 提供 `docker compose` 子命令（[第 6 章 · Docker Compose 编排](./06-compose/) 全程要用它）。CentOS/RHEL 把上面命令里的 apt 换成 yum/dnf，仓库 URL 里的 ubuntu 换成 centos 或 rhel 即可。

```bash
sudo systemctl enable --now docker
sudo usermod -aG docker $USER && newgrp docker    # 之后免 sudo 用 docker
docker run --rm hello-world                       # 官方验证镜像
```

:::danger[docker 组等价于本机 root]
守护进程以 root 运行，能进 `docker` 组就能操控它，也就变相拿到宿主机 root。共享机器和 CI Runner 上这么做要三思，更严格隔离用 rootless 模式。
:::

## 1.6 Docker Desktop 与平台差异

Docker Engine 只原生跑在 Linux（依赖 Linux 内核特性）。Windows 与 macOS 的官方方案是 **Docker Desktop**：一个 GUI 应用内跑一个轻量 Linux 虚拟机，引擎装在那台虚拟机里。

```text
Linux     Engine 直跑宿主机内核，容器进程就是宿主机进程
macOS     Docker Desktop（虚拟化层：Apple Virtualization / HyperKit）
Windows   Docker Desktop（WSL 2 或 Hyper-V 后端，WSL 2 是当前主流）
```

由此带来的实操差异：

- **文件 IO 性能**：macOS/Windows 把项目目录挂进容器要跨虚拟机边界，明显慢于 Linux。Windows 上把代码放在 WSL 2 发行版内而非 `C:\` 下能大幅缓解。
- **端口直通**：Desktop 会把容器端口自动暴露到宿主机 `localhost`，开发体验顺滑；Linux 上主要看 `-p` 映射与网桥。
- **授权费用**：Desktop 对大型企业商用需要订阅，Linux 的 Engine 是 Apache-2.0 开源。动手前核对官方定价页。
- **资源配额**：Desktop 要在 Settings → Resources 给虚拟机分 CPU/内存；Linux 无这一层。
- **API socket**：三平台都有 `/var/run/docker.sock`（Desktop 通过兼容层提供），本机 CLI 与 IDE 靠它连进引擎。

:::caution[生产环境不跑 Docker Desktop]
它是**开发机工具**。上线用 Linux + Docker Engine（或 Kubernetes 节点），本教程的性能与行为讨论以 Linux Engine 为基准。
:::

## 1.7 镜像加速与综合练习

国内网络直连 Docker Hub 常超时，常见做法是配置 registry mirror。Linux 编辑（或新建）`/etc/docker/daemon.json`，Docker Desktop 在 Settings → Docker Engine 里编辑同一份 JSON：

```yaml
{
  "registry-mirrors": [
    "https://你的加速地址"
  ],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m",
    "max-file": "3"
  }
}
```

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
docker info | grep -A3 "Registry Mirrors"    # 确认镜像源已加载
docker pull nginx:alpine && docker images
```

:::tip[加速地址从哪来]
公共 mirror 生命周期很短，几个月就失效是常态。请从你所在云厂商的容器镜像服务控制台取当前可用地址，或走企业内网代理仓库，不要粘贴搜索引擎里来历不明的 mirror。上面的 `log-opts` 建议一开始就配：它限制单个容器日志文件体积，防止日志撑爆磁盘。
:::

**练习清单**

1. 让 `docker version` 与 `docker run --rm hello-world` 都正常输出。
2. 拉 `nginx:alpine` 记下 SIZE，再拉 `nginx:latest` 对比体积差，想想为什么。
3. 起两个 nginx 容器分别映射 `8081`/`8082`，浏览器确认都能出欢迎页。
4. 用 `--memory 256m --cpus 0.5` 起一个容器，再用 `docker inspect` 找出限制落在哪个字段。
5. 配好 mirror 与日志轮转并用 `docker info` 验证。
6. 用三句话解释镜像 / 容器 / 仓库如何协作；说不清就回读 1.3。

## 本章小结

- 容器把「应用 + 环境」一起打包，共享宿主机内核，因此比虚拟机启动快、开销小、体积薄，但隔离强度弱于虚拟机
- 镜像是只读分层模板，容器是镜像加一层可写层，仓库负责分发；`镜像名:tag` 省略 tag 就是 `latest`
- 底层只有两件事：namespaces 管「看得见什么」，cgroups 管「能用多少」
- Linux 用 Docker Engine，Windows/macOS 用 Docker Desktop（内含 Linux 虚拟机），差异集中在文件 IO、端口直通与授权
