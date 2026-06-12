import { assignmentsRepository } from '../assignments/assignments.repository';
import { carsRepository } from '../cars/cars.repository';
import { contractsRepository } from '../contracts/contracts.repository';
import { paymentsRepository } from '../payments/payments.repository';

import type { DriverDashboard, OwnerDashboard } from './dashboard.types';

export const dashboardService = {
  async getOwnerDashboard(ownerId: string): Promise<OwnerDashboard> {
    const [totalCars, availableCars, assignedCars, outstandingPayments] = await Promise.all([
      carsRepository.count({ ownerId }),
      carsRepository.count({ ownerId, status: 'available' }),
      carsRepository.count({ ownerId, status: 'assigned' }),
      paymentsRepository.getOutstandingForOwner(ownerId),
    ]);

    return {
      totalCars,
      availableCars,
      assignedCars,
      outstandingPayments,
    };
  },

  async getDriverDashboard(driverId: string): Promise<DriverDashboard> {
    const [assignment, pendingPayments] = await Promise.all([
      assignmentsRepository.findActiveByDriverId(driverId),
      paymentsRepository.getPendingForDriver(driverId),
    ]);

    if (!assignment) {
      return {
        assignedCar: null,
        currentContract: null,
        pendingPayments,
      };
    }

    const contract = await contractsRepository.findActiveByAssignmentId(
      assignment._id.toString(),
    );

    return {
      assignedCar: {
        id: assignment.carId._id.toString(),
        brand: assignment.carId.brand,
        model: assignment.carId.model,
        year: assignment.carId.year,
        city: assignment.carId.city,
        registrationNumber: assignment.carId.registrationNumber,
      },
      currentContract: contract
        ? {
            id: contract._id.toString(),
            contractMode: contract.contractMode,
            paymentFrequency: contract.paymentFrequency,
            rentAmount: contract.rentAmount,
            startDate: contract.startDate,
            endDate: contract.endDate,
          }
        : null,
      pendingPayments,
    };
  },
};
