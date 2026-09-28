---
title: Docker 教程
---

# Docker 教程

> 状态：可学习 · 共 8 章 · 预计 7 小时

Docker 把「应用 + 它需要的一切环境」装进标准容器，让交付从「在我机器上是好的」变成「在任何装了 Docker 的机器上都是好的」。它是云原生时代的通用底座：本机开发靠 Compose 起依赖，发布靠不可变镜像，线上靠容器运行时。本教程以 Linux 上的 Docker Engine 为主线，从概念与安装一路讲到多阶段构建、Compose 编排、CI 发布，最后一章把一套 Web 应用完整容器化。

## 前置教程

- [Linux 教程](/tutorials/linux/)：命令行、进程与服务管理、文件权限与网络基础

## 章节目录

1. [第 1 章 · 容器概念与安装](./01-concepts-install)
2. [第 2 章 · 镜像与容器基本操作](./02-images-containers)
3. [第 3 章 · 编写 Dockerfile](./03-dockerfile)
4. [第 4 章 · 数据卷与网络](./04-volumes-networks)
5. [第 5 章 · 多阶段构建与镜像优化](./05-multi-stage)
6. [第 6 章 · Docker Compose 编排](./06-compose)
7. [第 7 章 · 镜像仓库与 CI 发布](./07-registry-ci)
8. [第 8 章 · 综合实战：整套应用容器化](./08-project)

## 你将学到

- 容器与虚拟机的差别，以及 namespaces / cgroups 提供的隔离与限额
- 镜像与容器的全套日常命令：pull / run / exec / logs / inspect 与磁盘清理
- 写出缓存友好、非 root 运行、可优雅停机的 Dockerfile
- 用命名卷与自定义网络安排数据持久化和容器互访，并完成数据库挂卷实战
- 多阶段构建与六条瘦身手段，把镜像从 GB 压到百 MB 量级
- Compose 编排多容器应用，打通「仓库推送 → CI 构建扫描 → 可回滚发布」的完整链路
