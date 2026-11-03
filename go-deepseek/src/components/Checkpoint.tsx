import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Checkpoint as CheckpointType, Question } from '../content/types';
import { lessonsInSection } from '../content/lessons';
import { useCheckpointScore, useProgressStore } from '../store/progress';

const PASS_RATIO = 0.8;

type Answers = Record<number, number | string>;

type CheckpointProps = {
  checkpoint: CheckpointType;
  returnSlug?: string;
};

export default function Checkpoint({ checkpoint, returnSlug }: CheckpointProps) {
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const best = useCheckpointScore(checkpoint.id);
  const recordCheckpoint = useProgressStore((state) => state.recordCheckpoint);
  const markComplete = useProgressStore((state) => state.markComplete);

  const total = checkpoint.questions.length;
  const answered = Object.keys(answers).length;
  const result = useMemo(
    () => checkpoint.questions.map((question, index) => isCorrect(question, answers[index])),
    [answers, checkpoint.questions]
  );
  const correct = result.filter(Boolean).length;
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);

  const submit = () => {
    recordCheckpoint(checkpoint.id, correct, total);
    if (correct / total >= PASS_RATIO) {
      lessonsInSection(checkpoint.sectionId).forEach((lesson) => markComplete(lesson.slug));
    }
    setSubmitted(true);
  };

  const retake = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <section
      className="mt-8 rounded-xl border border-divider bg-elevated p-4 sm:p-5"
      aria-labelledby="checkpoint-title"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="checkpoint-title" className="text-lg font-semibold tracking-tight">
          {checkpoint.title}
        </h2>
        <span className="font-mono text-xs text-subtle">
          {total} questions · pass at {Math.round(PASS_RATIO * 100)}%
        </span>
      </div>

      {best ? (
        <p className="mt-1 text-xs text-subtle">
          Best score: {best.correct}/{best.total} ({Math.round((best.correct / best.total) * 100)}%)
        </p>
      ) : null}

      <ol className="mt-4 space-y-5">
        {checkpoint.questions.map((question, index) => {
          const answeredCorrectly = submitted ? result[index] : undefined;
          return (
            <li key={index} className="rounded-lg border border-divider bg-card/60 p-3.5">
              <p className="text-sm font-medium text-fg">
                <span className="mr-1.5 font-mono text-xs text-subtle">{index + 1}.</span>
                {question.prompt}
              </p>

              {question.kind === 'mcq' ? (
                <fieldset className="mt-2.5 space-y-1.5">
                  <legend className="sr-only">Choose one answer</legend>
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className={`flex cursor-pointer items-start gap-2 rounded px-2 py-1 text-sm ${
                        submitted
                          ? optionIndex === question.correctIndex
                            ? 'text-emerald-300'
                            : answers[index] === optionIndex
                              ? 'text-red-300'
                              : 'text-muted'
                          : 'text-muted hover:bg-elevated'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${index}`}
                        value={optionIndex}
                        checked={answers[index] === optionIndex}
                        disabled={submitted}
                        onChange={() => setAnswers((current) => ({ ...current, [index]: optionIndex }))}
                        className="mt-0.5 accent-gopher-500"
                      />
                      <span className="font-mono text-[13px]">{option}</span>
                    </label>
                  ))}
                </fieldset>
              ) : (
                <label className="mt-2.5 block">
                  <span className="sr-only">Your answer</span>
                  <input
                    type="text"
                    value={typeof answers[index] === 'string' ? answers[index] : ''}
                    disabled={submitted}
                    onChange={(event) =>
                      setAnswers((current) => ({ ...current, [index]: event.target.value }))
                    }
                    placeholder="Type the answer"
                    className="w-full rounded-md border border-divider bg-app px-2.5 py-1.5 font-mono text-sm text-fg placeholder:text-subtle focus:border-gopher-600 focus:outline-none"
                  />
                </label>
              )}

              {submitted ? (
                <div
                  className={`mt-2.5 rounded-md border px-3 py-2 text-xs leading-relaxed ${
                    answeredCorrectly
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                      : 'border-red-500/30 bg-red-500/10 text-red-200'
                  }`}
                >
                  <p className="font-semibold">
                    {answeredCorrectly ? 'Correct' : 'Not quite'}
                    {question.kind === 'mcq'
                      ? ` — answer: ${question.options[question.correctIndex]}`
                      : ` — accepted: ${question.acceptedAnswers.join(' / ')}`}
                  </p>
                  <p className="mt-0.5">{question.explanation}</p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {!submitted ? (
          <button
            type="button"
            onClick={submit}
            disabled={answered < total}
            className="rounded-md bg-gopher-500 px-4 py-2 text-sm font-semibold text-[#06232b] transition-colors hover:bg-gopher-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit answers
          </button>
        ) : (
          <button
            type="button"
            onClick={retake}
            className="rounded-md border border-divider bg-elevated px-4 py-2 text-sm text-muted transition-colors hover:border-gopher-600 hover:text-fg"
          >
            Retake
          </button>
        )}

        {!submitted && answered < total ? (
          <span className="text-xs text-subtle">
            {answered}/{total} answered
          </span>
        ) : null}

        {submitted ? (
          <p className="text-sm" role="status">
            <span className={correct / total >= PASS_RATIO ? 'text-emerald-300' : 'text-amber-300'}>
              {correct}/{total} ({percent}%)
            </span>{' '}
            <span className="text-subtle">
              {correct / total >= PASS_RATIO
                ? '— section marked complete.'
                : '— keep going; this never blocks the next lesson.'}
            </span>
          </p>
        ) : null}

        <Link
          to={returnSlug ? `/lesson/${returnSlug}` : '/'}
          className="ml-auto text-xs text-subtle hover:text-fg"
        >
          Skip — not now
        </Link>
      </div>
    </section>
  );
}

function isCorrect(question: Question, answer: number | string | undefined): boolean {
  if (answer === undefined) return false;
  if (question.kind === 'mcq') return answer === question.correctIndex;
  return question.acceptedAnswers.some(
    (accepted) => accepted.trim().toLowerCase() === String(answer).trim().toLowerCase()
  );
}
