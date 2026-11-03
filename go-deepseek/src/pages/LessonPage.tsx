import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import LessonView from '../components/LessonView';
import { lessonBySlug } from '../content/lessons';

export default function LessonPage() {
  const { slug } = useParams<{ slug: string }>();
  const lesson = slug ? lessonBySlug(slug) : undefined;

  useEffect(() => {
    if (lesson) document.title = `${lesson.title} · GoTour`;
  }, [lesson]);

  if (!lesson) {
    return (
      <Layout>
        <div className="mx-auto max-w-prose px-5 py-12">
          <p className="font-mono text-sm text-gopher-500">404</p>
          <h1 className="mt-2 text-2xl font-semibold">Lesson not found</h1>
          <p className="mt-2 text-muted">
            No lesson is registered under <code className="font-mono">{slug}</code>.
          </p>
          <Link to="/" className="mt-6 inline-block text-sm text-gopher-400 hover:underline">
            &larr; Back to overview
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      aside={
        <div className="p-4">
          <div className="rounded-lg border border-divider bg-card p-4">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-subtle">Editor</p>
            <p className="mt-2 text-sm text-muted">The runner arrives in the next phase.</p>
          </div>
        </div>
      }
    >
      <LessonView
        lesson={lesson}
        runnerSlot={
          <div className="mt-6 rounded-lg border border-dashed border-divider bg-card/60 p-4 text-sm text-muted">
            {lesson.runMode === 'terminal'
              ? 'Captured terminal output renders here.'
              : 'A code area renders here.'}
          </div>
        }
      />
    </Layout>
  );
}
