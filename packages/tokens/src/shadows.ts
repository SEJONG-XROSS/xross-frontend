/**
 * Xross 디자인 토큰 — 그림자
 *
 * css: Web의 box-shadow 값 (참조용)
 * rn:  React Native StyleSheet용 shadow props
 *      iOS: shadowColor/Offset/Opacity/Radius
 *      Android: elevation (근사값)
 */
export const shadows = {
  brand: {
    css: '0 0 20px rgba(59, 130, 246, 0.3)',
    rn: {
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 8,
    },
  },
  button: {
    css: '0 4px 15px rgba(59, 130, 246, 0.2)',
    rn: {
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 15,
      elevation: 6,
    },
  },
  status: {
    css: '0 0 6px rgba(16, 185, 129, 0.5)',
    rn: {
      shadowColor: '#10B981',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 6,
      elevation: 4,
    },
  },
} as const;

export type Shadows = typeof shadows;
