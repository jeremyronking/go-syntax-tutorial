import { useCallback, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import { CommandPalette } from './components/CommandPalette';
import { Landing } from './pages/Landing';
import { LessonPage } from './pages/LessonPage';
import { useThemeStore, applyThemeToRoot } from './store/theme';

export default function App(): JSX.Element {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const theme = useThemeStore((s) => s.theme);
  const location = useLocation();
  useEffect(() => {
    applyThemeToRoot(theme);
  }, [theme]);
  const openSearch = useCallback(() => setPaletteOpen(true), []);
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
  useEffect(() => {
    setPaletteOpen(false);
  }, [location.pathname]);

  return (
    <>
      <Layout sidebar={<Sidebar />} onOpenSearch={openSearch}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/lesson/:slug" element={<LessonPage />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </Layout>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
