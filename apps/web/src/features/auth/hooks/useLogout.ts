import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { removeFcmTokenApi } from "@/features/auth/api/auth.api";
import { getStoredFCMToken } from "@/shared/lib/firebase/fcm";

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return async () => {
    const storedToken = getStoredFCMToken();
    if (storedToken) {
      await removeFcmTokenApi(storedToken).catch(() => {});
    }

    clearAuth();
    queryClient.clear();
    navigate("/auth/login", { replace: true });
  };
}
