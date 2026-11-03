import { useState } from 'react';
import type { TerminalLine } from '../content/types';

type TerminalPaneProps = {
  title: string;
  lines: TerminalLine[];
};

export default function TerminalPane({ title, lines }: TerminalPaneProps) {
  return (
    <section
      className="flex h-full min-h-[24rem] flex-col bg-[#070a12]"
      aria-label={`Terminal output for ${title}`}
    >
      <div className="flex items-center gap-2 border-b border-slate-800 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" aria-hidden="true" />
        <span className="ml-2 font-mono text-[11px] text-slate-500">captured output</span>
      </div>

      <ol className="flex-1 overflow-auto px-3 py-3 font-mono text-xs leading-relaxed">
        {lines.map((line, index) => (
          <li key={`${line.kind}-${index}`} className="group flex items-start gap-2">
            {line.kind === 'command' ? (
              <CommandLine index={index} text={line.text} />
            ) : (
              <span
                className={`whitespace-pre-wrap break-words ${
                  line.kind === 'stderr' ? 'text-red-400' : 'text-slate-200'
                }`}
              >
                {line.text}
              </span>
            )}
          </li>
        ))}
      </ol>

      <p className="border-t border-slate-800 px-3 py-2 font-mono text-[10px] text-slate-600">
        Frozen output. Commands are copyable; nothing here executes.
      </p>
    </section>
  );
}

function CommandLine({ index, text }: { index: number; text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <span aria-hidden="true" className="select-none text-emerald-400">
        $
      </span>
      <span className="whitespace-pre-wrap break-words text-slate-100">{text}</span>
      <button
        type="button"
        onClick={() => void copy()}
        className="ml-auto shrink-0 rounded border border-slate-700 px-1.5 py-0.5 text-[10px] text-slate-400 opacity-60 transition-opacity hover:border-gopher-500 hover:text-gopher-300 focus:opacity-100 group-hover:opacity-100"
        aria-label={`Copy command ${index + 1}: ${text}`}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </>
  );
}
