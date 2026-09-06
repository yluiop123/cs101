---
title: 静态资源处理
---

# 第 4 章 · 静态资源处理

**本章目标：**

- 分清 public 目录与 src 资源导入两条路径
- 掌握资源导入的 ?url / ?raw 变体
- 学会路径别名与环境变量的正确用法

## 4.1 两条资源路径

```text
路径一：public/ 目录
  原样复制进产物根目录，URL 引用，不经处理
  适合：favicon、robots.txt、不需要优化的第三方文件

路径二：src/ 内导入
  import 进代码，Vite 处理（小文件内联、大文件加指纹）
  适合：图片、字体等一切需要优化的资源
```

```html
<!-- public：以根路径直接引用 -->
<img src="/logo.png" alt="logo" />
```

```js
// src 内：import 后得到"处理后的 URL"
import logoUrl from '@/assets/logo.png';
el.innerHTML = `<img src="${logoUrl}" alt="logo" />`;
```

**默认建议**：会随版本变化的资源放 src 走 import（享受指纹缓存）；固定不动的放 public。

## 4.2 处理细节：内联与指纹

```text
小资源（< 4KB 默认）：转成 base64 data URL 内联——少一次请求
大资源：复制到产物目录并加内容指纹
  logo.png → /assets/logo-a3f8c2.png
```

内容指纹（hash 文件名）的价值：文件内容不变 → 文件名不变 → 浏览器缓存永久生效；内容一变 → 新文件名 → 缓存自动失效。**性能与缓存正确性全靠它**。

阈值可调：

```js
export default defineConfig({
  build: {
    assetsInlineLimit: 8 * 1024,   // 8KB 以内内联
  },
});
```

## 4.3 导入变体：?url 与 ?raw

```js
// ?url：得到资源 URL（默认行为，可显式写）
import workerUrl from './worker.js?url';

// ?raw：把文件内容当字符串导入（配置文件/模板场景）
import versionText from '../CHANGELOG.md?raw';
console.log(versionText);      // markdown 原文

// CSS 直接导入（样式进入页面）
import './style.css';
```

## 4.4 CSS 的处理

```js
import './style.css';   // dev：注入 <style>；build：抽成独立 css 文件
```

CSS Modules（类名局部化，避免冲突）：

```css
/* src/style.module.css */
.title { color: blue; }
```

```js
import styles from './style.module.css';
el.className = styles.title;    // 实际是 style_title__a1b2c 这样的唯一类名
```

## 4.5 路径别名回顾

```js
// vite.config.js（第 2 章配置过）
resolve: {
  alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
}
```

```js
import logoUrl from '@/assets/logo.png';        // src 下的任何资源都能 @
```

别名同时适用于 JS 模块与资源导入——相对路径地狱的终结者。

## 4.6 环境变量：import.meta.env

Vite 内置环境变量体系，变量名必须以 `VITE_` 开头才会暴露给前端代码（防止服务端密钥泄漏到浏览器）：

```bash
# .env.development —— dev 模式加载
VITE_API_BASE=/api
VITE_APP_TITLE=CS101 开发版

# .env.production —— build 模式加载
VITE_API_BASE=https://api.example.com
VITE_APP_TITLE=CS101
```

```js
// 代码里通过 import.meta.env 访问
const base = import.meta.env.VITE_API_BASE;
const title = import.meta.env.VITE_APP_TITLE;   // 静态替换进产物

// 内置变量（无需定义）
import.meta.env.DEV;       // 是否 dev
import.meta.env.PROD;      // 是否生产构建
import.meta.env.MODE;      // development / production
```

```js
// 典型用法：一处配置，环境自适应
const api = `${import.meta.env.VITE_API_BASE}/todos`;
fetch(api);
```

::: danger VITE_ 前缀 = 会进浏览器
所有 `VITE_*` 变量**会以明文写进产物**，用户可见。数据库密码、私钥绝对不能放这里——它们属于后端环境变量。

:::

## 4.7 类型友好的环境变量（TS 项目）

```ts
// src/env.d.ts —— 让编辑器认识自定义变量
interface ImportMetaEnv {
  readonly VITE_API_BASE: string;
  readonly VITE_APP_TITLE: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## 4.8 综合练习：配置驱动的 API 层

```js
// src/api.js
const BASE = import.meta.env.VITE_API_BASE;

export async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const todoApi = {
  list: () => request('/todos'),
  add: (text) => request('/todos', { method: 'POST', body: JSON.stringify({ text }) }),
};
```

dev 走 `/api`（经 proxy 转发），生产走 `VITE_API_BASE` 指向的真实域名——同一份代码两套环境。

## 本章小结

- public 原样复制（固定资源）；src import 处理（内联/指纹缓存）
- `?url` 取地址、`?raw` 取内容、CSS Modules 局部化类名
- 别名 `@` 通吃模块与资源
- `VITE_*` 变量静态注入产物，DEV/PROD/MODE 判环境；敏感信息绝不进 VITE_
