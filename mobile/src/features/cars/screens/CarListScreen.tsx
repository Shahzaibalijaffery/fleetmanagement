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
import type { Car, CarStatus } from '../types/cars.types';
import { createStyles } from './CarListScreen.styles';

type CarListScreenProps = NativeStackScreenProps<MainStackParamList, 'CarList'>;

function getScreenCopy(status?: CarStatus) {
  if (status === 'available') {
    return {
      title: 'Available cars',
      emptyTitle: 'No available cars',
      emptyMessage: 'Cars marked as available will appear here.',
    };
  }

  if (status === 'assigned') {
    return {
      title: 'Assigned cars',
      emptyTitle: 'No assigned cars',
      emptyMessage: 'Cars with an active driver assignment will appear here.',
    };
  }

  return {
    title: 'My Cars',
    emptyTitle: 'No cars yet',
    emptyMessage: 'Add your first car to start managing your fleet.',
  };
}

export function CarListScreen({ navigation, route }: CarListScreenProps) {
  const styles = useThemedStyles(createStyles);
  const status = route.params?.status;
  const screenCopy = getScreenCopy(status);
  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage, isRefetching } =
    useCars({ status });

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
        <ScreenHeader title={screenCopy.title} style={styles.header} />
        <CarListSkeleton />
      </ScreenContainer>
    );
  }

  if (isError) {
    return (
      <ScreenContainer>
        <AppStatusBar />
        <ScreenHeader title={screenCopy.title} style={styles.header} />
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
        <ScreenHeader title={screenCopy.title} style={styles.header} />
        <EmptyState
          title={screenCopy.emptyTitle}
          message={screenCopy.emptyMessage}
          actionLabel={status ? undefined : 'Add car'}
          onAction={status ? undefined : () => navigation.navigate('AddCar')}
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
        title={screenCopy.title}
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
