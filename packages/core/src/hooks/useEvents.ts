import { useQuery } from '@tanstack/react-query';
import { getEvents } from '../api/monitoring.api';
import { monitoringQueryKeys } from '../queryKeys/monitoring';

export function useEvents(storeId: number | null) {
  return useQuery({
    queryKey: storeId != null ? monitoringQueryKeys.events(storeId) : ['monitoring', 'events', null],
    queryFn: () => getEvents(storeId!),
    enabled: storeId != null,
    refetchInterval: 30_000,
  });
}
