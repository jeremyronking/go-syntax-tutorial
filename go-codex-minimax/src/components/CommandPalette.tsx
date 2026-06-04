import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchLessons, type SearchHit } from '../lib/search';
import { SECTIONS } from '../content/sections';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps): JSX.Element | null {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const hits: SearchHit[] = useMemo(() => {
    if (!open) return [];
    return searchLessons(query, 20);
  }, [query, open]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setActive(0);
      if (previouslyFocused.current && document.contains(previouslyFocused.current)) {
        previouslyFocused.current.focus();
      }
      return;
    }
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((a) => Math.min(hits.length - 1, a + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
      } else if (e.key === 'Enter') {
        const hit = hits[active];
        if (hit) {
          e.preventDefault();
          navigate(`/lesson/${hit.lesson.slug}`);
          onClose();
        }
      } else if (e.key === 'Tab') {
        // basic focus trap
        const focusables = [inputRef.current].filter(Boolean) as HTMLElement[];
        if (focusables.length === 0) return;
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, hits, navigate, onClose, open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search lessons"
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink-950/70 p-4 pt-20 backdrop-blur"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-lg border border-ink-700 bg-ink-900 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="border-b border-ink-800 p-3">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons by title, section, or prose…"
            className="w-full bg-transparent text-base text-ink-50 placeholder:text-ink-500 focus:outline-none"
            aria-label="Search input"
            aria-controls="palette-results"
            aria-activedescendant={hits[active] ? `palette-hit-${active}` : undefined}
            role="combobox"
            aria-expanded
            aria-autocomplete="list"
          />
        </div>
        <ul
          ref={listRef}
          id="palette-results"
          role="listbox"
          className="max-h-80 overflow-y-auto"
        >
          {hits.length === 0 ? (
            <li className="p-4 text-sm text-ink-400">
              {query ? 'No lessons match.' : 'Type to search.'}
            </li>
          ) : (
            hits.map((h, i) => {
              const section = SECTIONS.find((s) => s.id === h.lesson.section);
              const isActive = i === active;
              return (
                <li
                  key={h.lesson.slug}
                  id={`palette-hit-${i}`}
                  role="option"
                  aria-selected={isActive}
                >
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => {
                      navigate(`/lesson/${h.lesson.slug}`);
                      onClose();
                    }}
                    className={`flex w-full flex-col gap-1 px-3 py-2 text-left ${
                      isActive ? 'bg-ink-800/80' : 'bg-transparent hover:bg-ink-800/40'
                    }`}
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xs text-gopher-cyan">
                        {h.lesson.section}
                      </span>
                      <span className="font-medium text-ink-50">{h.lesson.title}</span>
                    </div>
                    <div className="text-xs text-ink-400">
                      {section?.title} · {h.snippet}
                    </div>
                  </button>
                </li>
              );
            })
          )}
        </ul>
        <div className="flex items-center gap-3 border-t border-ink-800 px-3 py-2 text-[10px] text-ink-500">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
