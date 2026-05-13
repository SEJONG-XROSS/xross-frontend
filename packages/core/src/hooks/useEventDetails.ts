import { useQuery } from '@tanstack/react-query';
import { getEventDetails } from '../api/monitoring.api';
import { monitoringQueryKeys } from '../queryKeys/monitoring';

export function useEventDetails(eventId: number | null) {
  return useQuery({
    queryKey: eventId != null ? monitoringQueryKeys.eventDetails(eventId) : ['monitoring', 'event-details', null],
    queryFn: () => getEventDetails(eventId!),
    enabled: eventId != null,
  });
}
