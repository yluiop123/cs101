// 分组 + 卡片的数据结构：首页、应用领域、业务系统、技术路线 / 领域详情页共用同一套渲染组件
// （CardSection + Card）。新增内容时只改数据（catalog.ts / domains.ts / business-systems.ts /
// route-plan.ts），不需要动组件。

import type { RouteItemRole } from '@/data/route-plan';

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
   * 默认 true；路线页设 false —— 那里只有「跳到另一条路线」的卡片才显式写 kind 显示标记。
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
