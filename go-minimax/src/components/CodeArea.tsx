import { Suspense, lazy } from 'react';
import type { Lesson } from '../content/types';
import { TerminalPane } from './TerminalPane';
import { AnnotatedPane } from './AnnotatedPane';

const CodeRunner = lazy(() =>
  import('./CodeRunner').then((m) => ({ default: m.CodeRunner }))
);

/**
 * The code pane on the right of a lesson. Which pane appears depends on the
 * lesson's `runMode`:
 *
 * - `playground` — the Monaco editor plus Run/Reset and the output pane
 * - `terminal`   — a recorded shell transcript, read-only
 * - `annotated`  — a static, syntax-highlighted snippet
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
    return <AnnotatedPane key={lesson.slug} code={lesson.starterCode} />;
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
