import { AssignmentModel } from '../../models/assignment.model';

import type {
  AssignmentDocument,
  AssignmentFilter,
  AssignmentStatus,
  CreateAssignmentData,
} from './assignments.types';

const POPULATE_FIELDS = [
  { path: 'carId', select: 'brand model year city carType registrationNumber' },
  { path: 'driverId', select: 'name city experience' },
];

export const assignmentsRepository = {
  create(data: CreateAssignmentData) {
    return AssignmentModel.create(data);
  },

  findById(assignmentId: string) {
    return AssignmentModel.findById(assignmentId)
      .populate(POPULATE_FIELDS)
      .lean<AssignmentDocument>();
  },

  findActiveByCarId(carId: string) {
    return AssignmentModel.findOne({ carId, status: 'active' })
      .populate(POPULATE_FIELDS)
      .lean<AssignmentDocument>();
  },

  findActiveByDriverId(driverId: string) {
    return AssignmentModel.findOne({ driverId, status: 'active' })
      .populate(POPULATE_FIELDS)
      .lean<AssignmentDocument>();
  },

  findPaginated(filter: AssignmentFilter, skip: number, limit: number) {
    return AssignmentModel.find(filter)
      .populate(POPULATE_FIELDS)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<AssignmentDocument[]>();
  },

  count(filter: AssignmentFilter) {
    return AssignmentModel.countDocuments(filter);
  },

  updateStatusById(assignmentId: string, status: AssignmentStatus) {
    return AssignmentModel.findByIdAndUpdate(assignmentId, { status }, { new: true })
      .populate(POPULATE_FIELDS)
      .lean<AssignmentDocument>();
  },
};
