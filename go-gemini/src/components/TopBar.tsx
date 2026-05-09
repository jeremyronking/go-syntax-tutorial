import { useThemeStore } from '../store/theme'
import { Sun, Moon, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TopBar() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 px-4 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-2">
        <Link to="/" className="text-xl font-bold text-gotour-cyan flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gotour-cyan text-zinc-900 flex items-center justify-center font-bold">Go</div>
          <span>Tour</span>
        </Link>
      </div>

      <div className="flex-1 max-w-md px-4 hidden md:block">
        <button className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-zinc-500 bg-zinc-100 dark:bg-zinc-800 rounded-md border border-zinc-200 dark:border-zinc-700 hover:border-gotour-cyan transition-colors focus:outline-none">
          <div className="flex items-center gap-2">
            <Search size={16} />
            <span>Search...</span>
          </div>
          <kbd className="hidden lg:inline-flex items-center gap-1 font-mono text-[10px] bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  )
}
