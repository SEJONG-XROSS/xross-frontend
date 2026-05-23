import { ExpoConfig, ConfigContext } from 'expo/config';
import { withDangerousMod } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

const withGoogleUtilitiesModularHeaders = (cfg: ExpoConfig): ExpoConfig =>
  withDangerousMod(cfg, [
    'ios',
    (c) => {
      const root = c.modRequest.platformProjectRoot;

      // GoogleUtilities modular headers
      const podfilePath = path.join(root, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');
      const line = "  pod 'GoogleUtilities', :modular_headers => true";
      if (!podfile.includes(line)) {
        podfile = podfile.replace("target 'Xross' do", `target 'Xross' do\n${line}`);
        fs.writeFileSync(podfilePath, podfile);
      }

      // iOS deployment target
      const propsPath = path.join(root, 'Podfile.properties.json');
      const props = JSON.parse(fs.readFileSync(propsPath, 'utf8'));
      if (props['ios.deploymentTarget'] !== '16.0') {
        props['ios.deploymentTarget'] = '16.0';
        fs.writeFileSync(propsPath, JSON.stringify(props, null, 2) + '\n');
      }

      return c;
    },
  ]);

export default ({ config }: ConfigContext): ExpoConfig =>
  withGoogleUtilitiesModularHeaders({
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
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.xross.mobile',
    googleServicesFile: './GoogleService-Info.plist',
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
    eas: {
      projectId: process.env.EAS_PROJECT_ID,
    },
  },
  plugins: [
    'expo-splash-screen',
    'expo-font',
    '@react-native-firebase/app',
    '@react-native-firebase/messaging',
  ],
});
