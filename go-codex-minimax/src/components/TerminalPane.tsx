import { useState } from 'react';
import type { TerminalLine } from '../content/types';

interface TerminalPaneProps {
  lines: TerminalLine[];
}

function lineClass(kind: TerminalLine['kind']): string {
  if (kind === 'command') return 'text-gopher-cyan';
  if (kind === 'stderr') return 'text-red-300';
  return 'text-ink-100';
}

function linePrefix(kind: TerminalLine['kind']): string {
  if (kind === 'command') return '$ ';
  return '';
}

export function TerminalPane({ lines }: TerminalPaneProps): JSX.Element {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((cur) => (cur === key ? null : cur)), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="rounded-md border border-ink-700 bg-black/90 font-mono text-[13px] text-ink-100">
      <div className="flex items-center gap-2 border-b border-ink-700/80 bg-ink-900/40 px-3 py-1.5 text-xs text-ink-400">
        <span aria-hidden className="inline-flex gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        </span>
        <span>terminal</span>
      </div>
      <pre className="m-0 overflow-x-auto p-3 leading-5">
        {lines.map((line, i) => {
          const key = `${i}-${line.kind}-${line.text.slice(0, 8)}`;
          return (
            <div key={key} className={`group flex items-start gap-2 ${lineClass(line.kind)}`}>
              <span className="select-none whitespace-pre">{linePrefix(line.kind)}</span>
              <span className="whitespace-pre-wrap break-words">{line.text}</span>
              {line.kind === 'command' ? (
                <button
                  type="button"
                  onClick={() => copy(line.text, key)}
                  className="ml-auto rounded border border-ink-700 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-ink-400 opacity-0 transition-opacity hover:border-gopher-cyan hover:text-gopher-cyan focus:opacity-100 group-hover:opacity-100"
                  aria-label={`Copy command: ${line.text}`}
                >
                  {copied === key ? 'Copied' : 'Copy'}
                </button>
              ) : null}
            </div>
          );
        })}
      </pre>
    </div>
  );
}
