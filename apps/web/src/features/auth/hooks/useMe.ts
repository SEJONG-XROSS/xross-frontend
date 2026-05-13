import { useQuery } from "@tanstack/react-query";
import { getMeApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { authQueryKeys } from "@/features/auth/lib/queryKeys";

export function useMe() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: authQueryKeys.me,
    queryFn: getMeApi,
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
  });
}
