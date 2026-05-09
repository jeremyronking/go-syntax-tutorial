import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import debounce from 'lodash-es/debounce'
import { getLessonBySlug } from '../content/lessons'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import CodeRunner from '../components/CodeRunner'
import TerminalPane from '../components/TerminalPane'
import AnnotatedPane from '../components/AnnotatedPane'
import { useProgressStore } from '../store/progress'

export default function LessonView() {
  const { slug } = useParams<{ slug: string }>()
  const lesson = slug ? getLessonBySlug(slug) : undefined
  const { progress, editorDrafts, markLessonStatus, setEditorDraft } = useProgressStore()

  useEffect(() => {
    if (slug && lesson && progress[slug] !== 'complete' && progress[slug] !== 'in-progress') {
      markLessonStatus(slug, 'in-progress')
    }
  }, [slug, lesson, progress, markLessonStatus])

  const handleEditorChangeRef = useRef<ReturnType<typeof debounce> | null>(null)

  useEffect(() => {
    if (!slug) return
    handleEditorChangeRef.current = debounce((code: string) => {
      setEditorDraft(slug, code)
    }, 500)
    return () => {
      handleEditorChangeRef.current?.cancel()
    }
  }, [slug, setEditorDraft])

  const handleEditorChange = (code: string) => {
    handleEditorChangeRef.current?.(code)
  }

  if (!lesson || !slug) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Lesson not found</h1>
        <p className="text-zinc-600 dark:text-zinc-400">The requested lesson could not be found.</p>
      </div>
    )
  }

  const draft = editorDrafts[slug]
  const initialCode = draft ?? lesson.starterCode

  const isComplete = progress[slug] === 'complete'

  return (
    <div className="flex h-full flex-col md:flex-row overflow-hidden relative">
      {/* Prose Pane */}
      <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto">
        <div className="max-w-[72ch] mx-auto pb-12">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{lesson.title}</h1>
            {isComplete && (
              <span className="flex items-center gap-1.5 text-sm font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded">
                <CheckCircle2 size={16} />
                Completed
              </span>
            )}
          </div>
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
          
          <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
            {!isComplete && (
              <button
                onClick={() => markLessonStatus(slug, 'complete')}
                className="px-4 py-2 bg-gotour-cyan text-zinc-900 rounded font-semibold hover:brightness-110 transition-colors"
              >
                Mark complete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Editor Pane */}
      <div className="flex-1 p-6 bg-zinc-100 dark:bg-zinc-900 overflow-y-auto flex flex-col">
        {lesson.runMode === 'playground' && initialCode ? (
          <CodeRunner
            key={lesson.slug}
            initialCode={initialCode}
            streamReplay={lesson.streamReplay}
            onChange={handleEditorChange}
          />
        ) : lesson.runMode === 'terminal' && lesson.terminalOutput ? (
          <TerminalPane lines={lesson.terminalOutput} />
        ) : lesson.runMode === 'annotated' && lesson.starterCode ? (
          <AnnotatedPane code={lesson.starterCode} />
        ) : (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg">
            <p className="text-zinc-500 font-mono text-sm">
              Missing configuration for {lesson.runMode}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
