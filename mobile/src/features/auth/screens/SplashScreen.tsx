import { useEffect } from 'react';
import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppStatusBar, AppText, LoadingSkeleton } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';
import type { RootStackParamList } from '@/app/navigation/types';
import { useAuthStore } from '@/stores/auth.store';

import { useAuthBootstrap } from '../hooks/useAuthBootstrap';
import { createStyles } from './SplashScreen.styles';

type SplashScreenProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: SplashScreenProps) {
  const styles = useThemedStyles(createStyles);
  const setBootstrapped = useAuthStore((state) => state.setBootstrapped);
  const bootstrap = useAuthBootstrap();

  useEffect(() => {
    bootstrap.mutate(undefined, {
      onSettled: () => {
        setBootstrapped(true);
        const isAuthenticated = useAuthStore.getState().isAuthenticated;

        if (isAuthenticated) {
          navigation.replace('Main', { screen: 'Home' });
        } else {
          navigation.replace('Auth', { screen: 'Login' });
        }
      },
    });
  }, []);

  return (
    <View style={styles.container}>
      <AppStatusBar />
      <AppText variant="heading1">FleetLink</AppText>
      <AppText variant="bodySmall" color="textSecondary" style={styles.tagline}>
        Fleet management, simplified
      </AppText>
      <View style={styles.skeleton}>
        <LoadingSkeleton width="60%" height={20} borderRadius={8} />
        <LoadingSkeleton width="80%" height={14} borderRadius={6} />
      </View>
    </View>
  );
}
