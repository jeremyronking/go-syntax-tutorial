import { sections } from '../content/sections';

export default function Sidebar() {
  return (
    <aside
      className="hidden min-h-0 overflow-y-auto border-r border-divider bg-elevated/40 px-3 py-4 lg:block"
      aria-label="Lesson navigation"
    >
      <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-subtle">
        Sections
      </p>
      <ul className="mt-3 space-y-1">
        {sections.map((section) => (
          <li key={section.id} className="rounded-md px-2 py-1.5 text-sm text-muted">
            <span className="mr-2 font-mono text-xs text-subtle">{section.letter}</span>
            {section.title}
          </li>
        ))}
      </ul>
    </aside>
  );
}
