import { paymentsRepository } from './payments.repository';

interface CreateInitialPaymentInput {
  contractId: string;
  ownerId: string;
  driverId: string;
  amount: number;
  dueDate: Date;
}

export const paymentsService = {
  async createInitialPayment(input: CreateInitialPaymentInput) {
    return paymentsRepository.create({
      contractId: input.contractId,
      ownerId: input.ownerId,
      driverId: input.driverId,
      amount: input.amount,
      dueDate: input.dueDate,
      status: 'pending',
    });
  },
};
