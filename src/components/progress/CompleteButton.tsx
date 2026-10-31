import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { markRecent, PROGRESS_EVENT, readProgress, toggleComplete } from '@/lib/progress';

interface Props {
  slug: string;
  label?: string;
  activeLabel?: string;
  /** 章节页需要写入最近学习；路线级完成不需要 */
  trackRecent?: boolean;
}

export default function CompleteButton({
  slug,
  label = '标记本章完成',
  activeLabel = '已完成本章',
  trackRecent = true,
}: Props) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (trackRecent) markRecent(slug);
    setCompleted(Boolean(readProgress().completed[slug]));
    const refresh = () => setCompleted(Boolean(readProgress().completed[slug]));
    window.addEventListener(PROGRESS_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [slug, trackRecent]);

  return (
    <button
      type="button"
      className={`cs-btn${completed ? ' cs-btn-done' : ' cs-btn-primary'}`}
      aria-pressed={completed}
      onClick={() => setCompleted(toggleComplete(slug))}
    >
      <Check size={16} aria-hidden="true" />
      {completed ? activeLabel : label}
    </button>
  );
}
