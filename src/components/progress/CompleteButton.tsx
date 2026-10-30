import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { markRecent, PROGRESS_EVENT, readProgress, toggleComplete } from '@/lib/progress';

export default function CompleteButton({ slug }: { slug: string }) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    markRecent(slug);
    setCompleted(Boolean(readProgress().completed[slug]));
    const refresh = () => setCompleted(Boolean(readProgress().completed[slug]));
    window.addEventListener(PROGRESS_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, refresh);
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
      <Check size={16} aria-hidden="true" />
      {completed ? '已完成本章' : '标记本章完成'}
    </button>
  );
}
