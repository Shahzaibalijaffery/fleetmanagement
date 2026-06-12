import { Badge } from '@/shared/components';
import type { BadgeVariant } from '@/shared/components/Badge/Badge.types';

import type { CarStatus } from '../types/cars.types';

interface CarStatusBadgeProps {
  status: CarStatus;
}

const STATUS_LABELS: Record<CarStatus, string> = {
  available: 'Available',
  assigned: 'Assigned',
  inactive: 'Inactive',
  personal_use: 'Personal use',
};

const STATUS_VARIANTS: Record<CarStatus, BadgeVariant> = {
  available: 'success',
  assigned: 'primary',
  inactive: 'neutral',
  personal_use: 'warning',
};

export function CarStatusBadge({ status }: CarStatusBadgeProps) {
  return (
    <Badge
      label={STATUS_LABELS[status]}
      variant={STATUS_VARIANTS[status]}
      size="sm"
    />
  );
}
