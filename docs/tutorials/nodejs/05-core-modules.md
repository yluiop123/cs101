---
title: 核心模块：path / fs / http
---

# 第 5 章 · 核心模块：path / fs / http

**本章目标：**

- 熟练使用 path 处理跨平台路径
- 掌握 fs 的文件读写与目录操作
- 用 http 模块理解"服务器"的本质

Node 的内置模块（built-in modules）无需安装，`require`/`import` 即用。本章讲最核心的三个。

## 5.1 path：路径处理

手拼路径字符串在 Windows（`\`）与 macOS/Linux（`/`）之间必然出错，一律用 path：

```js
const path = require('path');

// 拼接：自动使用当前系统的分隔符
path.join('src', 'utils', 'format.js');   // 'src\\utils\\format.js'（Windows）

// 解析
path.resolve('src', './utils');   // 拼成绝对路径（从当前工作目录出发）
path.basename('/a/b/c.txt');      // 'c.txt'
path.dirname('/a/b/c.txt');       // '/a/b'
path.extname('c.txt');            // '.txt'
path.sep;                          // '\\' 或 '/'

// 综合示例：取"不带扩展名的文件名"
const file = 'report.2024.pdf';
path.basename(file, path.extname(file));   // 'report.2024'
```

::: tip __dirname 的日常用法
定位"相对当前脚本"的文件，永远用 `__dirname`（CJS）或 import.meta.url（ESM，见第 4 章），而不是 `process.cwd()`（相对命令执行位置）：

```js
// CJS
const configPath = path.join(__dirname, 'config.json');
```
:::

## 5.2 fs：文件系统

fs（file system）的每个操作都提供三种风格：**回调式 / Promise 式 / 同步式**。现代代码统一用 Promise 风格（`fs/promises`）：

```js
const fs = require('fs/promises');

// 读文件
const text = await fs.readFile('./data.txt', 'utf-8');   // 加编码返回字符串
const buffer = await fs.readFile('./img.png');            // 不加编码返回 Buffer（二进制）

// 写文件
await fs.writeFile('./out.txt', '写入的内容');
await fs.writeFile('./data.json', JSON.stringify(data, null, 2));

// 追加
await fs.appendFile('./log.txt', '新的一行\n');

// 删除
await fs.unlink('./tmp.txt');

// 目录操作
await fs.mkdir('./logs', { recursive: true });   // recursive：多级创建不报错
await fs.readdir('./src');                       // 列出文件名数组
await fs.stat('./data.txt');                     // 文件信息（大小、时间）
stat.isFile(); stat.isDirectory();
```

::: warning 同步版本只用于启动期
`fs.readFileSync` 等同步方法会阻塞整个进程——脚本初始化读一个配置文件可以接受，服务器运行期一律 await。
:::

### 大文件与流（Stream）初见

```js
// 复制大文件：流式搬运，内存占用恒定
const { createReadStream, createWriteStream } = require('fs');
const readable = createReadStream('./big.mp4');
const writable = createWriteStream('./copy.mp4');
readable.pipe(writable);
```

Stream（流）把数据切成小块边读边写，是视频服务、日志收集等场景的基石（进阶话题，理解概念即可）。

## 5.3 http：手写一个最小服务器

用 http 模块从零理解"服务器"三要素：**监听端口 → 读请求 → 写响应**：

```js
const http = require('http');

const server = http.createServer((req, res) => {
  // req：请求对象（方法、路径、头、体）
  // res：响应对象（状态码、头、体）
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

  if (req.url === '/') {
    res.end('<h1>首页</h1>');
  } else if (req.url === '/about') {
    res.end('<h1>关于</h1>');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404 Not Found</h1>');
  }
});

server.listen(3000, () => {
  console.log('服务器已启动：http://localhost:3000');
});
```

`node server.js` 后浏览器访问 `http://localhost:3000`——你已经拥有一个真服务器了。

::: info 手写是为了理解
真实项目不会裸写 http 模块——Express（第 9 章）在它之上封装了路由、中间件、参数解析。但"请求进来 → 处理 → 响应出去"的模型，是所有框架的公共底座。
:::

## 5.4 其他常用内置模块速览

| 模块 | 用途 | 示例 |
| --- | --- | --- |
| `os` | 系统信息 | `os.platform()` / `os.totalmem()` |
| `url` | URL 解析 | `new URL('https://a.com/x?page=2')` |
| `crypto` | 加密/哈希 | `crypto.randomUUID()` 生成唯一 ID |
| `events` | 事件发布订阅 | `EventEmitter`（Express 内部的基础） |
| `process` | 进程信息 | `process.env`（第 11 章环境变量）、`process.argv` 命令行参数 |
| `zlib` | 压缩 | gzip 响应压缩 |

```js
// process.argv：命令行参数（自己写 CLI 工具的基础）
// node deploy.js --env prod
console.log(process.argv);   // ['node 路径', '脚本路径', '--env', 'prod']
```

## 5.5 综合示例：静态文件服务器

```js
const http = require('http');
const fs = require('fs/promises');
const path = require('path');

const server = http.createServer(async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
    const content = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png' };
    res.writeHead(200, { 'Content-Type': types[ext] ?? 'application/octet-stream' });
    res.end(content);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('404 Not Found');
  }
});

server.listen(3000, () => console.log('http://localhost:3000'));
```

path + fs + http 三件套协作：这个 30 行的"迷你静态服务器"正是 Nginx/Express 静态资源能力的本质。

## 本章小结

- path 解决跨平台路径：join/resolve/extname 三板斧
- fs 用 `fs/promises` 异步读写；大文件用 Stream
- http 三要素：listen 端口、req 请求、res 响应——框架的公共底座
- process.argv / process.env 是 CLI 与配置的入口
