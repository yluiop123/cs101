// 目录页 / 路线页的配置类型。具体 tiers / options / sidebar 写在各自 MDX 的 frontmatter 里。

import type { RouteTier } from '@/data/model/route-model';

export interface PageOptions {
  /** 卡片类型标记：explicit（默认）/ auto / none */
  markKind?: 'explicit' | 'auto' | 'none';
  /** 卡片密度：compact 用于路线页 / 总览页 */
  density?: 'default' | 'compact';
  /** 宽屏一行几张卡 */
  columns?: 2 | 3;
  /** 是否显示状态图例；默认按数据自动 */
  legend?: boolean;
  /** 应用领域总览：没有对应 docs 页面的方向标成「规划中」 */
  detectPlanned?: boolean;
  /** 路线页显示「收藏路线」按钮 */
  favorite?: boolean;
}

/**
 * 左侧栏配置：同一个 Sidebar 组件按这里的 mode 渲染。
 * - sections：列出本页 tiers 的分节锚点
 * - routes：摊平 tiers 里的条目，渲染成路线链接
 * 教程章节页没有 route 配置，仍由内容集合（系列章节）兜底。
 */
export interface SidebarConfig {
  mode: 'sections' | 'routes';
  kicker: string;
  back?: { href: string; label: string };
}

export interface PageConfig {
  tiers: RouteTier[];
  options?: PageOptions;
  sidebar?: SidebarConfig;
}

/** 文档 id → 配置 key：index → home，xxx/index → xxx */
export const pageConfigKey = (entryId: string) =>
  entryId === '' || entryId === 'index' ? 'home' : entryId.replace(/\/index$/, '');
