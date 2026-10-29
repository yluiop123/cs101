// 路线模型：类型 + 纯函数。
// 这里不放任何站点数据 —— 数据在 src/data/routes/**（技术路线 / 领域路线 / 教程名），
// 目录数据在 src/data/catalog.ts、domains.ts、business-systems.ts。

/** 学习要求：必学 / 推荐 / 主流 / 可选 / 小众 */
export type RouteItemRole = 'required' | 'recommended' | 'popular' | 'optional' | 'niche';

/** 状态标签文案，卡片与分组标题共用 */
export const roleLabels: Record<RouteItemRole, string> = {
  required: '必学',
  recommended: '推荐',
  popular: '主流',
  optional: '可选',
  niche: '小众',
};

/** 图例里每个状态的解释 */
export const roleNotes: Record<RouteItemRole, string> = {
  required: '所有路线都要学',
  recommended: '优先选择',
  popular: '常用、生态成熟',
  optional: '按目标或团队技术栈选',
  niche: '生态较小，按兴趣选',
};

/** 路线类型：决定点击后去哪、卡片上标「教程」还是「路线」 */
export type RouteKind = 'tutorial' | 'tech' | 'domain' | 'business' | 'page';

/** 路线里的一项（也用于首页 / 应用领域 / 业务系统 / 全部技术路线 四个目录页的卡片） */
export interface RouteItem {
  /** 主键：教程 slug、路线 key（如 domain-ai-ml）或业务系统 slug */
  slug: string;
  /** 省略 = tutorial */
  kind?: RouteKind;
  role?: RouteItemRole;
  /** 卡片标题；省略时退化为 slug（教程名可由调用方用 seriesMeta 覆盖） */
  title?: string;
  /** 规划中：卡片虚线、不可点 */
  planned?: boolean;
  /** 一句话说明（业务系统：核心作用；领域：方向简介） */
  summary?: string;
}

/** 选型组里的一个选项：一个框架/方向，下面是一系列教程 */
export interface RouteChoiceOption {
  /** 选项名，如 React */
  name: string;
  role?: RouteItemRole;
  items: (string | RouteItem)[];
}

/** 一条路线 = 若干分节（板块） */
export interface RouteTier {
  /** 目录页的分节锚点（路线页用 #tier-N） */
  id?: string;
  name: string;
  /** sequence = 顺序学习（默认）；choice = 多选一 */
  kind?: 'sequence' | 'choice';
  /** 必学模块：标题旁显示「必学」 */
  required?: boolean;
  /** 选型组的说明文字 */
  note?: string;
  /** 这一组路线共用的相关入口（业务系统：这类系统常用的技术栈） */
  related?: { title: string; href: string }[];
  items: (string | RouteItem)[];
  /** choice 组专用：每个选项代表一个可选的框架/方向，各含一系列教程 */
  options?: RouteChoiceOption[];
}

export const normalizeItem = (item: string | RouteItem): RouteItem =>
  typeof item === 'string' ? { slug: item } : item;

/** 把一组教程（含选型组各选项）摊平成 slug 列表 */
export const tierSlugs = (tier: RouteTier): string[] =>
  tier.options?.length
    ? tier.options.flatMap((option) => option.items.map((item) => normalizeItem(item).slug))
    : tier.items.map((item) => normalizeItem(item).slug);

/** 单项状态：自己标的优先，否则继承所属分组/选型项的默认状态 */
export const itemRole = (
  item: string | RouteItem,
  fallback?: RouteItemRole,
): RouteItemRole | undefined => normalizeItem(item).role ?? fallback;

/** 卡片 / 面包屑标题（只认条目自带的 title，教程名由调用方补） */
export const itemTitle = (item: string | RouteItem): string => {
  const normalized = normalizeItem(item);
  return normalized.title ?? normalized.slug;
};

/** 条目的入口地址；planed 的条目没有入口（渲染成虚线占位卡） */
export const itemHref = (item: string | RouteItem): string | undefined => {
  const normalized = normalizeItem(item);
  if (normalized.planned) return undefined;
  switch (normalized.kind ?? 'tutorial') {
    case 'tech':
      return `/tech-stack/${normalized.slug}/`;
    case 'domain':
      return `/domain/${normalized.slug.replace(/^domain-/, '')}/`;
    case 'business':
      return `/tutorials/business-${normalized.slug.replace(/^business-/, '')}/`;
    case 'page':
      return `/${normalized.slug}/`;
    default:
      return `/tutorials/${normalized.slug}/`;
  }
};

/** 卡片类型标记：教程类（教程 / 业务系统教程）还是路线类（技术路线 / 领域路线 / 专题页） */
export const itemCardKind = (item: string | RouteItem): 'tutorial' | 'route' => {
  const kind = normalizeItem(item).kind ?? 'tutorial';
  return kind === 'tutorial' || kind === 'business' ? 'tutorial' : 'route';
};
