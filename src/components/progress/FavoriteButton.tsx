import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { PROGRESS_EVENT, readProgress, toggleFavorite } from '@/lib/progress';

interface Props {
  slug: string;
  label?: string;
  activeLabel?: string;
}

export default function FavoriteButton({
  slug,
  label = '收藏本章',
  activeLabel = '已收藏',
}: Props) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(readProgress().favorites.includes(slug));
    const refresh = () => setFavorite(readProgress().favorites.includes(slug));
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
      className={`cs-btn${favorite ? ' cs-btn-done' : ''}`}
      aria-pressed={favorite}
      onClick={() => setFavorite(toggleFavorite(slug))}
    >
      <Star size={16} fill={favorite ? 'currentColor' : 'none'} aria-hidden="true" />
      {favorite ? activeLabel : label}
    </button>
  );
}
