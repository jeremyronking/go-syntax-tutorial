import { useState, useEffect, useCallback } from "react";
import { Outlet, Link } from "react-router-dom";

const THEME_KEY = "gotour:v1:theme";

function getInitialTheme(): "dark" | "light" {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // localStorage unavailable
  }
  return "dark";
}

function ThemeToggle({ theme, toggle }: { theme: "dark" | "light"; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      className="rounded-md px-3 py-1.5 text-sm font-medium
        bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300
        hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {theme === "dark" ? "☀ Light" : "☾ Dark"}
    </button>
  );
}

export default function Layout() {
  const [theme, setTheme] = useState<"dark" | "light">(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-4 h-14">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <span className="text-[var(--color-gopher-cyan)]">Go</span>Tour
          </Link>
          <div className="flex items-center gap-3">
            <kbd className="hidden lg:inline-flex items-center gap-1 rounded border border-gray-300 dark:border-gray-600 px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400">
              ⌘K
            </kbd>
            <ThemeToggle theme={theme} toggle={toggleTheme} />
          </div>
        </div>
      </header>

      {/* Main area */}
      <div className="flex-1 flex">
        {/* Sidebar — placeholder, real content in Phase 08 */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-gray-200 dark:border-gray-800 p-4 overflow-y-auto">
          <p className="text-sm text-gray-400">Sections will appear here</p>
        </aside>

        {/* Content pane */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}