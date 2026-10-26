# CS101 · 中文计算机学习路径

> 从「学什么、按什么顺序学、在哪里练、学到哪了」出发的计算机学习路径站。
> 技术栈：**Astro + Starlight + React + Tailwind CSS + shadcn/ui + Monaco Editor**，全部依赖使用最新稳定版（例外见 [VERSIONS.md](./VERSIONS.md)）。

## 当前状态

- `main` 分支：新站（Astro 7 重建中，M1 骨架已完成）
- `legacy-vitepress` 分支：旧 VitePress + Vue + Vuetify 站点完整备份

## 环境要求

| 项 | 版本 | 说明 |
| --- | --- | --- |
| Node.js | 最新 LTS（当前 `24.22.1`，见 `.nvmrc`） | Astro 7 要求 `>= 22.23.4` |
| pnpm | 最新版（当前 `12.15.0`） | `packageManager` 字段与 `pnpm-lock.yaml` 双重锁定 |

```bash
corepack enable          # 或全局安装 pnpm 最新版
pnpm install             # 安装依赖
pnpm dev                 # 本地开发 http://localhost:4321/cs101/
pnpm build               # 构建静态站点到 dist/
pnpm preview             # 预览构建产物
pnpm check               # astro check 类型检查
pnpm versions            # 重新生成 VERSIONS.md 版本台账
```

## 项目结构

```text
src/
  content.config.ts        # 内容集合（title/description/series/difficulty/duration/tags...）
  content/docs/            # 内容页（md/mdx），目录即 URL
  components/              # React 岛与 Astro 组件
  data/                    # 路线表、系列元信息、课程资源等纯数据
  integrations/base-links  # 构建期补齐 base 前缀（GitHub Pages 子路径）
  lib/                     # 内容索引、搜索索引、工具函数
  middleware.ts            # 开发期根路径链接 302 到 base 前缀
  styles/global.css        # Tailwind + Starlight 层序与设计令牌
scripts/                   # 内容规范化、版本台账、链接检查
```

## 部署约定

- 站点部署在 GitHub Pages 项目路径：`https://yluiop123.github.io/cs101/`
- `astro.config.mjs` 中 `base: '/cs101'`；正文里统一写站点根路径（如 `/tech-stack/`），构建期由 `base-links` 集成补前缀。
- 推送 `main` 后由 `.github/workflows/deploy.yml` 自动构建并发布 `dist/`。

## 版本策略

1. 所有依赖安装时取最新稳定版（`pnpm add <pkg>@latest` / `pnpm up --latest`），`package.json` 记录 caret 范围，`pnpm-lock.yaml` 锁定精确版本。
2. 每次升级运行 `pnpm versions` 更新 `VERSIONS.md`；施工期冻结非安全升级。
3. 上游不兼容时允许锁旧版，但必须在 `VERSIONS.md` 登记例外与复查条件（当前唯一例外：TypeScript 6，因 `astro check` 尚不支持 TypeScript 7）。
