import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import {
  requestFCMToken,
  getStoredFCMToken,
  setupForegroundNotifications,
} from "./fcm";
import { registerFcmTokenApi } from "@/features/auth/api/auth.api";

export function useFCMSetup() {
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken) return;

    let unsubscribe: () => void;

    const initializeFCM = async () => {
      try {
        unsubscribe = await setupForegroundNotifications();

        const storedToken = getStoredFCMToken();
        const newToken = await requestFCMToken();
        if (!newToken) return;

        if (newToken !== storedToken) {
          await registerFcmTokenApi(newToken);
        }
      } catch (error) {
        console.error("Failed to initialize FCM:", error);
      }
    };

    initializeFCM();

    return () => unsubscribe?.();
  }, [accessToken]);
}
