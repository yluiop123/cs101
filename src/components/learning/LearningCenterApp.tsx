import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { ArrowRight, BookOpen, Check, Download, StarOff, Trash2, Upload } from 'lucide-react';
import {
  emptyProgress,
  PROGRESS_EVENT,
  readProgress,
  toggleComplete,
  toggleFavorite,
  writeProgress,
  type ProgressState,
} from '@/lib/progress';
import { withBase } from '@/lib/utils';

export interface ChapterRef {
  id: string;
  title: string;
  seriesSlug: string;
  seriesTitle: string;
  duration?: number;
}

export interface SeriesRef {
  slug: string;
  title: string;
  href: string;
  total: number;
}

export interface RouteRef {
  id: string;
  title: string;
  href: string;
  total: number;
  seriesSlugs: string[];
}

interface Props {
  chapters: ChapterRef[];
  series: SeriesRef[];
  routes: RouteRef[];
}

export default function LearningCenterApp({ chapters, series, routes }: Props) {
  const [state, setState] = useState<ProgressState>(() => emptyProgress());
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const refresh = () => setState(readProgress());
    refresh();
    setReady(true);
    window.addEventListener(PROGRESS_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const chapterById = useMemo(() => new Map(chapters.map((chapter) => [chapter.id, chapter])), [chapters]);
  const routeById = useMemo(() => new Map(routes.map((route) => [route.id, route])), [routes]);

  const completedIds = Object.keys(state.completed).filter((id) => chapterById.has(id));
  const seriesStats = series.map((item) => ({
    ...item,
    done: completedIds.filter((id) => chapterById.get(id)?.seriesSlug === item.slug).length,
  }));
  const seriesBySlug = new Map(seriesStats.map((item) => [item.slug, item]));
  type SeriesStat = (typeof seriesStats)[number];

  // 教程收藏是 series:<slug>，一条教程只出现一次；旧版章节收藏已在 readProgress 里归一
  const favoriteSeries = [...new Set(state.favorites)]
    .filter((id) => id.startsWith('series:'))
    .map((id) => seriesBySlug.get(id.slice('series:'.length)))
    .filter((item): item is SeriesStat => Boolean(item));

  // 路线收藏是 route:<key>，一条路线只出现一次
  const favoriteRoutes = [...new Set(state.favorites)]
    .filter((id) => id.startsWith('route:'))
    .map((id) => routeById.get(id))
    .filter((route): route is RouteRef => Boolean(route));

  // 路线进度按「里面已完成教程数 / 教程总数」统计；手动标记完成视为全部教程完成
  const routeStats = favoriteRoutes.map((route) => {
    const tutorials = route.seriesSlugs
      .map((slug) => seriesBySlug.get(slug))
      .filter((item): item is SeriesStat => Boolean(item));
    const doneTutorials = tutorials.filter((item) => item.done >= item.total).length;
    const marked = Boolean(state.completed[route.id]);
    const done = marked ? route.total : doneTutorials;
    return {
      ...route,
      done,
      percent: route.total ? Math.round((done / route.total) * 100) : 0,
      marked,
    };
  });

  // 最近学习：同一教程只显示一次，保留该教程最近访问的章节
  const recentItems = (() => {
    const seen = new Set<string>();
    const items: ChapterRef[] = [];
    for (const entry of state.recent) {
      const chapter = chapterById.get(entry.id);
      if (!chapter || seen.has(chapter.seriesSlug)) continue;
      seen.add(chapter.seriesSlug);
      items.push(chapter);
      if (items.length >= 5) break;
    }
    return items;
  })();

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cs101-progress-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage('已导出进度文件。');
  };

  const importData = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as Partial<ProgressState>;
      if (!parsed || typeof parsed !== 'object' || typeof parsed.completed !== 'object') {
        throw new Error('invalid progress file');
      }
      const nextState: ProgressState = {
        completed: parsed.completed ?? {},
        favorites: Array.isArray(parsed.favorites)
          ? parsed.favorites.filter((id): id is string => typeof id === 'string')
          : [],
        recent: Array.isArray(parsed.recent)
          ? parsed.recent.filter(
              (entry): entry is { id: string; at: number } =>
                Boolean(entry) && typeof entry.id === 'string' && typeof entry.at === 'number',
            )
          : [],
      };
      writeProgress(nextState);
      setMessage(`已导入 ${Object.keys(nextState.completed).length} 条完成记录。`);
    } catch {
      setMessage('导入失败：文件不是有效的 CS101 进度 JSON。');
    } finally {
      event.currentTarget.value = '';
    }
  };

  const clearAll = () => {
    if (!window.confirm('确定清空本机的学习进度、收藏和最近记录吗？')) return;
    writeProgress(emptyProgress());
    setMessage('已清空本机记录。');
  };

  if (!ready) return <p className="cs-me-loading">正在读取本机学习记录…</p>;

  return (
    <div className="cs-me">
      <section className="cs-me-section">
        <h2>最近学习</h2>
        {recentItems.length > 0 ? (
          <ul className="cs-me-recent-grid">
            {recentItems.map((chapter) => {
              const stats = seriesBySlug.get(chapter.seriesSlug);
              const percent = stats && stats.total ? Math.round((stats.done / stats.total) * 100) : 0;
              return (
                <li key={chapter.id} className="cs-me-recent">
                  <div className="cs-me-recent-main">
                    <div className="cs-me-recent-top">
                      <span className="cs-me-recent-kicker">
                        <BookOpen size={12} aria-hidden="true" />
                        {chapter.seriesTitle}
                      </span>
                      {state.completed[chapter.id] && (
                        <span className="cs-me-recent-done">已完成</span>
                      )}
                    </div>
                    <a className="cs-me-recent-title" href={withBase(`/${chapter.id}/`)}>
                      {chapter.title}
                    </a>
                    <div className="cs-me-recent-meta">
                      <span>{stats ? `${stats.done}/${stats.total} 章` : ''}</span>
                      <span className="cs-me-recent-percent">{percent}%</span>
                    </div>
                  </div>
                  <a className="cs-me-recent-action" href={withBase(`/${chapter.id}/`)}>
                    继续
                    <ArrowRight size={14} aria-hidden="true" />
                  </a>
                  {stats && (
                    <div className="cs-me-bar" aria-hidden="true">
                      <span style={{ width: `${percent}%` }} />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="cs-me-empty">还没有学习记录。去首页挑一条路线开始吧。</p>
        )}
      </section>

      <section className="cs-me-section">
        <h2>我的收藏</h2>

        <h3 className="cs-me-subtitle">教程</h3>
        {favoriteSeries.length > 0 ? (
          <ul className="cs-me-grid">
            {favoriteSeries.map((item) => {
              const percent = item.total ? Math.round((item.done / item.total) * 100) : 0;
              return (
                <li key={item.slug} className="cs-me-favorite">
                  <div className="cs-me-favorite-head">
                    <div className="cs-me-favorite-main">
                      <a className="cs-me-favorite-title" href={withBase(item.href)}>
                        {item.title}
                      </a>
                      <small>教程</small>
                    </div>
                    <button
                      type="button"
                      className="cs-me-remove"
                      onClick={() => toggleFavorite(`series:${item.slug}`)}
                      aria-label={`取消收藏 ${item.title}`}
                      title="取消收藏"
                    >
                      <StarOff size={15} aria-hidden="true" />
                    </button>
                  </div>
                  <div className="cs-me-favorite-meta">
                    <span>{percent}%</span>
                    <span>
                      {item.done}/{item.total} 章
                    </span>
                  </div>
                  <div className="cs-me-bar" aria-hidden="true">
                    <span style={{ width: `${percent}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="cs-me-empty">还没有收藏教程。</p>
        )}

        <h3 className="cs-me-subtitle">路线</h3>
        {routeStats.length > 0 ? (
          <ul className="cs-me-grid">
            {routeStats.map((route) => (
              <li key={route.id} className="cs-me-favorite">
                <div className="cs-me-favorite-head">
                  <div className="cs-me-favorite-main">
                    <a className="cs-me-favorite-title" href={withBase(route.href)}>
                      {route.title}
                    </a>
                    <small>{route.marked ? '学习路线 · 已完成' : '学习路线'}</small>
                  </div>
                  <div className="cs-me-favorite-actions">
                    <button
                      type="button"
                      className={`cs-me-complete${route.marked ? ' is-done' : ''}`}
                      onClick={() => toggleComplete(route.id)}
                      aria-label={route.marked ? `取消完成 ${route.title}` : `标记完成 ${route.title}`}
                      title={route.marked ? '取消完成' : '标记完成'}
                    >
                      <Check size={15} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="cs-me-remove"
                      onClick={() => toggleFavorite(route.id)}
                      aria-label={`取消收藏 ${route.title}`}
                      title="取消收藏"
                    >
                      <StarOff size={15} aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="cs-me-favorite-meta">
                  <span>{route.percent}%</span>
                  <span>
                    {route.done}/{route.total} 个教程
                  </span>
                </div>
                <div className="cs-me-bar" aria-hidden="true">
                  <span style={{ width: `${route.percent}%` }} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="cs-me-empty">还没有收藏路线。</p>
        )}
      </section>

      <section className="cs-me-section">
        <h2>数据管理</h2>
        <div className="cs-me-actions">
          <button type="button" className="cs-btn cs-me-action" onClick={exportData}>
            <Download size={16} aria-hidden="true" />
            导出进度
          </button>
          <label className="cs-btn cs-me-action cs-me-import">
            <Upload size={16} aria-hidden="true" />
            导入进度
            <input type="file" accept="application/json,.json" onChange={importData} />
          </label>
          <button type="button" className="cs-btn cs-me-action cs-me-danger" onClick={clearAll}>
            <Trash2 size={16} aria-hidden="true" />
            清空记录
          </button>
        </div>
        {message && (
          <p className="cs-me-message" role="status">
            {message}
          </p>
        )}
      </section>
    </div>
  );
}
