import { useQuery } from '@tanstack/react-query';

import { carsService } from '../services/cars.service';
import { carsKeys } from './cars.keys';

export function useCar(carId: string) {
  return useQuery({
    queryKey: carsKeys.detail(carId),
    queryFn: () => carsService.getCar(carId),
    staleTime: 2 * 60 * 1000,
  });
}
