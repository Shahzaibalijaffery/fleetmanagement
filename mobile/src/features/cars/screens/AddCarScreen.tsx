import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppStatusBar, ScreenContainer, ScreenHeader } from '@/shared/components';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import type { MainStackParamList } from '@/app/navigation/types';

import { CarForm } from '../components/CarForm';
import { useCreateCar } from '../hooks/useCreateCar';
import type { CarFormValues } from '../validation/car.schemas';

type AddCarScreenProps = NativeStackScreenProps<MainStackParamList, 'AddCar'>;

export function AddCarScreen({ navigation }: AddCarScreenProps) {
  const createCar = useCreateCar();

  const handleSubmit = (values: CarFormValues) => {
    createCar.mutate(
      {
        brand: values.brand,
        model: values.model,
        year: values.year,
        registrationNumber: values.registrationNumber,
        city: values.city,
        carType: values.carType,
        status: values.status ?? 'available',
      },
      {
        onSuccess: (car) => {
          navigation.replace('CarDetail', { carId: car.id });
        },
      },
    );
  };

  return (
    <ScreenContainer scrollable>
      <AppStatusBar />
      <ScreenHeader title="Add car" />
      <CarForm
        allowedStatuses={['available', 'personal_use', 'inactive']}
        submitLabel="Add car"
        isSubmitting={createCar.isPending}
        errorMessage={createCar.isError ? getErrorMessage(createCar.error) : undefined}
        onSubmit={handleSubmit}
      />
    </ScreenContainer>
  );
}
