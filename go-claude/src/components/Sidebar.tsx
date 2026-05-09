import { sections } from '../content/sections';

export function Sidebar() {
  return (
    <nav
      aria-label="Lesson navigation"
      className="hidden lg:block w-64 shrink-0 border-r border-ink-800 overflow-y-auto p-4 text-sm"
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-ink-400">Sections</p>
      <ul className="mt-3 space-y-2">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`/#section-${s.id}`}
              className="block py-1 text-ink-200 hover:text-gopher transition-colors"
            >
              <span className="font-mono text-xs text-ink-400 mr-2">{s.letter}</span>
              {s.title}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-[10px] text-ink-500 leading-relaxed">
        Lesson list arrives in Phase 08.
      </p>
    </nav>
  );
}
