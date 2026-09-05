---
title: npm 进阶：脚本、发布与依赖治理
---

# 第 7 章 · npm 进阶：脚本、发布与依赖治理

**本章目标：**

- 深入 scripts 的高级用法与生命周期钩子
- 学会依赖的升级、审计与常见问题处理
- 了解发包流程与 peerDependencies

（语义化版本与 lock 文件的基础已在第 2 章讲解，本章是工程实践篇。）

## 7.1 scripts 高级用法

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --fix",
    "precommit": "npm run lint && npm run test",
    "deploy": "npm run build && node scripts/deploy.js"
  }
}
```

三个进阶技巧：

```json
{
  "scripts": {
    "lint": "eslint src",
    "lint:fix": "npm run lint -- --fix",
    "build:prod": "NODE_ENV=production vite build"
  }
}
```

1. **`--` 传参**：`npm run lint -- --fix` 把 `--fix` 追加给底层命令（不动 scripts 定义）
2. **串联**：`&&` 顺序执行、`&` 并行执行
3. **前后钩子**：`npm run build` 会**自动先执行** `prebuild`，成功后自动执行 `postbuild`

## 7.2 依赖升级策略

```bash
npm outdated            # 查看哪些依赖落后（当前版本/期望版本/最新版本）

# 升级方式（由保守到激进）
npm update              # 只升到 package.json 范围内的最新（如 ^4.17.0 → 4.17.30）
npm install lodash@latest   # 升到最新版（可能跨主版本）
npm install -D vite@6   # 显式指定新主版本
```

跨主版本升级的原则：**小步快跑 + 看官方迁移指南**——主版本升级（如 Vue 2 → 3）不是 `npm i` 能解决的，API 会变。

## 7.3 依赖审计与安全

```bash
npm audit               # 扫描已知漏洞（npm 装包后自动提示）
npm audit fix           # 自动修复（升级到无漏洞的兼容版本）
npm audit fix --force   # 强制修复（可能跨主版本，需人工验证）
```

漏洞等级从低到高：low / moderate / high / critical。生产项目应保持 **0 critical/high**。

::: warning 供应链安全
依赖即信任。安装不认识的包前先看：周下载量、GitHub 活跃度、最近发布时间。`pnpm why <pkg>` 能查清"它为什么会被装进来"。
:::

## 7.4 常见依赖问题急救

### 问题一：装包卡住/超时

```bash
# 换国内镜像源
npm config set registry https://registry.npmmirror.com
pnpm config set registry https://registry.npmmirror.com

# 查看当前源
npm config get registry
```

### 问题二：node_modules 损坏

```bash
rm -rf node_modules package-lock.json
npm install       # 一键重装，解决 80% 的"玄学报错"
```

### 问题三：版本冲突 / 依赖重复

```bash
npm ls <pkg>            # 查看该包在依赖树中的多份版本
npm dedupe              # npm：去重
pnpm dedupe             # pnpm：去重（效果更好）
```

### 问题四：peerDependencies 冲突

```json
{
  "peerDependencies": {
    "react": ">=18"
  }
}
```

`peerDependencies`（对等依赖）是**库作者**声明"我不自带 React，用宿主那份"。应用开发者遇到冲突时，按提示对齐版本即可。

## 7.5 发布自己的包（了解即可）

```bash
# 1. 注册 npmjs.com 账号并登录
npm login

# 2. 准备 package.json（name 全网唯一、version、main 入口）
# {
#   "name": "my-utils",
#   "version": "1.0.0",
#   "main": "index.js",
#   "files": ["index.js"]    // 只发布列出的文件
# }

# 3. 发布 / 更新
npm publish               # 首发
npm version patch         # 1.0.0 → 1.0.1（修 bug）
npm version minor         # → 1.1.0（新功能）
npm publish
```

日常业务开发很少发包，但理解"包 = 一个有 package.json 的目录"，就理解了整个生态的运转方式。

## 7.6 综合示例：给项目加上质量门禁

```json
{
  "scripts": {
    "lint": "eslint src",
    "test": "vitest run",
    "check": "npm run lint && npm run test",
    "prepush": "npm run check"
  }
}
```

一条 `npm run check` 串起检查与测试——把它接进 CI 或 git 钩子，团队代码质量就有了自动闸门。

## 本章小结

- scripts 有 `--` 传参、`&&` 串联、pre/post 钩子三板斧
- 升级先 `npm outdated`；跨主版本看迁移指南，小步快跑
- `npm audit` 守安全线：0 critical/high；换源解决网络问题
- 玄学报错三板斧：删 node_modules → 删 lock → 重装
