import { create } from 'zustand';

interface AppState {
  filenames: string[];
  setFilenames: (files: string[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  filenames: [],
  setFilenames: (files) => set({ filenames: files }),
}));
