import type { ColorTokens } from './colors';
import { radius } from './radius';
import { spacing } from './spacing';
import type { Theme } from './theme.types';
import { typography } from './typography';

const colors: ColorTokens = {
  primary: '#60A5FA',
  onPrimary: '#0B1220',
  primaryMuted: '#1E3A5F',
  accent: '#2DD4BF',
  accentMuted: '#134E4A',
  surfaceTint: '#1A2744',
  background: '#0B1220',
  surface: '#151F32',
  surfaceElevated: '#1E2A40',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  textInverse: '#0B1220',
  border: '#2A3A52',
  borderFocused: '#60A5FA',
  error: '#F87171',
  onError: '#0B1220',
  errorMuted: '#450A0A',
  success: '#34D399',
  onSuccess: '#0B1220',
  successMuted: '#064E3B',
  warning: '#FBBF24',
  onWarning: '#0B1220',
  warningMuted: '#451A03',
  overlay: 'rgba(0, 0, 0, 0.6)',
  shadow: '#000000',
  skeleton: '#2A3A52',
  skeletonHighlight: '#334155',
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors,
  spacing,
  typography,
  radius,
  shadows: {
    card: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 2,
    },
    modal: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 24,
      elevation: 8,
    },
  },
};
