export const PAYMENT_STATUSES = ['pending', 'paid'] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export interface PaymentSummary {
  count: number;
  totalAmount: number;
}

export interface CreatePaymentData {
  contractId: string;
  ownerId: string;
  driverId: string;
  amount: number;
  dueDate: Date;
  status: PaymentStatus;
}

export interface PaymentDocument {
  _id: { toString(): string };
  contractId: { toString(): string };
  ownerId: { toString(): string };
  driverId: { toString(): string };
  amount: number;
  dueDate: Date;
  status: PaymentStatus;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
