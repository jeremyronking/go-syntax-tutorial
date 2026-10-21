import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { ResetProgress } from './ResetProgress';

/**
 * App shell. Three panes on `lg+` (sidebar / prose / editor), two panes on
 * `md` (prose above the code pane), stacked on small screens.
 */
export function Layout() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-app text-fg">
      <TopBar onSearchTrigger={() => setPaletteOpen(true)} />
      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-6 py-5 lg:px-10">
            <p className="font-mono text-[10px] uppercase tracking-widest text-fg-subtle">
              GoTour · localStorage namespace gotour:v1
            </p>
            <ResetProgress />
          </footer>
        </main>
      </div>

      {paletteOpen && (
        <div
          role="dialog"
          aria-label="Search lessons"
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[12vh]"
          onClick={() => setPaletteOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-md border border-line bg-surface p-6 shadow-2xl"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-gopher">Search</p>
            <p className="mt-2 text-sm text-fg-muted">
              Fuzzy lesson search ships in Phase 09. The palette shell is wired — press{' '}
              <kbd className="rounded border border-line px-1 font-mono text-xs">esc</kbd> to dismiss.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
