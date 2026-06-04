import { useState } from 'react';
import { useProgressStore } from '../store/progress';

export function ResetProgress(): JSX.Element {
  const resetAll = useProgressStore((s) => s.resetAll);
  const [confirming, setConfirming] = useState(false);

  const onClick = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    resetAll();
    // Clear theme + sidebar namespaces too, so the whole gotour:v1 tree is fresh.
    try {
      localStorage.removeItem('gotour:v1:theme');
      localStorage.removeItem('gotour:v1:sidebar');
    } catch {
      // ignore
    }
    setConfirming(false);
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={onClick}
      onBlur={() => setConfirming(false)}
      className="rounded border border-ink-700 px-3 py-1.5 text-xs text-ink-300 hover:border-red-400 hover:text-red-300"
    >
      {confirming ? 'Click again to confirm — this clears all progress' : 'Reset progress'}
    </button>
  );
}
