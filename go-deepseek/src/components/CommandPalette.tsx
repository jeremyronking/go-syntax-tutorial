import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchLessons, type SearchResult } from '../lib/search';
import { sectionForLesson } from '../content/lessons';
import { useUIStore } from '../store/ui';

export default function CommandPalette() {
  const open = useUIStore((state) => state.paletteOpen);
  const openPalette = useUIStore((state) => state.openPalette);
  const closePalette = useUIStore((state) => state.closePalette);
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const results = useMemo(() => searchLessons(debounced), [debounced]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (useUIStore.getState().paletteOpen) closePalette();
        else openPalette();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closePalette, openPalette]);

  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setQuery('');
    setDebounced('');
    setActive(0);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => {
      window.clearTimeout(timer);
      previousFocus.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query), 120);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setActive(0);
  }, [debounced]);

  if (!open) return null;

  const go = (result: SearchResult | undefined) => {
    if (!result) return;
    closePalette();
    navigate(`/lesson/${result.lesson.slug}`);
  };

  const onDialogKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closePalette();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, results.length - 1));
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      go(results[active]);
      return;
    }
    if (event.key === 'Tab') {
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'input, button:not([disabled]), a[href]'
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[12vh]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closePalette();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search lessons"
        onKeyDown={onDialogKeyDown}
        className="w-full max-w-xl overflow-hidden rounded-xl border border-divider bg-elevated shadow-2xl"
      >
        <div className="border-b border-divider px-4 py-3">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search lessons…"
            aria-label="Search lessons"
            aria-controls="palette-results"
            aria-activedescendant={results[active] ? `palette-result-${active}` : undefined}
            className="w-full bg-transparent text-base text-fg placeholder:text-subtle focus:outline-none"
          />
        </div>

        <ul
          id="palette-results"
          role="listbox"
          aria-label="Matching lessons"
          className="max-h-[52vh] overflow-y-auto py-1"
        >
          {results.length === 0 ? (
            <li className="px-4 py-6 text-sm text-subtle">No lessons match “{query}”.</li>
          ) : (
            results.map((result, index) => {
              const section = sectionForLesson(result.lesson);
              return (
                <li key={result.lesson.slug} role="option" aria-selected={index === active}>
                  <button
                    type="button"
                    id={`palette-result-${index}`}
                    onClick={() => go(result)}
                    onMouseEnter={() => setActive(index)}
                    className={`block w-full px-4 py-2.5 text-left ${
                      index === active ? 'bg-gopher-900/40' : 'hover:bg-card'
                    }`}
                  >
                    <span className="flex items-baseline gap-2">
                      <span className="text-sm font-medium text-fg">{result.lesson.title}</span>
                      <span className="text-[11px] text-subtle">
                        {section ? `${section.letter} · ${section.title}` : ''}
                      </span>
                    </span>
                    <span className="mt-0.5 line-clamp-1 block text-xs text-muted">
                      {result.snippet}
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>

        <div className="flex items-center gap-3 border-t border-divider px-4 py-2 text-[11px] text-subtle">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
