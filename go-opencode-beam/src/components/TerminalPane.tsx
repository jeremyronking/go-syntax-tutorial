import type { TerminalLine } from '../content/types';

type Props = { lines: TerminalLine[] };

export default function TerminalPane({ lines }: Props) {
  const copy = (text: string) => navigator.clipboard.writeText(text);
  return (
    <div className="border border-divider rounded bg-black text-green-300 font-mono text-sm p-3">
      {lines.map((l, i) => (
        <div key={i} className="whitespace-pre-wrap flex items-start gap-2">
          {l.kind === 'command' && (
            <>
              <span className="text-fg-subtle select-none">$</span>
              <span className="flex-1">{l.text}</span>
              <button onClick={() => copy(l.text)} className="text-xs text-fg-muted hover:text-white" title="Copy command">
                ⎘
              </button>
            </>
          )}
          {l.kind === 'stdout' && <span className="flex-1">{l.text}</span>}
          {l.kind === 'stderr' && <span className="flex-1 text-red-400">{l.text}</span>}
        </div>
      ))}
    </div>
  );
}
