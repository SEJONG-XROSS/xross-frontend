/**
 * NativeWind v4 / Tailwind v3 용 theme.colors 객체
 *
 * apps/mobile/tailwind.config.js 에서:
 *   const { xrossColors } = require('@xross/tokens/tailwind');
 *   module.exports = { theme: { extend: { colors: xrossColors } } };
 *
 * apps/web은 Tailwind v4 CSS(@theme inline) 방식을 그대로 사용하므로
 * 이 파일은 mobile 전용입니다.
 */
import { colors } from './colors';

export const xrossColors = colors;
