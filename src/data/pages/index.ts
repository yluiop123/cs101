// 页面配置注册表：所有「目录页 / 路线页」都只差一份 JSON。
// 页面组件 RoutePage 按当前文档 id 自动取配置，MDX 里不需要再 import 数据或写 options。

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
  /** 首页专用的无障碍标题 */
  srTitle?: string;
  /** 首页显示「继续学习」卡片 */
  showContinueCard?: boolean;
  /** 应用领域总览：没有对应 docs 页面的方向标成「规划中」 */
  detectPlanned?: boolean;
  /** 技术路线总览：卡片标题取 docs/tech-stack/<slug>.mdx 的 title */
  titleFromContent?: boolean;
}

export interface PageConfig {
  tiers: RouteTier[];
  options?: PageOptions;
}

const modules = import.meta.glob<PageConfig>('./**/*.json', {
  eager: true,
  import: 'default',
});

const configs = Object.fromEntries(
  Object.entries(modules).map(([path, config]) => [
    path.replace(/^\.\//, '').replace(/\.json$/, ''),
    config,
  ]),
) as Record<string, PageConfig>;

/** 文档 id → 配置 key：index → home，xxx/index → xxx */
export const pageConfigKey = (entryId: string) =>
  entryId === '' || entryId === 'index' ? 'home' : entryId.replace(/\/index$/, '');

export function getPageConfig(entryId: string): PageConfig | undefined {
  return configs[pageConfigKey(entryId)];
}

export function requirePageConfig(entryId: string): PageConfig {
  const config = getPageConfig(entryId);
  if (!config) throw new Error(`缺少页面配置：${entryId}`);
  return config;
}
