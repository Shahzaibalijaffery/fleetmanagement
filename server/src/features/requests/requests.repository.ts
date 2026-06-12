import { CarRequestModel } from '../../models/car-request.model';

import type {
  CarRequestDocument,
  CreateRequestData,
  RequestFilter,
  RequestStatus,
} from './requests.types';

const POPULATE_FIELDS = [
  { path: 'carId', select: 'brand model year city carType' },
  { path: 'driverId', select: 'name city experience' },
];

export const requestsRepository = {
  create(data: CreateRequestData) {
    return CarRequestModel.create(data);
  },

  findById(requestId: string) {
    return CarRequestModel.findById(requestId)
      .populate(POPULATE_FIELDS)
      .lean<CarRequestDocument>();
  },

  findPendingByCarAndDriver(carId: string, driverId: string) {
    return CarRequestModel.findOne({ carId, driverId, status: 'pending' }).lean<CarRequestDocument>();
  },

  findPaginated(filter: RequestFilter, skip: number, limit: number) {
    const query: RequestFilter = { ...filter };

    return CarRequestModel.find(query)
      .populate(POPULATE_FIELDS)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<CarRequestDocument[]>();
  },

  count(filter: RequestFilter) {
    return CarRequestModel.countDocuments(filter);
  },

  updateStatusById(requestId: string, status: RequestStatus) {
    return CarRequestModel.findByIdAndUpdate(requestId, { status }, { new: true })
      .populate(POPULATE_FIELDS)
      .lean<CarRequestDocument>();
  },

  rejectPendingByCarId(carId: string, excludeRequestId?: string) {
    const query: Record<string, unknown> = { carId, status: 'pending' };
    if (excludeRequestId) {
      query._id = { $ne: excludeRequestId };
    }

    return CarRequestModel.updateMany(query, { status: 'rejected' });
  },
};
