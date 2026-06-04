import { Link } from 'react-router-dom';

interface Section {
  slug: string;
  title: string;
  blurb: string;
}

const SECTIONS: Section[] = [
  { slug: 'A', title: 'Language fundamentals', blurb: 'Hello world through zero values and untyped constants.' },
  { slug: 'B', title: 'Control flow', blurb: 'if, for, switch, type switch, defer, goto.' },
  { slug: 'C', title: 'Composite types', blurb: 'Arrays, slices (and aliasing), maps, structs, pointers.' },
  { slug: 'D', title: 'Functions', blurb: 'Multi-return, variadics, closures, methods, receivers.' },
  { slug: 'E', title: 'Interfaces & polymorphism', blurb: 'Implicit satisfaction, assertions, embedding, stdlib shapes.' },
  { slug: 'F', title: 'Generics', blurb: 'Type parameters, constraints, and when not to reach for them.' },
  { slug: 'G', title: 'Errors, panic, recover', blurb: 'error as a value, %w wrapping, when panic is appropriate.' },
  { slug: 'H', title: 'Concurrency', blurb: 'Goroutines, channels, select, sync, context.' },
  { slug: 'I', title: 'Packages & project layout', blurb: 'init order, internal/, //go:embed.' },
  { slug: 'J', title: 'Reflection & low-level', blurb: 'reflect, unsafe.Pointer, cgo, build tags.' },
  { slug: 'K', title: 'Toolchain', blurb: 'go run/build, modules, test, fmt, vet, doc, pprof.' },
];

export function Landing(): JSX.Element {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-4xl font-semibold text-white">
        Go<span className="text-gopher-cyan">Tour</span>
      </h1>
      <p className="mt-3 text-ink-300">
        An interactive tour of Go&apos;s syntax and toolchain, written for engineers who
        already know how to ship software. Each lesson is a short read paired with
        a runnable example against the public Go Playground.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          to="/lesson/hello-world"
          className="rounded bg-gopher-cyan px-4 py-2 text-sm font-medium text-ink-950 hover:bg-gopher-dark"
        >
          Start from the beginning
        </Link>
        <a
          href="#sections"
          className="rounded border border-ink-700 px-4 py-2 text-sm text-ink-200 hover:border-gopher-cyan hover:text-gopher-cyan"
        >
          Jump to a topic
        </a>
      </div>

      <h2 id="sections" className="mt-12 text-xl font-semibold text-white">
        Sections
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <li key={s.slug} id={`section-${s.slug}`}>
            <a
              href={`#section-${s.slug}`}
              className="block rounded border border-ink-800 bg-ink-900/50 p-4 hover:border-gopher-cyan"
            >
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-sm text-gopher-cyan">{s.slug}</span>
                <span className="font-medium text-white">{s.title}</span>
              </div>
              <p className="mt-1 text-sm text-ink-300">{s.blurb}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
