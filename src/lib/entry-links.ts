import { getSeries } from '@/lib/content';
import type { RouteItem } from '@/data/model/route-model';

/** 只有教程类条目（kind 省略 / tutorial / business）才做「直达第一章」处理 */
const isTutorialEntry = (item: RouteItem) => {
  const kind = item.kind ?? 'tutorial';
  return kind === 'tutorial' || kind === 'business';
};

/**
 * 卡片上的教程入口：点击教程不再落在教程首页，而是直接进入第一章开始学习。
 *
 * 教程首页（`/tutorials/<slug>/`）仍然保留，可以从面包屑、左侧栏教程名、课程目录页回到，
 * 那里放着简介、前置教程与学习进度。
 */
/** 业务系统条目里的 slug 是系统名（erp），教程目录是 business-<slug> */
const tutorialSlug = (item: RouteItem) =>
  item.kind === 'business' ? `business-${item.slug.replace(/^business-/, '')}` : item.slug;

export async function tutorialEntryHref(): Promise<(item: RouteItem) => string | undefined> {
  const series = await getSeries();
  const starts = new Map<string, string>();
  for (const item of series) {
    const first = item.chapters[0];
    if (first) starts.set(item.slug, `/${first.id}/`);
  }
  return (item) => (isTutorialEntry(item) ? starts.get(tutorialSlug(item)) : undefined);
}
