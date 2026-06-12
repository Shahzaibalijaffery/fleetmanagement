export const carExpensesKeys = {
  all: ['car-expenses'] as const,
  list: (carId: string, page: number) => [...carExpensesKeys.all, carId, page] as const,
};
