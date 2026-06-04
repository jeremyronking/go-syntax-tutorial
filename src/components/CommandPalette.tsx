// Placeholder for the search palette. Real implementation lands in Phase 09.
import { useEffect, useRef } from 'react';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps): JSX.Element | null {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Search lessons"
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink-950/70 p-4 pt-20"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg border border-ink-700 bg-ink-900 p-4 text-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-ink-300">Search lands in Phase 09.</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-3 rounded border border-ink-700 px-2 py-1 text-xs text-ink-200 hover:border-gopher-cyan hover:text-gopher-cyan"
        >
          Close
        </button>
      </div>
    </div>
  );
}
