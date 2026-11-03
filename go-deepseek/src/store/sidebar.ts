import { create } from 'zustand';

const STORAGE_KEY = 'gotour:v1:sidebar';

type CollapsedState = Record<string, boolean>;

function readCollapsed(): CollapsedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return {};
    const result: CollapsedState = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === 'boolean') result[key] = value;
    }
    return result;
  } catch {
    return {};
  }
}

type SidebarState = {
  collapsed: CollapsedState;
  toggle: (sectionId: string) => void;
};

export const useSidebarStore = create<SidebarState>((set, get) => ({
  collapsed: readCollapsed(),
  toggle: (sectionId) => {
    const collapsed = { ...get().collapsed, [sectionId]: !get().collapsed[sectionId] };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed));
    } catch {
      // Persistence is best-effort; collapsing still works in memory.
    }
    set({ collapsed });
  },
}));
