import type { ColorTokens } from './colors';
import { radius } from './radius';
import { spacing } from './spacing';
import type { Theme } from './theme.types';
import { typography } from './typography';

const colors: ColorTokens = {
  primary: '#1D4ED8',
  onPrimary: '#FFFFFF',
  primaryMuted: '#E0E7FF',
  accent: '#0F766E',
  accentMuted: '#CCFBF1',
  surfaceTint: '#EEF4FF',
  background: '#F4F7FB',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',
  border: '#D8E0EC',
  borderFocused: '#1D4ED8',
  error: '#DC2626',
  onError: '#FFFFFF',
  errorMuted: '#FEE2E2',
  success: '#059669',
  onSuccess: '#FFFFFF',
  successMuted: '#D1FAE5',
  warning: '#D97706',
  onWarning: '#FFFFFF',
  warningMuted: '#FEF3C7',
  overlay: 'rgba(15, 23, 42, 0.5)',
  shadow: '#1E3A5F',
  skeleton: '#E2E8F0',
  skeletonHighlight: '#F1F5F9',
};

export const lightTheme: Theme = {
  mode: 'light',
  colors,
  spacing,
  typography,
  radius,
  shadows: {
    card: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 2,
    },
    modal: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.14,
      shadowRadius: 24,
      elevation: 8,
    },
  },
};
