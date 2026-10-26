# CS101 新站重建计划 · 以体验为中心 · Astro + Starlight + React + Tailwind + shadcn/ui + Monaco

> 定位：一个中文计算机学习路径站——回答「学什么、按什么顺序学、在哪里练、学到哪了」。
> 原则：**旧 VitePress 站只作为内容素材，不继承其技术栈、URL、组件与交互约束**；用最新稳定版技术栈从零设计体验。
> 本文是执行计划（不是最终代码），含体验目标、技术方案、内容模型、里程碑、验收与风险。

---

## 0. TL;DR

- **做法**：从零建新站；正文内容全量保留并规范化（335 篇），信息架构、组件、交互、视觉全部按“学习体验最优”重新设计。
- **技术**：Astro + Starlight + React 岛 + Tailwind + shadcn/ui + Monaco，**全部取执行时最新稳定版**，lockfile + 版本台账保证可复现。
- **体验支柱**：找得到（⌘K 中文搜索）、读得进（w3schools/菜鸟式排版）、练得了（Monaco 实例运行）、跟得住（本地进度/收藏/继续学习）、够快（静态 + 预取 + 岛）。
- **周期**：单人约 17 人日；3–4 人并行约 9–11 个日历日。
- **最大风险**：latest 组合兼容性、推翻 Starlight 默认视觉的覆盖成本、中文搜索质量、范围蔓延（体验功能贪多）、Monaco 体积。
- **前置阻塞**：仓库无 `.git`；当前会话 shell 因 Windows 文件权限无法启动（见 §12）。

---

## 1. 目标体验（North Star）

### 1.1 核心用户旅程

```text
首页（选方向 / 继续学习）
   ↓
路线页（这一方向分几个阶段、每阶段学哪些系列）
   ↓
系列页（章节清单、总时长、前置要求、开始/继续）
   ↓
章节页（读正文 → 复制/运行实例 → 标记完成 → 下一章）
   ↓
进度页/首页卡片（已完成 X 章、继续上次那章、收藏的章节）
```

### 1.2 体验支柱与验收指标

| 支柱 | 用户感受 | 关键能力 | 指标 |
| --- | --- | --- | --- |
| 找得到 | 想学什么 3 秒内找到 | ⌘K 命令面板搜索、分类/难度筛选、最近搜索、系列内跳转 | 20 条真实中文查询 Top-3 命中 ≥ 80% |
| 读得进 | 像看教材一样顺 | 教程站版式、面包屑、正文行宽、TOC、阅读进度条、预计时长 | 正文行宽 860–900px、行高 1.8、跳读测试通过 |
| 练得了 | 看完就能动手 | 代码复制、`[运行实例]`、Monaco 演练场、HTML/CSS/JS 实时预览 | 实例运行成功率 100%（抽样 20 例） |
| 跟得住 | 知道学到哪了 | 完成标记、收藏、最近阅读、首页「继续学习」、路线进度 | 进度持久化无丢失、跨页刷新一致 |
| 够快 | 点开就有 | 静态 HTML + 预取 + 岛式加载 + 字体策略 | LCP ≤ 2.0s（4G 中端机）、CLS ≤ 0.05、INP ≤ 200ms、首屏 JS ≤ 120KB gzip |

### 1.3 明确不做的事

- 不做账号体系、不做服务端、不做评论/社区（首期）。
- 不播放广告、不做 Cookie 弹窗、不做过度动效。
- 不为了“迁移对等”复刻旧抽屉/卡片；只保留对学习有用的信息（前置、资源链接、必修/选修）。

---

## 2. 技术栈（全部最新稳定版）

| 层 | 选型 | 版本策略 |
| --- | --- | --- |
| 运行时 / 包管理 | Node.js 最新 LTS、pnpm 最新（corepack） | `.nvmrc` + `engines` + `packageManager` 固定 |
| 构建 | Astro（`output: 'static'`） | latest |
| 文档框架 | @astrojs/starlight | latest |
| 交互 | React（`@astrojs/react`） | latest |
| 样式 | Tailwind CSS + `@tailwindcss/vite` + `@astrojs/starlight-tailwind` | latest |
| 组件 | shadcn/ui（CLI latest，生成物入库） | latest |
| 编辑器 | Monaco（`monaco-editor` + `@monaco-editor/react`） | latest |
| 搜索 | MiniSearch + `Intl.Segmenter`（中文分词），备选 Pagefind latest | latest |
| 图标 | lucide-react | latest |
| 类型/校验 | TypeScript、@astrojs/check | latest |
| 测试 | Playwright | latest |
| CI | GitHub Actions（checkout / setup-node / pnpm / pages） | 各 action 最新主版本 |

### 2.1 “全最新”的可复现规则

1. **安装即最新**：`pnpm create astro@latest`、`pnpm astro add …`、`pnpm dlx shadcn@latest`、`pnpm add <pkg>@latest`、`pnpm up --latest`。
2. **`package.json` 记 caret 范围，不写 `"latest"` 字符串**；精确版本由提交进仓库的 `pnpm-lock.yaml` 锁定；CI 用 `pnpm install --frozen-lockfile`。
3. **版本台账 `VERSIONS.md`**：`scripts/versions.mjs` 从 `pnpm list --depth 0 --json` 生成（包名 / 实际版本 / 日期），随升级提交。
4. **兼容性 spike（M1 第一项）**：latest 一次装齐，跑最小矩阵（Astro 页 + Starlight 内容页 + React 岛 + shadcn 组件 + Monaco 空编辑器 + 搜索索引 + build），结果写进台账。
5. **冲突处理**：latest 之间不兼容（典型：Starlight 未跟上 Astro 新大版本、shadcn 未适配最新 Tailwind）→ “能升则升”；必须锁旧版时登记 **exception**（包、版本、原因、复查日期）并报你确认，不允许悄悄钉死。
6. **升级节奏**：施工期冻结非安全升级；上线后 Dependabot / Renovate（weekly、分组、跑冒烟），保持 `pnpm outdated` 清零或例外可控。
7. **文档随版本**：计划里提到的 API（Starlight Tailwind 接入、sidebar variants、Expressive Code、Monaco worker、View Transitions）都以执行时 latest 官方文档为准；大版本变化先做 spike 再动手。

---

## 3. 信息架构与 URL

### 3.1 站点地图

```text
/                       首页：方向入口 + 继续学习 + 分类色块 + 热门/最新
/computer-science/      计算机科学：国内课程 / OSSU 两条线
/tech-stack/            技术栈路线：语言 / 数据库 / 中间件 / 运维云
/domain/                应用领域路线：13+ 个领域
/tutorials/             教程总览（27 个系列，可按分类/难度筛选）
/tutorials/<series>/    系列页：简介、章节清单、前置、总时长、开始/继续
/tutorials/<series>/<chapter>/   章节页：正文 + TOC + 实例 + 翻页 + 完成/收藏
/roadmap/               学习路线总览（可选：后续做可视化）
/playground/            Monaco 演练场
/progress/             我的学习（本地进度、收藏、最近）
```

### 3.2 内容组织原则

- 一个**系列** = 一条可顺序学完的教程（27 个），章节按 `01-…` 排序。
- 一条**路线** = 若干系列按阶段组合（来自现有 `route-plan.ts` 数据，迁移为 `src/data/route-plan.ts`）。
- 旧 URL（`/tutorials/git/01-introduction` 等）**不作为约束**，但保留一个低成本兼容层：对访问量高的旧路径生成静态跳转页到新 URL（可选，M6 做，成本 < 0.5 人日）。

### 3.3 页面模板（体验规格）

| 页面 | 关键体验 |
| --- | --- |
| 首页 | 顶部搜索入口（⌘K）、方向选择、有进度时显示「继续学习」、分类色块、热门/最新列表；首屏无大图 |
| 路线页 | 阶段分组卡片（入门/进阶/精通/实战），显示每阶段系列与完成度，点击进系列 |
| 系列页 | 简介、前置要求、总时长、章节目录（序号/标题/时长/完成状态）、开始/继续按钮 |
| 章节页 | 面包屑 → 标题 + 元信息 → 正文 → 底部大翻页；顶部阅读进度条；完成/收藏按钮 |
| 教程总览 | 27 系列卡片网格 + 分类/难度筛选 + 搜索联动 |
| 我的学习 | 完成数、收藏、最近阅读、可一键继续 |

---

## 4. 内容模型与规范化流水线

### 4.1 内容模型（Astro content collection + zod schema）

```ts
title: string            // 页面标题（章节含“第 N 章 ·”）
description: string      // 150 字以内摘要（用于 SEO/搜索/卡片）
series?: string          // 所属系列 slug
order?: number           // 系列内顺序（文件名 NN- 前缀）
difficulty?: 'beginner' | 'intermediate' | 'advanced'
duration?: number        // 预计阅读分钟（自动估算 + 人工校准）
prerequisites?: string[] // 前置章节 slug
tags?: string[]
draft?: boolean
```

- 章节页正文里的 `##` 小节是搜索与 TOC 的基本单位。
- 自动派生：阅读时长（中文字数 / 300 字每分钟）、系列统计、上一章/下一章、路线进度。

### 4.2 内容规范化流水线（`scripts/normalize-content.mjs`，一次性）

旧正文是素材，不做“迁移对等”，只做**规范化**：

1. **路径重组**：按新 IA 落到 `src/content/docs/**`；章节文件名保持 `NN-*.md`。
2. **frontmatter 升级**：补 `description`（取首段）、`series`、`order`、`duration`、`difficulty`（按系列映射），`title` 采用正文 H1 文本（保留“第 N 章”），侧边栏短名放 `sidebar.label`。
3. **去重 H1**：删除与标题重复的正文 H1。
4. **提示块语法**：`::: tip|info|warning|danger` → Starlight aside（`:::tip[标题]` / `:::note` / `:::caution` / `:::danger`），约 646 行。
5. **组件页 MDX 化**：2 个内联数据页抽数据到 `src/data/`，4 个组件页改为 MDX + 新组件。
6. **裸 HTML 清理**：`computer-science/index.md` 的内联样式卡片改为标准组件。
7. **报告**：`scripts/report-content.mjs` 输出 335/335、容器数、H1 数、MDX 页、异常清单。
8. **数据资产**：从旧站抽取并保留 `route-plan.ts`、系列元信息、课程资源数据（含中文/英文、视频/文章标记）；`roadmap-archive/*`（30 个无引用文件）归档到 `legacy/`，不进入新站。

> 不做的事：不批量重写正文、不逐页加「实例」框（实例接入是有选择的 M5 工作）、不改写教学内容。

---

## 5. 视觉系统：w3schools / 菜鸟教程式教程站

设计目标不是“现代 SaaS 文档”，而是**传统教程站**：方角、1px 边框、高信息密度、左侧章节导航、面包屑、深色代码块、「实例」框、底部大翻页。
只参考版式与信息组织，**配色/Logo/素材/文案全部自定**，避免品牌混淆。

### 5.1 设计令牌

| 令牌 | 取值 |
| --- | --- |
| 主色（D6） | w3schools 绿 `#04AA6D` / 菜鸟蓝绿 `#2B7BB9` / 品牌蓝 `#2563EB` 三选一 |
| 正文 / 次色 | `#0f172a` / `#555` |
| 背景 | 页面 `#fff`、侧栏 `#f1f1f1`、代码块 `#282a35` |
| 边框 | `1px solid #d9d9d9`（表格/实例框/翻页/侧栏统一） |
| 圆角 | `0–2px`（覆盖 shadcn `--radius`） |
| 字体 | 系统字体栈：`-apple-system, "Segoe UI", "Microsoft YaHei", "PingFang SC", sans-serif`；代码字体子集自托管 |
| 字号/行高/行宽 | 正文 16px/1.8；h1 30–32px；h2 24px；h3 19px；内容列 860–900px |
| 链接 | 主色 + hover 下划线 |
| 阴影/渐变 | 基本不用；hover 仅底色变化 |

### 5.2 布局与外壳

- 顶部固定栏 60px：Logo、四个分类入口、搜索入口（⌘K）、主题切换；移动端汉堡。
- 左栏 260px 浅灰：当前系列章节列表，当前章主色左边框 + 加粗；系列切换置顶。
- 内容区：面包屑 → h1（2px 主色底线）→ 正文 → 大翻页按钮。
- 右侧 TOC：按 D7 默认隐藏或弱化（参考站都没有）。
- 移动端：抽屉式侧栏 + 底部固定操作条（目录 / 收藏 / 上一章 / 下一章）。

### 5.3 外壳组件覆盖（Starlight `components` 配置）

| 覆盖项 | 规格 |
| --- | --- |
| `Header.astro` | 深色或白底主色下边线；搜索入口 |
| `Sidebar.astro` | 27 套系列侧栏、当前项高亮、移动端抽屉 |
| `Breadcrumbs.astro` | 新增，按 URL 生成 |
| `PageTitle.astro` | h1 + 2px 主色底线 + 元信息（时长/难度） |
| `Pagination.astro` | 两块等宽大按钮 `❮ 上一章` / `下一章 ❯` |
| `Footer.astro` | 全宽浅灰/深色多列链接 |
| `TableOfContents.astro` | 按 D7 隐藏或弱化 |
| 首页 | 门户/仪表盘式，不用现代 hero 大图 |
| Expressive Code | 深色 + 方角 + 语言标签 + 复制按钮 |
| 正文 | 表格全边框、th 灰底；aside 方角 + 左 4px 色条 |

### 5.4 落地方式

- 令牌走 Starlight CSS 变量（`--sl-color-accent*`、`--sl-color-bg-sidebar`、`--sl-font`、`--sl-content-width`、`--sl-sidebar-width`）+ `customCss` 全局覆盖。
- shadcn：`--radius: 2px`、`variant="outline"`、禁用默认阴影/渐变，否则默认风格会直接破坏教程站观感。
- 这是与 Starlight 默认视觉相反的方向，覆盖量最大：**M2 先出 3 张样张（首页 / 系列页 / 章节页）确认后再全量铺开**。

---

## 6. 体验功能设计

### 6.1 搜索（⌘K 命令面板）

- 构建期生成 section 级索引（系列、章节、`##` 小节、锚点），前端 React 岛渲染命令面板。
- **中文分词**：构建期与查询期都用 `Intl.Segmenter('zh', { granularity: 'word' })` 分词，MiniSearch 建索引；支持前缀、模糊、中文子串、拼音首字母（可选）。
- 快捷入口：`⌘K` / `Ctrl+K`、顶部搜索框、移动端底部「搜索」。
- 结果卡片显示：系列 › 章节 › 小节 + 高亮；回车直达锚点；最近搜索（localStorage）。
- 备选：Pagefind latest（零维护），用 20 条真实中文查询 A/B 后再定；默认倾向自建（中文质量优先）。

### 6.2 学习进度与收藏（本地优先，无账号）

- localStorage schema v1：`{ completed: { [slug]: timestamp }, favorites: string[], recent: [{ slug, at }] }`。
- 章节页：`标记完成` / `收藏` 按钮 + 顶部阅读进度条；系列页显示完成度环形/条形；首页「继续学习」取最近未完成章节。
- 路线页显示「已完成系列数 / 总数」。
- 无后端、无隐私采集；提供「清空本地数据」入口；SSR 与 hydration 安全（客户端读取，避免闪烁）。

### 6.3 代码与实例（Monaco）

- 静态代码块：Expressive Code 深色方角 + 语言标签 + 复制按钮（按需加载）。
- `ExampleBox`「实例」框：标题条 + 代码 + `[运行实例] [复制]`。
- 运行能力：
  - HTML/CSS/JS：`iframe srcdoc` + `sandbox="allow-scripts"` 实时预览（w3schools 式双栏）。
  - JS/TS：Monaco + Web Worker 执行 + 控制台 + 2s 超时终止。
  - 其他语言：只读编辑/复制（不在浏览器执行）。
- `/playground/`：双栏（编辑器 + 预览/控制台）、语言切换、示例模板、重置、URL 参数分享（可选）。
- Monaco 仅 `client:only="react"` 加载；首屏不加载；chunk ≤ 3MB，首屏 JS 预算 ≤ 120KB。

### 6.4 速度与动效

- 静态输出 + Astro 内置预取（`prefetch` 视口策略）；页面切换感知接近即时。
- View Transitions：作为 spike 验证（与 Starlight 的兼容性），通过则用于章节切换；不通过则放弃，不牺牲稳定性。
- `prefers-reduced-motion` 全部降级；代码块/抽屉动效 ≤ 200ms。
- 字体：中文用系统字体（避免数 MB 字体）；代码字体只加载 latin 子集。

### 6.5 可访问性与移动端

- WCAG 2.2 AA：键盘可达、焦点可见、对比度 ≥ 4.5:1、点击目标 ≥ 24px、语义标题层级、skip link。
- 移动端：侧栏抽屉、底部操作条、代码块横向滚动、表格横向滚动、TOC 折叠。
- 表单/按钮/抽屉焦点陷阱与 Esc 关闭。

### 6.6 可选增强（上线后，不阻塞首期）

- 路线可视化图（React Flow / 自绘 SVG，成本 ~1.5 人日）。
- 章节练习与答案折叠（需要内容编辑投入）。
- PWA/离线阅读（Service Worker 预缓存章节）。
- 拼音搜索、快捷键帮助面板。

---

## 7. 项目结构

```text
cs101/
├─ astro.config.mjs           # site/base、starlight、tailwind、mdx、sitemap、prefetch、remark 链接插件
├─ package.json / pnpm-lock.yaml
├─ tsconfig.json
├─ components.json            # shadcn
├─ VERSIONS.md                # 版本台账
├─ public/icon.svg
├─ src/
│  ├─ content.config.ts       # docs schema（title/description/series/order/difficulty/duration/tags/...）
│  ├─ content/docs/**         # 规范化后的 md/mdx
│  ├─ components/
│  │  ├─ ui/…                 # shadcn（方角主题）
│  │  ├─ shell/…              # Header/Sidebar/Breadcrumbs/PageTitle/Pagination/Footer/TOC
│  │  ├─ home/{SearchEntry,ContinueLearning,CategoryGrid,HotTutorials,PortalHero}
│  │  ├─ roadmap/{TechNodes,RouteCard,ProgressBadge}
│  │  ├─ tutorial/{TutorialCards,SeriesProgress,CompleteButton,FavoriteButton,ResourceCard}
│  │  ├─ search/{SearchDialog,ResultList,useSearchIndex}
│  │  ├─ example/{ExampleBox,ExampleRunner}
│  │  ├─ playground/{Playground,MonacoPane,PreviewPane,ConsolePane,runner.worker.ts}
│  │  └─ progress/{useProgress,ProgressBar,ContinueCard}
│  ├─ data/{route-plan.ts,series-meta.ts,computer-science/*.ts}
│  ├─ lib/{utils.ts,content.ts,search-index.ts,tokenize.ts,icons.ts}
│  └─ styles/{global.css,monaco.css}
├─ scripts/
│  ├─ normalize-content.mjs    # 一次性内容规范化
│  ├─ build-search-index.mjs   # section 级索引 + 中文分词
│  ├─ check-links.mjs
│  ├─ versions.mjs
│  └─ report-content.mjs
├─ tests/smoke.spec.ts         # Playwright
└─ .github/workflows/deploy.yml
```

---

## 8. 里程碑

> 人日为单人估算；每阶段有 DoD，不通过不进下一阶段。所有依赖为 latest。

### M0 · 内容资产与基线（0.5 人日）

- [ ] 全目录备份 + `git init` + `rewrite` 分支（当前无 git，必须先做）。
- [ ] 旧站跑通并留基线截图/URL 清单（作为内容对照，不是视觉对照）。
- [ ] 盘点内容资产：335 篇、27 系列、路线表、课程资源数据、异常清单（内联 HTML/脚本数据/孤儿页）。
- [ ] 修复执行环境（§12 文件权限），确认 `node -v`、`pnpm -v`。

**DoD**：备份与 git 就位；内容清单确认；环境可执行命令。

### M1 · 最新依赖矩阵 + 脚手架 + 设计令牌（2 人日）

- [ ] 版本 spike：latest 一次装齐（Astro/Starlight/React/Tailwind/shadcn/Monaco/MiniSearch/Playwright/TS/check），跑最小矩阵并生成 `VERSIONS.md`。
- [ ] Node 最新 LTS + pnpm 最新（corepack + `packageManager`），CI 同步。
- [ ] 脚手架：`astro add starlight react mdx sitemap`、`site` + `base: '/cs101'`、`lang: zh-CN`、`prefetch`。
- [ ] 设计令牌：方角、1px 边框、主色（D6）、字体、深色代码块、链接下划线；shadcn `--radius` 等覆盖。
- [ ] 壳组件骨架：Header / Sidebar / PageTitle / Breadcrumbs / Pagination / Footer / TOC。
- [ ] 3 个占位页 + `/playground/` 占位；`pnpm build` + `preview` 通过；CI 更新（先 preview artifact）。

**DoD**：latest 组合可构建；版本台账生成；令牌与外壳骨架完成；CI 可跑。

### M2 · 信息架构、内容模型与三页样张（2 人日，需确认）

- [ ] 落地 `content.config.ts` schema 与 `src/lib/content.ts`（系列、章节、上一章/下一章、路线统计）。
- [ ] 首页 / 系列页 / 章节页三张高保真样张（w3schools/菜鸟式），含：搜索入口、面包屑、元信息、TOC、代码块、实例框、大翻页、进度/收藏按钮位。
- [ ] 6 组合截图（桌面/移动 × 明暗）评审；D6/D7/D8 冻结。
- [ ] 迁移 10 篇样例内容验证流水线（容器、H1、frontmatter、锚点）。

**DoD**：三页样张经你确认；内容模型可支撑首页/系列/章节/路线/搜索；样例内容渲染正确。

### M3 · 全量内容规范化（3 人日）

- [ ] `normalize-content.mjs` 全量执行；`report-content.mjs` 报告 335/335。
- [ ] 处理 2 个内联数据页 + 4 个组件页 + 裸 HTML 页 + 首页内容。
- [ ] 系列元信息、路线数据、课程资源数据落 `src/data/`。
- [ ] 人工抽查 30 篇；构建零错误；锚点/链接可达。
- [ ] 旧站代码与构建产物归档到 `legacy/`（或删除），`roadmap-archive` 归档不参与构建。

**DoD**：内容规范化完成；构建通过；抽样无丢失；数据资产迁入。

### M4 · 外壳、首页与教程组件（3.5 人日）

- [ ] 全站视觉铺开：面包屑、aside、表格、代码块、翻页、页脚、侧栏/移动端抽屉。
- [ ] 门户式首页：方向入口、分类色块、热门/最新、继续学习位。
- [ ] 教程总览（27 系列卡片 + 筛选）；系列页（章节清单 + 统计 + 开始/继续）。
- [ ] 路线页（阶段分组 + 完成度）；计算机科学两页卡片化。
- [ ] 图标映射（MDI → lucide）；删除全部旧组件语义。

**DoD**：页面功能齐全；视觉规范逐项通过；移动端 + 暗色验收。

### M5 · 体验层：搜索 / 进度 / 实例 / Monaco（4 人日）

- [ ] 搜索索引构建（section 级 + `Intl.Segmenter` 中文分词）与 ⌘K 面板（键盘导航、最近搜索、锚点直达）；Pagefind A/B 后定稿。
- [ ] 进度/收藏/最近阅读（localStorage）+ 首页「继续学习」+ 系列/路线完成度。
- [ ] 代码复制、`ExampleBox` + `[运行实例]`（iframe 预览 / Worker 执行）、`/playground/` 双栏。
- [ ] 接入 20–40 个代表性实例（HTML/CSS/JS 优先）。
- [ ] 预取 + View Transitions spike（通过则启用）；性能实测。

**DoD**：搜索达标；进度持久化；实例可运行；首屏 JS/体积达标。

### M6 · 质量门禁与上线（2 人日）

- [ ] `astro check` + `tsc`、`build`、链接检查、Playwright 冒烟全绿（首页→路线→系列→章节→搜索→进度→实例→演练场→暗色）。
- [ ] Lighthouse：章节页 Perf ≥ 90、A11y ≥ 95、CLS ≤ 0.05；Monaco/实例页单独预算。
- [ ] SEO：sitemap、canonical、OG、404；旧 URL 兼容跳转页（可选，0.5 人日内）。
- [ ] a11y 抽查（键盘、焦点、对比度、reduced motion）；移动端真机/模拟器走查。
- [ ] 切换 Pages 工作流到新构建；旧版 tag 可回滚；清理旧依赖与产物。

**DoD**：生产 URL 全量可访问；CI 绿灯；回滚方案演练过。

### 时间汇总

| 阶段 | 人日 | 可并行 |
| --- | --- | --- |
| M0 内容资产与基线 | 0.5 | — |
| M1 最新依赖 + 脚手架 + 令牌 | 2.0 | — |
| M2 IA/内容模型/三页样张 | 2.0 | 需你确认（阻塞 M4 全量） |
| M3 内容规范化 | 3.0 | 与 M2 部分并行（依赖 M1/M2 schema） |
| M4 外壳与教程组件 | 3.5 | 依赖 M2 |
| M5 体验层 | 4.0 | 依赖 M1/M3/M4 |
| M6 门禁上线 | 2.0 | 依赖全部 |
| **合计** | **17.0 人日** | 3–4 人并行 → **9–11 个日历日** |

---

## 9. 需要你拍板的 8 个决策

| # | 决策 | 建议 |
| --- | --- | --- |
| D1 | 内容：A 全量保留并规范化（推荐）；B 精选重写；C 只保留部分系列 | **A** |
| D2 | 搜索：A 自建 ⌘K + 中文分词（推荐，体验最好）；B 先用 Pagefind latest | **A**（Pagefind 作为 A/B 基线） |
| D3 | 进度/收藏：A 本地 localStorage（推荐，无账号）；B 不做；C 后续接账号 | **A** |
| D4 | 实例运行范围：A 演练场 + 章节「运行实例」（推荐，w3schools 式）；B 仅演练场 | **A** |
| D5 | 首页形态：A 仪表盘（继续学习 + 方向入口 + 分类）（推荐）；B 纯门户分类块 | **A** |
| D6 | 视觉主色：A 绿 `#04AA6D`；B 蓝绿 `#2B7BB9`；C 品牌蓝 `#2563EB` | 先出 A/B 两版色板样张再定 |
| D7 | 右侧「本页目录」：A 默认隐藏（推荐）；B 宽屏保留 | **A** |
| D8 | 旧 URL 兼容：A 生成跳转页（推荐，低成本）；B 完全不管 | **A** |

---

## 10. 验收标准（DoD）

**体验**

- 五大支柱指标达成（§1.2 表格）；「继续学习」在刷新/跳转后仍正确。
- 章节页 LCP ≤ 2.0s、CLS ≤ 0.05、INP ≤ 200ms；首屏 JS ≤ 120KB gzip；Monaco 不进入首屏。
- 20 条真实中文查询 Top-3 命中 ≥ 80%；⌘K 全键盘可用。
- 实例抽样 20 例全部可运行，iframe `sandbox` 限制正确。

**视觉**

- 方角、1px 边框、深色代码块、全边框表格、面包屑、大翻页、aside 色条、链接下划线逐项通过。
- 三张样张确认后，全站 6 组合截图与样张一致；不复用参考站品牌素材。

**内容**

- 335 篇 1:1 规范化，报告计数一致；容器全部转换；锚点/链接 0 404。
- 每篇有 title/description/series/order/duration；系列与路线统计正确。

**工程**

- latest 组合可复现（`--frozen-lockfile`）；`VERSIONS.md` 与实际一致；`pnpm outdated` 清零或例外已批；`pnpm audit` 无高危。
- `astro check` / `tsc` 0 error；无 hydration mismatch；Playwright 冒烟全绿；旧依赖与产物清除。

---

## 11. 风险登记表

| 风险 | 概率 | 影响 | 对策 |
| --- | --- | --- | --- |
| latest 组合互不兼容（Astro↔Starlight↔Tailwind↔shadcn） | 高 | 高 | M1 spike 先跑最小矩阵；lockfile + 台账；例外登记并确认 |
| 推翻 Starlight 默认视觉覆盖成本高 | 高 | 高 | M2 三张样张先确认；覆盖清单化；冻结令牌再铺开 |
| 中文搜索质量不达标 | 中 | 高 | 自建分词索引 + 20 条查询验收；Pagefind 作为 A/B 基线 |
| 范围蔓延（体验功能贪多） | 高 | 中 | 首期只做 §1.2 五支柱；可视化/PWA/练习折叠列 P2 |
| Monaco 体积与 SSR | 中 | 中 | `client:only` + `?worker` + 懒加载；per-page 预算 |
| 进度数据丢失/闪烁 | 中 | 中 | schema 版本化 + 客户端读取 + 迁移函数 |
| iframe 实例安全 | 中 | 中 | `sandbox="allow-scripts"`、不引入外部网络依赖 |
| 旧内容解析异常（内联 HTML/脚本数据） | 中 | 中 | 规范化脚本 + 报告 + 30 篇抽样 + 单独人工处理 |
| 无 git / shell 权限阻塞 | 高 | 高 | M0 备份 + `git init`；先修 ACL |
| 升级引入回归 | 中 | 中 | 升级跑冒烟 + 视觉回归；分组小步；保留回滚 tag |

---

## 12. 执行前提与当前环境阻塞

1. **无版本控制**：仓库目录没有 `.git`。开工前必须备份 + `git init`，否则无法回滚与分阶段评审。
2. **Shell 不可用（阻塞执行）**：`pwsh` 报 `SetNamedSecurityInfoW failed (Win32 5): grantWrite(D:\frontend\cs101)`——DSH 沙箱无法给工作区写入授权，`pnpm`/`node`/`git` 都跑不起来（文件读写工具正常）。需先运行 DSH 的 Windows 沙箱 ACL 诊断脚本修复目录权限（一次授权，脚本会备份并打印回滚命令）。
3. **Node/pnpm**：目标为最新 LTS Node + 最新 pnpm，环境修复后确认并升级。
4. **迁移期旧站保留**：新站验证通过前，Pages 仍指向旧构建，随时可回滚。

---

## 13. 建议执行分工（如用 Agent Teams）

| 工作流 | 写作用域（互斥） | 依赖 |
| --- | --- | --- |
| A 基建 + 外壳 + 依赖 | `astro.config.mjs`、`package.json`、`pnpm-lock.yaml`、`VERSIONS.md`、`scripts/versions.mjs`、`tsconfig.json`、`components.json`、`src/styles/**`、`src/components/shell/**`、`.github/**` | 无（最先启动） |
| B 内容规范化 | `scripts/normalize-content.mjs`、`src/content/**`、`src/data/**` | A 完成脚手架；M2 schema 冻结 |
| C 页面与教学组件 | `src/components/{home,roadmap,tutorial}/**`、`src/lib/content.ts`、`src/lib/icons.ts` | M2 样张确认；数据依赖 B |
| D 体验层（搜索/进度/实例/Monaco） | `src/components/{search,progress,example,playground}/**`、`src/lib/{search-index,tokenize}.ts`、`src/pages/playground.astro` | A 完成；样式依赖 M2 |
| Lead | 样张评审、集成、验收、CI、上线、文档 | 全部 |

顺序：**A → M2 样张确认 → (B ∥ C ∥ D) → Lead 集成**；B/C 以 `src/data/*` 与 content schema 为契约先冻结。

---

## 14. 动工前立刻要做的 6 件事

1. 确认 D1–D8（尤其 D1 内容范围、D2 搜索方案、D5 首页形态、D6 主色）。
2. 备份目录 + `git init`（无历史，必须先做）。
3. 修复 Windows 文件权限，让 `pnpm` 可执行。
4. 旧站跑通并留存基线（内容对照用）。
5. M1 先跑 latest 版本矩阵并生成 `VERSIONS.md`。
6. M2 先交三张风格样张给你确认，再进入全量内容规范化与组件铺开。
