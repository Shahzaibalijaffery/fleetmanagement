import { useCallback, useMemo, useState } from 'react';
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
import { useAuthStore } from '@/stores/auth.store';
import type { MainStackParamList } from '@/app/navigation/types';

import { AssignmentCard } from '../components/AssignmentCard';
import { AssignmentListSkeleton } from '../components/AssignmentListSkeleton';
import { AssignmentStatusFilter } from '../components/AssignmentStatusFilter';
import { useAssignments } from '../hooks/useAssignments';
import type { Assignment, AssignmentStatus } from '../types/assignments.types';
import { createStyles } from './AssignmentsScreen.styles';

type AssignmentsScreenProps = NativeStackScreenProps<MainStackParamList, 'Assignments'>;

export function AssignmentsScreen({ navigation }: AssignmentsScreenProps) {
  const styles = useThemedStyles(createStyles);
  const user = useAuthStore((state) => state.user);
  const isOwner = user?.role === 'owner';
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | undefined>();

  const filters = useMemo(() => ({ status: statusFilter }), [statusFilter]);

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage, isRefetching } =
    useAssignments(filters);

  const assignments = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const handleCreateContract = useCallback(
    (assignmentId: string) => navigation.navigate('CreateContract', { assignmentId }),
    [navigation],
  );

  const handleViewContract = useCallback(
    (contractId: string) => navigation.navigate('ContractDetail', { contractId }),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Assignment }) => (
      <AssignmentCard
        assignment={item}
        onCreateContract={isOwner ? handleCreateContract : undefined}
        onViewContract={handleViewContract}
      />
    ),
    [isOwner, handleCreateContract, handleViewContract],
  );

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const listEmptyComponent = (
    <EmptyState
      title="No assignments found"
      message={
        isOwner
          ? 'Accept a driver request to create an assignment, then add a contract here.'
          : 'When an owner accepts your car request, your assignment will appear here.'
      }
      actionLabel={isOwner ? 'View requests' : 'Browse cars'}
      onAction={() =>
        navigation.navigate(isOwner ? 'Requests' : 'AvailableCars')
      }
    />
  );

  return (
    <ScreenContainer style={styles.container} contentContainerStyle={styles.screenContent}>
      <AppStatusBar />
      <View style={styles.header}>
        <ScreenHeader
          title={isOwner ? 'Assignments' : 'My Assignment'}
          style={{ marginBottom: 0 }}
        />
        <AssignmentStatusFilter value={statusFilter} onChange={setStatusFilter} />
      </View>

      {isLoading ? (
        <View style={styles.listArea}>
          <AssignmentListSkeleton />
        </View>
      ) : null}

      {!isLoading && isError ? (
        <View style={styles.listArea}>
          <ErrorState
            message="Couldn't load assignments. Check your connection."
            onRetry={() => refetch()}
          />
        </View>
      ) : null}

      {!isLoading && !isError ? (
        <View style={styles.listArea}>
          <FlashList
            data={assignments}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.listContainer}
            contentContainerStyle={[
              styles.list,
              assignments.length === 0 ? styles.listEmpty : null,
            ]}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
            }
            ListEmptyComponent={listEmptyComponent}
            ListFooterComponent={
              isFetchingNextPage ? (
                <View style={styles.footer}>
                  <AssignmentListSkeleton count={2} />
                </View>
              ) : null
            }
          />
        </View>
      ) : null}
    </ScreenContainer>
  );
}
