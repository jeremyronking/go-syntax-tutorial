import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LessonStatus = 'unstarted' | 'in-progress' | 'complete';

export type CheckpointScore = {
  correct: number;
  total: number;
  /** ISO 8601 timestamp of the most recent attempt. */
  lastAttempt: string;
};

export type ProgressState = {
  progress: Record<string, LessonStatus>;
  editorDrafts: Record<string, string>;
  checkpointScores: Record<string, CheckpointScore>;
  setLessonStatus: (slug: string, status: LessonStatus) => void;
  markComplete: (slugs: string[]) => void;
  setEditorDraft: (slug: string, code: string) => void;
  recordCheckpointScore: (id: string, score: CheckpointScore) => void;
  resetAll: () => void;
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      progress: {},
      editorDrafts: {},
      checkpointScores: {},

      setLessonStatus: (slug, status) =>
        set((s) => {
          if (s.progress[slug] === status) return s;
          return { progress: { ...s.progress, [slug]: status } };
        }),

      markComplete: (slugs) =>
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
          // The persisted score is monotonic: a retake can improve it, never lower it.
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

      resetAll: () =>
        set({ progress: {}, editorDrafts: {}, checkpointScores: {} }),
    }),
    {
      name: 'gotour:v1',
      // Hydrate synchronously so the first paint already has the right state
      // and nothing flashes the wrong value.
      skipHydration: false,
    }
  )
);

/** Clears the whole `gotour:v1` namespace, including the persisted copy. */
export function resetProgressNamespace(): void {
  useProgressStore.getState().resetAll();
  try {
    window.localStorage.removeItem('gotour:v1');
  } catch {
    // Storage unavailable — the in-memory reset above still applies.
  }
}

export function useLessonStatus(slug: string): LessonStatus {
  return useProgressStore((s) => s.progress[slug] ?? 'unstarted');
}

export function useEditorDraft(slug: string): string | undefined {
  return useProgressStore((s) => s.editorDrafts[slug]);
}

export function useCheckpointScore(id: string): CheckpointScore | undefined {
  return useProgressStore((s) => s.checkpointScores[id]);
}
