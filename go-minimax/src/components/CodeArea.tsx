import type { Lesson } from '../content/types';

/**
 * Placeholder for the interactive code pane. Phase 05 swaps this for the
 * Monaco-backed CodeRunner; Phase 06 for the TerminalPane.
 */
export function CodeArea({ lesson }: { lesson: Lesson }) {
  return (
    <div className="rounded-md border border-line bg-surface/40 p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-fg-subtle">
        {lesson.runMode} pane
      </p>
      <p className="mt-2 text-sm text-fg-muted">
        The interactive editor lands in Phase 05. This lesson runs in{' '}
        <span className="font-mono text-fg">{lesson.runMode}</span> mode.
      </p>
      {lesson.starterCode && (
        <pre className="mt-3 overflow-x-auto rounded border border-line bg-app p-3 text-xs leading-relaxed text-fg-muted">
          {lesson.starterCode}
        </pre>
      )}
    </div>
  );
}
