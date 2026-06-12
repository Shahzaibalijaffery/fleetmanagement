import type { LinkingOptions } from '@react-navigation/native';

import type { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['fleetlink://'],
  config: {
    screens: {
      Splash: 'splash',
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
        },
      },
      Main: {
        screens: {
          Home: 'home',
          Profile: 'profile',
          CarList: 'cars',
          CarDetail: 'cars/:carId',
          AddCar: 'cars/add',
          EditCar: 'cars/:carId/edit',
          AvailableCars: 'marketplace/cars',
          AvailableDrivers: 'marketplace/drivers',
          Requests: 'requests',
          Assignments: 'assignments',
          Contracts: 'contracts',
          ContractDetail: 'contracts/:contractId',
          CreateContract: 'contracts/create/:assignmentId',
          EditContract: 'contracts/:contractId/edit',
        },
      },
    },
  },
};
