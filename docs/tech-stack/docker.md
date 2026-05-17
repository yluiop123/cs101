<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  type: 'reference',
  name: 'Docker',
  description: 'Docker 是最流行的容器化平台，通过将应用及其依赖打包到轻量级容器中，实现"一次构建，随处运行"。',
  chapters: [
    {
      name: '镜像（Image）',
      children: [
        '只读模板，包含运行应用所需的代码、运行时、库、环境变量',
        '分层结构：每层（Layer）是一个文件系统的变更',
        '镜像仓库：Docker Hub、Harbor、阿里云 ACR',
      ]
    },
    {
      name: '容器（Container）',
      children: [
        '镜像的运行实例，轻量级、隔离的运行环境',
        '每个容器拥有独立的文件系统、网络、进程空间',
        '启动速度快（秒级），资源开销小',
      ]
    },
    {
      name: 'Dockerfile',
      children: [
        'FROM node:18-alpine：指定基础镜像',
        'WORKDIR /app：设置工作目录',
        'COPY package*.json ./：复制依赖文件',
        'RUN npm install：安装依赖',
        'COPY . .：复制源代码',
        'EXPOSE 3000：暴露端口',
        'CMD ["npm", "start"]：容器启动命令',
      ]
    },
    {
      name: '常用命令',
      children: [
        'docker build -t name .：构建镜像',
        'docker run -d -p 8080:80 name：运行容器',
        'docker ps -a：列出所有容器',
        'docker images：列出本地镜像',
        'docker exec -it container sh：进入容器',
        'docker logs container：查看容器日志',
        'docker compose up -d：启动 Compose 服务',
      ]
    },
    {
      name: 'Docker Compose',
      children: [
        '定义和运行多容器应用',
        'services 下定义各个服务（web、db 等）',
        '支持 build、ports、depends_on 等配置',
        '支持 environment 环境变量配置',
        '支持 volumes 数据卷持久化',
      ]
    },
    {
      name: '核心原理',
      children: [
        '命名空间（Namespace）：进程、网络、挂载、PID 隔离',
        '控制组（CGroup）：资源限制（CPU、内存、IO）',
        '联合文件系统（UnionFS）：镜像分层与写时复制（CoW）',
      ]
    },
    {
      name: '最佳实践',
      children: [
        '使用多阶段构建减小镜像体积',
        '使用 .dockerignore 忽略不必要的文件',
        '尽量使用 Alpine 等轻量基础镜像',
        '一个容器只运行一个进程',
        '使用非 root 用户运行容器',
      ]
    },
  ],
  resources: [
    {
      name: "推荐资源",
      items: [
        { title: "Docker 官方文档", url: "https://docs.docker.com/" }
      ],
    }
  ]
}
</script>
<ContentView :data="data" />
