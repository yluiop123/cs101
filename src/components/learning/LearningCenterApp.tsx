import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import {
  emptyProgress,
  PROGRESS_EVENT,
  readProgress,
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

interface Props {
  chapters: ChapterRef[];
  series: SeriesRef[];
}

export default function LearningCenterApp({ chapters, series }: Props) {
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

  const chaptersBySeries = useMemo(() => {
    const map = new Map<string, ChapterRef[]>();
    for (const chapter of chapters) {
      const list = map.get(chapter.seriesSlug);
      if (list) list.push(chapter);
      else map.set(chapter.seriesSlug, [chapter]);
    }
    return map;
  }, [chapters]);

  const completedCount = Object.keys(state.completed).filter((id) => chapterById.has(id)).length;
  const percent = chapters.length ? Math.round((completedCount / chapters.length) * 100) : 0;
  const percentLabel = completedCount > 0 && percent === 0 ? '<1' : String(percent);

  const favorites = state.favorites
    .map((id) => chapterById.get(id))
    .filter((chapter): chapter is ChapterRef => Boolean(chapter));

  const recent = state.recent
    .map((entry) => chapterById.get(entry.id))
    .filter((chapter): chapter is ChapterRef => Boolean(chapter));
  const recentIncomplete = recent.filter((chapter) => !state.completed[chapter.id]).slice(0, 5);
  // 最近章节已完成时，优先接上同一系列的下一章；完全没有记录时不硬推一条
  const lastRecent = recent[0];
  const nextInRecentSeries = lastRecent
    ? (chaptersBySeries.get(lastRecent.seriesSlug) ?? []).find(
        (chapter) => !state.completed[chapter.id],
      )
    : undefined;
  const next =
    recentIncomplete[0] ??
    nextInRecentSeries ??
    (completedCount > 0 ? chapters.find((chapter) => !state.completed[chapter.id]) : undefined);
  const continueItems = recentIncomplete.length > 0 ? recentIncomplete : next ? [next] : [];

  const seriesProgress = series
    .map((item) => {
      const list = chaptersBySeries.get(item.slug) ?? [];
      const done = list.filter((chapter) => state.completed[chapter.id]).length;
      return { ...item, done, total: list.length };
    })
    .filter((item) => item.done > 0)
    .sort((a, b) => b.done / b.total - a.done / a.total);

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
      <p className="cs-me-note">进度与收藏保存在本机浏览器，无需登录。</p>

      <section className="cs-me-stats" aria-label="学习统计">
        <div className="cs-me-stat">
          <span>已完成章节</span>
          <strong>{completedCount}</strong>
          <small>
            / {chapters.length} 章 · {percentLabel}%
          </small>
        </div>
        <div className="cs-me-stat">
          <span>收藏章节</span>
          <strong>{favorites.length}</strong>
          <small>本机收藏</small>
        </div>
        <div className="cs-me-stat">
          <span>最近学习</span>
          <strong>{recent[0]?.title ?? '—'}</strong>
          <small>{recent[0]?.seriesTitle ?? '还没有记录'}</small>
        </div>
      </section>

      <section className="cs-me-section">
        <div className="cs-me-head">
          <h2>继续学习</h2>
          {next && (
            <a className="cs-btn cs-btn-primary" href={withBase(`/${next.id}/`)}>
              继续这一章
            </a>
          )}
        </div>
        {continueItems.length > 0 ? (
          <ul className="cs-me-list">
            {continueItems.map((chapter) => (
              <li key={chapter.id} className="cs-me-item">
                <a href={withBase(`/${chapter.id}/`)}>
                  <span>{chapter.title}</span>
                  <small>{chapter.seriesTitle}</small>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="cs-me-empty">
            {completedCount === chapters.length && chapters.length > 0
              ? '全站章节都已完成。'
              : '还没有学习记录。去首页挑一条路线开始吧。'}
          </p>
        )}
      </section>

      <section className="cs-me-section">
        <h2>我的收藏</h2>
        {favorites.length > 0 ? (
          <ul className="cs-me-list">
            {favorites.map((chapter) => (
              <li key={chapter.id} className="cs-me-item">
                <a href={withBase(`/${chapter.id}/`)}>
                  <span>{chapter.title}</span>
                  <small>{chapter.seriesTitle}</small>
                </a>
                <button
                  type="button"
                  className="cs-me-remove"
                  onClick={() => toggleFavorite(chapter.id)}
                >
                  取消收藏
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="cs-me-empty">还没有收藏章节。章节页底部可以点「收藏本章」。</p>
        )}
      </section>

      <section className="cs-me-section">
        <h2>各系列进度</h2>
        {seriesProgress.length > 0 ? (
          <ul className="cs-me-series">
            {seriesProgress.map((item) => (
              <li key={item.slug}>
                <div className="cs-me-series-head">
                  <a href={withBase(item.href)}>{item.title}</a>
                  <span>
                    {item.done}/{item.total}
                  </span>
                </div>
                <div className="cs-me-bar" aria-hidden="true">
                  <span style={{ width: `${Math.round((item.done / item.total) * 100)}%` }} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="cs-me-empty">开始学习后，这里会显示每个系列的完成进度。</p>
        )}
      </section>

      <section className="cs-me-section">
        <h2>数据管理</h2>
        <div className="cs-me-actions">
          <button type="button" className="cs-btn" onClick={exportData}>
            导出进度
          </button>
          <label className="cs-btn cs-me-import">
            导入进度
            <input type="file" accept="application/json,.json" onChange={importData} />
          </label>
          <button type="button" className="cs-btn cs-me-danger" onClick={clearAll}>
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
