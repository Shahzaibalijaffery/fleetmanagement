import { View } from 'react-native';

import { AppText } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { createStyles } from './AuthSuccessBanner.styles';

interface AuthSuccessBannerProps {
  message: string;
}

export function AuthSuccessBanner({ message }: AuthSuccessBannerProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.banner} accessibilityRole="text">
      <AppText variant="bodySmall" color="success">
        {message}
      </AppText>
    </View>
  );
}
