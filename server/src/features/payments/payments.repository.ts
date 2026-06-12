import { PaymentModel } from '../../models/payment.model';

import type { CreatePaymentData, PaymentSummary } from './payments.types';

async function aggregatePending(
  filter: Record<string, unknown>,
): Promise<PaymentSummary> {
  const [result] = await PaymentModel.aggregate<{ count: number; totalAmount: number }>([
    { $match: { ...filter, status: 'pending' } },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);

  return {
    count: result?.count ?? 0,
    totalAmount: result?.totalAmount ?? 0,
  };
}

export const paymentsRepository = {
  create(data: CreatePaymentData) {
    return PaymentModel.create(data);
  },

  getOutstandingForOwner(ownerId: string) {
    return aggregatePending({ ownerId });
  },

  getPendingForDriver(driverId: string) {
    return aggregatePending({ driverId });
  },
};
