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

module.exports = withNativeWind(config, { input: './src/styles/global.css' });
