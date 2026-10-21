import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { loadLesson, metaBySlug } from '../content/lessons';
import { sectionById } from '../content/sections';
import { hasCheckpoint } from '../content/checkpoints';
import { useProgressStore } from '../store/progress';
import { Gotcha } from './Gotcha';
import { CodeArea } from './CodeArea';
import { LessonNav } from './LessonNav';
import type { Lesson } from '../content/types';
import type { Prose as ProseComponent } from './Prose';

type State =
  | { kind: 'loading' }
  | { kind: 'ready'; lesson: Lesson; Prose: typeof ProseComponent }
  | { kind: 'missing' };

export function LessonView() {
  const { slug } = useParams<{ slug: string }>();
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    if (!slug) {
      setState({ kind: 'missing' });
      return;
    }

    let cancelled = false;
    setState({ kind: 'loading' });

    // The lesson prose and the markdown renderer are fetched in parallel and
    // the page is only rendered once both are in. Rendering the prose in a
    // second pass would push the footer and the "gotcha" note down the
    // page, which reads as a jump.
    void Promise.all([loadLesson(slug), import('./Prose')]).then(([lesson, mod]) => {
      if (cancelled) return;
      setState(lesson ? { kind: 'ready', lesson, Prose: mod.Prose } : { kind: 'missing' });
    });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (state.kind === 'missing') {
    return (
      <div className="px-6 py-12 max-w-prose">
        <h1 className="text-2xl font-semibold">Lesson not found</h1>
        <p className="mt-2 text-fg-muted">No lesson registered for slug “{slug}”.</p>
        <Link to="/" className="mt-4 inline-block text-gopher hover:underline">
          ← Back to landing
        </Link>
      </div>
    );
  }

  if (state.kind === 'loading') {
    return <LessonSkeleton />;
  }

  return <LoadedLesson lesson={state.lesson} Prose={state.Prose} />;
}

function LoadedLesson({ lesson, Prose }: { lesson: Lesson; Prose: typeof ProseComponent }) {
  const status = useProgressStore((s) => s.progress[lesson.slug] ?? 'unstarted');
  const setLessonStatus = useProgressStore((s) => s.setLessonStatus);

  const section = sectionById.get(lesson.sectionId);

  return (
    <article className="px-6 py-10 lg:px-10">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:items-start lg:gap-10">
        <div className="min-w-0 max-w-prose">
          <p className="font-mono text-xs uppercase tracking-widest text-gopher">
            {section?.letter ?? '?'} · {section?.title ?? lesson.sectionId}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{lesson.title}</h1>

          {lesson.note && (
            <p className="mt-3 border-l-2 border-gopher pl-3 text-sm italic text-fg-muted">
              {lesson.note}
            </p>
          )}

          <div className="mt-6">
            <Prose>{lesson.body}</Prose>
          </div>

          {lesson.gotcha && (
            <div className="mt-8">
              <Gotcha>{lesson.gotcha}</Gotcha>
            </div>
          )}

          <div className="mt-8 flex items-center gap-3 border-t border-line pt-5">
            <button
              type="button"
              onClick={() => setLessonStatus(lesson.slug, 'complete')}
              disabled={status === 'complete'}
              className="rounded-md border border-line px-3 py-1.5 text-xs text-fg-muted transition-colors hover:border-gopher hover:text-gopher disabled:cursor-default disabled:opacity-60"
            >
              {status === 'complete' ? '✓ Completed' : 'Mark complete'}
            </button>
            {status === 'in-progress' && (
              <span className="font-mono text-[10px] uppercase tracking-widest text-fg-subtle">
                In progress
              </span>
            )}
          </div>

          <LessonNav slug={lesson.slug} />

          {hasCheckpoint(lesson.sectionId) && (
            <Link
              to={`/checkpoint/${lesson.sectionId}`}
              className="mt-4 inline-flex items-center gap-2 rounded-md border border-line px-3 py-1.5 text-xs text-fg-muted transition-colors hover:border-gopher hover:text-gopher"
            >
              Section checkpoint →
            </Link>
          )}
        </div>

        <aside className="mt-10 lg:mt-0 lg:sticky lg:top-16">
          <CodeArea lesson={lesson} />
        </aside>
      </div>
    </article>
  );
}

/**
 * The lesson's prose arrives in a separate chunk, so the first paint of
 * a lesson shows a placeholder rather than an empty page. The shape
 * matches the real layout to avoid a visible jump.
 */
function LessonSkeleton() {
  const meta = useParams<{ slug: string }>();
  const title = meta.slug ? (metaBySlug(meta.slug)?.title ?? 'Loading…') : 'Loading…';

  return (
    <article className="px-6 py-10 lg:px-10" aria-busy="true" aria-live="polite">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:items-start lg:gap-10">
        <div className="min-w-0 max-w-prose">
          <p className="font-mono text-xs uppercase tracking-widest text-fg-subtle">
            Loading lesson…
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-fg-muted">{title}</h1>
          <div className="mt-6 space-y-3">
            {[100, 92, 96, 78, 88].map((w, i) => (
              <div
                key={i}
                className="h-4 animate-pulse rounded bg-surface"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        </div>
        <aside className="mt-10 lg:mt-0">
          <div className="h-64 animate-pulse rounded-md border border-line bg-surface/40" />
        </aside>
      </div>
    </article>
  );
}
