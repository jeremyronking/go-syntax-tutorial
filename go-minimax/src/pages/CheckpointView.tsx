import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { hasCheckpoint, loadCheckpoint } from '../content/checkpoints';
import { Checkpoint } from '../components/Checkpoint';
import type { Checkpoint as CheckpointType } from '../content/types';

type State =
  { kind: 'loading' } | { kind: 'ready'; checkpoint: CheckpointType } | { kind: 'missing' };

export function CheckpointView() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    if (!sectionId || !hasCheckpoint(sectionId)) {
      setState({ kind: 'missing' });
      return;
    }

    let cancelled = false;
    setState({ kind: 'loading' });

    void loadCheckpoint(sectionId).then((checkpoint) => {
      if (cancelled) return;
      setState(checkpoint ? { kind: 'ready', checkpoint } : { kind: 'missing' });
    });

    return () => {
      cancelled = true;
    };
  }, [sectionId]);

  if (state.kind === 'missing') {
    return (
      <div className="px-6 py-12 max-w-prose">
        <h1 className="text-2xl font-semibold">No checkpoint here</h1>
        <p className="mt-2 text-fg-muted">No checkpoint is registered for “{sectionId}”.</p>
        <Link to="/" className="mt-4 inline-block text-gopher hover:underline">
          ← Back to landing
        </Link>
      </div>
    );
  }

  if (state.kind === 'loading') {
    return (
      <div className="px-6 py-12 max-w-prose" aria-busy="true" aria-live="polite">
        <p className="font-mono text-xs uppercase tracking-widest text-fg-subtle">
          Loading checkpoint…
        </p>
        <div className="mt-4 space-y-3">
          {[90, 80, 85].map((w, i) => (
            <div
              key={i}
              className="h-4 animate-pulse rounded bg-surface"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return <Checkpoint checkpoint={state.checkpoint} />;
}
