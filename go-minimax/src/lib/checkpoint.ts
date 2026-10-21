import type { Question } from '../content/types';

/** A checkpoint passes at 80% and marks the section complete. It never gates. */
export const PASS_THRESHOLD = 0.8;

export type Answer = string | number | undefined;

export function isCorrect(question: Question, answer: Answer): boolean {
  if (answer === undefined) return false;
  if (question.kind === 'mcq') {
    return answer === question.correctIndex;
  }
  if (question.kind === 'fill' && typeof answer === 'string') {
    const normalised = answer.trim().toLowerCase();
    return question.acceptedAnswers.some((a) => a.trim().toLowerCase() === normalised);
  }
  return false;
}

export function scoreQuestions(
  questions: Question[],
  answers: Record<number, Answer>
): number {
  return questions.reduce((acc, q, i) => (isCorrect(q, answers[i]) ? acc + 1 : acc), 0);
}

export function passed(correct: number, total: number): boolean {
  return total > 0 && correct / total >= PASS_THRESHOLD;
}
