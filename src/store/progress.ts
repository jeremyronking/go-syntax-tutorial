import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type LessonStatus = 'unstarted' | 'in-progress' | 'complete';

export interface CheckpointScore {
  correct: number;
  total: number;
  lastAttempt: string; // ISO
}

interface ProgressState {
  progress: Record<string, LessonStatus>;
  editorDrafts: Record<string, string>;
  checkpointScores: Record<string, CheckpointScore>;
  markInProgress: (slug: string) => void;
  markComplete: (slug: string) => void;
  setDraft: (slug: string, value: string) => void;
  recordCheckpoint: (id: string, correct: number, total: number) => void;
  markSectionComplete: (sectionSlugs: string[]) => void;
  resetAll: () => void;
}

const STORAGE_KEY = 'gotour:v1';

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      progress: {},
      editorDrafts: {},
      checkpointScores: {},
      markInProgress: (slug) =>
        set((s) => {
          if (s.progress[slug] === 'in-progress' || s.progress[slug] === 'complete') return s;
          return { progress: { ...s.progress, [slug]: 'in-progress' } };
        }),
      markComplete: (slug) =>
        set((s) => ({ progress: { ...s.progress, [slug]: 'complete' } })),
      setDraft: (slug, value) =>
        set((s) => ({ editorDrafts: { ...s.editorDrafts, [slug]: value } })),
      recordCheckpoint: (id, correct, total) =>
        set((s) => {
          const prev = s.checkpointScores[id];
          const next: CheckpointScore = {
            correct: Math.max(prev?.correct ?? 0, correct),
            total: Math.max(prev?.total ?? 0, total),
            lastAttempt: new Date().toISOString(),
          };
          return { checkpointScores: { ...s.checkpointScores, [id]: next } };
        }),
      markSectionComplete: (sectionSlugs) =>
        set((s) => {
          const next = { ...s.progress };
          for (const slug of sectionSlugs) next[slug] = 'complete';
          return { progress: next };
        }),
      resetAll: () =>
        set(() => ({
          progress: {},
          editorDrafts: {},
          checkpointScores: {},
        })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({
        progress: state.progress,
        editorDrafts: state.editorDrafts,
        checkpointScores: state.checkpointScores,
      }),
    },
  ),
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
