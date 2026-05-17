import { registerRootComponent } from 'expo';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import App from './App';

// 백그라운드/종료 상태에서 FCM 메시지 수신 처리
setBackgroundMessageHandler(getMessaging(), async (remoteMessage) => {
  if (__DEV__) console.log('[FCM] Background message:', remoteMessage);
});

registerRootComponent(App);
