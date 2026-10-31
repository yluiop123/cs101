// 路线模型：类型 + 纯函数。
// 这里不放任何站点数据 ——
//   入口页配置：src/data/pages/**（首页 / 业务系统）
//   路线页配置：src/data/routes/**（技术路线总览）
//   教程元信息：src/data/tutorials/**（id → 中文名）

/** 状态标签：卡片 / 分组 / 分节共用一个字段，只影响徽标与「规划中」虚线卡 */
export type RouteTag = 'required' | 'recommended' | 'popular' | 'optional' | 'niche' | 'planned';

/** 标签文案 */
export const tagLabels: Record<RouteTag, string> = {
  required: '必学',
  recommended: '推荐',
  popular: '主流',
  optional: '可选',
  niche: '小众',
  planned: '规划中',
};

/** 图例里每个学习状态的解释（规划中不解释：卡片本身就是虚线占位） */
export const tagNotes: Record<Exclude<RouteTag, 'planned'>, string> = {
  required: '所有路线都要学',
  recommended: '优先选择',
  popular: '常用、生态成熟',
  optional: '按目标或团队技术栈选',
  niche: '生态较小，按兴趣选',
};

/** 卡片类型只有三种：教程 / 路线 / 外部引用（决定卡片上的标记） */
export type RouteKind = 'tutorial' | 'route' | 'external';

/** 卡片类型文案 */
export const kindLabels: Record<RouteKind, string> = {
  tutorial: '教程',
  route: '路线',
  external: '外部引用',
};

/** 外部引用的一个学习资源（视频课、公开课、课程主页…） */
export interface ExternalResource {
  title: string;
  /** 资源地址；站外链接，统一新标签页打开 */
  url?: string;
}

/** 外部引用的资源分组（视频教程 / 课程链接 / 教材 …） */
export interface ExternalResourceGroup {
  name?: string;
  items: ExternalResource[];
}

/**
 * 外部引用：条目本体不在本站，点卡片时在右侧抽屉里展示简介与学习资源，不直接跳站外。
 * 计算机科学的课程（国内课程 / OSSU 公开课）就是这种条目。
 */
export interface ExternalRef {
  description?: string;
  resources?: ExternalResourceGroup[];
}

/** 路线里的一项（也用于首页 / 业务系统 / 全部技术路线 三个目录页的卡片） */
export interface RouteItem {
  /** 主键：教程 id、路线 key（如 domain-ai-ml）或业务系统 id */
  id: string;
  /** 卡片类型；省略 = tutorial（教程默认入口 /tutorials/<id>/） */
  kind?: RouteKind;
  /** 站内入口；kind: 'route' 时必填，kind: 'tutorial' 省略时默认 /tutorials/<id>/ */
  href?: string;
  /** 状态标签；下标时卡片继承所属分组 / 分节的标签 */
  tag?: RouteTag;
  /** 卡片标题覆盖；省略时用 seriesMeta[id]，再退化为 id */
  title?: string;
  /** kind: 'external' 时必填：抽屉里展示的简介与学习资源 */
  external?: ExternalRef;
}

/**
 * 三级结构：分节下的一个分组。
 * 只有需要「多选一」时才用三级 —— 有 groups 就一定是分支（渲染成选型面板 + 「N 选 1」），
 * 例如大前端 → 框架选型 → React / Vue / Angular / Svelte / Solid。
 */
export interface RouteGroup {
  name: string;
  /** 组状态：推荐 / 主流 / 小众…（面板描边与徽标） */
  tag?: RouteTag;
  items: (string | RouteItem)[];
}

/**
 * 一条路线 = 若干分节（板块）。
 * 两级：items 直接是卡片；三级：groups 先分组（必然是分支）。
 */
export interface RouteTier {
  /** 目录页的分节锚点（路线页用 #tier-N） */
  id?: string;
  /** 分节标题；省略时用 tag 文案（按状态分组的路线页） */
  name?: string;
  /** 分节状态：标题旁显示徽标，分节内卡片继承 */
  tag?: RouteTag;
  /** 两级：直接列卡片 */
  items: (string | RouteItem)[];
  /** 三级：先分组再列卡片（必然是分支，显示为选型面板） */
  groups?: RouteGroup[];
}

export const normalizeItem = (item: string | RouteItem): RouteItem =>
  typeof item === 'string' ? { id: item } : item;

/** 摊平一个分节里的全部条目（平铺项 + 三级分组） */
export const tierItems = (tier: RouteTier): RouteItem[] => [
  ...tier.items.map(normalizeItem),
  ...(tier.groups ?? []).flatMap((group) => group.items.map(normalizeItem)),
];

/** 摊平多条路线里的全部条目 */
export const allTierItems = (tiers: RouteTier[]): RouteItem[] => tiers.flatMap(tierItems);

/** 把一组教程（含三级分组各选项）摊平成 id 列表 */
export const tierIds = (tier: RouteTier): string[] => tierItems(tier).map((item) => item.id);

/** 单项状态：自己标的优先，否则继承所属分组 / 分节 */
export const itemTag = (item: string | RouteItem, fallback?: RouteTag): RouteTag | undefined =>
  normalizeItem(item).tag ?? fallback;

/**
 * 条目的入口地址：
 * - planned / external → 没有入口（虚线占位卡 / 点卡片开右侧抽屉）
 * - 写了 href → 直接用（路线类条目必须写）
 * - 教程省略 href → 默认 /tutorials/<id>/
 */
export const itemHref = (item: string | RouteItem): string | undefined => {
  const normalized = normalizeItem(item);
  if (normalized.tag === 'planned' || normalized.kind === 'external') return undefined;
  if (normalized.href) return normalized.href;
  return normalized.kind === 'route' ? undefined : `/tutorials/${normalized.id}/`;
};
