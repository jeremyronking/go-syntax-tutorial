import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { ResetProgress } from './ResetProgress';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-950 text-ink-50">
      <TopBar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-y-auto">
          <Outlet />
          <footer className="px-6 lg:px-10 py-6 border-t border-ink-800 mt-12 flex items-center justify-between">
            <p className="text-[10px] font-mono uppercase tracking-widest text-ink-500">
              GoTour · localStorage namespace gotour:v1
            </p>
            <ResetProgress />
          </footer>
        </main>
      </div>
    </div>
  );
}
