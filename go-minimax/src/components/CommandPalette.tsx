import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SearchResult } from '../lib/search';

/** How long to wait after the last keystroke before re-running the search. */
const QUERY_DEBOUNCE_MS = 120;

/**
 * Cmd/Ctrl+K command palette. Modal, focus-trapped, arrow-key navigable.
 */
export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [rawQuery, setRawQuery] = useState('');
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();

  // Debounce the query so a fast typist does not re-search on every keystroke.
  useEffect(() => {
    const id = window.setTimeout(() => setQuery(rawQuery), QUERY_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [rawQuery]);

  // The prose index is built lazily, so the search is asynchronous. The
  // search module itself — and the fuzzy matcher it pulls in — is only
  // fetched the first time the palette is opened.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void import('../lib/search').then(({ search }) =>
      search(query).then((r) => {
        if (!cancelled) {
          setResults(r);
          setActive(0);
        }
      })
    );
    return () => {
      cancelled = true;
    };
  }, [query, open]);

  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    setRawQuery('');
    setQuery('');
    setActive(0);
    setResults([]);
    const id = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [open]);

  // Restore focus to whatever had it before the palette opened.
  useEffect(() => {
    if (open) return;
    const target = restoreFocusRef.current;
    restoreFocusRef.current = null;
    if (target && document.contains(target)) {
      target.focus();
      return;
    }
    // Fall back to the top-bar search trigger when the opener is gone.
    document.querySelector<HTMLElement>('button[aria-label="Search lessons"]')?.focus();
  }, [open]);

  // Keep the active row scrolled into view.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((i) => Math.min(results.length - 1, i + 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const r = results[active];
        if (r) {
          navigate(`/lesson/${r.slug}`);
          onClose();
        }
        return;
      }
      if (e.key === 'Tab') {
        // Focus trap: the input and the result list are the only stops.
        const focusables = Array.from(
          listRef.current?.querySelectorAll<HTMLElement>('button') ?? []
        );
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === inputRef.current) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, active, navigate, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search lessons"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[12vh]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl overflow-hidden rounded-md border border-line bg-surface shadow-2xl"
      >
        <input
          ref={inputRef}
          value={rawQuery}
          onChange={(e) => {
            setRawQuery(e.target.value);
            setActive(0);
          }}
          placeholder="Search lessons…"
          aria-label="Search lessons"
          aria-controls="palette-results"
          className="w-full border-b border-line bg-transparent px-4 py-3 text-base text-fg outline-none placeholder:text-fg-subtle"
        />

        <ul ref={listRef} id="palette-results" className="max-h-[50vh] overflow-y-auto py-1">
          {results.length === 0 && <li className="px-4 py-6 text-sm text-fg-muted">No matches.</li>}
          {results.map((r, i) => (
            <li key={r.slug}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => {
                  navigate(`/lesson/${r.slug}`);
                  onClose();
                }}
                className={[
                  'flex w-full flex-col gap-0.5 px-4 py-2 text-left',
                  i === active ? 'bg-line/60' : 'hover:bg-line/40',
                ].join(' ')}
              >
                <span className="flex w-full items-center gap-3">
                  <span className="w-4 shrink-0 font-mono text-[10px] text-gopher">
                    {r.sectionLetter}
                  </span>
                  <span className="flex-1 truncate text-sm text-fg">{r.title}</span>
                  <span className="shrink-0 truncate text-xs text-fg-subtle">{r.sectionTitle}</span>
                </span>
                {r.snippet && (
                  <span className="pl-7 text-xs leading-snug text-fg-subtle">{r.snippet}</span>
                )}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex justify-between border-t border-line px-4 py-2 font-mono text-[10px] text-fg-subtle">
          <span>↑↓ navigate · ↵ open · esc close</span>
          <span>
            {results.length} result{results.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>
    </div>
  );
}
