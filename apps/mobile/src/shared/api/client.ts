import { createApiClient, setApiClient, getBaseURL } from '@xross/core';
import { useAuthStore } from '../auth/store';

export { getBaseURL };

let _onUnauthorized: (() => void) | null = null;
export function setOnUnauthorized(fn: () => void) {
  _onUnauthorized = fn;
}

const client = createApiClient(process.env.EXPO_PUBLIC_API_BASE_URL ?? '', {
  getAccessToken: () => useAuthStore.getState().accessToken,
  onUnauthorized: () => {
    useAuthStore.getState().clearAuth();
    _onUnauthorized?.();
  },
});

// 개발 환경 네트워크 로깅
if (__DEV__) {
  client.interceptors.request.use((config) => {
    const fullURL = `${config.baseURL ?? ''}${config.url ?? ''}`;
    console.log(`→ [${config.method?.toUpperCase()}] ${fullURL}`, config.params ?? '');
    return config;
  });

  client.interceptors.response.use(
    (res) => {
      const data = Array.isArray(res.data)
        ? `[${res.data.length}건]`
        : JSON.stringify(res.data).slice(0, 200);
      console.log(`← ${res.status} ${res.config.url}\n   ${data}`);
      return res;
    },
    (err) => {
      // core 인터셉터가 변환한 에러에서 보존된 정보 + 원래 axios 에러 정보 모두 확인
      const status = err.status ?? err.response?.status;
      const code = err.axiosCode ?? err.code ?? '(no code)';
      const url = err.axiosUrl ?? `${err.config?.baseURL ?? ''}${err.config?.url ?? '(url unknown)'}`;
      const label = status ? `HTTP ${status}` : `NET_ERR ${code}`;
      console.warn(`✗ [${label}] ${url}`, err.message);
      return Promise.reject(err);
    },
  );
}

setApiClient(client);
