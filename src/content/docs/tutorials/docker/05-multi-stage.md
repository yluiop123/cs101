---
title: "多阶段构建与镜像优化"
description: "第 3 章末尾那个 Dockerfile 能跑，但镜像里装着完整 Node 工具链、npm 缓存、devDependencies、编译工具——生产运行时只需要 node 二进制和 nodemodules 里的生产依赖。"
series: docker
sidebar:
  order: 5
  label: "多阶段构建与镜像优化"
difficulty: intermediate
duration: 6
tableOfContents: true
---

**本章目标：**

- 会用多阶段构建把「构建环境」和「运行环境」彻底分开
- 能按取舍表选出 base 镜像（alpine / slim / distroless / scratch）
- 掌握六条瘦身手段与非 root、HEALTHCHECK 这两条安全基线

## 问题：构建依赖全被带进了生产镜像

第 3 章末尾那个 Dockerfile 能跑，但镜像里装着完整 Node 工具链、npm 缓存、devDependencies、编译工具——生产运行时只需要 `node` 二进制和 `node_modules` 里的生产依赖。

```text
朴素构建（node:20-alpine + 全量依赖）    示例：约 1.2GB
多阶段 + alpine 运行时                   示例：约 180MB
多阶段 + distroless                      示例：约 130MB
```

（以上是本教程示例项目 `docker images` 的相对量级，具体数字随依赖而变，动手前后自己量一次。）

多余的体积不只是「拉取慢」：每多一个可执行文件、包管理器、shell，就多一分被利用的攻击面，也多一分 CVE 扫描告警。

## builder 与 runtime 分离

一条 Dockerfile 里可以有多个 `FROM`，每个 `FROM` 开启一个新阶段（stage），用 `AS` 命名；后一个阶段用 `COPY --from=` 精确取前一个阶段的产物。**最终镜像 = 最后一个阶段**。

```dockerfile
# ---- 阶段 1：builder（可以很大，装满工具链）----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci                        # 这里装 devDependencies，构建需要
COPY src ./src
RUN npm run build                 # 产出 ./dist

# ---- 阶段 2：runtime（只装跑起来必需的东西）----
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force   # 只留生产依赖
COPY --from=builder /app/dist ./dist

RUN addgroup -S app && adduser -S app -G app && chown -R app:app /app
USER app
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

三个要点：

- `--from=` 后面可以写**阶段名、阶段序号（`--from=0`）或任意镜像名**（从第三方镜像里抠一个二进制出来）。
- builder 阶段的所有层都不进最终镜像，也不会被 `docker push` 推上去。
- runtime 阶段同样能享受缓存：`npm ci` 那层只在 lockfile 变化时重建。

:::tip[编译型语言更夸张]
Go/C/Rust 项目里 runtime 阶段可以小到 `alpine:3.20` 甚至 `scratch`：

```dockerfile
FROM golang:1.22 AS builder
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /out/server .

FROM scratch
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /out/server /server
ENTRYPOINT ["/server"]
```

关掉 CGO 得到静态二进制，`scratch` 里除了它什么都不剩（Go 官方镜像的推荐形态）。
:::

## base 镜像怎么选

| base | 典型体积 | 有 shell | 调试便利 | 适用 |
| --- | --- | --- | --- | --- |
| `node:20`（Debian 完整） | 大 | 是 | 很好 | 需要编译依赖、内部工具镜像 |
| `node:20-slim` | 中 | 是（缺不少常用命令） | 中 | 需要 glibc、想比完整版小 |
| `nginx:alpine` / `redis:7-alpine` | 小 | 是（busybox） | 好 | 大多数场景的默认选择 |
| `gcr.io/distroless/nodejs20-debian12` | 很小 | **否** | 差 | 生产运行时，追求最小攻击面 |
| `scratch` | 最小 | 否 | 差 | 静态编译的二进制（Go/C/Rust） |

取舍其实是一句话：**体积/攻击面 与 可运维性 的平衡**。

- alpine 用 musl libc：需要 glibc 的绑定（部分 Python C 扩展、某些 Java JNI、`bcrypt` 一类原生模块）可能在 alpine 上出问题，这时退到 `-slim`。
- distroless 只含运行时必需文件，没有 shell、没有包管理器，`docker exec -it` 进不去。排障方式改为：看日志 + 用同版本 debug 变体（distroless 提供 `:debug` 标签，带 busybox）或临时换成 alpine 版镜像复现。
- 镜像地址与 tag 会变，动手前去 Docker Hub / 官方仓库的 Tags 页确认当前存在的标签，别照着记忆写版本号。

:::caution[`latest` 让优化白费]
再小的 base，用 `latest` 也意味着某天构建出来的镜像突然变了、体积暴涨或行为不同。固定 `nginx:alpine` 这类滚动 tag 时，至少在生产环境用 digest 或明确的版本号锁住（第 7 章）。
:::

## 减小体积的六条手段

1. **换更小的 base**：从 `node:20` 到 `node:20-alpine` 通常就是几百 MB 的差距。
2. **多阶段构建**：工具链、编译产物中间态一律留在 builder。
3. **只装生产依赖**：`npm ci --omit=dev`、`pip install --no-cache-dir -r requirements.txt`、`composer install --no-dev`、Go 用 `go mod download` 后静态编译。
4. **合并 RUN 并当场清理**：

```dockerfile
# 反面：装了编译工具、apt 列表缓存全留在层里
RUN apt-get update && apt-get install -y build-essential python3
RUN rm -rf /var/lib/apt/lists/*        # 单独一层 rm 无效：上一层已经有文件了

# 正面：安装与清理在同一条指令里，清理生效于同一层
RUN apt-get update \
 && apt-get install -y --no-install-recommends build-essential python3 \
 && rm -rf /var/lib/apt/lists/*
```

5. **精确 COPY + `.dockerignore`**：`COPY src ./src` 而不是 `COPY . .`；测试数据、文档、`.git`、本地构建产物都排除。
6. **删掉自己不需要的东西**：`npm cache clean --force`、`apk` 用 `--no-cache`、Python 清 `__pycache__`、静态资源里不带 sourcemap（或明确知道为何要带）。

检查谁在占空间：

```bash
docker history --no-trunc myapp:2.0.0     # 每层大小与产生它的指令
docker build --progress=plain -t myapp:2.0.0 .   # 构建过程逐层输出大小
docker images                             # 总体积
```

## 非 root 用户与 HEALTHCHECK

**非 root**：容器里的 root 是宿主机上的 root（同一 UID 0），一旦应用漏洞导致任意文件写入或容器逃逸，影响远大于普通用户。

```dockerfile
# alpine（busybox）
RUN addgroup -S app && adduser -S app -G app && chown -R app:app /app
USER app

# Debian 系镜像
RUN groupadd -r app && useradd -r -g app -d /app -s /usr/sbin/nologin app \
    && chown -R app:app /app
USER app
```

两个常见细节：绑定 1024 以下端口需要 root（非 root 就监听 3000，由 Nginx/compose 转发）；文件写入路径要确保属主正确。

**HEALTHCHECK** 让 Docker 知道「进程在 ≠ 服务可用」：

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:3000/healthz" || exit 1
```

```bash
docker inspect app | grep -A6 Health     # healthy / unhealthy / starting
docker run --no-healthcheck app          # 运行时禁用镜像自带检查
```

:::caution[unhealthy 不会自动重启容器]
`--restart unless-stopped` 只看进程退出，不看健康状态。健康检查失败要自愈，需要在 compose 里用 `depends_on: condition: service_healthy`（编排效果，见第 6 章）或额外的守护方案。健康检查也别打重接口：用一个不查数据库全表、只探活且几毫秒返回的路径。
:::

## 构建缓存：--no-cache 与缓存挂载

BuildKit（现代 Docker 的默认构建器）的常用控制手段：

```bash
docker build -t myapp:2.0.0 .                    # 默认：尽量命中缓存
docker build --no-cache -t myapp:2.0.0 .         # 全部重来（慢，但排除缓存污染）
docker build --pull -t myapp:2.0.0 .             # 强制重新拉取 base 镜像
docker build --build-arg BUILDKIT_INLINE_CACHE=1 -t myapp:2.0.0 .   # 把缓存元数据写进镜像，供 CI 跨机复用
docker buildx du                                 # 看构建缓存占了多大
docker builder prune --keep-storage 5GB          # 保留 5GB 上限
```

`--no-cache` 是排错利器也是性能杀手：只在「怀疑缓存导致结果不对」或发布前的干净验证时用。

Dockerfile 里可以用挂载指令把缓存留在层外：

```dockerfile
# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
# npm 下载缓存放进 type=cache 挂载：不进镜像层，但下次构建还在
RUN --mount=type=cache,target=/root/.npm npm ci --cache /root/.npm
COPY src ./src
RUN npm run build
```

需要凭据时用 secret 挂载，避免 token 落进层里：

```dockerfile
# syntax=docker/dockerfile:1
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=secret,id=npm_token \
    NPM_TOKEN="$(cat /run/secrets/npm_token)" npm ci --omit=dev
```

```bash
echo "npm_automation_token" > ./npm.token
docker build --secret id=npm_token,src=./npm.token -t myapp:2.0.0 .
rm ./npm.token                          # 用完立刻删，且别把它提交进仓库
```

:::danger[ARG/ENV 传密钥等于写进镜像历史]
`docker build --build-arg SECRET=x` 的值能被 `docker history` 看到。构建期需要凭据一律用 `--mount=type=secret`，或者干脆在 CI 里用云端缓存与私有 registry 认证（第 7 章）。
:::

## 体积前后对比 · 综合练习

示例项目的实测形态（数字请自己跑一遍核对，这里给出的是量级关系）：

```text
myapp  v1  node:20 + 全量依赖 + COPY . .            约 1.2GB   层数 30+
myapp  v2  多阶段 + node:20-alpine + --omit=dev      约 180MB   层数 8
myapp  v3  多阶段 + distroless + 缓存挂载            约 130MB   层数 5
```

体积之外，收益还有：构建更快（依赖层缓存稳定）、冷启动更快、CVE 扫描告警数量明显下降、推送与拉取带宽占用小。

**练习**

1. 用第 3 章的 Dockerfile 构建一次，记下 `docker images` 与 `docker history` 的结果。
2. 改造成多阶段版本，再记一次，算出体积与层数差。
3. 故意在源码里改一行注释重新构建，观察哪些层命中缓存；再用 `--no-cache` 对比耗时。
4. 把 runtime 阶段的 base 换成 distroless，体验没有 shell 时如何靠日志排障。
5. 给应用加 `HEALTHCHECK` 并访问一个不存在的 `/healthz`，用 `docker inspect` 观察它变成 `unhealthy`。
6. 列出你的镜像里「不该存在于生产」的 5 个文件/目录（用 `docker run --rm --entrypoint sh 镜像名 -c 'ls -la /app'` 之类方式核对）。

## 本章小结

- 多阶段构建的核心是「最终镜像只等于最后一个阶段」，工具链和中间产物通过 `COPY --from=` 精确搬运
- base 选择是体积/攻击面与可运维性的平衡：alpine 通用、slim 兼容 glibc、distroless 最小但没 shell
- 六条瘦身手段：小 base、多阶段、只装生产依赖、合并 RUN 并同层清理、精确 COPY 与 `.dockerignore`、清掉自建缓存
- 非 root 用户与 `HEALTHCHECK` 是生产镜像基线；`--no-cache` 用于验证，BuildKit 的 cache/secret 挂载兼顾速度与不把凭据写进层
