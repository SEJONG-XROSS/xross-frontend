import { createApiClient, setApiClient, getBaseURL } from '@xross/core';
import { useAuthStore } from '@/features/auth/store/auth.store';

// module-level 초기화 — 이 파일이 import될 때 한 번 실행
const client = createApiClient(import.meta.env.VITE_API_BASE_URL as string, {
  getAccessToken: () => useAuthStore.getState().accessToken,
  onUnauthorized: () => {
    useAuthStore.getState().clearAuth();
    window.location.replace('/auth/login');
  },
});

setApiClient(client);

/** SSE/WebRTC 등 raw URL 구성용 (useEventStream, useAlertStream에서 사용) */
export const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export { getBaseURL };
