import { useQuery } from "@tanstack/react-query";
import { getAlert } from "@/features/monitoring/api/monitoring.api";
import { monitoringQueryKeys } from "@/features/monitoring/lib/queryKeys";

export function useAlert(alertId: number) {
  return useQuery({
    queryKey: monitoringQueryKeys.alert(alertId),
    queryFn: () => getAlert(alertId),
    enabled: !!alertId,
  });
}
