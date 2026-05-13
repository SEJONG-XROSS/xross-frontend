import { useAlerts as useCoreAlerts } from '@xross/core/hooks/useAlerts';
import { useAuthStore } from '@/features/auth/store/auth.store';

export function useAlerts() {
  const storeId = useAuthStore((s) => s.storeId);
  return useCoreAlerts(storeId);
}
