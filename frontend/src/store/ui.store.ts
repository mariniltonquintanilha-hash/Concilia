import { create } from 'zustand';

interface UiState {
  isLoading: boolean;
  isSidebarOpen: boolean;
  theme: 'light' | 'dark';
  setLoading: (loading: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUiStore = create<UiState>((set) => ({
  isLoading: false,
  isSidebarOpen: true,
  theme: 'light', // Default theme
  setLoading: (loading) => set({ isLoading: loading }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setTheme: (theme) => set({ theme: theme }),
}));
