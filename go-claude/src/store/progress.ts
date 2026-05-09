import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LessonStatus = 'unstarted' | 'in-progress' | 'complete';

export type CheckpointScore = {
  correct: number;
  total: number;
  lastAttempt: string;
};

type ProgressState = {
  progress: Record<string, LessonStatus>;
  editorDrafts: Record<string, string>;
  checkpointScores: Record<string, CheckpointScore>;
  setLessonStatus: (slug: string, status: LessonStatus) => void;
  markSectionComplete: (slugs: string[]) => void;
  setEditorDraft: (slug: string, code: string) => void;
  recordCheckpointScore: (id: string, score: CheckpointScore) => void;
  resetAll: () => void;
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: {},
      editorDrafts: {},
      checkpointScores: {},
      setLessonStatus: (slug, status) =>
        set((s) => ({ progress: { ...s.progress, [slug]: status } })),
      markSectionComplete: (slugs) =>
        set((s) => {
          const next = { ...s.progress };
          for (const slug of slugs) next[slug] = 'complete';
          return { progress: next };
        }),
      setEditorDraft: (slug, code) =>
        set((s) => ({ editorDrafts: { ...s.editorDrafts, [slug]: code } })),
      recordCheckpointScore: (id, score) =>
        set((s) => {
          const existing = s.checkpointScores[id];
          // Persist the highest score (monotonic).
          if (existing && existing.correct / existing.total >= score.correct / score.total) {
            return {
              checkpointScores: {
                ...s.checkpointScores,
                [id]: { ...existing, lastAttempt: score.lastAttempt },
              },
            };
          }
          return { checkpointScores: { ...s.checkpointScores, [id]: score } };
        }),
      resetAll: () => {
        set({ progress: {}, editorDrafts: {}, checkpointScores: {} });
        // Bump persist trigger
        get();
      },
    }),
    { name: 'gotour:v1' }
  )
);

export function useLessonStatus(slug: string): LessonStatus {
  return useProgressStore((s) => s.progress[slug] ?? 'unstarted');
}

export function useEditorDraft(slug: string): string | undefined {
  return useProgressStore((s) => s.editorDrafts[slug]);
}

export function useCheckpointScore(id: string): CheckpointScore | undefined {
  return useProgressStore((s) => s.checkpointScores[id]);
}
