---
title: workspace 与 monorepo
---

# 第 8 章 · workspace 与 monorepo

**本章目标：**

- 理解 monorepo 的价值与适用场景
- 掌握 pnpm workspace 的配置与使用
- 学会多包之间的引用与任务编排

## 8.1 什么情况需要 monorepo

**Monorepo（单仓库）**：多个相关项目/包放在**一个** Git 仓库里统一管理。与之相对的传统方式叫 polyrepo（每项目一仓）。

```text
monorepo 结构：
my-platform/
├── apps/              # 应用（最终产物）
│   ├── web/           # 官网（Vue）
│   └── admin/         # 后台（React）
├── packages/          # 共享包（被 apps 引用）
│   ├── ui/            # 组件库
│   ├── utils/         # 工具函数
│   └── api-client/    # 接口封装
└── pnpm-workspace.yaml
```

三个信号提示你需要 monorepo：

1. 多个项目**重复维护同样的工具函数/组件**
2. 一个包改动要同步 N 个仓库，版本对不齐
3. 联调需要来回切仓库、link 本地包

## 8.2 pnpm workspace 配置

pnpm 原生支持 workspace（工作区），一行配置开启：

```yaml
# pnpm-workspace.yaml（仓库根目录）
packages:
  - 'apps/*'
  - 'packages/*'
```

```json
// 根目录的 package.json 私有化（防止误发布整个仓库）
{
  "name": "my-platform",
  "private": true,
  "scripts": {
    "dev:web": "pnpm --filter web dev"
  }
}
```

安装依赖：**在对应包目录里执行即可**，pnpm 自动识别 workspace 上下文。

## 8.3 workspace 内的核心命令

```bash
# 在指定包里执行命令（--filter 按包名过滤）
pnpm --filter web dev          # 跑 apps/web 的 dev
pnpm --filter @acme/ui build   # 跑 packages/ui 的 build

# 给所有包装依赖
pnpm -r add zod                # -r = recursive 递归所有包

# 给特定包装
pnpm --filter web add axios

# 根目录安装（全仓库共用的工具，如 eslint）
pnpm add -D -w eslint          # -w = workspace-root

# 按依赖顺序构建所有包
pnpm -r build
```

## 8.4 包之间的引用

`packages/utils` 要被 `apps/web` 使用：

```json
// apps/web/package.json
{
  "dependencies": {
    "@acme/utils": "workspace:*"
  }
}
```

```text
★ workspace 协议：链接到本仓库的包
```

```bash
pnpm install    # 安装时自动建立符号链接，指向 packages/utils 源码
```

```js
// apps/web 源码里像使用普通包一样使用
import { formatDate } from '@acme/utils';
```

::: info workspace:* 的意义
它告诉 pnpm"用本仓库的版本"而不是去 npm 下载。修改 packages/utils 源码，apps/web **立即生效**（指向的就是源码）——联调零成本，这正是 monorepo 的核心爽点。
:::

## 8.5 实战：三包最小 monorepo

```text
demo-monorepo/
├── pnpm-workspace.yaml      # packages: ['packages/*']
├── package.json             # { "private": true }
└── packages/
    ├── utils/               # @demo/utils
    │   ├── package.json     # { "name": "@demo/utils", "main": "index.js" }
    │   └── index.js         # export const add = (a, b) => a + b;
    └── app/
        ├── package.json     # { "name": "@demo/app", "dependencies": { "@demo/utils": "workspace:*" } }
        └── index.js         # import { add } from '@demo/utils';
```

```bash
pnpm install
pnpm --filter @demo/app index.js    # 输出 add(1,2) 的结果
```

十行配置，获得"多包 + 内部链接 + 统一安装"的完整能力。

## 8.6 任务编排：依赖感知的构建

```bash
pnpm -r build        # 按拓扑顺序构建：utils 先于 app（app 依赖 utils）
pnpm -r --parallel dev   # 并行启动所有包的 dev
```

pnpm 自动分析包间依赖关系，**被依赖者先构建**——monorepo 最容易翻车的"构建顺序"问题被原生解决。

::: info 何时升级到专用工具
包多了以后，Turborepo/Nx 等工具提供**增量构建**（只重建受影响的包）与远程缓存。起步阶段 pnpm workspace 足够，规模上来了再加 Turbo——通常就是 `turbo.json` 一层壳。
:::

## 8.7 monorepo 的代价

诚实地列出成本，避免盲目上船：

1. **权限粗粒度**：仓库内所有代码对所有人可见（大团队可能需要分包）
2. **CI 变慢**：每次提交跑全仓库（需要增量构建工具优化）
3. **Git 历史混杂**：难以单独回滚某个包

结论：**2~3 人小团队、强关联项目 → monorepo 收益显著；完全独立的项目 → polyrepo 更省心**。

## 本章小结

- monorepo 解决"重复代码 + 版本同步 + 联调切换"三大痛点
- pnpm workspace：`pnpm-workspace.yaml` 声明范围 + `--filter` 精准操作
- `workspace:*` 协议实现包间源码级引用，联调零成本
- `pnpm -r` 按拓扑序构建，顺序问题原生解决
