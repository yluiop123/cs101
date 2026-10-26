import { getCollection } from 'astro:content';

export interface ChapterInfo {
  id: string;
  title: string;
  order: number;
  duration?: number;
  description?: string;
}

export interface SeriesInfo {
  slug: string;
  title: string;
  description?: string;
  chapters: ChapterInfo[];
  totalDuration: number;
}

function sidebarOrder(entry: { data: { sidebar?: { order?: number } } }) {
  return entry.data.sidebar?.order ?? 99;
}

function seriesSlug(id: string): string | undefined {
  const match = id.match(/^tutorials\/([^/]+)(?:\/index)?$/);
  return match?.[1];
}

/** 读取全部系列（以 tutorials/<slug>/index 为准），并按 sidebar.order 排序章节。 */
export async function getSeries(): Promise<SeriesInfo[]> {
  const docs = await getCollection('docs');
  const indexEntries = docs.filter((entry) => seriesSlug(entry.id));

  return indexEntries
    .map((indexEntry) => {
      const slug = seriesSlug(indexEntry.id)!;
      const chapters = docs
        .filter((entry) => entry.id.startsWith(`tutorials/${slug}/`) && entry.id !== indexEntry.id)
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
