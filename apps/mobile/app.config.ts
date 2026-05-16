import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Xross',
  slug: 'xross-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  newArchEnabled: true,
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#0f172b',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.xross.mobile',
    infoPlist: {
      NSCameraUsageDescription: 'CCTV 스트리밍에 필요합니다.',
      NSMicrophoneUsageDescription: 'CCTV 스트리밍에 필요합니다.',
      // HTTP(비 HTTPS) 서버 허용 — API 서버가 http:// 를 사용하는 경우
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: true,
      },
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0f172b',
    },
    package: 'com.xross.mobile',
    permissions: ['CAMERA', 'RECORD_AUDIO'],
  },
  extra: {
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
    mediamtxBaseUrl: process.env.EXPO_PUBLIC_MEDIAMTX_BASE_URL,
  },
  plugins: [
    'expo-splash-screen',
    'expo-font',
    // P13에서 RN Firebase 설정 후 활성화
    // '@react-native-firebase/app',
    // '@react-native-firebase/messaging',
  ],
});
