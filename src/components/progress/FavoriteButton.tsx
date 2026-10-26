import { useEffect, useState } from 'react';
import { readProgress, toggleFavorite } from '@/lib/progress';

export default function FavoriteButton({ slug }: { slug: string }) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(readProgress().favorites.includes(slug));
    const refresh = () => setFavorite(readProgress().favorites.includes(slug));
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
      className={`cs-btn${favorite ? ' cs-btn-done' : ''}`}
      aria-pressed={favorite}
      onClick={() => setFavorite(toggleFavorite(slug))}
    >
      {favorite ? '★ 已收藏' : '☆ 收藏本章'}
    </button>
  );
}
