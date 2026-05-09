import { useParams } from 'react-router-dom';

export function LessonView() {
  const { slug } = useParams<{ slug: string }>();
  return (
    <div className="px-6 lg:px-10 py-10 max-w-prose">
      <p className="font-mono text-xs uppercase tracking-widest text-gopher">Lesson</p>
      <h1 className="mt-2 text-3xl font-semibold">/{slug}</h1>
      <p className="mt-4 text-ink-300">
        Lesson rendering arrives in Phase 04. The Monaco-backed runner arrives in Phase 05.
      </p>
    </div>
  );
}
