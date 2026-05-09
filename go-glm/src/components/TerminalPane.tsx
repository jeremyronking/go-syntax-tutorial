import { useState } from "react";
import type { TerminalLine } from "../content/types";

interface TerminalPaneProps {
  lines: TerminalLine[];
}

export default function TerminalPane({ lines }: TerminalPaneProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCommand = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  if (!lines.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-sm">
        No terminal output for this lesson.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-800 text-gray-300 text-xs font-mono">
        Terminal
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-950 p-3 font-mono text-sm">
        {lines.map((line, i) => (
          <div key={i} className="group flex items-start gap-2">
            {line.kind === "command" ? (
              <>
                <span className="text-green-400 shrink-0">$</span>
                <span className="text-gray-100 flex-1">{line.text}</span>
                <button
                  onClick={() => copyCommand(line.text, i)}
                  className="opacity-0 group-hover:opacity-100 text-[10px] text-gray-400 hover:text-white shrink-0 px-1"
                  title="Copy command"
                >
                  {copiedIndex === i ? "✓" : "Copy"}
                </button>
              </>
            ) : line.kind === "stderr" ? (
              <span className="text-red-400 flex-1">{line.text}</span>
            ) : (
              <span className="text-gray-300 flex-1">{line.text}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}