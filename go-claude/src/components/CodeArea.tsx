import { Suspense, lazy } from 'react';
import type { Lesson } from '../content/types';
import { TerminalPane } from './TerminalPane';

// Lazy-load Monaco so the editor bundle is split off the critical path.
const CodeRunner = lazy(() =>
  import('./CodeRunner').then((m) => ({ default: m.CodeRunner }))
);

export function CodeArea({ lesson }: { lesson: Lesson }) {
  // Key by slug so React unmounts/remounts the runner on lesson change —
  // otherwise Monaco's internal state (and our local code state) bleeds
  // across lessons.
  if (lesson.runMode === 'playground' && lesson.starterCode) {
    return (
      <Suspense fallback={<EditorSkeleton />}>
        <CodeRunner key={lesson.slug} lesson={lesson} />
      </Suspense>
    );
  }
  if (lesson.runMode === 'terminal' && lesson.terminalOutput) {
    return <TerminalPane key={lesson.slug} lines={lesson.terminalOutput} />;
  }
  if (lesson.runMode === 'annotated' && lesson.starterCode) {
    return (
      <pre className="rounded-md border border-divider bg-elevated/40 p-4 text-sm font-mono overflow-x-auto">
        {lesson.starterCode}
      </pre>
    );
  }
  return null;
}

function EditorSkeleton() {
  return (
    <div className="rounded-md border border-divider bg-elevated/40 overflow-hidden">
      <div className="border-b border-divider px-3 py-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-fg-subtle">
          Loading editor…
        </span>
      </div>
      <div className="h-[320px] animate-pulse bg-elevated/30" />
    </div>
  );
}
