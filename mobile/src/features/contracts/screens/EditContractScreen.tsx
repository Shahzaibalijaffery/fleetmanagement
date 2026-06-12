import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppStatusBar, ErrorState, ScreenContainer, ScreenHeader } from '@/shared/components';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import type { MainStackParamList } from '@/app/navigation/types';

import { ContractDetailSkeleton } from '../components/ContractDetailSkeleton';
import { ContractForm } from '../components/ContractForm';
import { useContract } from '../hooks/useContract';
import { useUpdateContract } from '../hooks/useUpdateContract';
import type { ContractFormValues } from '../validation/contract.schemas';

type EditContractScreenProps = NativeStackScreenProps<MainStackParamList, 'EditContract'>;

export function EditContractScreen({ navigation, route }: EditContractScreenProps) {
  const { contractId } = route.params;
  const { data, isLoading, isError, refetch } = useContract(contractId);
  const updateContract = useUpdateContract();

  const handleSubmit = (values: ContractFormValues) => {
    updateContract.mutate(
      { contractId, payload: values },
      { onSuccess: () => navigation.goBack() },
    );
  };

  if (isLoading) {
    return (
      <ScreenContainer scrollable>
        <AppStatusBar />
        <ScreenHeader title="Edit contract" />
        <ContractDetailSkeleton />
      </ScreenContainer>
    );
  }

  if (isError || !data) {
    return (
      <ScreenContainer>
        <AppStatusBar />
        <ScreenHeader title="Edit contract" />
        <ErrorState message="Couldn't load contract." onRetry={() => refetch()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      <AppStatusBar />
      <ScreenHeader title="Edit contract" />
      <ContractForm
        initialContract={data}
        submitLabel="Save changes"
        isSubmitting={updateContract.isPending}
        errorMessage={updateContract.isError ? getErrorMessage(updateContract.error) : undefined}
        onSubmit={handleSubmit}
      />
    </ScreenContainer>
  );
}
