import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getEvents } from "@/features/monitoring/api/monitoring.api";
import { getPayments } from "@/features/pos/api/pos.api";
import { monitoringQueryKeys } from "@/features/monitoring/lib/queryKeys";
import { posQueryKeys } from "@/features/pos/lib/queryKeys";
import {
  mapEventToPosTransaction,
  mapApiPaymentMethod,
  buildPosSummary,
  POS_EVENT_TYPES,
} from "@/features/pos/lib/mappers";

export function usePosTransactions() {
  const storeId = useAuthStore((s) => s.storeId);

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: [...monitoringQueryKeys.events(storeId!), "pos"],
    queryFn: () => getEvents(storeId!),
    enabled: !!storeId,
    refetchInterval: 30_000,
  });

  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: posQueryKeys.payments(storeId!),
    queryFn: () => getPayments({ storeId: storeId! }),
    enabled: !!storeId,
    refetchInterval: 30_000,
  });

  const transactions = useMemo(() => {
    const paymentMethodMap = new Map(
      payments.map((p) => [p.id, mapApiPaymentMethod(p.paymentMethod)])
    );
    return events
      .filter((e) => (POS_EVENT_TYPES as readonly string[]).includes(e.type))
      .map((e) => mapEventToPosTransaction(e, e.paymentId != null ? (paymentMethodMap.get(e.paymentId) ?? null) : null))
      .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
  }, [events, payments]);

  const summary = useMemo(() => buildPosSummary(transactions), [transactions]);

  return { transactions, summary, isLoading: eventsLoading || paymentsLoading };
}
