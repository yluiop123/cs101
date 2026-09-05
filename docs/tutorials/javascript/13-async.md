---
title: 异步编程
---

# 第 13 章 · 异步编程

**本章目标：**

- 理解 JS 单线程与事件循环的协作方式
- 从回调演进到 Promise 再到 async/await
- 会用 fetch 请求真实接口

## 13.1 为什么需要异步

JS 是**单线程**语言——同一时刻只做一件事。如果"请求服务器"这样的慢操作同步执行，页面会卡死等待。异步（asynchronous）让慢操作"先挂起、完成后再回来处理"：

```js
console.log('1. 同步任务');
setTimeout(() => console.log('3. 定时器回调'), 0);   // 异步
console.log('2. 同步任务');
// 输出顺序：1 → 2 → 3（定时器哪怕 0ms 也要等同步代码跑完）
```

## 13.2 事件循环：异步的调度机制

事件循环（event loop）的运行规则：

```text
1. 执行同步代码（调用栈）
2. 栈空后，检查任务队列：有完成的异步任务就依次执行回调
3. 回调执行中产生的新异步任务继续排队
4. 循环往复
```

```text
┌─────────────────────────────────────┐
│ 调用栈：同步代码依次执行              │
└──────────────┬──────────────────────┘
               ↓ 栈空后，从队列取回调执行
┌─────────────────────────────────────┐
│ 任务队列：定时器回调 / 网络回调 / 事件回调 │
└─────────────────────────────────────┘
```

::: info 一句话模型
"同步排队执行，异步回调排队等叫号"——理解了这个，setTimeout(fn, 0) 也要排队就不再神秘。
:::

## 13.3 回调时代的问题

最早的异步全靠回调函数：

```js
// 回调地狱（callback hell）：多层嵌套，难以阅读与维护
getUser(id, (user) => {
  getOrders(user.id, (orders) => {
    getDetail(orders[0].id, (detail) => {
      render(detail);        // 三层嵌套才开始干活
    });
  });
});
```

## 13.4 Promise：异步的"容器"

Promise（承诺）代表"一个未来才有结果的操作"，三种状态：**pending（进行中）→ fulfilled（成功）/ rejected（失败）**，状态一旦改变不可逆。

```js
// 创建 Promise
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('任务完成');       // 成功
    // reject(new Error('任务失败'));  // 失败
  }, 1000);
});

// 消费 Promise
p.then((result) => console.log(result))     // 成功时执行
 .catch((err) => console.error(err))        // 失败时执行
 .finally(() => console.log('无论成败都执行'));
```

### 链式调用：消灭嵌套

```js
getUser(id)
  .then((user) => getOrders(user.id))    // 返回新 Promise，继续链
  .then((orders) => getDetail(orders[0].id))
  .then((detail) => render(detail))
  .catch((err) => showError(err));        // 任何一步失败都会到这里
```

链中每一步 return 的值传给下一个 `then`——错误一路向下传递，**一个 catch 兜底全程**。

### Promise 静态方法

```js
// 全部完成（一个失败即失败）
await Promise.all([fetchUser(), fetchPosts()]);

// 全部完成（保留每个的结果，无论成败）
await Promise.allSettled([fetchUser(), fetchPosts()]);

// 任一完成即完成
await Promise.race([fetchA(), fetchB()]);
```

## 13.5 async/await：同步写法的异步

`async/await` 是 Promise 的语法糖，用同步的书写方式表达异步流程：

```js
// async 函数：内部允许 await
async function loadPage(userId) {
  try {
    const user = await getUser(userId);       // 等待 Promise 完成，直接拿到值
    const orders = await getOrders(user.id);  // 顺序执行，无嵌套
    const detail = await getDetail(orders[0].id);
    render(detail);
  } catch (err) {
    showError(err);                           // 替代 .catch
  } finally {
    hideLoading();
  }
}
```

::: danger await 只在 async 函数里
顶层 `await` 需要特殊环境；普通代码里要用就包一层 async 函数。另一个常见错误：`await` 需要顺序执行时才串行——**互不依赖的请求用 Promise.all 并行**，性能差距巨大：

```js
// 慢：串行，总耗时 = a + b
const a = await fetchA();
const b = await fetchB();

// 快：并行，总耗时 = max(a, b)
const [ra, rb] = await Promise.all([fetchA(), fetchB()]);
```
:::

## 13.6 fetch：网络请求标准 API

```js
// GET 请求
async function loadTodos() {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
  if (!res.ok) {                       // fetch 不会因 404/500 抛错，要手动检查
    throw new Error(`请求失败：${res.status}`);
  }
  const data = await res.json();       // 解析 JSON（也是异步）
  return data;
}

// POST 请求
async function createTodo(text) {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: text, done: false }),   // 第 7 章的序列化
  });
  return res.json();
}
```

```html
<style>
  .fetch-demo button { border: 0; background: #2563eb; color: #fff; padding: 8px 18px; border-radius: 6px; cursor: pointer; font-size: 13px; }
  .fetch-demo ul { list-style: none; padding: 0; font-size: 13px; color: #334155; }
  .fetch-demo li { padding: 5px 0; border-bottom: 1px solid #f1f5f9; }
</style>

<div class="fetch-demo">
  <button id="load-btn">从公共测试接口加载 3 条数据</button>
  <ul id="result"></ul>
</div>

<script>
  document.getElementById('load-btn').addEventListener('click', async () => {
    const ul = document.getElementById('result');
    ul.innerHTML = '<li>加载中…</li>';
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=3');
      const data = await res.json();
      ul.innerHTML = data.map((t) => `<li>${t.id}. ${t.title}</li>`).join('');
    } catch (err) {
      ul.innerHTML = `<li style="color:#dc2626">加载失败：${err.message}</li>`;
    }
  });
</script>
```

::: info 真实可运行
把这段代码放进本地 HTML 文件运行，按钮会真实请求公共测试接口（jsonplaceholder.typicode.com）并渲染结果——一个最小完整的"fetch → await → 渲染"闭环。
:::

## 13.7 综合示例：带加载态的请求封装

```js
async function request(url, options = {}) {
  showLoading(true);
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    showLoading(false);        // 无论成败都关闭加载态
  }
}

// 使用：业务代码只关心数据
const users = await request('/api/users');
```

把"加载态、错误检查"收进一层封装，业务代码保持干净——真实项目的 axios 封装（见 [Vue 教程](/tutorials/vue/)）就是同样的思路。

## 本章小结

- 单线程 + 事件循环：同步跑完才跑异步回调
- 回调地狱 → Promise 链（一个 catch 兜底）→ async/await（同步书写）
- 并行请求用 Promise.all；fetch 要手动检查 res.ok
- 请求封装（加载态/错误处理）是工程化第一步
