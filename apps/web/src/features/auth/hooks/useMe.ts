import { useMe as useCoreMe } from '@xross/core/hooks/useMe';
import { useAuthStore } from '@/features/auth/store/auth.store';

export function useMe() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useCoreMe(!!accessToken);
}
