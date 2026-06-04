import { useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import lessons, { lessonBySlug } from '../content/lessons';
import { useProgressStore, useEditorDraft } from '../store/progress';
import { LessonView } from '../components/LessonView';

export function LessonPage(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const draft = useEditorDraft(slug ?? '');
  const setDraft = useProgressStore((s) => s.setDraft);
  const markInProgress = useProgressStore((s) => s.markInProgress);
  const markComplete = useProgressStore((s) => s.markComplete);

  const handleDraft = useCallback(
    (value: string) => {
      if (!slug) return;
      setDraft(slug, value);
      markInProgress(slug);
    },
    [markInProgress, setDraft, slug],
  );

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
  return (
    <div>
      <LessonView
        lesson={lesson}
        prev={prev}
        next={next}
        draft={draft}
        onDraftChange={handleDraft}
      />
      <div className="mx-auto max-w-prose px-6 pb-12 text-right">
        <button
          type="button"
          onClick={() => markComplete(lesson.slug)}
          className="rounded border border-gopher-cyan/60 px-3 py-1.5 text-xs text-gopher-cyan hover:bg-gopher-cyan/10"
        >
          Mark complete
        </button>
      </div>
    </div>
  );
}
