import { useParams, Link } from 'react-router-dom';
import { Checkpoint } from '../components/Checkpoint';
import { checkpointBySection } from '../content/checkpoints';

export function CheckpointView() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const checkpoint = sectionId ? checkpointBySection(sectionId) : undefined;
  if (!checkpoint) {
    return (
      <div className="px-6 lg:px-10 py-10 max-w-prose">
        <h1 className="text-2xl font-semibold">Checkpoint not yet authored</h1>
        <p className="mt-2 text-ink-300">No questions registered for section "{sectionId}".</p>
        <Link to="/" className="mt-4 inline-block text-gopher hover:underline">
          ← Back to landing
        </Link>
      </div>
    );
  }
  return <Checkpoint checkpoint={checkpoint} />;
}
