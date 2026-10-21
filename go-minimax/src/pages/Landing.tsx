import { Link } from 'react-router-dom';
import { sections } from '../content/sections';
import { lessons } from '../content/lessons';

export function Landing() {
  const firstLesson = lessons[0];

  return (
    <div className="px-6 py-12 lg:px-10 lg:py-16">
      <div className="max-w-prose">
        <p className="font-mono text-xs uppercase tracking-widest text-gopher">GoTour</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight lg:text-5xl">
          Go syntax &amp; toolchain, by example
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-fg-muted">
          A reference tour of the language and the standard toolchain, written for engineers who
          already know how to program. No CS fundamentals — just how Go spells things, what the
          zero values are, and where the footguns live.
        </p>
        <p className="mt-4 text-fg-muted">
          Every playground lesson runs against the real Go Playground. Lessons the sandbox cannot
          execute — toolchain commands, <code className="rounded bg-surface px-1.5 py-0.5">cgo</code>,
          <code className="rounded bg-surface px-1.5 py-0.5">unsafe</code> — ship with a captured
          terminal transcript instead.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {firstLesson && (
            <Link
              to={`/lesson/${firstLesson.slug}`}
              className="rounded-md bg-gopher px-4 py-2 text-sm font-medium text-ink-950 transition-colors hover:bg-gopher-400"
            >
              Start from the beginning
            </Link>
          )}
          <a
            href="#sections"
            className="rounded-md border border-line px-4 py-2 text-sm text-fg-muted transition-colors hover:border-gopher hover:text-gopher"
          >
            Jump to a topic
          </a>
        </div>
      </div>

      <section id="sections" className="mt-16 scroll-mt-20">
        <h2 className="font-mono text-xs uppercase tracking-widest text-fg-subtle">
          The eleven sections
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sections.map((s) => {
            const count = lessons.filter((l) => l.sectionId === s.id).length;
            return (
              <li key={s.id}>
                <article
                  id={s.id}
                  className="h-full scroll-mt-20 rounded-md border border-line bg-surface/40 p-5 transition-colors hover:border-gopher/60"
                >
                  <p className="font-mono text-xs text-gopher">{s.letter}</p>
                  <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{s.blurb}</p>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-fg-subtle">
                    {count} lesson{count === 1 ? '' : 's'}
                  </p>
                </article>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
