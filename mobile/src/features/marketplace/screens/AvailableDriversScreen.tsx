import { useCallback, useMemo } from 'react';
import { RefreshControl, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AppStatusBar,
  AppText,
  EmptyState,
  ErrorState,
  ScreenContainer,
  ScreenHeader,
} from '@/shared/components';
import { useUserLocation } from '@/shared/hooks/useUserLocation';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';
import type { MainStackParamList } from '@/app/navigation/types';

import { MarketplaceDriverCard } from '../components/MarketplaceDriverCard';
import { MarketplaceFilters } from '../components/MarketplaceFilters';
import { MarketplaceListSkeleton } from '../components/MarketplaceListSkeleton';
import { useMarketplaceDrivers } from '../hooks/useMarketplaceDrivers';
import { useMarketplaceFilters } from '../hooks/useMarketplaceFilters';
import type { MarketplaceDriver } from '../types/marketplace.types';
import { createStyles } from './AvailableDriversScreen.styles';

type AvailableDriversScreenProps = NativeStackScreenProps<MainStackParamList, 'AvailableDrivers'>;

export function AvailableDriversScreen(_props: AvailableDriversScreenProps) {
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

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage, isRefetching } =
    useMarketplaceDrivers(filters);

  const drivers = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const renderItem = useCallback(
    ({ item }: { item: MarketplaceDriver }) => <MarketplaceDriverCard driver={item} />,
    [],
  );

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const locationMessage =
    radiusKm === 0 && !referenceCity
      ? 'Set your city in Profile to see drivers in your area.'
      : radiusKm > 0 && locationStatus === 'error'
        ? 'Enable location or set your city in Profile to search by distance.'
        : undefined;

  const listEmptyComponent = (
    <EmptyState
      title="No available drivers"
      message={
        hasActiveFilters
          ? 'No drivers match your filters. Try a wider distance or different car type.'
          : radiusKm === 0
            ? `No available drivers in ${referenceCity ?? 'your city'} right now.`
            : `No available drivers within ${radiusKm} km right now.`
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
        <ScreenHeader title="Available Drivers" style={{ marginBottom: 0 }} />
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
      </View>

      {showLoading ? (
        <View style={styles.listArea}>
          <MarketplaceListSkeleton />
        </View>
      ) : null}

      {!showLoading && isError ? (
        <View style={styles.listArea}>
          <ErrorState
            message="Couldn't load available drivers. Check your connection."
            onRetry={() => {
              refreshLocation();
              refetch();
            }}
          />
        </View>
      ) : null}

      {!showLoading && !isError ? (
        <FlashList
          data={drivers}
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
