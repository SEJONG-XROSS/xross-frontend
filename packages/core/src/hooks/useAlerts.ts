import { useQuery } from '@tanstack/react-query';
import { getAlerts } from '../api/monitoring.api';
import { monitoringQueryKeys } from '../queryKeys/monitoring';

export function useAlerts(storeId: number | null) {
  return useQuery({
    queryKey: storeId != null ? monitoringQueryKeys.alerts(storeId) : ['monitoring', 'alerts', null],
    queryFn: () => getAlerts(storeId!),
    enabled: storeId != null,
    refetchInterval: 30_000,
  });
}
