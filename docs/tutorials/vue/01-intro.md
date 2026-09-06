---
title: 初识 Vue 3
---

# 第 1 章 · 初识 Vue 3

**本章目标：**

- 建立"声明式渲染"的心智模型
- 跑通第一个 Vue 3 项目（create-vue 脚手架）
- 认识单文件组件（SFC）与组合式 API 的基本样貌

## 1.1 从"操作 DOM"到"声明结果"

JS 教程第 13 章的计数器：**手动**找到 DOM、改文本（命令式）：

```js
// 命令式：一步步描述"怎么做"
const countEl = document.querySelector('#count');
let count = 0;
document.querySelector('#btn').addEventListener('click', () => {
  count += 1;
  countEl.textContent = count;   // 手动同步视图
});
```

Vue 的**声明式渲染（declarative rendering）**：只声明"界面长什么样（跟数据的关系）"，更新交给框架：

```html
<!-- 声明式：只描述"是什么" -->
<template>
  <button @click="count++">点了 {{ count }} 次</button>
</template>

<script setup>
import { ref } from 'vue';
const count = ref(0);   // 响应式数据
</script>
```

数据变 → 视图自动变。你不再写任何"更新 DOM"的代码。

## 1.2 创建项目

```bash
npm create vue@latest my-vue-app
# 交互选项（新手建议）：
#   TypeScript?       → No（本教程用 JS；学了 TS 教程后可回选 Yes）
#   JSX?              → No
#   Router / Pinia?   → 先 No（第 10、11 章再讲；这里选 Yes 也行）
cd my-vue-app
npm install
npm run dev    # http://localhost:5173
```

生成的结构就是 [Vite 教程第 2 章](/tutorials/vite/)的标准布局——Vite 底座 + `@vitejs/plugin-vue`。

## 1.3 单文件组件（SFC）

Vue 项目的核心单位是**单文件组件（Single-File Component，.vue 文件）**，一个文件管一个组件的三件事：

```vue
<!-- App.vue -->
<script setup>
// 逻辑：数据、函数
import { ref } from 'vue';
const msg = ref('Hello Vue');
</script>

<template>
  <!-- 结构：HTML 模板 -->
  <h1>{{ msg }}</h1>
</template>

<style scoped>
/* 样式：scoped = 只作用于本组件 */
h1 { color: #42b883; }
</style>
```

三大块各司其职，`scoped` 样式隔离是 SFC 的杀手锏之一（组件再多也不互相污染）。

## 1.4 应用与组件树

```js
// src/main.js —— 入口：创建应用并挂载
import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

createApp(App).mount('#app');
```

```html
<!-- index.html 里的挂载点 -->
<div id="app"></div>
```

应用 = 一棵组件树，从 App.vue 开枝散叶：

```text
App
├── Header
├── CourseList
│   ├── CourseCard
│   └── CourseCard
└── Footer
```

**开发 Vue 应用 = 设计这棵树的形状**（哪些组件、谁管什么数据、怎么传）。

## 1.5 组合式 API：本教程的主线

Vue 组件有两套写法：

```js
// 选项式（Options API，Vue 2 风格）：按选项分组
export default {
  data() { return { count: 0 } },
  methods: { increment() { this.count++ } },
}

// 组合式（Composition API，`<script setup>`）：按逻辑组织
import { ref } from 'vue';
const count = ref(0);
const increment = () => count.value++;
```

**本教程全部使用组合式 API**（`<script setup>`）——它是 Vue 3 的推荐写法，类型推导更好、逻辑复用更自然（第 9 章组合式函数）。读老项目会见到选项式，能认出即可。

::: info `<script setup>` 是什么
编译期语法糖：里面的顶层变量（数据、函数）**自动暴露给模板**使用，不用写 return。模板里 `{{ count }}` 直接可用。
:::

## 1.6 Vue 生态一览

| 成员 | 职责 | 对应章节 |
| --- | --- | --- |
| Vue 核心 | 响应式 + 模板 + 组件 | 第 1~9 章 |
| Vue Router | 单页路由 | 第 10 章 |
| Pinia | 状态管理 | 第 11 章 |
| Vite | 构建 | [Vite 教程](/tutorials/vite/) |
| DevTools | 浏览器调试扩展 | 装一个，调试组件必备 |

## 1.7 动手：改造欢迎页

把脚手架首页改成自己的：

```vue
<script setup>
import { ref } from 'vue';

const name = ref('CS101');
const skills = ref(['HTML', 'CSS', 'JavaScript', 'Vue']);

const addSkill = () => {
  skills.value.push('Vue 3');
};
</script>

<template>
  <h1>欢迎来到 {{ name }}</h1>
  <ul>
    <li v-for="skill in skills" :key="skill">{{ skill }}</li>
  </ul>
  <button @click="addSkill">再学一个</button>
</template>
```

保存看效果：列表自动多一项——响应式数据 + 列表渲染 + 事件绑定，三章的核心预告都在这了。

## 本章小结

- 声明式渲染：描述"界面与数据的关系"，DOM 更新交给 Vue
- create-vue 脚手架 + Vite 底座；`.vue` SFC 三段式（逻辑/模板/scoped 样式）
- `createApp(App).mount('#app')` 挂载；应用是组件树
- 主线是组合式 API（`<script setup>`），选项式能认即可
