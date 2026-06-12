import { View } from 'react-native';

import { AppText } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { createStyles } from './AuthErrorBanner.styles';

interface AuthErrorBannerProps {
  message: string;
}

export function AuthErrorBanner({ message }: AuthErrorBannerProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.banner} accessibilityRole="alert">
      <AppText variant="bodySmall" color="error">
        {message}
      </AppText>
    </View>
  );
}
