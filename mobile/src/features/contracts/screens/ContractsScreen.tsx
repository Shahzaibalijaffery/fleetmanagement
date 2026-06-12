import { useCallback, useMemo } from 'react';
import { RefreshControl, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AppStatusBar,
  EmptyState,
  ErrorState,
  ScreenContainer,
  ScreenHeader,
} from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';
import type { MainStackParamList } from '@/app/navigation/types';

import { ContractCard } from '../components/ContractCard';
import { ContractListSkeleton } from '../components/ContractListSkeleton';
import { useContracts } from '../hooks/useContracts';
import type { Contract } from '../types/contracts.types';
import { createStyles } from './ContractsScreen.styles';

type ContractsScreenProps = NativeStackScreenProps<MainStackParamList, 'Contracts'>;

export function ContractsScreen({ navigation }: ContractsScreenProps) {
  const styles = useThemedStyles(createStyles);

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage, isRefetching } =
    useContracts();

  const contracts = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const handlePress = useCallback(
    (contractId: string) => navigation.navigate('ContractDetail', { contractId }),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Contract }) => <ContractCard contract={item} onPress={handlePress} />,
    [handlePress],
  );

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <ScreenContainer style={styles.container} contentContainerStyle={styles.screenContent}>
      <AppStatusBar />
      <ScreenHeader title="Contracts" style={styles.header} />

      {isLoading ? (
        <View style={styles.listArea}>
          <ContractListSkeleton />
        </View>
      ) : null}

      {!isLoading && isError ? (
        <View style={styles.listArea}>
          <ErrorState
            message="Couldn't load contracts. Check your connection."
            onRetry={() => refetch()}
          />
        </View>
      ) : null}

      {!isLoading && !isError ? (
        <View style={styles.listArea}>
          <FlashList
            data={contracts}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.listContainer}
            contentContainerStyle={[
              styles.list,
              contracts.length === 0 ? styles.listEmpty : null,
            ]}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
          }
          ListEmptyComponent={
            <EmptyState
              title="No contracts yet"
              message="Create a contract from an active assignment to define rent and responsibilities."
            />
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.footer}>
                <ContractListSkeleton count={2} />
              </View>
            ) : null
          }
          />
        </View>
      ) : null}
    </ScreenContainer>
  );
}
