import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

export function TopBar({ onSearchTrigger }: { onSearchTrigger?: () => void }) {
  return (
    <header className="border-b border-divider bg-app/95 backdrop-blur sticky top-0 z-30 h-12">
      <div className="flex items-center gap-4 px-4 h-full">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-widest text-gopher">GoTour</span>
        </Link>
        <button
          type="button"
          onClick={onSearchTrigger}
          className="ml-auto flex items-center gap-2 rounded-md border border-divider px-3 py-1 text-sm text-fg-muted hover:border-gopher hover:text-gopher transition-colors"
          aria-label="Open search"
        >
          <span>Search</span>
          <kbd className="rounded bg-divider px-1.5 py-0.5 text-[10px] font-mono">⌘ K</kbd>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
