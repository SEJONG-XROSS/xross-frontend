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

// ── 싱글톤 패키지 설정 (withNativeWind 전에 설정해야 함) ─────
// withNativeWind가 이 resolver를 originalResolver로 캡처해서 체이닝함
// → withNativeWind 후에 덮어쓰면 CSS 스타일 레지스트리 주입이 깨짐
const MONOREPO_SINGLETONS = new Set([
  'react',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  '@tanstack/react-query',
  'zustand',
]);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // react, react-query, zustand: monorepoRoot 실제 디렉토리로 단일 인스턴스 강제
  if (MONOREPO_SINGLETONS.has(moduleName)) {
    return context.resolveRequest(
      { ...context, originModulePath: path.join(monorepoRoot, '_') },
      moduleName,
      platform,
    );
  }

  // react-native-css-interop(NativeWind)의 react-native import →
  // apps/mobile 기준으로 리디렉트해 View 인스턴스 일치 보장
  if (
    moduleName === 'react-native' &&
    context.originModulePath.includes('react-native-css-interop')
  ) {
    return context.resolveRequest(
      { ...context, originModulePath: path.join(projectRoot, '_') },
      moduleName,
      platform,
    );
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

// withNativeWind: 위 resolver를 originalResolver로 캡처해서 CSS 스타일 주입 체인에 포함시킴
module.exports = withNativeWind(config, { input: './src/styles/global.css' });
