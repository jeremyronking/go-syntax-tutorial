import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, XCircle, RefreshCw, ArrowRight } from 'lucide-react'
import { useProgressStore } from '../store/progress'
import type { CheckpointDef } from '../content/types'
import { lessons } from '../content/lessons'

export default function Checkpoint({ 
  checkpoint, 
  section, 
  nextLessonSlug 
}: { 
  checkpoint: CheckpointDef; 
  section: string;
  nextLessonSlug: string | null;
}) {
  const { setCheckpointScore, checkpointScores, markLessonStatus } = useProgressStore()
  const scoreData = checkpointScores[checkpoint.id]

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  
  // Reset local state when checkpoint changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnswers({})
    setSubmitted(false)
  }, [checkpoint.id])

  const handleSubmit = () => {
    let correctCount = 0
    checkpoint.questions.forEach(q => {
      const ans = answers[q.id]
      if (!ans) return
      if (q.type === 'mcq') {
        if (parseInt(ans) === q.correctIndex) correctCount++
      } else {
        if (q.acceptedAnswers.includes(ans.trim())) correctCount++
      }
    })
    
    setSubmitted(true)
    
    const percentage = correctCount / checkpoint.questions.length
    
    // Update monotonic high score
    const currentHigh = scoreData ? scoreData.correct / scoreData.total : -1
    if (percentage > currentHigh) {
      setCheckpointScore(checkpoint.id, correctCount, checkpoint.questions.length)
    }

    // Mark section complete if >= 80%
    if (percentage >= 0.8) {
      lessons.forEach(l => {
        if (l.section === section) {
          markLessonStatus(l.slug, 'complete')
        }
      })
    }
  }

  const handleRetake = () => {
    setAnswers({})
    setSubmitted(false)
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8 bg-white dark:bg-[#1e1e1e] rounded-xl border border-zinc-200 dark:border-zinc-800 my-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Section Checkpoint</h2>
          <p className="text-sm text-zinc-500">Test your understanding of {section}</p>
        </div>
        {scoreData && (
          <div className="text-right">
            <div className="text-sm text-zinc-500">High Score</div>
            <div className="text-xl font-bold text-gotour-cyan">
              {Math.round((scoreData.correct / scoreData.total) * 100)}%
            </div>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {checkpoint.questions.map((q, idx) => {
          const isCorrect = (() => {
            const ans = answers[q.id]
            if (!ans) return false
            if (q.type === 'mcq') return parseInt(ans) === q.correctIndex
            return q.acceptedAnswers.includes(ans.trim())
          })()

          return (
            <div key={q.id} className="space-y-3">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                {idx + 1}. {q.prompt}
              </h3>
              
              {q.type === 'mcq' && (
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => (
                    <label 
                      key={optIdx} 
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        submitted
                          ? optIdx === q.correctIndex
                            ? 'border-green-500 bg-green-50 dark:bg-green-500/10'
                            : answers[q.id] === String(optIdx)
                              ? 'border-red-500 bg-red-50 dark:bg-red-500/10'
                              : 'border-zinc-200 dark:border-zinc-800 opacity-50'
                          : answers[q.id] === String(optIdx)
                            ? 'border-gotour-cyan bg-gotour-cyan/10'
                            : 'border-zinc-200 dark:border-zinc-800 hover:border-gotour-cyan'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name={q.id} 
                        value={optIdx}
                        disabled={submitted}
                        checked={answers[q.id] === String(optIdx)}
                        onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                        className="mt-1"
                      />
                      <span className="text-zinc-700 dark:text-zinc-300">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === 'fill' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    disabled={submitted}
                    value={answers[q.id] || ''}
                    onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    className={`w-full p-3 rounded-lg border bg-transparent outline-none focus:ring-2 focus:ring-gotour-cyan ${
                      submitted
                        ? isCorrect
                          ? 'border-green-500 text-green-700 dark:text-green-400'
                          : 'border-red-500 text-red-700 dark:text-red-400'
                        : 'border-zinc-200 dark:border-zinc-700'
                    }`}
                    placeholder="Type your answer..."
                  />
                </div>
              )}

              {submitted && (
                <div className={`flex gap-2 p-3 rounded-lg text-sm ${isCorrect ? 'bg-green-50 dark:bg-green-500/10 text-green-800 dark:text-green-200' : 'bg-red-50 dark:bg-red-500/10 text-red-800 dark:text-red-200'}`}>
                  <div className="shrink-0 mt-0.5">
                    {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  </div>
                  <div>
                    {!isCorrect && q.type === 'fill' && (
                      <div className="font-semibold mb-1">
                        Accepted: {q.acceptedAnswers.join(' or ')}
                      </div>
                    )}
                    <p>{q.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        {!submitted ? (
          <>
            <div className="flex-1">
              {nextLessonSlug && (
                <Link
                  to={`/lesson/${nextLessonSlug}`}
                  className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Skip — not now
                </Link>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== checkpoint.questions.length}
              className="px-6 py-2 bg-gotour-cyan text-zinc-900 rounded font-semibold hover:brightness-110 disabled:opacity-50 transition-colors"
            >
              Submit Checkpoint
            </button>
            <div className="flex-1" />
          </>
        ) : (
          <>
            <div className="flex-1">
              <button
                onClick={handleRetake}
                className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <RefreshCw size={16} />
                Retake quiz
              </button>
            </div>
            {nextLessonSlug && (
              <div className="flex-1 flex justify-end">
                <Link
                  to={`/lesson/${nextLessonSlug}`}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-gotour-cyan text-zinc-900 rounded font-semibold hover:brightness-110 transition-colors"
                >
                  Continue
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
