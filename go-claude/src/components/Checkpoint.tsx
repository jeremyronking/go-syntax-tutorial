import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Checkpoint as CheckpointT, Question } from '../content/types';
import { sections } from '../content/sections';
import { lessonsBySection } from '../content/lessons';
import { useProgressStore, useCheckpointScore } from '../store/progress';

const PASS_THRESHOLD = 0.8;

export function Checkpoint({ checkpoint }: { checkpoint: CheckpointT }) {
  const [answers, setAnswers] = useState<Record<number, string | number | undefined>>({});
  const [submitted, setSubmitted] = useState(false);
  const recordScore = useProgressStore((s) => s.recordCheckpointScore);
  const markSectionComplete = useProgressStore((s) => s.markSectionComplete);
  const previous = useCheckpointScore(checkpoint.id);

  const total = checkpoint.questions.length;
  const correct = useMemo(() => {
    return checkpoint.questions.reduce((acc, q, i) => (isCorrect(q, answers[i]) ? acc + 1 : acc), 0);
  }, [answers, checkpoint.questions]);

  const section = sections.find((s) => s.id === checkpoint.sectionId);
  const sectionLessons = lessonsBySection(checkpoint.sectionId);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const score = { correct, total, lastAttempt: new Date().toISOString() };
    recordScore(checkpoint.id, score);
    if (correct / total >= PASS_THRESHOLD) {
      markSectionComplete(sectionLessons.map((l) => l.slug));
    }
  };

  const onRetake = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const passed = submitted && correct / total >= PASS_THRESHOLD;

  return (
    <article className="px-6 lg:px-10 py-10 max-w-prose">
      <p className="font-mono text-xs uppercase tracking-widest text-gopher">
        {section?.letter ?? '?'} · checkpoint
      </p>
      <h1 className="mt-2 text-3xl font-semibold">{checkpoint.title}</h1>
      <p className="mt-3 text-sm text-ink-300">
        {total} question{total === 1 ? '' : 's'}. Pass at ≥ {Math.round(PASS_THRESHOLD * 100)}% to
        mark this section complete. Failing does not block any lesson.
      </p>
      {previous && (
        <p className="mt-2 text-xs text-ink-500">
          Best score: {previous.correct}/{previous.total} ·{' '}
          {new Date(previous.lastAttempt).toLocaleDateString()}
        </p>
      )}

      <form onSubmit={onSubmit} className="mt-8 space-y-8">
        {checkpoint.questions.map((q, i) => (
          <QuestionView
            key={i}
            index={i}
            question={q}
            answer={answers[i]}
            submitted={submitted}
            onChange={(value) => setAnswers((a) => ({ ...a, [i]: value }))}
          />
        ))}

        <div className="flex items-center gap-3 pt-4 border-t border-ink-800">
          {!submitted && (
            <button
              type="submit"
              disabled={Object.keys(answers).length < total}
              className="rounded-md bg-gopher px-4 py-2 text-sm font-medium text-ink-950 hover:bg-gopher-400 disabled:opacity-50"
            >
              Submit
            </button>
          )}
          {submitted && (
            <>
              <p className="text-sm">
                Score:{' '}
                <span className={passed ? 'text-gopher font-semibold' : 'text-red-400'}>
                  {correct}/{total} ({Math.round((correct / total) * 100)}%)
                </span>
                {passed ? ' — section marked complete.' : ' — try again, or move on.'}
              </p>
              <button
                type="button"
                onClick={onRetake}
                className="ml-auto rounded-md border border-ink-700 px-3 py-1 text-xs hover:border-gopher hover:text-gopher"
              >
                Retake
              </button>
            </>
          )}
          <Link
            to={sectionLessons[sectionLessons.length - 1] ? `/lesson/${sectionLessons[sectionLessons.length - 1]!.slug}` : '/'}
            className="text-xs text-ink-400 hover:text-gopher"
          >
            Skip — not now
          </Link>
        </div>
      </form>
    </article>
  );
}

function QuestionView({
  index,
  question,
  answer,
  submitted,
  onChange,
}: {
  index: number;
  question: Question;
  answer: string | number | undefined;
  submitted: boolean;
  onChange: (value: string | number) => void;
}) {
  const correct = isCorrect(question, answer);

  return (
    <div className="rounded-md border border-ink-800 bg-ink-900/40 p-5">
      <p className="font-mono text-[10px] uppercase tracking-widest text-ink-500">
        Question {index + 1}
      </p>
      <p className="mt-2 font-medium text-ink-50">{question.prompt}</p>

      {question.kind === 'mcq' && (
        <ul className="mt-4 space-y-2">
          {question.options.map((opt, i) => {
            const selected = answer === i;
            const isThisCorrect = i === question.correctIndex;
            const showCorrect = submitted && isThisCorrect;
            const showWrong = submitted && selected && !isThisCorrect;
            return (
              <li key={i}>
                <label
                  className={[
                    'flex items-start gap-3 px-3 py-2 rounded border cursor-pointer text-sm',
                    showCorrect
                      ? 'border-gopher bg-gopher/10 text-ink-50'
                      : showWrong
                        ? 'border-red-500/60 bg-red-500/5'
                        : selected
                          ? 'border-ink-500'
                          : 'border-ink-800 hover:border-ink-600',
                  ].join(' ')}
                >
                  <input
                    type="radio"
                    name={`q${index}`}
                    className="mt-1 accent-gopher"
                    checked={selected}
                    disabled={submitted}
                    onChange={() => onChange(i)}
                  />
                  <span>{opt}</span>
                </label>
              </li>
            );
          })}
        </ul>
      )}

      {question.kind === 'fill' && (
        <input
          type="text"
          value={typeof answer === 'string' ? answer : ''}
          disabled={submitted}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Your answer…"
          className="mt-4 w-full rounded border border-ink-800 bg-ink-950 px-3 py-2 text-sm font-mono outline-none focus:border-gopher disabled:opacity-60"
        />
      )}

      {submitted && (
        <p
          className={`mt-3 text-sm ${correct ? 'text-gopher' : 'text-red-400'}`}
          aria-live="polite"
        >
          {correct ? '✓ Correct.' : '✗ Not quite.'} {question.explanation}
        </p>
      )}
    </div>
  );
}

function isCorrect(q: Question, answer: string | number | undefined): boolean {
  if (answer === undefined) return false;
  if (q.kind === 'mcq') {
    return answer === q.correctIndex;
  }
  if (q.kind === 'fill' && typeof answer === 'string') {
    const normalised = answer.trim().toLowerCase();
    return q.acceptedAnswers.some((a) => a.trim().toLowerCase() === normalised);
  }
  return false;
}
