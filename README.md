# CS101 · 中文计算机学习路径

> 从「学什么、按什么顺序学、在哪里练、学到哪了」出发的计算机学习路径站。
> **Astro + Starlight + React + Tailwind CSS + shadcn/ui + Monaco Editor**，依赖使用最新稳定版（例外见 [VERSIONS.md](./VERSIONS.md)）。

## 当前状态

- `main` 分支：新站（M0–M6 已完成，待最终验收与上线）
- `legacy-vitepress` 分支：旧 VitePress + Vue + Vuetify 站点完整备份

站点规模：**340 页**（12 个教程分组 / 162 门教程（27 门已有内容 / 266 章）、19 条技术路线、20 个应用领域、计算机科学国内 + OSSU 路线、代码演练场）。内容分类参照《软件技术内容分类规划》：主线一「编程语言与技术栈」→ 首页，主线二「软件技术领域」→ 应用领域。

## 信息架构

- 顶部导航：**首页 / 应用领域 / 计算机科学 / 演练场**
- 首页 `/`：教程目录——工具与基础、大前端（含 Flutter / React Native 跨端）、Java、Python、Go、Rust、C / C++、C# 与 .NET、移动端开发、数据库、中间件、DevOps **同级成组**，组内列该方向的具体教程；每组标题右侧为「学习路线 →」；左侧栏列出全部分组，点击定位、滚动高亮
- 教程页 `/tutorials/<slug>/…`：左侧栏切换为该教程的章节目录
- 应用领域 `/domain/`：版式与交互同首页（分组标题 + 卡片网格、左侧栏 20 个领域点击定位/滚动高亮），只是标题右侧没有「学习路线」链接；领域路线页的左侧栏切换为领域列表并高亮当前领域
- `/tech-stack/`：19 条学习路线总览（首页每组标题右侧的「学习路线 →」进入对应路线）
- 尚未编写的教程先占位显示「敬请期待」，内容写完自动点亮

## 核心能力

| 能力 | 实现 |
| --- | --- |
| ⌘K 中文搜索 | 构建期 section 级索引（2617 小节）+ MiniSearch + `Intl.Segmenter` 分词，键盘导航、最近搜索、直达小节锚点 |
| 学习进度 | 本地 localStorage 记录完成/收藏/最近阅读；章节完成按钮、系列进度、首页「继续学习」 |
| 代码演练场 | `/playground/`：Monaco 按需加载，JavaScript 在 Worker 中执行，HTML/CSS 实时预览 |
| 文档内运行实例 | 每个可运行语言的代码块右上角「运行实例」，一键带到演练场 |
| 教程站版式 | w3schools/菜鸟式方角排版、面包屑、章节元信息（时长/难度）、底部大翻页、深浅色 |
| 路线与课程 | 首页按编程语言组织的教程目录、四阶段技术路线卡、领域路线、计算机科学课程与学习资源 |

## 环境要求

| 项 | 版本 |
| --- | --- |
| Node.js | 最新 LTS（当前 `24.22.1`，见 `.nvmrc`） |
| pnpm | 最新版（当前 `12.15.0`，见 `packageManager`） |

## 常用命令

```bash
pnpm install          # 安装依赖
pnpm dev              # 本地开发 http://localhost:4321/cs101/
pnpm build            # 生成搜索索引 + 构建静态站点到 dist/
pnpm preview          # 预览构建产物
pnpm check            # astro check 类型检查
pnpm check:links      # 构建产物站内链接检查（0 404）
pnpm index:search     # 只重新生成搜索索引
pnpm smoke            # M5 冒烟：搜索 / 进度 / 演练场（需先 build + preview）
pnpm versions         # 重新生成 VERSIONS.md 版本台账
```

## 项目结构

```text
src/
  content.config.ts          # 内容集合 schema（series/order/difficulty/duration/tags）
  content/docs/              # 335 页内容（md/mdx，目录即 URL）
  components/
    shell/                   # 覆盖 Starlight：Header/PageTitle/Pagination/Footer
    search/                  # ⌘K 搜索岛
    progress/                # 完成/收藏/继续学习岛
    playground/              # Monaco 编辑器、Worker 执行器
    roadmap|tutorial|home|computer-science/
  data/                      # 首页教程目录（catalog.ts）、路线表、系列元信息、计算机科学课程 JSON
  lib/                       # 内容索引、搜索、进度、工具函数
  integrations/base-links    # 构建期补 base 前缀（兜底）
  styles/global.css          # Tailwind + Starlight 层序 + 教程站设计令牌
scripts/                     # 内容规范化、页面生成、搜索索引、链接检查、冒烟、版本台账
.github/workflows/deploy.yml # 构建并部署到 GitHub Pages
```

## 部署约定

- 站点部署在 GitHub Pages 项目路径：`https://yluiop123.github.io/cs101/`
- `astro.config.mjs` 中 `base: '/cs101'`；内容链接统一使用**相对路径**，构建期 `base-links` 集成兜底，链接检查保证 0 缺失。
- 推送 `main` 后由 GitHub Actions 构建并发布 `dist/`（当前**尚未 push**，等待验收后执行）。

## 版本策略

1. 依赖安装时取最新稳定版（`pnpm add <pkg>@latest` / `pnpm up --latest`），`package.json` 记录 caret 范围，`pnpm-lock.yaml` 锁定精确版本。
2. 升级后运行 `pnpm versions` 更新 `VERSIONS.md`；施工期冻结非安全升级。
3. 上游不兼容时允许锁旧版，但必须登记例外与复查条件：当前唯一例外是 **TypeScript 6**（`astro check` 尚不支持 TypeScript 7）。
