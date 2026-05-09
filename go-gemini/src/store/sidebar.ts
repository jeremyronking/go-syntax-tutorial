import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SidebarState {
  collapsedSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      collapsedSections: {},
      toggleSection: (section) => set((state) => ({
        collapsedSections: {
          ...state.collapsedSections,
          [section]: !state.collapsedSections[section]
        }
      }))
    }),
    { name: 'gotour:v1:sidebar' }
  )
)
