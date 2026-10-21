import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { search, type SearchResult } from '../lib/search';

/**
 * Cmd/Ctrl+K command palette. Modal, focus-trapped, arrow-key navigable.
 */
export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();

  const results = useMemo<SearchResult[]>(() => (open ? search(query) : []), [query, open]);

  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    setQuery('');
    setActive(0);
    const id = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [open]);

  // Restore focus to whatever had it before the palette opened.
  useEffect(() => {
    if (open) return;
    restoreFocusRef.current?.focus?.();
    restoreFocusRef.current = null;
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
          navigate(`/lesson/${r.lesson.slug}`);
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
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          placeholder="Search lessons…"
          aria-label="Search lessons"
          aria-controls="palette-results"
          className="w-full border-b border-line bg-transparent px-4 py-3 text-base text-fg outline-none placeholder:text-fg-subtle"
        />

        <ul ref={listRef} id="palette-results" className="max-h-[50vh] overflow-y-auto py-1">
          {results.length === 0 && (
            <li className="px-4 py-6 text-sm text-fg-muted">No matches.</li>
          )}
          {results.map((r, i) => (
            <li key={r.lesson.slug}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => {
                  navigate(`/lesson/${r.lesson.slug}`);
                  onClose();
                }}
                className={[
                  'flex w-full items-center gap-3 px-4 py-2 text-left',
                  i === active ? 'bg-line/60' : 'hover:bg-line/40',
                ].join(' ')}
              >
                <span className="w-4 shrink-0 font-mono text-[10px] text-gopher">
                  {r.sectionLetter}
                </span>
                <span className="flex-1 truncate text-sm text-fg">{r.lesson.title}</span>
                <span className="shrink-0 truncate text-xs text-fg-subtle">
                  {r.sectionTitle}
                </span>
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
