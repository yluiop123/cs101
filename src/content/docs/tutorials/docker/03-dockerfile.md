---
title: "第 3 章 · 编写 Dockerfile"
description: "镜像不是手搓出来的，是按 Dockerfile 逐条指令构建出来的。Dockerfile 就是一个纯文本文件，每行一条指令，每条指令产出一层（或只改元数据）。"
series: docker
sidebar:
  order: 3
  label: "编写 Dockerfile"
difficulty: intermediate
duration: 6
tableOfContents: true
---

**本章目标：**

- 掌握 Dockerfile 常用指令的语义与差异（尤其 CMD / ENTRYPOINT、COPY / ADD）
- 理解层缓存规则，能解释「把 `npm install` 放前面」为什么是反例
- 独立写出一个可用于生产的 Node 服务 Dockerfile，并配好 `.dockerignore`

## 3.1 从一条 build 命令开始

镜像不是手搓出来的，是**按 Dockerfile 逐条指令构建**出来的。Dockerfile 就是一个纯文本文件，每行一条指令，每条指令产出一层（或只改元数据）。

```bash
# 项目根目录结构
# ├── Dockerfile
# ├── .dockerignore
# ├── package.json
# ├── package-lock.json
# └── src/

docker build -t myapp:1.0.0 .        # 最后的点 = 构建上下文目录
docker build -f deploy/Dockerfile -t myapp:1.0.0 .
docker build --progress=plain -t myapp:1.0.0 .    # 看完整输出（排错必备）
docker build --no-cache -t myapp:1.0.0 .          # 忽略缓存重新构建
docker build --build-arg NODE_ENV=production -t myapp:1.0.0 .
```

**构建上下文（build context）**是这条命令里最容易被忽略的概念：Docker 会先把上下文目录下的**全部文件打包发给守护进程**，指令里的 `COPY` 只能从这个上下文里取文件。整体流程就三步：CLI 发送上下文（剔除 `.dockerignore` 命中的部分）→ 逐条执行指令，命中缓存则 `CACHED`，否则新建一层 → 给最终层打上 tag。

:::caution[上下文里别放无关的大文件]
把 `.git`、`node_modules`、构建产物、数据集留在上下文里，会让每次 build 开头那段 sending build context 变得又慢又占空间。控制上下文的正解是 `.dockerignore`（3.6 节），不是把 Dockerfile 放到更深的目录。
:::

## 3.2 常用指令速查

```dockerfile
FROM node:20-alpine                                  # 基座：第一条非注释指令
ARG APP_NAME=myapp                                   # 构建期参数，--build-arg 可覆盖
LABEL org.opencontainers.image.source="https://github.com/acme/myapp"
ENV NODE_ENV=production PORT=3000                    # 写进镜像，运行时可见
WORKDIR /app                                         # 自动建目录，之后以此为相对路径
COPY package.json package-lock.json ./               # 只从构建上下文取文件
RUN npm ci --omit=dev                                # 每条 RUN 产生一层
COPY src ./src
EXPOSE 3000                                          # 仅声明，不会真的开端口
RUN addgroup -S app && adduser -S app -G app
USER app                                             # 之后的 RUN 与主进程都降权
CMD ["node", "src/server.js"]
```

| 指令 | 关键事实 |
| --- | --- |
| `FROM` | 每个 Dockerfile 的起点；决定 base 镜像与可用工具链 |
| `LABEL` | 纯元数据，不产生文件系统层（但仍占一条指令位） |
| `ENV` | 运行时可见，可用 `--env-file` 或 compose 覆盖 |
| `ARG` | **只在构建期可见**，不进最终镜像；常用于传版本号 |
| `WORKDIR` | 会自动 `mkdir`，比 `RUN mkdir && cd` 干净 |
| `COPY` | 源必须位于构建上下文内 |
| `RUN` | 默认走 shell（`/bin/sh -c`），产生一层持久化改动 |
| `EXPOSE` | 仅声明；不写 EXPOSE 端口照样能映射 |
| `USER` | 之后的 RUN 与容器主进程都以该用户身份跑 |
| `VOLUME` | 声明匿名卷挂载点，现代实践更推荐显式在 compose/run 里挂 |

:::tip[ARG 与 ENV 别混用]
`ARG` 的值不会保留到运行时，`ENV` 会。构建期需要的版本号用 `ARG` 传入再落进 `ENV`（如需运行时可见）：`ARG VERSION` + `ENV APP_VERSION=$VERSION`。密钥绝不用 ARG/ENV 写进镜像——它们会留在镜像历史里，用 BuildKit 的 secret mount（第 5 章、第 7 章）。
:::

## 3.3 CMD 与 ENTRYPOINT：谁决定容器怎么启动

两者都在指定「容器启动时执行什么」，区别在于**是否容易被覆盖**：

```text
ENTRYPOINT  容器的主命令（固定不变的部分，通常是可执行文件本身）
CMD         传给主命令的默认参数（也可是完整命令；docker run 后的参数会替换它）
最终执行 = ENTRYPOINT + CMD
```

```bash
docker run myapp:1.0.0                      # 用镜像默认 ENTRYPOINT + CMD
docker run myapp:1.0.0 node -e "console.log(1)"   # 覆盖 CMD（ENTRYPOINT 保留）
docker run --entrypoint sh myapp:1.0.0      # 覆盖 ENTRYPOINT（进容器调试）
```

**exec 形式与 shell 形式的差别必须搞清**：

```dockerfile
# exec 形式（推荐）：PID 1 就是 node，能正确收到 SIGTERM，优雅停机
CMD ["node", "src/server.js"]

# shell 形式：实际执行 /bin/sh -c "node src/server.js"
# PID 1 是 shell，信号默认不转发给 node —— docker stop 会等到超时被 kill -9
CMD node src/server.js
```

:::danger[shell 形式会吃掉信号]
PID 1 在 Linux 里有特殊地位：不主动处理信号就不会退出。用 shell 形式启动服务，`docker stop` 往往要等满 10 秒宽限期后被强杀，正在处理的请求直接断掉。要么用 exec 形式，要么显式加 init 转发：`ENTRYPOINT ["node", "src/server.js"]` 或配合 `--init`。
:::

典型分工模式：ENTRYPOINT 定死「这是个什么程序」，CMD 给「默认参数」。

```dockerfile
FROM alpine:3.20
RUN apk add --no-cache curl               # alpine 基础镜像不带 curl，需显式安装
ENTRYPOINT ["curl"]                       # 固定「这是个 curl 工具容器」
CMD ["-s", "https://example.com"]         # docker run 传参即替换默认参数
```

## 3.4 COPY 与 ADD：默认用 COPY

`ADD = COPY + 两个额外行为`，而这两个额外行为通常不是你想要的：

- `ADD` 会自动解压本地的 `.tar`/`.gz` 等归档到目标目录（解压后不保留归档本身）
- `ADD` 支持 URL 形式下载远程文件，且**不会**因为远程内容变化而失效缓存，也无法校验完整性

```dockerfile
COPY --chown=app:app package.json package-lock.json ./   # 指定属主，避免 root 拥有
COPY --from=builder /app/dist ./dist                     # 跨阶段拷贝（第 5 章）

# 只有这一种情况考虑 ADD：直接 ADD 本地 tar 归档，让 Docker 帮你解压
ADD app-bundle.tar.gz /opt/app/
```

:::tip[别用 ADD 拉公网依赖]
`ADD https://example.com/x.tar.gz /opt/` 看起来省事，实际上构建不可复现（内容变了缓存不失效）、无校验、失败信息难读。换成 `RUN curl -fsSL <url> -o /tmp/x && echo "<sha256>  /tmp/x" | sha256sum -c - && tar -xzf /tmp/x -C /opt/app && rm /tmp/x`。
:::

## 3.5 层缓存与指令顺序

Docker 给每条指令算一个缓存键：**父层 ID + 指令内容 + （COPY/ADD 时）被拷贝文件的校验和**。从上往下，一旦某条缓存失效，其后所有指令都要重跑。

由此推出三条排序法则：

1. **变化频率从低到高排列**：base 镜像、依赖安装放前面，源码拷贝放后面。
2. **RUN 尽量合并**，用 `&&` 串联，减少层数与残留。
3. **不要把 `COPY . .` 放在依赖安装之前**——这是最常见的反例。

```dockerfile
# 反例：任何一行源码改动都会击穿依赖安装这一层缓存
FROM node:20-alpine
WORKDIR /app
COPY . .                      # ← 源码全拷进来
RUN npm install               # ← 每次都要重跑，几十秒到几分钟
CMD ["node", "src/server.js"]
```

```dockerfile
# 正例：先只拷 lockfile，依赖层与源码层解耦
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev         # 只有 lockfile 变了才重跑
COPY src ./src                # 源码改动只击穿这一层（毫秒级）
CMD ["node", "src/server.js"]
```

```text
# 第二次构建（只改了 src）时的输出对比
Step 4/5 : RUN npm ci --omit=dev     ---> (cached)
Step 5/5 : COPY src ./src            ---> 82c55f2a7d0c     ← 只有这层重建
```

:::caution[反例里 `npm install` 还有第二重错]
`npm install` 会按 `package.json` 的范围语义重新解析依赖，构建结果不稳定；容器构建一律用 `npm ci`（严格按 lockfile 安装）。同理 `pip install -r` 要配锁定的 requirements，`go mod download` 要提交 `go.sum`。第二次构建时只有 `COPY src` 这层重建，`RUN npm ci` 显示 CACHED——用 `docker build --progress=plain` 能直接看到命中情况。
:::

## 3.6 .dockerignore 与完整实战

`.dockerignore` 决定哪些文件不进上下文，直接语法接近 gitignore：

```text
# .dockerignore
node_modules
npm-debug.log
.git
.gitignore
.env
.env.*
dist
coverage
Dockerfile
docker-compose.yaml
*.md
```

`node_modules` 必须忽略：宿主机的可选依赖（平台相关二进制）会污染镜像；`.env` 必须忽略：密钥不该进镜像层。

**完整实战：一个 Node 服务的 Dockerfile**

```dockerfile
# syntax=docker/dockerfile:1
FROM node:20-alpine
ARG VERSION=dev                                  # 构建期参数，不进最终镜像
ENV NODE_ENV=production PORT=3000 APP_VERSION=${VERSION}
WORKDIR /app

# 依赖层：只有 lockfile 变化才重建
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# 源码层：改动只击穿这一层
COPY src ./src

# 降权：alpine 的 busybox 自带 addgroup/adduser
RUN addgroup -S app && adduser -S app -G app && chown -R app:app /app
USER app

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/healthz" || exit 1

CMD ["node", "src/server.js"]
```

```bash
docker build --build-arg VERSION=1.4.2 -t myapp:1.4.2 .
docker run -d --name app -p 3000:3000 -e DATABASE_URL="mysql://app:secret@db:3306/app" myapp:1.4.2
docker logs -f app
docker inspect app | grep -A2 Health          # 看健康检查状态
```

:::tip[多阶段与镜像瘦身]
这份 Dockerfile 里 `node:20-alpine` 带着完整 npm 与工具链跑在生产镜像中，仍然偏大。把「构建」与「运行」拆开能砍掉一大截，那是 [第 5 章 · 多阶段构建与镜像优化](../05-multi-stage/) 的全部内容。
:::

## 3.7 构建失败常见坑 · 自查清单

```text
unable to prepare context: path "..." not found
  → 上下文路径写错，或忘了最后的点
COPY failed: file not found in build context
  → 路径不在上下文里（大小写敏感）或被 .dockerignore 排除了
manifest for xxx:9.99 not found
  → base 镜像的 tag 不存在，去 Docker Hub 的 Tags 页核对
npm ci error: package.json and package-lock.json are not in sync
  → lockfile 过期，本地 npm install 重新生成后一起提交
/bin/sh: 1: yarn: not found
  → RUN 里用了 base 镜像没有的命令，先安装或换 base
```

**Dockerfile 自查清单**

- [ ] `FROM` 用明确 tag，不依赖 `latest`；版本以 Docker Hub 当前 tag 为准
- [ ] 先 `COPY` lockfile + 安装依赖，再 `COPY` 源码
- [ ] 依赖安装用确定性命令（`npm ci` 而非 `npm install`）
- [ ] 服务启动用 exec 形式的 `CMD`/`ENTRYPOINT`，信号能传到应用
- [ ] `COPY` 默认优先，`ADD` 只在需要自动解压时使用
- [ ] 有 `.dockerignore`，且包含 `node_modules`、`.git`、`.env`
- [ ] 生产容器不跑 root（`USER`）
- [ ] 每条 `RUN` 清理自己产生的缓存（`npm cache clean`、`apk --no-cache`、`rm -rf /var/cache/apt`）

## 本章小结

- Dockerfile 每条指令产出一层；构建上下文是发给守护进程的文件集合，`COPY` 只能从中取
- `ENTRYPOINT` + `CMD` 拼出主命令，exec 形式才能让应用收到信号并优雅停机；`ADD` 的两个额外行为大多不是你要的
- 层缓存自上而下失效：把低频变化的依赖层放前面，`COPY . .` 后再 `npm install` 是最典型的反例
- `.dockerignore` + 确定性依赖安装 + 非 root 用户，是可上线 Dockerfile 的三条底线
