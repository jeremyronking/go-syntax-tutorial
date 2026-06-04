import { Link, useParams } from 'react-router-dom';
import { SECTIONS } from '../content/sections';
import lessons from '../content/lessons';
import { useProgressStore } from '../store/progress';
import { useSidebarStore } from '../store/sidebar';
import type { SectionId } from '../content/types';

function ProgressBar({ value }: { value: number }): JSX.Element {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded bg-ink-800"
      role="progressbar"
      aria-valuenow={Math.round(pct * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-gopher-cyan transition-all"
        style={{ width: `${pct * 100}%` }}
      />
    </div>
  );
}

export function Sidebar(): JSX.Element {
  const activeSlug = useParams<{ slug: string }>().slug;
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggle = useSidebarStore((s) => s.toggle);
  const progress = useProgressStore((s) => s.progress);

  return (
    <nav aria-label="Lessons" className="p-3 text-sm">
      <h2 className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">
        Sections
      </h2>
      <ul className="space-y-2">
        {SECTIONS.map((section) => {
          const sectionLessons = lessons
            .filter((l) => l.section === section.id)
            .sort((a, b) => a.order - b.order);
          if (sectionLessons.length === 0) return null;
          const completed = sectionLessons.filter(
            (l) => progress[l.slug] === 'complete',
          ).length;
          const total = sectionLessons.length;
          const isCollapsed = collapsed[section.id];
          return (
            <li key={section.id} className="rounded border border-ink-800 bg-ink-900/40">
              <button
                type="button"
                onClick={() => toggle(section.id as SectionId)}
                aria-expanded={!isCollapsed}
                className="flex w-full items-baseline gap-2 px-2 py-1.5 text-left hover:bg-ink-800/60"
              >
                <span className="font-mono text-xs text-gopher-cyan">{section.id}</span>
                <span className="flex-1 text-xs font-medium text-ink-50">{section.title}</span>
                <span className="font-mono text-[10px] text-ink-400">
                  {completed}/{total}
                </span>
                <span aria-hidden className="text-ink-500">
                  {isCollapsed ? '▸' : '▾'}
                </span>
              </button>
              <div className="px-2 pb-1">
                <ProgressBar value={completed / total} />
              </div>
              {!isCollapsed ? (
                <ul className="border-t border-ink-800">
                  {sectionLessons.map((l) => {
                    const isActive = l.slug === activeSlug;
                    const status = progress[l.slug];
                    return (
                      <li key={l.slug}>
                        <Link
                          to={`/lesson/${l.slug}`}
                          aria-current={isActive ? 'page' : undefined}
                          className={`flex items-baseline gap-2 px-2 py-1 text-xs hover:bg-ink-800/60 ${
                            isActive ? 'bg-ink-800/80 text-ink-50' : 'text-ink-200'
                          }`}
                        >
                          <span className="font-mono text-[10px] text-ink-500">
                            {l.order.toString().padStart(2, '0')}
                          </span>
                          <span className="flex-1 truncate">{l.title}</span>
                          {status === 'complete' ? (
                            <span aria-label="Complete" className="text-gopher-cyan">
                              ✓
                            </span>
                          ) : null}
                          {status === 'in-progress' ? (
                            <span aria-label="In progress" className="text-amber-700 dark:text-amber-300">
                              ●
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
