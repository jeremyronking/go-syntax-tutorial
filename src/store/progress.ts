import { create } from "zustand";
import { persist } from "zustand/middleware";

type LessonStatus = "unstarted" | "in-progress" | "complete";

interface ProgressState {
  progress: Record<string, LessonStatus>;
  editorDrafts: Record<string, string>;
  checkpointScores: Record<string, { correct: number; total: number; lastAttempt: string }>;

  // Mutators
  setLessonStatus: (slug: string, status: LessonStatus) => void;
  setEditorDraft: (slug: string, code: string) => void;
  setCheckpointScore: (id: string, correct: number, total: number) => void;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      progress: {},
      editorDrafts: {},
      checkpointScores: {},

      setLessonStatus: (slug, status) =>
        set((state) => ({
          progress: { ...state.progress, [slug]: status },
        })),

      setEditorDraft: (slug, code) =>
        set((state) => ({
          editorDrafts: { ...state.editorDrafts, [slug]: code },
        })),

      setCheckpointScore: (id, correct, total) =>
        set((state) => ({
          checkpointScores: {
            ...state.checkpointScores,
            [id]: { correct, total, lastAttempt: new Date().toISOString() },
          },
        })),

      resetProgress: () =>
        set({ progress: {}, editorDrafts: {}, checkpointScores: {} }),
    }),
    {
      name: "gotour:v1",
    },
  ),
);

// Selector hooks
export function useLessonStatus(slug: string): LessonStatus {
  return useProgressStore((s) => s.progress[slug] ?? "unstarted");
}

export function useEditorDraft(slug: string): string | undefined {
  return useProgressStore((s) => s.editorDrafts[slug]);
}

export function useCheckpointScore(id: string) {
  return useProgressStore((s) => s.checkpointScores[id]);
}