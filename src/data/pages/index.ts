// 页面配置注册表：所有「目录页 / 路线页」都只差一份 JSON。
// 页面 MDX 显式 import 同名 JSON 并传给 RoutePage；注册表本身供左侧栏与学习中心读取。

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
 * 教程章节页没有页面 JSON，仍由内容集合（系列章节）兜底。
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

const modules = import.meta.glob<PageConfig>('./**/*.json', {
  eager: true,
  import: 'default',
});

export const pageConfigs = Object.fromEntries(
  Object.entries(modules).map(([path, config]) => [
    path.replace(/^\.\//, '').replace(/\.json$/, ''),
    config,
  ]),
) as Record<string, PageConfig>;

/** 文档 id → 配置 key：index → home，xxx/index → xxx */
export const pageConfigKey = (entryId: string) =>
  entryId === '' || entryId === 'index' ? 'home' : entryId.replace(/\/index$/, '');

export function getPageConfig(entryId: string): PageConfig | undefined {
  return pageConfigs[pageConfigKey(entryId)];
}
