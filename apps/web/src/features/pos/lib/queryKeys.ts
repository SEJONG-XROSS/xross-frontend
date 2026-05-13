export const posQueryKeys = {
  payments: (storeId: number) => ["pos", "payments", storeId] as const,
  payment: (id: number) => ["pos", "payment", id] as const,
};
