/**
 * Xross 디자인 토큰 — 그라데이션
 *
 * Web: CSS linear-gradient 값
 * RN:  expo-linear-gradient의 colors/locations 배열로 분해
 */
export const gradients = {
  loginSidebar: {
    css: 'linear-gradient(119deg, rgb(29, 41, 61) 0%, rgb(15, 23, 43) 50%, rgb(0, 0, 0) 100%)',
    rn: {
      colors: ['rgb(29, 41, 61)', 'rgb(15, 23, 43)', 'rgb(0, 0, 0)'] as const,
      locations: [0, 0.5, 1] as const,
      /** degrees → expo-linear-gradient의 start/end 좌표로 변환 */
      start: { x: 0, y: 0 } as const,
      end: { x: 1, y: 1 } as const,
    },
  },
} as const;

export type Gradients = typeof gradients;
