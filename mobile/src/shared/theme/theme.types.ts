import type { ViewStyle } from 'react-native';

import type { ThemeMode as UiThemeMode } from '@/stores/ui.store';

import type { ColorTokens } from './colors';
import type { Radius } from './radius';
import type { Spacing } from './spacing';
import type { Typography } from './typography';

export type ResolvedThemeMode = 'light' | 'dark';
export type ThemePreference = UiThemeMode;

export type ShadowTokens = {
  card: ViewStyle;
  modal: ViewStyle;
};

export interface Theme {
  mode: ResolvedThemeMode;
  colors: ColorTokens;
  spacing: Spacing;
  typography: Typography;
  radius: Radius;
  shadows: ShadowTokens;
}

export interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  themeMode: ThemePreference;
  setThemeMode: (mode: ThemePreference) => void;
}
