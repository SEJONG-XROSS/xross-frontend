import type { PosTransaction, PosFilters } from '../types/pos';

export function filterTransactions(
  transactions: PosTransaction[],
  filters: PosFilters,
): PosTransaction[] {
  return transactions.filter((tx) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        tx.id.toLowerCase().includes(q) ||
        (tx.trackingId?.toLowerCase().includes(q) ?? false);
      if (!match) return false;
    }

    const { from, to } = filters.dateRange;
    if (from && tx.date < from) return false;
    if (to && tx.date > to) return false;

    if (filters.status !== 'all' && tx.status !== filters.status) return false;
    if (filters.payment !== 'all' && tx.paymentMethod !== filters.payment) return false;

    return true;
  });
}
