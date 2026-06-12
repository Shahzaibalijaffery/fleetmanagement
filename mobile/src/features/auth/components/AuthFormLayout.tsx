import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { AppText, ScreenContainer } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { createStyles } from './AuthFormLayout.styles';

interface AuthFormLayoutProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthFormLayout({ title, subtitle, onBack, children, footer }: AuthFormLayoutProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      <View style={styles.header}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <AppText variant="body" color="primary">
              ← Back
            </AppText>
          </Pressable>
        ) : null}
        <AppText variant="heading1">{title}</AppText>
        {subtitle ? (
          <AppText variant="bodySmall" color="textSecondary" style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <View style={styles.form}>{children}</View>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </ScreenContainer>
  );
}
