import { useParams, Link } from 'react-router-dom';
import lessons, { lessonBySlug } from '../content/lessons';
import { LessonView } from '../components/LessonView';

export function LessonPage(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) {
    return <p className="p-8 text-ink-300">Missing lesson slug.</p>;
  }
  const lesson = lessonBySlug(slug);
  if (!lesson) {
    return (
      <article className="mx-auto max-w-prose px-6 py-10">
        <h1 className="text-3xl font-semibold text-white">Lesson not found</h1>
        <p className="mt-3 text-ink-300">
          No lesson with slug <code className="font-mono">{slug}</code> is registered yet.
        </p>
        <p className="mt-4 text-sm">
          <Link to="/" className="text-gopher-cyan underline">← Back to landing</Link>
        </p>
      </article>
    );
  }
  const sorted = [...lessons].sort((a, b) =>
    a.section === b.section ? a.order - b.order : a.section.localeCompare(b.section),
  );
  const idx = sorted.findIndex((l) => l.slug === lesson.slug);
  const prev = idx > 0 ? sorted[idx - 1] : undefined;
  const next = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : undefined;
  return <LessonView lesson={lesson} prev={prev} next={next} />;
}
