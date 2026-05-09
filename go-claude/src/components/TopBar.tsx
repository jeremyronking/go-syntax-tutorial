import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

export function TopBar({ onSearchTrigger }: { onSearchTrigger?: () => void }) {
  return (
    <header className="border-b border-ink-800 bg-ink-950/95 backdrop-blur sticky top-0 z-30">
      <div className="flex items-center gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-widest text-gopher">GoTour</span>
        </Link>
        <button
          type="button"
          onClick={onSearchTrigger}
          className="ml-auto flex items-center gap-2 rounded-md border border-ink-700 px-3 py-1 text-sm text-ink-300 hover:border-gopher hover:text-gopher transition-colors"
          aria-label="Open search"
        >
          <span>Search</span>
          <kbd className="rounded bg-ink-800 px-1.5 py-0.5 text-[10px] font-mono">⌘ K</kbd>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
