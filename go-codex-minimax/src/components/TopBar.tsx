import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/theme';

interface TopBarProps {
  onOpenSearch: () => void;
}

export function TopBar({ onOpenSearch }: TopBarProps): JSX.Element {
  const theme = useThemeStore((s) => s.theme);
  const toggle = useThemeStore((s) => s.toggle);
  const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform);
  const mod = isMac ? '⌘' : 'Ctrl';
  return (
    <header className="sticky top-0 z-30 flex h-12 items-center gap-3 border-b border-ink-800 bg-ink-950/85 px-3 backdrop-blur supports-[backdrop-filter]:bg-ink-950/70">
      <Link to="/" className="flex items-center gap-2 text-ink-50">
        <span aria-hidden className="inline-block h-5 w-5 rounded bg-gopher-cyan" />
        <span className="font-semibold tracking-tight">GoTour</span>
      </Link>
      <button
        type="button"
        onClick={onOpenSearch}
        className="ml-2 flex w-full max-w-sm items-center gap-2 rounded border border-ink-700 bg-ink-900 px-2 py-1 text-left text-sm text-ink-400 hover:border-ink-600"
      >
        <span>Search lessons…</span>
        <span className="ml-auto rounded bg-ink-800 px-1.5 py-0.5 font-mono text-xs text-ink-300">
          {mod}K
        </span>
      </button>
      <div className="ml-auto flex items-center gap-2">
        <a
          href="https://go.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-ink-400 hover:text-gopher-cyan"
        >
          go.dev
        </a>
        <button
          type="button"
          onClick={toggle}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          className="rounded border border-ink-700 px-2 py-1 text-xs text-ink-200 hover:border-gopher-cyan hover:text-gopher-cyan"
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>
    </header>
  );
}
