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
    return {
      completed: parsed.completed ?? {},
      favorites: parsed.favorites ?? [],
      recent: parsed.recent ?? [],
    };
  } catch {
    return emptyProgress();
  }
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
