import { Suspense, lazy } from 'react';
import type { Lesson } from '../content/types';
import { TerminalPane } from './TerminalPane';

const CodeRunner = lazy(() =>
  import('./CodeRunner').then((m) => ({ default: m.CodeRunner }))
);

/**
 * The right-hand pane on a lesson. Always fills its container's height;
 * the parent in LessonView is responsible for sticky positioning and
 * sizing (h-full lg:h-[calc(100vh-3rem)]).
 *
 * Keys are bound to lesson.slug so the runner / terminal pane fully
 * unmounts on lesson navigation — otherwise Monaco's internal state and
 * our local code state bleed across lessons.
 */
export function CodeArea({ lesson }: { lesson: Lesson }) {
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
      <pre className="rounded-md border border-divider bg-elevated/40 p-4 text-sm font-mono overflow-auto h-full">
        {lesson.starterCode}
      </pre>
    );
  }
  return null;
}

function EditorSkeleton() {
  return (
    <div className="rounded-md border border-divider bg-elevated/40 flex flex-col h-full overflow-hidden">
      <div className="border-b border-divider px-3 py-2 shrink-0">
        <span className="font-mono text-[10px] uppercase tracking-widest text-fg-subtle">
          Loading editor…
        </span>
      </div>
      <div className="flex-1 min-h-0 animate-pulse bg-elevated/30" />
    </div>
  );
}
