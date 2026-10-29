// 卡片 + 分节的数据结构：首页、应用领域、业务系统、技术路线、领域详情页共用同一套模型与渲染组件。
//
// 统一模型：一个条目 = 一条路线（route-plan.ts 的 RouteItem），一个分节 = 一组路线（RouteTier）。
// 四个目录页（首页 / 应用领域 / 业务系统 / 全部技术路线）与路线页用的是同一个 RouteTier[]，
// `tierSections()` 把它转成 CardSectionData，再由 CardSection + Card 渲染。

import {
  itemCardKind,
  itemHref,
  itemRole,
  itemTitle,
  normalizeItem,
  roleLabels,
  routePlan,
  tierSlugs,
  type RouteItem,
  type RouteItemRole,
  type RouteTier,
} from '@/data/route-plan';

/** 徽标色调：与学习状态同名，另加「choice」表示多选一分节 */
export type CardBadgeTone = RouteItemRole | 'choice';

export interface CardBadge {
  label: string;
  tone?: CardBadgeTone;
}

/** 卡片类型：教程 / 技术路线；决定卡片上的类型标记 */
export type CardKind = 'tutorial' | 'route';

export interface CardItem {
  title: string;
  /** 有 href = 可点击卡片；没有 = 规划中（虚线） */
  href?: string;
  /** 卡片类型（可省略，省略时按 href 推断：/tutorials/ 为教程，其余为路线） */
  kind?: CardKind;
  /** 卡片右侧的补充文字（可选），如「4 阶段 · 12 项」 */
  meta?: string;
  badges?: CardBadge[];
}

/** 二级分组：「多选一」这类分节里的一个选项（如大前端 → 框架选型 → React / Vue …） */
export interface CardGroup {
  title: string;
  /** 选项状态：推荐 / 主流 / 小众；决定面板描边与标题旁的徽标 */
  role?: RouteItemRole;
  items: CardItem[];
}

export interface CardSectionData {
  /** 页内锚点 id */
  id?: string;
  title: string;
  /** 标题右侧的入口链接，如「学习路线 →」 */
  more?: { href: string; label?: string };
  /** 标题旁的分节标记，如「必学」「5 选 1」 */
  tag?: CardBadge;
  /** 分节说明文字（选型规则、学习顺序提示等） */
  note?: string;
  /** 平铺卡片（与 groups 二选一） */
  items?: CardItem[];
  /** 二级分组：多选一（与 items 二选一） */
  groups?: CardGroup[];
  /**
   * 是否按 href 推断卡片类型标记（教程 / 路线）。
   * 默认 true；路线页设 false —— 那里只有显式写了 kind 的条目才显示标记。
   */
  showKind?: boolean;
  /** 卡片密度：compact 用于路线页（卡片多、带状态徽标） */
  density?: 'default' | 'compact';
  /** 一行几张卡（宽屏）；默认 3，标题较长的总览页可用 2 */
  columns?: 2 | 3;
}

/** 卡片类型文案 */
export const kindLabels: Record<CardKind, string> = {
  tutorial: '教程',
  route: '路线',
};

/** 由链接推断卡片类型（/tutorials/** 是教程页，其余是路线/专题页） */
export const kindOfHref = (href?: string): CardKind =>
  href?.startsWith('/tutorials/') ? 'tutorial' : 'route';

/** 分节标签的样式后缀：choice 用独立配色，其余沿用学习状态 */
export const tagVariant = (tag?: CardBadge): string | undefined =>
  tag?.tone === 'choice' ? 'choice' : tag?.tone === 'required' ? 'required' : undefined;

/** 卡片类型标记的显示策略 */
export type MarkKindMode =
  /** 只有显式写了 kind 的条目才标（目录页；路线页默认，教程卡保持干净） */
  | 'explicit'
  /** 显式 kind 优先，没写的按链接推断（首页：教程 / 路线混排） */
  | 'auto'
  /** 一律不标（全部技术路线页：整页都是路线，标了只会挤标题） */
  | 'none';

/** RouteTier[] → CardSectionData[] 的转换选项 */
export interface TierSectionOptions {
  /** 分节锚点；默认 tier-<序号>（路线页左侧栏用），目录页可传自己的 id */
  idOf?: (tier: RouteTier, index: number) => string | undefined;
  /** 卡片标题解析（技术路线总览页从 MDX title 覆盖） */
  titleOf?: (item: RouteItem) => string;
  markKind?: MarkKindMode;
  density?: 'default' | 'compact';
  columns?: 2 | 3;
  /** 给指向另一条技术路线的卡片加「N 阶段 · M 项」规模提示 */
  routeScale?: boolean;
  /** 条目是否已上线（路线页用它把没写正文的教程显示成虚线卡） */
  available?: (item: RouteItem) => boolean;
}

/** 统一转换：一个分节 = 一个 CardSectionData；目录页与路线页都从这里出 */
export const tierSections = (
  tiers: RouteTier[],
  options: TierSectionOptions = {},
): CardSectionData[] =>
  tiers.map((tier, index) => {
    const choice = Boolean(tier.options?.length);
    const markKind = options.markKind ?? 'explicit';

    const toCard = (item: string | RouteItem, inheritedRole?: RouteItemRole): CardItem => {
      const normalized = normalizeItem(item);
      const role = itemRole(item, inheritedRole);
      const href = itemHref(normalized);
      const online = options.available?.(normalized) ?? true;
      const card: CardItem = {
        title: options.titleOf?.(normalized) ?? itemTitle(normalized),
        href: online ? href : undefined,
        // 显式类型才出标记；没写 kind 的教程卡由分节的 showKind 决定是否按链接推断
        kind:
          markKind !== 'none' && normalized.kind ? itemCardKind(normalized) : undefined,
        badges: role ? [{ label: roleLabels[role], tone: role }] : [],
      };

      if (options.routeScale && normalized.kind === 'tech') {
        const targetTiers = routePlan[normalized.slug] ?? [];
        const count = new Set(targetTiers.flatMap((targetTier) => tierSlugs(targetTier))).size;
        card.meta = `${targetTiers.length} 阶段 · ${count} 项`;
      }
      return card;
    };

    return {
      id: options.idOf?.(tier, index) ?? (tier.id ? tier.id : `tier-${index}`),
      title: tier.name,
      tag: tier.required
        ? { label: roleLabels.required, tone: 'required' }
        : choice
          ? { label: `${tier.options?.length} 选 1`, tone: 'choice' }
          : undefined,
      note: tier.note,
      showKind: markKind === 'auto',
      density: options.density,
      columns: options.columns,
      items: choice
        ? undefined
        : tier.items.map((item) => toCard(item, tier.required ? 'required' : undefined)),
      groups: choice
        ? tier.options?.map((option) => ({
            title: option.name,
            role: option.role,
            items: option.items.map((item) => toCard(item, option.role)),
          }))
        : undefined,
    };
  });
