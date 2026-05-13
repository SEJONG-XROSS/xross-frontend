/**
 * Xross 디자인 토큰 — 색상
 *
 * 이 객체는 NativeWind v4의 tailwind.config.js theme.colors에서 직접 사용됩니다.
 * 키 구조: { group: { variant: hex } } → 유틸 `bg-group-variant`
 *
 * Web(Tailwind v4)은 apps/web/src/styles/theme.css의 CSS 변수를 계속 사용하며,
 * 이 파일은 그 값들과 동일한 값을 TypeScript로 보유하는 단일 소스입니다.
 */
export const colors = {
  // ── Brand ──────────────────────────────────────
  brand: {
    primary: '#155dfc',
    'primary-hover': '#1d4ed8',
    'primary-active': '#1e40af',
    accent: '#60a5fa',
    'on-primary': '#ffffff',
  },

  link: '#3b82f6',
  'link-hover': '#2563eb',

  // ── Surfaces ────────────────────────────────────
  surface: {
    page: '#f8fafc',
    elevated: '#ffffff',
  },

  // ── Sidebar (로그인 좌측 패널) ──────────────────
  sidebar: {
    border: '#334155',
    text: '#ffffff',
    subtitle: '#94a3b8',
    muted: '#64748b',
    footnote: '#475569',
  },

  // ── Feature cards ───────────────────────────────
  feature: {
    border: 'rgba(255, 255, 255, 0.1)',
    bg: 'rgba(255, 255, 255, 0.05)',
    title: '#e2e8f0',
    desc: '#64748b',
    'icon-bg': 'rgba(43, 127, 255, 0.1)',
    icon: '#60a5fa',
  },

  // ── Typography / Form ───────────────────────────
  heading: '#0f172a',
  body: '#64748b',
  label: '#64748b',
  placeholder: '#94a3b8',
  muted: '#94a3b8',
  input: {
    border: '#e2e8f0',
    'border-email': '#dbeafe',
    focus: '#60a5fa',
    icon: '#94a3b8',
    'icon-hover': '#475569',
  },
  'checkbox-border': '#cbd5e1',

  // ── Dashboard ───────────────────────────────────
  dashboard: {
    title: '#1d293d',
    subtitle: '#62748e',
    'nav-inactive': '#45556c',
    'status-card-bg': '#f1f5f9',
    online: '#009966',
  },

  // ── Monitoring (dark canvas) ─────────────────────
  monitor: {
    bg: '#0f172b',
    'card-bg': '#020618',
    border: '#1d293d',
    'border-strong': '#314158',
    text: '#e2e8f0',
    'text-muted': '#90a1b9',
    'text-dim': '#62748e',
    'accent-blue': '#51a2ff',
    'accent-green': '#00d492',
    'accent-purple': '#c27aff',
  },

  // ── Event severity ───────────────────────────────
  event: {
    critical: '#ff6467',
    warning: '#fe9a00',
    safe: '#00bc7d',
  },

  // ── Status ──────────────────────────────────────
  status: {
    success: '#10b981',
    text: '#94a3b8',
  },
} as const;

export type Colors = typeof colors;
