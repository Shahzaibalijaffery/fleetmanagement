export const ASSIGNMENT_STATUSES = ['active', 'ended'] as const;

export type AssignmentStatus = (typeof ASSIGNMENT_STATUSES)[number];

export interface CarSummary {
  id: string;
  brand: string;
  model: string;
  year: number;
  city: string;
  carType: string;
  registrationNumber: string;
}

export interface DriverSummary {
  id: string;
  name: string;
  city: string | null;
  experience: number | null;
}

export interface Assignment {
  id: string;
  driverId: string;
  carId: string;
  ownerId: string;
  requestId: string;
  status: AssignmentStatus;
  car: CarSummary;
  driver: DriverSummary;
  createdAt: string;
  updatedAt: string;
}

export interface ListAssignmentsParams {
  page: number;
  limit: number;
  status?: AssignmentStatus;
  carId?: string;
}

export interface AssignmentsListFilters {
  status?: AssignmentStatus;
  carId?: string;
}
