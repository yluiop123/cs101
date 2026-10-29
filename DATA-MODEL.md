# 数据结构说明

本站的内容完全由「数据 + 组件」驱动：页面结构写死在组件里，**内容、顺序、状态、名称全部来自数据**。
新增内容时只改数据文件，不动组件。

```
src/data/route-plan.ts   ← 学习路线（技术路线 + 应用领域路线）   ┐
src/data/domains.ts      ← 应用领域目录（8 分类 + 47 方向）      │ 手写数据
src/data/business-systems.ts ← 业务系统（14 类 + 72 个系统）      │
src/data/catalog.ts      ← 首页技术分类（12 类 + 卡片跳转）     │
src/data/cards.ts        ← 分组/卡片渲染结构（类型定义）          ┘
src/content/docs/**      ← 教程正文、章节（Astro content collection）
        ↓ 构建期
src/lib/content.ts       ← 扫描 docs 推导系列/章节/章数
        ↓
组件（HomePage / TechNodes / DomainIndex / BusinessSystems / CardSection / Card / Sidebar …）
```

## 1. 学习路线：`src/data/route-plan.ts`

一条路线 = 若干「板块（tier）」，一个板块 = 若干「教程（item）」或若干「选型项（option）」。

```ts
/** 状态：必学 / 推荐 / 主流 / 可选 / 小众 */
type RouteItemRole = 'required' | 'recommended' | 'popular' | 'optional' | 'niche';

/** 路线里的一项：默认是教程；kind:'route' 表示跳到另一条学习路线 */
interface RouteItem {
  slug: string;                     // 对应 /tutorials/<slug>/，也是 seriesMeta 的键
  kind?: 'tutorial' | 'route';
  role?: RouteItemRole;             // 单项状态，优先级最高
}

/** 选型组里的一个选项：一个框架 + 它的一整套教程 */
interface RouteChoiceOption {
  name: string;                     // 「React」「Vue」
  role?: RouteItemRole;             // 推荐 / 主流 / 小众 → 标在面板标题上
  items: (string | RouteItem)[];
}

interface RouteTier {
  name: string;                     // 板块名，如「Web 公共基础」
  kind?: 'sequence' | 'choice';     // 顺序学习 | 多选一
  required?: boolean;               // 必学板块 → 板块内每张卡继承「必学」
  note?: string;                    // 选型组的说明文字
  items: (string | RouteItem)[];    // 顺序板块用
  options?: RouteChoiceOption[];    // 选型板块用
}

const routePlan: Record<string, RouteTier[]>   // 键：路线 slug
```

`routePlan` 的键分两类：

| 键 | 页面 | 数量 |
| --- | --- | --- |
| `java` / `frontend` / `sql-database` … | `/tech-stack/<key>/` 技术路线页 | 19 |
| `domain-ai-ml` / `domain-web-saas` … | `/domain/<slug>/` 应用领域页 | 24 |

同一个文件还导出：

| 导出 | 作用 |
| --- | --- |
| `seriesMeta` | slug → 中文名（`react` → `React 教程`）；卡片标题全来自这里 |
| `techRouteGroups` | 技术路线总览页（`/tech-stack/`）的分组与顺序；顺序即「学习路线」左侧栏顺序 |
| 路线页 MDX `title` | 路线页标题、左侧栏「学习路线」名称、总览卡片标题（三者同源，不再单独登记） |
| `roleLabels` | 状态 → 文案（必学 / 推荐 / 主流 / 可选 / 小众） |
| `roleNotes` | 状态 → 图例解释文字 |
| `normalizeItem(item)` | 字符串项转成 `RouteItem` |
| `tierSlugs(tier)` | 板块内所有教程 slug（含选型组各选项） |
| `itemRole(item, fallback)` | 单项状态，自己没标就继承所属板块/选型项 |

### 状态的生效规则

| 写在哪 | 显示在哪 |
| --- | --- |
| `tier.required: true` | 板块标题「必学」+ **板块内每张教程卡**「必学」 |
| `option.role`（选型组） | 该框架**面板标题**「推荐 / 主流 / 小众」（不在卡上重复） |
| `item.role` | 该卡片自己的状态，覆盖上面两种继承 |

图例（`TechNodes`）只渲染**这条路线实际用到的状态**，所以不同路线图例条目不同。

## 2. 应用领域目录：`src/data/domains.ts`

按《编程教程网站技术分类体系》的「领域方向」分成 8 大分类：

```ts
interface DomainCategory { id: string; name: string }          // 8 个分类
interface DomainEntry   { slug: string; name: string; category: string }  // 47 个方向

const domainCategories: DomainCategory[]  // 顺序 = /domain/ 页分组与左侧栏顺序
const domains: DomainEntry[]
```

领域详情页的板块内容不在这个文件里，而在 `routePlan['domain-<slug>']`。
`domains.ts` 只负责「有哪些方向、叫什么、归哪一类」；**有 `routePlan['domain-<slug>']` 的方向才可点**，
没有的（目前 23 个）在 `/domain/` 里显示为虚线占位卡。

## 3. 业务系统：`src/data/business-systems.ts`

`/business-systems/` 是业务系统的目录页，卡片点进去是**这套系统自己的教程**：`/tutorials/business-<slug>/`。

```ts
interface BizSystem {
  slug: string;    // 教程 slug：/tutorials/business-<slug>/
  abbr?: string;   // 系统缩写，如 ERP；没有通用缩写时省略
  name: string;    // 中文名
  summary: string; // 核心作用（由章节组件渲染成「系统概述」正文）
}

interface BizCategory {
  id: string;      // 目录页锚点，左侧栏「业务系统」也用它
  name: string;    // 如「制造与工业系统」
  related: { title: string; href: string }[];  // 这类系统常用的技术栈链接
  systems: BizSystem[];
}

const bizCategories: BizCategory[]  // 14 类 / 72 个系统；顺序 = 目录页分节顺序
```

- 目录页用统一的 `CardSection` 渲染（一分类一节、一行三张卡，类型标记为「教程」）；
- 每个系统一套教程：`docs/tutorials/business-<slug>/`（`index.mdx` + `01-overview.mdx` + `02-tech.mdx`），
  章节正文由 `BizSystemChapter.astro` 按本文件的数据渲染，**系统文字只在这里维护一份**；
- 教程左侧栏只列这套教程自己的章节（系统概述 / 相关技术栈），右侧是章节正文。

## 4. 首页技术分类：`src/data/catalog.ts`

首页按《软件技术知识库·最终分类方案》的 12 个分类组织，一个分类 = 一个分节，一张卡片 = 一个可直接进入的技术路线/专题页面（不把路线内部章节拆到首页）：

```ts
interface HomeItem {
  title: string;
  href?: string;   // 有 = 点击进入该方向的学习路线/教程；没有 = 规划中（虚线卡）
}

interface HomeCategory {
  id: string;      // 页内锚点 #<id>，左侧栏「技术分类」也用它
  name: string;    // 如「后端开发」
  items: HomeItem[];
}

const homeCategories: HomeCategory[]   // 顺序 = 首页分节顺序、左侧栏顺序
```

卡片**直接指向路线页或教程页**（如 `Java` → `/tech-stack/java/`、`Git 与版本控制` → `/tutorials/git/`），
所以首页各分节标题旁不再有「学习路线 →」入口。

## 5. 分组 + 卡片的通用结构：`src/data/cards.ts`

**五种页面（首页、应用领域、业务系统、技术路线、领域详情）共用同一套卡片渲染**：
`CardSection.astro` 负责分节（标题 + 可选标记/说明 + 网格），`Card.astro` 负责一张卡片。
数据不同、组件只有一份，所以改动只需改数据文件。

```ts
type CardKind = 'tutorial' | 'route';         // 卡片类型：教程 / 技术路线
type CardBadgeTone = RouteItemRole | 'choice';// 状态徽标色调 + 「多选一」分节标记

interface CardBadge { label: string; tone?: CardBadgeTone }

interface CardItem {
  title: string;
  href?: string;   // 有 = 可点击；没有 = 规划中（虚线卡）
  kind?: CardKind; // 省略时按 href 推断（/tutorials/ 为教程，其余为路线）
  meta?: string;   // 右侧补充文字（如「4 阶段 · 12 项」）
  badges?: CardBadge[];
}

// 二级分组：一个选项 = 一组卡片（「多选一」分节专用）
interface CardGroup {
  title: string;         // 如 React / Vue / Angular
  role?: RouteItemRole;  // 推荐 / 主流 / 小众，决定面板描边与徽标
  items: CardItem[];
}

interface CardSectionData {
  id?: string;                              // 锚点（路线页为 #tier-N）
  title: string;
  more?: { href: string; label?: string };  // 标题右侧「学习路线 →」
  tag?: CardBadge;                          // 标题旁标记：「必学」「5 选 1」
  note?: string;                            // 分节说明（选型规则等）
  items?: CardItem[];                       // 平铺网格（与 groups 二选一）
  groups?: CardGroup[];                     // 二级「多选一」面板（与 items 二选一）
  showKind?: boolean;   // 是否按 href 推断类型标记；路线页设 false，只给显式 kind 的卡片标
  density?: 'default' | 'compact';  // compact = 路线页/技术栈总览（卡片更紧凑）
}
```

渲染规则：

- `items` → 一行三张卡（响应式）：标题 + 类型标记（图标+文字，不用胶囊，避免和状态徽标混淆）+ 状态徽标 + `meta`；
- `groups` → 外层虚线框分组，每个选项一个面板（标题 + 状态徽标 + 竖排卡片），
  即大前端 → 「框架选型」这种**多选一**版式；面板锚点为 `#<分节 id>-<序号>`；
- 没有 `href` 的卡片渲染为虚线占位卡（教程还没写）；
- 卡片标题单行省略，完整名称放在 `title` 提示里。

## 6. 教程与章节：`src/content/docs/**`

一个目录 = 一个 URL。`docsSchema` 上额外扩展了这些字段（`src/content.config.ts`）：

```ts
series?, difficulty?: 'beginner'|'intermediate'|'advanced', duration?: number,
tags?: string[], prerequisites?: string[], estMinutes?: number
```

实际用到的 frontmatter：

| 页面 | 路径 | 关键字段 |
| --- | --- | --- |
| 教程系列首页 | `docs/tutorials/<slug>/index.mdx` | `title`、`description`、`sidebar.order: 0`、`sidebar.hidden: true`；正文用 `<SeriesChapters series="<slug>" />` |
| 教程章节 | `docs/tutorials/<slug>/01-xxx.md` | `title`、`description?`、`duration?`、`sidebar.order`（章节顺序） |
| 技术路线页 | `docs/tech-stack/<route-slug>.mdx` | `title`、`description`；正文只有 `<TechNodes page="<route-slug>" />` |
| 应用领域页 | `docs/domain/<slug>.mdx` | 同上，`page="domain-<slug>"` |
| 计算机科学 | `docs/computer-science/**` | 由 `src/data/computer-science/{zh,ossu}.json` 生成 |

构建期 `src/lib/content.ts` 扫描 docs 得到：

```ts
interface ChapterInfo { id: string; title: string; order: number; duration?: number; description?: string }
interface SeriesInfo  { slug: string; title: string; description?: string; chapters: ChapterInfo[]; totalDuration: number }
```

`getSeries()` 决定：教程有没有上线（没有章节 → 卡片变虚线、不可点）、
左侧栏章节列表、继续学习卡。**写完章节页面，卡片自动点亮，不需要额外登记。**

## 7. 运行时状态（浏览器本地）

`src/lib/progress.ts`，localStorage 键 `cs101:progress:v1`：

```ts
interface ProgressState {
  completed: Record<string, number>;              // 章节 id → 完成时间戳
  favorites: string[];
  recent: { id: string; at: number }[];
}
```

搜索索引由 `scripts/build-search-index.mjs` 构建期生成 `public/search-index.json`：

```ts
{ generatedAt: string, records: { u: url, t: 页面标题, s: 系列, h: 小节标题, a: 小节锚点, x: 正文片段 }[] }
```

## 8. 数据 → 界面 对照表

| 数据 | 决定什么 |
| --- | --- |
| `routePlan[key]` | 路线页板块顺序 / 卡片 / 图例；tech-stack 索引卡与领域索引卡的「N 阶段 · M 项」 |
| `tier.name` / `tier.required` / `tier.kind` | 分节标题、「必学」标记、「N 选 1」标记；左侧栏一级项与 `#tier-N` 锚点 |
| `option.name` / `option.role` | 选型面板标题与状态徽标（渲染成 `groups`） |
| `seriesMeta[slug]` | 教程卡片标题 |
| `techRouteGroups` | 全部技术路线页的分组与「学习路线」左侧栏顺序；路线标题取各自 MDX 的 `title` |
| `homeCategories` | 首页 12 个技术分类的分节与卡片、左侧栏「技术分类」、卡片跳转目标 |
| `domainCategories` / `domains` | `/domain/` 的 8 个分类与方向卡片、左侧栏分类锚点（无路线的方向显示虚线卡） |
| `routePlan['domain-<slug>']` | 领域详情页板块与左侧栏 |
| `bizCategories` | `/business-systems/` 的 14 个分类分节与系统卡片（链接到业务系统教程对应章节锚点） |
| docs 集合 | 教程页 / 章节页 / 是否上线 / 进度 / 搜索索引 |

## 9. 常见改动怎么改

| 想做的事 | 改哪里 |
| --- | --- |
| 新增一篇教程 | `docs/tutorials/<slug>/index.mdx` + 章节文件；再把 `<slug>` 写进路线里的某个板块 |
| 调整路线顺序 / 增删板块 | `src/data/route-plan.ts` |
| 标记必学、推荐、主流、小众 | `tier.required` / `option.role` / `item.role` |
| 改教程在卡片上的名字 | `seriesMeta` |
| 新增一条技术路线 | `routePlan` + `docs/tech-stack/<slug>.mdx`（标题即卡片/左侧栏名称）+ 把 slug 加进 `techRouteGroups` 的某个分组 |
| 新增一个应用领域 | 只加 `domains.ts` 条目即可显示（虚线占位）；要可点再加 `routePlan['domain-<slug>']` + `docs/domain/<slug>.mdx` |
| 首页加/调整分类或卡片 | `catalog.ts`（卡片 `href` 指向已有路线或教程，没做就留空显示虚线卡） |
| 业务系统加/改条目 | `business-systems.ts`（缩写、中文名、核心作用） |

## 10. 约定与已知重复点

- **slug 是唯一主键**：`seriesMeta` 的键、路线里的项、`docs/tutorials/<slug>/` 目录名必须一致；
  对不上时卡片会显示 slug 原文，链接会 404（`pnpm check:links` 会抓出来）。
- 站内链接一律用 `withBase()` / 相对路径，构建期 `base-links` 集成兜底 `/cs101` 前缀。
- `dist/` 与 `public/search-index.json` 是构建产物，不要手改。
- **卡片只有一套实现**：`CardSection.astro`（分节）+ `Card.astro`（一张卡）覆盖首页、应用领域、业务系统、
  技术路线、领域详情；路线页的「多选一」由 `CardSectionData.groups` 表达，不再有单独的路线卡片组件。
- **技术路线只有一份登记**：`techRouteGroups` 决定分组与顺序，路线名称只写在 `docs/tech-stack/<slug>.mdx`
  的 `title` 里，总览页、左侧栏、面包屑都从这里取，新增路线不需要再改组件。
- 大前端 49 项里目前只有 9 个教程有正文（html / css / javascript / typescript / tailwind / react / vue / angular / nodejs），其余是虚线占位卡。
