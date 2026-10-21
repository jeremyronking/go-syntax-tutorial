import { Suspense, lazy } from 'react';
import type { Lesson } from '../content/types';

const CodeRunner = lazy(() =>
  import('./CodeRunner').then((m) => ({ default: m.CodeRunner }))
);

/**
 * The code pane on the right of a lesson. Phase 06 adds the TerminalPane for
 * lessons the Playground sandbox cannot execute.
 */
export function CodeArea({ lesson }: { lesson: Lesson }) {
  if (lesson.runMode === 'playground' && lesson.starterCode) {
    return (
      <Suspense fallback={<EditorSkeleton />}>
        <CodeRunner key={lesson.slug} lesson={lesson} />
      </Suspense>
    );
  }
  return null;
}

function EditorSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-md border border-line bg-surface/40">
      <div className="shrink-0 border-b border-line px-3 py-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-fg-subtle">
          Loading editor…
        </span>
      </div>
      <div className="min-h-0 flex-1 animate-pulse bg-surface/30" />
    </div>
  );
}
