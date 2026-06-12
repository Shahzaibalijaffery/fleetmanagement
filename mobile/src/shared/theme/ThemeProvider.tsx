import { createContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { useUiStore } from '@/stores/ui.store';

import { darkTheme } from './darkTheme';
import { lightTheme } from './lightTheme';
import type { ThemeContextValue } from './theme.types';

export const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeMode = useUiStore((state) => state.themeMode);
  const setThemeMode = useUiStore((state) => state.setThemeMode);
  const systemScheme = useColorScheme();

  const value = useMemo<ThemeContextValue>(() => {
    const isDark =
      themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');
    const theme = isDark ? darkTheme : lightTheme;

    return { theme, isDark, themeMode, setThemeMode };
  }, [themeMode, systemScheme, setThemeMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
