import { useQuery } from '@tanstack/react-query';
import { getVideoPlayback } from '../api/monitoring.api';
import { monitoringQueryKeys } from '../queryKeys/monitoring';

export function useVideoPlayback(alertId: number) {
  return useQuery({
    queryKey: monitoringQueryKeys.videoPlayback(alertId),
    queryFn: async () => {
      try {
        return await getVideoPlayback(alertId);
      } catch (err) {
        if ((err as { status?: number }).status === 404) return null;
        throw err;
      }
    },
    retry: false,
  });
}
