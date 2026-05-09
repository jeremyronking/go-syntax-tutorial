import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import type { TerminalLine } from '../content/types'

export default function TerminalPane({ lines }: { lines: TerminalLine[] }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(idx)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] rounded-lg overflow-hidden border border-zinc-700 font-mono text-sm">
      <div className="flex items-center px-4 py-2 bg-[#2d2d2d] border-b border-zinc-700">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="ml-4 text-xs text-zinc-400">Terminal</span>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {lines.map((line, idx) => (
          <div key={idx} className="group relative">
            {line.kind === 'command' && (
              <div className="flex items-start">
                <span className="text-gotour-cyan mr-2 select-none">$</span>
                <span className="text-zinc-100 flex-1 break-all">{line.text}</span>
                <button
                  onClick={() => handleCopy(line.text, idx)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-zinc-100 transition-opacity focus:opacity-100 outline-none"
                  aria-label="Copy command"
                >
                  {copiedIndex === idx ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
              </div>
            )}
            {line.kind === 'stdout' && (
              <div className="text-zinc-300 whitespace-pre-wrap">{line.text}</div>
            )}
            {line.kind === 'stderr' && (
              <div className="text-red-400 whitespace-pre-wrap">{line.text}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
