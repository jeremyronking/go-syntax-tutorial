import { sections } from '../content/sections';
import { useProgressStore } from '../store/progress';

export default function Sidebar() {
  return (
    <aside
      className="hidden min-h-0 flex-col overflow-y-auto border-r border-divider bg-elevated/40 px-3 py-4 lg:flex"
      aria-label="Lesson navigation"
    >
      <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-subtle">
        Sections
      </p>
      <ul className="mt-3 flex-1 space-y-1">
        {sections.map((section) => (
          <li key={section.id} className="rounded-md px-2 py-1.5 text-sm text-muted">
            <span className="mr-2 font-mono text-xs text-subtle">{section.letter}</span>
            {section.title}
          </li>
        ))}
      </ul>
      <ResetProgress />
    </aside>
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
