import { Badge } from '@/shared/components';
import type { BadgeVariant } from '@/shared/components/Badge/Badge.types';

import { REQUEST_STATUS_LABELS, type RequestStatus } from '../types/requests.types';

interface RequestStatusBadgeProps {
  status: RequestStatus;
}

const STATUS_VARIANTS: Record<RequestStatus, BadgeVariant> = {
  pending: 'warning',
  accepted: 'success',
  rejected: 'error',
};

export function RequestStatusBadge({ status }: RequestStatusBadgeProps) {
  return (
    <Badge
      label={REQUEST_STATUS_LABELS[status]}
      variant={STATUS_VARIANTS[status]}
      size="sm"
    />
  );
}
