import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { search, type SearchHit } from '@/lib/search';

const RECENT_KEY = 'cs101:recent-searches';

function readRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
}

function saveRecent(query: string) {
  const next = [query, ...readRecent().filter((item) => item !== query)].slice(0, 6);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export default function SearchLauncher() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestId = useRef(0);

  const openDialog = useCallback(() => {
    setOpen(true);
    setRecent(readRecent());
    setQuery('');
    setHits([]);
    setActive(0);
  }, []);

  const closeDialog = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((value) => {
          if (!value) {
            setRecent(readRecent());
          }
          return !value;
        });
      }
      if (event.key === 'Escape') setOpen(false);
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('[data-search-open]')) {
        event.preventDefault();
        openDialog();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('click', onClick);
    };
  }, [openDialog]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    const current = ++requestId.current;
    if (!query.trim()) {
      setHits([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = window.setTimeout(() => {
      search(query)
        .then((results) => {
          if (current !== requestId.current) return;
          setHits(results);
          setActive(0);
        })
        .catch(() => {
          if (current === requestId.current) setHits([]);
        })
        .finally(() => {
          if (current === requestId.current) setLoading(false);
        });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [query]);

  const go = useCallback(
    (hit: SearchHit | undefined) => {
      if (!hit) return;
      saveRecent(query.trim() || hit.pageTitle);
      setRecent(readRecent());
      window.location.href = hit.url;
    },
    [query],
  );

  const onInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((value) => Math.min(value + 1, Math.max(hits.length - 1, 0)));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((value) => Math.max(value - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      go(hits[active]);
    }
  };

  return (
    <>
      <button type="button" className="cs-search-trigger" onClick={openDialog} aria-label="搜索教程">
        <span className="cs-search-trigger-label">搜索</span>
        <kbd>Ctrl K</kbd>
      </button>

      {open && (
        <div className="cs-search-overlay" role="dialog" aria-modal="true" aria-label="搜索教程">
          <div className="cs-search-scrim" onClick={closeDialog} />
          <div className="cs-search-panel">
            <div className="cs-search-field">
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="搜索教程、章节、小节…"
                aria-label="搜索关键词"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd>Esc</kbd>
            </div>

            <div className="cs-search-body">
              {!query.trim() && (
                <div className="cs-search-recent">
                  <p className="cs-search-hint">输入关键词搜索；中文按词切分，支持前缀与模糊匹配。</p>
                  {recent.length > 0 && (
                    <>
                      <p className="cs-search-subtitle">最近搜索</p>
                      <div className="cs-search-chips">
                        {recent.map((item) => (
                          <button key={item} type="button" onClick={() => setQuery(item)}>
                            {item}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {query.trim() && (
                <ul className="cs-search-results">
                  {hits.map((hit, index) => (
                    <li key={hit.id}>
                      <button
                        type="button"
                        className={index === active ? 'is-active' : ''}
                        onMouseEnter={() => setActive(index)}
                        onClick={() => go(hit)}
                      >
                        <span className="cs-search-result-title">
                          {hit.pageTitle}
                          {hit.heading && <span className="cs-search-result-heading"> / {hit.heading}</span>}
                        </span>
                        <span className="cs-search-result-text">{hit.text.slice(0, 90)}</span>
                      </button>
                    </li>
                  ))}
                  {!loading && hits.length === 0 && (
                    <li className="cs-search-empty">没有找到结果，换个关键词试试。</li>
                  )}
                  {loading && <li className="cs-search-empty">搜索中…</li>}
                </ul>
              )}
            </div>

            <div className="cs-search-footer">
              <span>↑↓ 选择</span>
              <span>Enter 打开</span>
              <span>Esc 关闭</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
