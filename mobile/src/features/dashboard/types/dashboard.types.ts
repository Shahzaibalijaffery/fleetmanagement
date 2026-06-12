export interface PaymentSummary {
  count: number;
  totalAmount: number;
}

export interface OwnerDashboard {
  totalCars: number;
  availableCars: number;
  assignedCars: number;
  outstandingPayments: PaymentSummary;
}

export interface DashboardCarSummary {
  id: string;
  brand: string;
  model: string;
  year: number;
  city: string;
  registrationNumber: string;
}

export interface DashboardContractSummary {
  id: string;
  contractMode: string;
  paymentFrequency: string;
  rentAmount: number;
  startDate: string;
  endDate: string;
}

export interface DriverDashboard {
  assignedCar: DashboardCarSummary | null;
  currentContract: DashboardContractSummary | null;
  pendingPayments: PaymentSummary;
}

export type DashboardData = OwnerDashboard | DriverDashboard;

export function isOwnerDashboard(data: DashboardData): data is OwnerDashboard {
  return 'totalCars' in data;
}
