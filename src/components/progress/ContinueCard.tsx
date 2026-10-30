import { useEffect, useState } from 'react';
import { emptyProgress, PROGRESS_EVENT, readProgress } from '@/lib/progress';
import { withBase } from '@/lib/utils';

interface Chapter {
  id: string;
  title: string;
  duration?: number;
}
interface Series {
  slug: string;
  title: string;
  chapters: Chapter[];
  totalDuration: number;
}

interface Target {
  seriesSlug: string;
  seriesTitle: string;
  chapterId: string;
  chapterTitle: string;
  total: number;
  done: number;
}

function pickTarget(series: Series[], state = readProgress()): Target | null {
  const all = series.flatMap((item) =>
    item.chapters.map((chapter) => ({ series: item, chapter })),
  );
  if (all.length === 0) return null;

  const recentIncomplete = state.recent
    .map((entry) => all.find((item) => item.chapter.id === entry.id))
    .find((item) => item && !state.completed[item.chapter.id]);

  // 没有学习记录时，优先从 Git 教程开始（工具链是大多数路线的起点）
  const preferred =
    all.find((item) => item.series.slug === 'git' && !state.completed[item.chapter.id]) ??
    all.find((item) => !state.completed[item.chapter.id]) ??
    all[0];

  const target = recentIncomplete ?? preferred;
  const done = all.filter((item) => state.completed[item.chapter.id]).length;
  return {
    seriesSlug: target.series.slug,
    seriesTitle: target.series.title,
    chapterId: target.chapter.id,
    chapterTitle: target.chapter.title,
    total: all.length,
    done,
  };
}

export default function ContinueCard({ series }: { series: Series[] }) {
  // 首屏用空进度：服务端与客户端初始渲染一致，挂载后再读 localStorage，避免 hydration 不匹配
  const [target, setTarget] = useState<Target | null>(() => pickTarget(series, emptyProgress()));

  useEffect(() => {
    const refresh = () => setTarget(pickTarget(series));
    refresh();
    window.addEventListener(PROGRESS_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [series]);

  if (!target) return null;
  const percent = target.total ? Math.round((target.done / target.total) * 100) : 0;

  return (
    <section className="cs-continue">
      <div className="cs-continue-main">
        <p className="cs-continue-kicker">继续学习</p>
        <h2>
          <a href={withBase(`/${target.chapterId}/`)}>{target.chapterTitle}</a>
        </h2>
        <p>
          {target.seriesTitle} · 全站已完成 {target.done}/{target.total} 章（{percent}%）
        </p>
      </div>
      <a className="cs-btn cs-btn-primary" href={withBase(`/${target.chapterId}/`)}>
        继续这一章
      </a>
    </section>
  );
}
