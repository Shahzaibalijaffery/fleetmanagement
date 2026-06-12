import { CommonActions, useNavigation } from '@react-navigation/native';

import { useLogout } from './useLogout';

export function useSignOut() {
  const navigation = useNavigation();
  const logout = useLogout();

  const signOut = () => {
    logout.mutate(undefined, {
      onSettled: () => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Auth', params: { screen: 'Login' } }],
          }),
        );
      },
    });
  };

  return { signOut, isSigningOut: logout.isPending };
}
