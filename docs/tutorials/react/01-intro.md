---
title: 初识 React
---

# 第 1 章 · 初识 React

**本章目标：**

- 建立"UI = f(state)"的函数式心智模型
- 跑通第一个 React 项目（Vite 模板）
- 认识组件与 JSX 的基本样貌

## 1.1 React 是什么

React 是 Meta 开源的**声明式 UI 库**（framework 还是 library？——React 只管 UI 渲染层，路由/请求等生态自行组合，所以常被称作"库"）。核心理念一句话：

```text
UI = f(state)    界面是状态的函数
```

状态（state）是输入，界面是输出。**改状态 → React 自动重渲染界面**——与 Vue 的响应式同宗，但实现路径不同（见 1.5）。

## 1.2 创建项目

```bash
npm create vite@latest my-react-app -- --template react
# TypeScript 版：--template react-ts
cd my-react-app
npm install
npm run dev    # http://localhost:5173
```

结构是熟悉的 [Vite 教程](/tutorials/vite/)布局，src/ 里多了 `.jsx` 文件：

```text
src/
├── main.jsx        # 入口：挂载根组件
├── App.jsx         # 根组件
├── App.css
└── index.css
```

## 1.3 挂载与根组件

```jsx
// src/main.jsx
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(<App />);
```

```html
<!-- index.html 挂载点 -->
<div id="root"></div>
```

与 Vue 的 `createApp(App).mount('#app')` 殊途同归：入口创建根实例、挂到 DOM 节点。

## 1.4 第一个组件

React 组件就是**返回 JSX 的函数**：

```jsx
// src/App.jsx
function Welcome({ name }) {
  return <h1>你好，{name}！</h1>;      // 返回 JSX = 界面描述
}

export default function App() {
  return (
    <div>
      <Welcome name="CS101" />
      <button onClick={() => alert('点了')}>点我</button>
    </div>
  );
}
```

三个直观感受：

1. **没有模板语法**——`{}` 里直接写 JS 表达式
2. **属性小驼峰**——`onClick`（不是 onclick）、`className`（不是 class）
3. **组件即函数**——首字母大写才能当组件用（`<Welcome>` ✅、`<welcome>` ❌）

## 1.5 React vs Vue：两个心智差异

| 维度 | Vue | React |
| --- | --- | --- |
| 模板 | HTML 超集（指令系统） | JSX（JS 的语法扩展） |
| 数据可变 | ref 可变，自动追踪 | **state 不可变**，必须"替换" |
| 更新粒度 | 精确（依赖收集） | 粗放（组件函数整体重跑，靠 Diff 对比） |
| 逻辑复用 | 组合式函数 | 自定义 Hooks（同一思想） |

最大适应点：**React 里你不能"直接改"状态**：

```jsx
// ❌ Vue 习惯带到 React：直接改
user.age = 19;

// ✅ React：生成新值整体替换
setUser({ ...user, age: 19 });
```

第 3 章展开。提前建立这个直觉，后面少走弯路。

## 1.6 生态坐标

| 需求 | 方案 | 对应章节 |
| --- | --- | --- |
| UI 渲染 | React 核心 | 第 1~6 章 |
| 路由 | React Router | 第 7 章 |
| 状态管理 | Zustand（轻量主流） | 第 8 章 |
| 样式 | CSS Modules / Tailwind | 第 9 章 |
| 构建 | Vite | [Vite 教程](/tutorials/vite/) |

Next.js 等元框架基于 React（服务端渲染、全栈能力），是进阶方向——先把核心库学扎实。

## 1.7 动手：改造欢迎页

```jsx
// src/App.jsx
import { useState } from 'react';

export default function App() {
  const [skills, setSkills] = useState(['HTML', 'CSS', 'JavaScript']);

  function addSkill() {
    setSkills([...skills, 'React']);     // 替换而非 push！
  }

  return (
    <div>
      <h1>欢迎来到 CS101</h1>
      <ul>
        {skills.map(s => <li key={s}>{s}</li>)}   {/* JSX 里写 JS */}
      </ul>
      <button onClick={addSkill}>再学一个</button>
    </div>
  );
}
```

保存即热更新：列表自动多一项——useState、map 渲染、事件绑定，三章的核心预告都在这了。

::: info JSX 里的注释写法
JSX 内注释要包在大括号里：`{/* 这是注释 */}`——花括号内部是 JS 世界，正常写 `//` 注释。
:::

## 本章小结

- `UI = f(state)`：改状态 → 自动重渲染（声明式同 Vue，不可变更严格）
- Vite react 模板；`createRoot().render()` 挂载；组件 = 返回 JSX 的函数
- JSX 规则：`{}` 表达式、属性小驼峰、className、组件首字母大写
- 状态不可变：整体替换而非直接修改——最大心智转变点
