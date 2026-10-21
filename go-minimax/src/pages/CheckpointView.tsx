import { useParams } from 'react-router-dom';
import { checkpointBySection } from '../content/checkpoints';
import { Checkpoint } from '../components/Checkpoint';

export function CheckpointView() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const checkpoint = sectionId ? checkpointBySection(sectionId) : undefined;

  if (!checkpoint) {
    return (
      <div className="px-6 py-12 max-w-prose">
        <h1 className="text-2xl font-semibold">No checkpoint here</h1>
        <p className="mt-2 text-fg-muted">No checkpoint is registered for “{sectionId}”.</p>
        <a href="/" className="mt-4 inline-block text-gopher hover:underline">
          ← Back to landing
        </a>
      </div>
    );
  }

  return <Checkpoint checkpoint={checkpoint} />;
}
