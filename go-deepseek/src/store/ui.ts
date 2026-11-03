import { create } from 'zustand';

type UIState = {
  paletteOpen: boolean;
  openPalette: () => void;
  closePalette: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  paletteOpen: false,
  openPalette: () => set({ paletteOpen: true }),
  closePalette: () => set({ paletteOpen: false }),
}));
