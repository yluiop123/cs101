---
title: pnpm 与现代包管理
---

# 第 3 章 · pnpm 与现代包管理

**本章目标：**

- 理解 pnpm 相对 npm 的核心优势
- 熟练掌握 pnpm 的日常命令（与 npm 一一对应）
- 会把 npm 项目迁移到 pnpm

## 3.1 npm 的两个老问题

### 问题一：磁盘黑洞

npm 早期把每个项目的依赖**完整复制**一份到自己的 `node_modules`。十个项目用 Vue，磁盘上就有十份 Vue。

### 问题二：幽灵依赖（phantom dependencies）

npm 的 node_modules 是"扁平化"安装——把依赖拍平放一起：

```text
node_modules/
├── vue/            # 你装的
├── compiler-core/  # Vue 的依赖，也"冒"出来了！
├── ...
```

于是你的代码 `import xxx from 'compiler-core'`（你没声明过这个依赖）也能跑通——这就是**幽灵依赖**：能跑，但危险。哪天 Vue 升级不再依赖它，你的项目当场崩掉。

## 3.2 pnpm 的解法：全局仓库 + 硬链接

pnpm（performant npm）在磁盘上维护一个**全局内容寻址仓库（store）**，项目的 node_modules 里放的只是指向 store 的**硬链接**：

```text
C:\...\.pnpm-store\        ← 全局仓库：每份包只存一次
my-app/node_modules/       ← 硬链接，几乎不占额外空间
```

两大收益：

1. **省磁盘**：100 个项目用同一个版本的 Vue，磁盘上只有一份
2. **装得快**：已有内容的包直接链接，跳过下载解压

```text
严格依赖结构（不会冒出幽灵依赖）：

my-app/node_modules/
├── vue → .pnpm/vue@3.4.0/node_modules/vue   ← 只有你声明的才可见
└── .pnpm/                                    ← 真实存放区（内部结构）
    ├── vue@3.4.0/node_modules/vue
    └── compiler-core@3.4.x/...               ← 依赖的依赖，藏在这里
```

你的代码 `require('compiler-core')` 会**直接报错**——依赖必须声明才能用，依赖关系从此诚实。

## 3.3 pnpm 命令：与 npm 对照表

| 场景 | npm | pnpm |
| --- | --- | --- |
| 初始化 | `npm init -y` | `pnpm init` |
| 安装全部依赖 | `npm install` | `pnpm install`（`pnpm i`） |
| 装运行时依赖 | `npm i lodash` | `pnpm add lodash` |
| 装开发依赖 | `npm i -D vite` | `pnpm add -D vite` |
| 装指定版本 | `npm i lodash@4.17.21` | `pnpm add lodash@4.17.21` |
| 全局安装 | `npm i -g pnpm` | `pnpm add -g pnpm` |
| 卸载 | `npm uninstall lodash` | `pnpm remove lodash`（`pnpm rm`） |
| 运行脚本 | `npm run dev` | `pnpm dev`（**可省略 run**） |
| 临时执行 | `npx create-vue` | `pnpm dlx create-vue` |
| 查看依赖树 | `npm ls` | `pnpm ls` |

安装 pnpm：

```bash
npm i -g pnpm     # 用 npm 装一次 pnpm（此后天下太平）
pnpm -v
```

::: tip 记忆锚点
只记三处差异：安装依赖用 **add**（不是 install）、卸载用 **remove**、临时执行用 **dlx**（不是 npx）。其余命令与 npm 同名。
:::

## 3.4 迁移 npm 项目到 pnpm

```bash
# 1. 清理 npm 的痕迹
rm -rf node_modules package-lock.json    # Windows: Remove-Item -Recurse

# 2. pnpm 接管
pnpm import       # 把 package-lock.json 的版本解析结果转为 pnpm-lock.yaml（若已删 lock 可跳过）
pnpm install

# 3. 验证
pnpm ls --depth 0
```

::: warning lock 文件二选一
`package-lock.json` 与 `pnpm-lock.yaml` **不要共存**——同一个项目只认一个包管理器，混用会导致依赖解析不一致。团队选定后写进 README。
:::

## 3.5 pnpm 的其他实用能力

```bash
pnpm store path        # 查看全局仓库位置
pnpm store prune       # 清理仓库里未被引用的包

pnpm outdated          # 查看过期依赖
pnpm update            # 更新
pnpm why lodash        # 解释"lodash 为什么会被装进来"（依赖链路）

pnpm dlx shadcn-vue@latest init   # 运行一次性脚手架
```

::: info 选型建议
2024 年后的新项目**默认 pnpm**：Vite、Vue、React 官方生态全部兼容；各大 CI 平台原生支持。npm 作为"保底知识"必须会读会写（老项目、公司规范可能锁死 npm），日常生产用 pnpm。
:::

## 本章小结

- npm 两痛点：重复占磁盘、扁平化带来幽灵依赖
- pnpm = 全局 store + 硬链接 + 严格依赖结构：省空间、装得快、依赖诚实
- 命令记忆：add / remove / dlx 三处差异，其余同名
- lock 文件不共存；新项目默认 pnpm
