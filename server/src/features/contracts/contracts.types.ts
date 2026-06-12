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

export interface MaintenanceChecklistItem {
  _id: { toString(): string };
  title: string;
  scheduleType: MaintenanceScheduleType;
  frequency?: MaintenanceFrequency | null;
  mileageIntervalKm?: number | null;
  lastCompletedAt?: Date | null;
  lastCompletedOdometerKm?: number | null;
}

export interface MaintenanceChecklistItemInput {
  title: string;
  scheduleType: MaintenanceScheduleType;
  frequency?: MaintenanceFrequency;
  mileageIntervalKm?: number;
}

export interface MaintenanceChecklistItemView {
  id: string;
  title: string;
  scheduleType: MaintenanceScheduleType;
  frequency: MaintenanceFrequency | null;
  mileageIntervalKm: number | null;
  lastCompletedAt: Date | null;
  lastCompletedOdometerKm: number | null;
  nextDueDate: Date | null;
  nextDueOdometerKm: number | null;
  status: MaintenanceItemStatus;
  isWithinContractPeriod: boolean;
}

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
  startDate: Date;
  endDate: Date;
  fuelResponsibility: ResponsibilityParty;
  maintenanceResponsibility: ResponsibilityParty;
  damageResponsibility: ResponsibilityParty;
  status: ContractStatus;
  initialOdometerKm: number;
  currentOdometerKm: number;
  maintenanceChecklist: MaintenanceChecklistItemView[];
  car: CarSummary;
  driver: DriverSummary;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateContractInput {
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

export interface UpdateContractInput {
  contractMode?: ContractMode;
  paymentFrequency?: PaymentFrequency;
  rentAmount?: number;
  startDate?: string;
  endDate?: string;
  fuelResponsibility?: ResponsibilityParty;
  maintenanceResponsibility?: ResponsibilityParty;
  damageResponsibility?: ResponsibilityParty;
  initialOdometerKm?: number;
  currentOdometerKm?: number;
  maintenanceChecklist?: MaintenanceChecklistItemInput[];
}

export interface UpdateContractOdometerInput {
  currentOdometerKm: number;
}

export interface ListContractsQuery {
  page: number;
  limit: number;
  status?: ContractStatus;
}

export interface ContractFilter {
  driverId?: string;
  ownerId?: string;
  assignmentId?: string;
  status?: ContractStatus;
}

export interface CreateContractData {
  assignmentId: string;
  driverId: string;
  carId: string;
  ownerId: string;
  contractMode: ContractMode;
  paymentFrequency: PaymentFrequency;
  rentAmount: number;
  startDate: Date;
  endDate: Date;
  fuelResponsibility: ResponsibilityParty;
  maintenanceResponsibility: ResponsibilityParty;
  damageResponsibility: ResponsibilityParty;
  status: ContractStatus;
  initialOdometerKm: number;
  currentOdometerKm: number;
  maintenanceChecklist: MaintenanceChecklistItemInput[];
}

export interface PopulatedCarDocument {
  _id: { toString(): string };
  brand: string;
  model: string;
  year: number;
  city: string;
  registrationNumber: string;
}

export interface PopulatedDriverDocument {
  _id: { toString(): string };
  name: string;
  city: string | null;
  experience: number | null;
}

export interface ContractDocument {
  _id: { toString(): string };
  assignmentId: { toString(): string };
  driverId: PopulatedDriverDocument;
  carId: PopulatedCarDocument;
  ownerId: { toString(): string };
  contractMode: ContractMode;
  paymentFrequency: PaymentFrequency;
  rentAmount: number;
  startDate: Date;
  endDate: Date;
  fuelResponsibility: ResponsibilityParty;
  maintenanceResponsibility: ResponsibilityParty;
  damageResponsibility: ResponsibilityParty;
  status: ContractStatus;
  initialOdometerKm: number;
  currentOdometerKm: number;
  maintenanceChecklist: MaintenanceChecklistItem[];
  createdAt: Date;
  updatedAt: Date;
}
