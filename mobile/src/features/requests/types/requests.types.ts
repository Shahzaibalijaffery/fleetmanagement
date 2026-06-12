export const REQUEST_STATUSES = ['pending', 'accepted', 'rejected'] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

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
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestPayload {
  carId: string;
}

export interface ListRequestsParams {
  page: number;
  limit: number;
  status?: RequestStatus;
}

export interface RequestsListFilters {
  status?: RequestStatus;
}
