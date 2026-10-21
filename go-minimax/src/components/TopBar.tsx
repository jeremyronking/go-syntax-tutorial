import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

export function TopBar({ onSearchTrigger }: { onSearchTrigger: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-12 items-center gap-4 border-b border-line bg-app/95 px-4 backdrop-blur lg:px-6">
      <Link to="/" className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="flex size-6 items-center justify-center rounded bg-gopher font-mono text-[11px] font-bold text-ink-950"
        >
          G
        </span>
        <span className="font-mono text-sm font-semibold tracking-tight text-fg">GoTour</span>
      </Link>

      <span className="hidden font-mono text-[10px] uppercase tracking-widest text-fg-subtle sm:inline">
        Go syntax &amp; toolchain
      </span>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onSearchTrigger}
          aria-label="Search lessons"
          className="flex items-center gap-2 rounded border border-line px-2 py-1 text-xs text-fg-muted transition-colors hover:border-gopher hover:text-gopher"
        >
          <span aria-hidden="true">⌕</span>
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden rounded border border-line px-1 font-mono text-[10px] text-fg-subtle md:inline">
            ⌘K
          </kbd>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
