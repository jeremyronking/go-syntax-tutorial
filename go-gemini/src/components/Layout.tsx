import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useThemeStore } from '../store/theme'
import TopBar from './TopBar'
import Sidebar from './Sidebar'
import CommandPalette from './CommandPalette'

export default function Layout() {
  const { theme } = useThemeStore()
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors">
      <TopBar onOpenPalette={() => setIsPaletteOpen(true)} />
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar wrapper hidden on mobile unless toggled (will implement later) */}
        <div className="hidden lg:block w-64 border-r border-zinc-200 dark:border-zinc-800 flex-shrink-0 overflow-y-auto">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto relative">
          <Outlet />
        </main>
      </div>
      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
    </div>
  )
}
