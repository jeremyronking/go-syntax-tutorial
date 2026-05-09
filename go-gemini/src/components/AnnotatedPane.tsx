import Editor from '@monaco-editor/react'
import { useThemeStore } from '../store/theme'

export default function AnnotatedPane({ code }: { code: string }) {
  const { theme } = useThemeStore()

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center px-4 py-2 bg-zinc-100 dark:bg-[#2d2d2d] border-b border-zinc-200 dark:border-zinc-800">
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Annotated Example</span>
      </div>
      <div className="flex-1 min-h-[300px]">
        <Editor
          height="100%"
          language="go"
          theme={theme === 'dark' ? 'vs-dark' : 'vs'}
          value={code}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: '"JetBrains Mono", monospace',
            scrollBeyondLastLine: false,
            padding: { top: 16 },
          }}
        />
      </div>
    </div>
  )
}
