---
title: 部署与 PM2
---

# 第 12 章 · 部署与 PM2

**本章目标：**

- 理解"部署"的完整流程：代码 → 服务器 → 进程常驻
- 掌握 PM2 的进程守护、日志与开机自启
- 了解反向代理与 HTTPS 的部署架构

## 12.1 部署做什么

开发时 `npm run dev` 跑在本机；部署 = 让同样的代码在**服务器上 7×24 常驻运行**：

```text
1. 代码上传服务器（Git 拉取）
2. 安装依赖、构建产物
3. 以"进程守护"方式启动（崩溃自动拉起）
4. 对外暴露端口，用户可访问
```

## 12.2 准备服务器与代码

假定你有一台 Linux 云服务器（阿里云/腾讯云等）：

```bash
# SSH 登录
ssh root@你的服务器IP

# 服务器上装 Node（用 nvm 与开发环境同源）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
nvm install --lts

# 拉代码
git clone https://github.com/你的用户名/my-api.git
cd my-api
pnpm install --prod     # 只装生产依赖（跳过 devDependencies，更快更省）
```

## 12.3 先试一次"裸跑"

```bash
node server.js
# 挂在前台……关掉 SSH 窗口，进程就死了！
```

问题：终端断开进程被杀。解决方案就是**进程管理器**——让进程"后台化 + 崩溃自动重启"。

## 12.4 PM2：生产级进程管理器

```bash
pnpm add -g pm2

# 启动
pm2 start server.js --name my-api

# 常用命令
pm2 list               # 进程列表（状态 online/cpu/内存）
pm2 logs my-api        # 实时日志
pm2 monit              # 资源监控面板
pm2 restart my-api     # 重启
pm2 stop my-api        # 停止
pm2 delete my-api      # 从列表移除
```

PM2 的守护能力：

- **崩溃自动拉起**：进程退出数秒内自动重启
- **日志托管**：自动落盘 `~/.pm2/logs/`，不随终端关闭丢失
- **集群模式**：榨干多核 CPU（下面实战）

## 12.5 生态系统配置：ecosystem.config.js

把启动参数文件化，部署命令化：

```js
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'my-api',
      script: 'server.js',
      instances: 'max',            // 集群模式：按 CPU 核数起多进程
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      max_memory_restart: '500M',  // 内存超限自动重启（防泄漏拖垮）
    },
  ],
};
```

```bash
pm2 start ecosystem.config.js
pm2 save           # 保存当前进程列表
pm2 startup        # 配置开机自启（按提示执行输出的命令）
```

::: info 集群模式原理
cluster 模式下 PM2 起多个**子进程**共享同一端口，请求由系统分发给空闲进程——四核服务器吞吐量约提升 4 倍，且单个子进程崩溃不影响整体服务。
:::

## 12.6 部署流程脚本化

```bash
# deploy.sh —— 一条命令完成更新
git pull
pnpm install --prod
pm2 restart my-api      # 平滑重启（zero-downtime：cluster 模式逐个替换）
```

进阶：把这段流程放进 GitHub Actions（CI/CD），push 到 main 分支自动部署——这是后端方向的下一站。

## 12.7 反向代理与 HTTPS（架构认知）

真实生产中，Node 服务通常**不直接暴露公网**，前面站一个 Nginx：

```text
用户 → https://example.com（Nginx :443，管 HTTPS 证书）
        → 反向代理 → http://127.0.0.1:3000（你的 Node 进程）
```

Nginx 的职责：

- **HTTPS 终结**：证书统一在 Nginx 管理（免费证书用 Let's Encrypt）
- **反向代理**：把 `/api/*` 转发给 Node，`/` 交给静态文件
- **负载均衡**：多个 Node 实例分流
- **静态资源**：直接由 Nginx 秒回，不进 Node

```nginx
server {
    listen 443 ssl;
    server_name example.com;

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
    }
}
```

（Nginx 的完整体系见 Linux 教程（规划中）的后续章节，这里建立"Node 藏在代理后面"的架构观。）

## 12.8 上线检查清单

```text
□ .env 生产配置已就位（绝不提交 Git 的那份）
□ NODE_ENV=production（关闭调试日志、启用性能优化）
□ pm2 start ecosystem.config.js + pm2 save + pm2 startup
□ 数据库连接串指向生产库
□ 错误日志可查看（pm2 logs / 日志文件）
□ 防火墙只开放 80/443，Node 端口仅监听 127.0.0.1
```

## 本章小结

- 裸跑必死：进程守护是部署的第一课，PM2 负责守护/日志/集群/自启
- ecosystem.config.js 把启动配置代码化；部署链路固化为脚本
- 架构：Nginx 挡在前管 HTTPS 与代理，Node 藏在 127.0.0.1
- 上线前过一遍检查清单——部署事故九成出在配置

## Node.js 教程结语

从"什么是 Node"到"生产部署"，你已打通：环境与包管理（npm/pnpm/monorepo）→ 核心模块 → 异步模型 → Express 接口开发 → REST API → 配置与调试 → 部署上线。下一步建议：数据库（SQL 基础教程，规划中）让数据真正持久化，或转向前端框架（[Vue 3](/tutorials/vue/) / [React](/tutorials/react/)）用你写的接口练全栈。
