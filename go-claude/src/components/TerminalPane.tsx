import { useState } from 'react';
import type { TerminalLine } from '../content/types';

export function TerminalPane({ lines }: { lines: TerminalLine[] }) {
  return (
    <div className="rounded-md overflow-hidden border border-ink-700 bg-black/80 shadow-inner">
      <div className="flex items-center gap-1.5 border-b border-ink-800 px-3 py-2 bg-ink-900/60">
        <span className="block size-2.5 rounded-full bg-red-500/70" />
        <span className="block size-2.5 rounded-full bg-yellow-500/70" />
        <span className="block size-2.5 rounded-full bg-green-500/70" />
        <span className="ml-3 font-mono text-[10px] uppercase tracking-widest text-ink-400">
          terminal · pre-recorded output
        </span>
      </div>
      <pre className="p-4 text-sm font-mono leading-relaxed text-ink-100 overflow-x-auto">
        {lines.map((line, i) => (
          <TerminalLineRow key={i} line={line} />
        ))}
      </pre>
    </div>
  );
}

function TerminalLineRow({ line }: { line: TerminalLine }) {
  if (line.kind === 'command') {
    return (
      <div className="group flex items-start gap-2">
        <span aria-hidden="true" className="select-none text-gopher">
          $
        </span>
        <span className="flex-1 break-words text-ink-50">{line.text}</span>
        <CopyButton text={line.text} />
      </div>
    );
  }
  if (line.kind === 'stderr') {
    return <div className="text-red-400 whitespace-pre-wrap">{line.text}</div>;
  }
  return <div className="text-ink-200 whitespace-pre-wrap">{line.text}</div>;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      /* clipboard blocked */
    }
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Copy command: ${text}`}
      className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity rounded px-1.5 py-0.5 text-[10px] font-mono text-ink-300 hover:text-gopher border border-ink-700 hover:border-gopher"
    >
      {copied ? 'copied' : 'copy'}
    </button>
  );
}
