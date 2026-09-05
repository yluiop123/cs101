---
title: npm 基础：package.json 与依赖安装
---

# 第 2 章 · npm 基础：package.json 与依赖安装

**本章目标：**

- 理解 package.json 的结构与作用
- 熟练使用 npm 的安装、卸载与运行命令
- 分清 dependencies 与 devDependencies

## 2.1 初始化项目：package.json 诞生

每个 Node/前端项目都以 `package.json` 开局：

```bash
mkdir my-app && cd my-app
npm init -y     # -y = 全部采用默认值，快速生成
```

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "license": "ISC"
}
```

::: tip package.json 是什么
它是项目的**身份证 + 依赖清单 + 任务清单**：项目叫什么、依赖哪些包、能执行哪些命令——团队协作时，别人拿到 package.json 就能还原整个环境（代码靠 Git，环境靠它）。
:::

## 2.2 安装依赖：npm install

```bash
# 安装运行时依赖（生产环境需要）
npm install lodash          # 简写：npm i lodash

# 安装开发依赖（只在开发期需要）
npm install -D vite         # 简写：npm i -D vite（--save-dev）

# 安装指定版本
npm i lodash@4.17.21

# 全局安装（工具类，如脚手架）
npm i -g pnpm
```

安装后项目发生的变化：

```text
my-app/
├── node_modules/        # 依赖的实体代码（体积巨大，绝不提交 Git）
├── package.json         # 依赖被记录在这里
└── package-lock.json    # 依赖的精确版本锁定（必须提交 Git）
```

::: danger node_modules 与 lock 文件的 Git 纪律
- `node_modules/` → 写进 `.gitignore`，**永远不提交**（可由 package.json + lock 重新安装还原）
- `package-lock.json` → **必须提交**，保证团队成员与部署环境装到**完全相同**的版本

新同事上手：`git clone` 后一句 `npm install` 环境即就位。
:::

## 2.3 dependencies vs devDependencies

```json
{
  "dependencies": {
    "lodash": "^4.17.21",     // 运行时需要：打包进产物
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",         // 仅开发期：构建工具、测试、类型检查
    "eslint": "^8.0.0"
  }
}
```

判断标准：**代码打包发布后还需要它吗？** 需要 → dependencies；只是开发过程用（构建/检查/测试）→ devDependencies。

## 2.4 语义化版本（Semver）

`^4.17.21` 这类版本号是"语义化版本"（Semantic Versioning）：

```text
4.17.21
│  │  └─ 补丁版本 patch：修 bug，完全兼容
│  └──── 次版本 minor：新增功能，向后兼容
└─────── 主版本 major：重大变更，可能不兼容（breaking changes）

^4.17.21   允许 4.x.x 的更新（不改主版本）—— npm 默认
~4.17.21   允许 4.17.x 的更新（不改次版本）
4.17.21    精确锁定，一个字都不能变
```

::: warning 为什么要 lock 文件
package.json 里的 `^4.17.21` 是**范围**——不同时间安装可能拿到不同的 4.x 小版本。lock 文件把"实际装到的精确版本"钉死，这就是它必须提交的原因。
:::

## 2.5 常用 npm 命令速查

```bash
npm install              # 按 package.json + lock 安装全部依赖（装新项目第一步）
npm i <pkg>              # 添加运行时依赖
npm i -D <pkg>           # 添加开发依赖
npm uninstall <pkg>      # 移除依赖（同步更新 package.json）
npm update               # 更新到范围内最新版本
npm outdated             # 查看过期的依赖

npm ls                   # 查看已安装依赖树
npm ls --depth=0         # 只看直接依赖
```

## 2.6 scripts：项目任务清单

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint src",
    "start": "node index.js"
  }
}
```

```bash
npm run dev      # 执行 scripts 里的任务
npm run build
npm start        # start/stop/test 有特权：可省略 run
```

::: info scripts 里能直接用依赖的命令
scripts 执行时，npm 会把 `node_modules/.bin` 加入 PATH——所以 `vite` 不必全局安装也能跑。**项目工具优先装在项目里**，避免全局版本不可控。
:::

## 2.7 npx：临时执行包命令

```bash
npx create-vue my-project   # 临时下载执行，用完即弃（无需全局安装）
npx prettier --write .      # 一次性格式化
```

`npx` = "执行包提供的命令，本地有就用本地的，没有就临时下载"。脚手架类工具（用一次）非常适合 npx。

## 2.8 综合流程：从零到跑起来

```bash
mkdir demo-app && cd demo-app
npm init -y
npm i lodash
npm i -D vite

# package.json 添加 "scripts": { "dev": "vite" }
npm run dev
```

这个循环（init → install → script）就是所有前端项目的标准开局，[Vite 教程](/tutorials/vite/) 会把它变成一行脚手架命令。

## 本章小结

- `npm init -y` 开局；package.json = 身份证 + 依赖清单 + 任务清单
- `npm i` 生产依赖、`npm i -D` 开发依赖；lock 文件必须提交、node_modules 永不提交
- 语义化版本：`^` 主版本内浮动；精确版本靠 lock
- `npm run` 执行 scripts；npx 临时执行不安装
