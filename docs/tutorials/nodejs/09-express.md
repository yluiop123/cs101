---
title: Express 入门
---

# 第 9 章 · Express 入门

**本章目标：**

- 用 Express 搭起第一个 Web 服务器
- 理解路由与中间件两大核心概念
- 掌握请求参数的三种读取方式

## 9.1 Express：Node 事实标准的 Web 框架

第 5 章用原生 http 模块写路由，路径一多就陷入 if-else 泥潭。Express（expressjs.com）把"路由、中间件、参数解析"标准化：

```bash
pnpm add express
```

```js
// server.js
const express = require('express');
const app = express();
const port = 3000;

// 路由：方法 + 路径 + 处理函数
app.get('/', (req, res) => {
  res.send('<h1>Hello Express</h1>');
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
```

对比原生写法，路由按"方法 + 路径"清晰声明，处理函数只关心业务。

## 9.2 路由：REST 风格的起点

```js
// 不同方法 + 不同路径 = 不同接口
app.get('/todos', (req, res) => res.json(listAll()));       // 查列表
app.post('/todos', (req, res) => res.json(createOne()));    // 建
app.put('/todos/:id', (req, res) => res.json(updateOne())); // 改
app.delete('/todos/:id', (req, res) => res.json(deleteOne()));// 删

// 路径参数：:id 是占位符
app.get('/todos/:id', (req, res) => {
  const id = req.params.id;      // '3'（注意：是字符串）
});

// 查询参数：/todos?page=2&size=10
app.get('/todos', (req, res) => {
  const { page = 1, size = 10 } = req.query;
});

// 响应方法速查
res.send(obj);          // 智能发送（对象自动转 JSON）
res.json(data);         // 显式 JSON
res.status(404).json({ error: 'not found' });   // 链式：状态码 + 内容
```

## 9.3 中间件：Express 的灵魂

中间件（middleware）= 一层层"处理函数"，请求流经它们**按注册顺序**逐个处理：

```js
// 形如 (req, res, next)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} @ ${new Date().toLocaleTimeString()}`);
  next();              // ★ 调用 next() 交给下一层；不调用则请求卡住
});
```

```text
请求 → [日志中间件] → [鉴权中间件] → [解析body] → [路由处理] → 响应
```

常用内置/社区中间件：

```js
// 1. 解析 JSON 请求体（没有它 req.body 是 undefined！）
app.use(express.json());

// 2. 静态文件：一行提供 public 目录
app.use(express.static('public'));   // 访问 /logo.png 即 public/logo.png

// 3. CORS 跨域许可（前端本地开发联调必备）
const cors = require('cors');
app.use(cors());
// pnpm add cors
```

::: danger 中间件顺序敏感
`express.json()` 必须注册在**读 req.body 的路由之前**；`static` 通常放最前（静态资源优先）。顺序错了就是"body 是 undefined"这类玄学问题。
:::

## 9.4 读取请求体的三种姿势

```js
app.use(express.json());   // 先开启

// 1. JSON 请求体：POST /todos  { "title": "学 Express" }
app.post('/todos', (req, res) => {
  const { title } = req.body;       // 已是 JS 对象
  res.status(201).json({ id: 1, title });
});

// 2. 表单格式：Content-Type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// 3. 原始数据：req 上以流形式读取（大文件上传场景，进阶）
```

## 9.5 路由模块化：Router

路由都堆在 server.js 会失控，用 `express.Router` 拆分：

```js
// routes/todos.js
const router = require('express').Router();

router.get('/', (req, res) => res.json(listAll()));
router.post('/', (req, res) => res.status(201).json(createOne(req.body)));
router.delete('/:id', (req, res) => res.json(removeOne(req.params.id)));

module.exports = router;
```

```js
// server.js
const todosRouter = require('./routes/todos');
app.use('/api/todos', todosRouter);   // 该路由下所有路径自动带 /api/todos 前缀
```

## 9.6 错误处理中间件

```js
// 四参数形式 = 错误处理中间件（必须放最后）
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

// 业务里抛错：next(err) 或在 async 函数中 throw
app.get('/boom', async (req, res, next) => {
  try {
    throw new Error('测试错误');
  } catch (err) {
    next(err);   // 交给错误中间件
  }
});
```

## 9.7 项目结构惯例

```text
express-app/
├── server.js          # 入口：装配中间件 + 挂载路由
├── routes/            # 路由层：定义接口
│   └── todos.js
├── services/          # 业务层：纯逻辑（JS 教程第 14 章同款分层）
├── middleware/        # 自定义中间件（日志/鉴权）
└── data/              # 数据存取（暂用 JSON 文件，未来换数据库）
```

## 本章小结

- Express = 路由 + 中间件；`app.use(express.json())` 是写接口的第一行
- 路径参数 `req.params`、查询 `req.query`、请求体 `req.body` 三分天下
- 中间件按注册顺序流转，`next()` 是接力棒
- Router 拆路由、错误中间件放最后、分层结构从第一天养成
