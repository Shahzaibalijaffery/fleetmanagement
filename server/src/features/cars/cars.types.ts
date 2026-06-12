import type {
  MaintenanceChecklistItemInput,
  MaintenanceFrequency,
  MaintenanceItemStatus,
  MaintenanceScheduleType,
} from '../contracts/contracts.types';

export const CAR_STATUSES = ['available', 'assigned', 'inactive', 'personal_use'] as const;

export const CAR_TYPES = ['sedan', 'suv', 'hatchback', 'pickup', 'van', 'luxury'] as const;

export type CarStatus = (typeof CAR_STATUSES)[number];
export type CarType = (typeof CAR_TYPES)[number];

export type PersonalMaintenanceItemStatus = Exclude<MaintenanceItemStatus, 'contract_ended'>;

export interface PersonalMaintenanceChecklistItem {
  _id: { toString(): string };
  title: string;
  scheduleType: MaintenanceScheduleType;
  frequency?: MaintenanceFrequency | null;
  mileageIntervalKm?: number | null;
  lastCompletedAt?: Date | null;
  lastCompletedOdometerKm?: number | null;
}

export interface PersonalMaintenanceChecklistItemView {
  id: string;
  title: string;
  scheduleType: MaintenanceScheduleType;
  frequency: MaintenanceFrequency | null;
  mileageIntervalKm: number | null;
  lastCompletedAt: Date | null;
  lastCompletedOdometerKm: number | null;
  nextDueDate: Date | null;
  nextDueOdometerKm: number | null;
  status: PersonalMaintenanceItemStatus;
}

export interface Car {
  id: string;
  ownerId: string;
  brand: string;
  model: string;
  year: number;
  registrationNumber: string;
  city: string;
  carType: CarType;
  status: CarStatus;
  personalMaintenanceChecklist?: PersonalMaintenanceChecklistItemView[];
  personalInitialOdometerKm?: number;
  personalCurrentOdometerKm?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdatePersonalMaintenanceInput {
  personalInitialOdometerKm?: number;
  personalMaintenanceChecklist: MaintenanceChecklistItemInput[];
}

export interface UpdatePersonalOdometerInput {
  personalCurrentOdometerKm: number;
}

export interface CreateCarInput {
  brand: string;
  model: string;
  year: number;
  registrationNumber: string;
  city: string;
  carType: CarType;
  status?: CarStatus;
}

export interface UpdateCarInput {
  brand?: string;
  model?: string;
  year?: number;
  registrationNumber?: string;
  city?: string;
  carType?: CarType;
  status?: CarStatus;
}

export interface ListCarsQuery {
  page: number;
  limit: number;
  status?: CarStatus;
}

export interface CarDocument {
  _id: { toString(): string };
  ownerId: { toString(): string };
  brand: string;
  model: string;
  year: number;
  registrationNumber: string;
  city: string;
  carType: CarType;
  status: CarStatus;
  personalMaintenanceChecklist?: PersonalMaintenanceChecklistItem[];
  personalInitialOdometerKm?: number;
  personalCurrentOdometerKm?: number;
  createdAt: Date;
  updatedAt: Date;
}
