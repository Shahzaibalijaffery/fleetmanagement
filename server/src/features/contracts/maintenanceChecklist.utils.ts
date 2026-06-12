import type {
  ContractDocument,
  MaintenanceChecklistItem,
  MaintenanceChecklistItemView,
  MaintenanceFrequency,
  MaintenanceItemStatus,
} from './contracts.types';

export function addMaintenanceInterval(date: Date, frequency: MaintenanceFrequency): Date {
  const result = new Date(date);

  switch (frequency) {
    case 'daily':
      result.setDate(result.getDate() + 1);
      break;
    case 'weekly':
      result.setDate(result.getDate() + 7);
      break;
    case 'monthly':
      result.setMonth(result.getMonth() + 1);
      break;
    default:
      break;
  }

  return result;
}

function isWithinContract(contract: ContractDocument, date: Date): boolean {
  return date >= contract.startDate && date <= contract.endDate;
}

function resolveTimeItemStatus(
  contract: ContractDocument,
  item: MaintenanceChecklistItem,
  now: Date,
): Pick<
  MaintenanceChecklistItemView,
  'status' | 'nextDueDate' | 'nextDueOdometerKm' | 'isWithinContractPeriod'
> {
  if (!item.frequency) {
    return {
      status: 'upcoming',
      nextDueDate: null,
      nextDueOdometerKm: null,
      isWithinContractPeriod: false,
    };
  }

  const anchor = item.lastCompletedAt
    ? new Date(item.lastCompletedAt)
    : new Date(contract.startDate);
  const nextDueDate = addMaintenanceInterval(anchor, item.frequency);

  if (now > contract.endDate || contract.status === 'ended') {
    return {
      status: 'contract_ended',
      nextDueDate,
      nextDueOdometerKm: null,
      isWithinContractPeriod: false,
    };
  }

  if (now < contract.startDate) {
    return {
      status: 'upcoming',
      nextDueDate,
      nextDueOdometerKm: null,
      isWithinContractPeriod: isWithinContract(contract, nextDueDate),
    };
  }

  if (nextDueDate > contract.endDate) {
    return {
      status: 'contract_ended',
      nextDueDate,
      nextDueOdometerKm: null,
      isWithinContractPeriod: false,
    };
  }

  if (now > nextDueDate) {
    return {
      status: 'overdue',
      nextDueDate,
      nextDueOdometerKm: null,
      isWithinContractPeriod: true,
    };
  }

  if (now.toDateString() === nextDueDate.toDateString()) {
    return {
      status: 'due',
      nextDueDate,
      nextDueOdometerKm: null,
      isWithinContractPeriod: true,
    };
  }

  return {
    status: 'upcoming',
    nextDueDate,
    nextDueOdometerKm: null,
    isWithinContractPeriod: true,
  };
}

function resolveMileageItemStatus(
  contract: ContractDocument,
  item: MaintenanceChecklistItem,
  now: Date,
): Pick<
  MaintenanceChecklistItemView,
  'status' | 'nextDueDate' | 'nextDueOdometerKm' | 'isWithinContractPeriod'
> {
  if (item.mileageIntervalKm == null) {
    return {
      status: 'upcoming',
      nextDueDate: null,
      nextDueOdometerKm: null,
      isWithinContractPeriod: false,
    };
  }

  const baseKm = item.lastCompletedOdometerKm ?? contract.initialOdometerKm;
  const nextDueOdometerKm = baseKm + item.mileageIntervalKm;
  const currentKm = contract.currentOdometerKm;

  if (now > contract.endDate || contract.status === 'ended') {
    return {
      status: 'contract_ended',
      nextDueDate: null,
      nextDueOdometerKm,
      isWithinContractPeriod: false,
    };
  }

  if (now < contract.startDate) {
    return {
      status: 'upcoming',
      nextDueDate: null,
      nextDueOdometerKm,
      isWithinContractPeriod: true,
    };
  }

  if (currentKm >= nextDueOdometerKm) {
    return {
      status: 'overdue',
      nextDueDate: null,
      nextDueOdometerKm,
      isWithinContractPeriod: true,
    };
  }

  const remainingKm = nextDueOdometerKm - currentKm;
  const dueSoonThreshold = Math.min(500, item.mileageIntervalKm * 0.1);

  if (remainingKm <= dueSoonThreshold) {
    return {
      status: 'due',
      nextDueDate: null,
      nextDueOdometerKm,
      isWithinContractPeriod: true,
    };
  }

  return {
    status: 'upcoming',
    nextDueDate: null,
    nextDueOdometerKm,
    isWithinContractPeriod: true,
  };
}

export function enrichMaintenanceItem(
  contract: ContractDocument,
  item: MaintenanceChecklistItem,
  now = new Date(),
): MaintenanceChecklistItemView {
  const resolved =
    item.scheduleType === 'time'
      ? resolveTimeItemStatus(contract, item, now)
      : resolveMileageItemStatus(contract, item, now);

  return {
    id: item._id.toString(),
    title: item.title,
    scheduleType: item.scheduleType,
    frequency: item.frequency ?? null,
    mileageIntervalKm: item.mileageIntervalKm ?? null,
    lastCompletedAt: item.lastCompletedAt ?? null,
    lastCompletedOdometerKm: item.lastCompletedOdometerKm ?? null,
    ...resolved,
  };
}

export function enrichMaintenanceChecklist(
  contract: ContractDocument,
  now = new Date(),
): MaintenanceChecklistItemView[] {
  return (contract.maintenanceChecklist ?? []).map((item) =>
    enrichMaintenanceItem(contract, item, now),
  );
}

export function hasMileageChecklistItems(items: { scheduleType: string }[]): boolean {
  return items.some((item) => item.scheduleType === 'mileage');
}
