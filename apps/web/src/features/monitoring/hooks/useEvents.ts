import { useEvents as useCoreEvents } from '@xross/core/hooks/useEvents';
import { useAuthStore } from '@/features/auth/store/auth.store';

export function useEvents() {
  const storeId = useAuthStore((s) => s.storeId);
  return useCoreEvents(storeId);
}
