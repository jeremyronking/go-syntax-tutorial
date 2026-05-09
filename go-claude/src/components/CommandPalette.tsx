import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { search, type SearchResult } from '../lib/search';

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo<SearchResult[]>(() => (open ? search(query) : []), [query, open]);

  useEffect(() => {
    if (!open) return;
    setActive(0);
    const id = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [open]);

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
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const r = results[active];
        if (r) {
          navigate(`/lesson/${r.lesson.slug}`);
          onClose();
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
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] bg-black/60"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-md border border-divider bg-elevated shadow-2xl overflow-hidden"
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search lessons…"
          className="w-full bg-transparent px-4 py-3 text-base text-fg placeholder:text-fg-subtle outline-none border-b border-divider"
        />
        <ul className="max-h-[50vh] overflow-y-auto py-1">
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
                  'w-full text-left px-4 py-2 flex items-center gap-3',
                  i === active ? 'bg-divider' : 'hover:bg-divider/60',
                ].join(' ')}
              >
                <span className="font-mono text-[10px] text-gopher w-4">{r.sectionLetter}</span>
                <span className="flex-1 truncate text-fg">{r.lesson.title}</span>
                <span className="text-xs text-fg-subtle truncate">{r.sectionTitle}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="px-4 py-2 text-[10px] font-mono text-fg-subtle border-t border-divider flex justify-between">
          <span>↑↓ navigate · ↵ open · esc close</span>
          <span>{results.length} result{results.length === 1 ? '' : 's'}</span>
        </div>
      </div>
    </div>
  );
}
