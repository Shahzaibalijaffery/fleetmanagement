import type { ColorTokens } from './colors';

export type AccentTone = 'primary' | 'accent' | 'success' | 'warning';

export function getAccentToneColor(colors: ColorTokens, tone: AccentTone): string {
  switch (tone) {
    case 'primary':
      return colors.primary;
    case 'accent':
      return colors.accent;
    case 'success':
      return colors.success;
    case 'warning':
      return colors.warning;
  }
}

export function getAccentToneMutedColor(colors: ColorTokens, tone: AccentTone): string {
  switch (tone) {
    case 'primary':
      return colors.primaryMuted;
    case 'accent':
      return colors.accentMuted;
    case 'success':
      return colors.successMuted;
    case 'warning':
      return colors.warningMuted;
  }
}
