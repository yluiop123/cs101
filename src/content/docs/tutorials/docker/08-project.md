---
title: "第 8 章 · 综合实战：整套应用容器化"
description: "示例项目 ：Vue 单页应用 + Node API + MySQL + Redis 队列 + 后台 worker。"
series: docker
sidebar:
  order: 8
  label: "综合实战：整套应用容器化"
difficulty: intermediate
duration: 4
tableOfContents: true
---

**本章目标：**

- 把一个「前端 + 后端 + 数据库 + Nginx 网关」的 Web 应用完整容器化
- 规划网络分层与数据卷，配好健康检查、日志轮转与备份
- 用一份 compose 起整套环境，并拿着上线清单完成发布自查

## 8.1 目标架构

示例项目 `todo-app`：Vue 单页应用 + Node API + MySQL + Redis 队列 + 后台 worker。源码分三坨（`web/`、`server/`、`worker/`，各自带 lockfile），Dockerfile 与 nginx 配置放在 `deploy/`，初始化 SQL 放在 `db/init/`。容器化后的拓扑：

```text
用户 → gateway（nginx:alpine，对外 80）
        ├── /     → frontend（SPA 静态资源，nginx:alpine 托管）
        └── /api  → api（node:20-alpine，多阶段构建）
                     ├── db（mysql:8，数据在命名卷）
                     └── queue（redis:7-alpine，AOF 在命名卷）→ worker 消费
```

四个 Dockerfile 的职责边界很清楚：`gateway` 与 `frontend` 是「配置与产物打包型」，`api` 与 `worker` 是「依赖安装 + 构建 + 降权型」。四份文件共用一个构建上下文（仓库根目录），因此 `COPY` 路径都从根写起。

## 8.2 网络与数据卷规划

网络按「谁能访问谁」切三层（第 4 章原则的落地）：

| 网络 | 加入者 | 目的 |
| --- | --- | --- |
| `edge` | gateway、frontend、api | 对外入口链路，只有 gateway 发布端口 |
| `backend` | api、db、queue、worker、migrate | 数据面，与外界完全隔离 |
| `ops` | db、queue（+ 可选备份/监控容器） | 运维旁路，备份任务从这里接进来 |

`db` 与 `queue` 只写 `expose` 不写 `ports`；只有 `gateway` 把 80 发布到宿主，开发机上再加 `127.0.0.1:` 前缀。跨层访问必须经过 gateway 反代，这样任何一次「为什么访问不到」都能沿网络成员关系排查。

数据全部落在顶层声明的命名卷里（避免匿名卷）：

```text
todo_mysql-data   → db:/var/lib/mysql       必须备份，恢复演练的主对象
todo_redis-data   → queue:/data             AOF 可重建，但仍纳入备份
证书等宿主目录    → gateway:/etc/... :ro    bind mount，只读
```

## 8.3 网关与前端镜像

`deploy/nginx/gateway.conf` 的关键片段（它只是被 COPY 进镜像的普通文件）：

```text
server {
  listen 80;
  server_name todo.example.com;
  location /api/ {
    proxy_pass http://api:8000/;             # 写服务名，交给 Docker 内嵌 DNS 解析
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
  location / { proxy_pass http://frontend:80; }
  location = /healthz { return 200 "ok\n"; }
}
```

```dockerfile
# deploy/Dockerfile.gateway
FROM nginx:alpine
COPY deploy/nginx/gateway.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1/healthz >/dev/null || exit 1
```

:::caution[别在构建期跑 nginx -t]
配置里的 `proxy_pass http://api:8000` 用到容器名，构建期没有 Docker 的 DNS，`nginx -t` 会报 `host not found in upstream "api"`。配置语法留到启动时用 `docker compose logs gateway` 验证；确实想在启动前校验，需要配 `resolver 127.0.0.11;`（Docker 内嵌 DNS 地址）并把 `proxy_pass` 写成变量形式来延迟解析。
:::

`frontend` 是多阶段构建的典型形态：构建要完整 Node 工具链，运行只要静态文件加 nginx。

```dockerfile
# deploy/Dockerfile.frontend
FROM node:20-alpine AS builder
WORKDIR /src
COPY web/package.json web/package-lock.json ./
RUN npm ci
COPY web/ ./
RUN npm run build                              # 产出 /src/dist

FROM nginx:alpine
COPY deploy/nginx/frontend.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /src/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
```

`deploy/nginx/frontend.conf` 里有两段是 SPA 必需的：`location / { try_files $uri $uri/ /index.html; }` 保证刷新 `/todos/12` 不会 404；对带哈希的 `js|css|woff2|png|svg` 设 `expires 30d` 与 `Cache-Control "public, immutable"`，让浏览器长期缓存。顺带一提，`frontend` 只被 gateway 访问：多这一层换来统一入口与 TLS、`/api` 同源免 CORS、访问日志集中、后端可独立重启。

## 8.4 后端 API 镜像

```dockerfile
# deploy/Dockerfile.api
# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder
WORKDIR /src
COPY server/package.json server/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY server/ ./
RUN npm run build                              # TS 编译到 dist/

FROM node:20-alpine
ENV NODE_ENV=production PORT=8000
WORKDIR /app
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder /src/dist ./dist
RUN addgroup -S app && adduser -S app -G app && chown -R app:app /app
USER app
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/healthz" >/dev/null || exit 1
CMD ["node", "dist/server.js"]
```

三条约定：应用必须监听 `0.0.0.0:8000`（写死 `127.0.0.1` 会让容器外访问不到）；连接串全部来自环境变量，`DB_HOST=db`、`QUEUE_HOST=queue` 用服务名；`/healthz` 只做轻量探测，别在里面扫全表。

## 8.5 worker 镜像与迁移任务

worker 与 api 的依赖和入口都不同，单独一份 Dockerfile 更便于审计与独立伸缩：

```dockerfile
# deploy/Dockerfile.worker
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY worker/package.json worker/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY worker/src ./src
RUN addgroup -S job && adduser -S job -G job && chown -R job:job /app
USER job
CMD ["node", "src/consumer.js"]                # 从 redis 拉任务、写库
```

数据库首次初始化靠 MySQL 镜像的入口脚本（[第 4 章 · 数据卷与网络](../04-volumes-networks/)）：`db/init/01-schema.sql` 挂到 `/docker-entrypoint-initdb.d`，只在数据卷为空时按文件名顺序执行。之后的 schema 变更一律走一次性迁移任务，它与 api 共用镜像、只换 `command`，定义见下面的 compose——注意它不设 `ports`、不进 `edge` 网络，且 `restart` 写作带引号的 `"no"`（YAML 裸写 `no` 会被解析成布尔 `false`）。

## 8.6 compose.yaml：一次起整套

```yaml
name: todo
services:
  gateway:
    build: { context: ., dockerfile: deploy/Dockerfile.gateway }
    image: todo/gateway:1.0.0
    ports: [ "80:80" ]
    depends_on: [ frontend, api ]
    restart: unless-stopped
    networks: [ edge ]
  frontend:
    build: { context: ., dockerfile: deploy/Dockerfile.frontend }
    image: todo/frontend:1.0.0
    restart: unless-stopped
    networks: [ edge ]
  api:
    build: { context: ., dockerfile: deploy/Dockerfile.api }
    image: todo/api:1.0.0
    env_file: [ .env ]
    depends_on:
      migrate: { condition: service_completed_successfully }
      queue: { condition: service_started }
    restart: unless-stopped
    networks: [ edge, backend ]
  worker:
    build: { context: ., dockerfile: deploy/Dockerfile.worker }
    image: todo/worker:1.0.0
    env_file: [ .env ]
    depends_on: { migrate: { condition: service_completed_successfully } }
    restart: unless-stopped
    networks: [ backend ]
  migrate:
    image: todo/api:1.0.0                      # 与 api 同一镜像，只换入口
    command: ["node", "dist/migrate.js"]
    env_file: [ .env ]
    depends_on: { db: { condition: service_healthy } }
    restart: "no"                              # 必须加引号：裸写 no 会被解析成布尔 false
    networks: [ backend ]
  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: "${MYSQL_ROOT_PASSWORD:?must set}"
      MYSQL_DATABASE: "${DB_NAME:-todo}"
    expose: [ "3306" ]
    volumes:
      - mysql-data:/var/lib/mysql
      - ./db/init:/docker-entrypoint-initdb.d:ro
    healthcheck:
      # $$ 是 Compose 转义：把这段留给容器内的 shell 展开
      test: ["CMD-SHELL", "mysqladmin ping -h 127.0.0.1 -p\"$$MYSQL_ROOT_PASSWORD\" --silent"]
      interval: 10s
      start_period: 30s
    restart: unless-stopped
    networks: [ backend, ops ]
  queue:
    image: redis:7-alpine
    command: ["redis-server", "--appendonly", "yes"]
    volumes: [ redis-data:/data ]
    healthcheck: { test: ["CMD", "redis-cli", "ping"], interval: 10s }
    restart: unless-stopped
    networks: [ backend, ops ]
networks:
  edge:
  backend:
  ops:
volumes:
  mysql-data:
  redis-data:
```

```bash
docker compose build && docker compose up -d
docker compose ps                    # 期望：全部 Up，db 与 queue 带 (healthy)
docker compose logs -f api worker    # 追日志看启动过程
```

迁移有两种节奏：让 `up` 自动跑一次性任务（简单，但迁移失败会连带 `api` 起不来），或发布时先 `docker compose run --rm migrate` 成功再 `up -d`（可控性更好）。注意 `service_completed_successfully` 只对「会退出的服务」有意义。

## 8.7 日志、备份与上线自查清单

单容器日志必须设上限，否则 json-file 驱动会把宿主磁盘写满（第 1 章的全局 `log-opts` 只是兜底）：给服务加 `logging: { driver: json-file, options: { max-size: "20m", max-file: "5" } }`。排障导出与每日备份：

```bash
docker compose logs --since 30m --timestamps api > api.log
# 每日 03:00 的 cron：逻辑备份 + AOF 归档，保留 14 天
docker compose exec -T db sh -c 'exec mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" --single-transaction todo' \
  | gzip > /backup/todo-db-$(date +%F).sql.gz
docker run --rm -v todo_redis-data:/source:ro -v /backup:/backup alpine:3.20 \
  tar czf /backup/todo-redis-$(date +%F).tar.gz -C /source .   # 归档由 find -mtime +14 -delete 定期清理
# 恢复演练（没验证过的备份不算备份）
gunzip -c /backup/todo-db-2026-09-01.sql.gz | docker compose exec -T db mysql -uroot -p todo
```

:::danger[上线前必查的四件事]
1）`MYSQL_ROOT_PASSWORD` 只在权限 600 的 `.env` 里且不在 git；2）`db` 与 `queue` 确实没有 `ports`；3）数据卷有备份且成功恢复过一次；4）镜像用明确 tag，生产覆盖文件里不出现 `build`（详见 [第 7 章 · 镜像仓库与 CI 发布](../07-registry-ci/)）。
:::

**上线自查清单**

- [ ] 四个镜像都能独立构建成功，后端体积在百 MB 量级（用 [第 5 章 · 多阶段构建与镜像优化](../05-multi-stage/) 的方法核对）
- [ ] 所有 `FROM` 用明确 tag，版本号已与 Docker Hub 当前 tag 核对
- [ ] 网络分层生效：`docker network inspect todo_backend` 里不该出现 gateway；只有 gateway 发布端口，开发环境进一步只绑 `127.0.0.1`
- [ ] 长期服务都有 `HEALTHCHECK`，一次性任务是 `restart: "no"`
- [ ] 迁移先于应用完成，且应用自带数据库连接重试
- [ ] 日志轮转与磁盘水位监控到位，备份任务已进 cron
- [ ] `docker compose config -q` 通过，发布与回滚流程演练过一次

## 本章小结

- 四个 Dockerfile 各司其职：gateway/frontend 打包配置与静态产物，api/worker 走多阶段 + 非 root + HEALTHCHECK
- 网络按 edge/backend/ops 三层切分，只有网关发布端口；数据全落在顶层声明的命名卷
- 迁移作为一次性任务先行，靠 `service_completed_successfully` 与 `restart: "no"` 编排，避免应用与迁移同时改库
- 日志轮转、逻辑备份加恢复演练、固定 tag 与回滚预案，是从「能跑」到「能上线」的分界线

**Docker 教程全 8 章完** —— 想继续往下，建议接 Linux 教程（进程与 systemd、网络与防火墙）再进入容器编排主题。
