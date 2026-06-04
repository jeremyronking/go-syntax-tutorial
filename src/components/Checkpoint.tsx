import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Checkpoint, Question } from '../content/types';
import { useProgressStore } from '../store/progress';

interface CheckpointProps {
  checkpoint: Checkpoint;
  sectionSlugs: string[];
}

type AnswerMap = Record<string, number | string | undefined>;

function isCorrect(q: Question, answer: number | string | undefined): boolean {
  if (answer === undefined) return false;
  if (q.kind === 'mcq') return typeof answer === 'number' && answer === q.correctIndex;
  if (q.kind === 'fill') {
    if (typeof answer !== 'string') return false;
    const norm = answer.trim().toLowerCase();
    return q.acceptedAnswers.some((a) => a.trim().toLowerCase() === norm);
  }
  return false;
}

export function Checkpoint({ checkpoint, sectionSlugs }: CheckpointProps): JSX.Element {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const record = useProgressStore((s) => s.recordCheckpoint);
  const markSectionComplete = useProgressStore((s) => s.markSectionComplete);

  const { correct, total } = useMemo(() => {
    const c = checkpoint.questions.filter((q) => isCorrect(q, answers[q.id])).length;
    return { correct: c, total: checkpoint.questions.length };
  }, [answers, checkpoint.questions]);

  const pct = total === 0 ? 0 : Math.round((correct / total) * 100);
  const passed = pct >= checkpoint.passingPct;

  const onSubmit = () => {
    setSubmitted(true);
    record(checkpoint.id, correct, total);
    if (passed) markSectionComplete(sectionSlugs);
  };

  const onRetake = () => {
    setAnswers({});
    setSubmitted(false);
    setAttempt((a) => a + 1);
  };

  return (
    <article className="mx-auto max-w-prose px-6 py-8">
      <header className="mb-4">
        <p className="font-mono text-xs text-gopher-cyan">Checkpoint · Section {checkpoint.sectionSlug}</p>
        <h1 className="mt-1 text-3xl font-semibold text-white">{checkpoint.title}</h1>
      </header>
      <ol className="space-y-6">
        {checkpoint.questions.map((q, i) => {
          const userAnswer = answers[q.id];
          const correct = isCorrect(q, userAnswer);
          return (
            <li key={`${checkpoint.id}-${q.id}-${attempt}`} className="rounded border border-ink-800 bg-ink-900/40 p-4">
              <p className="text-sm font-medium text-white">
                <span className="mr-2 text-gopher-cyan">{i + 1}.</span>
                {q.prompt}
              </p>
              {q.kind === 'mcq' ? (
                <ul className="mt-3 space-y-1.5">
                  {q.options.map((opt, idx) => {
                    const selected = userAnswer === idx;
                    const showCorrect = submitted && idx === q.correctIndex;
                    const showWrong = submitted && selected && idx !== q.correctIndex;
                    return (
                      <li key={idx}>
                        <label
                          className={`flex cursor-pointer items-start gap-2 rounded border px-2 py-1.5 text-sm ${
                            showCorrect
                              ? 'border-emerald-400 bg-emerald-400/10 text-emerald-100'
                              : showWrong
                                ? 'border-red-400 bg-red-400/10 text-red-100'
                                : selected
                                  ? 'border-gopher-cyan bg-gopher-cyan/10 text-white'
                                  : 'border-ink-700 text-ink-200 hover:border-ink-500'
                          }`}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            className="mt-1"
                            checked={selected}
                            disabled={submitted}
                            onChange={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                          />
                          <span>{opt}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <input
                  type="text"
                  value={typeof userAnswer === 'string' ? userAnswer : ''}
                  disabled={submitted}
                  onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                  className="mt-3 w-full rounded border border-ink-700 bg-ink-950 px-2 py-1.5 font-mono text-sm text-white focus:border-gopher-cyan focus:outline-none"
                  placeholder="Type your answer…"
                />
              )}
              {submitted ? (
                <p
                  className={`mt-2 text-xs ${correct ? 'text-emerald-300' : 'text-red-300'}`}
                >
                  {correct ? '✓ Correct.' : '✗ Incorrect.'} {q.explanation}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
      <div className="mt-6 flex items-center gap-3">
        {!submitted ? (
          <button
            type="button"
            onClick={onSubmit}
            className="rounded bg-gopher-cyan px-4 py-1.5 text-sm font-medium text-ink-950 hover:bg-gopher-dark"
          >
            Submit answers
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onRetake}
              className="rounded border border-ink-600 px-4 py-1.5 text-sm text-ink-100 hover:border-gopher-cyan hover:text-gopher-cyan"
            >
              Retake
            </button>
            <Link
              to="/"
              className="text-sm text-ink-400 underline-offset-2 hover:underline"
            >
              Skip — not now
            </Link>
          </>
        )}
      </div>
      {submitted ? (
        <div
          role="status"
          aria-live="polite"
          className={`mt-4 rounded border p-3 text-sm ${
            passed
              ? 'border-emerald-400/60 bg-emerald-400/5 text-emerald-100'
              : 'border-ink-700 bg-ink-900/40 text-ink-200'
          }`}
        >
          {passed
            ? `Passed with ${pct}% (≥ ${checkpoint.passingPct}%). Section lessons marked complete.`
            : `Scored ${pct}%. You need ${checkpoint.passingPct}% to mark the section complete, but you can keep going.`}{' '}
          Score: {correct} / {total}.
        </div>
      ) : null}
    </article>
  );
}
