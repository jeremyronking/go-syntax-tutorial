import { useEffect, useState } from 'react';
import { applyTheme, readTheme, writeTheme, type Theme } from '../lib/theme';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => readTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const next: Theme = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      onClick={() => {
        writeTheme(next);
        setTheme(next);
      }}
      aria-label={`Switch to ${next} theme`}
      className="rounded-md px-2 py-1 text-xs font-mono uppercase tracking-wider border border-divider hover:border-gopher hover:text-gopher transition-colors"
    >
      {theme === 'dark' ? '☾ dark' : '☀ light'}
    </button>
  );
}
