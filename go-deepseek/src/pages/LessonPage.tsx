import { useCallback, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import LessonView from '../components/LessonView';
import CodeRunner from '../components/CodeRunner';
import TerminalPane from '../components/TerminalPane';
import AnnotatedPane from '../components/AnnotatedPane';
import { lessonBySlug, neighbouringLessons } from '../content/lessons';
import type { Lesson } from '../content/types';
import { useLessonStatus, useProgressStore } from '../store/progress';

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

  return <LessonContent lesson={lesson} />;
}

function LessonContent({ lesson }: { lesson: Lesson }) {
  const status = useLessonStatus(lesson.slug);
  const markStarted = useProgressStore((state) => state.markStarted);
  const markComplete = useProgressStore((state) => state.markComplete);
  const setDraft = useProgressStore((state) => state.setDraft);
  const draftTimer = useRef<number | undefined>(undefined);

  const handleDraftChange = useCallback(
    (source: string) => {
      window.clearTimeout(draftTimer.current);
      draftTimer.current = window.setTimeout(() => setDraft(lesson.slug, source), 400);
    },
    [lesson.slug, setDraft]
  );

  useEffect(() => () => window.clearTimeout(draftTimer.current), []);

  const { prev, next } = neighbouringLessons(lesson.slug);

  return (
    <Layout aside={<LessonWorkbench lesson={lesson} onRun={() => markStarted(lesson.slug)} onDraftChange={handleDraftChange} />}>
      <LessonView
        lesson={lesson}
        prev={prev}
        next={next}
        footer={
          <footer className="mt-8 flex flex-wrap items-center gap-3 border-t border-divider pt-4">
            <button
              type="button"
              onClick={() => markComplete(lesson.slug)}
              disabled={status === 'complete'}
              className="rounded-md border border-divider bg-elevated px-3 py-1.5 text-sm text-muted transition-colors hover:border-gopher-600 hover:text-fg disabled:cursor-default disabled:border-gopher-700 disabled:text-gopher-300"
            >
              {status === 'complete' ? 'Completed' : 'Mark complete'}
            </button>
            <span className="text-xs text-subtle">
              {status === 'unstarted'
                ? 'Not started'
                : status === 'in-progress'
                  ? 'In progress'
                  : 'Complete'}
            </span>
          </footer>
        }
      />
    </Layout>
  );
}

type WorkbenchProps = {
  lesson: Lesson;
  onRun: () => void;
  onDraftChange: (source: string) => void;
};

function LessonWorkbench({ lesson, onRun, onDraftChange }: WorkbenchProps) {
  switch (lesson.runMode) {
    case 'playground':
      return (
        <CodeRunner
          key={lesson.slug}
          lesson={lesson}
          onRun={onRun}
          onDraftChange={onDraftChange}
        />
      );
    case 'terminal':
      return <TerminalPane title={lesson.title} lines={lesson.terminalOutput ?? []} />;
    case 'annotated':
      return <AnnotatedPane source={lesson.starterCode ?? ''} />;
  }
}
