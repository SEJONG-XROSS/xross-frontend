import { useLogout as useCoreLogout } from '@xross/core/hooks/useLogout';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { removeFcmTokenApi } from '@xross/core/api/auth';
import { getStoredFCMToken } from '@/shared/lib/firebase/fcm';

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  return useCoreLogout({
    clearAuth,
    onAfterLogout: () => navigate('/auth/login', { replace: true }),
    beforeLogout: async () => {
      const storedToken = getStoredFCMToken();
      if (storedToken) await removeFcmTokenApi(storedToken);
    },
  });
}
