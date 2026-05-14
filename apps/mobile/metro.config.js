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

// 싱글톤 패키지 강제 단일 인스턴스
// extraNodeModules는 node_modules 내부 import에 미적용 → resolveRequest로 처리
// packages/core가 자체 node_modules를 가져도 항상 apps/mobile 기준으로 해소
const SINGLETONS = new Set([
  'react',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  '@tanstack/react-query',
  'zustand',
]);

finalConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  // expo/AppEntry.js의 ../../App 픽스
  if (
    moduleName === '../../App' &&
    context.originModulePath.endsWith('/node_modules/expo/AppEntry.js')
  ) {
    return { filePath: path.resolve(projectRoot, 'App.tsx'), type: 'sourceFile' };
  }

  // 싱글톤 패키지: 항상 monorepoRoot/node_modules (실제 디렉토리) 기준으로 해소
  // apps/mobile/node_modules/react는 .pnpm 심링크 → monorepoRoot는 real dir
  // 두 경로를 Metro가 다른 모듈로 취급하는 문제 방지
  if (SINGLETONS.has(moduleName)) {
    return context.resolveRequest(
      { ...context, originModulePath: path.join(monorepoRoot, '_') },
      moduleName,
      platform,
    );
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = finalConfig;
