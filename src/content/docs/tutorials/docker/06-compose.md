---
title: "第 6 章 · Docker Compose 编排"
description: "前几章手工起容器时，网络、卷、环境变量、端口堆成一条要折行的长命令。应用一旦超过 3 个容器，就需要声明式编排：把拓扑写进文件，一条命令拉起整套。"
series: docker
sidebar:
  order: 6
  label: "Docker Compose 编排"
difficulty: intermediate
duration: 5
---

**本章目标：**

- 读懂并编写 `compose.yaml`：services / networks / volumes 三段结构
- 用健康条件把多容器应用的启动顺序管对，起一套 web + api + db
- 掌握 profile 与多文件覆盖、日常子命令，以及上生产前要改的东西

## 6.1 从一串 docker run 到一份文件

前几章手工起容器时，网络、卷、环境变量、端口堆成一条要折行的长命令。应用一旦超过 3 个容器，就需要**声明式编排**：把拓扑写进文件，一条命令拉起整套。

```bash
docker compose version        # Compose v2：docker compose（中间是空格，引擎插件形式）
docker-compose version        # 老的独立二进制，已停止维护，新环境别用
```

手工方式要按顺序敲一串命令：先 `docker network create backend` 与 `docker volume create dbdata`，再依次 `docker run` 起 `mysql:8` 与 `myapp:1.4.2` 并逐一传端口、环境变量、挂载。换台机器、或者只想重建一次环境，就得把这些参数从头回忆一遍。Compose 把同一份拓扑写进文件后，命令只剩一条 `docker compose up -d`。

Compose 用「项目名」圈住一组资源：默认取定义文件所在目录名，网络与卷会被命名成 `项目名_default`、`项目名_dbdata`。同机放两套同名项目会互相覆盖，用顶层 `name:` 字段或 `COMPOSE_PROJECT_NAME` 显式区分。

## 6.2 文件骨架与命名规则

文件名推荐 `compose.yaml`（历史写法 `docker-compose.yml` 也认）。顶层主要是三块：

```yaml
name: todo-app                    # 项目名
services:                         # 必填：每个 key 是一个服务
  web:
  api:
  db:
networks:
  backend:
    driver: bridge
volumes:
  dbdata:
```

- `services` 的 key 就是容器在自定义网络里的**可解析名字**：`api` 即 `http://api:8000` 里的那个主机名。
- `networks` / `volumes` 可以只写名字，也可以整段省略——引用未声明的名字时 Compose 会自动创建。显式声明的价值是让拓扑一眼可见。
- YAML 缩进只能空格，**不能用 Tab**；含 `:` 或 `#` 的值要加引号（`"8000:8000"`、`DB_PORT: "3306"`）。

:::caution[不声明 volumes 就可能得到匿名卷]
服务里只写 `- /var/lib/mysql`（不带源）会得到匿名卷：`docker compose down` 时它被留着，你却不知道里面是什么。持久数据一律在上层 `volumes:` 声明命名卷。
:::

## 6.3 服务字段详解

```yaml
services:
  api:
    build: .                      # 从源码构建（开发常用）；也能写 context/dockerfile/args
    image: myapp:1.4.2            # build + image 并存：给构建产物起名，便于 push
    ports:
      - "8000:8000"
      - "127.0.0.1:9000:9000"     # 只绑回环，不暴露到公网网卡
    expose: [ "8000" ]            # 仅对网络内可见，不发布到宿主
    environment:
      NODE_ENV: production
      DB_HOST: db                 # 写服务名，绝不写 IP
    env_file: [ .env ]            # 批量注入（见 6.4）
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped
    stop_grace_period: 30s
    deploy:
      resources:
        limits: { cpus: "1.0", memory: 512M }
    networks: [ backend ]
```

| 字段 | 一句话 |
| --- | --- |
| `image` / `build` | 二选一或并存；生产更倾向只用 `image` + 明确 tag |
| `command` / `entrypoint` | 覆盖镜像的 `CMD` / `ENTRYPOINT` |
| `environment` / `env_file` | 单个覆盖 vs 批量注入，前者优先级更高 |
| `depends_on` | 只解决启动顺序，就绪要靠 condition（6.6） |
| `profiles` | 按需启用的服务分组 |
| `container_name` | 一般别设：破坏多副本与 `down` 的可预测性 |

## 6.4 环境变量与 .env

两层机制别混：项目根目录的 `.env` 供 **Compose 自己做 `${VAR}` 插值**；`env_file` 才是把键值**注入容器**环境变量。

```bash
# .env —— 加进 .gitignore 与 .dockerignore，绝不提交
COMPOSE_PROJECT_NAME=todo-dev
MYSQL_ROOT_PASSWORD=please-change-me
DB_NAME=app
API_PORT=8000
```

```yaml
services:
  api:
    environment:
      PORT: "${API_PORT:-8000}"              # 缺省值
      SECRET: "${REQUIRED_VAR:?must set}"     # 未定义就拒绝启动
    env_file: [ .env ]
```

```bash
docker compose config              # 展开后的最终定义：排插值问题的第一站
docker compose --env-file prod.env config
```

:::danger[密码会出现在 config 输出里]
`docker compose config` 把插值结果明文打印，别把它粘进工单或聊天记录。`.env` 的文件权限设成 600，密钥传递在构建期用 secret 挂载（[第 5 章 · 多阶段构建与镜像优化](./05-multi-stage/)）、在运行期用编排平台的凭据机制。
:::

## 6.5 实战：web + api + db 一起起

一套最小可用的三层结构：Nginx 发静态资源并反代，API 只暴露给内部网络，MySQL 的数据在命名卷里。

```yaml
name: todo-app
services:
  web:
    image: nginx:alpine
    ports: [ "8080:80" ]
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./dist:/usr/share/nginx/html:ro
    depends_on: [ api ]
    networks: [ frontend ]

  api:
    image: myapp:1.4.2
    environment:
      NODE_ENV: production
      DB_HOST: db
      DB_NAME: "${DB_NAME:-app}"
    expose: [ "8000" ]
    depends_on:
      db: { condition: service_healthy }
    restart: unless-stopped
    networks: [ frontend, backend ]

  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: "${MYSQL_ROOT_PASSWORD:?must set}"
      MYSQL_DATABASE: "${DB_NAME:-app}"
    volumes:
      - dbdata:/var/lib/mysql
      - ./init-sql:/docker-entrypoint-initdb.d:ro
    healthcheck:
      # $$ 是 Compose 的转义：把这串留给容器内的 shell 展开
      test: ["CMD-SHELL", "mysqladmin ping -h 127.0.0.1 -p\"$$MYSQL_ROOT_PASSWORD\" --silent"]
      interval: 10s
      retries: 5
      start_period: 30s
    restart: unless-stopped
    networks: [ backend ]

networks:
  frontend:
  backend:

volumes:
  dbdata:
```

```bash
docker compose config -q && docker compose up -d    # 先校验再启动
docker compose ps && docker compose logs -f api
docker compose exec db mysql -uroot -p app -e "SHOW TABLES;"
curl -s -o /dev/null -w "%{http_code}\n" localhost:8080
```

`api` 不 `ports` 只 `expose`，外部只能通过 `web` 访问它；`db` 只在 `backend` 网络里，`web` 路由不到它；`docker compose ps` 里三个服务的 STATUS 都会带上 `(healthy)`。这就是第 4 章网络隔离思路在 compose 里的落法。

## 6.6 启动顺序、profile 与多文件覆盖

`depends_on` **只保证被依赖的容器先启动**，不保证它能接受连接。裸写 `depends_on: [ db ]` 时，MySQL 容器起来了但还在初始化数据目录，API 一连就失败。三种 condition 按可靠性递增：

```yaml
services:
  api:
    depends_on:
      db: { condition: service_started }                     # 等价于裸写
      cache: { condition: service_healthy }                   # 要求对方定义过 healthcheck
  migrate:
    image: myapp:1.4.2
    command: ["node", "dist/migrate.js"]                      # 跑完退出码 0 即结束
    depends_on:
      db: { condition: service_healthy }
  web:
    depends_on:
      migrate: { condition: service_completed_successfully }   # 等一次性任务成功退出
```

:::caution[应用侧的重试仍然必须存在]
condition 只在 `up` 阶段生效；`docker compose restart db` 或数据库崩溃恢复时 API 不会跟着重启。连接池要有超时与重试。另外健康检查得用镜像里真有的工具：精简镜像常缺 `curl`/`wget`，此时改 `CMD-SHELL` 或在镜像里备好探活手段。
:::

**profile** 把不常启的服务分组，需要时再带上（`docker compose --profile debug up -d`，或设 `COMPOSE_PROFILES=debug`）：

```yaml
services:
  adminer:
    image: adminer:4
    profiles: [ "debug" ]
    ports: [ "127.0.0.1:8081:8080" ]
```

**多文件覆盖**：基础定义 + 环境差异，用 `docker compose -f compose.yaml -f compose.prod.yaml up -d` 叠加。

```yaml
# compose.prod.yaml —— 只写差异
services:
  api:
    image: registry.example.com/team/todo-api:1.4.2   # 生产不本地 build
    restart: always
  db:
    ports: !reset []          # 取消开发用的宿主映射
    volumes: !override
      - dbdata-prod:/var/lib/mysql
```

合并规则要点：**映射递归合并，列表默认追加而不是替换**。要真正替换端口/挂载这类列表，用规范提供的 `!reset` / `!override` 标签（较老的 Compose 版本不支持，先 `docker compose version` 确认）。

## 6.7 常用子命令与生产自查清单

```bash
docker compose up -d --build          # 重新构建后再起
docker compose ps / top / port api 8000
docker compose logs -f --tail=100 api
docker compose exec api sh
docker compose stop                   # 停，不删容器
docker compose down                   # 停 + 删容器 + 删网络（卷保留）
docker compose down -v                # ⚠ 连命名卷一起删：数据没了
docker compose up -d --scale api=3 --no-recreate    # 扩展副本（不能带固定宿主端口）
docker compose pull / push / config
```

:::danger[down -v 是删数据的命令]
`docker compose down -v` 删除本项目声明的所有命名卷，`docker compose rm` 删容器。别把它们写进自动化脚本，也别设顺手别名；生产变更按第 4 章的备份流程先备份再动手。
:::

Compose 的定位是**单机编排**：开发、测试、小规模单机部署很合适；多机调度、滚动升级、跨节点亲和属于 Swarm/Kubernetes 的范畴。上生产前把这份清单过一遍：

- [ ] 镜像来自私有仓库并有明确 tag 或 digest，生产文件里不出现 `build`
- [ ] `restart`、`deploy.resources.limits`、`stop_grace_period` 三项都设了
- [ ] 敏感配置来自权限 600 的 `.env` 或 secret 机制，不进 git、不进镜像
- [ ] 数据库等内部服务只 `expose`，对外统一走反向代理
- [ ] 命名卷有备份与恢复演练记录，`down -v` 不在任何脚本里
- [ ] CI 里跑一次 `docker compose config -q`，杜绝语法与插值问题；用 `name:` 区分环境，避免同机项目互相覆盖

## 本章小结

- Compose 把多容器拓扑写成声明式文件：`services` 定进程，`networks` 定可达性，`volumes` 定持久化，服务名即 DNS 名
- 环境变量分两层：`.env` 供 Compose 插值，`env_file` 注入容器；有疑问先 `docker compose config`
- `depends_on` 只管顺序不管就绪，用 `service_healthy` / `service_completed_successfully` 收紧，应用侧仍要自带重试
- profile 与多文件覆盖解决「同拓扑、不同环境」；列表默认追加，替换要 `!override`/`!reset`
