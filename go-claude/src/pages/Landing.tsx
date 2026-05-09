import { Link } from 'react-router-dom';
import { sections } from '../content/sections';

export function Landing() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto">
      <header>
        <p className="font-mono text-xs uppercase tracking-widest text-gopher">GoTour</p>
        <h1 className="mt-2 text-4xl font-semibold">Learn Go syntax & toolchain.</h1>
        <p className="mt-4 max-w-prose text-fg leading-relaxed">
          A reference tour for engineers who already write code professionally and want to learn
          the way Go specifically spells things. Pick a topic, mutate the code, watch the compiler
          tell the truth.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/lesson/hello-world"
            className="inline-flex items-center gap-2 rounded-md bg-gopher px-4 py-2 font-medium text-ink-950 hover:bg-gopher-400 transition-colors"
          >
            Start from beginning →
          </Link>
          <a
            href="#sections"
            className="inline-flex items-center gap-2 rounded-md border border-divider px-4 py-2 text-fg hover:border-gopher hover:text-gopher transition-colors"
          >
            Jump to a topic ↓
          </a>
        </div>
      </header>

      <section id="sections" className="mt-14">
        <h2 className="text-xs font-mono uppercase tracking-widest text-fg-muted">Sections</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                id={`section-${s.id}`}
                href={`/section/${s.id}`}
                className="block rounded-md border border-divider bg-elevated/40 p-4 hover:border-gopher transition-colors"
              >
                <p className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-gopher">{s.letter}</span>
                  <span className="font-medium text-fg">{s.title}</span>
                </p>
                <p className="mt-1 text-sm text-fg-muted leading-relaxed">{s.blurb}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-16 text-xs text-fg-subtle">
        Code execution proxies to{' '}
        <code className="text-fg-muted">play.golang.org/compile</code>. No telemetry. Progress lives
        in <code className="text-fg-muted">localStorage</code> under{' '}
        <code className="text-fg-muted">gotour:v1</code>.
      </footer>
    </div>
  );
}
