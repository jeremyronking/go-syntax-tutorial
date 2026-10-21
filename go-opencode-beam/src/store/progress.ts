import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProgressStatus, CheckpointScore } from '../lib/storage';

type State = {
  progress: Record<string, ProgressStatus>;
  editorDrafts: Record<string, string>;
  checkpointScores: Record<string, CheckpointScore>;
  setStatus: (slug: string, status: ProgressStatus) => void;
  setDraft: (slug: string, code: string) => void;
  setScore: (id: string, score: CheckpointScore) => void;
  reset: () => void;
};

export const useProgressStore = create<State>()(
  persist(
    (set) => ({
      progress: {},
      editorDrafts: {},
      checkpointScores: {},
      setStatus: (slug, status) =>
        set((s) => ({ progress: { ...s.progress, [slug]: status } })),
      setDraft: (slug, code) =>
        set((s) => ({ editorDrafts: { ...s.editorDrafts, [slug]: code } })),
      setScore: (id, score) =>
        set((s) => ({ checkpointScores: { ...s.checkpointScores, [id]: score } })),
      reset: () => set({ progress: {}, editorDrafts: {}, checkpointScores: {} }),
    }),
    { name: 'gotour:v1' }
  )
);

export const useLessonStatus = (slug: string): ProgressStatus =>
  useProgressStore((s) => s.progress[slug] ?? 'unstarted');

export const useEditorDraft = (slug: string): string | undefined =>
  useProgressStore((s) => s.editorDrafts[slug]);

export const useCheckpointScore = (id: string): CheckpointScore | undefined =>
  useProgressStore((s) => s.checkpointScores[id]);
