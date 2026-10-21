import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import type { Lesson } from '../content/types';
import { TerminalPane } from './TerminalPane';
import { AnnotatedPane } from './AnnotatedPane';

const CodeRunner = lazy(() => import('./CodeRunner').then((m) => ({ default: m.CodeRunner })));

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
    return <DeferredRunner lesson={lesson} />;
  }

  if (lesson.runMode === 'terminal' && lesson.terminalOutput) {
    return <TerminalPane key={lesson.slug} lines={lesson.terminalOutput} />;
  }

  if (lesson.runMode === 'annotated' && lesson.starterCode) {
    return <AnnotatedPane key={lesson.slug} code={lesson.starterCode} />;
  }

  return null;
}

/**
 * Monaco is the heaviest thing on the page — it is fetched from a CDN and
 * parsed on the main thread, which is a couple of hundred milliseconds of
 * work. On a phone the code pane sits below the whole lesson, so there is
 * no reason to pay for it until the reader gets there.
 *
 * The editor is mounted as soon as its placeholder comes near the
 * viewport. On a wide screen the pane is visible immediately, so the
 * editor loads straight away; on a narrow one it waits for the scroll.
 */
function DeferredRunner({ lesson }: { lesson: Lesson }) {
  const holderRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = holderRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      // Start loading a little before the pane scrolls into view.
      { rootMargin: '300px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={holderRef} className="h-full min-h-0">
      {visible ? (
        <Suspense fallback={<EditorSkeleton />}>
          <CodeRunner key={lesson.slug} lesson={lesson} />
        </Suspense>
      ) : (
        <EditorSkeleton />
      )}
    </div>
  );
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
