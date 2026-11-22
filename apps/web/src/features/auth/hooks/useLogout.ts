import { useLogout as useCoreLogout } from '@xross/core/hooks/useLogout';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useMonitoringUiStore } from '@/features/monitoring/store/monitoringUi.store';
import { usePosFilterStore } from '@/features/pos/store/posFilter.store';
import { removeFcmTokenApi } from '@xross/core/api/auth';
import { getStoredFCMToken } from '@/shared/lib/firebase/fcm';

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  return useCoreLogout({
    // 서버 상태는 core 훅이 queryClient.clear()로 비우고,
    // 화면 상태는 여기서 초기화해 다음 로그인 계정에 필터·탭이 남지 않게 한다.
    clearAuth: () => {
      clearAuth();
      usePosFilterStore.getState().resetFilters();
      useMonitoringUiStore.getState().resetMonitoringUi();
    },
    onAfterLogout: () => navigate('/auth/login', { replace: true }),
    beforeLogout: async () => {
      const storedToken = getStoredFCMToken();
      if (storedToken) await removeFcmTokenApi(storedToken);
    },
  });
}
