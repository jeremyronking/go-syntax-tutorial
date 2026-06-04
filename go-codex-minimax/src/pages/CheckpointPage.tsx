import { useParams, Link } from 'react-router-dom';
import { checkpointById } from '../content/checkpoints/registry';
import lessons from '../content/lessons';
import { Checkpoint } from '../components/Checkpoint';

export function CheckpointPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return <p className="p-8 text-ink-300">Missing checkpoint id.</p>;
  }
  const cp = checkpointById(id);
  if (!cp) {
    return (
      <article className="mx-auto max-w-prose px-6 py-10">
        <h1 className="text-3xl font-semibold text-white">Checkpoint not found</h1>
        <p className="mt-3 text-ink-300">
          No checkpoint with id <code className="font-mono">{id}</code> is registered.
        </p>
        <p className="mt-4 text-sm">
          <Link to="/" className="text-gopher-cyan underline">← Back to landing</Link>
        </p>
      </article>
    );
  }
  const sectionSlugs = lessons
    .filter((l) => l.section === cp.sectionSlug)
    .map((l) => l.slug);
  return <Checkpoint checkpoint={cp} sectionSlugs={sectionSlugs} />;
}
