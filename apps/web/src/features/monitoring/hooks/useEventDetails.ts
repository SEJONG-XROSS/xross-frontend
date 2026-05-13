import { useQuery } from "@tanstack/react-query";
import { getEventDetails } from "@/features/monitoring/api/monitoring.api";
import { monitoringQueryKeys } from "@/features/monitoring/lib/queryKeys";

export function useEventDetails(eventId: number) {
  return useQuery({
    queryKey: monitoringQueryKeys.eventDetails(eventId),
    queryFn: () => getEventDetails(eventId),
    enabled: !!eventId,
  });
}
