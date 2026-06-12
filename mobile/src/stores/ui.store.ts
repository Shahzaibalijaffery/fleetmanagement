import { create } from 'zustand';

import { getString, setString, STORAGE_KEYS } from '@/shared/storage/mmkv';

export type ThemeMode = 'light' | 'dark' | 'system';

interface UiState {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

function getInitialThemeMode(): ThemeMode {
  const saved = getString(STORAGE_KEYS.THEME_MODE);
  if (saved === 'light' || saved === 'dark' || saved === 'system') {
    return saved;
  }
  return 'system';
}

export const useUiStore = create<UiState>((set) => ({
  themeMode: getInitialThemeMode(),
  setThemeMode: (mode) => {
    setString(STORAGE_KEYS.THEME_MODE, mode);
    set({ themeMode: mode });
  },
}));
