---
title: 样式方案
---

# 第 9 章 · 样式方案

**本章目标：**

- 掌握 CSS Modules（React 默认推荐）
- 接入 Tailwind CSS（与 Vue 相同的体验）
- 了解内联样式与方案选型

## 9.1 方案全景

React 不绑定样式方案，主流四选：

```text
① 全局 CSS + 命名约定    简单项目起步
② CSS Modules           组件级隔离（Vite 开箱支持）★ 推荐
③ Tailwind CSS          工具类优先（[Tailwind 教程](/tutorials/tailwind/)）
④ CSS-in-JS             运行时方案（styled-components 等，渐趋小众）
```

## 9.2 CSS Modules

文件名带 `.module.css`，Vite 自动启用——**类名编译成全局唯一**，组件间零冲突：

```css
/* src/components/UserCard.module.css */
.card {
  display: flex;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}
.name { font-weight: 600; }
.active { color: #2563eb; }
```

```jsx
// 引入得到"类名映射对象"
import styles from './UserCard.module.css';

export default function UserCard({ user, active }) {
  return (
    <div className={styles.card}>
      <p className={styles.name}>{user.name}</p>
      {/* 多个类：模板字符串或数组 join */}
      <p className={`${styles.desc} ${active ? styles.active : ''}`}>
        {user.desc}
      </p>
    </div>
  );
}
```

```text
编译后：.card → .UserCard_card__a1b2c   （文件名+类名+hash，天然隔离）
```

::: info 全局样式去哪
入口 CSS（main.jsx 引入的 index.css）保持全局——放 reset、CSS 变量、通用工具类；组件样式一律 `.module.css`。
:::

## 9.3 动态类名的组织

CSS Modules 里没有 `:class` 对象语法，用工具函数或 clsx 库：

```jsx
// 方式一：模板字符串（条件少）
<div className={`${styles.card} ${done ? styles.done : ''}`} />

// 方式二：clsx（事实标准，npm i clsx）
import clsx from 'clsx';

<div className={clsx(styles.card, done && styles.done, important && styles.important)} />
<div className={clsx('base', { [styles.active]: isActive })} />   {/* 对象语法 */}
```

clsx 的对象语法 ≈ Vue 的 `:class="{ ... }"`——心智平移。

## 9.4 Tailwind CSS 接入

与 Vue 项目完全相同的流程（[Vite 教程](/tutorials/vite/) + [Tailwind 教程](/tutorials/tailwind/)）：

```bash
npm install tailwindcss @tailwindcss/vite
```

```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

```css
/* src/index.css */
@import 'tailwindcss';
```

```jsx
// 组件里直接写工具类
export default function Card({ title, desc, done }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm
                    hover:-translate-y-1 hover:shadow-md transition">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{desc}</p>
      {done && <span className="mt-2 inline-block rounded-full bg-green-100 px-2 text-xs text-green-700">已完成</span>}
    </div>
  );
}
```

条件类名照旧用 clsx：

```jsx
<button className={clsx(
  'rounded-md px-4 py-2 font-medium',
  active ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
)}>
  按钮
</button>
```

## 9.5 内联样式：style 对象

```jsx
// 动态样式值（随数据变化）——内联最直接
<div style={{ width: `${progress}%`, background: color }} />

// 静态样式不建议内联（无缓存、无伪类/媒体查询能力）
```

分工原则：

```text
动态计算值（宽度%、颜色插值）  → style 对象
组件外观（含 hover/响应式）    → CSS Modules 或 Tailwind
全局主题（变量、reset）        → index.css
```

## 9.6 方案选型建议

```text
小项目 / 原型          → Tailwind（或纯全局 CSS）
组件库风格的中型项目   → CSS Modules
需要设计系统一致性     → Tailwind + @theme 定制（第 7 章主题）
接手老项目             → 先看存量方案，保持一致
```

团队一致性 > 方案优劣——混用三套方案才是灾难。

## 9.7 综合练习：同一张卡片的两种实现

```jsx
// 版本 A：CSS Modules
import styles from './CourseCard.module.css';
import clsx from 'clsx';

export default function CourseCard({ course, onSelect }) {
  return (
    <div
      className={clsx(styles.card, course.done && styles.done)}
      onClick={() => onSelect(course.id)}
    >
      <h3 className={styles.title}>{course.title}</h3>
    </div>
  );
}
```

```jsx
// 版本 B：Tailwind + clsx
export default function CourseCard({ course, onSelect }) {
  return (
    <div
      className={clsx(
        'cursor-pointer rounded-lg border p-4 transition hover:shadow-md',
        course.done
          ? 'border-green-200 bg-green-50 opacity-70'
          : 'border-gray-200 bg-white'
      )}
      onClick={() => onSelect(course.id)}
    >
      <h3 className="font-semibold">{course.title}</h3>
    </div>
  );
}
```

两种都正确——选一套，全项目贯彻。

## 本章小结

- `.module.css` 自动作用域隔离；clsx 组织动态类名
- Tailwind 接入流程与 Vue 一致；工具类 + clsx 是条件样式标准解
- style 对象留给动态值；全局样式进 index.css
- 方案从一而终，别混
