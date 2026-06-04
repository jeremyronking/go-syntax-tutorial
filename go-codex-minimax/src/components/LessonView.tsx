import { Link } from 'react-router-dom';
import type { Lesson } from '../content/types';
import { Prose } from './Prose';
import { Gotcha } from './Gotcha';
import { LessonNote } from './LessonNote';
import { lazy, Suspense } from 'react';
const CodeRunner = lazy(() => import('./CodeRunner').then(m => ({ default: m.CodeRunner })));
import { TerminalPane } from './TerminalPane';
import { AnnotatedPane } from './AnnotatedPane';

interface LessonViewProps {
  draft?: string;
  onDraftChange?: (value: string) => void;
  onMarkInProgress?: () => void;

  lesson: Lesson;
  prev?: Lesson;
  next?: Lesson;
}

export function LessonView({ lesson, prev, next, draft, onDraftChange, onMarkInProgress }: LessonViewProps): JSX.Element {
  return (
    <article className="mx-auto max-w-prose px-6 py-8">
      <header className="mb-4">
        <p className="font-mono text-xs text-gopher-cyan">
          Section {lesson.section} · Lesson {lesson.order}
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-ink-50">{lesson.title}</h1>
      </header>
      {lesson.note ? <LessonNote>{lesson.note}</LessonNote> : null}
      <Prose body={lesson.body} />
      {lesson.gotcha ? <Gotcha>{lesson.gotcha}</Gotcha> : null}
      {lesson.runMode === 'playground' && lesson.starterCode ? (
        <Suspense fallback={<div className="mt-6 rounded-md border border-ink-700 bg-ink-900/40 p-4 text-sm text-ink-300">Loading editor...</div>}>
        <div className="mt-6">
          <CodeRunner
            lessonSlug={lesson.slug}
            starterCode={lesson.starterCode}
            streamReplay={Boolean(lesson.streamReplay)}
            draft={draft}
            onDraftChange={(v) => {
              onMarkInProgress?.();
              onDraftChange?.(v);
            }}
          />
        </div>
        </Suspense>
      ) : lesson.runMode === 'terminal' && lesson.terminalOutput ? (
        <div className="mt-6">
          <TerminalPane lines={lesson.terminalOutput} />
        </div>
      ) : lesson.runMode === 'annotated' && lesson.starterCode ? (
        <div className="mt-6">
          <AnnotatedPane code={lesson.starterCode} />
        </div>
      ) : (
        <div className="mt-6 rounded-md border border-dashed border-ink-700 bg-ink-900/40 p-4 text-sm text-ink-300">
          <p className="font-mono text-xs uppercase tracking-wider text-ink-500">
            {lesson.runMode}
          </p>
          <p className="mt-1">No content configured for this lesson yet.</p>
        </div>
      )}
      <nav className="mt-8 flex items-center justify-between border-t border-ink-800 pt-4 text-sm">
        <div>
          {prev ? (
            <Link to={`/lesson/${prev.slug}`} className="text-gopher-cyan hover:underline">
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
        </div>
        <div>
          {next ? (
            <Link to={`/lesson/${next.slug}`} className="text-gopher-cyan hover:underline">
              {next.title} →
            </Link>
          ) : (
            <Link to="/" className="text-ink-400 hover:text-gopher-cyan">
              Back to landing
            </Link>
          )}
        </div>
      </nav>
    </article>
  );
}
