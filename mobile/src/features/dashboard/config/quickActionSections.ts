import type { MainStackParamList } from '@/app/navigation/types';

import type { QuickActionSection } from '../components/QuickActions';

type MainNavigation = {
  navigate: <RouteName extends keyof MainStackParamList>(
    ...args: undefined extends MainStackParamList[RouteName]
      ? [screen: RouteName] | [screen: RouteName, params: MainStackParamList[RouteName]]
      : [screen: RouteName, params: MainStackParamList[RouteName]]
  ) => void;
};

export function getOwnerQuickActionSections(navigation: MainNavigation): QuickActionSection[] {
  return [
    {
      id: 'fleet',
      title: 'Fleet',
      actions: [
        {
          id: 'cars',
          title: 'My cars',
          subtitle: 'View and manage your vehicles',
          onPress: () => navigation.navigate('CarList', {}),
        },
        {
          id: 'assignments',
          title: 'Assignments',
          subtitle: 'Active driver pairings',
          onPress: () => navigation.navigate('Assignments'),
        },
        {
          id: 'expenses',
          title: 'All expenses',
          subtitle: 'Track spending with optional car costs',
          onPress: () => navigation.navigate('AllExpenses'),
        },
        {
          id: 'contracts',
          title: 'Contracts',
          subtitle: 'Rent terms and agreements',
          onPress: () => navigation.navigate('Contracts'),
        },
      ],
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      actions: [
        {
          id: 'drivers',
          title: 'Browse drivers',
          subtitle: 'Find available drivers',
          onPress: () => navigation.navigate('AvailableDrivers'),
        },
        {
          id: 'requests',
          title: 'Car requests',
          subtitle: 'Review incoming requests',
          onPress: () => navigation.navigate('Requests'),
        },
      ],
    },
    {
      id: 'account',
      title: 'Account',
      actions: [
        {
          id: 'profile',
          title: 'Edit profile',
          subtitle: 'Update your account details',
          onPress: () => navigation.navigate('Profile'),
        },
      ],
    },
  ];
}

export function getDriverQuickActionSections(navigation: MainNavigation): QuickActionSection[] {
  return [
    {
      id: 'work',
      title: 'Work',
      actions: [
        {
          id: 'cars',
          title: 'Browse cars',
          subtitle: 'Find cars to drive',
          onPress: () => navigation.navigate('AvailableCars'),
        },
        {
          id: 'requests',
          title: 'My requests',
          subtitle: 'Track your car requests',
          onPress: () => navigation.navigate('Requests'),
        },
        {
          id: 'assignments',
          title: 'My assignment',
          subtitle: 'Your current assigned car',
          onPress: () => navigation.navigate('Assignments'),
        },
        {
          id: 'contracts',
          title: 'Contracts',
          subtitle: 'Rent terms and agreements',
          onPress: () => navigation.navigate('Contracts'),
        },
      ],
    },
    {
      id: 'account',
      title: 'Account',
      actions: [
        {
          id: 'profile',
          title: 'Edit profile',
          subtitle: 'Update your account details',
          onPress: () => navigation.navigate('Profile'),
        },
      ],
    },
  ];
}
