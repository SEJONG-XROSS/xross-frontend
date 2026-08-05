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

/**
 * EAS 프로젝트 ID. 동적 app config라 `eas init`이 자동으로 써넣지 못하므로 고정값으로 둔다.
 * (환경변수로 덮어쓰면 다른 EAS 프로젝트로 빌드 가능)
 */
const EAS_PROJECT_ID =
  process.env.EAS_PROJECT_ID ?? '11cf28ea-f025-4a21-bce3-951e4dc02d1c';

export default ({ config }: ConfigContext): ExpoConfig =>
  withGoogleUtilitiesModularHeaders({
  ...config,
  name: 'Xross',
  slug: 'xross-mobile',
  owner: 'yunhyoyeon',
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
    // 이 파일은 gitignore 대상이라 EAS 빌드 서버에 올라가지 않는다.
    // EAS에서는 file 타입 시크릿(GOOGLE_SERVICES_INFO_PLIST)이 내려받아진 경로를 사용.
    googleServicesFile:
      process.env.GOOGLE_SERVICES_INFO_PLIST ?? './GoogleService-Info.plist',
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
      projectId: EAS_PROJECT_ID,
    },
  },
  plugins: [
    'expo-splash-screen',
    'expo-font',
    '@react-native-firebase/app',
    '@react-native-firebase/messaging',
  ],
});
