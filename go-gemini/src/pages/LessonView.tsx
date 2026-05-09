import { useParams } from 'react-router-dom'

export default function LessonView() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <div className="flex h-full flex-col md:flex-row">
      <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto">
        <div className="max-w-[72ch]">
          <h1 className="text-2xl font-bold mb-4">Lesson: {slug}</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Prose placeholder</p>
        </div>
      </div>
      <div className="flex-1 p-6 bg-zinc-100 dark:bg-[#1e1e1e] overflow-y-auto">
        <p className="text-zinc-500 font-mono text-sm">Editor placeholder</p>
      </div>
    </div>
  )
}
