---
title: "第 4 章 · 数据卷与网络"
description: "容器可写层随容器消失（第 2 章），要让数据活下来就得挂载。Docker 提供三种："
series: docker
sidebar:
  order: 4
  label: "数据卷与网络"
difficulty: intermediate
duration: 6
---

**本章目标：**

- 分清 bind mount、命名卷、tmpfs 三种挂载，知道各自适用场景
- 掌握 bridge 网络与容器名解析，能让两个容器互相访问
- 完成一次「数据库容器挂数据卷」的实战，并会备份迁移数据

## 4.1 三种挂载方式

容器可写层随容器消失（第 2 章），要让数据活下来就得挂载。Docker 提供三种：

```text
volume（数据卷）    Docker 管理，数据存在 /var/lib/docker/volumes/ 下，默认选择
bind mount（绑定）  把宿主机的具体目录/文件映射进容器，路径由你写死
tmpfs               只写进内存，容器停掉就全没，适合临时敏感数据
```

```bash
# 数据卷：冒号左侧是卷名（不带 / 或 ./ 前缀就被当作卷名）
docker run -d --name db -v dbdata:/var/lib/mysql mysql:8

# bind mount：冒号左侧是宿主路径，:ro 表示只读
docker run -d --name web -v "$(pwd)/html:/usr/share/nginx/html:ro" nginx:alpine

# tmpfs：临时缓存、解密后的密钥文件
docker run -d --name app --tmpfs /run:size=64k,mode=1777 myapp:1.0.0
```

同一件事也可以用更啰嗦但更明确的 `--mount` 写法：

```bash
docker run -d --name web \
  --mount type=bind,source="$(pwd)/html",target=/usr/share/nginx/html,readonly \
  nginx:alpine
```

| 维度 | volume | bind mount |
| --- | --- | --- |
| 谁管路径 | Docker（卷名） | 你（宿主绝对路径） |
| 跨机器可移植 | 差（数据在本地） | 依赖宿主目录结构 |
| 首次挂载空卷 | 自动把镜像内该目录内容复制进去 | 直接遮蔽镜像内目录（空卷会覆盖原文件） |
| 权限问题 | 少 | 常见（SELinux/AppArmor/UID 不匹配） |
| 适合 | 数据库、上传目录等持久数据 | 开发时热更新源码、配置文件 |

:::caution[bind mount 会遮蔽镜像里的同名目录]
把宿主空目录挂到 `/app`，镜像里原本构建进 `/app` 的代码就「消失」了——不是被删，是被遮住。第一次挂载后应用起不来，先怀疑这条。开发期想让镜像保留代码、只覆盖部分文件，就挂到更具体的子路径。
:::

## 4.2 命名卷的命令与迁移

```bash
docker volume create dbdata           # 显式创建（run -v 也会自动创建）
docker volume ls
docker volume inspect dbdata          # 看 Mountpoint：真实落盘目录
docker run -d --name db -v dbdata:/var/lib/mysql mysql:8
docker volume ls --filter "dangling=true"     # 没被任何容器引用的卷
docker volume rm dbdata               # 删卷（数据真没了）
docker volume prune                   # 删所有未被引用的卷（危险，第 2 章 2.6）
```

挂载点默认在 `/var/lib/docker/volumes/卷名/_data`，可以直接 `ls` 看内容，但**不要在宿主上手工编辑数据库文件**——权限与文件系统语义都容易被破坏。

**备份：起一个临时容器同时挂上卷和宿主目录，打包出来。**

```bash
# 备份：把卷内容 tar 到当前目录
docker run --rm \
  -v dbdata:/source:ro \
  -v "$(pwd):/backup" \
  alpine:3.20 \
  tar czf /backup/dbdata-$(date +%F).tar.gz -C /source .

# 恢复：新建一个卷，把归档解进去
docker volume create dbdata-restored
docker run --rm \
  -v dbdata-restored:/target \
  -v "$(pwd):/backup" \
  alpine:3.20 \
  tar xzf /backup/dbdata-2026-09-01.tar.gz -C /target
```

卷整体搬迁到另一台机器：新机器上创建同名卷，把归档传过去按上面「恢复」步骤解开即可。数据库这种有状态服务，更稳的做法是**用引擎自己的导出工具**（MySQL 用 `mysqldump`），因为它能得到逻辑一致的数据，而不是某个时刻的数据文件快照。

```bash
docker exec db sh -c 'exec mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" --all-databases' \
  > all-databases-$(date +%F).sql
```

:::danger[热备不等于可用备份]
`tar` 卷时数据库正在写，得到的是撕裂快照，恢复可能失败。生产上以逻辑备份（dump）为主，卷快照作为辅助；并且**定期做一次恢复演练**——没验证过的备份不算备份。
:::

## 4.3 bridge 网络与容器互访

Docker 默认给容器接在 `bridge` 网络（宿主上的 `docker0` 网桥），每个容器拿到该网络内的独立 IP。

```bash
docker network ls                     # bridge / host / none（外加自定义网络）
docker network create backend         # 自定义 bridge 网络
docker network inspect backend | grep -E '"IPAddress"|"Name"'
docker network connect backend web    # 运行中容器加入网络
docker network disconnect backend web
```

**为什么必须用自定义网络**：默认 `bridge` 网络里的容器**不能通过容器名解析 IP**，只能靠 IP 互访，而 IP 每次重建都会变。自定义 bridge 网络自带内嵌 DNS，容器名和网络别名都能直接解析。

```bash
docker network create backend
docker run -d --name db --network backend -e MYSQL_ROOT_PASSWORD=secret -e MYSQL_DATABASE=app mysql:8
docker run -d --name api --network backend -e DB_HOST=db myapp:1.0.0

# 在 api 容器里验证名字解析与连通性
docker exec api nslookup db           # busybox 自带 nslookup；Debian 系镜像可用 getent
docker exec api sh -c 'nc -z -v db 3306 && echo "db 端口可达"'
```

```text
Server:    127.0.0.11            ← Docker 内嵌 DNS 的地址
Name:      db
Address:   172.21.0.2            ← 容器在该网络内的 IP
```

:::caution[别再用 --link]
`docker run --link db` 是 legacy 容器连接方式，写入环境变量、不支持多网络、compose 里也不该出现。看到老教程里的 `--link`，一律换成 `docker network create` + `--network`。
:::

同一台宿主机上多个容器监听相同端口是可以的（各自的 NET 命名空间互不干扰），这也是「两个 nginx 都能跑 80」的原理（第 1 章 1.4）。

## 4.4 端口映射与 host 网络

对外的口子靠 `-p`（`--publish`）实现：Docker 在宿主上写 iptables/nftables 规则，把宿主端口转发到容器的 IP:端口。

```bash
docker run -d --name web -p 8080:80 nginx:alpine           # 所有网卡都监听
docker run -d --name web -p 127.0.0.1:8080:80 nginx:alpine # 只监听本机回环（更安全的默认）
docker run -d --name web -p 8080:80/udp nginx:alpine       # 指定协议
docker run -d -P nginx:alpine                               # 自动映射 EXPOSE 声明的端口到随机宿主端口
docker port web
```

```text
80/tcp -> 0.0.0.0:8080
```

**`--network host` 是另一套逻辑**：容器不再有自己的 NET 命名空间，直接共用宿主机网络栈，没有端口映射这回事，容器里的 8080 就是宿主的 8080。

```bash
docker run -d --network host nginx:alpine    # nginx 的 80 直接占住宿主 80
```

代价与坑：

```text
Linux        正常工作，省掉 NAT，吞吐与时延最优
macOS/Windows 行为与 Linux 不同（容器跑在虚拟机里），不要把 host 网络当可移植特性
隔离性        容器间端口直接竞争宿主端口，两个都占 80 就有一个起不来
Published ports are discarded when using host network mode   ← -p 会被忽略的明确警告
```

:::tip[该不该用 host 网络]
只有在「超高频 UDP/大流量、需要占用大量端口、要跑多播」这类场景才值得。常规 Web 服务用 bridge + `-p` 更好：可移植、隔离清晰、compose 里也不会有端口冲突的意外。另外别把 `-p 8080:80` 裸绑到公网网卡上——管理界面、数据库端口应当只绑 `127.0.0.1`，由反向代理统一对外。
:::

## 4.5 实战：给 MySQL 容器挂数据卷

这是最典型的「有状态服务」部署形态：数据在卷里、初始化脚本用 bind mount 只读挂进去。

```bash
mkdir -p init-sql && cat > init-sql/01-schema.sql <<'SQL'
CREATE DATABASE IF NOT EXISTS app CHARACTER SET utf8mb4;
CREATE TABLE IF NOT EXISTS app.users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(190) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SQL

docker network create backend

docker run -d --name db \
  --network backend \
  -p 127.0.0.1:3306:3306 \
  -v dbdata:/var/lib/mysql \
  -v "$(pwd)/init-sql:/docker-entrypoint-initdb.d:ro" \
  -e MYSQL_ROOT_PASSWORD='please-change-me' \
  -e MYSQL_DATABASE=app \
  --memory 1g \
  --restart unless-stopped \
  mysql:8
```

MySQL 官方镜像的入口脚本会在**数据目录为空时**按文件名顺序执行 `/docker-entrypoint-initdb.d/` 下的 `.sql`/`.sh`；已经有数据就不再执行。所以：

```bash
docker logs -f db          # 等 "ready for connections"
docker exec -it db mysql -uroot -p -e "SHOW DATABASES;"
# 想重跑初始化：删容器 + 删卷（数据清空）后重新 run
```

:::danger[MYSQL_ROOT_PASSWORD 只是首次初始化用的]
卷里已有数据时改这个环境变量**不会**换掉 root 密码，容器也照常起来。想改密码请进数据库执行 `ALTER USER`。同理，环境变量泄进 shell history 或 compose 文件明文提交，都是很常见的安全事故。
:::

验证数据真的持久化在卷里：

```bash
docker exec -it db mysql -uroot -p app -e "INSERT INTO users(email) VALUES('a@example.com');"
docker stop db && docker rm db
docker run -d --name db2 -v dbdata:/var/lib/mysql -e MYSQL_ROOT_PASSWORD='please-change-me' mysql:8
docker exec -it db2 mysql -uroot -p app -e "SELECT * FROM users;"    # 数据还在
```

## 4.6 挂载与网络的排错套路

```text
No such file or directory / permission denied 写不进挂载目录
  → bind mount 宿主目录不存在（Docker 会按名字创建目录，路径打错就成了空目录）
  → 或容器内用户 UID 对目录无写权限：chown 对应 UID，或改挂 volume
应用连不上数据库（Connection refused / Unknown host）
  → 不在同一网络：docker network inspect backend 看 Containers 列表
  → 用了默认 bridge，容器名不解析：换自定义网络
  → 端口写错：docker exec api nc -z -v db 3306 逐段验证
宿主机上 ss -lntp 看不到端口，但容器里在监听
  → 正常：容器有独立网络栈，只有 -p 映射出来的才在宿主可见
挂载点变成 root 拥有、应用读不了
  → 镜像里 USER 是非 root，而 bind mount 的宿主目录属主不同：加 :ro 或改属主
```

三条最常用的检查命令：

```bash
docker inspect db | grep -A10 Mounts        # 挂载的真实来源与目标
docker inspect db | grep -A6 Networks       # 容器在哪些网络、IP 是多少
docker exec api sh -c 'nslookup db; nc -z -v db 3306'
```

## 4.7 日常操作自查清单

- [ ] 持久数据用命名卷，不写容器可写层；开发热更新用 bind mount
- [ ] bind mount 加 `:ro` 保护宿主文件，路径用绝对路径（`$(pwd)` 拼接）
- [ ] 容器互访一律走自定义 bridge 网络，用容器名而不是 IP
- [ ] 数据库端口只绑 `127.0.0.1:3306`，由反向代理统一对外
- [ ] 卷有备份计划，且做过一次恢复演练
- [ ] 定期 `docker volume ls --filter "dangling=true"` 看有没有孤儿卷
- [ ] 不用 `--link`，不在 macOS/Windows 依赖 `--network host`

## 本章小结

- 挂载三选一：volume 给持久数据、bind mount 给源码与配置热更新、tmpfs 给内存级临时文件；bind mount 会遮蔽镜像内同名目录
- 命名卷的备份靠临时容器打包或引擎自带的导出工具；没演练过恢复的备份不算备份
- 自定义 bridge 网络自带容器名 DNS，跨容器互访的标准姿势是 `docker network create` + `--network`，`--link` 已过时
- `-p` 走 NAT 转发，`--network host` 直用宿主栈但在 Linux 之外语义不同；对外端口尽量只绑回环
