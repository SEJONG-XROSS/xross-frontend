<img width="1709" height="747" alt="image" src="https://github.com/user-attachments/assets/b8f943f7-3cfa-4931-ad30-4350c102bbac" />

# Xross Frontend

매장 모니터링 및 관리를 위한 프론트엔드 모노레포입니다.  
웹 대시보드와 모바일 앱으로 구성되며, CCTV 실시간 스트리밍, 이벤트 알림, POS 매출 분석 기능을 제공합니다.

---

## 구조

```
xross-frontend/
├── apps/
│   ├── web/          # 웹 대시보드 (React + Vite)
│   └── mobile/       # 모바일 앱 (React Native + Expo)
└── packages/
    ├── core/         # 공유 API, 타입, 훅, 비즈니스 로직
    ├── tokens/       # 디자인 토큰 (색상, 그림자, 그라디언트)
    └── tsconfig/     # 공유 TypeScript 설정
```

---

## 앱

### Web (`apps/web`)

관리자용 웹 대시보드. Vercel에 배포됩니다.

**스택**
- React 19, TypeScript, Vite
- Tailwind CSS v4
- TanStack Query v5
- Zustand
- React Router v7
- Recharts

**주요 기능**
- 실시간 CCTV 스트리밍 (WebRTC / MediaMTX)
- 이벤트 모니터링 및 알림 관리
- POS 매출 분석
- 매장 설정 관리

### Mobile (`apps/mobile`)

점주용 모바일 앱. iOS / Android 지원.

**스택**
- React Native 0.76, Expo 52, TypeScript
- NativeWind v4
- React Navigation v6
- TanStack Query v5
- Zustand
- Firebase (FCM 푸시 알림)
- EAS Build / Submit

**주요 기능**
- 실시간 CCTV 스트리밍 (WebRTC)
- 이벤트 알림 수신 및 상세 조회
- POS 매출 현황 확인
- 알림 설정

---

## 공유 패키지

### `@xross/core`

플랫폼 독립적인 공유 로직만 포함합니다.

```
src/
├── api/          # Axios 기반 API 클라이언트
├── types/        # 공유 타입 정의
├── hooks/        # 플랫폼 독립 커스텀 훅
├── queryKeys/    # TanStack Query 키 관리
├── business/     # 비즈니스 로직
├── mappers/      # API 응답 → 도메인 매핑
└── utils/        # 공통 유틸리티
```

### `@xross/tokens`

시맨틱 디자인 토큰. 웹과 모바일 모두에서 동일한 토큰 이름을 사용합니다.

---

## 시작하기

**요구 사항**
- Node.js >= 20
- pnpm >= 9

**설치**

```bash
pnpm install
```

**웹 개발 서버 실행**

```bash
pnpm dev:web
```

**모바일 개발 서버 실행**

```bash
cd apps/mobile
pnpm start          # Expo Metro 번들러
pnpm ios            # iOS 시뮬레이터
pnpm android        # Android 에뮬레이터
```

**빌드**

```bash
pnpm build          # 전체 빌드 (Turborepo)
pnpm build:web      # 웹만 빌드
```

**타입 검사 / 린트**

```bash
pnpm typecheck
pnpm lint
pnpm format
```

---

## 모바일 배포 (EAS)

```bash
# 개발 빌드
eas build --profile development --platform ios

# 프리뷰 빌드
eas build --profile preview --platform all

# 프로덕션 빌드 및 제출
eas build --profile production --platform all
eas submit
```

---

## 아키텍처 원칙

- **서버 상태** → TanStack Query (API 응답, 캐싱, 뮤테이션)
- **클라이언트 UI 상태** → Zustand (모달, 필터, 탭 상태)
- **스타일링** → 시맨틱 토큰 사용 필수, 하드코딩 금지 (`bg-monitor-bg`, `text-event-critical` 등)
- **공유 코드** → UI 컴포넌트는 공유하지 않음. 플랫폼 독립 로직만 `@xross/core`에 배치
