import { useContext } from 'react';

import { ThemeContext } from './ThemeProvider';
import type { Theme, ThemeContextValue } from './theme.types';

export type { Theme };

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}
