import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppStatusBar, ErrorState, ScreenContainer, ScreenHeader } from '@/shared/components';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import type { MainStackParamList } from '@/app/navigation/types';

import { CarDetailSkeleton } from '../components/CarDetailSkeleton';
import { CarForm } from '../components/CarForm';
import { useCar } from '../hooks/useCar';
import { useUpdateCar } from '../hooks/useUpdateCar';
import type { CarFormValues } from '../validation/car.schemas';

type EditCarScreenProps = NativeStackScreenProps<MainStackParamList, 'EditCar'>;

export function EditCarScreen({ navigation, route }: EditCarScreenProps) {
  const { carId } = route.params;
  const { data, isLoading, isError, refetch } = useCar(carId);
  const updateCar = useUpdateCar();

  const handleSubmit = (values: CarFormValues) => {
    updateCar.mutate(
      {
        carId,
        payload: {
          brand: values.brand,
          model: values.model,
          year: values.year,
          registrationNumber: values.registrationNumber,
          city: values.city,
          carType: values.carType,
          status: values.status,
        },
      },
      {
        onSuccess: () => {
          navigation.goBack();
        },
      },
    );
  };

  if (isLoading) {
    return (
      <ScreenContainer scrollable>
        <AppStatusBar />
        <ScreenHeader title="Edit car" />
        <CarDetailSkeleton />
      </ScreenContainer>
    );
  }

  if (isError || !data) {
    return (
      <ScreenContainer>
        <AppStatusBar />
        <ScreenHeader title="Edit car" />
        <ErrorState message="Couldn't load car." onRetry={() => refetch()} />
      </ScreenContainer>
    );
  }

  const allowedStatuses =
    data.status === 'assigned'
      ? (['assigned'] as const)
      : data.status === 'personal_use'
        ? (['personal_use', 'available', 'inactive'] as const)
        : (['available', 'personal_use', 'inactive'] as const);

  return (
    <ScreenContainer scrollable>
      <AppStatusBar />
      <ScreenHeader title="Edit car" />
      <CarForm
        initialCar={data}
        allowedStatuses={[...allowedStatuses]}
        submitLabel="Save changes"
        isSubmitting={updateCar.isPending}
        errorMessage={updateCar.isError ? getErrorMessage(updateCar.error) : undefined}
        onSubmit={handleSubmit}
      />
    </ScreenContainer>
  );
}
