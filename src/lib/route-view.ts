// 路线卡片的视图模型：只做数据解析与分组，不碰 Astro 运行时，方便单测。
// RouteSections.astro 负责取数（内容集合 / 系列状态 / 第一章入口），这里负责把 RouteTier[]
// 解析成可直接渲染的 SectionView[]。

import {
  allTierItems,
  itemHref,
  itemTag,
  normalizeItem,
  tagLabels,
  type RouteItem,
  type RouteKind,
  type RouteTag,
  type RouteTier,
} from '@/data/model/route-model';

export type Badge = { label: string; tone: 'tag' | 'choice' };

export interface CardView {
  item: RouteItem;
  title: string;
  href?: string;
  kind?: RouteKind;
  tag?: RouteTag;
}

export interface GroupView {
  id: string;
  title: string;
  tag?: RouteTag;
  cards: CardView[];
}

export interface SectionView {
  id: string;
  title: string;
  badges: Badge[];
  choice: boolean;
  groups?: GroupView[];
  cards: CardView[];
}

export interface RouteViewContext {
  /** 卡片标题覆盖（技术路线总览页从 MDX title 取） */
  titleOf: (item: RouteItem) => string;
  markKind: 'explicit' | 'auto' | 'none';
  /** 教程条目需要从内容集合补全标题 / 是否上线 / 第一章入口 */
  needsSeries: boolean;
  /** 已有教程页的路线 id（业务系统已去掉 business- 前缀） */
  online: Set<string>;
  /** 教程条目 → 第一章入口 */
  firstChapter?: (item: RouteItem) => string | undefined;
}

const isTutorial = (item: RouteItem) => (item.kind ?? 'tutorial') === 'tutorial';

/** 没写 kind 时按入口推断卡片类型 */
export const inferKind = (href?: string): RouteKind =>
  href?.startsWith('/tutorials/') || /^\/business-systems\/[^/]+\//.test(href ?? '')
    ? 'tutorial'
    : 'route';

export function buildSections(tiers: RouteTier[], context: RouteViewContext): SectionView[] {
  const toCard = (item: string | RouteItem, inheritedTag?: RouteTag): CardView => {
    const routeItem = normalizeItem(item);
    const tag = itemTag(item, inheritedTag);
    const external = routeItem.kind === 'external';
    const href =
      external || tag === 'planned'
        ? undefined
        : (context.firstChapter?.(routeItem) ?? routeItem.href ?? itemHref(routeItem));

    let resolvedHref = href;
    if (
      resolvedHref &&
      context.needsSeries &&
      isTutorial(routeItem) &&
      !context.online.has(routeItem.id)
    ) {
      resolvedHref = undefined;
    }

    const kind =
      context.markKind === 'none'
        ? undefined
        : context.markKind === 'auto'
          ? (routeItem.kind ?? inferKind(resolvedHref))
          : routeItem.kind;

    return { item: routeItem, title: context.titleOf(routeItem), href: resolvedHref, kind, tag };
  };

  return tiers.map((tier, index) => {
    const groups = tier.groups?.map((group, groupIndex) => ({
      id: `${tier.id ?? `tier-${index}`}-${groupIndex}`,
      title: group.name,
      tag: group.tag,
      cards: group.items.map((item) => toCard(item, group.tag ?? tier.tag)),
    }));
    const choice = Boolean(groups?.length);
    const title = tier.name ?? (tier.tag ? tagLabels[tier.tag] : '');
    const badges: Badge[] = [];
    if (tier.tag && tier.name) badges.push({ label: tagLabels[tier.tag], tone: 'tag' });
    if (groups && choice) badges.push({ label: `${groups.length} 选 1`, tone: 'choice' });

    return {
      id: tier.id ?? `tier-${index}`,
      title,
      badges,
      choice,
      groups,
      cards: tier.items.map((item) => toCard(item, tier.tag)),
    };
  });
}

const legendOrder: Exclude<RouteTag, 'planned'>[] = [
  'required',
  'recommended',
  'popular',
  'optional',
  'niche',
];

/** 图例只展示这条路线实际用到的学习状态 */
export function collectLegendTags(tiers: RouteTier[]): Exclude<RouteTag, 'planned'>[] {
  const used = new Set<RouteTag>();
  for (const tier of tiers) {
    if (tier.tag) used.add(tier.tag);
    for (const group of tier.groups ?? []) if (group.tag) used.add(group.tag);
    for (const item of allTierItems([tier])) if (item.tag) used.add(item.tag);
  }
  return legendOrder.filter((tag) => used.has(tag));
}
