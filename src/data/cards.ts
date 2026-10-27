// 分组 + 卡片的数据结构：首页、应用领域共用同一套渲染组件（CardSection）
// 新增内容时只改数据（catalog.ts / domains.ts / route-plan.ts），不需要动组件。

export type CardBadgeTone = 'required' | 'recommended' | 'optional' | 'route';

export interface CardBadge {
  label: string;
  tone?: CardBadgeTone;
}

export interface CardItem {
  title: string;
  /** 有 href = 可点击卡片；没有 = 规划中（虚线） */
  href?: string;
  /** 卡片右侧的提示文字，如 “12 章”“4 阶段 · 19 项” */
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
