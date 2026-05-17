import { useEffect } from 'react';
import { Platform } from 'react-native';
import {
  getMessaging,
  getToken,
  onMessage,
  onTokenRefresh,
  onNotificationOpenedApp,
  getInitialNotification,
  requestPermission,
  AuthorizationStatus,
  type FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { registerFcmTokenApi } from '@xross/core';
import { storage } from '../storage/mmkv';
import { navigationRef } from '@/app/navigation/RootNavigator';

const FCM_TOKEN_KEY = 'xross_fcm_token';
const messaging = getMessaging();

function navigateFromNotification(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
  const alertId = remoteMessage.data?.alertId ?? remoteMessage.data?.relatedEventId;
  if (alertId && navigationRef.isReady()) {
    navigationRef.navigate('AlertDetail', { id: Number(alertId) });
  }
}

async function requestPermissionFn() {
  if (Platform.OS === 'ios') {
    const authStatus = await requestPermission(messaging);
    return (
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL
    );
  }
  return true;
}

async function displayForegroundNotification(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) {
  await notifee.requestPermission();
  const channelId = await notifee.createChannel({
    id: 'xross-alerts',
    name: 'Xross 이상 감지 알림',
    importance: AndroidImportance.HIGH,
  });
  await notifee.displayNotification({
    title: remoteMessage.notification?.title ?? 'Xross 알림',
    body: remoteMessage.notification?.body ?? '',
    android: { channelId, pressAction: { id: 'default' } },
    ios: { sound: 'default' },
    data: remoteMessage.data,
  });
}

async function registerTokenFn() {
  try {
    // iOS 시뮬레이터에서는 APNs 미지원 → 실제 기기에서만 토큰 발급됨
    const token = await getToken(messaging);
    if (!token) return;
    const stored = storage.getString(FCM_TOKEN_KEY);
    if (stored === token) return;
    await registerFcmTokenApi(token);
    storage.set(FCM_TOKEN_KEY, token);
  } catch (e) {
    if (__DEV__) console.warn('[FCM] token 등록 실패:', e);
  }
}

export function useFCMSetup() {
  useEffect(() => {
    let unsubForeground: (() => void) | undefined;
    let unsubTokenRefresh: (() => void) | undefined;

    async function setup() {
      const granted = await requestPermissionFn();
      if (!granted) return;

      await registerTokenFn();

      unsubForeground = onMessage(messaging, async (remoteMessage) => {
        await displayForegroundNotification(remoteMessage);
      });

      unsubTokenRefresh = onTokenRefresh(messaging, async (token) => {
        try {
          await registerFcmTokenApi(token);
          storage.set(FCM_TOKEN_KEY, token);
        } catch (e) {
          if (__DEV__) console.warn('[FCM] token 갱신 실패:', e);
        }
      });
    }

    setup();
    return () => {
      unsubForeground?.();
      unsubTokenRefresh?.();
    };
  }, []);

  useEffect(() => {
    getInitialNotification(messaging).then((remoteMessage) => {
      if (remoteMessage) {
        setTimeout(() => navigateFromNotification(remoteMessage), 1000);
      }
    });
    const unsubscribe = onNotificationOpenedApp(messaging, navigateFromNotification);
    return () => unsubscribe();
  }, []);
}
