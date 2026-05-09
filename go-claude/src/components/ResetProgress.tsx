import { useProgressStore } from '../store/progress';

export function ResetProgress() {
  const reset = useProgressStore((s) => s.resetAll);
  const onClick = () => {
    if (
      window.confirm(
        'Reset all progress? This clears lesson status, editor drafts, and checkpoint scores.'
      )
    ) {
      reset();
      window.localStorage.removeItem('gotour:v1');
      window.location.reload();
    }
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs text-ink-500 hover:text-red-400 transition-colors"
    >
      Reset progress
    </button>
  );
}
