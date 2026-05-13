import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEvents } from '../api/monitoring.api';
import { getPayments } from '../api/pos.api';
import { monitoringQueryKeys } from '../queryKeys/monitoring';
import { posQueryKeys } from '../queryKeys/pos';
import { mapApiPaymentMethod, mapEventToPosTransaction, buildPosSummary, POS_EVENT_TYPES } from '../mappers/pos';

export function usePosTransactions(storeId: number | null) {
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: storeId != null ? [...monitoringQueryKeys.events(storeId), 'pos'] : ['pos-events-disabled'],
    queryFn: () => getEvents(storeId!),
    enabled: storeId != null,
    refetchInterval: 30_000,
  });

  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: storeId != null ? posQueryKeys.payments(storeId) : ['pos-payments-disabled'],
    queryFn: () => getPayments({ storeId: storeId! }),
    enabled: storeId != null,
    refetchInterval: 30_000,
  });

  const transactions = useMemo(() => {
    const paymentMethodMap = new Map(
      payments.map((p) => [p.id, mapApiPaymentMethod(p.paymentMethod)]),
    );
    return events
      .filter((e) => (POS_EVENT_TYPES as readonly string[]).includes(e.type))
      .map((e) =>
        mapEventToPosTransaction(
          e,
          e.paymentId != null ? (paymentMethodMap.get(e.paymentId) ?? null) : null,
        ),
      )
      .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
  }, [events, payments]);

  const summary = useMemo(() => buildPosSummary(transactions), [transactions]);

  return { transactions, summary, isLoading: eventsLoading || paymentsLoading };
}
