---
title: 主题定制与暗色模式
---

# 第 7 章 · 主题定制与暗色模式

**本章目标：**

- 用 @theme 定义品牌色与自定义刻度
- 掌握 v4 的类名式暗色模式
- 学会"动态类名"的正确写法（避开扫描陷阱）

## 7.1 @theme：在 CSS 里做配置

v4 的主题定制直接写在入口 CSS（v3 的 tailwind.config.js 已不需要）：

```css
/* src/style.css */
@import 'tailwindcss';

@theme {
  --color-brand: #5c6ac4;          /* 生成 bg-brand / text-brand / border-brand … */
  --color-brand-dark: #3b4291;
  --color-surface: #f6f7fb;

  --font-display: 'Noto Sans SC', sans-serif;   /* font-display 工具类 */

  --breakpoint-tablet: 820px;      /* 新断点 tablet: */
}
```

命名规则：CSS 变量 `--color-brand` 自动生成 `*-brand` 工具类——**定义一个颜色，全套工具类自动可用**：

```html
<button class="bg-brand hover:bg-brand-dark text-white">品牌按钮</button>
<div class="bg-surface p-4">区块底色</div>
<h1 class="font-display">展示字体标题</h1>
<div class="hidden tablet:block">≥820px 才显示</div>
```

::: tip 令牌即主题
所有组件都引用 brand/surface 这类**设计令牌**；换主题色 = 改一处 CSS 变量，全站生效。这就是第 1 章说的"一致性来自刻度"的定制形态。
:::

## 7.2 在默认色板上叠加

自定义色不必推翻内置色板，两者共存：

```css
@theme {
  --color-brand: #5c6ac4;
  --color-brand-50: #eef0fb;
  --color-brand-100: #dcdff7;
  --color-brand-900: #262b66;
}
```

```html
<div class="bg-brand-50">浅底提示</div>
<button class="bg-brand-900">深色按钮</button>
```

## 7.3 暗色模式：v4 的类名开关

v4 默认的 `dark:` 变体跟随**系统偏好**（prefers-color-scheme）。想要"用户手动切换"，先声明类名策略：

```css
@import 'tailwindcss';

@custom-variant dark (&:where(.dark, .dark *));
```

之后给 `<html>` 挂上/摘掉 `dark` 类即可切换：

```html
<div class="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
  两种主题各写一份
</div>
```

```js
// 切换按钮
const toggle = () => document.documentElement.classList.toggle('dark');
```

工程做法（记住用户选择）：

```js
function applyTheme(dark) {
  document.documentElement.classList.toggle('dark', dark);
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}
applyTheme(localStorage.getItem('theme') === 'dark');
```

## 7.4 dark: 变体的组织建议

```html
<!-- 页面骨架：底色与文字成对写 -->
<body class="bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">

<!-- 卡片：边框、底色、阴影都要有暗色版 -->
<div class="rounded-xl border border-gray-200 bg-white p-4
            dark:border-gray-700 dark:bg-gray-800">

<!-- 语义色在暗底上提亮一档 -->
<button class="bg-blue-500 dark:bg-blue-400">主要操作</button>
<p class="text-gray-500 dark:text-gray-400">次要文字</p>
```

::: tip 成对成对再成对
暗色适配的纪律：**每个亮色类旁边紧跟一个 dark: 类**（bg 配 bg、text 配 text、border 配 border）。写组件时一口气写全，回头补最痛苦。
:::

## 7.5 动态类名：扫描器陷阱

扫描器只认**完整字面量**类名——拼接出来的类不会生成 CSS：

```js
// ❌ 错误：产物里没有 bg-red-500，样式失效
const color = 'red';
el.className = `bg-${color}-500`;

// ✅ 正确一：完整类名写全，让扫描器看见
el.className = isActive ? 'bg-blue-500' : 'bg-gray-200';

// ✅ 正确二：映射表（所有候选类名都是字面量）
const statusClass = {
  idle: 'bg-gray-200 text-gray-700',
  loading: 'bg-blue-500 text-white',
  done: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
};
el.className = statusClass[status];
```

**原则：条件选类，不拼接类。**映射表是状态样式（第 5 章 TS 的 statusClass 思路）的标准搭档。

## 7.6 全局基础样式

需要微调重置（preflight）后的全局样式，用 @layer：

```css
@import 'tailwindcss';

@layer base {
  body {
    @apply bg-gray-50 text-gray-900 antialiased;   /* @apply 把工具类转成 CSS */
  }
  h1, h2, h3 {
    @apply font-bold tracking-tight;
  }
}
```

::: warning @apply 也要节制
@apply 让工具类回到"写 CSS"模式，滥用会失去内联的直观性。只用于**全局 base 层**的少量统一；组件内样式坚持直接写工具类。
:::

## 本章小结

- @theme 定义 `--color-*` / `--font-*` / `--breakpoint-*`，工具类自动生成
- 暗色模式：@custom-variant 声明类名策略 + html 切换 dark 类 + dark: 成对书写
- 动态类名用映射表，绝不模板字符串拼接（扫描器只认字面量）
- 全局微调放 @layer base + @apply，组件内仍直接写工具类
