import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  Profile: undefined;
  CarList: undefined;
  CarDetail: { carId: string };
  AddCar: undefined;
  EditCar: { carId: string };
  AddCarExpense: { carId: string };
  CarExpenseDetail: { carId: string; logId: string };
  EditPersonalMaintenance: { carId: string };
  AvailableCars: undefined;
  AvailableDrivers: undefined;
  Requests: undefined;
  Assignments: undefined;
  Contracts: undefined;
  ContractDetail: { contractId: string };
  CreateContract: { assignmentId: string };
  EditContract: { contractId: string };
};

export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};
