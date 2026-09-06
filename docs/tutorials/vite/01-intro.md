---
title: 初识 Vite
---

# 第 1 章 · 初识 Vite

**本章目标：**

- 理解 Vite 与 Webpack 等传统打包器的核心差异
- 30 秒跑通第一个 Vite 项目
- 建立"开发环境 ≠ 生产环境"的心智模型

## 1.1 为什么需要构建工具

浏览器最终需要的只是 HTML/CSS/JS，但真实项目离不开构建：

```text
模块化        import/export 浏览器原生支持有限制（裸模块名等）
新语法降级    TS / JSX / 新特性 → 浏览器兼容的 JS
资源优化      压缩、合并、图片处理、缓存指纹
开发体验      热更新、代理、环境变量
```

WebPack 的方案：**先把所有模块打包成一个/几个 bundle 再启动**。项目越大，启动与热更新越慢——"改一行代码，等 30 秒"。

## 1.2 Vite 的答案：让浏览器自己当打包器

Vite（法语"快"，发音 /vit/）由 Vue 作者尤雨溪开发。核心思路完全不同：

```text
开发时：浏览器直接向 dev 服务器请求"单个源文件"
        —— 按需编译，用到哪个编译哪个，启动几乎零成本

生产时：再用 Rollup 打包成优化过的静态资源
```

| 场景 | Webpack | Vite |
| --- | --- | --- |
| 冷启动 | 全量打包，项目越大越慢 | 即时启动（毫秒级） |
| 热更新（HMR） | 重新打包受影响模块 | 精确到单文件的按需编译 |
| 生产构建 | 自带打包 | 用 Rollup（输出质量高） |

::: info dev 快的关键：原生 ESM + esbuild
现代浏览器原生支持 ES Module。Vite dev 服务器直接伺服源码，浏览器请求 `main.js` 时才实时转换它。依赖预构建用 esbuild（Go 编写，比 JS 打包器快一个数量级）。
:::

## 1.3 30 秒上手

```bash
npm create vite@latest my-app
# 交互选择：框架（Vanilla/Vue/React...）+ 语言（JS/TS）
cd my-app
npm install
npm run dev
# VITE ready in xxx ms → http://localhost:5173
```

打开后改动 `src/main.js` 里的文字，保存——**不刷新页面**，浏览器内容瞬间更新。这就是 HMR（Hot Module Replacement，模块热替换）。

```bash
npm run build    # 产出到 dist/，可直接部署的静态文件
npm run preview  # 本地预览构建产物
```

::: tip 本教程工程的同款体验
本站的 VitePress（docs 目录）就是 Vite 生态的一员——之前教程里反复出现的"dev 服务器 / build 命令"，底层都是 Vite 在工作。
:::

## 1.4 开发环境 vs 生产环境

Vite 两条流水线，行为刻意不同：

```text
开发（npm run dev）
  服务器：esbuild 按需转译（快，但不做类型检查/深度优化）
  目标：开发体验

生产（npm run build）
  打包器：Rollup 全量打包 + 压缩 + 代码分割 + 缓存指纹
  目标：加载性能
```

由此推导出两个重要习惯：

1. **dev 能跑 ≠ build 能过**——类型错误、动态导入路径错误，往往构建时才暴露
2. **上线前必须跑一次 build 验证**，不能只依赖 dev

## 1.5 Vite 在工具链中的位置

```text
Vue  create-vue → Vite
React create-vite (react 模板) → Vite
Next.js/Nuxt 等元框架 → 自带或基于 Vite 的构建层
```

如今新项目默认就是 Vite——学它不是学"某个可选工具"，而是学"现代前端的默认底座"。

## 本章小结

- Webpack 先打包后启动；Vite dev 按需伺服原生 ESM，启动即时
- esbuild 负责预构建与转译，Rollup 负责生产打包
- dev 与 build 是两条流水线：上线前必须 build 验证
- `npm create vite` 一条命令起步；HMR 改码即生效
