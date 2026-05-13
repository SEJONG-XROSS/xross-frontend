import { useQuery } from '@tanstack/react-query';
import { getPayment } from '../api/pos.api';
import { posQueryKeys } from '../queryKeys/pos';

export function usePayment(paymentId: number | null) {
  return useQuery({
    queryKey: paymentId != null ? posQueryKeys.payment(paymentId) : ['pos', 'payment', null],
    queryFn: () => getPayment(paymentId!),
    enabled: paymentId != null,
  });
}
