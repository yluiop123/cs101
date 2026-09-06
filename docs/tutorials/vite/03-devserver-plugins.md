---
title: 开发服务器与插件
---

# 第 3 章 · 开发服务器与插件

**本章目标：**

- 理解 HMR 的工作方式
- 配置 server.proxy 解决开发期跨域
- 认识插件机制与常用插件生态

## 3.1 dev 服务器做了什么

`npm run dev` 启动的 dev 服务器是一个"按需编译的静态文件服务"：

```text
浏览器请求 /src/main.js
  ↓
Vite 实时转译该文件（esbuild）并返回
  ↓
浏览器解析 import，继续请求 /src/App.vue、/src/style.css …
  ↓
每个模块都是独立请求，改谁编译谁
```

node_modules 里的依赖不参与逐个请求——启动时被**预构建（pre-bundling）**成单文件缓存起来（node_modules/.vite），之后秒回。

## 3.2 HMR：模块热替换

HMR（Hot Module Replacement）= 改代码后**不整页刷新**，只把改动的模块"换"进运行中的应用：

```text
你保存 main.js
  ↓
Vite 检测文件变化，通知浏览器（WebSocket）
  ↓
浏览器只重新请求 main.js 并替换
  ↓
组件状态保留（改样式文字时输入框里的字不会丢）
```

- JS/CSS 小改动 → 模块级热替换
- 改了模块的依赖链（如新增文件）→ 自动页面刷新兜底
- 整个流程毫秒级，这就是"改一行等半秒"到"即改即见"的体验差

## 3.3 server.proxy：开发期跨域解药

场景：前端跑在 5173，后端 API 跑在 3000。浏览器同源策略下直接 fetch `http://localhost:3000/api/...` 会跨域。

开发期方案：让 Vite 代为转发：

```js
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,          // 修改请求头 Host
        // rewrite: (p) => p.replace(/^\/api/, ''),  // 需要去前缀时
      },
    },
  },
});
```

```js
// 前端只请求同源的 /api，Vite 转给 3000
fetch('/api/todos');   // 实际到达 http://localhost:3000/api/todos
```

原理：浏览器以为在跟 5173 通信（无跨域）；服务器之间的转发不受同源策略限制。配合 [Node.js 教程第 10 章](/tutorials/nodejs/)的 REST API 即可完整演练。

::: info 代理只存在于开发期
生产环境没有 Vite 代理——跨域要靠后端 CORS、网关或反向代理（Nginx）解决。别把 proxy 当成"线上跨域方案"。

:::

## 3.4 常用 server 选项

```js
server: {
  port: 5173,        // 固定端口
  strictPort: true,  // 端口被占直接报错（而不是 +1），CI 场景常用
  host: true,        // 监听 0.0.0.0，手机连同一 WiFi 用 IP 访问调试
  open: true,        // 自动开浏览器
  cors: true,        // 允许跨源请求 dev 服务器
}
```

## 3.5 插件机制一瞥

Vite 插件本质是"带钩子的对象"，在 dev 转译与构建的各环节插手：

```js
// 插件的样子（示意）
const myPlugin = () => ({
  name: 'my-plugin',
  transform(code, id) {         // 转译钩子：改写模块代码
    if (id.endsWith('.md')) {
      return `export default ${JSON.stringify(code)}`;
    }
  },
});
```

不需要会写插件，但要看懂两件事：

1. `plugins: []` 数组顺序有讲究（按声明先后生效）
2. 社区插件解决"某类文件怎么被处理"——遇到新需求先找插件

## 3.6 值得认识的常用插件

| 插件 | 作用 |
| --- | --- |
| `@vitejs/plugin-vue` | Vue SFC 支持（脚手架自带） |
| `@vitejs/plugin-react` | React JSX 与 Fast Refresh |
| `@tailwindcss/vite` | Tailwind v4 接入 |
| `vite-plugin-svg-icons` | SVG 雪碧图 |
| `unplugin-auto-import` | API 自动导入 |

::: tip Rollup 插件兼容
Vite 插件接口是 Rollup 插件的超集——大量 Rollup 插件可直接用。这继承了 Rollup 生态的厚度。
:::

## 3.7 综合练习：模拟前后端分离开发

```js
// vite.config.js —— 前端 5173 + 后端 3000 的标准开发配置
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

```js
// src/api.js —— 业务代码完全感知不到端口差异
export async function fetchTodos() {
  const res = await fetch('/api/todos');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
```

换部署环境时只需后端同样以 `/api` 前缀发布（或网关转发），前端代码零修改——**开发与生产的路径统一**是 proxy 最大的工程价值。

## 本章小结

- dev 服务器按需编译单模块；依赖预构建缓存加速启动
- HMR 精确替换改动模块，状态保留；依赖链变化才整页刷新
- server.proxy 解决开发跨域，只存在于开发期
- 插件 = 各环节钩子；框架/样式/自动导入全靠插件生态
