import { Trash2 } from 'lucide-react'
import { useProgressStore } from '../store/progress'

export default function Sidebar() {
  const { resetProgress } = useProgressStore()

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all progress and drafts?")) {
      resetProgress()
      window.location.reload()
    }
  }

  return (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-[#1e1e1e]">
      <div className="flex-1 p-4 text-sm text-zinc-500 overflow-y-auto">
        Sidebar placeholder
      </div>
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors w-full p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 size={16} />
          Reset progress
        </button>
      </div>
    </div>
  )
}
