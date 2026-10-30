# 数据结构说明

本站只有一种内容模型：**一切都视为路线（Route）**。
「首页 / 应用领域 / 业务系统 / 全部技术路线」四个目录页、所有技术路线 / 领域路线 / 计算机科学课程页，
用的都是同一个 `RouteTier[]`；**一张卡片永远是一个 `RouteItem`**，卡片类型由 `kind` 决定、入口由 `href` 决定。
新增内容只改数据，不动组件。

```
src/data/
  model/route-model.ts        ← 路线模型：类型 + 纯函数，不含任何站点数据
  entries/                    ← 入口页配置：首页 / 应用领域 / 业务系统
    index.ts                  ←   汇总导出（页面只从这里取数据）
    home.ts                   ←   首页目录（12 个分类）
    domains.ts                ←   应用领域目录（8 个分类 / 47 个方向）
    business-systems.ts       ←   业务系统目录（14 类 / 72 个系统，条目只写教程 id）
  routes/                     ← 技术路线相关配置
    index.ts                  ←   导出 techCatalog / techRouteOrder
    links.ts                  ←   路线条目构造器（techRoute / domainRoute / pageRoute）
    tech-catalog.ts           ←   全部技术路线目录（4 个分组、顺序）
  tutorials/series-meta.ts    ← 教程元信息：id → 中文名（内容本体不在这里）
src/content/docs/
  tech-stack/<slug>.mdx       ← 技术路线页：分节数据写在本文件的 `export const tiers` 里
  domain/<slug>.mdx           ← 应用领域页：同上
  computer-science/{zh,en}/index.mdx  ← 计算机科学课程：数据同样直接写在页面里
  tutorials/<id>/             ← 教程正文：一套教程一个文件夹，`01-xxx.md` 是章节
  business-systems/<id>/      ← 业务系统教程：与普通教程分开存放，URL 为 /business-systems/<id>/
        ↓ 构建期
src/lib/content.ts            ← 扫描 docs 得到系列 / 章节 / 是否上线
src/lib/entry-links.ts        ← 卡片上的教程入口：直达第一章
        ↓
components/shared/RouteSections.astro → Card.astro（ReferenceDrawer 由它按需挂载）
```

原则：**路线数据跟着页面走**。每条路线（技术路线 / 领域路线 / 计算机科学课程）的分节数据写在各自页面的
`export const tiers` 里；`src/data/` 只放四个目录页的面板数据、路线顺序与教程元信息。

## 1. 模型：一个条目 = 一张卡片

```ts
/** 状态标签：卡片 / 分组 / 分节共用一个字段 */
type RouteTag = 'required' | 'recommended' | 'popular' | 'optional' | 'niche' | 'planned';
//               必学          推荐            主流          可选            小众          规划中

/** 卡片类型只有三种：教程 / 路线 / 外部引用 */
type RouteKind = 'tutorial' | 'route' | 'external';

interface RouteItem {
  id: string;            // 主键：教程 id / 路线 key（如 domain-ai-ml）/ 业务系统 id
  kind?: RouteKind;      // 省略 = tutorial；只决定卡片上的类型标记
  href?: string;         // 站内入口：路线类必填；教程省略时默认 /tutorials/<id>/
  tag?: RouteTag;        // 状态标签；省略时继承所属分组 / 分节的 tag
  title?: string;        // 卡片标题覆盖；省略时用 seriesMeta[id]，再退化到教程页 title / id
  external?: ExternalRef;// kind: 'external' 必填：右侧抽屉里的简介与学习资源
}

/** 一条路线 = 若干分节（板块）：两级直接列 items，三级先分 groups */
interface RouteTier {
  id?: string;                 // 目录页的锚点（路线页用 #tier-N）
  name?: string;               // 分节标题；省略时用 tag 文案（按状态分组的路线页）
  tag?: RouteTag;              // 分节状态：标题旁徽标，分节内卡片继承
  items: (string | RouteItem)[];   // 两级：直接列卡片
  groups?: RouteGroup[];           // 三级：先分组（必然是分支，显示成「N 选 1」面板）
}

/** 三级结构：分节下的一个选项（如框架选型 → React / Vue / …） */
interface RouteGroup {
  name: string;
  tag?: RouteTag;              // 推荐 / 主流 / 小众…（面板描边与徽标）
  items: (string | RouteItem)[];
}
```

要点：

- **主键只有 `id`**：`seriesMeta` 的键、路线里的条目、`docs/tutorials/<id>/` 目录名必须一致；
  对不上时卡片会显示 id 原文、链接会 404（`pnpm check:links` 会抓出来）。
  业务系统例外：条目 id 是 `erp`，目录是 `docs/business-systems/erp/`，系列 id 为 `business-erp`；
  外部引用例外：id 是适配时生成的 `zh-<分类>-<序号>`，只用于抽屉面板定位，不是 URL。
- **`kind` 只有三种**，只决定卡片标记；入口一律写在 `item.href`（路线类必填，教程省略时默认
  `/tutorials/<id>/`）。路线类条目统一用 `src/data/routes/links.ts` 的构造器生成，不手写 URL：

  | kind | 卡片标记 | 入口（`href`） |
  | --- | --- | --- |
  | `tutorial`（默认） | 教程 | 省略时 `/tutorials/<id>/`；业务系统写 `/business-systems/<id>/` |
  | `route` | 路线 | 必填，如 `/tech-stack/java/`、`/domain/gis/`、`/computer-science/zh/` |
  | `external` | 外部引用 | 不填（卡片是按钮，点开右侧抽屉） |

  ```ts
  techRoute('java')                  // { id: 'java', kind: 'route', href: '/tech-stack/java/' }
  domainRoute('gis', 'GIS')          // { id: 'domain-gis', kind: 'route', href: '/domain/gis/', title: 'GIS' }
  pageRoute('computer-science/zh', '计算机科学基础')  // /computer-science/zh/
  ```

- **`tag` 是唯一的状态字段**：必学 / 推荐 / 主流 / 可选 / 小众 / 规划中。
  `tag: 'planned'` 就是以前的 `planned: true`——没有入口、渲染虚线卡、不可点；
  分节 / 分组上的 tag 会被卡片继承（分节标记「必学」时，整节卡片的徽标都是必学）。
- **`title` 是可选的覆盖**：默认标题 = `seriesMeta[id] ?? 教程页 title ?? id`，
  目录页里还没写教程的方向直接写 `title`。
- **层级只有两种**：两级 = `{ name, items }`（绝大多数分节）；
  三级 = `{ name, groups: [{ name, items }] }` —— 有 `groups` 就必然是分支，自动渲染成「N 选 1」面板
  （当前只有大前端路线的「框架选型」用到）。
- **`name` 可省略**：目录页的分类标题要用它；按状态分组的路线页可以只写 `tag`，标题就直接显示 tag 文案。

模型层（`model/route-model.ts`）提供的纯函数：

| 导出 | 作用 |
| --- | --- |
| `tagLabels` / `tagNotes` | 标签文案与图例解释 |
| `normalizeItem` | 字符串项 → `{ id }` |
| `itemTag` | 状态继承：自己的 tag 优先，否则用分组 / 分节的 |
| `itemHref` | 入口：`href` 优先，教程默认 `/tutorials/<id>/`，planned / external 返回 undefined |
| `tierIds` / `tierItems` / `allTierItems` | 摊平分节里的 id / 条目（含三级分组） |

## 2. 路线页：分节数据写在页面里

每条路线的分节数据**就写在它自己的页面 MDX 里**（`export const tiers`），页面直接传给全站唯一的 `<RouteSections>`：

```mdx
---
title: "Java 技术路线"
description: "…"
---

import RouteSections from '@/components/shared/RouteSections.astro';

export const tiers = [
  { name: '入门 · 语言与工具', items: ['java', 'maven', 'gradle'] },
  { name: '进阶 · 核心机制', items: ['collections', 'concurrency', 'rest-api', 'junit'] },
  // …
];

<RouteSections tiers={tiers} />
```

三级（多选一）与状态标签的写法：

```ts
export const tiers = [
  { name: 'Web 公共基础', tag: 'required', items: ['html', 'css', 'javascript'] },
  {
    name: '框架选型',           // 有 groups 就自动出现「5 选 1」面板
    items: [],
    groups: [
      { name: 'React', tag: 'recommended', items: ['react', 'react-router', 'nextjs'] },
      { name: 'Vue', tag: 'popular', items: ['vue', 'vue-router', 'pinia'] },
      { name: 'Svelte', tag: 'niche', items: ['svelte'] },
    ],
  },
];
```

| 位置 | 内容 |
| --- | --- |
| `content/docs/tech-stack/<slug>.mdx` | 单条技术路线的分节（`export const tiers`） |
| `content/docs/domain/<slug>.mdx` | 单条领域路线的分节（同上） |
| `src/data/routes/tech-catalog.ts` | 「全部技术路线」目录：19 条路线的分组与顺序 |
| `tutorials/series-meta.ts` | `seriesMeta`：教程 id → 中文名（教程元信息，不在 routes 里） |

| 页面 | 数量 |
| --- | --- |
| `/tech-stack/<key>/` | 19 条技术路线 |
| `/domain/<slug>/` | 24 条领域路线 |

因为数据在页面里，**应用领域目录的「是否有路线」不靠数据文件判断**：`DomainIndex.astro` 渲染时扫描
docs 集合（`domain/<slug>.mdx` 是否存在），没有页面的方向自动补 `tag: 'planned'`。

## 3. 四个目录页 = 四条路线

四个目录页的数据**结构完全一样**，都是一个 `RouteTier[]`（分节名用 `name`，卡片标题自带）：

| 页面 | 数据 | 规模 | 渲染开关 |
| --- | --- | --- | --- |
| 首页 `/` | `homeCatalog`（entries/home.ts） | 12 分节 / 85 条（31 可点 + 54 规划） | `markKind="auto"`（教程/路线混排） |
| 应用领域 `/domain/` | `domainCatalog`（entries/domains.ts） | 8 分节 / 47 条（24 有路线，23 虚线） | 默认 |
| 业务系统 `/business-systems/` | `businessSystems`（entries/business-systems.ts） | 14 分节 / 72 条 | `markKind="auto"` |
| 全部技术路线 `/tech-stack/` | `techCatalog`（routes/tech-catalog.ts） | 4 分节 / 19 条 | `markKind="none"` + `columns={2}` |

也就是说：**首页就是一条路线（12 个分节），业务系统也是一条路线（14 个分节）**，
和「Java 技术路线（4 个分节）」没有任何结构差别。

## 4. 业务系统：条目只写 id

业务系统没有自己的类型，直接写成一个路线；条目只有 id，**不重复写标题与入口**：

```ts
export const businessSystems: RouteTier[] = [
  {
    id: 'erp',
    name: '通用企业管理系统',
    items: ['erp', 'crm', 'hrm', 'fms', 'oa', 'ppm', 'contract-legal', 'bi', 'data-platform', 'lowcode'],
  },
  // …其余 13 个分类
];
```

- 卡片标题取自 `docs/business-systems/<id>/index.mdx` 的 `title`，入口直达第一章，都由 `RouteSections` 补全；
- 业务系统章节页（`01-overview` / `02-tech`）正文是静态引导语，不再有 `BizSystemChapter` 组件、
  `summary` / `related` 字段，也没有 `findBusinessSystem` 查表。

## 5. 计算机科学：外部引用（external）

`/computer-science/zh/`、`/computer-science/en/` 不是教程正文，而是**站外课程目录**。
课程数据（标题、简介、学习资源）直接写在页面 MDX 的 `export const tiers` 里，条目是第三种卡片：
`kind: 'external'`。没有 JSON 数据文件，也没有适配层。

```ts
export const tiers = [
  {
    name: '专业基础课',
    items: [
      {
        id: 'zh-basic-0',
        kind: 'external',
        title: '程序设计基础',
        external: {
          description: 'C/C++ 语言基础、程序设计方法…',
          resources: [
            { name: '视频教程', items: [{ title: '程序设计基础 - 清华大学 徐明星', url: 'https://…' }] },
          ],
        },
      },
    ],
  },
];
```

- 数据里再分主题小组的分类（OSSU 核心课程 / 高级课程）**每个小组直接写成一个分节**，标题形如
  「核心课程 · 编程基础」；三级分组只保留给「多选一」场景；
- 渲染：页面只写 `<RouteSections tiers={tiers} />`（与其他路线页同一个组件），
  组件发现有条目是 `kind: 'external'` 时自动在图例里说明、并在页面末尾挂上 `ReferenceDrawer`（右侧抽屉）；
- 交互：外部引用卡渲染成 `<button>`，点开 `dialog` 抽屉展示简介与学习资源（站外链接新标签页打开），
  不跳走；抽屉支持 Esc / 点遮罩 / 关闭按钮，关闭后焦点回到卡片；
- 想加一门课：直接在页面 MDX 的 `tiers` 里加一个 `kind: 'external'` 条目。

## 6. 渲染管线

只有一层：`RouteSections`（全站唯一组件）吃 `RouteTier[]`，当场解析每张卡片（标题 / 入口 / 类型 / 标签），
直接渲染分节和 `Card`，必要时挂 `ReferenceDrawer`。**没有中间数据结构，也没有 `CardItem` 映射层。**

- 两级分节：`items` 平铺成卡片网格；
- 三级分节：`groups` 渲染成选型面板（「N 选 1」）；
- 教程条目的标题 / 首章入口 / 上线状态由组件自动从内容集合补全（`getSeries()` + `seriesMeta`），
  目录页条目自带 `title` / `tag`，不会被改写；
- 图例、外部引用抽屉、空状态都由数据自动判断。

| prop | 作用 |
| --- | --- |
| `tiers` | 页面数据（唯一必填） |
| `titleOf` | 覆盖卡片标题（默认 `item.title ?? seriesMeta[id] ?? 教程页 title ?? id`） |
| `markKind` | `explicit`（默认，只标写了 kind 的）/ `auto`（没写 kind 时按 href 推断）/ `none`（一律不标） |
| `density` | 路线页 / 课程页默认自动 `compact`，目录页 `default` |
| `columns` | 一行几张卡（宽屏），默认 3；标题长的总览页用 2 |
| `legend` | 默认自动：用到了状态标签或外部引用才显示图例 |

`Card.astro` 只接收解析好的 `{ item, title, href, kind, tag }`，负责三种形态：
站内链接卡 / 外部引用按钮卡（点开右侧抽屉）/ 规划中虚线卡。

## 7. 左侧栏

| 页面 | 左侧栏内容 |
| --- | --- |
| 首页 | 12 个分类，点击定位、滚动高亮 |
| `/domain/` | 8 个分类，点击定位、滚动高亮 |
| `/business-systems/` | 14 个分类，点击定位、滚动高亮 |
| `/tech-stack/` | 19 条技术路线列表 |
| 单条路线页（`/tech-stack/<key>/`、`/domain/<slug>/`、`/computer-science/*`） | **本页分节锚点**（入门 / 进阶 / 精通 / 实战…），点击定位、滚动高亮；底部回到对应总览 |
| 教程页 | 这套教程的章节目录 |

单条路线页的分节数据写在页面 MDX 里，`Sidebar.astro` 读不到，因此由页面脚本从渲染出的
`.cs-card-section`（`data-cs-title`）采集锚点并复用同一套高亮逻辑。

## 8. 教程与章节：`src/content/docs/**`

一个目录 = 一个 URL。`docsSchema` 额外扩展了这些字段（`src/content.config.ts`）：

```ts
series?, difficulty?: 'beginner'|'intermediate'|'advanced', duration?: number,
tags?: string[], prerequisites?: string[], estMinutes?: number
```

| 页面 | 路径 | 关键字段 |
| --- | --- | --- |
| 教程系列首页 | `docs/tutorials/<id>/index.mdx` | `title`、`description`、`sidebar.order: 0`、`sidebar.hidden: true`；正文用 `<SeriesChapters series="<id>" />` |
| 教程章节 | `docs/tutorials/<id>/01-xxx.md` | `title`、`description?`、`duration?`、`sidebar.order`、`tableOfContents: true` |
| 技术路线页 | `docs/tech-stack/<route-id>.mdx` | `title`（卡片与左侧栏都用它）、`description`；正文里 `export const tiers` 定义分节，再 `<RouteSections tiers={tiers} />` |
| 应用领域页 | `docs/domain/<slug>.mdx` | 同上，`export const tiers = [...]` 写在本页 |
| 业务系统教程 | `docs/business-systems/<id>/` | 2 章静态引导语；与普通教程分开存放 |
| 计算机科学 | `docs/computer-science/{zh,en}/index.mdx` | 正文写 `export const tiers = [...]`（课程 = `kind: 'external'`）+ `<RouteSections tiers={tiers} />` |

业务系统教程的系列 id 是 `business-<目录名>`（如 `business-erp`），页面地址是
`/business-systems/<目录名>/`；`getSeries()` 同时扫描 `tutorials/` 与 `business-systems/` 两个目录，
面包屑、左侧栏、上一章/下一章、完成按钮都由它统一推导。

构建期 `src/lib/content.ts` 扫描 docs 得到：

```ts
interface ChapterInfo { id: string; title: string; order: number; duration?: string; description?: string }
interface SeriesInfo  { slug: string; href: string; title: string; description?: string; chapters: ChapterInfo[]; totalDuration: number }
```

`getSeries()` 决定：教程有没有上线（没有章节 → 卡片变虚线）、左侧栏章节列表、继续学习卡。
**写完章节页面，卡片自动点亮，不需要额外登记。**

教程的点击入口在 `src/lib/entry-links.ts`：目录页/路线页上的教程卡片直接指向**第一章**，
不落在教程首页；教程首页仍可从面包屑、左侧栏标题、以及章节页的翻页回到。

## 9. 运行时状态

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

## 10. 数据 → 界面 对照表

| 数据 | 决定什么 |
| --- | --- |
| `tier.name` / `tier.tag` | 分节标题（省略时显示 tag 文案）、标题旁徽标；左侧栏分节项与锚点 |
| `tier.groups` | 三级分节：选型面板与「N 选 1」标记 |
| `group.name` / `group.tag` | 三级分组标题；面板描边与状态徽标 |
| `item.kind` / `item.href` | 卡片类型标记（教程 / 路线 / 外部引用）与入口 |
| `item.tag` | 卡片状态徽标；`planned` 时渲染虚线卡且不可点 |
| `item.external`（`kind: 'external'`） | 计算机科学课程卡：卡片类型「外部引用」、右侧抽屉的简介与学习资源 |
| `seriesMeta[id]` / 教程页 `title` | 教程卡片的默认标题（`item.title` 可覆盖） |
| `lib/entry-links.ts` | 教程卡片的跳转目标（第一章） |
| `homeCatalog` / `domainCatalog` / `businessSystems` / `techCatalog` | 四个目录页的分节、卡片与左侧栏 |
| docs 集合 | 教程页 / 章节页 / 是否上线 / 进度 / 搜索索引 |

## 11. 常见改动怎么改

| 想做的事 | 改哪里 |
| --- | --- |
| 新增一篇教程 | `docs/tutorials/<id>/index.mdx` + 章节文件（有 `##` 小节的加 `tableOfContents: true`）；再把 `<id>` 写进路线里的某个分节（卡片会自动直达第一章） |
| 调整路线顺序 / 增删分节 | 直接改 `docs/tech-stack/<slug>.mdx`（或 `docs/domain/<slug>.mdx`）里的 `export const tiers` |
| 标记必学、推荐、主流、小众、规划中 | 在分节 / 分组 / 条目上写 `tag: 'required' | 'recommended' | 'popular' | 'optional' | 'niche' | 'planned'` |
| 做三级「多选一」 | 分节写 `groups: [...]`（不给 `items`），面板、徽标、「N 选 1」全自动 |
| 改教程在卡片上的名字 | 条目的 `title`（只覆盖某处）或 `seriesMeta`（跨页面统一） |
| 新增一条技术路线 | `docs/tech-stack/<slug>.mdx`（标题即卡片/左侧栏名称，正文写 `export const tiers`）+ 把 slug 加进 `routes/tech-catalog.ts` 的某个分组 |
| 新增一个应用领域 | 在 `entries/domains.ts` 对应分类加 `domainRoute('<slug>', '<名称>')`；要可点再写 `docs/domain/<slug>.mdx`（有页面就自动点亮） |
| 首页加/调整分类或卡片 | `src/data/entries/home.ts`（教程直接写 `{ id, title }` 或字符串，路线用 `techRoute` / `domainRoute` / `pageRoute`，`tag: 'planned'` = 虚线占位） |
| 业务系统加/改条目 | `src/data/entries/business-systems.ts` 的分类里加系统 id（标题与入口来自教程页） |
| 计算机科学加/改课程 | 直接改 `docs/computer-science/{zh,en}/index.mdx` 里的 `tiers` |

## 12. 约定与已知点

- **`id` 是唯一主键**：`seriesMeta` 的键、路线里的条目、`docs/tutorials/<id>/` 目录名必须一致。
- 站内链接一律用 `withBase()` / 相对路径，构建期 `base-links` 集成兜底 `/cs101` 前缀。
- **卡片只有一套实现**：`RouteSections → Card`，目录页与路线页共用；外部引用同样走这套卡片，
  只是卡片是按钮、点开 `ReferenceDrawer` 抽屉。
- **路线视图只有一个组件**：所有页面都用 `components/shared/RouteSections.astro`，页面之间只差传入的
  `RouteTier[]` 与少量显示选项；`TechNodes`、`CourseRoutes`、`CardSection`、`cards.ts` 都已并入或删除。
- **数据分三类放**：入口页（`src/data/entries/**`）、路线总览目录（`src/data/routes/**`）、
  教程元信息（`src/data/tutorials/**`）；模型与纯函数在 `src/data/model/**`。
  每条路线自己的分节数据写在页面 MDX 里（`export const tiers`），没有 `routePlan` 之类的查表文件。
- **教程内容一套一个文件夹**：普通教程在 `src/content/docs/tutorials/<id>/`，
  业务系统教程在 `src/content/docs/business-systems/<id>/`；入口链接由 `lib/entry-links.ts` 统一指向第一章。
- **MDX 里引用组件一律用 `@/` 别名**，不写 `../../../components/...`。
- `dist/` 与 `public/search-index.json` 是构建产物，不要手改。
