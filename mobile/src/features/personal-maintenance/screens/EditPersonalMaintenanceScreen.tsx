import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AuthErrorBanner } from "@/features/auth/components/AuthErrorBanner";
import { useCar } from "@/features/cars/hooks/useCar";
import { CarDetailSkeleton } from "@/features/cars/components/CarDetailSkeleton";
import type { MainStackParamList } from "@/app/navigation/types";
import {
  AppStatusBar,
  Button,
  ErrorState,
  ScreenContainer,
  ScreenHeader,
} from "@/shared/components";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";

import { PersonalMaintenanceEditor } from "../components/PersonalMaintenanceEditor";
import { useUpdatePersonalMaintenance } from "../hooks/useUpdatePersonalMaintenance";
import {
  personalMaintenanceFormSchema,
  type PersonalMaintenanceFormValues,
} from "../validation/personal-maintenance.schemas";

type EditPersonalMaintenanceScreenProps = NativeStackScreenProps<
  MainStackParamList,
  "EditPersonalMaintenance"
>;

function mapChecklist(car: NonNullable<ReturnType<typeof useCar>["data"]>) {
  return (car.personalMaintenanceChecklist ?? []).map((item) => ({
    title: item.title,
    scheduleType: item.scheduleType,
    frequency: item.frequency ?? undefined,
    mileageIntervalKm: item.mileageIntervalKm ?? undefined,
  }));
}

export function EditPersonalMaintenanceScreen({
  navigation,
  route,
}: EditPersonalMaintenanceScreenProps) {
  const { carId } = route.params;
  const { data, isLoading, isError, refetch } = useCar(carId);
  const updateMaintenance = useUpdatePersonalMaintenance(carId);

  const { control, handleSubmit, reset } =
    useForm<PersonalMaintenanceFormValues>({
      resolver: zodResolver(personalMaintenanceFormSchema),
      defaultValues: {
        personalMaintenanceChecklist: [],
      },
    });

  const { fields, append, replace, remove } = useFieldArray({
    control,
    name: "personalMaintenanceChecklist",
  });

  useEffect(() => {
    if (data) {
      reset({
        personalMaintenanceChecklist: mapChecklist(data),
      });
    }
  }, [data, reset]);

  const onSubmit = (values: PersonalMaintenanceFormValues) => {
    updateMaintenance.mutate(
      {
        personalMaintenanceChecklist: values.personalMaintenanceChecklist,
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
        <ScreenHeader title="Edit maintenance" />
        <CarDetailSkeleton />
      </ScreenContainer>
    );
  }

  if (isError || !data) {
    return (
      <ScreenContainer>
        <AppStatusBar />
        <ScreenHeader title="Edit maintenance" />
        <ErrorState message="Couldn't load car." onRetry={() => refetch()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      <AppStatusBar />
      <ScreenHeader title="Edit maintenance" />

      {updateMaintenance.isError ? (
        <AuthErrorBanner message={getErrorMessage(updateMaintenance.error)} />
      ) : null}

      <PersonalMaintenanceEditor
        control={control}
        fields={fields}
        append={append}
        replace={replace}
        remove={remove}
      />

      <Button
        title="Save maintenance items"
        onPress={handleSubmit(onSubmit)}
        loading={updateMaintenance.isPending}
        fullWidth
      />
    </ScreenContainer>
  );
}
