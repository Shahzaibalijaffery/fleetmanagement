import { useCallback, useMemo } from 'react';
import { RefreshControl, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AppStatusBar,
  Button,
  EmptyState,
  ErrorState,
  ScreenContainer,
  ScreenHeader,
} from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';
import type { MainStackParamList } from '@/app/navigation/types';

import { CarCard } from '../components/CarCard';
import { CarListSkeleton } from '../components/CarListSkeleton';
import { useCars } from '../hooks/useCars';
import type { Car } from '../types/cars.types';
import { createStyles } from './CarListScreen.styles';

type CarListScreenProps = NativeStackScreenProps<MainStackParamList, 'CarList'>;

export function CarListScreen({ navigation }: CarListScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage, isRefetching } =
    useCars();

  const cars = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const handleCarPress = useCallback(
    (carId: string) => navigation.navigate('CarDetail', { carId }),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Car }) => <CarCard car={item} onPress={handleCarPress} />,
    [handleCarPress],
  );

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer>
        <AppStatusBar />
        <ScreenHeader title="My Cars" style={styles.header} />
        <CarListSkeleton />
      </ScreenContainer>
    );
  }

  if (isError) {
    return (
      <ScreenContainer>
        <AppStatusBar />
        <ScreenHeader title="My Cars" style={styles.header} />
        <ErrorState
          message="Couldn't load your cars. Check your connection."
          onRetry={() => refetch()}
        />
      </ScreenContainer>
    );
  }

  if (!cars.length) {
    return (
      <ScreenContainer>
        <AppStatusBar />
        <ScreenHeader title="My Cars" style={styles.header} />
        <EmptyState
          title="No cars yet"
          message="Add your first car to start managing your fleet."
          actionLabel="Add car"
          onAction={() => navigation.navigate('AddCar')}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      style={styles.container}
      contentContainerStyle={styles.screenContent}
    >
      <AppStatusBar />
      <ScreenHeader
        title="My Cars"
        style={styles.header}
        right={<Button title="Add car" onPress={() => navigation.navigate('AddCar')} size="sm" />}
      />
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
          <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footer}>
              <CarListSkeleton count={2} />
            </View>
          ) : null
        }
      />
    </ScreenContainer>
  );
}
