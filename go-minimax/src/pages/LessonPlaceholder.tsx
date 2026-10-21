import { Link, useParams } from 'react-router-dom';
import { lessonBySlug } from '../content/lessons';

export function LessonPlaceholder() {
  const { slug } = useParams<{ slug: string }>();
  const lesson = slug ? lessonBySlug(slug) : undefined;

  if (!lesson) {
    return (
      <div className="px-6 py-12 max-w-prose">
        <h1 className="text-2xl font-semibold">Lesson not found</h1>
        <p className="mt-2 text-fg-muted">No lesson registered for slug “{slug}”.</p>
        <Link to="/" className="mt-4 inline-block text-gopher hover:underline">
          ← Back to landing
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 max-w-prose">
      <p className="font-mono text-xs uppercase tracking-widest text-gopher">Lesson</p>
      <h1 className="mt-2 text-3xl font-semibold">{lesson.title}</h1>
      <p className="mt-3 text-fg-muted">
        The lesson renderer lands in Phase 04. This route proves the slug resolves.
      </p>
      <Link to="/" className="mt-6 inline-block text-gopher hover:underline">
        ← Back to landing
      </Link>
    </div>
  );
}
