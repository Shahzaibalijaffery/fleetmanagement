export type BadgeVariant = 'primary' | 'accent' | 'success' | 'error' | 'warning' | 'neutral';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
}
