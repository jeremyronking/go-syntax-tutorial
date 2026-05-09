import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Trash2, ChevronDown, ChevronRight, CheckCircle2, Circle } from 'lucide-react'
import { useProgressStore } from '../store/progress'
import { useSidebarStore } from '../store/sidebar'
import { lessons } from '../content/lessons'

export default function Sidebar() {
  const { progress, resetProgress } = useProgressStore()
  const { collapsedSections, toggleSection } = useSidebarStore()
  const location = useLocation()

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all progress and drafts?")) {
      resetProgress()
      window.location.reload()
    }
  }

  const sections = useMemo(() => {
    const grouped = lessons.reduce((acc, lesson) => {
      if (!acc[lesson.section]) acc[lesson.section] = []
      acc[lesson.section].push(lesson)
      return acc
    }, {} as Record<string, typeof lessons>)

    return Object.keys(grouped).sort().map(section => {
      const sectionLessons = grouped[section].sort((a, b) => a.order - b.order)
      const total = sectionLessons.length
      const completed = sectionLessons.filter(l => progress[l.slug] === 'complete').length
      return { section, lessons: sectionLessons, total, completed }
    })
  }, [progress])

  return (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-[#1e1e1e]">
      <div className="flex-1 p-4 overflow-y-auto space-y-6">
        {sections.map(({ section, lessons, total, completed }) => {
          const isCollapsed = collapsedSections[section]
          
          return (
            <div key={section}>
              <button
                onClick={() => toggleSection(section)}
                className="w-full flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                  </span>
                  <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{section}</span>
                </div>
                <span className="text-xs text-zinc-500 font-mono">{completed}/{total}</span>
              </button>
              
              {!isCollapsed && (
                <div className="mt-2 space-y-0.5">
                  {lessons.map(lesson => {
                    const isActive = location.pathname === `/lesson/${lesson.slug}`
                    const isComplete = progress[lesson.slug] === 'complete'
                    
                    return (
                      <Link
                        key={lesson.slug}
                        to={`/lesson/${lesson.slug}`}
                        className={`flex items-start gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                          isActive 
                            ? 'bg-gotour-cyan/10 text-gotour-cyan font-medium' 
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <span className="mt-0.5 shrink-0">
                          {isComplete ? (
                            <CheckCircle2 size={14} className="text-gotour-cyan" />
                          ) : (
                            <Circle size={14} className="text-zinc-300 dark:text-zinc-700" />
                          )}
                        </span>
                        <span className="font-mono text-xs opacity-50 mt-0.5 w-4">{lesson.order}.</span>
                        <span className="leading-snug">{lesson.title}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
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
