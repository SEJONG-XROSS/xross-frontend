import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  storeId: number | null;
  setAuth: (token: string, storeId: number) => void;
  syncStoreId: (storeId: number) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem("xross_access_token"),
  storeId: Number(localStorage.getItem("xross_store_id")) || null,

  setAuth: (token, storeId) => {
    localStorage.setItem("xross_access_token", token);
    localStorage.setItem("xross_store_id", String(storeId));
    set({ accessToken: token, storeId });
  },

  syncStoreId: (storeId) => {
    localStorage.setItem("xross_store_id", String(storeId));
    set({ storeId });
  },

  clearAuth: () => {
    localStorage.removeItem("xross_access_token");
    localStorage.removeItem("xross_store_id");
    localStorage.removeItem("xross_fcm_token");
    set({ accessToken: null, storeId: null });
  },
}));
