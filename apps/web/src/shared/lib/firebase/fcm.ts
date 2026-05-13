import { getToken, onMessage } from "firebase/messaging";
import { getMessagingInstance } from "./config";

const STORAGE_KEY = "xross_fcm_token";

export async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
      );
      console.log("Service Worker registered:", registration);
      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return null;
    }
  }
  return null;
}

export async function requestFCMToken(): Promise<string | null> {
  try {
    await registerServiceWorker();

    const messaging = await getMessagingInstance();
    if (!messaging) {
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied");
      return null;
    }

    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY as string;
    const currentToken = await getToken(messaging, { vapidKey });

    if (currentToken) {
      localStorage.setItem(STORAGE_KEY, currentToken);
      return currentToken;
    } else {
      console.warn("No FCM token available");
      return null;
    }
  } catch (error) {
    console.error("Failed to get FCM token:", error);
    return null;
  }
}

export function getStoredFCMToken(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export async function setupForegroundNotifications(): Promise<() => void> {
  try {
    const messaging = await getMessagingInstance();
    if (!messaging) {
      return () => {};
    }

    const unsubscribe = onMessage(messaging, (payload) => {
      const { title, message, priority } = payload.data ?? {};

      if (title && message) {
        new Notification(title, {
          body: message,
          icon: "/favicon.png",
          badge: "/favicon.png",
          tag: priority || "default",
        });
      }
    });

    return unsubscribe;
  } catch (error) {
    console.error("Failed to setup foreground notifications:", error);
    return () => {};
  }
}
