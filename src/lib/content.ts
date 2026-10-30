import { getCollection } from 'astro:content';

export interface ChapterInfo {
  id: string;
  title: string;
  order: number;
  duration?: number;
  description?: string;
}

export interface SeriesInfo {
  /** 系列 slug：普通教程为目录名，业务系统为 business-<目录名> */
  slug: string;
  /** 系列首页地址（普通教程 /tutorials/<slug>/，业务系统 /business-systems/<slug>/） */
  href: string;
  title: string;
  description?: string;
  chapters: ChapterInfo[];
  totalDuration: number;
}

function sidebarOrder(entry: { data: { sidebar?: { order?: number } } }) {
  return entry.data.sidebar?.order ?? 99;
}

/**
 * 系列索引页 → { slug, base }：
 * - 普通教程：docs/tutorials/<slug>/{index.mdx, 章节}
 * - 业务系统：docs/business-systems/<slug>/{index.mdx, 章节}，slug 加 business- 前缀避免与普通教程重名
 * 业务系统总览页 business-systems/index 不是系列，返回 undefined。
 */
function seriesSlug(id: string): { slug: string; base: string } | undefined {
  const tutorial = id.match(/^(tutorials\/[^/]+)(?:\/index)?$/);
  if (tutorial) {
    const base = tutorial[1];
    return { slug: base.split('/')[1]!, base };
  }
  const business = id.match(/^(business-systems\/[^/]+)(?:\/index)?$/);
  if (business && business[1] !== 'business-systems/index') {
    const base = business[1];
    return { slug: `business-${base.split('/')[1]}`, base };
  }
  return undefined;
}

/** 读取全部系列（普通教程 + 业务系统教程），并按 sidebar.order 排序章节。 */
export async function getSeries(): Promise<SeriesInfo[]> {
  const docs = await getCollection('docs');
  const indexEntries = docs.filter((entry) => seriesSlug(entry.id));

  return indexEntries
    .map((indexEntry) => {
      const { slug, base } = seriesSlug(indexEntry.id)!;
      const chapters = docs
        .filter((entry) => entry.id.startsWith(`${base}/`) && entry.id !== indexEntry.id)
        .filter((entry) => entry.data.draft !== true)
        .sort((a, b) => sidebarOrder(a) - sidebarOrder(b))
        .map((entry) => ({
          id: entry.id,
          title: entry.data.title,
          order: sidebarOrder(entry),
          duration: (entry.data as { duration?: number }).duration,
          description: entry.data.description,
        }));

      return {
        slug,
        href: `/${base}/`,
        title: indexEntry.data.title,
        description: indexEntry.data.description,
        chapters,
        totalDuration: chapters.reduce((sum, chapter) => sum + (chapter.duration ?? 0), 0),
      };
    })
    .filter((series) => series.chapters.length > 0)
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export async function getSeriesBySlug(slug: string) {
  const all = await getSeries();
  return all.find((series) => series.slug === slug);
}
