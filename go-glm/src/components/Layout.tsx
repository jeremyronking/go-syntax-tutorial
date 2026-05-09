import { useState, useEffect, useCallback } from "react";
import { Outlet, Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import CommandPalette from "./CommandPalette";
import { useProgressStore } from "../store/progress";

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
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    <div className="h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="lg:hidden round p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label="Toggle sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <span className="text-[var(--color-gopher-cyan)]">Go</span>Tour
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <kbd className="hidden lg:inline-flex items-center gap-1 rounded border border-gray-300 dark:border-gray-600 px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400">
              ⌘K
            </kbd>
            <ThemeToggle theme={theme} toggle={toggleTheme} />
          </div>
        </div>
      </header>

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="hidden lg:block w-64 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-y-auto">
            <Sidebar />
          </aside>
        )}

        {/* Content pane */}
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>

      <CommandPalette />

      {/* Footer with reset progress */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-3 px-4 text-center">
        <button
          onClick={() => {
            if (window.confirm("Reset all progress, editor drafts, and checkpoint scores?")) {
              useProgressStore.getState().resetProgress();
              window.location.reload();
            }
          }}
          className="text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        >
          Reset progress
        </button>
      </footer>
    </div>
  );
}