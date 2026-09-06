---
title: 构建与优化
---

# 第 5 章 · 构建与优化

**本章目标：**

- 掌握 build 产物的结构与验证方法
- 理解代码分割（code splitting）与分包策略
- 学会用产物分析定位体积问题

## 5.1 构建做了什么

```bash
npm run build
```

```text
dist/
├── index.html              # 引用产物资源
├── assets/
│   ├── index-a3f8c2.js     # 应用代码（压缩后）
│   ├── index-b7d1e9.css    # 抽离的样式
│   └── logo-9c4f1a.png     # 指纹资源
└── favicon.ico             # public 原样复制
```

流水线：解析模块图 → 转译（esbuild）→ Rollup 打包 → Tree-Shaking 摇掉未用代码 → 压缩（Terser/esbuild）→ 输出。

验证产物别只看文件——**起服务点一遍**：

```bash
npm run preview    # 本地伺服 dist/，模拟线上访问
```

::: tip 构建是最后一道测试
dev 跑通 ≠ 构建通过。**提交前 / 部署前必须 build**——动态导入路径错误、类型错误（配 vue-tsc）都在这一步暴露。本站教程开发流程里"每写完一个教程跑一次 build"就是这个纪律。
:::

## 5.2 代码分割：按需加载

默认策略：

```text
静态 import 的代码        → 打进主 chunk（首屏就要）
动态 import() 的代码      → 自动拆成独立 chunk（用到才加载）
第三方 node_modules      → 常拆入 vendor chunk
```

```js
// 路由懒加载的标准姿势（Vue Router / React Router 同理）
const routes = {
  home: () => import('./views/Home.vue'),
  admin: () => import('./views/Admin.vue'),   // 首屏不下载 admin 代码
};
```

效果：首屏只加载首屏需要的 JS——Admin 面板、图表库这些"重家伙"推迟到用户真正到达时。

## 5.3 手动分包：manualChunks

默认分割不够细时，手动把稳定依赖拆出独立缓存：

```js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],      // 框架：几乎不变，长期缓存
          charts: ['echarts'],                // 重型库：单独 chunk
        },
      },
    },
  },
});
```

逻辑：框架代码一个月不变 → 浏览器缓存一个月；业务代码天天变 → 只重新下载小体积的业务 chunk。

::: warning 分包是权衡不是越多越好
chunk 太碎 → 请求次数多；chunk 太大 → 缓存更新浪费。先看分析数据再动手，不要凭感觉拆。
:::

## 5.4 产物分析：体积去哪了

```bash
npx vite-bundle-visualizer
# 或装 rollup-plugin-visualizer 在 build 时生成 stats.html
```

打开可视化矩形图，一眼看清每个依赖占的体积。常见发现与对策：

| 发现 | 对策 |
| --- | --- |
| 某个库占了 40% 但只用了小功能 | 换轻量替代（如 dayjs 替 moment）或按需导入 |
| lodash 全量引入 | `import debounce from 'lodash-es/debounce'` |
| 图标库全量 import | 只 import 用到的图标 |
| 重复打包（两份相似库） | 统一依赖版本 |

## 5.5 其他构建选项

```js
export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,             // 产物带 map：线上报错能定位回源码（体积换排查力）
    target: 'es2020',            // 产物 JS 版本目标
    cssCodeSplit: true,          // 按入口拆分 CSS（默认 true）
    reportCompressedSize: true,  // 报告 gzip 后体积
  },
});
```

::: info gzip 才是线上真实体积
构建日志里 `index.js   320.45 kB │ gzip: 98.21 kB`——服务器开 gzip/brotli 压缩后，用户实际下载的是 gzip 列。评估体积以它为准。

:::

## 5.6 缓存友好的部署形态

产物本身就是为"长缓存 + 按需失效"设计的：

```text
assets/xxx-[hash].js     → Cache-Control: max-age=31536000, immutable（内容变则名变）
index.html               → no-cache（每次校验，保证拿到新资源清单）
```

这组策略配合指纹文件名，既快又不会"上线后用户看到旧版本"。

## 5.7 综合示例：优化前后的体检单

优化动作清单（按收益排序）：

```text
1. 路由级动态 import          → 首屏 JS 大幅下降
2. 重型库拆独立 chunk          → 业务迭代不影响框架缓存
3. 按需导入组件库/图标         → 砍掉未用代码（Tree-Shaking 生效前提：ESM）
4. 开 gzip（服务器侧）         → 体积再降 70%+
5. 图片：压缩 + 懒加载 <img loading="lazy">
```

```js
// 懒加载图片：离屏不加载
<img src="big-photo.jpg" loading="lazy" alt="示例" />
```

## 本章小结

- build = Rollup 打包 + 摇树 + 压缩 + 指纹；preview 验证产物
- 动态 import 自动分包；manualChunks 拆稳定依赖吃长缓存
- vite-bundle-visualizer 找体积大头，按需导入是第一优化
- 指纹资源长缓存 + index.html no-cache 的部署组合
