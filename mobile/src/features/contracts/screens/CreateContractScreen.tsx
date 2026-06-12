import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppStatusBar, ScreenContainer, ScreenHeader } from '@/shared/components';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import type { MainStackParamList } from '@/app/navigation/types';

import { ContractForm } from '../components/ContractForm';
import { useCreateContract } from '../hooks/useCreateContract';
import type { ContractFormValues } from '../validation/contract.schemas';

type CreateContractScreenProps = NativeStackScreenProps<MainStackParamList, 'CreateContract'>;

export function CreateContractScreen({ navigation, route }: CreateContractScreenProps) {
  const { assignmentId } = route.params;
  const createContract = useCreateContract();

  const handleSubmit = (values: ContractFormValues) => {
    createContract.mutate(
      { assignmentId, ...values },
      {
        onSuccess: (contract) => {
          navigation.replace('ContractDetail', { contractId: contract.id });
        },
      },
    );
  };

  return (
    <ScreenContainer scrollable>
      <AppStatusBar />
      <ScreenHeader
        title="Create contract"
        subtitle="Define rent, dates, maintenance checklist, and responsibilities."
      />
      <ContractForm
        submitLabel="Create contract"
        isSubmitting={createContract.isPending}
        errorMessage={createContract.isError ? getErrorMessage(createContract.error) : undefined}
        onSubmit={handleSubmit}
      />
    </ScreenContainer>
  );
}
