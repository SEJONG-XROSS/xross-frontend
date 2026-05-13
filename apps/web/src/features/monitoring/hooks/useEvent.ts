import { useQuery } from "@tanstack/react-query";
import { getEvent } from "@/features/monitoring/api/monitoring.api";
import { monitoringQueryKeys } from "@/features/monitoring/lib/queryKeys";

export function useEvent(eventId: number | null) {
  return useQuery({
    queryKey: monitoringQueryKeys.event(eventId!),
    queryFn: () => getEvent(eventId!),
    enabled: eventId != null,
  });
}
