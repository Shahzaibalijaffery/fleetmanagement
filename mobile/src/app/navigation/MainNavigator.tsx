import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '@/app/screens/HomeScreen';
import { AssignmentsScreen } from '@/features/assignments';
import { AddCarExpenseScreen, CarExpenseDetailScreen } from '@/features/car-expenses';
import { EditPersonalMaintenanceScreen } from '@/features/personal-maintenance';
import {
  AddCarScreen,
  CarDetailScreen,
  CarListScreen,
  EditCarScreen,
} from '@/features/cars';
import {
  ContractDetailScreen,
  ContractsScreen,
  CreateContractScreen,
  EditContractScreen,
} from '@/features/contracts';
import { AvailableCarsScreen, AvailableDriversScreen } from '@/features/marketplace';
import { ProfileScreen } from '@/features/profile';
import { RequestsScreen } from '@/features/requests';

import type { MainStackParamList } from './types';

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="CarList" component={CarListScreen} />
      <Stack.Screen name="CarDetail" component={CarDetailScreen} />
      <Stack.Screen name="AddCar" component={AddCarScreen} />
      <Stack.Screen name="EditCar" component={EditCarScreen} />
      <Stack.Screen name="AddCarExpense" component={AddCarExpenseScreen} />
      <Stack.Screen name="CarExpenseDetail" component={CarExpenseDetailScreen} />
      <Stack.Screen name="EditPersonalMaintenance" component={EditPersonalMaintenanceScreen} />
      <Stack.Screen name="AvailableCars" component={AvailableCarsScreen} />
      <Stack.Screen name="AvailableDrivers" component={AvailableDriversScreen} />
      <Stack.Screen name="Requests" component={RequestsScreen} />
      <Stack.Screen name="Assignments" component={AssignmentsScreen} />
      <Stack.Screen name="Contracts" component={ContractsScreen} />
      <Stack.Screen name="ContractDetail" component={ContractDetailScreen} />
      <Stack.Screen name="CreateContract" component={CreateContractScreen} />
      <Stack.Screen name="EditContract" component={EditContractScreen} />
    </Stack.Navigator>
  );
}
