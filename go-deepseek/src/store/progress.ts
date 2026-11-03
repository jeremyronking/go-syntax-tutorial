import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type LessonStatus = 'unstarted' | 'in-progress' | 'complete';

export type CheckpointScore = {
  correct: number;
  total: number;
  lastAttempt: string;
};

export const STORAGE_KEY = 'gotour:v1';

type ProgressState = {
  progress: Record<string, LessonStatus>;
  editorDrafts: Record<string, string>;
  checkpointScores: Record<string, CheckpointScore>;
  setStatus: (slug: string, status: LessonStatus) => void;
  markStarted: (slug: string) => void;
  markComplete: (slug: string) => void;
  clearComplete: (slug: string) => void;
  setDraft: (slug: string, source: string) => void;
  clearDraft: (slug: string) => void;
  recordCheckpoint: (id: string, correct: number, total: number) => void;
  resetProgress: () => void;
};

const emptyState = {
  progress: {},
  editorDrafts: {},
  checkpointScores: {},
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...emptyState,
      setStatus: (slug, status) =>
        set((state) => ({ progress: { ...state.progress, [slug]: status } })),

      markStarted: (slug) => {
        if ((get().progress[slug] ?? 'unstarted') !== 'unstarted') return;
        get().setStatus(slug, 'in-progress');
      },

      markComplete: (slug) => get().setStatus(slug, 'complete'),

      clearComplete: (slug) => {
        if (get().progress[slug] === 'complete') get().setStatus(slug, 'in-progress');
      },

      setDraft: (slug, source) =>
        set((state) => ({ editorDrafts: { ...state.editorDrafts, [slug]: source } })),

      clearDraft: (slug) =>
        set((state) => {
          const editorDrafts = { ...state.editorDrafts };
          delete editorDrafts[slug];
          return { editorDrafts };
        }),

      recordCheckpoint: (id, correct, total) =>
        set((state) => {
          const previous = state.checkpointScores[id];
          // The stored score is monotonic; retakes cannot lower it.
          const keepPrevious = previous && previous.correct / previous.total >= correct / total;
          return {
            checkpointScores: {
              ...state.checkpointScores,
              [id]: keepPrevious
                ? previous
                : { correct, total, lastAttempt: new Date().toISOString() },
            },
          };
        }),

      resetProgress: () => {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // Nothing to clear if storage is unavailable.
        }
        set(emptyState);
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        progress: state.progress,
        editorDrafts: state.editorDrafts,
        checkpointScores: state.checkpointScores,
      }),
    }
  )
);

export const useLessonStatus = (slug: string): LessonStatus =>
  useProgressStore((state) => state.progress[slug] ?? 'unstarted');

export const useEditorDraft = (slug: string): string | undefined =>
  useProgressStore((state) => state.editorDrafts[slug]);

export const useCheckpointScore = (id: string): CheckpointScore | undefined =>
  useProgressStore((state) => state.checkpointScores[id]);
