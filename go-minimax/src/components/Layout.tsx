import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { ResetProgress } from './ResetProgress';
import { CommandPalette } from './CommandPalette';

/**
 * App shell. Three panes on `lg+` (sidebar / prose / editor), two panes on
 * `md` (prose above the code pane), stacked on small screens.
 */
export function Layout() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
      <TopBar
        onSearchTrigger={() => setPaletteOpen(true)}
        onMenuToggle={() => setMobileNavOpen((v) => !v)}
      />

      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
          {/* The footer sticks to the bottom of the viewport so that loading
              a lesson — which grows the page from a placeholder to the full
              article — does not shove it down the screen. */}
          <footer className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 border-t border-line bg-app px-6 py-5 lg:px-10">
            <p className="font-mono text-[10px] uppercase tracking-widest text-fg-subtle">
              GoTour · localStorage namespace gotour:v1
            </p>
            <ResetProgress />
          </footer>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
