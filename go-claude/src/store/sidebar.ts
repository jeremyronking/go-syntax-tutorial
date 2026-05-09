import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SidebarState = {
  collapsed: Record<string, boolean>;
  toggle: (sectionId: string) => void;
};

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: {},
      toggle: (sectionId) =>
        set((s) => ({
          collapsed: { ...s.collapsed, [sectionId]: !s.collapsed[sectionId] },
        })),
    }),
    { name: 'gotour:v1:sidebar' }
  )
);
