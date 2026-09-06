---
title: 工程化配置
---

# 第 9 章 · 工程化配置

**本章目标：**

- 读懂 tsconfig.json 的核心选项
- 建立 strict 严格模式的项目规范
- 理解 TS 在 Vite/Vue 项目中的角色分工

## 9.1 初始化 tsconfig

```bash
npx tsc --init     # 生成带注释的完整默认配置
```

精简后的推荐起点：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "esModuleInterop": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}
```

## 9.2 核心选项逐个讲

| 选项 | 含义 | 推荐值 |
| --- | --- | --- |
| `target` | 编译输出的 JS 版本 | ES2020（现代浏览器全覆盖） |
| `module` | 模块体系 | ESNext（配打包器使用） |
| `moduleResolution` | 模块解析策略 | bundler（配合 Vite/Webpack 5） |
| `strict` | 严格模式总开关 | **必须 true** |
| `noEmit` | 只检查不产出文件 | true（产物交给 Vite 生成） |
| `skipLibCheck` | 跳过第三方库的类型检查 | true（提速，库的锅不背） |
| `paths` | 路径别名 | `@/*` 指向 src |

::: danger strict 是底线
`"strict": true` 打开一揽子严格检查：`strictNullChecks`（null/undefined 必须显式处理）、`noImplicitAny`（禁止隐式 any）等。**新项目一律开启**——关掉它等于白学 TS。教程前八章的所有报错，大多源自 strict 的守护。
:::

## 9.3 strict 家族重点成员

```ts
// strictNullChecks：null 不是万金油
function findUser(id: number): User | undefined { /* ... */ }
const user = findUser(1);
user.name;              // ❌ user 可能是 undefined
if (user) user.name;    // ✅ 收窄后放行

// noImplicitAny：参数必须显式标注
function process(data) { }   // ❌ Implicit any
function process(data: unknown) { }   // ✅
```

## 9.4 路径别名

```ts
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

```ts
// 之前：../../services/todoService
// 之后：@/services/todoService
import { addTodo } from '@/services/todoService';
```

::: warning 别名要多处同步
`paths` 只影响 TS 的检查；**构建工具**（Vite 的 resolve.alias、测试框架）需要各自配置同一份映射——别名"生效要三处对齐"是新手常见的"编辑器过了、运行报错"原因。
:::

## 9.5 声明文件（.d.ts）初识

第三方库的类型从哪来？——**声明文件（declaration files）**：

```text
内置类型：Node/ES 自带（@types/node 由 TS 场景引入）
库自带类型：现代库（Vue/Vite/Pinia）package.json 里自带 .d.ts
社区类型：老库需要单独安装 @types/lodash 等
```

```bash
npm i -D @types/lodash    # 老库补类型的标准动作
```

给自己的全局变量补声明：

```ts
// src/types/global.d.ts
declare const __APP_VERSION__: string;   // 告诉 TS：这个全局变量存在
```

## 9.6 类型检查与构建的分工（Vite 项目）

```json
// package.json —— 现代前端项目的标准脚本
{
  "scripts": {
    "dev": "vite",                       // esbuild 转译（快，不查类型）
    "build": "vue-tsc --noEmit && vite build",   // 先类型检查再构建
    "typecheck": "vue-tsc --noEmit"
  }
}
```

分工逻辑：

```text
类型检查（tsc / vue-tsc）：慢而全 —— commit 前或 CI 跑
代码转译（esbuild / Vite）：毫秒级 —— dev 服务器实时跑
```

::: info 为什么 dev 不做类型检查
esbuild 转译速度是 tsc 的几十倍，为了开发体验，类型检查被"延迟"到独立命令。所以 **dev 跑得通 ≠ 类型全对**——养成随手跑 `npm run typecheck` 的习惯。

:::

## 9.7 与 JS 项目共存

渐进迁移策略（老 JS 项目加 TS）：

```json
{
  "compilerOptions": {
    "allowJs": true,       // 允许 .js 文件参与
    "checkJs": false       // 暂不检查 .js（后续逐个开）
  },
  "include": ["src"]
}
```

路线：新代码全部 .ts → `checkJs: true` 让 JS 也检查 → 逐文件改名迁移。**从工具函数开始迁**，收益立现。

## 9.8 综合检查：给项目做一次"体检"

```bash
npx tsc --noEmit       # 输出所有类型错误；无输出 = 全绿
```

把它加进 Git 钩子/CI（Node 教程第 7 章 prepush 思路）：

```json
"scripts": {
  "typecheck": "tsc --noEmit",
  "prepush": "npm run typecheck && npm run lint"
}
```

## 本章小结

- tsconfig 核心：strict 必须 true；noEmit + bundler 解析配 Vite
- paths 别名要在 tsconfig / Vite / 测试配置三处对齐
- 类型声明三种来源：内置、库自带、@types/*；全局变量用 .d.ts 声明
- 分工：esbuild 管快、tsc/vue-tsc 管全；typecheck 进 CI
