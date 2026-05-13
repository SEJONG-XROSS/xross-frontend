import { create } from 'zustand';
import { storage } from '../storage/mmkv';

const ACCESS_TOKEN_KEY = 'xross_access_token';
const STORE_ID_KEY = 'xross_store_id';
const FCM_TOKEN_KEY = 'xross_fcm_token';

interface AuthState {
  accessToken: string | null;
  storeId: number | null;
  setAuth: (token: string, storeId: number) => void;
  syncStoreId: (storeId: number) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>(() => ({
  // MMKV는 동기 읽기 — Zustand 초기값에서 직접 사용 가능 (localStorage와 동일)
  accessToken: storage.getString(ACCESS_TOKEN_KEY) ?? null,
  storeId: (() => {
    const v = storage.getString(STORE_ID_KEY);
    return v != null ? Number(v) : null;
  })(),

  setAuth: (token, storeId) => {
    storage.set(ACCESS_TOKEN_KEY, token);
    storage.set(STORE_ID_KEY, String(storeId));
    useAuthStore.setState({ accessToken: token, storeId });
  },

  syncStoreId: (storeId) => {
    storage.set(STORE_ID_KEY, String(storeId));
    useAuthStore.setState({ storeId });
  },

  clearAuth: () => {
    storage.delete(ACCESS_TOKEN_KEY);
    storage.delete(STORE_ID_KEY);
    storage.delete(FCM_TOKEN_KEY);
    useAuthStore.setState({ accessToken: null, storeId: null });
  },
}));
