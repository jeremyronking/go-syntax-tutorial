import { Link, NavLink } from 'react-router-dom';
import { sections } from '../content/sections';
import { lessons, lessonsBySection } from '../content/lessons';
import { useProgressStore } from '../store/progress';
import { useSidebarStore } from '../store/sidebar';

/**
 * The left rail. Every lesson is always reachable — progress never locks a
 * route, it only decorates it.
 *
 * On `lg+` the rail is a sticky column. Below that it becomes a slide-over
 * drawer opened from the top bar.
 */
export function Sidebar({
  mobileOpen = false,
  onClose,
}: {
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggle = useSidebarStore((s) => s.toggle);
  const progress = useProgressStore((s) => s.progress);

  const contents = (
    <>
      <Link
        to="/"
        onClick={onClose}
        className="block rounded px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-fg-muted transition-colors hover:text-gopher"
      >
        ← Sections
      </Link>

      <ul className="mt-3 space-y-1">
        {sections.map((section) => {
          const sectionLessons = lessonsBySection(section.id);
          const total = sectionLessons.length;
          const done = sectionLessons.filter((l) => progress[l.slug] === 'complete').length;
          const isCollapsed = collapsed[section.id] === true;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;

          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => toggle(section.id)}
                aria-expanded={!isCollapsed}
                className="flex w-full items-center gap-2 rounded px-2 py-1 text-left transition-colors hover:bg-surface"
              >
                <span aria-hidden="true" className="text-[10px] text-fg-subtle">
                  {isCollapsed ? '▸' : '▾'}
                </span>
                <span className="font-mono text-xs text-gopher">{section.letter}</span>
                <span className="flex-1 truncate text-sm text-fg">{section.title}</span>
                <span className="font-mono text-[10px] text-fg-subtle">
                  {done}/{total || '–'}
                </span>
              </button>

              {!isCollapsed && total > 0 && (
                <>
                  <div
                    className="mx-2 mt-1 h-0.5 overflow-hidden rounded bg-line"
                    role="progressbar"
                    aria-valuenow={done}
                    aria-valuemin={0}
                    aria-valuemax={total}
                    aria-label={`${section.title} progress`}
                  >
                    <div className="h-full bg-gopher transition-all" style={{ width: `${pct}%` }} />
                  </div>

                  <ul className="ml-3 mt-1 space-y-0.5">
                    {sectionLessons.map((lesson) => {
                      const status = progress[lesson.slug] ?? 'unstarted';
                      return (
                        <li key={lesson.slug}>
                          <NavLink
                            to={`/lesson/${lesson.slug}`}
                            onClick={onClose}
                            className={({ isActive }) =>
                              [
                                'flex items-center gap-2 rounded px-2 py-1 text-xs transition-colors',
                                isActive
                                  ? 'bg-line/60 text-gopher'
                                  : 'text-fg-muted hover:bg-surface hover:text-fg',
                              ].join(' ')
                            }
                          >
                            <span className="w-4 shrink-0 font-mono text-[10px] text-fg-subtle">
                              {lesson.order}
                            </span>
                            <span className="flex-1 truncate">{lesson.title}</span>
                            <span
                              aria-hidden="true"
                              className={
                                status === 'complete'
                                  ? 'text-gopher'
                                  : status === 'in-progress'
                                    ? 'text-fg-subtle'
                                    : ''
                              }
                            >
                              {status === 'complete' ? '✓' : status === 'in-progress' ? '◦' : ''}
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

      <p className="mt-6 border-t border-line px-2 pt-3 font-mono text-[10px] uppercase tracking-widest text-fg-subtle">
        {lessons.length} lessons
      </p>
    </>
  );

  return (
    <>
      {/* Desktop rail */}
      <nav
        aria-label="Lesson navigation"
        className="hidden w-64 shrink-0 border-r border-line lg:block lg:sticky lg:top-12 lg:h-[calc(100vh-3rem)] lg:overflow-y-auto lg:p-4"
      >
        {contents}
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
            aria-hidden="true"
          />
          <nav
            aria-label="Lesson navigation"
            className="absolute inset-y-0 left-0 w-72 overflow-y-auto border-r border-line bg-app p-4"
          >
            {contents}
          </nav>
        </div>
      )}
    </>
  );
}
