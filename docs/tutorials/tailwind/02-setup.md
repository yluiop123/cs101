---
title: 安装与配置
---

# 第 2 章 · 安装与配置

**本章目标：**

- 在 Vite 项目中装好 Tailwind v4
- 零安装体验（CDN / Playground）
- 理解 `@import "tailwindcss"` 做了什么

## 2.1 方式一：Vite 项目（正式项目标准流程）

前置：已有 Vite 项目（[Vite 教程](/tutorials/vite/)）或任意 Vite/Vue/React 脚手架。

```bash
npm install tailwindcss @tailwindcss/vite
```

Vite 配置接入插件：

```js
// vite.config.js
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
});
```

入口 CSS 引入 Tailwind（v4 核心变化：不再需要 @tailwind 三行指令）：

```css
/* src/style.css —— v4 写法，一行搞定 */
@import 'tailwindcss';
```

```js
// src/main.js 确保引入了这份 CSS
import './style.css';
```

启动后随便找个元素试试：

```html
<h1 class="text-3xl font-bold text-blue-600 underline">Hello Tailwind!</h1>
```

::: tip 验证标准
标题变大、加粗、变蓝且有下划线，浏览器 DevTools 里能看到 `text-3xl` 等类命中了规则——环境就绪。
:::

## 2.2 方式二：CDN 快速体验（零安装）

临时原型、CodePen 类场景：

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  </head>
  <body class="p-8">
    <div class="max-w-sm rounded-xl border p-6 shadow-lg">
      <h2 class="text-xl font-bold">卡片标题</h2>
      <p class="mt-2 text-gray-600">CDN 版即时可用，无需构建。</p>
    </div>
  </body>
</html>
```

::: warning CDN 版仅用于体验
浏览器内实时编译，体积大、无优化，**不要用于生产**。正式项目一律走 2.1 的构建流程。
:::

## 2.3 在线 Playground

官方 [Playground](https://play.tailwindcss.com)——左侧写带 Tailwind 类名的 HTML，右侧实时预览。第 3~6 章的工具类都可以在这里随手验证，不污染本地项目。

## 2.4 v4 的工作原理：扫描 + 按需生成

```text
你写  <div class="p-4 text-lg">
        ↓
扫描器  遍历所有模板文件，收集出现的类名
        ↓
生成器  只为出现过的类名生成 CSS（没用到的类不产出）
        ↓
产物    一份极小的最终 CSS
```

两个推论：

1. **按需生成**：哪怕类库有上万个类，最终产物只含你用过的
2. **类名必须是完整字面量**——`bg-${color}-500` 这种动态拼接扫描器认不出来（第 7 章讲正确姿势）

## 2.5 常见安装问题

**类名写了没效果**：90% 是 CSS 没引入或插件没接——检查 main 里是否 import 了 style.css、vite.config 里是否加了 `tailwindcss()`。

**编辑器没有类名提示**：装 VS Code 扩展 **Tailwind CSS IntelliSense**——输入类名自动补全、悬停显示对应的 CSS（强烈推荐，体验翻倍）。

**检测生产产物**：构建后检查 `dist/assets/*.css`，应只有几 KB～十几 KB（按需生成的证据）。

## 2.6 项目结构建议

```text
my-app/
├── index.html
├── vite.config.js        # 插件配置
└── src/
    ├── main.js
    └── style.css          # @import 'tailwindcss' + 全局定制（第 7 章）
```

约定：组件里写工具类；style.css 只放主题定制与全局基础样式，**不写业务样式**——业务样式全部内联到组件模板。

## 本章小结

- 正式流程：装 `tailwindcss` + `@tailwindcss/vite`，插件进 vite.config，CSS 里 `@import 'tailwindcss'`
- CDN/Playground 用于体验；生产必须构建
- v4 按需生成：类名要写完整字面量；配 IntelliSense 扩展开发
