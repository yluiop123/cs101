---
title: 项目结构与配置文件
---

# 第 2 章 · 项目结构与配置文件

**本章目标：**

- 看懂 Vite 脚手架生成的目录结构
- 掌握 vite.config 的常用配置（插件/别名/构建选项）
- 理解 package.json scripts 与 Vite 的关系

## 2.1 标准目录结构

```text
my-app/
├── index.html          # 入口！Vite 以它为起点（不在 public 里）
├── package.json        # 依赖与脚本
├── vite.config.js      # Vite 配置
├── public/             # 原样复制的静态资源（不参与打包处理）
│   └── favicon.ico
├── src/                # 源码（打包处理的对象）
│   ├── main.js         # 应用入口
│   ├── style.css
│   └── App.vue / App.jsx
└── dist/               # 构建产物（构建时生成，部署它）
```

与 Webpack 项目最大的不同：**index.html 是一等入口**，`<script type="module" src="/src/main.js">` 直接指向源码——构建从 HTML 出发收集依赖图。

::: info index.html 与 public/ 的分工
- `src/` 里的资源：经 Vite 处理（转译、压缩、加指纹），适合需要优化的资源
- `public/` 里的资源：原样复制、以 `/` 绝对路径引用（`/favicon.ico`），适合不需要处理的文件

:::

## 2.2 vite.config.js：最小配置

```js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // 配置项都写这里
});
```

`defineConfig` 只是提供类型提示的包装函数（TS 项目体验更好），不加也能运行。

## 2.3 高频配置一：插件

插件（plugins）是 Vite 的扩展机制，一切能力皆插件：

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';        // Vue SFC 支持
// import react from '@vitejs/plugin-react'; // React 支持
import tailwindcss from '@tailwindcss/vite'; // Tailwind 教程第 2 章装过

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
});
```

**脚手架已经帮你配好框架插件**——这个配置的意义在于：装新工具（Tailwind、组件库按需引入等）时知道往哪儿加。

## 2.4 高频配置二：路径别名

```js
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
```

```js
// 源码里
import { todoService } from '@/services/todoService';   // 代替 ../../services/...
```

::: warning 别名需要多处同步（TypeScript 教程第 9 章讲过）
Vite 的 `resolve.alias` 管构建；TS 项目还要在 `tsconfig.json` 的 `paths` 里配同一份映射，编辑器才能识别。
:::

## 2.5 高频配置三：server 与构建

```js
export default defineConfig({
  server: {
    port: 5173,          // 端口（被占用时 Vite 自动 +1）
    open: true,          // 启动后自动打开浏览器
    proxy: {             // 开发代理（第 3 章细讲）
      '/api': 'http://localhost:3000',
    },
  },
  build: {
    outDir: 'dist',      // 产物目录
    sourcemap: false,    // 生产是否输出 source map
  },
});
```

## 2.6 package.json scripts 与环境判定

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

`npm run dev` 执行的就是 vite 命令——所以第 5180 端口跑 VitePress dev、`--port` 参数能生效，都是同一个 CLI 在工作。常见附加参数：

```bash
vite --port 3000        # 指定端口
vite --host             # 暴露到局域网（手机真机调试）
vite build --watch      # 构建模式监听变更
```

::: tip Node 版本要求
新版 Vite（v7+）要求 Node 20.19+ / 22.12+。版本不符会启动报错——`node -v` 先自查，用 nvm 切换（Node 教程第 6 章）。
:::

## 2.7 综合示例：一个真实项目的配置

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: true,     // 生产保留 map，方便线上排错
  },
});
```

这就是一个够用到中大型项目的配置——Vite 的"开箱即用"意味着大多数配置其实可以不写。

## 本章小结

- index.html 是入口；public/ 原样复制，src/ 参与处理
- plugins 装能力（vue/react/tailwindcss）；alias 消灭相对路径
- scripts 里的 dev/build/preview 就是 vite CLI；Node 版本要达标
- 默认配置已够用，按需增量添加
