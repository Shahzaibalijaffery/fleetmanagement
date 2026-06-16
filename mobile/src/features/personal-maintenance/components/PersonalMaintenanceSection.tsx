import { useEffect, useState } from 'react';
import { View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AuthErrorBanner } from '@/features/auth/components/AuthErrorBanner';
import type { Car, PersonalMaintenanceChecklistItem } from '@/features/cars/types/cars.types';
import {
  getMaintenanceReminderPreferenceField,
  getMaintenanceReminderToggleLabel,
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from '@/features/notification-reminders';
import { parseOdometerInput } from '@/features/contracts/utils/parseOdometerInput';
import type { MainStackParamList } from '@/app/navigation/types';
import { AppText, Button, Card, Input } from '@/shared/components';
import { env } from '@/shared/config/env';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import { sanitizeIntegerInput } from '@/shared/utils/numericInput';
import { odometerUpdateFormSchema } from '@/shared/validation/field.schemas';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { useCompletePersonalMaintenanceItem } from '../hooks/useCompletePersonalMaintenanceItem';
import { useUpdatePersonalMaintenanceItem } from '../hooks/useUpdatePersonalMaintenanceItem';
import { useUpdatePersonalOdometer } from '../hooks/useUpdatePersonalOdometer';
import {
  CompleteMaintenanceModal,
  type CompleteMaintenanceValues,
} from './CompleteMaintenanceModal';
import {
  EditMaintenanceItemModal,
  type EditMaintenanceItemValues,
} from './EditMaintenanceItemModal';
import { PersonalMaintenanceChecklistCard } from './PersonalMaintenanceChecklistCard';
import { createStyles } from './PersonalMaintenanceSection.styles';

interface PersonalMaintenanceSectionProps {
  car: Car;
  navigation: NativeStackNavigationProp<MainStackParamList>;
}

export function PersonalMaintenanceSection({ car, navigation }: PersonalMaintenanceSectionProps) {
  const styles = useThemedStyles(createStyles);
  const currentKm = car.personalCurrentOdometerKm ?? 0;
  const [odometerInput, setOdometerInput] = useState(String(currentKm));
  const [odometerError, setOdometerError] = useState<string | undefined>();
  const [completingItem, setCompletingItem] = useState<PersonalMaintenanceChecklistItem | null>(
    null,
  );
  const [editingItem, setEditingItem] = useState<PersonalMaintenanceChecklistItem | null>(null);
  const updateOdometer = useUpdatePersonalOdometer(car.id);
  const completeItem = useCompletePersonalMaintenanceItem(car.id);
  const updateItem = useUpdatePersonalMaintenanceItem(car.id);
  const { data: notificationPreferences } = useNotificationPreferences();
  const updateNotificationPreferences = useUpdateNotificationPreferences();
  const checklist = car.personalMaintenanceChecklist ?? [];

  useEffect(() => {
    setOdometerInput(String(car.personalCurrentOdometerKm ?? 0));
  }, [car.personalCurrentOdometerKm]);

  const handleUpdateOdometer = () => {
    const result = odometerUpdateFormSchema.safeParse({ odometer: odometerInput });

    if (!result.success) {
      setOdometerError(result.error.issues[0]?.message ?? 'Enter a valid odometer reading');
      return;
    }

    setOdometerError(undefined);
    updateOdometer.mutate(parseOdometerInput(odometerInput, currentKm));
  };

  const handleConfirmComplete = (values: CompleteMaintenanceValues) => {
    if (!completingItem) {
      return;
    }

    completeItem.mutate(
      { itemId: completingItem.id, cost: values.cost, odometerKm: values.odometerKm },
      { onSuccess: () => setCompletingItem(null) },
    );
  };

  const handleSaveEdit = (values: EditMaintenanceItemValues) => {
    if (!editingItem) {
      return;
    }

    updateItem.mutate(
      {
        itemId: editingItem.id,
        payload: {
          scheduleType: values.scheduleType,
          frequency: values.frequency,
          mileageIntervalKm: values.mileageIntervalKm,
          lastCompletedAt: values.lastCompletedAt,
          lastCompletedOdometerKm: values.lastCompletedOdometerKm,
        },
      },
      { onSuccess: () => setEditingItem(null) },
    );
  };

  return (
    <Card padding="md" style={styles.section}>
      <View style={styles.sectionHeader}>
        <AppText variant="label" color="textSecondary" style={styles.sectionTitle}>
          Running costs & care
        </AppText>
        <AppText variant="caption" color="textSecondary">
          Oil change, wash, service — tracked on a cycle (not repair bills).
        </AppText>
        <Button
          title="Edit items"
          onPress={() => navigation.navigate('EditPersonalMaintenance', { carId: car.id })}
          size="sm"
          variant="outline"
          style={styles.editButton}
        />
      </View>

      <View style={styles.odometerRow}>
        <Input
          label="Odometer (km)"
          value={odometerInput}
          onChangeText={(value) => {
            setOdometerInput(sanitizeIntegerInput(value));
            if (odometerError) {
              setOdometerError(undefined);
            }
          }}
          keyboardType="number-pad"
          error={odometerError}
        />
        <Button
          title="Update"
          onPress={handleUpdateOdometer}
          loading={updateOdometer.isPending}
          size="sm"
          variant="outline"
        />
      </View>

      {updateOdometer.error ? (
        <AuthErrorBanner message={getErrorMessage(updateOdometer.error)} />
      ) : null}

      {checklist.length === 0 ? (
        <AppText variant="bodySmall" color="textSecondary">
          No maintenance items yet. Tap Edit items to add washing, oil change, etc.
        </AppText>
      ) : (
        checklist.map((item) => {
          const preferenceField = getMaintenanceReminderPreferenceField(item.title);
          const reminderEnabled =
            preferenceField && notificationPreferences
              ? notificationPreferences[preferenceField]
              : undefined;

          return (
            <PersonalMaintenanceChecklistCard
              key={item.id}
              item={item}
              isCompleting={completeItem.isPending && completingItem?.id === item.id}
              onEdit={() => setEditingItem(item)}
              onComplete={() => setCompletingItem(item)}
              reminderEnabled={
                env.PUSH_NOTIFICATIONS_ENABLED ? reminderEnabled : undefined
              }
              reminderLabel={
                preferenceField ? getMaintenanceReminderToggleLabel(preferenceField) : undefined
              }
              onReminderChange={
                preferenceField && env.PUSH_NOTIFICATIONS_ENABLED
                  ? (value) =>
                      updateNotificationPreferences.mutate({ [preferenceField]: value })
                  : undefined
              }
              isUpdatingReminder={updateNotificationPreferences.isPending}
            />
          );
        })
      )}

      <CompleteMaintenanceModal
        visible={completingItem != null}
        item={completingItem}
        odometerKm={currentKm}
        isSubmitting={completeItem.isPending}
        error={completeItem.error}
        onClose={() => setCompletingItem(null)}
        onConfirm={handleConfirmComplete}
      />

      <EditMaintenanceItemModal
        visible={editingItem != null}
        item={editingItem}
        odometerKm={currentKm}
        carCreatedAt={car.createdAt}
        isSubmitting={updateItem.isPending}
        error={updateItem.error}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveEdit}
      />
    </Card>
  );
}
