import { useState } from 'react';
import type { Checkpoint } from '../content/types';
import { useProgressStore } from '../store/progress';
import { lessons } from '../content/lessons';

type Props = { checkpoint: Checkpoint };

export default function Checkpoint({ checkpoint }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const setScore = useProgressStore((s) => s.setScore);
  const setStatus = useProgressStore((s) => s.setStatus);

  const score = () => {
    let correct = 0;
    checkpoint.questions.forEach((q, i) => {
      const a = answers[i];
      if (q.kind === 'mcq') {
        if (Number(a) === q.correctIndex) correct++;
      } else {
        if (q.acceptedAnswers.some((x) => x.trim().toLowerCase() === (a ?? '').trim().toLowerCase())) correct++;
      }
    });
    return correct;
  };

  const submit = () => {
    const c = score();
    const total = checkpoint.questions.length;
    setScore(checkpoint.id, { correct: c, total, lastAttempt: new Date().toISOString() });
    if (c / total >= 0.8) {
      lessons.filter((l) => l.sectionSlug === checkpoint.sectionSlug).forEach((l) => setStatus(l.slug, 'complete'));
    }
    setSubmitted(true);
  };

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const c = submitted ? score() : 0;
  const total = checkpoint.questions.length;

  return (
    <div className="border border-divider rounded p-4 bg-elevated">
      <h2 className="text-xl font-bold mb-3">Checkpoint: {checkpoint.sectionSlug}</h2>
      {checkpoint.questions.map((q, i) => (
        <div key={i} className="mb-4">
          <div className="mb-2">{q.prompt}</div>
          {q.kind === 'mcq' && (
            <div className="flex flex-col gap-1">
              {q.options.map((opt, j) => (
                <label key={j} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`q${i}`}
                    checked={answers[i] === String(j)}
                    onChange={() => setAnswers({ ...answers, [i]: String(j) })}
                    disabled={submitted}
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}
          {q.kind === 'fill' && (
            <input
              value={answers[i] ?? ''}
              onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
              disabled={submitted}
              className="border border-divider rounded px-2 py-1 bg-card w-full"
            />
          )}
          {submitted && (
            <div className={`mt-2 text-sm ${Number(answers[i]) === (q.kind === 'mcq' ? q.correctIndex : -1) || (q.kind === 'fill' && q.acceptedAnswers.some((x) => x.trim().toLowerCase() === (answers[i] ?? '').trim().toLowerCase())) ? 'text-green-500' : 'text-red-500'}`}>
              {q.explanation}
            </div>
          )}
        </div>
      ))}
      {!submitted ? (
        <button onClick={submit} className="bg-gopher text-white px-4 py-2 rounded">Submit</button>
      ) : (
        <div>
          <div className="mb-2 font-semibold">Score: {c}/{total} ({Math.round((c / total) * 100)}%)</div>
          <button onClick={reset} className="border border-divider rounded px-3 py-1 hover:bg-card">Retake</button>
          <button onClick={() => window.history.back()} className="ml-2 border border-divider rounded px-3 py-1 hover:bg-card">Skip — not now</button>
        </div>
      )}
    </div>
  );
}
