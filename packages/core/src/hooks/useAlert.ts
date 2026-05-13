import { useQuery } from '@tanstack/react-query';
import { getAlert } from '../api/monitoring.api';
import { monitoringQueryKeys } from '../queryKeys/monitoring';

export function useAlert(alertId: number | null) {
  return useQuery({
    queryKey: alertId != null ? monitoringQueryKeys.alert(alertId) : ['monitoring', 'alert', null],
    queryFn: () => getAlert(alertId!),
    enabled: alertId != null,
  });
}
