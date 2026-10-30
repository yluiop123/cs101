---
title: "第 15 章 · Axum 初见：Web 服务"
description: "一个 HTTP 服务大部分时间在等：等数据库、等下游接口。"
series: rust
sidebar:
  order: 15
  label: "Axum 初见：Web 服务"
difficulty: advanced
duration: 6
tableOfContents: true
---

**本章目标：**

- 理解 Rust Web 生态为什么以异步运行时为中心
- 会用 Router 组织路由、用提取器读请求、用 State 共享数据
- 把第 14 章的 todo 数据搬上一组最小 REST 接口

> 本章按 **axum 0.7** 的写法。0.6 与 0.7 在 handler trait、提取器参数顺序、`with_state` 上都有差异，跨章抄代码前先对齐版本号。

## 15.1 为什么 Rust Web 生态以异步运行时为中心

一个 HTTP 服务大部分时间在等：等数据库、等下游接口。传统「一个请求一个线程」在并发上万时会被内存和上下文切换拖垮。Go 的答案是 goroutine——每请求几千字节栈、由运行时调度、语言内置；Rust 的答案是 `async fn`：两次 `.await` 之间的代码被编译成一个状态机，等待时不占线程，但**语言本身不带调度器**。

于是分工固定下来：`Future`/`async fn` 是语言特性，驱动它的**运行时（runtime）** 来自库。tokio 就扮演这个角色——多线程调度器、异步 `TcpListener`、定时器，以及 `#[tokio::main]`。axum 不自带 runtime，所以 Cargo.toml 里的 `tokio` 不是可选项。

代价也要说清楚：同步与异步代码不互通，异步函数里不能阻塞；生态按「谁是调用方」分裂成 `foo` 与 `tokio-fork`；`.await` 点必须显式写出，跨 `.await` 的借用规则会立刻提醒你别把引用带进未来。这正是 [第 13 章 · 并发编程](../13-concurrency/)「Rust 把并发成本前移到编译期」思路的延续。

## 15.2 依赖与第一个服务

```toml
# Cargo.toml
[package]
name = "todo-api"
version = "0.1.0"
edition = "2021"
[dependencies]
axum = "0.7"                                                 # 版本号以当前 crates.io 为准
tokio = { version = "1", features = ["macros", "rt-multi-thread"] }   # macros 提供 #[tokio::main]
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

```rust
// src/main.rs
use axum::routing::get;
use axum::Router;

#[tokio::main]                       // 宏展开成「建多线程 runtime + block_on(main())」
async fn main() {
    let app = Router::new().route("/", get(|| async { "todo-api" }));
    // 启动阶段的 unwrap 是可接受的样板：绑定失败本来就该让进程退出
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
```

三件事在这里定型：**handler 就是 async 函数**（`async fn`，或返回 future 的闭包），**Router 是路由表**，**`serve` 本身是一个 future**——`.await` 之后进程才真正开始循环处理连接。对照 Go 的 `http.ListenAndServe(":8080", r)`：Go 一行阻塞调用，Rust 拆成「拿 listener」和「poll future」两步，多出来的自由度正是异步化换来的。

## 15.3 Router：方法分派、前缀挂载与合并

```rust
// 五件套挂在 /todos 下：同一路径按 HTTP 方法分派
let todos = Router::new()
    .route("/", get(list).post(create))                        // /todos
    .route("/:id", get(show).patch(update).delete(remove));    // /todos/3

let app = Router::new()
    .route("/", get(handshake))
    .merge(health)                             // 并列：两张路由表直接拼接
    .nest("/todos", todos)                     // 挂载：整棵子路由加前缀
    .fallback(|| async { "未找到" });           // 都没匹配上时的兜底 handler
```

- **`nest` vs `merge`**：`nest(prefix, router)` 给子路由统一加前缀（内层的 `/` 变成 `/todos`）；`merge(other)` 把路由表并列，不加前缀。分组鉴权走 `nest`，按模块拆分（health + users + todos）走 `merge`。
- **路径参数写法**：0.7 用 `:id`（通配是 `*rest`）；0.8 起占位符改成 `{id}`。跨版本迁移时这是最先炸的地方。
- **状态要先闭合**：带状态的子路由得先 `.with_state(...)` 变成无状态的 `Router`，才能安全地 `merge`/`nest`，否则编译器要求两侧状态类型一致（15.5 展开）。路径命中但方法不对时框架自己回 405，不会落到 `fallback`。

:::tip[中间件在哪里]
axum 的中间件复用 tower 的 `Layer`/`Service`：`Router::layer(...)` 包住整棵子树，`route_layer(...)` 只包某条路由；请求日志、超时这类现成能力来自 `tower-http`（例如 `TraceLayer::new_for_http()` 配 `.layer(...)`）。本章不写中间件，知道入口在 `layer` 就够。
:::

## 15.4 提取器：从请求里拿数据

**提取器（extractor）**是 handler 参数的类型：你声明要什么，框架负责从请求里解析出来，解析失败就不进你的函数。0.7 有条硬规则：**提取器参数写在最前面，请求体提取器（`Json`）必须是最后一个参数**——0.6 不检查顺序，这是最常见的版本差异。

```rust
use axum::extract::{Path, Query};
use serde::Deserialize;

async fn by_path(Path(id): Path<u64>) -> String {          // /todos/3 → id = 3
    format!("路径参数 id = {id}")                          // "3" 解码成 u64，失败即拒绝
}

#[derive(Deserialize)]
struct ListQuery { done: Option<bool> }                    // ?done=true；None = 没给这个参数

async fn by_query(Query(q): Query<ListQuery>) -> String {
    format!("筛选 done = {:?}", q.done)
}
```

| 提取器 | 从哪里取 | 备注 |
| --- | --- | --- |
| `Path<T>` | 路径参数 | T 由 serde 解码；多个参数可用元组 |
| `Query<T>` | `?k=v` | `HashMap<String, String>` 或强类型结构体 |
| `Json<T>` | 请求体 | 只能做最后一个参数 |
| `State<T>` | 共享状态 | 见 15.5 |

参数缺失或类型不符时，框架直接回一个错误响应，你的 handler 根本不会被调用——省掉了 Go 里 `if err := c.ShouldBindJSON(&req); err != nil { ... }` 那段手写分支。

## 15.5 State：共享数据与 Arc

内存表要跨请求存活，靠 `State` 提取器。关键规则：**State 每个请求克隆一份**，所以内部类型必须 `Clone`，而且克隆要便宜。

```rust
use axum::extract::State;
use axum::routing::get;
use axum::Router;
use std::sync::{Arc, Mutex};

type AppState = Arc<Mutex<Vec<u64>>>;    // Arc 共享所有权（第 11 章）+ Mutex 跨线程可变（第 13 章）

async fn count(State(db): State<AppState>) -> String {
    let ids = db.lock().expect("锁不该中毒");
    format!("{} 条任务", ids.len())                       // guard 在函数结束时释放
}

// 组装路由时闭合状态（绑定 listener、axum::serve 的部分与 15.2 相同）
let db: AppState = Arc::new(Mutex::new(Vec::new()));
let app = Router::new().route("/count", get(count)).with_state(db);
```

`Arc<Mutex<T>>` 的克隆只是原子计数加一，代价近乎零；少了 `Arc`，每个请求会拿到一份独立拷贝，改了立刻丢。`State` 里也能装配置、连接池句柄——它是依赖注入的最小形态。

:::caution[别跨 .await 持锁]
`std::sync::Mutex` 的 guard 不能跨越 `.await`：异步任务在 await 点可能被换到另一条线程上恢复，锁就「漂」在线程之间，轻则死锁重则编译不过。要在持锁期间做异步 I/O，换 `tokio::sync::Mutex`（它的 `lock()` 返回 future，配合 `.await` 用）。本章的 handler 全程只碰内存，std 版够用且更快。
:::

## 15.6 响应：impl IntoResponse 与状态码

handler 的返回值只要实现 `IntoResponse` 就能直接送出去：`&str`、`Json<T>`、`StatusCode` 以及它们的元组都可以。

```rust
use axum::extract::Path;
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;

async fn ok() -> Json<u64> { Json(1) }                     // 200 + application/json
async fn bad() -> (StatusCode, &'static str) { (StatusCode::BAD_REQUEST, "任务内容不能为空") }
async fn empty() -> StatusCode { StatusCode::NO_CONTENT }  // 204，空响应体

async fn mixed(Path(id): Path<u64>) -> Response {          // 分支类型不同：统一转成 Response
    if id == 0 { (StatusCode::BAD_REQUEST, "id 不能为 0").into_response() }
    else { Json(id).into_response() }
}

async fn risky(Path(id): Path<u64>) -> Result<Json<u64>, StatusCode> {
    if id > 0 { Ok(Json(id)) } else { Err(StatusCode::NOT_FOUND) }   // Err 也得是响应
}
```

最后一种最有意思：`Result` 本身就是合法返回值，`?` 在 handler 里照常可用，错误一路上传后由框架转成响应——[第 7 章 · 错误处理](../07-error-handling/) 的传播链直接接到了 HTTP 层。真实项目通常给自己的错误类型实现 `IntoResponse`，一次决定「业务错误 → 状态码 + JSON 结构」的映射。

## 15.7 综合：todo 五件套与 curl 验证

把 [第 14 章 · 综合实战：CLI 工具](../14-cli-project/) 的数据模型搬上来——存储从 `tasks.json` 换成 `Arc<Mutex<Vec<Task>>>`，进程重启即失忆，持久化留作练习：

```rust
// src/main.rs
use axum::extract::{Path, Query, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::{delete, get, patch, post};
use axum::{Json, Router};
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};

#[derive(Serialize, Clone)]
struct Task { id: u64, text: String, done: bool }
#[derive(Deserialize)]
struct NewTask { text: String }
#[derive(Deserialize)]
struct Change { text: Option<String>, done: Option<bool> }   // PATCH：只改给了的字段
#[derive(Deserialize)]
struct ListQuery { done: Option<bool> }

type AppState = Arc<Mutex<Vec<Task>>>;

async fn list(State(db): State<AppState>, Query(q): Query<ListQuery>) -> Json<Vec<Task>> {
    let tasks = db.lock().expect("锁不该中毒").clone();       // 拷一份，语句结束就释放锁
    Json(match q.done {
        None => tasks,
        Some(want) => tasks.into_iter().filter(|t| t.done == want).collect(),
    })
}

async fn create(State(db): State<AppState>, Json(input): Json<NewTask>) -> impl IntoResponse {
    if input.text.trim().is_empty() {
        return (StatusCode::BAD_REQUEST, "任务内容不能为空").into_response();
    }
    let mut tasks = db.lock().expect("锁不该中毒");
    let id = tasks.iter().map(|t| t.id).max().unwrap_or(0) + 1;
    let task = Task { id, text: input.text, done: false };
    tasks.push(task.clone());
    (StatusCode::CREATED, Json(task)).into_response()         // 与上面的分支类型不同，故都转 Response
}

async fn show(State(db): State<AppState>, Path(id): Path<u64>) -> Result<Json<Task>, StatusCode> {
    let found = db.lock().expect("锁不该中毒").iter().find(|t| t.id == id).cloned();
    found.map(Json).ok_or(StatusCode::NOT_FOUND)              // 404 不带响应体
}

async fn update(State(db): State<AppState>, Path(id): Path<u64>,
    Json(input): Json<Change>) -> Result<Json<Task>, (StatusCode, &'static str)> {
    let mut tasks = db.lock().expect("锁不该中毒");
    let Some(task) = tasks.iter_mut().find(|t| t.id == id) else {
        return Err((StatusCode::NOT_FOUND, "没有这条任务"));
    };
    if let Some(text) = input.text { task.text = text; }      // 没给的字段保持原值
    if let Some(done) = input.done { task.done = done; }
    Ok(Json(task.clone()))
}

async fn remove(State(db): State<AppState>, Path(id): Path<u64>) -> StatusCode {
    let mut tasks = db.lock().expect("锁不该中毒");
    let before = tasks.len();
    tasks.retain(|t| t.id != id);
    if tasks.len() == before { StatusCode::NOT_FOUND } else { StatusCode::NO_CONTENT }
}

#[tokio::main]
async fn main() {
    let db: AppState = Arc::new(Mutex::new(Vec::new()));
    let todos = Router::new()
        .route("/", get(list).post(create))
        .route("/:id", get(show).patch(update).delete(remove))
        .with_state(db);                    // 子路由自带状态，闭合后才是 Router<()>
    let app = Router::new()
        .route("/", get(|| async { "todo-api：试试 GET /todos" }))
        .nest("/todos", todos)
        .fallback(|| async { "未找到" });
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await.unwrap();
    println!("监听 http://127.0.0.1:3000");
    axum::serve(listener, app).await.unwrap();
}
```

`cargo run` 之后用 curl 逐条验证：

```bash
curl -s http://127.0.0.1:3000/todos
# []
curl -s -X POST http://127.0.0.1:3000/todos -H 'Content-Type: application/json' -d '{"text":"写完第 15 章"}'
# {"id":1,"text":"写完第 15 章","done":false}      ← 201 Created
curl -s http://127.0.0.1:3000/todos/1
# {"id":1,"text":"写完第 15 章","done":false}
curl -s -X PATCH http://127.0.0.1:3000/todos/1 -H 'Content-Type: application/json' -d '{"done":true}'
# {"id":1,"text":"写完第 15 章","done":true}       ← 只改 done，text 保持原值
curl -s 'http://127.0.0.1:3000/todos?done=false'
# []                                              ← 已完成的被筛掉
curl -s -o /dev/null -w '%{http_code}\n' -X DELETE http://127.0.0.1:3000/todos/1
# 204                                                ← 删除成功：状态码 + 空响应体
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/todos/99
# 404                                                ← 不存在的 ID
```

Windows PowerShell 里 `curl` 是 `Invoke-WebRequest` 的别名，参数不兼容：改用 `curl.exe` 或 `Invoke-RestMethod`。

## 15.8 自查清单

- [ ] Cargo.toml 给 tokio 打开了 `macros` 与 `rt-multi-thread`，否则启动就报 runtime 相关错误
- [ ] `Json` 请求体提取器在参数表最后一位，`State`/`Path`/`Query` 在最前
- [ ] 路径占位符用的是 0.7 的 `:id`；升到 0.8 前先改成 `{id}`
- [ ] `State` 装的是 `Arc<Mutex<T>>`（或 `Arc<RwLock<T>>`）：克隆便宜的共享句柄
- [ ] 没有任何 `MutexGuard` 跨 `.await`；持锁期间不做异步 I/O
- [ ] 分支返回不同类型响应的位置都调了 `.into_response()`
- [ ] 状态码齐全：201 创建、200 读取、204 删除、400 校验失败、404 不存在

## 本章小结

- Rust Web 以异步运行时为中心：`async fn` 是语言特性，调度由 tokio 提供，axum 只做路由与提取器的组合
- handler 就是 async 函数：参数是提取器（`Path`/`Query`/`Json`/`State`），返回值只需实现 `IntoResponse`
- `Router` 用 `route` 做方法分派、`nest` 加前缀、`merge` 并列、`with_state` 闭合共享数据
- Rust 系列到此收官：所有权与借用是底座，第 14 章的 CLI 与本章的 HTTP 只是同一份数据的两种出口
