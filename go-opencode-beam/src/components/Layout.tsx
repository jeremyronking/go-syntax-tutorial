import { useState, useEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import Sidebar from './Sidebar';
import CommandPalette from './CommandPalette';

export default function Layout() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const stored = localStorage.getItem('gotour:v1:theme');
    return stored === 'light' ? 'light' : 'dark';
  });
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('gotour:v1:theme', theme);
  }, [theme]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-app text-fg">
      <header className="h-14 border-b border-divider flex items-center px-4 gap-4 bg-elevated">
        <Link to="/" className="font-mono font-bold text-gopher">GoTour</Link>
        <button
          onClick={() => setPaletteOpen(true)}
          className="text-sm text-fg-muted border border-divider rounded px-3 py-1 hover:bg-card"
        >
          Search (⌘K)
        </button>
        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-sm border border-divider rounded px-3 py-1 hover:bg-card"
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-divider bg-elevated hidden md:block overflow-y-auto">
          <Sidebar />
        </aside>
        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ paletteOpen, setPaletteOpen }} />
        </main>
      </div>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
