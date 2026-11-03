import type { ReactNode } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';

type LayoutProps = {
  children: ReactNode;
  aside?: ReactNode;
};

export default function Layout({ children, aside }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#lesson-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-gopher-500 focus:px-3 focus:py-2 focus:text-black"
      >
        Skip to lesson
      </a>
      <TopBar />
      <div
        className={
          aside
            ? 'grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[15rem_minmax(0,1fr)_minmax(24rem,30rem)]'
            : 'grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[15rem_minmax(0,1fr)]'
        }
      >
        <Sidebar />
        <main id="lesson-content" className="min-w-0">
          {children}
        </main>
        {aside ? (
          <div className="min-h-0 border-t border-divider bg-elevated/30 md:block lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:overflow-hidden lg:border-l lg:border-t-0">
            {aside}
          </div>
        ) : null}
      </div>
    </div>
  );
}
