import { useParams, Link } from 'react-router-dom';
import { lessonBySlug } from '../content/lessons';
import { sections } from '../content/sections';
import { Prose } from './Prose';
import { Gotcha } from './Gotcha';
import { CodeArea } from './CodeArea';
import { LessonNav } from './LessonNav';

export function LessonView() {
  const { slug } = useParams<{ slug: string }>();
  const lesson = slug ? lessonBySlug(slug) : undefined;

  if (!lesson) {
    return (
      <div className="px-6 lg:px-10 py-10 max-w-prose">
        <h1 className="text-2xl font-semibold">Lesson not found</h1>
        <p className="mt-2 text-fg-muted">No lesson registered for slug “{slug}”.</p>
        <Link to="/" className="mt-4 inline-block text-gopher hover:underline">
          ← Back to landing
        </Link>
      </div>
    );
  }

  const section = sections.find((s) => s.id === lesson.sectionId);

  return (
    <article className="px-6 lg:px-10">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-10 lg:items-start">
        {/* Left column — prose, scrolls with the page. Vertical padding lives
            here (not on the article) so it doesn't push the right pane down. */}
        <div className="py-10 max-w-prose lg:max-w-none lg:min-w-0">
          <p className="font-mono text-xs uppercase tracking-widest text-gopher">
            {section?.letter ?? '?'} · {section?.title ?? lesson.sectionId}
          </p>
          <h1 className="mt-2 text-3xl font-semibold">{lesson.title}</h1>

          {lesson.concurrencyNote && (
            <p className="mt-3 italic text-sm text-fg-muted">
              Playground uses a deterministic fake clock; real runtime scheduling will differ.
            </p>
          )}

          <div className="mt-6">
            <Prose>{lesson.body}</Prose>
          </div>

          {lesson.gotcha && <Gotcha>{lesson.gotcha}</Gotcha>}

          <LessonNav slug={lesson.slug} />
        </div>

        {/* Right column — sticky on lg+, exactly fills the viewport below the
            topbar so the OUTPUT region is always visible without scrolling. */}
        <aside className="mt-8 pb-10 lg:mt-0 lg:pb-0 lg:sticky lg:top-12 lg:h-[calc(100vh-3rem)]">
          <div className="h-[28rem] lg:h-full">
            <CodeArea lesson={lesson} />
          </div>
        </aside>
      </div>
    </article>
  );
}
