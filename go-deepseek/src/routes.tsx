import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';

// Route-level splitting keeps the landing page free of lesson content and Monaco.
const LessonPage = lazy(() => import('./pages/LessonPage'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/lesson/:slug" element={<LessonPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Suspense fallback={null}>
        <CommandPalette />
      </Suspense>
    </BrowserRouter>
  );
}

function RouteFallback() {
  return (
    <div className="grid min-h-screen place-items-center" role="status">
      <p className="font-mono text-xs text-subtle">Loading…</p>
    </div>
  );
}

function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="font-mono text-sm text-gopher-700 dark:text-gopher-500">404</p>
        <h1 className="mt-2 text-2xl font-semibold">No such page</h1>
        <a
          href="/"
          className="mt-4 inline-block text-sm text-gopher-700 hover:underline dark:text-gopher-400"
        >
          Back to GoTour
        </a>
      </div>
    </main>
  );
}
