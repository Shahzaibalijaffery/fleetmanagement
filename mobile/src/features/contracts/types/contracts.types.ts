export const CONTRACT_MODES = ['daily_shift', 'full_time'] as const;

export const PAYMENT_FREQUENCIES = ['daily', 'weekly', 'monthly'] as const;

export const RESPONSIBILITY_PARTIES = ['owner', 'driver'] as const;

export const CONTRACT_STATUSES = ['active', 'ended'] as const;

export const MAINTENANCE_SCHEDULE_TYPES = ['time', 'mileage'] as const;

export const MAINTENANCE_FREQUENCIES = ['daily', 'weekly', 'monthly'] as const;

export const MAINTENANCE_ITEM_STATUSES = [
  'upcoming',
  'due',
  'overdue',
  'contract_ended',
] as const;

export type ContractMode = (typeof CONTRACT_MODES)[number];
export type PaymentFrequency = (typeof PAYMENT_FREQUENCIES)[number];
export type ResponsibilityParty = (typeof RESPONSIBILITY_PARTIES)[number];
export type ContractStatus = (typeof CONTRACT_STATUSES)[number];
export type MaintenanceScheduleType = (typeof MAINTENANCE_SCHEDULE_TYPES)[number];
export type MaintenanceFrequency = (typeof MAINTENANCE_FREQUENCIES)[number];
export type MaintenanceItemStatus = (typeof MAINTENANCE_ITEM_STATUSES)[number];

export const CONTRACT_MODE_LABELS: Record<ContractMode, string> = {
  daily_shift: 'Daily Shift',
  full_time: 'Full Time',
};

export const PAYMENT_FREQUENCY_LABELS: Record<PaymentFrequency, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

export const RESPONSIBILITY_LABELS: Record<ResponsibilityParty, string> = {
  owner: 'Owner',
  driver: 'Driver',
};

export const MAINTENANCE_FREQUENCY_LABELS: Record<MaintenanceFrequency, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

export const MAINTENANCE_SCHEDULE_LABELS: Record<MaintenanceScheduleType, string> = {
  time: 'By schedule',
  mileage: 'By mileage',
};

export const MAINTENANCE_STATUS_LABELS: Record<MaintenanceItemStatus, string> = {
  upcoming: 'Upcoming',
  due: 'Due now',
  overdue: 'Overdue',
  contract_ended: 'Contract ended',
};

export interface MaintenanceChecklistItemInput {
  title: string;
  scheduleType: MaintenanceScheduleType;
  frequency?: MaintenanceFrequency;
  mileageIntervalKm?: number;
}

export interface MaintenanceChecklistItem {
  id: string;
  title: string;
  scheduleType: MaintenanceScheduleType;
  frequency: MaintenanceFrequency | null;
  mileageIntervalKm: number | null;
  lastCompletedAt: string | null;
  lastCompletedOdometerKm: number | null;
  nextDueDate: string | null;
  nextDueOdometerKm: number | null;
  status: MaintenanceItemStatus;
  isWithinContractPeriod: boolean;
}

export const DEFAULT_MAINTENANCE_PRESETS: MaintenanceChecklistItemInput[] = [
  { title: 'Washing', scheduleType: 'time', frequency: 'weekly' },
  { title: 'General service', scheduleType: 'time', frequency: 'monthly' },
  { title: 'Oil change', scheduleType: 'mileage', mileageIntervalKm: 5000 },
];

export interface CarSummary {
  id: string;
  brand: string;
  model: string;
  year: number;
  city: string;
  registrationNumber: string;
}

export interface DriverSummary {
  id: string;
  name: string;
  city: string | null;
  experience: number | null;
}

export interface Contract {
  id: string;
  assignmentId: string;
  driverId: string;
  carId: string;
  ownerId: string;
  contractMode: ContractMode;
  paymentFrequency: PaymentFrequency;
  rentAmount: number;
  startDate: string;
  endDate: string;
  fuelResponsibility: ResponsibilityParty;
  maintenanceResponsibility: ResponsibilityParty;
  damageResponsibility: ResponsibilityParty;
  status: ContractStatus;
  initialOdometerKm: number;
  currentOdometerKm: number;
  maintenanceChecklist: MaintenanceChecklistItem[];
  car: CarSummary;
  driver: DriverSummary;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContractPayload {
  assignmentId: string;
  contractMode: ContractMode;
  paymentFrequency: PaymentFrequency;
  rentAmount: number;
  startDate: string;
  endDate: string;
  fuelResponsibility: ResponsibilityParty;
  maintenanceResponsibility: ResponsibilityParty;
  damageResponsibility: ResponsibilityParty;
  initialOdometerKm?: number;
  maintenanceChecklist?: MaintenanceChecklistItemInput[];
}

export interface UpdateContractPayload {
  contractMode?: ContractMode;
  paymentFrequency?: PaymentFrequency;
  rentAmount?: number;
  startDate?: string;
  endDate?: string;
  fuelResponsibility?: ResponsibilityParty;
  maintenanceResponsibility?: ResponsibilityParty;
  damageResponsibility?: ResponsibilityParty;
  initialOdometerKm?: number;
  maintenanceChecklist?: MaintenanceChecklistItemInput[];
}

export interface ListContractsParams {
  page: number;
  limit: number;
  status?: ContractStatus;
}

export interface ContractsListFilters {
  status?: ContractStatus;
}
