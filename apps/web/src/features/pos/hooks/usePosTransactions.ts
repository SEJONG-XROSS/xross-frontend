import { usePosTransactions as useCorePosTransactions } from '@xross/core/hooks/usePosTransactions';
import { useAuthStore } from '@/features/auth/store/auth.store';

export function usePosTransactions() {
  const storeId = useAuthStore((s) => s.storeId);
  return useCorePosTransactions(storeId);
}
