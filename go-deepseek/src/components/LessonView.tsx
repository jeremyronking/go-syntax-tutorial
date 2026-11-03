import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Lesson } from '../content/types';
import { sectionForLesson } from '../content/lessons';

type LessonViewProps = {
  lesson: Lesson;
  /** Live runner, terminal pane, or annotated block. */
  runnerSlot?: ReactNode;
  /** Checkpoint quiz rendered after the prose. */
  checkpointSlot?: ReactNode;
  footer?: ReactNode;
  prev?: Lesson;
  next?: Lesson;
};

export default function LessonView({
  lesson,
  runnerSlot,
  checkpointSlot,
  footer,
  prev,
  next,
}: LessonViewProps) {
  const section = sectionForLesson(lesson);

  return (
    <article className="mx-auto max-w-prose px-5 py-9">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle">
          {section ? `${section.letter} · ${section.title}` : 'Lesson'}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{lesson.title}</h1>
      </header>

      <div className="prose-gotour mt-5">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ href, children }) => (
              <a
                href={href}
                target={href?.startsWith('http') ? '_blank' : undefined}
                rel={href?.startsWith('http') ? 'noreferrer' : undefined}
              >
                {children}
              </a>
            ),
          }}
        >
          {lesson.body}
        </ReactMarkdown>
      </div>

      {lesson.concurrencyNote ? (
        <p className="mt-5 border-l-2 border-gopher-700 pl-3 text-sm italic text-muted">
          Playground uses a deterministic fake clock; real runtime scheduling will differ.
        </p>
      ) : null}

      {runnerSlot}

      {checkpointSlot}

      {lesson.gotcha ? <Gotcha text={lesson.gotcha} /> : null}

      {footer}

      <nav className="mt-6 flex items-stretch justify-between gap-3" aria-label="Lesson navigation">
        {prev ? (
          <Link
            to={`/lesson/${prev.slug}`}
            className="group max-w-[48%] rounded-lg border border-divider bg-elevated px-3 py-2.5 text-left transition-colors hover:border-gopher-600"
          >
            <span className="block text-[10px] uppercase tracking-[0.16em] text-subtle">Previous</span>
            <span className="mt-0.5 block truncate text-sm text-muted group-hover:text-fg">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/lesson/${next.slug}`}
            className="group max-w-[48%] rounded-lg border border-divider bg-elevated px-3 py-2.5 text-right transition-colors hover:border-gopher-600"
          >
            <span className="block text-[10px] uppercase tracking-[0.16em] text-subtle">Next</span>
            <span className="mt-0.5 block truncate text-sm text-muted group-hover:text-fg">
              {next.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}

function Gotcha({ text }: { text: string }) {
  return (
    <aside
      className="mt-8 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4"
      aria-label="Gotcha"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-400">
        Gotcha
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-amber-100/90">{text}</p>
    </aside>
  );
}
