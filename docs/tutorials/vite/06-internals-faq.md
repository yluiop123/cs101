---
title: 原理浅析与常见问题
---

# 第 6 章 · 原理浅析与常见问题

**本章目标：**

- 弄懂"为什么 Vite 快"的三个机制
- 看懂 Vite 与 Rollup/esbuild 的分工
- 建立常见报错的排查手册

## 6.1 快的三个机制回顾

```text
① 原生 ESM 伺服：dev 不打包，浏览器按需请求单模块
② esbuild 预构建：依赖提前转成单文件缓存（Go 实现，快 10~100 倍）
③ 按需编译：改一个文件只处理一个文件，与项目规模无关
```

对比 Webpack "启动即全量打包"的模式，Vite 把成本**从启动时挪到了每个请求时**——而每个请求的处理量很小，于是"秒开 + 毫秒级热更"。

## 6.2 工具分工图

```text
esbuild（Go）     依赖预构建 / TS·JSX 转译 —— 只求快
Rollup（JS）      生产打包 / 代码分割 / Tree-Shaking —— 只求优
Vite 本体         dev 服务器 + 两者的"总线" + 插件体系
```

为什么生产不用 esbuild 打包？Rollup 的代码分割与摇树更成熟、产物更优。esbuild 与 Rollup 的融合（Rust 版打包器 Rolldown）是 Vite 的演进方向，日常使用不受影响。

## 6.3 HMR 的边界

HMR 不是万能的：

```text
CSS / Vue SFC / React 组件   → 完整 HMR，状态保留
普通 JS 模块                 → 模块替换或"冒泡"到接受者
改了 import 依赖结构          → 退化为整页刷新
```

理解冒泡：模块自身不声明"如何热替换"时，更新会向上传递，直到遇到能处理的模块（组件文件），否则整页刷新兜底——**所以"改着改着突然整页刷了"不是 bug，是兜底机制**。

## 6.4 报错排查手册

### 启动就报错

```text
Port 5173 is in use          → 换端口 --port 5174，或 strictPort 排查占用
Node 版本不满足               → nvm 切到 20.19+/22.12+
Cannot find module 'vite'    → npm install（依赖没装）
```

### 页面白屏 / 资源 404

```text
/public 里的文件用了相对路径   → public 资源一律以 / 开头引用
@ 别名报错                   → vite.config 的 alias 没配（或 tsconfig paths 未同步）
import 大小写不对             → Windows 不敏感、构建敏感！文件名大小写要与 import 完全一致
```

### 构建报错（dev 正常）

```text
Rollup failed to resolve import  → 动态 import 的路径写错/大小写错
CSS 里 url() 路径 404            → 相对路径参照物变化，改用别名或 / 绝对路径
构建产物本地打开 file:// 白屏     → 需要 base 配置（如下）
```

```js
// 部署到子路径（如 GitHub Pages 的 /repo-name/）必须配 base
export default defineConfig({
  base: '/repo-name/',
});
```

### 环境变量读不到

```text
变量名没加 VITE_ 前缀          → 前端读不到，补前缀
改了 .env 不生效              → 重启 dev 服务器（env 不走 HMR）
```

## 6.5 缓存与"玄学问题"

三层缓存，出"灵异现象"时按序清：

```bash
# ① 依赖预构建缓存
rm -rf node_modules/.vite

# ② 构建产物缓存
rm -rf dist

# ③ 终极大招：重装依赖
rm -rf node_modules && npm install
```

::: tip 排查顺序口诀
先看报错信息第一行 → 清 .vite 缓存 → 检查 config 改动是否需要重启 → 才考虑重装依赖。**dev 服务器不会热加载 vite.config.js**——改完配置必须重启！这是最高频的"改了没生效"。
:::

## 6.6 VitePress：本站与 Vite 的关系

本站（VitePress）就是"Vite 之上的静态站点框架"：

```text
你写的 .md 文件 → Vite 管线 → 预渲染 HTML + 客户端 SPA
dev 模式：按需编译 md（所以加章节要重启才更新侧边栏）
build 模式：全量静态化输出 dist/
```

理解了 Vite 的 dev/build 双模式，就理解了本站全部构建行为——课程从 Node 教程的 npm scripts 到今天，工具链知识已经闭环。

## 6.7 下一步

构建工具毕业。接下来把它用进框架实战：

- [Vue 3 教程](/tutorials/vue/)：create-vue 底层就是本教程的一切
- [React 教程](/tutorials/react/)：Vite + React 模板
- 回看 [TypeScript 教程第 9 章](/tutorials/typescript/)：typecheck 与 build 的分工

## 本章小结

- 快 = ESM 按需伺服 + esbuild 预构建 + 按需编译
- esbuild 管转译求快、Rollup 管打包求优、Vite 是总线
- HMR 处理不了就冒泡/整页刷新；vite.config 改动必须重启
- file:// 白屏查 base、大小写问题 Windows 上最隐蔽、清缓存有顺序
