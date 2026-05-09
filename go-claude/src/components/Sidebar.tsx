import { Link, NavLink } from 'react-router-dom';
import { sections } from '../content/sections';
import { lessonsBySection } from '../content/lessons';
import { useProgressStore } from '../store/progress';
import { useSidebarStore } from '../store/sidebar';

export function Sidebar() {
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggle = useSidebarStore((s) => s.toggle);
  const progress = useProgressStore((s) => s.progress);

  return (
    <nav
      aria-label="Lesson navigation"
      className="hidden lg:block w-64 shrink-0 border-r border-ink-800 overflow-y-auto p-3 text-sm"
    >
      <Link
        to="/"
        className="block px-2 py-1 rounded text-[10px] font-mono uppercase tracking-widest text-ink-400 hover:text-gopher"
      >
        ← Sections
      </Link>
      <ul className="mt-2 space-y-1">
        {sections.map((s) => {
          const lessons = lessonsBySection(s.id);
          const total = lessons.length;
          const done = lessons.filter((l) => progress[l.slug] === 'complete').length;
          const isCollapsed = !!collapsed[s.id];
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;

          return (
            <li key={s.id} className="rounded">
              <button
                type="button"
                onClick={() => toggle(s.id)}
                aria-expanded={!isCollapsed}
                className="w-full flex items-center gap-2 px-2 py-1 text-left rounded hover:bg-ink-900/60"
              >
                <span aria-hidden="true" className="text-ink-500 text-xs">
                  {isCollapsed ? '▸' : '▾'}
                </span>
                <span className="font-mono text-xs text-gopher">{s.letter}</span>
                <span className="flex-1 text-ink-200">{s.title}</span>
                <span className="font-mono text-[10px] text-ink-500">
                  {done}/{total || '–'}
                </span>
              </button>
              {!isCollapsed && total > 0 && (
                <>
                  <div className="mx-2 mt-1 h-0.5 rounded bg-ink-800 overflow-hidden">
                    <div
                      className="h-full bg-gopher transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <ul className="ml-4 mt-1 space-y-0.5">
                    {lessons.map((l) => {
                      const status = progress[l.slug] ?? 'unstarted';
                      return (
                        <li key={l.slug}>
                          <NavLink
                            to={`/lesson/${l.slug}`}
                            className={({ isActive }) =>
                              [
                                'flex items-center gap-2 px-2 py-1 rounded text-xs',
                                isActive
                                  ? 'bg-ink-800 text-gopher'
                                  : 'text-ink-300 hover:bg-ink-900/60 hover:text-ink-100',
                              ].join(' ')
                            }
                          >
                            <span className="font-mono text-[10px] text-ink-500 w-4">
                              {l.order}
                            </span>
                            <span className="flex-1 truncate">{l.title}</span>
                            <span className="text-[10px]">
                              {status === 'complete' ? '✓' : status === 'in-progress' ? '·' : ''}
                            </span>
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
