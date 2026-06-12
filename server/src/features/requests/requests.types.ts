export const REQUEST_STATUSES = ['pending', 'accepted', 'rejected'] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export interface CarSummary {
  id: string;
  brand: string;
  model: string;
  year: number;
  city: string;
  carType: string;
}

export interface DriverSummary {
  id: string;
  name: string;
  city: string | null;
  experience: number | null;
}

export interface CarRequest {
  id: string;
  driverId: string;
  carId: string;
  ownerId: string;
  status: RequestStatus;
  car: CarSummary;
  driver: DriverSummary;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRequestInput {
  carId: string;
}

export interface ListRequestsQuery {
  page: number;
  limit: number;
  status?: RequestStatus;
}

export interface PopulatedCarDocument {
  _id: { toString(): string };
  brand: string;
  model: string;
  year: number;
  city: string;
  carType: string;
}

export interface PopulatedDriverDocument {
  _id: { toString(): string };
  name: string;
  city: string | null;
  experience: number | null;
}

export interface CarRequestDocument {
  _id: { toString(): string };
  driverId: PopulatedDriverDocument;
  carId: PopulatedCarDocument;
  ownerId: { toString(): string };
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRequestData {
  driverId: string;
  carId: string;
  ownerId: string;
  status: RequestStatus;
}

export interface RequestFilter {
  driverId?: string;
  ownerId?: string;
  carId?: string;
  status?: RequestStatus;
}
