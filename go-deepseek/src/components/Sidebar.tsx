import { NavLink } from 'react-router-dom';
import { sections } from '../content/sections';
import { lessonsInSection } from '../content/lessons';
import type { Lesson } from '../content/types';
import { useLessonStatus, useProgressStore } from '../store/progress';
import { useSidebarStore } from '../store/sidebar';

export default function Sidebar() {
  const progress = useProgressStore((state) => state.progress);

  return (
    <aside
      className="hidden min-h-0 flex-col overflow-y-auto border-r border-divider bg-elevated/40 px-2 py-4 lg:flex"
      aria-label="Lesson navigation"
    >
      <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-subtle">
        Lessons
      </p>

      <nav className="mt-3 flex-1" aria-label="All lessons">
        <ul className="space-y-3">
          {sections.map((section) => {
            const sectionLessons = lessonsInSection(section.id);
            const complete = sectionLessons.filter(
              (lesson) => progress[lesson.slug] === 'complete'
            ).length;
            return (
              <SidebarSection
                key={section.id}
                sectionId={section.id}
                letter={section.letter}
                title={section.title}
                lessons={sectionLessons}
                complete={complete}
              />
            );
          })}
        </ul>
      </nav>

      <ResetProgress />
    </aside>
  );
}

type SidebarSectionProps = {
  sectionId: string;
  letter: string;
  title: string;
  lessons: Lesson[];
  complete: number;
};

function SidebarSection({ sectionId, letter, title, lessons, complete }: SidebarSectionProps) {
  const collapsed = useSidebarStore((state) => state.collapsed[sectionId] === true);
  const toggle = useSidebarStore((state) => state.toggle);
  const listId = `sidebar-${sectionId}`;
  const percent = lessons.length === 0 ? 0 : Math.round((complete / lessons.length) * 100);

  return (
    <li>
      <button
        type="button"
        onClick={() => toggle(sectionId)}
        aria-expanded={!collapsed}
        aria-controls={listId}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-fg transition-colors hover:bg-card"
      >
        <span className="font-mono text-xs text-gopher-700 dark:text-gopher-500">{letter}</span>
        <span className="flex-1 truncate font-medium">{title}</span>
        <span className="font-mono text-[10px] text-subtle">
          {complete}/{lessons.length}
        </span>
        <Chevron open={!collapsed} />
      </button>

      <div className="mx-2 mt-1.5 h-1 overflow-hidden rounded bg-card" aria-hidden="true">
        <div className="h-full rounded bg-gopher-600 transition-[width]" style={{ width: `${percent}%` }} />
      </div>

      {!collapsed ? (
        <ul id={listId} className="mt-1.5 space-y-0.5">
          {lessons.map((lesson) => (
            <SidebarLesson key={lesson.slug} lesson={lesson} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function SidebarLesson({ lesson }: { lesson: Lesson }) {
  const status = useLessonStatus(lesson.slug);

  return (
    <li>
      <NavLink
        to={`/lesson/${lesson.slug}`}
        className={({ isActive }) =>
          `flex items-center gap-2 rounded-md px-2 py-1 text-[13px] transition-colors ${
            isActive ? 'bg-gopher-100 text-gopher-800 dark:bg-gopher-900/40 dark:text-gopher-300' : 'text-muted hover:bg-card hover:text-fg'
          }`
        }
      >
        <span className="w-5 shrink-0 text-right font-mono text-[10px] text-subtle">
          {lesson.checkpoint ? 'CP' : lesson.order}
        </span>
        <span className="flex-1 truncate">{lesson.title}</span>
        {status === 'complete' ? <Check /> : null}
      </NavLink>
    </li>
  );
}

function Check() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      className="shrink-0 text-gopher-400"
      aria-label="Complete"
      role="img"
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`shrink-0 text-subtle transition-transform ${open ? 'rotate-90' : ''}`}
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function ResetProgress() {
  const resetProgress = useProgressStore((state) => state.resetProgress);

  const reset = () => {
    if (!window.confirm('Clear lesson progress, drafts, and checkpoint scores?')) return;
    resetProgress();
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={reset}
      className="mt-4 rounded-md border border-divider px-2 py-1.5 text-left text-xs text-subtle transition-colors hover:border-red-500/60 hover:text-red-400"
    >
      Reset progress
    </button>
  );
}
