import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getAlerts } from "@/features/monitoring/api/monitoring.api";
import { monitoringQueryKeys } from "@/features/monitoring/lib/queryKeys";

export function useAlerts() {
  const storeId = useAuthStore((s) => s.storeId);
  return useQuery({
    queryKey: monitoringQueryKeys.alerts(storeId!),
    queryFn: () => getAlerts(storeId!),
    enabled: !!storeId,
    refetchInterval: 30_000,
  });
}
