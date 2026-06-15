import { Pressable, View } from 'react-native';

import type { PersonalMaintenanceChecklistItem } from '@/features/cars/types/cars.types';
import { MAINTENANCE_FREQUENCY_LABELS } from '@/features/contracts/types/contracts.types';
import { AppText, Badge, Button } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import {
  formatPersonalMaintenanceDueText,
  getPersonalMaintenanceStatusLabel,
  getPersonalMaintenanceStatusVariant,
} from '../utils/personalMaintenanceDisplay';
import { createStyles } from './PersonalMaintenanceChecklistCard.styles';

interface PersonalMaintenanceChecklistCardProps {
  item: PersonalMaintenanceChecklistItem;
  isCompleting: boolean;
  onEdit: () => void;
  onComplete: () => void;
}

export function PersonalMaintenanceChecklistCard({
  item,
  isCompleting,
  onEdit,
  onComplete,
}: PersonalMaintenanceChecklistCardProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.item}>
      <View style={styles.itemHeader}>
        <AppText variant="body" style={styles.itemTitle}>
          {item.title}
        </AppText>
        <Pressable
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${item.title}`}
          style={styles.editLink}
        >
          <AppText variant="caption" color="primary">
            Edit
          </AppText>
        </Pressable>
        <Badge
          label={getPersonalMaintenanceStatusLabel(item.status)}
          variant={getPersonalMaintenanceStatusVariant(item.status)}
          size="sm"
        />
      </View>
      <AppText variant="caption" color="textSecondary">
        {item.scheduleType === 'time' && item.frequency
          ? `Every ${MAINTENANCE_FREQUENCY_LABELS[item.frequency].toLowerCase()}`
          : `Every ${item.mileageIntervalKm?.toLocaleString() ?? '—'} km`}
      </AppText>
      <AppText variant="caption" color="textSecondary" style={styles.meta}>
        {formatPersonalMaintenanceDueText(item)}
      </AppText>
      {item.lastCompletedAt ? (
        <AppText variant="caption" color="textSecondary">
          Last done: {item.lastCompletedAt.slice(0, 10)}
          {item.lastCompletedOdometerKm != null
            ? ` at ${item.lastCompletedOdometerKm.toLocaleString()} km`
            : ''}
        </AppText>
      ) : null}
      <View style={styles.itemActions}>
        <Button title="Mark complete" onPress={onComplete} loading={isCompleting} size="sm" />
      </View>
    </View>
  );
}
