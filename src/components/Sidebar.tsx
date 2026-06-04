import { Link } from 'react-router-dom';

const SECTIONS = [
  { slug: 'A', title: 'Language fundamentals' },
  { slug: 'B', title: 'Control flow' },
  { slug: 'C', title: 'Composite types' },
  { slug: 'D', title: 'Functions' },
  { slug: 'E', title: 'Interfaces & polymorphism' },
  { slug: 'F', title: 'Generics' },
  { slug: 'G', title: 'Errors, panic, recover' },
  { slug: 'H', title: 'Concurrency' },
  { slug: 'I', title: 'Packages & project layout' },
  { slug: 'J', title: 'Reflection & low-level' },
  { slug: 'K', title: 'Toolchain' },
];

export function Sidebar(): JSX.Element {
  return (
    <nav aria-label="Sections" className="p-3 text-sm">
      <h2 className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">
        Sections
      </h2>
      <ul className="space-y-1">
        {SECTIONS.map((s) => (
          <li key={s.slug}>
            <Link
              to={`/#section-${s.slug}`}
              className="flex items-baseline gap-2 rounded px-2 py-1 text-ink-200 hover:bg-ink-800 hover:text-white"
            >
              <span className="font-mono text-xs text-gopher-cyan">{s.slug}</span>
              <span>{s.title}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-4 px-2 text-xs text-ink-500">
        Full lesson list lands in Phase 08.
      </p>
    </nav>
  );
}
