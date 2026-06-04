import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SidebarState {
  collapsed: Record<string, boolean>;
  toggle: (section: string) => void;
  set: (section: string, collapsed: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: {},
      toggle: (section) =>
        set((s) => ({ collapsed: { ...s.collapsed, [section]: !s.collapsed[section] } })),
      set: (section, collapsed) =>
        set((s) => ({ collapsed: { ...s.collapsed, [section]: collapsed } })),
    }),
    {
      name: 'gotour:v1:sidebar',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
