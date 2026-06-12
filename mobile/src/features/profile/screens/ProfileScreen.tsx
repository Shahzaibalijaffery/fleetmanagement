import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useSignOut } from '@/features/auth/hooks/useSignOut';
import {
  AppStatusBar,
  AppText,
  Button,
  ErrorState,
  ScreenContainer,
  ScreenHeader,
} from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';
import type { MainStackParamList } from '@/app/navigation/types';

import { ProfileForm } from '../components/ProfileForm';
import { ProfileFormSkeleton } from '../components/ProfileFormSkeleton';
import { useProfile } from '../hooks/useProfile';
import { createStyles } from './ProfileScreen.styles';

type ProfileScreenProps = NativeStackScreenProps<MainStackParamList, 'Profile'>;

export function ProfileScreen(_props: ProfileScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { signOut, isSigningOut } = useSignOut();
  const { data, isLoading, isError, refetch, isFetching } = useProfile();

  if (isLoading) {
    return (
      <ScreenContainer scrollable>
        <AppStatusBar />
        <ScreenHeader title="My Profile" />
        <ProfileFormSkeleton />
      </ScreenContainer>
    );
  }

  if (isError || !data) {
    return (
      <ScreenContainer>
        <AppStatusBar />
        <ScreenHeader title="My Profile" />
        <ErrorState
          message="Couldn't load your profile. Check your connection."
          onRetry={() => refetch()}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      <AppStatusBar />
      <ScreenHeader title="My Profile" />
      {isFetching && !isLoading ? (
        <AppText variant="caption" color="textSecondary">
          Refreshing...
        </AppText>
      ) : null}
      <ProfileForm profile={data} />
      <Button
        title="Sign out"
        onPress={signOut}
        variant="outline"
        loading={isSigningOut}
        fullWidth
        style={styles.signOut}
      />
    </ScreenContainer>
  );
}
