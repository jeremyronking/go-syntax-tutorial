import type { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Lesson } from '../content/types';
import { sectionForLesson } from '../content/lessons';

type LessonViewProps = {
  lesson: Lesson;
  /** Live runner, terminal pane, or annotated block. */
  runnerSlot?: ReactNode;
  footer?: ReactNode;
};

export default function LessonView({ lesson, runnerSlot, footer }: LessonViewProps) {
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

      {lesson.gotcha ? <Gotcha text={lesson.gotcha} /> : null}

      {footer}
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
