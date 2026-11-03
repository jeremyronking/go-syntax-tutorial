import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/theme';
import { useUIStore } from '../store/ui';

export default function TopBar() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const openPalette = useUIStore((state) => state.openPalette);

  return (
    <header className="sticky top-0 z-40 border-b border-divider bg-app/90 backdrop-blur">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-5">
        <Link
          to="/"
          className="flex items-baseline gap-2 rounded font-semibold tracking-tight"
          aria-label="GoTour home"
        >
          <span className="font-mono text-lg text-gopher-400">Go</span>
          <span className="text-lg">Tour</span>
        </Link>

        <div className="flex-1" />

        <button
          type="button"
          onClick={openPalette}
          className="hidden items-center gap-2 rounded-md border border-divider bg-elevated px-3 py-1.5 text-sm text-muted transition-colors hover:border-gopher-600 hover:text-fg sm:flex"
          aria-label="Search lessons (Command or Control K)"
          title="Search lessons"
        >
          <span>Search lessons</span>
          <kbd className="rounded border border-divider bg-card px-1.5 py-0.5 font-mono text-[11px] text-subtle">
            &#8984;K
          </kbd>
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-md border border-divider bg-elevated p-2 text-muted transition-colors hover:border-gopher-600 hover:text-fg"
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}
