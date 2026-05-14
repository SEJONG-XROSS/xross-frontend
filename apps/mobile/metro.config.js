const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// ── 모노레포 설정 ─────────────────────────────────────
config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// pnpm 심링크 지원 활성화
// expo/AppEntry.js가 apps/mobile/node_modules/expo (심링크)를 통해 접근 가능하게 함
config.resolver.unstable_enableSymlinks = true;

// expo/AppEntry.js 내부의 `../../App`은 pnpm 실제 경로 기준으로 해소되면 실패
// → 항상 apps/mobile/App.tsx로 리디렉트
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '../../App' && context.originModulePath.includes('/node_modules/expo/AppEntry')) {
    return { filePath: path.resolve(projectRoot, 'App.tsx'), type: 'sourceFile' };
  }
  return context.resolveRequest(context, moduleName, platform);
};

// ── SVG → React Native 컴포넌트 변환 ──────────────────
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};
config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg'],
};

module.exports = withNativeWind(config, { input: './src/styles/global.css' });
