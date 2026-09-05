---
title: Node 中的异步与事件循环
---

# 第 6 章 · Node 中的异步与事件循环

**本章目标：**

- 理解 Node 单线程 + 事件驱动的运行模型
- 掌握回调约定（error-first）与 Promise 化
- 能正确回答"Node 为什么适合 IO 密集型任务"

## 6.1 Node 的运行模型：单线程事件循环

Node 主线程是**单线程**的，但它用**事件循环（event loop）+ 线程池**把 IO 做成异步：

```text
        ┌─────────────── 事件循环（主线程）───────────────┐
        │  执行同步代码 → 处理回调队列 → 循环               │
        └──────────────────┬────────────────────────────┘
                           │ 遇到 IO（读写文件/网络请求）
                           ▼
              ┌───── libuv 线程池（幕后干活）─────┐
              │  读文件 ✓  查数据库 ✓  调接口 ✓     │
              └──────────────┬────────────────────┘
                             │ 完成后把回调放回队列
                             ▼
                    事件循环下一轮执行回调
```

关键结论：

- **CPU 密集任务**（视频转码、复杂计算）会卡住主线程——不适合 Node 单点处理
- **IO 密集任务**（API 服务、文件处理、代理）是 Node 的主场——线程池干活，主线程毫秒级响应

::: info 与浏览器事件循环的关系
心智模型一致（同步 → 队列 → 回调），Node 多了阶段划分（timers / poll / check 等）与线程池实现。日常开发记住"同步先跑完，回调排队等"即可。
:::

## 6.2 回调约定：error-first

Node 传统 API 的回调遵循 **error-first（错误优先）** 约定——回调第一个参数永远是错误：

```js
const fs = require('fs');

fs.readFile('./data.txt', 'utf-8', (err, data) => {
  if (err) {
    console.error('读取失败', err);   // 约定：先处理错误
    return;                            // 处理完立即 return
  }
  console.log(data);                   // 无错误时 err 为 null
});
```

规则：`err` 为真 → 出错分支；`err` 为 null → 数据在第二个参数。现代代码用 `fs/promises` 的 await 写法（第 5 章），但读老代码与大量第三方库仍会遇到此约定。

## 6.3 把回调函数 Promise 化

遇到老式回调 API，用 `util.promisify` 一行升级：

```js
const util = require('util');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);   // 回调版 → Promise 版

async function main() {
  const data = await readFile('./data.txt', 'utf-8');
  console.log(data);
}
main();
```

## 6.4 定时器与执行顺序

```js
console.log('1');
setTimeout(() => console.log('4'), 0);      // 宏任务：下一轮循环
Promise.resolve().then(() => console.log('3'));  // 微任务：当前轮尾立即
console.log('2');

// 输出：1 2 3 4
```

优先级规则：**同步代码 > 微任务（Promise.then / queueMicrotask）> 宏任务（setTimeout / setInterval）**。与浏览器一致的层级，只是 Node 把宏任务拆成多个阶段轮转。

::: danger 同步阻塞是头号杀手
一行耗时 5 秒的同步计算（如超大循环），期间**所有请求都在排队**。避免方式：拆分计算、用工作线程（worker_threads，进阶）或交给外部服务。
:::

## 6.5 流程控制：串行与并行

```js
// 串行：一个完成才做下一个（有依赖关系）
async function main() {
  const config = await loadConfig();
  const db = await connectDB(config);
  const data = await query(db);
}

// 并行：互不依赖时同时发起（性能最优）
const [config, cache] = await Promise.all([loadConfig(), loadCache()]);

// 并发限制：同时最多 3 个任务（避免打爆目标服务）
async function pool(tasks, limit = 3) {
  const results = [];
  const executing = new Set();
  for (const task of tasks) {
    const p = task().then((r) => { executing.delete(p); return r; });
    executing.add(p);
    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }
  return Promise.all(executing).then(() => results);
}
```

## 6.6 unhandled rejection：异步错误兜底

```js
// 没人接的 Promise 错误在 Node 15+ 会直接让进程崩溃！
async function risky() {
  throw new Error('炸了');
}
risky();   // ❌ 没 await 没 catch → 进程退出

// 兜底方案
process.on('unhandledRejection', (err) => {
  console.error('未处理的异步错误：', err);
});

// 最佳实践仍然是一层不落地 catch：
main().catch(console.error);
```

## 6.7 综合示例：并发下载器

```js
const fs = require('fs/promises');

async function download(url) {
  const res = await fetch(url);
  const text = await res.text();
  const name = new URL(url).pathname.replaceAll('/', '_') || 'index';
  await fs.writeFile(`./cache/${name}`, text);
  return name;
}

async function downloadAll(urls) {
  // 并行但限流：一次最多 3 个
  const results = [];
  const queue = [...urls];
  async function worker() {
    while (queue.length) {
      const url = queue.shift();
      results.push(await download(url));
    }
  }
  await Promise.all(Array.from({ length: 3 }, worker));
  return results;
}
```

多个 worker 消费同一队列——这就是并发池的经典模式，理解它就理解了爬虫、批量处理的骨架。

## 本章小结

- 单线程事件循环 + 线程池：IO 异步高效，CPU 密集是软肋
- error-first 回调是历史约定；util.promisify 可一键 Promise 化
- 同步 > 微任务 > 宏任务；同步阻塞卡全场
- 串行 await 链 vs Promise.all 并行；未捕获的 rejection 会崩进程
