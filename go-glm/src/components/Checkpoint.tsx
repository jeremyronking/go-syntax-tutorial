import { useState, useCallback } from "react";
import type { Checkpoint, Question } from "../content/types";
import { useProgressStore } from "../store/progress";

import { lessons } from "../content/lessons";

interface CheckpointProps {
  checkpoint: Checkpoint;
}

export default function Checkpoint({ checkpoint }: CheckpointProps) {
  const [answers, setAnswers] = useState<(number | string)[]>(
    checkpoint.questions.map(() => -1),
  );
  const [submitted, setSubmitted] = useState(false);
  const existingScore = useProgressStore((s) => s.checkpointScores[checkpoint.id]);

  const correctCount = checkpoint.questions.reduce((sum, q, i) => {
    if (q.type === "mcq") {
      return sum + (answers[i] === q.correctIndex ? 1 : 0);
    }
    // fill
    const userAnswer = String(answers[i]).trim().toLowerCase();
    return sum + ((q.acceptedAnswers ?? []).some((a) => a.toLowerCase() === userAnswer) ? 1 : 0);
  }, 0);

  const total = checkpoint.questions.length;
  const score = Math.round((correctCount / total) * 100);
  const passed = score >= 80;

  const handleMcqChange = useCallback((qIndex: number, optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = optionIndex;
      return next;
    });
  }, []);

  const handleFillChange = useCallback((qIndex: number, value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = value;
      return next;
    });
  }, []);

  const handleSubmit = () => {
    setSubmitted(true);
    // Only store if this is a new high score
    const setCheckpointScore = useProgressStore.getState().setCheckpointScore;
    const setLessonStatus = useProgressStore.getState().setLessonStatus;

    if (!existingScore || correctCount > existingScore.correct) {
      setCheckpointScore(checkpoint.id, correctCount, total);
    }

    if (passed) {
      // Mark all lessons in this section as complete
      lessons
        .filter((l) => l.section === checkpoint.sectionSlug)
        .forEach((l) => setLessonStatus(l.slug, "complete"));
    }
  };

  const handleRetake = () => {
    setAnswers(checkpoint.questions.map(() => -1));
    setSubmitted(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Section Checkpoint</h2>

      {checkpoint.questions.map((q, i) => (
        <QuestionCard
          key={i}
          question={q}
          index={i}
          answer={answers[i]}
          submitted={submitted}
          onMcqChange={handleMcqChange}
          onFillChange={handleFillChange}
        />
      ))}

      {!submitted ? (
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded bg-[var(--color-gopher-cyan)] text-white font-medium hover:bg-[var(--color-gopher-cyan-light)] transition-colors"
          >
            Submit Answers
          </button>
        </div>
      ) : (
        <div className="mt-6 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700">
          <p className="text-xl font-bold mb-2">
            Score: {correctCount}/{total} ({score}%)
          </p>
          {passed ? (
            <p className="text-green-600 dark:text-green-400 font-medium">
              Section complete! You scored ≥ 80%.
            </p>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              You need 80% to mark this section complete, but you can still continue to any lesson.
            </p>
          )}
          <div className="flex gap-3 mt-3">
            <button
              onClick={handleRetake}
              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Retake
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Skip — not now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface QuestionCardProps {
  question: Question;
  index: number;
  answer: number | string;
  submitted: boolean;
  onMcqChange: (qIndex: number, optionIndex: number) => void;
  onFillChange: (qIndex: number, value: string) => void;
}

function QuestionCard({
  question,
  index,
  answer,
  submitted,
  onMcqChange,
  onFillChange,
}: QuestionCardProps) {
  const isCorrect =
    submitted &&
    (question.type === "mcq"
      ? answer === question.correctIndex
      : question.acceptedAnswers?.some(
          (a) => a.toLowerCase() === String(answer).trim().toLowerCase(),
        ));

  return (
    <div
      className={`mb-6 p-4 rounded-lg border ${
        submitted
          ? isCorrect
            ? "border-green-400 dark:border-green-500 bg-green-50 dark:bg-green-950/20"
            : "border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-950/20"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      <p className="font-medium mb-3">
        {index + 1}. {question.prompt}
      </p>

      {question.type === "mcq" && question.options && (
        <ul className="space-y-2">
          {question.options.map((opt, oi) => (
            <li key={oi}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`q-${index}`}
                  checked={answer === oi}
                  onChange={() => onMcqChange(index, oi)}
                  disabled={submitted}
                  className="accent-[var(--color-gopher-cyan)]"
                />
                <span
                  className={
                    submitted && oi === question.correctIndex
                      ? "font-bold text-green-700 dark:text-green-400"
                      : ""
                  }
                >
                  {opt}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}

      {question.type === "fill" && (
        <input
          type="text"
          value={typeof answer === "string" ? answer : ""}
          onChange={(e) => onFillChange(index, e.target.value)}
          disabled={submitted}
          placeholder="Your answer…"
          className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:border-[var(--color-gopher-cyan)]"
        />
      )}

      {submitted && question.explanation && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 italic">
          {question.explanation}
        </p>
      )}
    </div>
  );
}