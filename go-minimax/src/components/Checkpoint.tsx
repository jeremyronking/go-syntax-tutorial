import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Checkpoint as CheckpointType, Question } from '../content/types';
import { sectionById } from '../content/sections';
import { manifestBySection } from '../content/lessons';
import { useProgressStore, useCheckpointScore } from '../store/progress';
import { PASS_THRESHOLD, isCorrect, passed, scoreQuestions, type Answer } from '../lib/checkpoint';

export function Checkpoint({ checkpoint }: { checkpoint: CheckpointType }) {
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [submitted, setSubmitted] = useState(false);
  const recordScore = useProgressStore((s) => s.recordCheckpointScore);
  const markComplete = useProgressStore((s) => s.markComplete);
  const previous = useCheckpointScore(checkpoint.id);

  const total = checkpoint.questions.length;
  const correct = useMemo(
    () => scoreQuestions(checkpoint.questions, answers),
    [answers, checkpoint.questions]
  );

  const section = sectionById.get(checkpoint.sectionId);
  const sectionLessons = manifestBySection(checkpoint.sectionId);
  const lastLesson = sectionLessons[sectionLessons.length - 1];

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    recordScore(checkpoint.id, {
      correct,
      total,
      lastAttempt: new Date().toISOString(),
    });
    if (passed(correct, total)) {
      // Mark every lesson of the section complete. The slugs come from the
      // manifest, so the section's prose does not have to be loaded here.
      markComplete(sectionLessons.map((l) => l.slug));
    }
  };

  const didPass = submitted && passed(correct, total);

  return (
    <article className="px-6 py-10 max-w-prose lg:px-10">
      <p className="font-mono text-xs uppercase tracking-widest text-gopher">
        {section?.letter ?? '?'} · checkpoint
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{checkpoint.title}</h1>
      <p className="mt-3 text-sm text-fg-muted">
        {total} question{total === 1 ? '' : 's'}. Pass at {Math.round(PASS_THRESHOLD * 100)}% to
        mark this section complete — but failing never blocks the next section.
      </p>
      {previous && (
        <p className="mt-2 text-xs text-fg-subtle">
          Best score: {previous.correct}/{previous.total} ·{' '}
          {new Date(previous.lastAttempt).toLocaleDateString()}
        </p>
      )}

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        {checkpoint.questions.map((question, i) => (
          <QuestionCard
            key={i}
            index={i}
            question={question}
            answer={answers[i]}
            submitted={submitted}
            onChange={(value) => setAnswers((a) => ({ ...a, [i]: value }))}
          />
        ))}

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
          {!submitted && (
            <button
              type="submit"
              disabled={Object.keys(answers).length < total}
              className="rounded-md bg-gopher px-4 py-2 text-sm font-medium text-ink-950 transition-colors hover:bg-gopher-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit
            </button>
          )}

          {submitted && (
            <>
              <p className="text-sm" aria-live="polite">
                Score:{' '}
                <span className={didPass ? 'font-semibold text-gopher' : 'text-red-400'}>
                  {correct}/{total} ({Math.round((correct / total) * 100)}%)
                </span>
                {didPass ? ' — section marked complete.' : ' — you can retake it or move on.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setAnswers({});
                  setSubmitted(false);
                }}
                className="rounded-md border border-line px-3 py-1 text-xs text-fg-muted transition-colors hover:border-gopher hover:text-gopher"
              >
                Retake
              </button>
            </>
          )}

          <Link
            to={lastLesson ? `/lesson/${lastLesson.slug}` : '/'}
            className="text-xs text-fg-muted transition-colors hover:text-gopher"
          >
            Skip — not now
          </Link>
        </div>
      </form>
    </article>
  );
}

function QuestionCard({
  index,
  question,
  answer,
  submitted,
  onChange,
}: {
  index: number;
  question: Question;
  answer: Answer;
  submitted: boolean;
  onChange: (value: string | number) => void;
}) {
  const correct = isCorrect(question, answer);

  return (
    <fieldset className="rounded-md border border-line bg-surface/40 p-5">
      <legend className="font-mono text-[10px] uppercase tracking-widest text-fg-subtle">
        Question {index + 1}
      </legend>
      <p className="mt-1 font-medium text-fg">{question.prompt}</p>

      {question.kind === 'mcq' && (
        <ul className="mt-4 space-y-2">
          {question.options.map((option, i) => {
            const selected = answer === i;
            const isThisCorrect = i === question.correctIndex;
            const showCorrect = submitted && isThisCorrect;
            const showWrong = submitted && selected && !isThisCorrect;
            return (
              <li key={i}>
                <label
                  className={[
                    'flex cursor-pointer items-start gap-3 rounded border px-3 py-2 text-sm transition-colors',
                    showCorrect
                      ? 'border-gopher bg-gopher/10 text-fg'
                      : showWrong
                        ? 'border-red-500/60 bg-red-500/5'
                        : selected
                          ? 'border-fg-subtle'
                          : 'border-line hover:border-fg-subtle',
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
                  <span>{option}</span>
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
          aria-label={`Answer for question ${index + 1}`}
          className="mt-4 w-full rounded border border-line bg-app px-3 py-2 font-mono text-sm text-fg outline-none transition-colors focus:border-gopher disabled:opacity-60"
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
    </fieldset>
  );
}
