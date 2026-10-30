import { getSeries } from '@/lib/content';
import type { RouteItem } from '@/data/model/route-model';

/**
 * 条目对应「系列页」时返回系列 id：
 * - 教程：显式 href `/tutorials/<id>/`，或省略 href 时按条目 id；
 * - 业务系统：href `/business-systems/<id>/`，系列 id 加 `business-` 前缀避免与普通教程重名；
 * - 其它入口（技术路线 / 领域路线 / 专题页 / 外部引用）返回 undefined，不做「直达第一章」。
 */
const seriesSlug = (item: RouteItem): string | undefined => {
  if (item.href) {
    const match = item.href.match(/^\/(tutorials|business-systems)\/([^/]+)\/$/);
    if (!match) return undefined;
    return match[1] === 'business-systems' ? `business-${match[2]}` : match[2];
  }
  return (item.kind ?? 'tutorial') === 'tutorial' ? item.id : undefined;
};

/**
 * 卡片上的教程入口：点击教程不再落在教程首页，而是直接进入第一章开始学习。
 *
 * 教程首页（`/tutorials/<slug>/`）仍然保留，可以从面包屑、左侧栏教程名、课程目录页回到，
 * 那里放着简介、前置教程与学习进度。
 */
export async function tutorialEntryHref(): Promise<(item: RouteItem) => string | undefined> {
  const series = await getSeries();
  const starts = new Map<string, string>();
  for (const item of series) {
    const first = item.chapters[0];
    if (first) starts.set(item.slug, `/${first.id}/`);
  }
  return (item) => {
    const slug = seriesSlug(item);
    if (!slug) return undefined;
    // 业务系统条目可能只写 id（没有 href），系列 slug 要补 business- 前缀再查
    return starts.get(slug) ?? starts.get(`business-${slug}`);
  };
}
