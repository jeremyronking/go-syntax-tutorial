import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { LessonView } from './pages/LessonView';
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
          <Route path="/lesson/:slug" element={<LessonView />} />
          <Route
            path="*"
            element={
              <div className="px-6 py-10 max-w-prose">
                <h1 className="text-3xl font-semibold">404</h1>
                <p className="mt-2 text-ink-300">No such route.</p>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
