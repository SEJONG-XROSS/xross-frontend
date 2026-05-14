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

const finalConfig = withNativeWind(config, { input: './src/styles/global.css' });

// expo/AppEntry.js의 `../../App` 해소 픽스
// node-linker=hoisted로 root/node_modules/expo/AppEntry.js가 실제 파일이 됨
// Expo CLI가 monorepo root 기준으로 기동되므로 `../../App`이 root/ 기준으로 해소됨
// → apps/mobile/App.tsx로 고정 (withNativeWind 이후에 설정해야 덮어씌워지지 않음)
finalConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === '../../App' &&
    context.originModulePath.endsWith('/node_modules/expo/AppEntry.js')
  ) {
    return { filePath: path.resolve(projectRoot, 'App.tsx'), type: 'sourceFile' };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = finalConfig;
