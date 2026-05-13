import { useQuery } from '@tanstack/react-query';
import { getEvent } from '../api/monitoring.api';
import { monitoringQueryKeys } from '../queryKeys/monitoring';

export function useEvent(eventId: number | null) {
  return useQuery({
    queryKey: eventId != null ? monitoringQueryKeys.event(eventId) : ['monitoring', 'event', null],
    queryFn: () => getEvent(eventId!),
    enabled: eventId != null,
  });
}
