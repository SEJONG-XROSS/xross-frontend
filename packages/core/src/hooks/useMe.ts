import { useQuery } from '@tanstack/react-query';
import { getMeApi } from '../api/auth.api';
import { authQueryKeys } from '../queryKeys/auth';

export function useMe(enabled = true) {
  return useQuery({
    queryKey: authQueryKeys.me,
    queryFn: getMeApi,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
