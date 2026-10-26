import { useEffect, useState } from 'react';
import { markRecent, readProgress, toggleComplete } from '@/lib/progress';

export default function CompleteButton({ slug }: { slug: string }) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    markRecent(slug);
    setCompleted(Boolean(readProgress().completed[slug]));
    const refresh = () => setCompleted(Boolean(readProgress().completed[slug]));
    window.addEventListener('cs101:progress', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('cs101:progress', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [slug]);

  return (
    <button
      type="button"
      className={`cs-btn${completed ? ' cs-btn-done' : ' cs-btn-primary'}`}
      aria-pressed={completed}
      onClick={() => setCompleted(toggleComplete(slug))}
    >
      {completed ? '✓ 已完成本章' : '标记本章完成'}
    </button>
  );
}
