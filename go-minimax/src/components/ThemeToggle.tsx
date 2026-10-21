import { useEffect, useState } from 'react';
import { readTheme, writeTheme, type Theme } from '../lib/theme';

const LABEL: Record<Theme, string> = { dark: 'Dark', light: 'Light' };

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');

  // Sync from storage after mount so the toggle reflects a persisted choice.
  useEffect(() => {
    setTheme(readTheme());
  }, []);

  const next: Theme = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={() => {
        writeTheme(next);
        setTheme(next);
      }}
      title={`Switch to ${LABEL[next].toLowerCase()} theme`}
      className="rounded border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-fg-muted transition-colors hover:border-gopher hover:text-gopher"
    >
      <span aria-hidden="true">{theme === 'dark' ? '◐' : '◑'}</span>
      <span className="ml-1.5">
        {LABEL[theme]} theme
        <span className="sr-only"> — switch to {LABEL[next].toLowerCase()}</span>
      </span>
    </button>
  );
}
