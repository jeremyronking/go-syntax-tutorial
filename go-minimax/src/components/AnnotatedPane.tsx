/**
 * Static, syntax-highlighted code block for lessons marked
 * `runMode: "annotated"`. No editor, no run button — the snippet is there to
 * be read, not executed.
 */
export function AnnotatedPane({ code, language = 'go' }: { code: string; language?: string }) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-md border border-line bg-surface/40">
      <div className="flex shrink-0 items-center gap-2 border-b border-line px-3 py-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-fg-subtle">
          {language} · annotated
        </span>
      </div>
      <pre className="min-h-0 flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed text-fg">
        <code>{code}</code>
      </pre>
    </div>
  );
}
