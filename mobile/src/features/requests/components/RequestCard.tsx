import { View } from 'react-native';

import { AppText, Button, Card } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';
import { useAuthStore } from '@/stores/auth.store';

import type { CarRequest } from '../types/requests.types';
import { RequestStatusBadge } from './RequestStatusBadge';
import { createStyles } from './RequestCard.styles';

interface RequestCardProps {
  request: CarRequest;
  onAccept?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  isAccepting?: boolean;
  isRejecting?: boolean;
}

export function RequestCard({
  request,
  onAccept,
  onReject,
  isAccepting = false,
  isRejecting = false,
}: RequestCardProps) {
  const styles = useThemedStyles(createStyles);
  const user = useAuthStore((state) => state.user);
  const isOwner = user?.role === 'owner';
  const isPending = request.status === 'pending';

  return (
    <Card padding="md">
      <View style={styles.header}>
        <AppText variant="heading3">
          {request.car.brand} {request.car.model}
        </AppText>
        <RequestStatusBadge status={request.status} />
      </View>

      <AppText variant="bodySmall" color="textSecondary" style={styles.meta}>
        {request.car.year} · {request.car.city} · {request.car.carType}
      </AppText>

      {isOwner ? (
        <AppText variant="body" style={styles.driver}>
          Driver: {request.driver.name}
          {request.driver.experience != null ? ` · ${request.driver.experience} yrs` : ''}
        </AppText>
      ) : null}

      {isOwner && isPending && onAccept && onReject ? (
        <View style={styles.actions}>
          <Button
            title="Accept"
            onPress={() => onAccept(request.id)}
            loading={isAccepting}
            disabled={isRejecting}
            size="sm"
            style={styles.actionButton}
          />
          <Button
            title="Reject"
            onPress={() => onReject(request.id)}
            loading={isRejecting}
            disabled={isAccepting}
            variant="outline"
            size="sm"
            style={styles.actionButton}
          />
        </View>
      ) : null}
    </Card>
  );
}
