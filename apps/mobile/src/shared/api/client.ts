import { createApiClient, setApiClient, getBaseURL } from '@xross/core';
import { useAuthStore } from '../auth/store';

export { getBaseURL };

// NavigationContainerRef — P6에서 NavigationContainer ref와 연결
type ResetAction = { index: number; routes: { name: string }[] };
let _onUnauthorized: (() => void) | null = null;
export function setOnUnauthorized(fn: () => void) {
  _onUnauthorized = fn;
}

// module-level 초기화 — 이 파일 import 시 즉시 실행
const client = createApiClient(process.env.EXPO_PUBLIC_API_BASE_URL ?? '', {
  getAccessToken: () => useAuthStore.getState().accessToken,
  onUnauthorized: () => {
    useAuthStore.getState().clearAuth();
    // P6에서 navigation ref 연결 후 실제 라우팅으로 교체
    _onUnauthorized?.();
  },
});

setApiClient(client);
