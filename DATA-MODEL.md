# 数据结构说明

本站只有一种内容模型：**一切都视为路线（Route）**。
「首页 / 应用领域 / 业务系统 / 全部技术路线」四个目录页，和点进去的路线页，用的是同一个
`RouteTier[]`；**一张卡片永远是一个 `RouteItem`**，点进去的目标由它的 `kind` 决定。
所以新增内容只改数据，不动组件。

```
src/data/
  model/route-model.ts        ← 路线模型：类型 + 纯函数，不含任何站点数据
  model/cards.ts              ← 卡片/分节结构 + RouteTier[] → CardSectionData[]（tierSections）
  entries/                    ← 入口页配置：首页 / 应用领域 / 业务系统
    index.ts                  ←   汇总导出（页面只从这里取数据）
    home.ts                   ←   首页目录（12 个分类）
    domains.ts                ←   应用领域目录（8 个分类 / 47 个方向）
    business-systems.ts       ←   业务系统目录（14 类 / 72 个系统）+ 系统说明
  routes/                     ← 路线页配置：java / go … 与领域路线
    index.ts                  ←   汇总导出：routePlan / techCatalog / techRouteOrder
    tech.ts                   ←   19 条技术路线的板块 + 全部技术路线目录
    domain.ts                 ←   24 条领域路线的板块
  tutorials/series-meta.ts    ← 教程元信息：slug → 中文名（内容本体不在这里）
  computer-science/           ← 计算机科学课程数据（zh.json / ossu.json）
src/content/docs/tutorials/<slug>/  ← 教程正文：一套教程一个文件夹，`01-xxx.md` 是章节
src/content/docs/business-systems/index.mdx  ← 业务系统总览页（/business-systems/）
src/content/docs/business-systems/<slug>/    ← 业务系统教程：与普通教程分开存放，URL 为 /business-systems/<slug>/
        ↓ 构建期
src/lib/content.ts            ← 扫描 docs 得到系列 / 章节 / 是否上线
src/lib/entry-links.ts        ← 卡片上的教程入口：直达第一章
        ↓
components/shared/RouteSections.astro → CardSection.astro → Card.astro
```

原则：**模型（类型 + 函数）、入口数据、路线数据、教程内容分开**。`model/*.ts` 只放逻辑；
入口页配置在 `entries/**`，路线页配置在 `routes/**`，教程名在 `tutorials/**`，教程正文在
`content/docs/tutorials/**` 与 `content/docs/business-systems/**`——加内容只改对应的那一类，不动组件。

## 1. 模型：一个条目 = 一条路线

```ts
/** 路线类型：决定点击后去哪、卡片上标「教程」还是「路线」 */
type RouteKind = 'tutorial' | 'tech' | 'domain' | 'business' | 'page';

interface RouteItem {
  slug: string;          // 主键：教程 slug / 路线 key（如 domain-ai-ml）/ 业务系统 slug
  kind?: RouteKind;      // 省略 = tutorial
  role?: RouteItemRole;  // 必学 / 推荐 / 主流 / 可选 / 小众
  title?: string;        // 卡片标题；省略时用 seriesMeta[slug]，再退化到 slug
  planned?: boolean;     // 规划中：虚线卡、不可点
  summary?: string;      // 一句话说明（业务系统：核心作用）
}

/** 一条路线 = 若干分节（板块） */
interface RouteTier {
  id?: string;                 // 目录页的锚点（路线页用 #tier-N）
  name: string;                // 分节标题
  kind?: 'sequence' | 'choice';// 顺序学习 | 多选一
  required?: boolean;          // 必学：标题旁标「必学」，分节内卡片继承该状态
  note?: string;               // 说明文字（选型规则等）
  related?: { title: string; href: string }[];  // 这组路线共用的相关入口（业务系统的常用技术栈）
  items: (string | RouteItem)[];
  options?: RouteChoiceOption[]; // choice 专用：每个选项 = 一个框架 + 它的一整套教程
}
```

`kind` 决定入口地址（`itemHref()`）与卡片标记（`itemCardKind()`）：

| kind | 入口 | 卡片标记 |
| --- | --- | --- |
| `tutorial`（默认） | `/tutorials/<slug>/` | 教程 |
| `tech` | `/tech-stack/<slug>/` | 路线 |
| `domain` | `/domain/<slug 去掉 domain- 前缀>/` | 路线 |
| `business` | `/business-systems/<slug>/` | 教程 |
| `page` | `/<slug>/` | 路线 |

- `planned: true` → 没有入口，渲染虚线占位卡（应用领域目录里没有对应路线的方向就是这样标的）；
- 标题：卡片上的标题由 `item.title` 提供；路线页里只写 slug 的教程，由页面用 `seriesMeta` 补；
- 状态继承：`item.role` → 所属 `tier.required` → 所属 `option.role`。

## 2. 路线数据：`src/data/routes/`

```ts
// routes/index.ts —— 数据汇总入口
const routePlan: Record<string, RouteTier[]>; // 键：路线 key
```

| 文件 | 内容 |
| --- | --- |
| `routes/tech.ts` | `techRoutes`（19 条技术路线）+ `techCatalog`（全部技术路线目录，4 个分组） |
| `routes/domain.ts` | `domainRoutes`（24 条领域路线，键为 `domain-<slug>`） |
| `routes/index.ts` | 汇总导出：`routePlan`、`techCatalog`、`techRouteOrder` |
| `tutorials/series-meta.ts` | `seriesMeta`：教程 slug → 中文名（教程元信息，不在 routes 里） |

| 键 | 页面 | 数量 |
| --- | --- | --- |
| `java` / `frontend` / `sql-database` … | `/tech-stack/<key>/` | 19 条技术路线 |
| `domain-ai-ml` / `domain-web-saas` … | `/domain/<slug>/` | 24 条领域路线 |

共 43 条路线 / 175 个分节。其中只有大前端路线里的「框架选型」是 `kind: 'choice'`：

```ts
{ name: '框架选型', kind: 'choice', note: '五个框架任选其一即可…',
  items: [],
  options: [
    { name: 'React', role: 'recommended', items: ['react', 'react-router', …] },
    …
  ] }
```

模型层（`model/route-model.ts`）提供的纯函数：

| 导出 | 作用 |
| --- | --- |
| `roleLabels` / `roleNotes` | 状态文案与图例解释 |
| `itemTitle` / `itemHref` / `itemCardKind` | 卡片标题、入口、类型标记 |
| `tierSlugs` / `itemRole` / `normalizeItem` | 摊平、状态继承、字符串项归一 |

## 3. 四个目录页 = 四条路线

四个目录页的数据**结构完全一样**，都是一个 `RouteTier[]`：

| 页面 | 数据 | 规模 | 渲染开关 |
| --- | --- | --- | --- |
| 首页 `/` | `homeCatalog`（entries/home.ts） | 12 分节 / 85 条（31 可点 + 54 规划） | `markKind="auto"`（教程/路线混排） |
| 应用领域 `/domain/` | `domainCatalog`（entries/domains.ts） | 8 分节 / 47 条（24 有路线，23 虚线） | 默认 |
| 业务系统 `/business-systems/` | `businessCatalog`（entries/business-systems.ts） | 14 分节 / 72 条 | 默认 |
| 全部技术路线 `/tech-stack/` | `techCatalog`（routes/tech.ts） | 4 分节 / 19 条 | `markKind="none"` + `columns={2}` + `metaOf`（规模提示） |

也就是说：**首页就是一条路线（12 个分节），业务系统也是一条路线（14 个分节）**，
和「Java 技术路线（4 个分节）」没有任何结构差别。左侧栏的分节锚点也直接读这些分节。

## 4. 业务系统：也是 `RouteTier[]`

业务系统没有自己的类型，**直接写成一个路线**：

```ts
export const businessCatalog: RouteTier[] = [
  {
    id: 'erp',
    name: '通用企业管理系统',
    related: [                                    // 分节级：这类系统常用的技术栈
      { title: 'Java 技术路线', href: '/tech-stack/java/' },
      { title: '数据库技术路线', href: '/tech-stack/sql-database/' },
    ],
    items: [
      {
        slug: 'erp',
        kind: 'business',
        title: 'ERP 企业资源计划',                 // 卡片标题 = 缩写 + 中文名
        summary: '把财务、采购、库存、生产、人力等核心资源…',  // 系统概述正文
      },
      // …其余 71 个系统
    ],
  },
  // …其余 13 个分类
];
```

- 14 个分节 / 72 条，没有 `BizSystem`、`BizCategory` 这类目录模型；
- 系统说明（`summary`）挂在条目上，分类共用的技术栈入口（`related`）挂在分节上；
- 教程章节正文由 `BizSystemChapter.astro` 调 `findBusinessSystem(slug)` 读取这两处数据渲染，
  系统文字只维护这一份；
- 左侧栏、目录卡片、卡片标题都直接读 `businessCatalog`，和别的路线完全一样。

## 5. 渲染管线

```ts
tierSections(tiers: RouteTier[], options?) : CardSectionData[]
```

一个分节 → 一个 `CardSectionData`（标题 + 可选标记/说明 + `items` 或 `groups`），
再由 `CardSection.astro` 渲染分节、`Card.astro` 渲染一张卡。

| option | 作用 |
| --- | --- |
| `markKind` | `explicit`（默认，只有写了 kind 的条目才标）/ `auto`（没写 kind 时按链接推断，首页用）/ `none`（一律不标，全部技术路线页用） |
| `density` | `compact` = 路线页 / 总览页的紧凑卡片 |
| `columns` | 一行几张卡（宽屏），默认 3；标题长的总览页用 2 |
| `metaOf` | 给指向技术路线的卡片加「N 阶段 · M 项」提示（文案由调用方提供） |
| `titleOf` | 覆盖卡片标题（技术路线总览页从 MDX `title` 取） |
| `hrefOf` | 覆盖卡片入口（目录页把教程卡片指向第一章，见 `lib/entry-links.ts`） |
| `available` | 条目是否已上线（路线页用它把没写正文的教程显示成虚线卡） |
| `idOf` | 分节锚点规则（默认 `tier-<序号>`，目录页直接用自己的 `tier.id`） |

## 6. 教程与章节：`src/content/docs/**`

一个目录 = 一个 URL。`docsSchema` 额外扩展了这些字段（`src/content.config.ts`）：

```ts
series?, difficulty?: 'beginner'|'intermediate'|'advanced', duration?: number,
tags?: string[], prerequisites?: string[], estMinutes?: number
```

| 页面 | 路径 | 关键字段 |
| --- | --- | --- |
| 教程系列首页 | `docs/tutorials/<slug>/index.mdx` | `title`、`description`、`sidebar.order: 0`、`sidebar.hidden: true`；正文用 `<SeriesChapters series="<slug>" />` |
| 教程章节 | `docs/tutorials/<slug>/01-xxx.md` | `title`、`description?`、`duration?`、`sidebar.order`、`tableOfContents: true`（有 `##` 小节时右侧显示「本页内容」目录） |
| 技术路线页 | `docs/tech-stack/<route-slug>.mdx` | `title`（卡片与左侧栏都用它）、`description`；正文只有 `<TechNodes page="<route-slug>" />` |
| 应用领域页 | `docs/domain/<slug>.mdx` | 同上，`page="domain-<slug>"` |
| 业务系统教程 | `docs/business-systems/<slug>/` | 2 章；与普通教程分开存放；正文由 `BizSystemChapter.astro` 按数据渲染 |
| 计算机科学 | `docs/computer-science/**` | 由 `src/data/computer-science/{zh,ossu}.json` 生成 |

业务系统教程的系列 slug 是 `business-<目录名>`（如 `business-erp`），页面地址是
`/business-systems/<目录名>/`；`getSeries()` 同时扫描 `tutorials/` 与 `business-systems/` 两个目录，
面包屑、左侧栏、上一章/下一章、完成按钮都由它统一推导。

构建期 `src/lib/content.ts` 扫描 docs 得到：

```ts
interface ChapterInfo { id: string; title: string; order: number; duration?: number; description?: string }
interface SeriesInfo  { slug: string; href: string; title: string; description?: string; chapters: ChapterInfo[]; totalDuration: number }
```

`getSeries()` 决定：教程有没有上线（没有章节 → 卡片变虚线）、左侧栏章节列表、继续学习卡。
**写完章节页面，卡片自动点亮，不需要额外登记。**

教程的点击入口在 `src/lib/entry-links.ts`：目录页/路线页上的教程卡片直接指向**第一章**，
不落在教程首页；教程首页仍可从面包屑、左侧栏标题、以及章节页的翻页回到（首页上有「开始学习」按钮）。

## 7. 运行时状态

`src/lib/progress.ts`，localStorage 键 `cs101:progress:v1`：

```ts
interface ProgressState {
  completed: Record<string, number>;   // 章节 id → 完成时间戳
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
| `routePlan[key]` | 路线页的分节与卡片；领域索引卡的「是否虚线」 |
| `tier.name` / `tier.required` / `tier.kind` | 分节标题、「必学」「N 选 1」标记；左侧栏分节项与锚点 |
| `option.name` / `option.role` | 选型面板标题与状态徽标 |
| `item.*` | 卡片标题、入口、类型标记、状态徽标 |
| `seriesMeta[slug]` | 教程卡片的默认标题 |
| `lib/entry-links.ts` | 教程卡片的跳转目标（第一章） |
| `homeCatalog` / `domainCatalog` / `businessCatalog` / `techCatalog` | 四个目录页的分节、卡片与左侧栏（业务系统的 `summary` / `related` 也在这里） |
| docs 集合 | 教程页 / 章节页 / 是否上线 / 进度 / 搜索索引 |

## 9. 常见改动怎么改

| 想做的事 | 改哪里 |
| --- | --- |
| 新增一篇教程 | `docs/tutorials/<slug>/index.mdx` + 章节文件（有 `##` 小节的加 `tableOfContents: true`）；再把 `<slug>` 写进路线里的某个分节（卡片会自动直达第一章） |
| 调整路线顺序 / 增删分节 | `src/data/routes/tech.ts` / `routes/domain.ts`（数据文件） |
| 标记必学、推荐、主流、小众 | `tier.required` / `option.role` / `item.role` |
| 改教程在卡片上的名字 | `src/data/tutorials/series-meta.ts` 的 `seriesMeta`（跨页面统一）或条目的 `title`（只覆盖某个目录页） |
| 新增一条技术路线 | `routes/tech.ts` 的 `techRoutes` + `docs/tech-stack/<slug>.mdx`（标题即卡片/左侧栏名称）+ 把 slug 加进 `techCatalog` 的某个分节 |
| 新增一个应用领域 | 在 `entries/domains.ts` 的 `domainCatalog` 对应分类加 `{ slug: 'domain-<slug>', kind: 'domain', title }`；要可点再补 `routes/domain.ts` 的 `domainRoutes['domain-<slug>']` + `docs/domain/<slug>.mdx` |
| 首页加/调整分类或卡片 | `src/data/entries/home.ts`（`planned: true` = 虚线占位） |
| 业务系统加/改条目 | `src/data/entries/business-systems.ts` 的 `businessCatalog`（分节里加 `{ slug, kind: 'business', title, summary }`） |

## 10. 约定与已知点

- **slug 是唯一主键**：`seriesMeta` 的键、路线里的条目、`docs/tutorials/<slug>/` 目录名必须一致；
  对不上时卡片会显示 slug 原文，链接会 404（`pnpm check:links` 会抓出来）。
  （业务系统例外：条目 slug 是系统名 `erp`，目录是 `docs/business-systems/erp/`，
  系列 slug 为 `business-erp` 以避免与普通教程重名。）
- 站内链接一律用 `withBase()` / 相对路径，构建期 `base-links` 集成兜底 `/cs101` 前缀。
- `dist/` 与 `public/search-index.json` 是构建产物，不要手改。
- **卡片只有一套实现**：`RouteSections → CardSection → Card`，目录页与路线页共用，「多选一」由
  `RouteTier.options` 表达。
- **目录即路线**：四个目录页的数据都是 `RouteTier[]`，新增目录页只需再写一个 `RouteTier[]`；
  业务系统也没有 `BizSystem` / `BizCategory` 之类的独立模型，就是 `businessCatalog` 这一条路线。
- **数据分三类放**：入口页（`src/data/entries/**`）、路线页（`src/data/routes/**`）、
  教程元信息（`src/data/tutorials/**`）；模型与纯函数在 `src/data/model/**`，都不含站点数据。
- **教程内容一套一个文件夹**：普通教程在 `src/content/docs/tutorials/<slug>/`，
  业务系统教程在 `src/content/docs/business-systems/<slug>/`；入口链接由 `lib/entry-links.ts` 统一指向第一章。
- 技术路线名称只写在 `docs/tech-stack/<slug>.mdx` 的 `title` 里（总览页、左侧栏、面包屑同源）。
