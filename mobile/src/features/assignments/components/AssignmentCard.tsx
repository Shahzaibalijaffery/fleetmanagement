import { View } from 'react-native';

import { useContractByAssignment } from '@/features/contracts/hooks/useContractByAssignment';
import { AppText, Badge, Button, Card } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';
import { useAuthStore } from '@/stores/auth.store';

import type { Assignment } from '../types/assignments.types';
import { createStyles } from './AssignmentCard.styles';

interface AssignmentCardProps {
  assignment: Assignment;
  onCreateContract?: (assignmentId: string) => void;
  onViewContract?: (contractId: string) => void;
}

export function AssignmentCard({
  assignment,
  onCreateContract,
  onViewContract,
}: AssignmentCardProps) {
  const styles = useThemedStyles(createStyles);
  const user = useAuthStore((state) => state.user);
  const isOwner = user?.role === 'owner';
  const { data: contract } = useContractByAssignment(assignment.id);

  return (
    <Card padding="md">
      <View style={styles.header}>
        <AppText variant="heading3">
          {assignment.car.brand} {assignment.car.model}
        </AppText>
        <Badge
          label={assignment.status === 'active' ? 'Active' : 'Ended'}
          variant={assignment.status === 'active' ? 'success' : 'neutral'}
          size="sm"
        />
      </View>
      <AppText variant="bodySmall" color="textSecondary" style={styles.meta}>
        {assignment.car.year} · {assignment.car.city} · {assignment.car.registrationNumber}
      </AppText>
      {isOwner ? (
        <AppText variant="body">
          Driver: {assignment.driver.name}
          {assignment.driver.experience != null ? ` · ${assignment.driver.experience} yrs` : ''}
        </AppText>
      ) : (
        <AppText variant="body" style={styles.driverText}>
          You are assigned to this car
        </AppText>
      )}

      {contract && onViewContract ? (
        <Button
          title="View contract"
          onPress={() => onViewContract(contract.id)}
          size="sm"
          variant="outline"
          style={styles.action}
          fullWidth
        />
      ) : null}

      {isOwner && !contract && onCreateContract ? (
        <Button
          title="Create contract"
          onPress={() => onCreateContract(assignment.id)}
          size="sm"
          style={styles.action}
          fullWidth
        />
      ) : null}
    </Card>
  );
}
