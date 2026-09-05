---
title: REST API 实战
---

# 第 10 章 · REST API 实战

**本章目标：**

- 理解 REST 设计风格与状态码语义
- 完整实现一个"待办清单" REST API
- 用前端 fetch 联调验证

## 10.1 REST 是什么

REST（Representational State Transfer）是一种接口设计风格，核心约定：

```text
用 URL 表示资源（名词），用 HTTP 方法表示操作（动词）

GET    /api/todos        列出所有待办
GET    /api/todos/3      查看第 3 条
POST   /api/todos        创建一条
PUT    /api/todos/3      更新第 3 条（全量）
DELETE /api/todos/3      删除第 3 条
```

::: info REST 的意义
同一套 URL 语义全团队通用，前端、后端、测试对"这个接口干什么"零沟通成本——它不是协议，是**被广泛采纳的约定**。
:::

## 10.2 状态码：接口的语言

| 状态码 | 含义 | 使用场景 |
| --- | --- | --- |
| 200 | OK | 查询/更新成功 |
| 201 | Created | POST 创建成功 |
| 400 | Bad Request | 参数不合法 |
| 404 | Not Found | 资源不存在 |
| 500 | Internal Server Error | 服务器异常 |

```js
res.status(201).json(created);          // 创建成功
res.status(400).json({ error: '标题不能为空' });
res.status(404).json({ error: '待办不存在' });
```

统一响应结构让前端处理更省心：

```js
// 成功
{ "code": 0, "data": { "...": "..." }, "message": "ok" }
// 失败
{ "code": 1001, "message": "标题不能为空" }
```

## 10.3 数据层：JSON 文件当数据库

学习阶段用 JSON 文件持久化（数据库在后续的 MySQL 教程接管）：

```js
// services/todoService.js
const fs = require('fs/promises');
const path = require('path');
const DB = path.join(__dirname, '../data/todos.json');

async function readAll() {
  try {
    return JSON.parse(await fs.readFile(DB, 'utf-8'));
  } catch {
    return [];    // 文件不存在时返回空表
  }
}

async function writeAll(todos) {
  await fs.writeFile(DB, JSON.stringify(todos, null, 2));
}

let nextId = 100;

module.exports = {
  async list() { return readAll(); },
  async get(id) { return (await readAll()).find((t) => t.id === id); },
  async create({ title }) {
    const todos = await readAll();
    const todo = { id: nextId++, title, done: false, createdAt: Date.now() };
    todos.push(todo);
    await writeAll(todos);
    return todo;
  },
  async update(id, patch) {
    const todos = await readAll();
    const todo = todos.find((t) => t.id === id);
    if (!todo) return null;
    Object.assign(todo, patch);        // 部分更新
    await writeAll(todos);
    return todo;
  },
  async remove(id) {
    const todos = await readAll();
    const next = todos.filter((t) => t.id !== id);
    await writeAll(next);
    return todos.length !== next.length;
  },
};
```

## 10.4 路由层：完整的五个接口

```js
// routes/todos.js
const router = require('express').Router();
const svc = require('../services/todoService');

// 列表 + 简单分页
router.get('/', async (req, res) => {
  const { page = 1, size = 10 } = req.query;
  const all = await svc.list();
  const start = (page - 1) * Number(size);
  res.json({ code: 0, data: all.slice(start, start + Number(size)), total: all.length });
});

// 详情
router.get('/:id', async (req, res) => {
  const todo = await svc.get(Number(req.params.id));
  if (!todo) return res.status(404).json({ code: 1001, message: '待办不存在' });
  res.json({ code: 0, data: todo });
});

// 创建
router.post('/', async (req, res) => {
  const { title } = req.body;
  if (!title?.trim()) {
    return res.status(400).json({ code: 1002, message: '标题不能为空' });
  }
  res.status(201).json({ code: 0, data: await svc.create({ title: title.trim() }) });
});

// 更新
router.put('/:id', async (req, res) => {
  const todo = await svc.update(Number(req.params.id), req.body);
  if (!todo) return res.status(404).json({ code: 1001, message: '待办不存在' });
  res.json({ code: 0, data: todo });
});

// 删除
router.delete('/:id', async (req, res) => {
  const ok = await svc.remove(Number(req.params.id));
  if (!ok) return res.status(404).json({ code: 1001, message: '待办不存在' });
  res.json({ code: 0, data: null, message: '已删除' });
});

module.exports = router;
```

```js
// server.js —— 装配
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());                    // 允许前端跨域调用（本地联调）
app.use(express.json());            // 解析 JSON 请求体
app.use('/api/todos', require('./routes/todos'));

app.use((err, req, res, next) => {  // 兜底错误处理
  console.error(err);
  res.status(500).json({ code: 500, message: '服务器内部错误' });
});

app.listen(3000, () => console.log('API: http://localhost:3000/api/todos'));
```

## 10.5 联调：用前端 fetch 消费接口

```js
// 与 JS 教程第 13 章的 fetch 知识衔接
const BASE = 'http://localhost:3000/api/todos';

// 查列表
const res = await fetch(BASE);
const { data } = await res.json();

// 创建
await fetch(BASE, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: '学 REST' }),
});

// 更新
await fetch(`${BASE}/101`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ done: true }),
});

// 删除
await fetch(`${BASE}/101`, { method: 'DELETE' });
```

::: tip 接口调试工具
不开前端页面也能测接口：VS Code 插件 REST Client（`.http` 文件）、Postman、curl 命令。开发节奏通常是"先调通接口，再写页面"。

```http
### 列表
GET http://localhost:3000/api/todos

### 创建
POST http://localhost:3000/api/todos
Content-Type: application/json

{"title": "学 REST"}
```
:::

## 10.6 服务端也要校验

```js
// 创建接口的参数校验（前端校验会被绕过，服务端是最后防线）
router.post('/', async (req, res) => {
  const { title } = req.body ?? {};
  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ code: 1002, message: '标题不能为空' });
  }
  if (title.length > 50) {
    return res.status(400).json({ code: 1003, message: '标题过长' });
  }
  res.status(201).json({ code: 0, data: await svc.create({ title: title.trim() }) });
});
```

## 本章小结

- REST：URL 是名词资源、方法表动作、状态码表结果
- 分层：routes（接口）→ services（业务）→ data（存取），测试与替换各层独立
- 服务端必须自校验；统一响应结构 {code, data, message}
- fetch 联调五连：列表/详情/创建/更新/删除——前后端的握手仪式
