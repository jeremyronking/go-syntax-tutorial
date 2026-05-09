import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getLessonBySlug } from '../content/lessons'
import { AlertCircle } from 'lucide-react'

export default function LessonView() {
  const { slug } = useParams<{ slug: string }>()
  const lesson = slug ? getLessonBySlug(slug) : undefined

  if (!lesson) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Lesson not found</h1>
        <p className="text-zinc-600 dark:text-zinc-400">The requested lesson could not be found.</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col md:flex-row overflow-hidden">
      {/* Prose Pane */}
      <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto">
        <div className="max-w-[72ch] mx-auto pb-12">
          <h1 className="text-3xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">{lesson.title}</h1>
          <div className="prose prose-zinc dark:prose-invert max-w-none prose-pre:bg-zinc-100 dark:prose-pre:bg-zinc-800">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {lesson.body}
            </ReactMarkdown>
          </div>

          {lesson.gotcha && (
            <div className="mt-12 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-amber-800 dark:text-amber-200 mb-1">Idiom / Gotcha</h3>
                  <div className="text-amber-900 dark:text-amber-100 prose prose-sm max-w-none">
                    <ReactMarkdown>{lesson.gotcha}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editor Pane Placeholder */}
      <div className="flex-1 p-6 bg-zinc-100 dark:bg-[#1e1e1e] overflow-y-auto flex flex-col">
        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg">
          <p className="text-zinc-500 font-mono text-sm">
            {lesson.runMode === 'playground' ? 'Live Editor & Runner Placeholder' :
             lesson.runMode === 'terminal' ? 'Terminal Output Placeholder' :
             'Annotated Snippet Placeholder'}
          </p>
        </div>
      </div>
    </div>
  )
}
