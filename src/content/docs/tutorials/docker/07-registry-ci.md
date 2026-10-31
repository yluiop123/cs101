---
title: "镜像仓库与 CI 发布"
description: "仓库（registry）是镜像的分发中心。常见三种形态：Docker Hub（默认，命名空间就是你的用户名）、云厂商镜像服务、内网自建 Registry。"
series: docker
sidebar:
  order: 7
  label: "镜像仓库与 CI 发布"
difficulty: intermediate
duration: 6
tableOfContents: true
---

**本章目标：**

- 会登录并推送到 Docker Hub 或自建私有仓库，理解命名空间与凭据
- 定出可回滚的标签策略，说清 `latest` 的三连坑
- 用 GitHub Actions 完成「构建 → 缓存复用 → 扫描 → 推送」，并演练一次回滚

## 仓库、登录与推送

仓库（registry）是镜像的分发中心。常见三种形态：Docker Hub（默认，命名空间就是你的用户名）、云厂商镜像服务、内网自建 Registry。

```bash
docker login                              # 登录 Docker Hub（用户名 + Access Token）
docker login registry.example.com -u team-ci   # 登录私有仓库
docker logout
docker pull registry.example.com/team/todo-api:1.4.2
```

:::tip[Docker Hub 用 Access Token，不用账号密码]
在 Docker Hub 的 Account Settings → Personal access tokens 里生成 token，CI 用它当密码。推送到 Docker Hub 的镜像名必须形如 `你的用户名/仓库名:tag`；`nginx` 这种不带命名空间的写法属于 Docker, Inc.，普通账号推不上去。
:::

自建仓库用 distribution 项目的 `registry:2` 镜像，内网五分钟起一个：

```bash
docker run -d --name registry \
  -p 5000:5000 \
  -v registry-data:/var/lib/registry \
  --restart unless-stopped \
  registry:2

docker tag myapp:1.4.2 localhost:5000/myapp:1.4.2
docker push localhost:5000/myapp:1.4.2
curl -s localhost:5000/v2/_catalog         # 仓库列表；/v2/myapp/tags/list 看某个仓库的 tag
```

仓库只有 HTTP 时，每台客户端要在 `/etc/docker/daemon.json` 显式信任后重启引擎才生效（生产应上 TLS）：

```yaml
{
  "insecure-registries": ["registry.internal:5000"]
}
```

:::caution[裸 Registry 不要直接对外]
`registry:2` 默认没有认证、没有 UI、没有保留策略。内网使用至少要前置 Nginx 做 TLS 与 Basic Auth（挂 `htpasswd`）；跨团队用更倾向于云厂商或 Harbor 这类自带 RBAC、扫描、保留策略的仓库。
:::

## 标签策略：为回滚而设计

一次构建产出的一组 tag 各自承担不同职责：

```bash
docker tag build-local registry.example.com/team/todo-api:1.4.2        # 语义化版本：部署引用它
docker tag build-local registry.example.com/team/todo-api:1.4.2-abc1234 # 带提交号：精确定位代码
docker tag build-local registry.example.com/team/todo-api:latest       # 仅作人类便利指针
docker push registry.example.com/team/todo-api:1.4.2
docker buildx imagetools inspect registry.example.com/team/todo-api:1.4.2   # 取 digest 存档
```

规则按重要性排序：

1. **每个不可变构建有一个唯一、可回滚的部署标识**：`主.次.补丁`（如 `1.4.2`）或再加 git sha 后缀。同一 tag 绝不重复推送不同内容。
2. `latest` 只当附加指针，不写进生产部署文件；更干脆的做法是不发 `latest`。
3. 预览环境用可读标签：`pr-182`、`main-20260901`，配合仓库保留策略定期清理。
4. 生产部署清单记录**摘要（digest）**或明确 tag。

```text
镜像名:tag 可被覆盖  → 同名两次构建内容不同，"回滚到 1.4.1" 就失去意义
sha256 摘要不可变     → 永远指向那一次构建，回滚可精确复现
```

## latest 到底坑在哪

只要部署文件里出现 `image: myapp:latest`，就会连锁触发三个问题：

- **不可复现**：`latest` 指向谁由「谁最后推送」决定，同一份文件在不同时间起出的环境不同。
- **回滚失效**：想回上一版，却发现上一版也叫 `latest` 并已被覆盖，没有任何标识可引用。
- **意外自动升级**：新机器 `pull`、节点重建、`docker compose pull` 都可能拉到内容完全不同的镜像，把未验证的变更带进生产。

正确姿势是把「谁决定版本」交还给人：文件里写 `myapp:1.4.2`，升级 = 明确改一次版本号 + 走一次发布流程。真要「最新」语义，用带时间的标签（`1.4.2-20260901`）而不是 `latest`。涉及具体版本号时，先去 Docker Hub 的 Tags 页确认当前真实存在的标签，别照着记忆写。

:::danger[本地缓存让 latest 更难懂]
本地已存在同名镜像时 `docker run` 不会去仓库核对——于是不同机器上的「同一个 latest」内容不同。开发机上「代码明明改了、容器行为没变」多半就是这条；构建期层缓存的取舍见 [第 3 章 · 编写 Dockerfile](../03-dockerfile/)。
:::

## GitHub Actions：构建并推送

一条最小可用的发布流水线。Actions 的版本号会持续更新，落地前以各 Action 仓库当前发布版本为准。

```yaml
# .github/workflows/release.yaml
name: release
on:
  push:
    tags: ["v*"]                       # 打 tag 才发布，避免每次合并都出镜像
jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3

      - uses: docker/login-action@v3          # 私有仓库/ghcr.io 再各加一步 login
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - id: meta
        uses: docker/metadata-action@v5
        with:
          images: registry.example.com/team/todo-api
          tags: |
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha

      - uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

```bash
git tag v1.4.2 && git push origin v1.4.2      # 打 tag 触发发布
```

要点：

- `docker/metadata-action` 把 git ref 转成一组规范 tag（`1.4.2`、`1.4`、`sha-abc1234`），省掉手写 shell 拼 tag。
- 凭据全部来自仓库 Secrets（Settings → Secrets and variables → Actions），绝不明文写进 workflow。
- **构建与部署解耦**：workflow 只负责产出镜像，部署是另一件事（SSH 改 compose 里的 tag、或交给 CD 平台）。只想验证能否构建时，去掉 `push: true` 并改用 `load: false`，避免污染仓库。

:::caution[跨架构要显式声明]
Runner 是 `linux/amd64`。要同时给 Apple 芯片开发机或 ARM 服务器出镜像，需要加 QEMU 与平台参数：

```yaml
      - uses: docker/setup-qemu-action@v3
      # build-push-action 里追加：
          platforms: linux/amd64,linux/arm64
```

多平台镜像是一份 manifest 清单，必须 `push` 到仓库，不能只 `load` 进本地 `docker images`。
:::

## 构建缓存复用

CI 每次都是干净机器，不复用缓存就意味着每次冷启动依赖安装。三种常用方案：

```yaml
# 方案 A：GitHub Actions 内置缓存（最简单，推荐起步）
          cache-from: type=gha
          cache-to: type=gha,mode=max

# 方案 B：把缓存作为镜像推到仓库（跨 workflow、自建 CI 都能用）
          cache-from: type=registry,ref=registry.example.com/team/todo-api:buildcache
          cache-to: type=registry,ref=registry.example.com/team/todo-api:buildcache,mode=max
```

自建 Runner 或单机流水线还可以用 `type=local,src=/tmp/.buildx-cache` 把缓存放进宿主机目录，配合 CI 缓存目录持久化。

```bash
docker buildx du                                # 缓存占用
docker buildx prune                             # 清理
docker buildx build --no-cache -t myapp:1.4.2 --push .   # 发布前的干净验证
```

配合 Dockerfile 里的 `--mount=type=cache`（[第 5 章 · 多阶段构建与镜像优化](../05-multi-stage/)），常见效果是依赖未变的构建从几分钟降到几十秒。缓存命中率要定期验证：故意改一行 lockfile，看 `npm ci` 那层是否重建，就能确认分层是否合理。`mode=max` 会把中间阶段的层也缓存下来，命中更好但占用更多空间。

## 镜像扫描与安全基线

让「带已知高危漏洞的镜像」进不了仓库：

```bash
# Trivy：最常见的开源扫描器（OS 包与语言依赖的 CVE）
trivy image --severity HIGH,CRITICAL registry.example.com/team/todo-api:1.4.2
trivy image --exit-code 1 --severity CRITICAL --ignore-unfixed myapp:1.4.2   # CI 里直接失败

# Docker Scout：与 Docker Hub 集成的镜像分析
docker scout cves myapp:1.4.2
```

```yaml
# 追加到发布流水线（具体版本号以各 Action 仓库当前发布为准）
      - name: Lint Dockerfile
        uses: hadolint/hadolint-action@v3.1.0
        with:
          dockerfile: Dockerfile
      - name: Scan image
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: registry.example.com/team/todo-api:1.4.2
          severity: CRITICAL,HIGH
          exit-code: "1"
```

比扫描器更重要的一层是基线本身：

1. base 镜像固定版本并定期重建（每周一次以吃到上游补丁）
2. 非 root 运行 + `HEALTHCHECK`
3. 凭据不进镜像：构建期 secret 挂载，运行期注入
4. 只装生产依赖 + 多阶段构建（少一个文件就少一堆 CVE）
5. 仓库开不可变 tag 与保留策略，发布记录留 digest
6. 宿主与引擎及时更新；敏感服务加资源限制与只读根文件系统

:::tip[「忽略漏洞」要有出口]
`--ignore-unfixed` 合理（上游还没补丁），但必须配定期重扫；忽略清单里写明理由与复查日期，否则临时豁免会变永久豁免。
:::

## 回滚策略 · 综合练习

回滚的前提是「上一版镜像还在」且「数据库变更可逆」：

```bash
# 1) 回滚应用：把生产文件里的 myapp:1.5.0 改回 myapp:1.4.2（旧镜像仍在仓库）
docker compose -f compose.yaml -f compose.prod.yaml up -d

# 2) 精确按摘要回滚（tag 曾被覆盖时唯一可信的锚点）：先 pull 再 run
docker pull registry.example.com/team/todo-api@sha256:9d32a3...
docker run -d --name api registry.example.com/team/todo-api@sha256:9d32a3...

# 3) 保留策略：至少留最近 5 个版本 + 最近 30 天镜像，别把回滚需要的东西 prune 掉
```

三种发布节奏按需选：

- **直接换 tag 重新部署**：最简单；要求数据库向后兼容
- **蓝绿（两套环境切换）**：回滚 = 把流量切回旧组，需要反向代理配合
- **滚动（逐实例替换）**：compose 里 `--scale` 加反代摘流；Kubernetes 的默认形态

:::danger[回滚常常卡在数据库迁移]
应用镜像能退回 1.4.2，但迁移脚本已经把 schema 改了。原则：**迁移只向前、且新旧版本都能跑**（先加列 → 改代码 → 下个版本再清理旧列）。破坏性变更留到独立窗口。[第 6 章 · Docker Compose 编排](../06-compose/) 里的 `service_completed_successfully` 正好用来把迁移纳入发布顺序。
:::

**练习**

1. 本地起 `registry:2`，把第 5 章产出的镜像推成 `localhost:5000/myapp:1.0.0`，再用 `_catalog` 与 `tags/list` 验证。
2. 同一构建分别推 `1.0.0` 与 `latest`，然后在部署文件里只用 `1.0.0`，写出两者角色差别。
3. 搭一条 tag 触发的 Actions 流水线，让 `cache-from/to: type=gha` 真正生效（连续两次构建对比耗时）。
4. 加 Trivy 步骤并让 CRITICAL 阻断；人为换成一个有已知漏洞的老 base，验证它拦得住。
5. 完整演练一次回滚：部署 1.4.2 → 部署 1.5.0 → 按 digest 回滚 1.4.2（先用 `docker buildx imagetools inspect` 取 digest），记录命令与耗时。

## 本章小结

- 仓库三选一：Docker Hub（Access Token 认证）、云厂商镜像服务、自建 `registry:2`（务必补 TLS 与认证）
- 标签策略服务于回滚：不可变版本 tag 为主，`latest` 只当人类便利指针，生产部署记 tag 加 digest
- CI 四步走：setup-buildx → login → metadata 生成 tag → build-push；凭据全走 Secrets，缓存用 `type=gha` 或 registry cache
- 扫描加基线把问题挡在推送前；回滚靠保留策略、按摘要部署与「迁移只向前」三条支撑
