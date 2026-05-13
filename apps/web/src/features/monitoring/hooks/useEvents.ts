import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getEvents } from "@/features/monitoring/api/monitoring.api";
import { monitoringQueryKeys } from "@/features/monitoring/lib/queryKeys";

export function useEvents() {
  const storeId = useAuthStore((s) => s.storeId);
  return useQuery({
    queryKey: monitoringQueryKeys.events(storeId!),
    queryFn: () => getEvents(storeId!),
    enabled: !!storeId,
    refetchInterval: 30_000,
  });
}
