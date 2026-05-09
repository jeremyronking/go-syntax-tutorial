import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useThemeStore } from '../store/theme'
import TopBar from './TopBar'
import Sidebar from './Sidebar'

export default function Layout() {
  const { theme } = useThemeStore()

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar wrapper hidden on mobile unless toggled (will implement later) */}
        <div className="hidden lg:block w-64 border-r border-zinc-200 dark:border-zinc-800 flex-shrink-0 overflow-y-auto">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
