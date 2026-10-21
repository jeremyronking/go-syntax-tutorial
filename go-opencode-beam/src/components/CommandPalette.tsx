import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fuse } from '../lib/search';

type Props = { open: boolean; onClose: () => void };

export default function CommandPalette({ open, onClose }: Props) {
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => (q.trim() ? fuse.search(q).slice(0, 20) : []), [q]);

  useEffect(() => {
    if (open) {
      setQ('');
      setIdx(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(i + 1, results.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
      if (e.key === 'Enter' && results[idx]) {
        navigate(`/lesson/${results[idx].item.slug}`);
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, results, idx, navigate, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-24 z-50" onClick={onClose}>
      <div role="dialog" aria-modal="true" className="bg-elevated border border-divider rounded-lg w-full max-w-xl p-3" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => { setQ(e.target.value); setIdx(0); }}
          placeholder="Search lessons…"
          className="w-full bg-card border border-divider rounded px-3 py-2 mb-2"
        />
        <ul className="max-h-80 overflow-y-auto">
          {results.map((r, i) => (
            <li key={r.item.slug}>
              <button
                onClick={() => { navigate(`/lesson/${r.item.slug}`); onClose(); }}
                className={`w-full text-left px-3 py-2 rounded ${i === idx ? 'bg-card' : ''}`}
              >
                <div className="font-medium">{r.item.title}</div>
                <div className="text-xs text-fg-muted">{r.item.section}</div>
              </button>
            </li>
          ))}
          {q.trim() && results.length === 0 && <li className="px-3 py-2 text-fg-muted">No results</li>}
        </ul>
      </div>
    </div>
  );
}
