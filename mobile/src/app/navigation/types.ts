import type { NavigatorScreenParams } from '@react-navigation/native';

import type { CarStatus } from '@/features/cars/types/cars.types';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  Profile: undefined;
  CarList: { status?: CarStatus } | undefined;
  CarDetail: { carId: string };
  AddCar: undefined;
  EditCar: { carId: string };
  AddCarExpense: { carId: string };
  CarExpenseDetail: { carId: string; logId: string };
  AllExpenses: undefined;
  AddExpense: undefined;
  ExpenseDetail: { expenseId: string };
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
