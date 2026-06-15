import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { QuickActions } from '@/features/dashboard/components/QuickActions';
import {
  getDriverQuickActionSections,
  getOwnerQuickActionSections,
} from '@/features/dashboard/config/quickActionSections';
import { DriverDashboardView } from '@/features/dashboard/components/DriverDashboardView';
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton';
import { OwnerDashboardView } from '@/features/dashboard/components/OwnerDashboardView';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { isOwnerDashboard } from '@/features/dashboard/types/dashboard.types';
import { useSignOut } from '@/features/auth/hooks/useSignOut';
import { AppStatusBar, AppText, Badge, Button, ErrorState, ScreenContainer } from '@/shared/components';
import { env } from '@/shared/config/env';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';
import type { CarStatus } from '@/features/cars/types/cars.types';
import type { MainStackParamList } from '@/app/navigation/types';
import { useAuthStore } from '@/stores/auth.store';

import { createStyles } from './HomeScreen.styles';

type HomeScreenProps = NativeStackScreenProps<MainStackParamList, 'Home'>;

export function HomeScreen({ navigation }: HomeScreenProps) {
  const styles = useThemedStyles(createStyles);
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, isError, refetch } = useDashboard();
  const { signOut, isSigningOut } = useSignOut();

  const isDriver = user?.role === 'driver';
  const isBusy = isDriver && data && !isOwnerDashboard(data) && Boolean(data.assignedCar);

  const handleCarStatPress = useCallback(
    (status?: CarStatus) => {
      navigation.navigate('CarList', status ? { status } : {});
    },
    [navigation],
  );

  const quickActionSections = useMemo(() => {
    if (user?.role === 'owner') {
      return getOwnerQuickActionSections(navigation);
    }

    if (user?.role === 'driver') {
      return getDriverQuickActionSections(navigation);
    }

    return [];
  }, [navigation, user?.role]);

  return (
    <ScreenContainer scrollable>
      <AppStatusBar />
      <View style={styles.hero}>
        <View style={styles.topRow}>
          <View style={styles.titleRow}>
            <AppText variant="heading2" color="primary">
              Dashboard
            </AppText>
            {env.IS_LIVE || __DEV__ ? (
              <Badge
                label={env.IS_LIVE ? 'LIVE API' : 'LOCAL API'}
                variant={env.IS_LIVE ? 'warning' : 'neutral'}
                size="sm"
              />
            ) : null}
          </View>
          <Button
            title="Sign out"
            onPress={signOut}
            variant="ghost"
            size="sm"
            loading={isSigningOut}
          />
        </View>

        <View style={styles.welcomeRow}>
          <View style={styles.welcomeText}>
            <AppText variant="bodySmall" color="textSecondary">
              Welcome back, {user?.name ?? 'User'}
            </AppText>
          </View>
          {user ? (
            <Badge
              label={user.role === 'owner' ? 'Fleet Owner' : isBusy ? 'Busy' : 'Available'}
              variant={user.role === 'owner' ? 'primary' : isBusy ? 'warning' : 'success'}
              size="sm"
            />
          ) : null}
        </View>
      </View>

      {isLoading ? <DashboardSkeleton /> : null}

      {!isLoading && isError ? (
        <ErrorState
          message="Couldn't load dashboard. Check your connection."
          onRetry={() => refetch()}
        />
      ) : null}

      {!isLoading && !isError && data && user?.role === 'owner' && isOwnerDashboard(data) ? (
        <OwnerDashboardView data={data} onCarStatPress={handleCarStatPress} />
      ) : null}

      {!isLoading && !isError && data && user?.role === 'driver' && !isOwnerDashboard(data) ? (
        <DriverDashboardView
          data={data}
          onViewContract={
            data.currentContract
              ? (contractId) => navigation.navigate('ContractDetail', { contractId })
              : undefined
          }
        />
      ) : null}

      <QuickActions sections={quickActionSections} />
    </ScreenContainer>
  );
}
