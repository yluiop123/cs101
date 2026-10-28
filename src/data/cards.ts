// 分组 + 卡片的数据结构：首页、应用领域、业务系统共用同一套渲染组件（CardSection）
// 新增内容时只改数据（catalog.ts / domains.ts / business-systems.ts / route-plan.ts），不需要动组件。

import type { RouteItemRole } from '@/data/route-plan';

/** 徽标色调：与学习状态同名，另加「route」「tutorial」「system」表示卡片类型 */
export type CardBadgeTone = RouteItemRole | 'route' | 'tutorial' | 'system';

export interface CardBadge {
  label: string;
  tone?: CardBadgeTone;
}

/** 卡片类型：教程 / 技术路线 / 业务系统；决定卡片上的类型标签 */
export type CardKind = 'tutorial' | 'route' | 'system';

export interface CardItem {
  title: string;
  /** 有 href = 可点击卡片；没有 = 规划中（虚线） */
  href?: string;
  /** 卡片类型（可省略，省略时按 href 推断：/tutorials/ 为教程，其余为路线） */
  kind?: CardKind;
  /** 卡片右侧的补充文字（可选） */
  meta?: string;
  badges?: CardBadge[];
}

export interface CardSectionData {
  /** 页内锚点 id */
  id?: string;
  title: string;
  /** 标题右侧的入口链接，如“学习路线 →” */
  more?: { href: string; label?: string };
  items: CardItem[];
}

/** 卡片类型文案 */
export const kindLabels: Record<CardKind, string> = {
  tutorial: '教程',
  route: '路线',
  system: '系统',
};

/** 由链接推断卡片类型（/tutorials/** 是教程页，其余是路线/专题页） */
export const kindOfHref = (href?: string): CardKind =>
  href?.startsWith('/tutorials/') ? 'tutorial' : 'route';
