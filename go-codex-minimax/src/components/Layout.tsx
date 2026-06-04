import { useEffect, type ReactNode } from 'react';
import { useThemeStore, applyThemeToRoot } from '../store/theme';
import { TopBar } from './TopBar';

interface LayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  onOpenSearch: () => void;
}

export function Layout({ sidebar, children, onOpenSearch }: LayoutProps): JSX.Element {
  const theme = useThemeStore((s) => s.theme);
  useEffect(() => {
    applyThemeToRoot(theme);
  }, [theme]);
  return (
    <div className="flex h-screen flex-col bg-ink-950 text-ink-100">
      <TopBar onOpenSearch={onOpenSearch} />
      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[1fr] lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden border-r border-ink-800 bg-ink-900/40 lg:block">
          <div className="sticky top-12 h-[calc(100vh-3rem)] overflow-y-auto">{sidebar}</div>
        </aside>
        <main className="min-w-0 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
