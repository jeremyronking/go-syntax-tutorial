import { useProgressStore, resetProgressNamespace } from '../store/progress';

/**
 * Clears the `gotour:v1` namespace. The page reloads afterwards so every
 * component reads from a clean store.
 */
export function ResetProgress() {
  const resetAll = useProgressStore((s) => s.resetAll);

  return (
    <button
      type="button"
      onClick={() => {
        if (!window.confirm('Reset all progress, editor drafts and checkpoint scores?')) {
          return;
        }
        resetAll();
        resetProgressNamespace();
        window.location.reload();
      }}
      className="rounded border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-fg-subtle transition-colors hover:border-red-500/60 hover:text-red-400"
    >
      Reset progress
    </button>
  );
}
