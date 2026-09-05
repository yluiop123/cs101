---
title: 环境变量与调试
---

# 第 11 章 · 环境变量与调试

**本章目标：**

- 用环境变量区分开发/生产配置
- 掌握 .env 文件与 dotenv 的标准用法
- 学会 Node 的三种调试方式

## 11.1 为什么需要环境变量

同一份代码要跑在两个环境：

```text
开发环境：连本地数据库 localhost:3306、开调试日志
生产环境：连线上数据库 10.0.0.8:3306、关调试日志、密钥不同
```

**配置与代码分离**：代码只读"变量名"，具体值由环境注入。好处：不用改代码切换环境、敏感信息（密钥/密码）不进 Git。

## 11.2 process.env：读取环境变量

```js
// Node 里所有环境变量挂在 process.env 上
console.log(process.env.NODE_ENV);      // 'development' / 'production'
console.log(process.env.PORT);
console.log(process.env.DATABASE_URL);
```

注意：**值全部是字符串**——`process.env.PORT === '3000'`，比较数字要 `Number(process.env.PORT)`。

## 11.3 .env 文件：本地开发的变量清单

约定：项目根目录放 `.env`，用 `key=value` 格式书写，代码启动时由 dotenv 加载进 process.env。

```bash
# .env（本地开发配置）
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://localhost:5432/mydb
JWT_SECRET=dev-secret-not-for-prod
```

```bash
pnpm add dotenv
```

```js
// server.js —— 最早的代码位置加载
require('dotenv').config();      // 读取 .env 注入 process.env
// ESM 写法：import 'dotenv/config'

const port = Number(process.env.PORT) || 3000;
```

::: danger .env 必须进 .gitignore
```text
# .gitignore
.env
.env.*
```
`.env` 里通常有数据库密码、API 密钥——**提交 Git = 泄密**（历史都删不干净）。提供 `.env.example`（只有 key 没有值）供队友照抄。
:::

### 多环境文件

```text
.env              # 本地开发（默认）
.env.production   # 生产部署时使用
.env.test         # 测试环境
```

```bash
node --env-file=.env.production server.js   # Node 20+ 原生支持，无需 dotenv
```

## 11.4 配置的最佳实践：集中收敛

```js
// config.js —— 所有配置的唯一出口
require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT) || 3000,
  db: process.env.DATABASE_URL,
  isProd: process.env.NODE_ENV === 'production',
};
```

```js
// 业务代码只 import config，不直接摸 process.env
const { port, isProd } = require('./config');
app.listen(port, () => console.log(isProd ? '生产模式' : '开发模式'));
```

好处：配置读取一处收口，漏配/写错一眼定位；切换配置源（如改读配置中心）只改一个文件。

## 11.5 调试方式一：console 三板斧

```js
console.log('普通');
console.table(users);                  // 表格化输出数组对象（最实用）
console.error(err);                    // 错误流（红色）
console.time('query');                 // 计时器
const data = await query();
console.timeEnd('query');              // query: 23.4ms
```

## 11.6 调试方式二：VS Code 断点调试（推荐）

1. 代码行号左侧**点击打断点**
2. 侧边栏"运行和调试"→ 选择 **Node.js** 配置 → F5 启动
3. 请求接口触发断点，此时可以：

| 操作 | 快捷键 | 说明 |
| --- | --- | --- |
| 单步跳过 | F10 | 执行当前行 |
| 单步进入 | F11 | 进入函数内部 |
| 查看/修改变量 | 左侧面板 | 实时观察与修改 |
| 条件断点 | 右键断点 | "仅当 i > 100 时停下" |

断点调试是理解异步代码执行顺序的最佳工具——肉眼排不出的 bug，断点三分钟定位。

`.vscode/launch.json`（团队共享调试配置）：

```json
{
  "type": "node",
  "request": "launch",
  "name": "调试 server",
  "program": "${workspaceFolder}/server.js",
  "env": { "NODE_ENV": "development" },
  "restart": true
}
```

## 11.7 调试方式三：nodemon 热重启

改一行代码手动重启太痛苦，nodemon 监听文件变化自动重启：

```bash
pnpm add -D nodemon

# package.json
"scripts": {
  "dev": "nodemon server.js"
}

npm run dev    # 改代码 → 自动重启 → 立即生效
```

nodemon 与断点调试不冲突（launch.json 里用 nodemon 作为 runtimeExecutable 亦可）。

## 11.8 日志分级意识

```js
// 简易分级（生产项目用 pino/winston 等日志库）
const { isProd } = require('./config');

const log = {
  debug: (...args) => { if (!isProd) console.log('[DEBUG]', ...args); },
  info: (...args) => console.log('[INFO]', ...args),
  error: (...args) => console.error('[ERROR]', ...args),
};

log.debug('只开发环境可见');   // 生产环境自动静音
```

原则：生产日志要能回答"什么时间、谁、做了什么、结果如何"；debug 级日志不进生产。

## 本章小结

- 配置与代码分离：process.env 读值，.env 管本地，.env.example 给队友
- dotenv（或 Node 20+ 的 --env-file）加载；.env 必须 gitignore
- 配置在 config.js 收口；env 值全是字符串要手动转数字
- 调试优先级：console.table / 断点（VS Code）/ nodemon 热重启
