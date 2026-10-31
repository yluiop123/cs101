export interface ProgressState {
  completed: Record<string, number>;
  favorites: string[];
  recent: { id: string; at: number }[];
}

export const PROGRESS_KEY = 'cs101:progress:v1';
export const PROGRESS_EVENT = 'cs101:progress';

/** 每次返回新对象：避免调用方修改到共享的嵌套字段 */
export function emptyProgress(): ProgressState {
  return { completed: {}, favorites: [], recent: [] };
}

export function readProgress(): ProgressState {
  if (typeof localStorage === 'undefined') return emptyProgress();
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    const favorites = Array.isArray(parsed.favorites)
      ? [...new Set(parsed.favorites.filter((id): id is string => typeof id === 'string').map(normalizeFavorite))]
      : [];
    return {
      completed: parsed.completed ?? {},
      favorites,
      recent: parsed.recent ?? [],
    };
  } catch {
    return emptyProgress();
  }
}

/** 兼容旧数据：章节收藏统一归到教程（series:<slug>） */
function normalizeFavorite(id: string): string {
  if (id.startsWith('series:') || id.startsWith('route:')) return id;
  const tutorial = id.match(/^tutorials\/([^/]+)\//);
  if (tutorial) return `series:${tutorial[1]}`;
  const business = id.match(/^business-systems\/([^/]+)\//);
  if (business) return `series:business-${business[1]}`;
  return id;
}

export function writeProgress(state: ProgressState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(PROGRESS_EVENT));
}

export function toggleComplete(id: string) {
  const state = readProgress();
  if (state.completed[id]) delete state.completed[id];
  else state.completed[id] = Date.now();
  writeProgress(state);
  return Boolean(state.completed[id]);
}

export function toggleFavorite(id: string) {
  const state = readProgress();
  state.favorites = state.favorites.includes(id)
    ? state.favorites.filter((item) => item !== id)
    : [...state.favorites, id];
  writeProgress(state);
  return state.favorites.includes(id);
}

export function markRecent(id: string) {
  const state = readProgress();
  state.recent = [{ id, at: Date.now() }, ...state.recent.filter((item) => item.id !== id)].slice(0, 20);
  writeProgress(state);
}
