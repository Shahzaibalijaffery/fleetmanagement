import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { AppText } from '../AppText';
import { createStyles } from './ScreenHeader.styles';
import type { ScreenHeaderProps } from './ScreenHeader.types';

export function ScreenHeader({
  title,
  subtitle,
  right,
  onBack,
  showBack,
  style,
}: ScreenHeaderProps) {
  const navigation = useNavigation();
  const styles = useThemedStyles(createStyles);

  const canGoBack = navigation.canGoBack();
  const shouldShowBack = showBack ?? canGoBack;

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    if (canGoBack) {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.topRow}>
        {shouldShowBack ? (
          <Pressable
            onPress={handleBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <AppText variant="body" color="primary">
              ← Back
            </AppText>
          </Pressable>
        ) : null}

        <View style={styles.titleArea}>
          <AppText variant="heading2" numberOfLines={2}>
            {title}
          </AppText>
        </View>

        <View style={styles.rightArea}>{right ?? null}</View>
      </View>

      {subtitle ? (
        <AppText variant="bodySmall" color="textSecondary" style={styles.subtitle}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}
