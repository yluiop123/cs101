import type MiniSearch from 'minisearch';
import { withBase } from '@/lib/utils';

async function fetchIndex() {
  const response = await fetch(withBase('/search-index.json'));
  if (!response.ok) throw new Error(`搜索索引加载失败：${response.status}`);
  return (await response.json()) as { records: SearchRecord[] };
}

export interface SearchRecord {
  u: string;
  t: string;
  s: string;
  h: string;
  a: string;
  x: string;
}

export interface SearchHit {
  id: number;
  score: number;
  url: string;
  pageTitle: string;
  series: string;
  heading: string;
  text: string;
}

type MiniSearchInstance = MiniSearch<SearchRecord>;

const segmenter = new Intl.Segmenter('zh', { granularity: 'word' });

function tokenize(text: string) {
  if (!text) return [];
  const words: string[] = [];
  for (const piece of text.split(/(\s+|[A-Za-z0-9_.+-]+)/)) {
    if (!piece || /^\s+$/.test(piece)) continue;
    if (/^[A-Za-z0-9_.+-]+$/.test(piece)) {
      words.push(piece.toLowerCase());
      continue;
    }
    for (const part of segmenter.segment(piece)) {
      if (part.isWordLike) words.push(part.segment.toLowerCase());
    }
  }
  return words;
}

let miniSearchPromise: Promise<MiniSearchInstance> | null = null;

async function getSearch() {
  if (!miniSearchPromise) {
    miniSearchPromise = (async () => {
      const { default: MiniSearch } = await import('minisearch');
      const { records } = await fetchIndex();
      const index = new MiniSearch<SearchRecord>({
        idField: 'id',
        fields: ['t', 'h', 'x'],
        storeFields: ['u', 't', 's', 'h', 'x'],
        tokenize,
        searchOptions: { boost: { t: 4, h: 2 }, prefix: true, fuzzy: 0.15 },
      });
      index.addAll(records.map((record, id) => ({ ...record, id })));      return index;
    })();
  }
  return miniSearchPromise;
}

export async function search(query: string, limit = 18): Promise<SearchHit[]> {
  const trimmed = query.trim();
  if (trimmed.length === 0) return [];
  const index = await getSearch();
  return index.search(trimmed).slice(0, limit).map((result) => ({
    id: result.id as number,
    score: result.score,
    url: `${withBase(result.u as string)}${result.a ? `#${result.a}` : ''}`,
    pageTitle: result.t as string,
    series: result.s as string,
    heading: result.h as string,
    text: result.x as string,
  }));
}
