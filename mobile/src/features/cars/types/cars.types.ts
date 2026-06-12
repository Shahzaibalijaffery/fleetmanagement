import type {
  MaintenanceChecklistItemInput,
  MaintenanceFrequency,
  MaintenanceScheduleType,
} from '@/features/contracts/types/contracts.types';

export const CAR_STATUSES = ['available', 'assigned', 'inactive', 'personal_use'] as const;

export const CAR_TYPES = ['sedan', 'suv', 'hatchback', 'pickup', 'van', 'luxury'] as const;

export type CarStatus = (typeof CAR_STATUSES)[number];
export type CarType = (typeof CAR_TYPES)[number];

export type PersonalMaintenanceItemStatus = 'upcoming' | 'due' | 'overdue';

export interface PersonalMaintenanceChecklistItem {
  id: string;
  title: string;
  scheduleType: MaintenanceScheduleType;
  frequency: MaintenanceFrequency | null;
  mileageIntervalKm: number | null;
  lastCompletedAt: string | null;
  lastCompletedOdometerKm: number | null;
  nextDueDate: string | null;
  nextDueOdometerKm: number | null;
  status: PersonalMaintenanceItemStatus;
}

export const CAR_TYPE_LABELS: Record<CarType, string> = {
  sedan: 'Sedan',
  suv: 'SUV',
  hatchback: 'Hatchback',
  pickup: 'Pickup',
  van: 'Van',
  luxury: 'Luxury',
};

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
  personalMaintenanceChecklist?: PersonalMaintenanceChecklistItem[];
  personalInitialOdometerKm?: number;
  personalCurrentOdometerKm?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePersonalMaintenanceRequest {
  personalInitialOdometerKm?: number;
  personalMaintenanceChecklist: MaintenanceChecklistItemInput[];
}

export interface UpdatePersonalOdometerRequest {
  personalCurrentOdometerKm: number;
}

export interface CreateCarRequest {
  brand: string;
  model: string;
  year: number;
  registrationNumber: string;
  city: string;
  carType: CarType;
  status?: CarStatus;
}

export interface UpdateCarRequest {
  brand?: string;
  model?: string;
  year?: number;
  registrationNumber?: string;
  city?: string;
  carType?: CarType;
  status?: CarStatus;
}

export interface ListCarsParams {
  page: number;
  limit: number;
  status?: CarStatus;
}
