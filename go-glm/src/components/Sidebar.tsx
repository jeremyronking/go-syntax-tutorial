import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { lessons, lessonsBySection, sections } from "../content/lessons";
import { useProgressStore, useLessonStatus } from "../store/progress";

function SectionGroup({ section }: { section: string }) {
  const sectionLessons = lessonsBySection(section);
  const [collapsed, setCollapsed] = useState(false);

  const completedCount = sectionLessons.filter(
    (l) => useProgressStore.getState().progress[l.slug] === "complete",
  ).length;
  const total = sectionLessons.length;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  // Persist collapse state
  const STORAGE_KEY = `gotour:v1:sidebar:${section}`;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) setCollapsed(stored === "true");
    } catch {
      // ignore
    }
  }, [STORAGE_KEY]);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // ignore
    }
  };

  return (
    <div className="mb-2">
      <button
        onClick={toggleCollapse}
        className="flex items-center justify-between w-full px-2 py-1.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
      >
        <span>
          {collapsed ? "▸" : "▾"} Section {section}
        </span>
        <span className="text-xs text-gray-400">
          {completedCount}/{total}
        </span>
      </button>

      {/* Progress bar */}
      <div className="mx-2 mb-1 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-gopher-cyan)] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      {!collapsed && (
        <ul className="mt-1 space-y-0.5">
          {sectionLessons.map((l) => (
            <LessonRow key={l.slug} lesson={l} />
          ))}
        </ul>
      )}
    </div>
  );
}

function LessonRow({ lesson }: { lesson: (typeof lessons)[number] }) {
  const status = useLessonStatus(lesson.slug);
  const { slug } = useParams<{ slug: string }>();
  const isActive = slug === lesson.slug;

  return (
    <li>
      <Link
        to={`/lesson/${lesson.slug}`}
        className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
          isActive
            ? "bg-[var(--color-gopher-cyan)]/10 text-[var(--color-gopher-cyan)] font-medium"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        <span className="w-5 text-right text-xs text-gray-400 font-mono shrink-0">
          {lesson.order}
        </span>
        {status === "complete" && (
          <span className="text-green-500 shrink-0" aria-label="Complete">✓</span>
        )}
        {status === "in-progress" && (
          <span className="text-[var(--color-gopher-cyan)] shrink-0" aria-label="In progress">●</span>
        )}
        <span className="truncate">{lesson.title}</span>
      </Link>
    </li>
  );
}

export default function Sidebar() {
  return (
    <nav className="py-2" aria-label="Lesson navigation">
      {sections.map((s) => (
        <SectionGroup key={s} section={s} />
      ))}
    </nav>
  );
}