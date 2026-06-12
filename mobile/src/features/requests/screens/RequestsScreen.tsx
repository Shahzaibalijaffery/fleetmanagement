import { useCallback, useMemo, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthErrorBanner } from '@/features/auth/components/AuthErrorBanner';
import {
  AppStatusBar,
  EmptyState,
  ErrorState,
  ScreenContainer,
  ScreenHeader,
} from '@/shared/components';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';
import { useAuthStore } from '@/stores/auth.store';
import type { MainStackParamList } from '@/app/navigation/types';

import { RequestCard } from '../components/RequestCard';
import { RequestListSkeleton } from '../components/RequestListSkeleton';
import { RequestStatusFilter } from '../components/RequestStatusFilter';
import { useAcceptRequest } from '../hooks/useAcceptRequest';
import { useRejectRequest } from '../hooks/useRejectRequest';
import { useRequests } from '../hooks/useRequests';
import type { CarRequest, RequestStatus } from '../types/requests.types';
import { createStyles } from './RequestsScreen.styles';

type RequestsScreenProps = NativeStackScreenProps<MainStackParamList, 'Requests'>;

export function RequestsScreen(_props: RequestsScreenProps) {
  const styles = useThemedStyles(createStyles);
  const user = useAuthStore((state) => state.user);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | undefined>();
  const [actionError, setActionError] = useState<string | undefined>();
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);

  const filters = useMemo(() => ({ status: statusFilter }), [statusFilter]);

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage, isRefetching } =
    useRequests(filters);

  const acceptRequest = useAcceptRequest();
  const rejectRequest = useRejectRequest();

  const requests = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const isOwner = user?.role === 'owner';
  const screenTitle = isOwner ? 'Car Requests' : 'My Requests';

  const handleAccept = useCallback(
    (requestId: string) => {
      setActionError(undefined);
      setActiveRequestId(requestId);
      acceptRequest.mutate(requestId, {
        onError: (error) => setActionError(getErrorMessage(error)),
        onSettled: () => setActiveRequestId(null),
      });
    },
    [acceptRequest],
  );

  const handleReject = useCallback(
    (requestId: string) => {
      setActionError(undefined);
      setActiveRequestId(requestId);
      rejectRequest.mutate(requestId, {
        onError: (error) => setActionError(getErrorMessage(error)),
        onSettled: () => setActiveRequestId(null),
      });
    },
    [rejectRequest],
  );

  const renderItem = useCallback(
    ({ item }: { item: CarRequest }) => (
      <RequestCard
        request={item}
        onAccept={isOwner ? handleAccept : undefined}
        onReject={isOwner ? handleReject : undefined}
        isAccepting={acceptRequest.isPending && activeRequestId === item.id}
        isRejecting={rejectRequest.isPending && activeRequestId === item.id}
      />
    ),
    [
      isOwner,
      handleAccept,
      handleReject,
      acceptRequest.isPending,
      rejectRequest.isPending,
      activeRequestId,
    ],
  );

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const listEmptyComponent = (
    <EmptyState
      title={isOwner ? 'No requests yet' : 'No requests sent'}
      message={
        isOwner
          ? 'When drivers request your cars, they will appear here.'
          : 'Browse available cars and send a request to get started.'
      }
    />
  );

  return (
    <ScreenContainer style={styles.container} contentContainerStyle={styles.screenContent}>
      <AppStatusBar />
      <View style={styles.header}>
        <ScreenHeader title={screenTitle} style={{ marginBottom: 0 }} />
        <RequestStatusFilter value={statusFilter} onChange={setStatusFilter} />
        {actionError ? <AuthErrorBanner message={actionError} /> : null}
      </View>

      {isLoading ? (
        <View style={styles.listArea}>
          <RequestListSkeleton />
        </View>
      ) : null}

      {!isLoading && isError ? (
        <View style={styles.listArea}>
          <ErrorState
            message="Couldn't load requests. Check your connection."
            onRetry={() => refetch()}
          />
        </View>
      ) : null}

      {!isLoading && !isError ? (
        <View style={styles.listArea}>
          <FlashList
            data={requests}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.listContainer}
            contentContainerStyle={[
              styles.list,
              requests.length === 0 ? styles.listEmpty : null,
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
                <RequestListSkeleton count={2} />
              </View>
            ) : null
          }
          />
        </View>
      ) : null}
    </ScreenContainer>
  );
}
