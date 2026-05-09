import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';

export function Layout({ children }: { children?: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-ink-950 text-ink-50">
      <TopBar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-y-auto">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}
