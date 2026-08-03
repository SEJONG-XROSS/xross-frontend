/** @type {import('tailwindcss').Config} */

// @xross/tokens의 색상 토큰 (packages/tokens/src/colors.ts 와 동일한 값 유지)
// TODO: packages/tokens에 CJS 빌드 추가 후 require('@xross/tokens/tailwind')로 대체
const xrossColors = {
  brand: {
    primary: '#155dfc',
    'primary-hover': '#1d4ed8',
    'primary-active': '#1e40af',
    accent: '#60a5fa',
    'on-primary': '#ffffff',
  },
  link: '#3b82f6',
  'link-hover': '#2563eb',
  surface: { page: '#f8fafc', elevated: '#ffffff' },
  sidebar: {
    border: '#334155',
    text: '#ffffff',
    subtitle: '#94a3b8',
    muted: '#64748b',
    footnote: '#475569',
  },
  feature: {
    border: 'rgba(255, 255, 255, 0.1)',
    bg: 'rgba(255, 255, 255, 0.05)',
    title: '#e2e8f0',
    desc: '#64748b',
    'icon-bg': 'rgba(43, 127, 255, 0.1)',
    icon: '#60a5fa',
  },
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
  dashboard: {
    title: '#1d293d',
    subtitle: '#62748e',
    'nav-inactive': '#45556c',
    'status-card-bg': '#f1f5f9',
    online: '#009966',
  },
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
  event: { critical: '#ff6467', warning: '#fe9a00', safe: '#00bc7d' },
  status: { success: '#10b981', text: '#94a3b8' },
};

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: xrossColors,
      // 웹(apps/web/src/styles/theme.css)과 동일한 타이포 스케일
      fontSize: {
        10: ['10px', '14px'],
        11: ['11px', '15px'],
        12: ['12px', '16px'],
        13: ['13px', '18px'],
        14: ['14px', '20px'],
        16: ['16px', '22px'],
        22: ['22px', '28px'],
      },
      // uppercase eyebrow/mono 라벨 전용 (웹 tracking-caps = 0.1em ≈ 1px @10px)
      letterSpacing: {
        caps: '1px',
      },
      // card(패널·카드) / control(버튼·입력) / badge(뱃지·칩)
      borderRadius: {
        card: '14px',
        control: '10px',
        badge: '6px',
      },
    },
  },
  plugins: [],
};
