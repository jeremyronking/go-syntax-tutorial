import { useParams, Link } from 'react-router-dom';
import { lessonBySlug } from '../content/lessons';
import { sections } from '../content/sections';
import { Prose } from './Prose';
import { Gotcha } from './Gotcha';
import { CodeArea } from './CodeArea';

export function LessonView() {
  const { slug } = useParams<{ slug: string }>();
  const lesson = slug ? lessonBySlug(slug) : undefined;

  if (!lesson) {
    return (
      <div className="px-6 lg:px-10 py-10 max-w-prose">
        <h1 className="text-2xl font-semibold">Lesson not found</h1>
        <p className="mt-2 text-ink-300">No lesson registered for slug “{slug}”.</p>
        <Link to="/" className="mt-4 inline-block text-gopher hover:underline">
          ← Back to landing
        </Link>
      </div>
    );
  }

  const section = sections.find((s) => s.id === lesson.sectionId);

  return (
    <article className="px-6 lg:px-10 py-10 max-w-prose">
      <p className="font-mono text-xs uppercase tracking-widest text-gopher">
        {section?.letter ?? '?'} · {section?.title ?? lesson.sectionId}
      </p>
      <h1 className="mt-2 text-3xl font-semibold">{lesson.title}</h1>

      {lesson.concurrencyNote && (
        <p className="mt-3 italic text-sm text-ink-400">
          Playground uses a deterministic fake clock; real runtime scheduling will differ.
        </p>
      )}

      <div className="mt-6">
        <Prose>{lesson.body}</Prose>
      </div>

      <div className="mt-6">
        <CodeArea lesson={lesson} />
      </div>

      {lesson.gotcha && <Gotcha>{lesson.gotcha}</Gotcha>}
    </article>
  );
}
