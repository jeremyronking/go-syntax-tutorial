import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { sections } from '../content/sections';

export default function Landing() {
  const first = sections[0];

  return (
    <Layout>
      <div className="mx-auto max-w-prose px-5 py-10 sm:py-16">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gopher-700 dark:text-gopher-500">GoTour</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Go, the way you&rsquo;d learn it on the job
        </h1>
        <p className="mt-4 text-muted">
          Sixty-three lessons and eleven checkpoints for engineers who already program.
          Syntax, idioms, gotchas, and the toolchain commands you will actually type.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            to={`/lesson/${first.firstSlug}`}
            className="rounded-md bg-gopher-500 px-4 py-2 text-sm font-semibold text-[#06232b] transition-colors hover:bg-gopher-400"
          >
            Start from the beginning
          </Link>
          <a
            href="#topics"
            className="rounded-md border border-divider bg-elevated px-4 py-2 text-sm text-fg transition-colors hover:border-gopher-600"
          >
            Jump to a topic
          </a>
        </div>

        <p className="mt-5 text-sm text-subtle">
          Live execution runs on the public Go Playground. Toolchain lessons use captured terminal
          output.
        </p>

        <h2 id="topics" className="mt-14 scroll-mt-20 text-xl font-semibold tracking-tight">
          Eleven sections
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {sections.map((section) => (
            <li key={section.id}>
              <Link
                to={`/lesson/${section.firstSlug}`}
                className="group block h-full rounded-lg border border-divider bg-elevated p-4 transition-colors hover:border-gopher-600"
              >
                <span className="font-mono text-xs text-gopher-700 dark:text-gopher-500">{section.letter}</span>
                <span className="ml-2 font-medium group-hover:text-gopher-700 dark:group-hover:text-gopher-300">
                  {section.title}
                </span>
                <p className="mt-1 text-sm text-muted">{section.blurb}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
