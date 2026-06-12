import type { CarStatus } from '../types/cars.types';

export interface CarsListFilters {
  status?: CarStatus;
}

export const carsKeys = {
  all: ['cars'] as const,
  lists: () => [...carsKeys.all, 'list'] as const,
  list: (filters: CarsListFilters) => [...carsKeys.lists(), filters] as const,
  details: () => [...carsKeys.all, 'detail'] as const,
  detail: (carId: string) => [...carsKeys.details(), carId] as const,
};
