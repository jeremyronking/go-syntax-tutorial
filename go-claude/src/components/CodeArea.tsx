import { Suspense, lazy } from 'react';
import type { Lesson } from '../content/types';
import { TerminalPane } from './TerminalPane';

// Lazy-load Monaco so the editor bundle is split off the critical path.
const CodeRunner = lazy(() =>
  import('./CodeRunner').then((m) => ({ default: m.CodeRunner }))
);

export function CodeArea({ lesson }: { lesson: Lesson }) {
  if (lesson.runMode === 'playground' && lesson.starterCode) {
    return (
      <Suspense fallback={<EditorSkeleton />}>
        <CodeRunner lesson={lesson} />
      </Suspense>
    );
  }
  if (lesson.runMode === 'terminal' && lesson.terminalOutput) {
    return <TerminalPane lines={lesson.terminalOutput} />;
  }
  if (lesson.runMode === 'annotated' && lesson.starterCode) {
    return (
      <pre className="rounded-md border border-ink-800 bg-ink-900/40 p-4 text-sm font-mono overflow-x-auto">
        {lesson.starterCode}
      </pre>
    );
  }
  return null;
}

function EditorSkeleton() {
  return (
    <div className="rounded-md border border-ink-800 bg-ink-900/40 overflow-hidden">
      <div className="border-b border-ink-800 px-3 py-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-500">
          Loading editor…
        </span>
      </div>
      <div className="h-[320px] animate-pulse bg-ink-900/30" />
    </div>
  );
}
