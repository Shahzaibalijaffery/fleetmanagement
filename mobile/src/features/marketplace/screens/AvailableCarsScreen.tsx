import { useCallback, useMemo, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthErrorBanner } from '@/features/auth/components/AuthErrorBanner';
import { useMyActiveAssignment } from '@/features/assignments/hooks/useMyActiveAssignment';
import { useCreateRequest } from '@/features/requests/hooks/useCreateRequest';
import {
  AppStatusBar,
  AppText,
  EmptyState,
  ErrorState,
  ScreenContainer,
  ScreenHeader,
} from '@/shared/components';
import { useUserLocation } from '@/shared/hooks/useUserLocation';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';
import type { MainStackParamList } from '@/app/navigation/types';

import { MarketplaceCarCard } from '../components/MarketplaceCarCard';
import { MarketplaceFilters } from '../components/MarketplaceFilters';
import { MarketplaceListSkeleton } from '../components/MarketplaceListSkeleton';
import { useMarketplaceCars } from '../hooks/useMarketplaceCars';
import { useMarketplaceFilters } from '../hooks/useMarketplaceFilters';
import type { MarketplaceCar } from '../types/marketplace.types';
import { createStyles } from './AvailableCarsScreen.styles';

type AvailableCarsScreenProps = NativeStackScreenProps<MainStackParamList, 'AvailableCars'>;

export function AvailableCarsScreen(_props: AvailableCarsScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { coords, status: locationStatus, referenceCity, refreshLocation } = useUserLocation();
  const {
    radiusKm,
    setRadiusKm,
    carType,
    setCarType,
    filters,
    hasActiveFilters,
    clearFilters,
    isReady,
  } = useMarketplaceFilters({ coords, referenceCity });

  const { data: activeAssignment } = useMyActiveAssignment();
  const createRequest = useCreateRequest();
  const isDriverBusy = Boolean(activeAssignment);
  const [requestingCarId, setRequestingCarId] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | undefined>();

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage, isRefetching } =
    useMarketplaceCars(filters);

  const cars = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const handleRequestCar = useCallback(
    (carId: string) => {
      setRequestError(undefined);
      setRequestingCarId(carId);
      createRequest.mutate(
        { carId },
        {
          onError: (error) => setRequestError(getErrorMessage(error)),
          onSettled: () => setRequestingCarId(null),
        },
      );
    },
    [createRequest],
  );

  const renderItem = useCallback(
    ({ item }: { item: MarketplaceCar }) => (
      <MarketplaceCarCard
        car={item}
        onRequest={isDriverBusy ? undefined : handleRequestCar}
        isRequesting={createRequest.isPending && requestingCarId === item.id}
      />
    ),
    [handleRequestCar, createRequest.isPending, requestingCarId, isDriverBusy],
  );

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const locationMessage =
    radiusKm === 0 && !referenceCity
      ? 'Set your city in Profile to see cars in your area.'
      : radiusKm > 0 && locationStatus === 'error'
        ? 'Enable location or set your city in Profile to search by distance.'
        : undefined;

  const listEmptyComponent = (
    <EmptyState
      title="No available cars"
      message={
        hasActiveFilters
          ? 'No cars match your filters. Try a wider distance or different car type.'
          : radiusKm === 0
            ? `No available cars in ${referenceCity ?? 'your city'} right now.`
            : `No available cars within ${radiusKm} km right now.`
      }
      actionLabel={hasActiveFilters ? 'Clear filters' : undefined}
      onAction={hasActiveFilters ? clearFilters : undefined}
    />
  );

  const showLoading = !isReady || isLoading;

  return (
    <ScreenContainer style={styles.container} contentContainerStyle={styles.screenContent}>
      <AppStatusBar />
      <View style={styles.header}>
        <ScreenHeader title="Available Cars" style={{ marginBottom: 0 }} />
        <MarketplaceFilters
          radiusKm={radiusKm}
          onRadiusKmChange={setRadiusKm}
          carType={carType}
          onCarTypeChange={setCarType}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
        {locationMessage ? (
          <AppText variant="caption" color="textSecondary">
            {locationMessage}
          </AppText>
        ) : null}
        {requestError ? <AuthErrorBanner message={requestError} /> : null}
        {isDriverBusy ? (
          <AppText variant="caption" color="textSecondary">
            You are assigned to a car and cannot send new requests.
          </AppText>
        ) : null}
      </View>

      {showLoading ? (
        <View style={styles.listArea}>
          <MarketplaceListSkeleton />
        </View>
      ) : null}

      {!showLoading && isError ? (
        <View style={styles.listArea}>
          <ErrorState
            message="Couldn't load available cars. Check your connection."
            onRetry={() => {
              refreshLocation();
              refetch();
            }}
          />
        </View>
      ) : null}

      {!showLoading && !isError ? (
        <FlashList
          data={cars}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.listContainer}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => {
                refreshLocation();
                refetch();
              }}
            />
          }
          ListEmptyComponent={listEmptyComponent}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.footer}>
                <MarketplaceListSkeleton count={2} />
              </View>
            ) : null
          }
        />
      ) : null}
    </ScreenContainer>
  );
}
