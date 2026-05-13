import { useState, useMemo } from "react";
import PosHeader from "@/features/pos/components/PosHeader";
import PosSummaryCards from "@/features/pos/components/PosSummaryCards";
import PosSearchBar, {
  type PosFilters,
} from "@/features/pos/components/PosSearchBar";
import PosTransactionTable from "@/features/pos/components/PosTransactionTable";
import { usePosTransactions } from "@/features/pos/hooks/usePosTransactions";
import { buildPosSummary } from "@/features/pos/lib/mappers";
import type { PosTransaction } from "@/features/pos/types/pos.types";

function filterTransactions(
  transactions: PosTransaction[],
  filters: PosFilters,
): PosTransaction[] {
  return transactions.filter((tx) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        tx.id.toLowerCase().includes(q) ||
        tx.trackingId?.toLowerCase().includes(q);
      if (!match) return false;
    }

    const { from, to } = filters.dateRange;
    if (from && tx.date < from) return false;
    if (to && tx.date > to) return false;

    if (filters.status !== "all" && tx.status !== filters.status) return false;

    if (filters.payment !== "all" && tx.paymentMethod !== filters.payment)
      return false;

    return true;
  });
}

export default function PosPage() {
  const { transactions, isLoading } = usePosTransactions();
  const [filters, setFilters] = useState<PosFilters>({
    search: "",
    dateRange: { from: null, to: null },
    status: "all",
    payment: "all",
  });

  const filtered = useMemo(
    () => filterTransactions(transactions, filters),
    [transactions, filters],
  );

  const summary = useMemo(() => buildPosSummary(filtered), [filtered]);

  return (
    <>
      <PosHeader />
      <main className="bg-monitor-bg flex flex-1 flex-col overflow-auto">
        <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-6 sm:py-6">
          <PosSummaryCards stats={summary} />
          <div className="mt-7">
            <PosSearchBar filters={filters} onChange={setFilters} />
          </div>
          <div className="mt-4">
            <PosTransactionTable
              transactions={filtered}
              totalCount={transactions.length}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </>
  );
}
