import { useQuery } from "@tanstack/react-query";
import { getPayment } from "@/features/pos/api/pos.api";
import { posQueryKeys } from "@/features/pos/lib/queryKeys";

export function usePayment(paymentId: number | null) {
  return useQuery({
    queryKey: posQueryKeys.payment(paymentId!),
    queryFn: () => getPayment(paymentId!),
    enabled: paymentId != null,
  });
}
