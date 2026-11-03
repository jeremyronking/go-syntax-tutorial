import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import LessonView from '../components/LessonView';
import CodeRunner from '../components/CodeRunner';
import { lessonBySlug } from '../content/lessons';
import type { Lesson } from '../content/types';

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
    <Layout aside={<LessonWorkbench lesson={lesson} />}>
      <LessonView lesson={lesson} />
    </Layout>
  );
}

function LessonWorkbench({ lesson }: { lesson: Lesson }) {
  if (lesson.runMode === 'playground') return <CodeRunner lesson={lesson} />;
  return (
    <div className="p-4">
      <div className="rounded-lg border border-dashed border-divider bg-card/60 p-4 text-sm text-muted">
        {lesson.runMode === 'terminal'
          ? 'Captured terminal output renders here.'
          : 'An annotated code block renders here.'}
      </div>
    </div>
  );
}
