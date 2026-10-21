import { Link } from 'react-router-dom';
import { sections } from '../content/sections';

/**
 * Placeholder rail. Phase 08 replaces this with the real lesson list,
 * section grouping and progress bars.
 */
export function Sidebar() {
  return (
    <nav
      aria-label="Lesson navigation"
      className="hidden w-64 shrink-0 border-r border-line lg:block lg:sticky lg:top-12 lg:h-[calc(100vh-3rem)] lg:overflow-y-auto lg:p-4"
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-fg-subtle">Sections</p>
      <ul className="mt-3 space-y-1">
        {sections.map((s) => (
          <li key={s.id}>
            <Link
              to={`/#${s.id}`}
              className="flex items-baseline gap-2 rounded px-2 py-1 text-sm text-fg-muted transition-colors hover:bg-surface hover:text-fg"
            >
              <span className="font-mono text-xs text-gopher">{s.letter}</span>
              <span>{s.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
