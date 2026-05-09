import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type LessonStatus = "unstarted" | "in-progress" | "complete"

interface ProgressState {
  progress: Record<string, LessonStatus>
  editorDrafts: Record<string, string>
  checkpointScores: Record<string, { correct: number; total: number; lastAttempt: number }>
  
  markLessonStatus: (slug: string, status: LessonStatus) => void
  setEditorDraft: (slug: string, draft: string) => void
  setCheckpointScore: (id: string, correct: number, total: number) => void
  resetProgress: () => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      progress: {},
      editorDrafts: {},
      checkpointScores: {},

      markLessonStatus: (slug, status) => set((state) => ({
        progress: { ...state.progress, [slug]: status }
      })),
      
      setEditorDraft: (slug, draft) => set((state) => ({
        editorDrafts: { ...state.editorDrafts, [slug]: draft }
      })),

      setCheckpointScore: (id, correct, total) => set((state) => ({
        checkpointScores: { 
          ...state.checkpointScores, 
          [id]: { correct, total, lastAttempt: Date.now() } 
        }
      })),

      resetProgress: () => set({ progress: {}, editorDrafts: {}, checkpointScores: {} })
    }),
    {
      name: 'gotour:v1',
    }
  )
)
