---
title: 镜像与容器基本操作
---

# 第 2 章 · 镜像与容器基本操作

**本章目标：**

- 熟练使用 pull / run / ps / stop / rm / logs / exec / inspect 这组日常命令
- 理解镜像的只读分层，以及容器与镜像之间「模板 + 实例」的关系
- 会清理磁盘、会读懂常见报错，不再对着终端发呆

## 2.1 pull 与 images：把镜像拿到本地

`docker run` 会自动拉取镜像，但显式 pull 能让你先确认版本再启动：

```bash
docker pull nginx:alpine        # 拉指定 tag
docker pull redis:7-alpine
docker pull mysql:8
docker pull nginx               # 不带 tag：等价于 nginx:latest（生产别这么写）
```

```text
alpine: Pulling fs layer
5a48c97b1b1b: Pull complete
Digest: sha256:9d32a3...       # 内容摘要：唯一标识这次构建产物
Status: Downloaded newer image for nginx:alpine
```

拉下来的东西用这些命令看：

```bash
docker images                   # 本地镜像列表（REPOSITORY / TAG / IMAGE ID / SIZE）
docker image inspect nginx:alpine        # 完整 JSON 元数据
docker history --no-trunc nginx:alpine   # 逐层回溯：每层由哪条指令产生
docker tag nginx:alpine myorg/web:v1     # 给本地镜像起别名
docker rmi nginx:latest           # 删本地镜像（有容器引用它时删不掉）
```

`docker images` 里不同镜像的 SIZE 会重复计算共用的层，所以「所有镜像大小相加」远大于磁盘真实占用——真实数字看 `docker system df`（2.6 节）。

::: tip Digest 才是不可变的身份证
tag 是可以被重新推送覆盖的：今天 `nginx:alpine` 指向的镜像，下周可能就是另一个。锁定 `IMAGE ID` 或 `sha256:` 摘要才能复现同一构建。CI 里锁摘要、本地开发用 tag，是常见分工。
:::

## 2.2 run：容器启动参数解剖

`docker run` = 创建 + 启动。参数极多，先掌握这一批：

```bash
# 交互模式：进来一个 shell，退出即销毁（--rm 自动清理）
docker run -it --rm alpine:3.20 sh

# 后台服务模式：映射端口、注入环境变量、起名、自动重启
docker run -d \
  --name web \
  -p 8080:80 \
  -e GREETING="hello docker" \
  -v $(pwd)/html:/usr/share/nginx/html:ro \
  --restart unless-stopped \
  nginx:alpine
```

| 参数 | 作用 | 记住它的理由 |
| --- | --- | --- |
| `-d` | detached，后台运行 | 服务模式必带；不带就占住当前终端 |
| `-it` | 分配伪终端 + 交互 | 进容器调试用，等价于「开个终端进去」 |
| `--rm` | 退出后自动删除容器 | 一次性任务用，避免僵尸容器堆积 |
| `-p 宿主端口:容器端口` | 端口映射 | 左侧是你能访问的，右侧是容器内监听的 |
| `-e KEY=value` | 环境变量 | 应用配置的主通道 |
| `-v 源:目标[:ro]` | 挂载 | 数据持久化与热更新配置 |
| `--name` | 容器名 | UTS 命名空间的主机名，也是网络里的可解析名字 |
| `--restart` | 重启策略 | `no` / `on-failure` / `always` / `unless-stopped` |
| `--network` | 加入指定网络 | 第 4 章主题 |
| `-m` / `--cpus` | 资源限额 | cgroups 落地（第 1 章） |

```bash
curl -s localhost:8080 | head -5           # 验证映射生效
docker port web                             # 看容器端口到宿主端口的映射表
docker run -d -P nginx:alpine               # -P：随机宿主端口映射到容器声明端口
```

::: warning `-p 8080:80` 的方向别搞反
左侧是宿主机端口，右侧是容器内端口。容器里的进程如果监听 3000，你却写了 `-p 3000:80`，结果是连不上——右侧必须是应用**真正监听**的端口。这是新手第一大坑。
:::

## 2.3 ps / stop / rm：生命周期四件套

容器的状态机很简单：

```text
created ──start──> running ──stop──> exited ──rm──> （消失）
                      │
                      └─ 进程退出 / OOM / 崩溃 ──> exited（带退出码）
```

```bash
docker ps                     # 只在跑的
docker ps -a                  # 全部（含已退出的）
docker ps -a --filter "status=exited"      # 只看退出的
docker ps --filter "name=web"              # 按名字过滤
docker stop web               # 发 SIGTERM，宽限期（默认 10s）后 SIGKILL
docker kill web               # 直接 SIGKILL
docker start web              # 复用同一个容器再启动
docker restart web            # stop + start
docker pause web / docker unpause web    # 冻结进程（调试用，很少用）
docker rename web old-web     # 改名字
docker rm web                 # 删除容器（运行中需 -f）
docker rm $(docker ps -aq --filter "status=exited")    # 批量删已退出的
```

`docker stop` 的宽限期可以由 `docker run --stop-timeout 30` 或 compose 的 `stop_grace_period` 调整。生产上这个值很重要：**给应用留出处理完在途请求的时间**，否则正在处理的请求会被硬切。

::: tip stop 之后 rm，才叫真的删了
`docker stop` 只停进程，容器对象和它的可写层还在；`docker rm` 才回收。已退出的容器不删会一直占名字，`docker run --name web` 会报 `Conflict. The container name "/web" is already in use`——先 `docker rm web` 或换个名字。
:::

## 2.4 logs / exec / inspect：看现场三连

容器「起不来」时，这三条命令覆盖 90% 的排查。

```bash
docker logs web                     # 容器主进程的 stdout/stderr
docker logs -f --tail 50 web        # 追最新 50 行并继续跟随
docker logs --since 10m --timestamps web
docker inspect web | grep -E '"Status"|"ExitCode"|"OOMKilled"'   # 状态三连
docker inspect web | jq '.[0].State'                             # 装了 jq 更清爽
docker events --filter container=web     # 实时事件流（谁在什么时候动了它）
```

进容器内部看：

```bash
docker exec -it web sh              # alpine 系镜像用 sh，别用 bash
docker exec -it web cat /etc/nginx/conf.d/default.conf
docker exec web nginx -t            # 跑一条命令就出来（不带 -it）
docker exec -it web ls -la /var/log/nginx
docker cp web:/etc/nginx/nginx.conf ./nginx.conf     # 从容器里拷文件出来
```

`docker exec` 是**在已存在的容器里另开一个进程**，它不会进入容器的启动流程；所以容器一直崩溃重启时，exec 也用不上（根本没能运行起来）——那种情况先看 logs 和 inspect。

::: warning `bash: executable file not found` 不是 bug
alpine / distroless / scratch 类精简镜像里没有 bash 甚至没有 sh。看到 `exec failed` 先怀疑镜像没带 shell，而不是命令写错了。
:::

## 2.5 镜像分层与容器的关系

镜像是**一叠只读层**，`docker history` 能看见每一层对应 Dockerfile 的哪条指令。启动容器时，Docker 在这叠只读层之上叠一层**可写层**（overlayfs 的上层），容器里的所有写入都发生在这层：

```text
可写层（容器独有，rm 即销毁）
────────── 以下为只读镜像层，可被多个容器共享 ──────────
层 N：COPY 应用代码
层 N-1：RUN npm ci
层 1：base 镜像文件系统
```

由此推出三个必须记住的行为：

- **写时复制（copy-on-write）**：容器修改只读层里的文件时，是把该文件复制进可写层再改，原层不动。所以「在容器里改配置」不会影响镜像，也不会影响别的容器。
- **删除只是加白障**：在容器里 `rm` 掉镜像自带的文件，并不会释放镜像层的空间。
- **容器层越写越大**：长期运行的容器写满可写层会导致宿主磁盘紧张，正确做法是把写入导向数据卷。

```bash
docker diff web          # 看这个容器的可写层改了什么（A=新增 C=修改 D=删除）
docker commit web web-snapshot:v1    # 把可写层固化成新镜像（应急用）
```

::: danger commit 不是构建方式
`docker commit` 会丢失 Dockerfile 的可复现性和分层优势，产物无法审计。它可以用来抢救一次性现场，正式镜像一律回到 Dockerfile 构建（[第 3 章 · 编写 Dockerfile](./03-dockerfile)）。
:::

## 2.6 清理命令与磁盘占用

Docker 的磁盘占用是新手最容易忽略的运维问题。先看账本再动手：

```bash
docker system df              # 分类统计：Images / Containers / Local Volumes / Build Cache
docker system df -v           # 逐条明细：谁占了空间
df -h /var/lib/docker         # 宿主侧真实用量
```

```bash
docker container prune        # 删所有已停止的容器
docker image prune            # 删悬空镜像（dangling：REPOSITORY 与 TAG 都是 none）
docker image prune -a         # 删所有没被容器引用的镜像（会触发重新拉取）
docker builder prune          # 清构建缓存
docker volume prune           # ⚠ 删没被引用的数据卷：数据库数据可能一起没了
docker system prune           # 上面几类的组合（不含 volume、不含未用镜像）
docker system prune -a --volumes    # 核弹级清理，跑之前先想清楚
```

`docker images` 里出现的 `<none>:<none>` 通常是被新构建顶替掉的旧镜像，或构建中断留下的悬空层——用 `docker image prune` 清掉即可。

::: danger volume prune 会删库
只要数据卷没被任何容器引用（比如 compose 项目改名了、容器已删），`docker volume prune` 就会连数据一起删。生产机上执行任何 prune 之前，先 `docker volume ls` 和 `docker system df -v` 确认，并保留备份（备份做法见 [第 4 章 · 数据卷与网络](./04-volumes-networks)）。
:::

## 2.7 常见报错的读法 · 自查清单

报错不要只看第一行，Docker 的错误信息通常包含「类型 + 原因 + 建议」：

```text
Cannot connect to the Docker daemon at unix:///var/run/docker.sock
  → 守护进程没跑：Linux 上 systemctl status docker；Docker Desktop 则是应用没启动
permission denied while trying to connect to the Docker daemon socket
  → 没加 docker 组：sudo usermod -aG docker $USER && newgrp docker
Bind for 0.0.0.0:8080 failed: port is already allocated
  → 宿主端口被占：ss -lntp 找到占用者，或改左边的宿主端口
Error response from daemon: manifest for xxx:1.99 not found
  → tag 不存在（拼错或该版本从没发布）：去 Docker Hub 的 Tags 页核对
exec: "bash": executable file not found in $PATH
  → 精简镜像没 bash，换 sh 或重建镜像
error pulling image ...: net/http: TLS handshake timeout
  → 网络问题：配 mirror（第 1 章 1.7）或挂代理
```

退出码也要会读：

```text
137 = 128 + 9   被 SIGKILL（常见于 OOM：容器内存超了 --memory 限制）
143 = 128 + 15  收到 SIGTERM（正常的 docker stop）
126           找到了命令但不可执行（权限/shebang 问题）
127           找不到命令（路径错、二进制没进镜像）
125           是 docker run 本身失败了，容器根本没创建（参数/镜像问题）
```

**日常操作自查清单**

- [ ] pull 时写明确 tag，不裸用 `latest`
- [ ] `-p` 的右侧端口与应用真实监听端口一致
- [ ] 一次性任务带 `--rm`，服务模式带 `--name` 与 `--restart`
- [ ] 排障顺序固定：`logs` → `inspect` 看退出码 → `exec` 进容器
- [ ] alpine 系用 `sh`，不用 `bash`
- [ ] 定期 `docker system df`，prune 前先看 `volume ls`
- [ ] 数据不放容器可写层

## 本章小结

- 日常命令是一套固定组合：pull/run 起，ps/stop/rm 管生命周期，logs/exec/inspect 排障
- 镜像是只读层的堆叠，容器在其上加一层自己的可写层：写时复制、删容器即丢数据
- 磁盘要先看 `docker system df` 再清；`volume prune` 与 `system prune --volumes` 是危险操作
- 报错读法有套路：端口冲突、tag 不存在、连不上守护进程三大类；退出码 137/127/126 各指一个方向
