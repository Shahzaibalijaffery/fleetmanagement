export const typography = {
  heading1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36 },
  heading2: { fontSize: 22, fontWeight: '600' as const, lineHeight: 28 },
  heading3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  label: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
} as const;

export type Typography = typeof typography;
