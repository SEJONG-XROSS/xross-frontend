module.exports = {
  presets: [
    ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
    'nativewind/babel',
  ],
  plugins: [
    ['module-resolver', { root: ['./src'], alias: { '@': './src' } }],
    'react-native-reanimated/plugin', // 반드시 마지막
  ],
};
