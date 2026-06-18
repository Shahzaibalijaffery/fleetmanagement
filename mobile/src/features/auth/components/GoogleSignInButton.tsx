import { View } from 'react-native';

import { Button } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';

import { useGoogleSignIn } from '../hooks/useGoogleSignIn';
import { isGoogleSignInAvailable } from '../services/google-auth.service';
import { navigateAfterAuth } from '../utils/navigateAfterAuth';
import { createStyles } from './GoogleSignInButton.styles';

interface GoogleSignInButtonProps {
  onNavigate: Parameters<typeof navigateAfterAuth>[0];
}

export function GoogleSignInButton({ onNavigate }: GoogleSignInButtonProps) {
  const styles = useThemedStyles(createStyles);
  const googleSignIn = useGoogleSignIn();

  if (!isGoogleSignInAvailable()) {
    return null;
  }

  const handlePress = () => {
    googleSignIn.mutate(undefined, {
      onSuccess: (data) => {
        navigateAfterAuth(onNavigate, data);
      },
    });
  };

  return (
    <View style={styles.container}>
      <Button
        title="Continue with Google"
        onPress={handlePress}
        loading={googleSignIn.isPending}
        variant="secondary"
        fullWidth
      />
    </View>
  );
}
