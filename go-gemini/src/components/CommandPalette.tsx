import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { searchLessons } from '../lib/search'
import debounce from 'lodash-es/debounce'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ReturnType<typeof searchLessons>>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('')
      setResults([])
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [isOpen])

  const debouncedSearch = useRef(
    debounce((q: string) => {
      setResults(searchLessons(q))
      setSelectedIndex(0)
    }, 200)
  ).current

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    debouncedSearch(val)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[selectedIndex]) {
        navigate(`/lesson/${results[selectedIndex].item.slug}`)
        onClose()
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-zinc-900/50 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
          <Search size={20} className="text-zinc-500 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            placeholder="Search lessons... (Cmd/Ctrl+K)"
            className="flex-1 bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-500"
          />
          <button onClick={onClose} className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded">
            <X size={16} />
          </button>
        </div>

        {results.length > 0 ? (
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {results.map((result, idx) => (
              <div
                key={result.item.slug}
                onMouseEnter={() => setSelectedIndex(idx)}
                onClick={() => {
                  navigate(`/lesson/${result.item.slug}`)
                  onClose()
                }}
                className={`flex flex-col gap-1 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedIndex === idx 
                    ? 'bg-gotour-cyan/10 text-gotour-cyan' 
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <div className="font-semibold">{result.item.title}</div>
                <div className="text-xs opacity-70 truncate">{result.item.section}</div>
              </div>
            ))}
          </div>
        ) : query ? (
          <div className="p-8 text-center text-zinc-500">
            No results found for "{query}"
          </div>
        ) : (
          <div className="p-8 text-center text-zinc-500 text-sm">
            Search by title, section, or keyword...
          </div>
        )}
      </div>
    </div>
  )
}
