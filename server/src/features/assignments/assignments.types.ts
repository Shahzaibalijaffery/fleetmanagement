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
  createdAt: Date;
  updatedAt: Date;
}

export interface ListAssignmentsQuery {
  page: number;
  limit: number;
  status?: AssignmentStatus;
  carId?: string;
}

export interface AssignmentFilter {
  driverId?: string;
  ownerId?: string;
  carId?: string;
  status?: AssignmentStatus;
}

export interface CreateAssignmentData {
  driverId: string;
  carId: string;
  ownerId: string;
  requestId: string;
  status: AssignmentStatus;
}

export interface PopulatedCarDocument {
  _id: { toString(): string };
  brand: string;
  model: string;
  year: number;
  city: string;
  carType: string;
  registrationNumber: string;
}

export interface PopulatedDriverDocument {
  _id: { toString(): string };
  name: string;
  city: string | null;
  experience: number | null;
}

export interface AssignmentDocument {
  _id: { toString(): string };
  driverId: PopulatedDriverDocument;
  carId: PopulatedCarDocument;
  ownerId: { toString(): string };
  requestId: { toString(): string };
  status: AssignmentStatus;
  createdAt: Date;
  updatedAt: Date;
}
