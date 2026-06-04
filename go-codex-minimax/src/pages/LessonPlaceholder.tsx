import { useParams, Link } from 'react-router-dom';

export function LessonPlaceholder(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  return (
    <article className="mx-auto max-w-prose px-6 py-10">
      <h1 className="text-3xl font-semibold text-ink-50">Lesson: {slug}</h1>
      <p className="mt-4 text-ink-300">
        Lesson content lands in Phase 04. The Monaco code runner and terminal
        pane arrive in Phases 05–06.
      </p>
      <p className="mt-4">
        <Link to="/" className="text-gopher-cyan underline">
          ← Back to landing
        </Link>
      </p>
    </article>
  );
}
