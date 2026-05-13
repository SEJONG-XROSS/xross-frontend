import { useQueryClient } from '@tanstack/react-query';

interface UseLogoutOptions {
  clearAuth: () => void;
  /** 로그아웃 후 로그인 화면으로 이동 — web: navigate, RN: navigation.reset */
  onAfterLogout: () => void;
  /** 로그아웃 전 실행 (FCM 토큰 해제 등 platform-specific 작업) */
  beforeLogout?: () => Promise<void>;
}

export function useLogout({ clearAuth, onAfterLogout, beforeLogout }: UseLogoutOptions) {
  const queryClient = useQueryClient();

  return async () => {
    if (beforeLogout) await beforeLogout().catch(() => {});
    clearAuth();
    queryClient.clear();
    onAfterLogout();
  };
}
