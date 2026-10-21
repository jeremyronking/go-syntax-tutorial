import { Link, useParams } from 'react-router-dom';
import { lessonBySlug } from '../content/lessons';
import { sectionById } from '../content/sections';
import { Prose } from './Prose';
import { Gotcha } from './Gotcha';
import { CodeArea } from './CodeArea';

export function LessonView() {
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

  const section = sectionById.get(lesson.sectionId);

  return (
    <article className="px-6 py-10 lg:px-10">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:items-start lg:gap-10">
        <div className="min-w-0 max-w-prose">
          <p className="font-mono text-xs uppercase tracking-widest text-gopher">
            {section?.letter ?? '?'} · {section?.title ?? lesson.sectionId}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{lesson.title}</h1>

          {lesson.note && (
            <p className="mt-3 border-l-2 border-gopher pl-3 text-sm italic text-fg-muted">
              {lesson.note}
            </p>
          )}

          <div className="mt-6">
            <Prose>{lesson.body}</Prose>
          </div>

          {lesson.gotcha && (
            <div className="mt-8">
              <Gotcha>{lesson.gotcha}</Gotcha>
            </div>
          )}
        </div>

        <aside className="mt-10 lg:mt-0 lg:sticky lg:top-16">
          <CodeArea lesson={lesson} />
        </aside>
      </div>
    </article>
  );
}
