export interface ProgressState {
  completed: Record<string, number>;
  favorites: string[];
  recent: { id: string; at: number }[];
}

const KEY = 'cs101:progress:v1';
const empty: ProgressState = { completed: {}, favorites: [], recent: [] };

export function readProgress(): ProgressState {
  if (typeof localStorage === 'undefined') return { ...empty };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...empty };
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      completed: parsed.completed ?? {},
      favorites: parsed.favorites ?? [],
      recent: parsed.recent ?? [],
    };
  } catch {
    return { ...empty };
  }
}

export function writeProgress(state: ProgressState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent('cs101:progress'));
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
