import { useState, useRef, useEffect, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import { Play, RotateCcw, FastForward } from 'lucide-react'
import { compileCode } from '../lib/playground'
import type { PlaygroundEvent } from '../lib/playground'
import { useThemeStore } from '../store/theme'

interface CodeRunnerProps {
  initialCode: string
  streamReplay?: boolean
  onChange?: (code: string) => void
}

interface OutputLine {
  text: string
  isError: boolean
}

export default function CodeRunner({ initialCode, streamReplay, onChange }: CodeRunnerProps) {
  const { theme } = useThemeStore()
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState<OutputLine[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isReplaying, setIsReplaying] = useState(false)
  
  const replayTimeouts = useRef<number[]>([])
  const rawEvents = useRef<PlaygroundEvent[]>([])

  const clearTimeouts = () => {
    replayTimeouts.current.forEach(clearTimeout)
    replayTimeouts.current = []
  }

  useEffect(() => {
    return clearTimeouts
  }, [])

  const skipAnimation = () => {
    clearTimeouts()
    if (rawEvents.current.length > 0) {
      setOutput(rawEvents.current.map(ev => ({
        text: ev.Message,
        isError: ev.Kind === 'stderr'
      })))
    }
    setIsReplaying(false)
  }

  const handleRun = useCallback(async () => {
    if (isRunning || isReplaying) return
    setIsRunning(true)
    setOutput([])
    clearTimeouts()

    try {
      const res = await compileCode(code)
      
      const newOutput: OutputLine[] = []
      
      if (res.Errors) {
        newOutput.push({ text: res.Errors, isError: true })
      }
      if (res.VetErrors) {
        newOutput.push({ text: res.VetErrors, isError: true })
      }

      if (res.Events && res.Events.length > 0) {
        rawEvents.current = res.Events
        
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (streamReplay && !prefersReducedMotion) {
          setIsReplaying(true)
          let cumulatedDelay = 0
          
          res.Events.forEach((ev) => {
            const delayMs = ev.Delay / 1_000_000
            cumulatedDelay += delayMs
            
            const timeoutId = window.setTimeout(() => {
              setOutput(prev => [...prev, { text: ev.Message, isError: ev.Kind === 'stderr' }])
            }, cumulatedDelay)
            
            replayTimeouts.current.push(timeoutId)
          })
          
          const finalTimeout = window.setTimeout(() => {
            setIsReplaying(false)
          }, cumulatedDelay)
          replayTimeouts.current.push(finalTimeout)
          
        } else {
          res.Events.forEach((ev) => {
            newOutput.push({ text: ev.Message, isError: ev.Kind === 'stderr' })
          })
          setOutput(newOutput)
        }
      } else {
        if (newOutput.length > 0) {
          setOutput(newOutput)
        }
      }
    } catch (err) {
      setOutput([{ text: String(err), isError: true }])
    } finally {
      setIsRunning(false)
    }
  }, [code, isRunning, isReplaying, streamReplay])

  const handleReset = () => {
    setCode(initialCode)
    setOutput([])
    clearTimeouts()
    setIsReplaying(false)
    setIsRunning(false)
    if (onChange) onChange(initialCode)
  }

  const handleEditorChange = (value: string | undefined) => {
    const val = value || ''
    setCode(val)
    if (onChange) onChange(val)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRun()
    })
  }

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between p-2 bg-zinc-100 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={isRunning || isReplaying}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gotour-cyan text-zinc-900 rounded-md text-sm font-semibold hover:brightness-110 disabled:opacity-50 transition-all"
            title="Run (Cmd/Ctrl+Enter)"
          >
            <Play size={14} fill="currentColor" />
            Run
          </button>
          
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md text-sm transition-colors"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
        
        {isReplaying && (
          <button
            onClick={skipAnimation}
            className="flex items-center gap-1.5 px-3 py-1.5 text-gotour-cyan text-sm transition-colors"
          >
            <FastForward size={14} fill="currentColor" />
            Skip animation
          </button>
        )}
      </div>
      
      <div className="flex-1 min-h-[300px]">
        <Editor
          height="100%"
          language="go"
          theme={theme === 'dark' ? 'vs-dark' : 'vs'}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: '"JetBrains Mono", monospace',
            scrollBeyondLastLine: false,
            padding: { top: 16 },
          }}
        />
      </div>
      
      <div className="h-1/3 min-h-[150px] bg-[#1e1e1e] border-t border-zinc-800 p-4 font-mono text-sm overflow-y-auto">
        {output.map((line, idx) => (
          <span
            key={idx}
            className={`whitespace-pre-wrap ${line.isError ? 'text-red-400' : 'text-zinc-300'}`}
          >
            {line.text}
          </span>
        ))}
      </div>
    </div>
  )
}
