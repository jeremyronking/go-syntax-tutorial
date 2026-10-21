import { useState } from 'react';
import type { TerminalLine } from '../content/types';

/**
 * Read-only terminal transcript for lessons the Playground sandbox cannot
 * execute (toolchain commands, cgo, unsafe, multi-package layouts).
 */
export function TerminalPane({ lines }: { lines: TerminalLine[] }) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-md border border-line bg-black shadow-inner">
      <div className="flex shrink-0 items-center gap-1.5 border-b border-line/40 bg-white/5 px-3 py-2">
        <span aria-hidden="true" className="block size-2.5 rounded-full bg-red-500/70" />
        <span aria-hidden="true" className="block size-2.5 rounded-full bg-yellow-500/70" />
        <span aria-hidden="true" className="block size-2.5 rounded-full bg-green-500/70" />
        <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-white/50">
          terminal · recorded output
        </span>
      </div>
      <pre className="min-h-0 flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed text-white/90">
        {lines.map((line, i) => (
          <TerminalRow key={i} line={line} />
        ))}
      </pre>
    </div>
  );
}

function TerminalRow({ line }: { line: TerminalLine }) {
  if (line.kind === 'command') {
    return (
      <div className="group flex items-start gap-2">
        <span aria-hidden="true" className="select-none text-gopher">
          $
        </span>
        <span className="flex-1 break-words">{line.text}</span>
        <CopyButton text={line.text} />
      </div>
    );
  }
  if (line.kind === 'stderr') {
    return <div className="whitespace-pre-wrap text-red-400">{line.text}</div>;
  }
  return <div className="whitespace-pre-wrap">{line.text}</div>;
}

/**
 * Copies just the command text — the `$` prompt is a decoration, not part of
 * the command.
 */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard blocked (insecure context or denied permission).
    }
  };

  return (
    <button
      type="button"
      onClick={() => void onClick()}
      aria-label={`Copy command: ${text}`}
      className="rounded border border-white/15 px-1.5 py-0.5 font-mono text-[10px] text-white/50 opacity-0 transition-opacity hover:border-gopher hover:text-gopher focus:opacity-100 group-hover:opacity-100"
    >
      {copied ? 'copied' : 'copy'}
    </button>
  );
}
