---
title: 模块化与综合实战
---

# 第 14 章 · 模块化与综合实战

**本章目标：**

- 掌握 ES Module 的导入导出
- 学会组织一个规范的 JS 项目结构
- 综合实战：从零实现完整的待办清单应用

## 14.1 为什么需要模块化

脚本多了以后，`<script src="a.js"><script src="b.js">` 的问题：

1. **全局污染**：所有文件共享全局作用域，变量冲突防不胜防
2. **依赖混乱**：a.js 用到 b.js 的函数，加载顺序错了就崩
3. **无法复用**：想用某个函数只能复制代码

ES Module（ESM，ES6 模块）用"文件即模块"解决一切：每个文件有自己的作用域，通过 `export` 显式暴露、`import` 显式依赖。

## 14.2 export：模块的出口

```js
// utils.js
export const version = '1.0';          // 命名导出（可多个）

export function formatDate(date) {
  return date.toLocaleDateString('zh-CN');
}

export class Storage {
  // ...
}

// 集中导出写法（等价）
const helper = () => {};
export { helper };

// 默认导出：每个模块最多一个（模块的"主产品"）
export default function main() {
  console.log('app 启动');
}
```

## 14.3 import：模块的入口

```js
// 命名导入：名字必须与导出一致
import { version, formatDate } from './utils.js';

// 改名
import { version as v } from './utils.js';

// 默认导入：名字随意（不带花括号）
import main from './app.js';

// 全部导入为一个命名空间对象
import * as utils from './utils.js';
utils.formatDate(new Date());

// 动态导入：按需加载（返回 Promise）
const mod = await import('./heavy-module.js');
```

::: warning 浏览器使用 ESM 必须带 type
```html
<script type="module" src="./app.js"></script>
```
没有 `type="module"`，`import` 语法直接报错。另外 ESM 要求开发时用 **HTTP 服务**访问（Live Server 即可），双击打开 file:// 会跨域报错。
:::

## 14.4 模块的项目组织

典型前端项目的 JS 组织方式：

```text
js-demo/
├── index.html
└── js/
    ├── app.js            # 入口：初始化 + 绑定事件
    ├── storage.js        # 存储封装
    ├── todoService.js    # 业务逻辑（增删改查）
    └── ui.js             # 渲染函数
```

分工原则：**一个模块一个职责**——数据存取、业务规则、页面渲染互相隔离，改哪里一目了然。

## 14.5 实战前设计：数据层与视图层分离

待办清单（Todo List）的核心模型（第 6 章已铺垫）：

```js
// 数据结构
const todo = { id: 1, text: '学 JS', done: false };

// 核心操作
add(text)          // 新增
toggle(id)         // 切换完成
remove(id)         // 删除
```

架构：**storage 持久化 ↔ service 业务逻辑 ↔ ui 渲染**，事件只负责"转发用户意图给 service"。

## 14.6 实战：storage.js

```js
// storage.js —— localStorage 安全读写封装（第 12 章的工程化）
const KEY = 'cs101-todos';

export function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];        // 数据损坏时优雅降级
  }
}

export function saveTodos(todos) {
  localStorage.setItem(KEY, JSON.stringify(todos));
}
```

## 14.7 实战：todoService.js

```js
// todoService.js —— 纯业务逻辑，不碰 DOM
import { loadTodos, saveTodos } from './storage.js';

let todos = loadTodos();

function persist() {
  saveTodos(todos);
  return todos;
}

export function getTodos() {
  return todos;
}

export function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return todos;
  todos = [...todos, { id: Date.now(), text: trimmed, done: false }];
  return persist();
}

export function toggleTodo(id) {
  todos = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  return persist();
}

export function removeTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  return persist();
}

export function clearDone() {
  todos = todos.filter((t) => !t.done);
  return persist();
}
```

## 14.8 实战：ui.js

```js
// ui.js —— 只负责"数据 → DOM"
import { getTodos } from './todoService.js';

const listEl = document.querySelector('#todo-list');
const countEl = document.querySelector('#count');

export function render() {
  const todos = getTodos();
  listEl.innerHTML = todos
    .map(
      (t) => `
      <li class="${t.done ? 'done' : ''}" data-id="${t.id}">
        <span>${t.text}</span>
        <button class="del" data-id="${t.id}">×</button>
      </li>`
    )
    .join('');
  countEl.textContent = `未完成 ${todos.filter((t) => !t.done).length} 项`;
}
```

## 14.9 实战：app.js 与 index.html

```js
// app.js —— 入口：装配一切
import { addTodo, toggleTodo, removeTodo, clearDone } from './todoService.js';
import { render } from './ui.js';

const form = document.querySelector('#todo-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = form.querySelector('input');
  addTodo(input.value);        // 用户意图 → service
  input.value = '';
  render();                    // 数据变了 → 重绘
});

document.querySelector('#todo-list').addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li) return;
  if (e.target.classList.contains('del')) {
    removeTodo(Number(li.dataset.id));   // 删除按钮
  } else {
    toggleTodo(Number(li.dataset.id));   // 点击条目 = 切换状态
  }
  render();
});

document.querySelector('#clear-btn').addEventListener('click', () => {
  clearDone();
  render();
});

render();   // 首屏渲染
```

```html
<!-- index.html -->
<body>
  <h1>待办清单</h1>
  <form id="todo-form">
    <input type="text" placeholder="要做点什么…" />
    <button type="submit">添加</button>
    <button type="button" id="clear-btn">清除已完成</button>
  </form>
  <ul id="todo-list"></ul>
  <p id="count"></p>
  <script type="module" src="./js/app.js"></script>
</body>
```

::: tip 验收清单
- 新增 → 刷新页面数据还在（localStorage 生效）
- 点条目切换完成、点 × 删除、清除已完成
- 关掉浏览器再打开，数据依旧——你做出了第一个"有状态"的完整应用
:::

## 14.10 下一步

你已完成 JS 核心：语法 → 函数 → 对象 → 数组 → DOM → 异步 → 模块化，并拥有第一个完整项目。

- 想给代码加类型 → [TypeScript 教程](/tutorials/typescript/)
- 想让"数据变 → 页面自动变"（不再手写 render）→ [Vue 3 教程](/tutorials/vue/) 或 [React 教程](/tutorials/react/)
- 想理解背后的构建工具 → [Vite 教程](/tutorials/vite/)

## 本章小结

- ESM：export/import 显式依赖；浏览器需 `type="module"`
- 模块拆分：storage / service / ui / app 各司其职
- 待办清单 = 数据层（增删改查 + 持久化）+ 视图层（render）+ 事件层（意图转发）
- 这个架构思想直接迁移到框架开发——JS 之旅正式毕业
