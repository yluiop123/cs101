# 数据结构说明

本站的内容完全由「数据 + 组件」驱动：页面结构写死在组件里，**内容、顺序、状态、名称全部来自数据**。
新增内容时只改数据文件，不动组件。

```
src/data/route-plan.ts   ← 学习路线（技术路线 + 应用领域路线）   ┐
src/data/domains.ts      ← 应用领域目录（8 分类 + 47 方向）      │ 手写数据
src/data/business-systems.ts ← 业务系统分类（14 类 + 71 个系统）  │
src/data/catalog.ts      ← 首页技术分类（9 类 + 卡片跳转）      │
src/data/cards.ts        ← 分组/卡片渲染结构（类型定义）          ┘
src/content/docs/**      ← 教程正文、章节（Astro content collection）
        ↓ 构建期
src/lib/content.ts       ← 扫描 docs 推导系列/章节/章数
        ↓
组件（HomePage / TechNodes / DomainIndex / Sidebar / PageTitle …）
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
| `domain-ai-ml` / `domain-web-saas` … | `/domain/<slug>/` 应用领域页 | 19 |

同一个文件还导出：

| 导出 | 作用 |
| --- | --- |
| `seriesMeta` | slug → 中文名（`react` → `React 教程`）；卡片标题全来自这里 |
| `routeTitles` | 路线 slug → 路线页标题，**顺序即「学习路线」左侧栏顺序** |
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
没有的（目前 28 个）在 `/domain/` 里显示为虚线占位卡。

## 3. 业务系统分类：`src/data/business-systems.ts`

`/business-systems/` 页面用，按业务场景说明各类系统是干什么的：

```ts
interface BizSystem {
  abbr?: string;   // 系统缩写，如 ERP；没有通用缩写时省略
  name: string;    // 中文名
  summary: string; // 核心作用
}

interface BizCategory {
  id: string;      // 页内锚点，左侧栏「业务系统」也用它
  name: string;    // 如「制造与工业系统」
  systems: BizSystem[];
}

const bizCategories: BizCategory[]  // 14 类 / 71 个系统；顺序 = 页面分节与左侧栏顺序
```

页面本身只做「标题 + 系统名 + 核心作用」的逐条罗列，不做跳转；新增/修改条目只改这个文件。

## 4. 首页技术分类：`src/data/catalog.ts`

首页按《编程教程网站技术分类体系》的 9 大分类组织，一个分类 = 一个分节，一张卡片 = 一个方向/技术：

```ts
interface HomeItem {
  title: string;
  href?: string;   // 有 = 点击进入该方向的学习路线/教程；没有 = 规划中（虚线卡）
}

interface HomeCategory {
  id: string;      // 页内锚点 #<id>，左侧栏「技术分类」也用它
  name: string;    // 如「编程语言与运行时」
  items: HomeItem[];
}

const homeCategories: HomeCategory[]   // 顺序 = 首页分节顺序、左侧栏顺序
```

卡片**直接指向路线页或教程页**（如 `Java` → `/tech-stack/java/`、`Git 与版本控制` → `/tutorials/git/`），
所以首页各分节标题旁不再有「学习路线 →」入口。

## 5. 分组 + 卡片的通用结构：`src/data/cards.ts`

首页与应用领域共用 `CardSection.astro`，它的入参就是这两个类型：

```ts
type CardBadgeTone = RouteItemRole | 'route';

interface CardBadge { label: string; tone?: CardBadgeTone }

interface CardItem {
  title: string;
  href?: string;   // 有 = 可点击；没有 = 规划中（虚线卡）
  meta?: string;   // 右侧补充文字（可选），如「4 阶段 · 19 项」
  badges?: CardBadge[];
}

interface CardSectionData {
  id?: string;                       // 锚点
  title: string;
  more?: { href: string; label?: string };  // 标题右侧「学习路线 →」
  items: CardItem[];
}
```

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
| `tier.name` | 板块标题、左侧栏一级项、`#tier-N` 锚点 |
| `option.name` / `option.role` | 选型面板标题与状态徽标 |
| `seriesMeta[slug]` | 所有卡片标题 |
| `routeTitles` | 路线页标题、「学习路线」左侧栏顺序、面包屑末级 |
| `homeCategories` | 首页 9 个技术分类的分节与卡片、左侧栏「技术分类」、卡片跳转目标 |
| `domainCategories` / `domains` | `/domain/` 的 8 个分类与方向卡片、左侧栏分类锚点（无路线的方向显示虚线卡） |
| `routePlan['domain-<slug>']` | 领域详情页板块与左侧栏 |
| `bizCategories` | `/business-systems/` 的 14 个分类分节、系统条目与左侧栏锚点 |
| docs 集合 | 教程页 / 章节页 / 是否上线 / 进度 / 搜索索引 |

## 9. 常见改动怎么改

| 想做的事 | 改哪里 |
| --- | --- |
| 新增一篇教程 | `docs/tutorials/<slug>/index.mdx` + 章节文件；再把 `<slug>` 写进路线里的某个板块 |
| 调整路线顺序 / 增删板块 | `src/data/route-plan.ts` |
| 标记必学、推荐、主流、小众 | `tier.required` / `option.role` / `item.role` |
| 改教程在卡片上的名字 | `seriesMeta` |
| 新增一条技术路线 | `routePlan` + `docs/tech-stack/<slug>.mdx` + `routeTitles` + `TechStackGrid` 分组 |
| 新增一个应用领域 | 只加 `domains.ts` 条目即可显示（虚线占位）；要可点再加 `routePlan['domain-<slug>']` + `docs/domain/<slug>.mdx` |
| 首页加/调整分类或卡片 | `catalog.ts`（卡片 `href` 指向已有路线或教程，没做就留空显示虚线卡） |
| 业务系统加/改条目 | `business-systems.ts`（缩写、中文名、核心作用） |

## 10. 约定与已知重复点

- **slug 是唯一主键**：`seriesMeta` 的键、路线里的项、`docs/tutorials/<slug>/` 目录名必须一致；
  对不上时卡片会显示 slug 原文，链接会 404（`pnpm check:links` 会抓出来）。
- 站内链接一律用 `withBase()` / 相对路径，构建期 `base-links` 集成兜底 `/cs101` 前缀。
- `dist/` 与 `public/search-index.json` 是构建产物，不要手改。
- 已知重复：`TechStackGrid.astro` 里 19 条路线分组是手写的，新增路线需要同时改它和 `routeTitles`；
  `routeTitles` / `routePlan` 里还留着 `desktop`、`mobile` 两条没有页面的预留条目。
- 大前端 49 项里目前只有 9 个教程有正文（html / css / javascript / typescript / tailwind / react / vue / angular / nodejs），其余是虚线占位卡。
