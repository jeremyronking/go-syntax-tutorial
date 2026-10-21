import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { LessonPlaceholder } from './pages/LessonPlaceholder';
import { applyTheme, readTheme } from './lib/theme';

export default function App() {
  useEffect(() => {
    applyTheme(readTheme());
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/lesson/:slug" element={<LessonPlaceholder />} />
          <Route
            path="*"
            element={
              <div className="px-6 py-12 max-w-prose">
                <h1 className="text-3xl font-semibold">404</h1>
                <p className="mt-2 text-fg-muted">No such route.</p>
                <a href="/" className="mt-4 inline-block text-gopher hover:underline">
                  ← Back to landing
                </a>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
