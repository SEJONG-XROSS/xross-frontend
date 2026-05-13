Xross — React Web → React Native 마이그레이션 계획

Context

xross-frontend는 무인점포 실시간 관제 어드민(React 19 + Vite + React Router 7 +
TanStack Query 5 + Zustand 5 + Tailwind v4)입니다.
요구사항은 다음과 같습니다.

- 점주(매장 관리자)용 모바일 앱(React Native)으로 이식.
- UI/UX 흐름 및 비즈니스 로직 유지.
- 추후 Web ↔ RN 간 로직 공유 가능한 구조.
- 실 서비스 수준 아키텍처(타입/상태/서버상태/네비게이션 분리,
  푸시·WebRTC·실시간 스트림 안정성 포함).

본 계획서는 (1) 현재 코드 구조 분석, (2) RN 마이그레이션 위험 요소 매핑, (3)
모노레포 기반 공유 전략, (4) RN 앱 초기 구조, (5) 페이지별 포팅
우선순위·계획까지 단계적으로 진행하기 위한 청사진입니다.

---

STEP 1. 현재 React 프로젝트 구조 분석

1.1 의존성 (web-only / 공유가능 표시)

┌──────────────────────┬───────────┬──────────────────────────────────────┐
│ 패키지 │ 역할 │ RN 호환성 │
├──────────────────────┼───────────┼──────────────────────────────────────┤
│ react 19 / react-dom │ Core │ react만 공유, react-dom은 제거 │
│ 19 │ │ │
├──────────────────────┼───────────┼──────────────────────────────────────┤
│ react-router 7 │ 라우팅 │ 불가 → @react-navigation/native │
├──────────────────────┼───────────┼──────────────────────────────────────┤
│ @tanstack/react-quer │ 서버상태 │ ✅ 그대로 │
│ y 5 │ │ │
├──────────────────────┼───────────┼──────────────────────────────────────┤
│ zustand 5 │ 클라이언 │ ✅ 그대로 (storage만 교체) │
│ │ 트 상태 │ │
├──────────────────────┼───────────┼──────────────────────────────────────┤
│ firebase (web │ FCM │ 불가 → @react-native-firebase/{app,m │
│ messaging) │ │ essaging} + notifee │
├──────────────────────┼───────────┼──────────────────────────────────────┤
│ recharts │ 차트 │ 불가 → react-native-gifted-charts │
│ │ │ (Area+gradient 유사) │
├──────────────────────┼───────────┼──────────────────────────────────────┤
│ tailwindcss v4 + │ 스타일 │ 불가 → nativewind v4 │
│ @tailwindcss/vite │ │ │
├──────────────────────┼───────────┼──────────────────────────────────────┤
│ clsx + │ className │ clsx ✅ / twMerge는 NativeWind 사용 │
│ tailwind-merge │ 유틸 │ 시 일부 동작 │
├──────────────────────┼───────────┼──────────────────────────────────────┤
│ vite-plugin-svgr │ SVG → │ 불가 → react-native-svg + │
│ │ React │ react-native-svg-transformer │
└──────────────────────┴───────────┴──────────────────────────────────────┘

1.2 라우팅 (src/app/routes.tsx)

/auth/login, /auth/forgot-password (AuthLayout)
/ → /monitoring (redirect)
/monitoring (Monitoring 메인)
/monitoring/alerts/:id (Alert Detail)
/monitoring/events/:id (Event Detail)
/pos (POS 내역)
/settings → /settings/account|notification|store|system (중첩 탭)

-                                   → /auth/login

ProtectedRoute가 useAuthStore.accessToken 유무로 가드. useMe()로 me 동기화.

1.3 폴더 구조 (요약)

src/
app/ # App.tsx, routes.tsx
main.tsx # createRoot + Providers
styles/ # theme.css(@theme inline), index.css,
fonts.css
assets/icons/\*.svg # vite-plugin-svgr (?react)
shared/
lib/api.ts # fetch + 401 핸들링 (window.location.replace)
lib/utils.ts # cn() = clsx + twMerge
lib/date.ts # toLocaleDateString("en-CA") 등
lib/firebase/{config,fcm,useFCMSetup}.ts # 전부 Web FCM 전용
hooks/useMediaQuery.ts # window.matchMedia
layouts/{RootLayout,AuthLayout}.tsx # 데스크톱 사이드바 + 모바일
BottomNav
ui/{Sidebar,BottomNav,Input,BrandLogo,SystemStatusCard,CalendarGrid}.tsx
components/WebRTCVideoPlayer.tsx # 브라우저 RTCPeerConnection /
WHEP
hooks/useClickOutside.ts # document.addEventListener — RN 불요
features/
auth/ {api, components, hooks, lib(queryKeys), pages, store}
monitoring/ {api(types/impl), components, data, hooks,
lib(mappers,queryKeys), pages, types}
pos/ {api(types/impl), components, data, hooks,
lib(mappers,queryKeys), pages, types}
setting/ {components, pages} # API 미연동, 더미 UI

1.4 핵심 데이터 흐름

- API 클라이언트 (shared/lib/api.ts): fetch 기반,
  useAuthStore.getState().accessToken 직접 읽음. 401 시
  window.location.replace("/auth/login") — 브라우저 의존.
- 실시간 스트림 (useEventStream, useAlertStream): fetch(url, { signal }) →
  response.body.getReader()로 SSE 파싱. 오늘 날짜는 SSE, 과거는 폴링.
  response.body.getReader()는 Hermes에서 미지원 → RN에서는
  react-native-sse(EventSource 폴리필) 사용 필요.
- WebRTC 영상 (WebRTCVideoPlayer): WHEP(WebRTC-HTTP Egress Protocol) 직접 구현.
  OPTIONS로 ICE 서버 받고, RTCPeerConnection + addTransceiver(recvonly) + <video
  srcObject>. RN은 react-native-webrtc + RTCView로 재구현 필요.
- 푸시 (useFCMSetup): 서비스 워커 등록 → getToken → 백엔드 POST
  /auth/fcm-token. RN은 @react-native-firebase/messaging로 토큰 발급, 같은
  엔드포인트에 등록.
- 저장소: localStorage에 xross_access_token, xross_store_id, xross_fcm_token
  저장 (Zustand 초기값에서 동기 읽기).

  1.5 디자인 토큰 (src/styles/theme.css)

:root 에 --xross-_ CSS 변수, @theme inline으로 Tailwind 유틸로 노출.
색상군: brand-_, surface-_, sidebar-_, dashboard-_, monitor-_,
event-{critical|warning|safe}, feature-_, input-_ 등 40+ 토큰.
이 토큰은 플랫폼 비종속 객체로 추출 가능(이름이 곧 시멘틱).

---

STEP 2. RN 마이그레이션 전략

2.1 공유 가능 영역 (Web ↔ RN 100%/거의 그대로)

영역: 도메인 타입
현재 위치: features/_/types/_.types.ts, features/_/api/_.types.ts
이동 위치: packages/core/types/
────────────────────────────────────────
영역: API 클라이언트 인터페이스/엔드포인트 함수
현재 위치: features/_/api/_.api.ts (fetch 직호출 부분 제외)
이동 위치: packages/core/api/
────────────────────────────────────────
영역: Mapper (DTO → ViewModel)
현재 위치: features/_/lib/mappers.ts
이동 위치: packages/core/mappers/
────────────────────────────────────────
영역: QueryKeys
현재 위치: features/_/lib/queryKeys.ts
이동 위치: packages/core/queryKeys/
────────────────────────────────────────
영역: TanStack Query 훅 (useEvent, useEvents, useAlerts, useEventDetails,
usePosTransactions, useMe, …)
현재 위치: features/_/hooks/_.ts
이동 위치: packages/core/hooks/
────────────────────────────────────────
영역: 비즈니스 로직 (severity 계산, summary 계산, 필터/정렬)
현재 위치: 일부 페이지 내부에 인라인 (MonitoringPage.buildStats/buildChartData,

PosPage.filterTransactions)
이동 위치: packages/core/business/ 로 추출
────────────────────────────────────────
영역: 날짜 유틸 (getTodayStr, dayBounds, isToday, shiftDay, formatDateLabel)
현재 위치: shared/lib/date.ts
이동 위치: packages/core/utils/date.ts
────────────────────────────────────────
영역: 디자인 토큰 (색상/그림자)
현재 위치: styles/theme.css
이동 위치: packages/tokens/ (TS object)
────────────────────────────────────────
영역: 목 데이터
현재 위치: features/_/data/_.mock.ts
이동 위치: packages/core/mocks/ (옵션)

2.2 플랫폼 종속 영역 (각 앱별 별도 구현)

┌──────────────┬─────────────────────────────────┬─────────────────────────┐
│ 영역 │ Web │ RN │
├──────────────┼─────────────────────────────────┼─────────────────────────┤
│ │ react-router Routes/Outlet/NavL │ @react-navigation/nativ │
│ 라우팅 │ ink/useNavigate/useParams │ e, native-stack + │
│ │ │ bottom-tabs │
├──────────────┼─────────────────────────────────┼─────────────────────────┤
│ │ │ react-native-mmkv │
│ 저장소 │ localStorage │ (동기, Zustand 초기값에 │
│ │ │ 그대로 사용 가능) │
├──────────────┼─────────────────────────────────┼─────────────────────────┤
│ 네트워크 │ fetch │ axios + interceptor │
│ client │ │ (요구사항) │
├──────────────┼─────────────────────────────────┼─────────────────────────┤
│ 실시간 │ fetch().body.getReader() SSE │ react-native-sse │
│ 스트림 │ │ (EventSource 폴리필) │
├──────────────┼─────────────────────────────────┼─────────────────────────┤
│ 영상 │ 브라우저 RTCPeerConnection + │ react-native-webrtc + │
│ │ <video srcObject> │ RTCView │
├──────────────┼─────────────────────────────────┼─────────────────────────┤
│ │ │ @react-native-firebase/ │
│ 푸시 │ firebase/messaging + Service │ messaging + │
│ │ Worker │ notifee(또는 │
│ │ │ expo-notifications) │
├──────────────┼─────────────────────────────────┼─────────────────────────┤
│ 401 처리 │ window.location.replace │ Navigation reset to │
│ │ │ Auth stack │
├──────────────┼─────────────────────────────────┼─────────────────────────┤
│ │ │ NativeWind v4 (+ │
│ 스타일 │ Tailwind v4 + theme.css │ tokens.ts shared) 또는 │
│ │ │ StyleSheet │
├──────────────┼─────────────────────────────────┼─────────────────────────┤
│ │ │ react-native-svg + │
│ 아이콘 │ _.svg?react (svgr) │ react-native-svg-transf │
│ │ │ ormer (동일 svg 자산 │
│ │ │ 그대로 import) │
├──────────────┼─────────────────────────────────┼─────────────────────────┤
│ │ useMediaQuery("(min-width: │ 모바일 단일 │
│ 반응형 │ 1024px)") │ 폼팩터(태블릿만 분기) — │
│ │ │ useWindowDimensions │
├──────────────┼─────────────────────────────────┼─────────────────────────┤
│ useClickOuts │ document mousedown │ 불필요 (RN은 Pressable │
│ ide │ │ backdrop 패턴) │
├──────────────┼─────────────────────────────────┼─────────────────────────┤
│ 폼 │ <input> + e.preventDefault │ TextInput + │
│ │ │ onSubmitEditing │
├──────────────┼─────────────────────────────────┼─────────────────────────┤
│ 그라데이션/ │ Tailwind bg-gradient-to-_ │ expo-linear-gradient, │
│ 그림자 │ │ elevation/shadow\* │
├──────────────┼─────────────────────────────────┼─────────────────────────┤
│ 호버 │ hover: │ Pressable pressed 상태 │
├──────────────┼─────────────────────────────────┼─────────────────────────┤
│ │ │ react-native-gifted-cha │
│ 차트 │ recharts │ rts (Area+gradient │
│ │ │ 지원) │
└──────────────┴─────────────────────────────────┴─────────────────────────┘

2.3 모노레포 채택 — pnpm workspaces + Turborepo

채택 사유

- 도메인 타입이 Swagger 응답과 1:1 매칭 — 단일 소스 필수.
- mapper/queryKey/business 로직을 Web과 RN이 동일 파일로 공유해야 “유지보수 시
  로직 공유 가능”이라는 요구를 만족.
- 추후 apps/admin-web(시스템 관리자) 등 확장 시 동일 기반에서 출발 가능.

제안 구조

xross/ # 신규 monorepo 루트
(pnpm-workspace.yaml)
├── apps/
│ ├── web/ # 기존 xross-frontend 이전
│ │ └── src/...
│ └── mobile/ # 신규 RN(Expo prebuild) 앱
│ └── src/...
├── packages/
│ ├── core/ # 플랫폼 비종속 도메인 로직
│ │ ├── src/
│ │ │ ├── types/
│ │ │ │ ├── auth.ts
│ │ │ │ ├── monitoring.ts
│ │ │ │ ├── pos.ts
│ │ │ │ └── setting.ts
│ │ │ ├── api/
│ │ │ │ ├── client.ts # createApiClient({ baseUrl,
getToken, onUnauthorized })
│ │ │ │ ├── auth.api.ts
│ │ │ │ ├── monitoring.api.ts
│ │ │ │ └── pos.api.ts
│ │ │ ├── mappers/
│ │ │ ├── queryKeys/
│ │ │ ├── business/
│ │ │ │ ├── monitoring.ts # buildStats / buildChartData /
severity
│ │ │ │ └── pos.ts # filterTransactions /
buildPosSummary
│ │ │ ├── hooks/
│ │ │ │ ├── useEvents.ts
│ │ │ │ ├── useEvent.ts
│ │ │ │ ├── useEventDetails.ts
│ │ │ │ ├── useAlerts.ts
│ │ │ │ ├── useAlert.ts
│ │ │ │ ├── useStream.ts # SSE/Polling 어댑터 인터페이스
의존
│ │ │ │ ├── useLogin.ts
│ │ │ │ └── useMe.ts
│ │ │ ├── utils/date.ts
│ │ │ └── index.ts
│ │ └── package.json
│ ├── tokens/ # 디자인 토큰 (색/간격/타이포)
│ │ └── src/{colors,spacing,typography,shadows}.ts
│ └── tsconfig/ # base tsconfig 공유
├── pnpm-workspace.yaml
├── turbo.json # build/lint/typecheck 파이프라인
└── package.json

packages/core 의 외부 의존성 정책

- 허용: @tanstack/react-query, zustand (UI/플랫폼 비종속), axios (HTTP
  클라이언트 구현체) — 단, HTTP 호출은 인터페이스 추상화 후 구현체를 각 앱이
  주입.
- 금지: react-dom, react-router, react-native, next, Tailwind, recharts,
  Firebase Web SDK 등.

플랫폼 어댑터 패턴 (packages/core에서 정의, 각 앱에서 구현·주입)

// packages/core/src/api/client.ts
export interface AuthAdapter {
getAccessToken(): string | null;
onUnauthorized(): void; // web: window.location.replace, rn:
Navigation.reset
}
export interface StorageAdapter {
get(key: string): string | null;
set(key: string, value: string): void;
remove(key: string): void;
}
export interface StreamAdapter {
open(url: string, opts: { token: string; onMessage: (data: any) => void;
onError: (e: Error) => void }): () => void;
}

각 앱은 부팅 시 setAdapters({ auth, storage, stream })로 주입.

---

STEP 3. RN 프로젝트 초기 구조

3.1 Expo (prebuild + EAS) vs Bare RN CLI — Expo prebuild 채택

채택 사유

- 네이티브 모듈 필요: react-native-webrtc, @react-native-firebase/messaging,
  react-native-mmkv, notifee — Expo prebuild로 모두 가능(expo-modules-core 위에서
  react-native-webrtc plugin/config로 자동 링킹).
- EAS Build로 iOS/Android 빌드 CI 일원화 (사인키/프로비저닝 관리 단순화).
- Hermes, New Architecture 기본 활성화 — RN 0.74+ 최신 권장 설정 동기화 부담
  감소.
- expo-font, expo-splash-screen, expo-image, expo-linear-gradient,
  expo-secure-store(필요시) 등 RN CLI에서 일일이 셋업해야 하는 것들이 즉시 사용
  가능.
- 향후 OTA(Expo Updates)로 비즈니스 로직 핫픽스 가능(스토어 심사 없이
  mappers/business 로직 수정 배포).

제외 사유 (Expo Go vs RN CLI)

- Expo Go(매니지드, prebuild 없음): WebRTC/RN Firebase 네이티브 모듈 사용 불가
  → 부적합.
- 순수 RN CLI: Expo 모듈 생태계 미사용 + EAS 미사용으로 빌드 인프라 부담 증가.

  3.2 핵심 의존성

# Core (required by user)

@tanstack/react-query, zustand, axios, typescript

# Navigation

@react-navigation/native
@react-navigation/native-stack
@react-navigation/bottom-tabs
react-native-screens
react-native-safe-area-context

# UI / Style

nativewind (v4) + tailwindcss (v3.4 LTS, NativeWind 4 호환)
react-native-svg
react-native-svg-transformer # metro.config에서 svg를 컴포넌트로
expo-linear-gradient
react-native-reanimated
react-native-gesture-handler

# Data / RT / Media

react-native-mmkv # localStorage 대체 (동기)
react-native-sse # SSE 폴리필
react-native-webrtc # WHEP 클라이언트
react-native-gifted-charts # Recharts AreaChart 대체

# Push

@react-native-firebase/app
@react-native-firebase/messaging
@notifee/react-native # foreground notification UI

# Misc

react-native-keyboard-controller # 키보드 대응
@shopify/flash-list # 대량 리스트(이벤트 로그) FlatList 대체

3.3 폴더 구조 (apps/mobile)

apps/mobile/
├── app.config.ts # Expo 설정 (icon/splash/plugins)
├── babel.config.js # nativewind, reanimated plugin
├── metro.config.js # svg transformer, monorepo
nodeModulesPaths
├── tsconfig.json # paths: "@/_" -> "src/_", "@core/_" ->
"../../packages/core/src/_"
├── src/
│ ├── app/
│ │ ├── App.tsx # Providers + RootNavigator
│ │ ├── providers/
│ │ │ ├── QueryProvider.tsx
│ │ │ ├── SafeAreaProvider.tsx (re-export)
│ │ │ └── AdaptersProvider.tsx # core에 어댑터 주입
│ │ └── navigation/
│ │ ├── RootNavigator.tsx # Auth Stack ↔ Main Tabs 분기
│ │ ├── AuthStack.tsx
│ │ ├── MainTabs.tsx
│ │ └── MonitoringStack.tsx
│ ├── features/
│ │ ├── auth/screens/{LoginScreen,ForgotPasswordScreen}.tsx
│ │ ├── monitoring/
│ │ │ ├──
screens/{MonitoringScreen,AlertDetailScreen,EventDetailScreen}.tsx
│ │ │ └── components/{CameraGrid,CameraFeedCard,AnalyticsPanel,AnalyticsC
hart,EventLogPanel,EventCard,WebRTCView}.tsx
│ │ ├── pos/screens/PosScreen.tsx
│ │ └── setting/screens/{SettingScreen,AccountTab,NotificationTab,StoreTab,
SystemTab}.tsx
│ ├── shared/
│ │ ├── ui/ # Button, TextField(Input 포팅), Badge,
Card 등
│ │ ├── icons/ # svg 자산 + 변환 컴포넌트
│ │ ├── theme/ # tokens → NativeWind theme + StyleSheet
helpers
│ │ ├── storage/mmkv.ts
│ │ ├── api/axiosClient.ts # core 의 createApiClient 주입체
│ │ ├── stream/sse.ts # core 의 StreamAdapter 구현
│ │ ├── push/fcm.ts # RN Firebase 등록 + notifee 표시
│ │ └── auth/store.ts # zustand + mmkv
│ └── env/
│ └── index.ts # process.env.EXPO*PUBLIC*_ 검증
└── assets/
├── icons/_.svg # web과 동일 자산 — 가능하면
packages/icons로 통합
├── fonts/
├── icon.png / adaptive-icon.png
└── splash.png

3.4 부팅 트리

 <SafeAreaProvider>
   <GestureHandlerRootView>
     <KeyboardProvider>
       <QueryClientProvider>
         <AdaptersProvider>           // core에 axios/mmkv/sse/auth 어댑터 주입
           <NavigationContainer>
             <RootNavigator />        // auth.accessToken으로 분기
           </NavigationContainer>
         </AdaptersProvider>
       </QueryClientProvider>
     </KeyboardProvider>
   </GestureHandlerRootView>
 </SafeAreaProvider>

3.5 환경 변수

- .env(EAS Secrets로도 주입): EXPO_PUBLIC_API_BASE_URL,
  EXPO_PUBLIC_MEDIAMTX_BASE_URL.
- Firebase: google-services.json / GoogleService-Info.plist → app.config.ts의
  extra + expo-build-properties / RN Firebase config.
- VAPID 키는 RN에서 불필요(웹 전용).

  3.6 폰트 / 아이콘 / 스플래시

- 폰트: expo-font + useFonts (기존 fonts.css에 적힌 패밀리를 ttf로 번들).
- 아이콘: react-native-svg-transformer로 \*.svg를 컴포넌트 import. 색은
  fill="currentColor" 자산에 한해 prop으로 주입.
- 앱 아이콘: assets/icon.png (1024×1024), Android adaptive icon, iOS 다양한
  크기는 EAS가 자동 생성.
- 스플래시: expo-splash-screen + assets/splash.png.
  SplashScreen.preventAutoHideAsync() → me 쿼리 완료 후 hide.

---

STEP 4. 페이지별 변환 우선순위·계획

페이지별로 “계획 제시 → 사용자 승인 → 구현” 사이클로 진행합니다.

┌──────┬─────────────────────────────┬─────────────────────────────────────┐
│ 순서 │ 화면 │ 이유 │
├──────┼─────────────────────────────┼─────────────────────────────────────┤
│ │ │ 모든 화면의 게이트. │
│ 1 │ LoginScreen (/auth/login) │ 인증·MMKV·axios·navigation 흐름 │
│ │ │ 검증 가능. │
├──────┼─────────────────────────────┼─────────────────────────────────────┤
│ │ MonitoringScreen │ 점주의 핵심 가치(실시간 알림+CCTV). │
│ 2 │ (/monitoring 모바일 탭) │ SSE/WebRTC/FlashList/Chart 등 RN │
│ │ │ 난제 전부 포함. │
├──────┼─────────────────────────────┼─────────────────────────────────────┤
│ 3 │ AlertDetailScreen │ 푸시 알림 딥링크의 도착점. │
│ │ (/monitoring/alerts/:id) │ 푸시→네비게이션 검증. │
├──────┼─────────────────────────────┼─────────────────────────────────────┤
│ 4 │ EventDetailScreen │ EventCCTVPlayer + 검증 리스트. │
│ │ (/monitoring/events/:id) │ AlertDetail과 컴포넌트 공유. │
├──────┼─────────────────────────────┼─────────────────────────────────────┤
│ │ │ 트랜잭션 테이블 → RN은 카드 │
│ 5 │ PosScreen │ 리스트(FlatList)로 재구성. 모바일 │
│ │ │ 사고방식 적용 첫 사례. │
├──────┼─────────────────────────────┼─────────────────────────────────────┤
│ 6 │ SettingScreen + Tabs │ 데이터 변동 적고 폼 위주. 키보드 │
│ │ │ 대응·SafeArea 학습 끝낸 후 진행. │
└──────┴─────────────────────────────┴─────────────────────────────────────┘

4.1 LoginScreen (1순위) — 변환 계획

- 컴포넌트: LoginForm → LoginScreen (단일 화면).
- 입력: <Input> → TextField(TextInput 기반, 비밀번호 보기 토글, clear 버튼).
  web의 Object.getOwnPropertyDescriptor(HTMLInputElement, "value") 트릭은 삭제 —
  RN은 setText("")로 충분.
- 폼: <form onSubmit> 제거. 제출 버튼 onPress + 마지막 필드 onSubmitEditing
  체이닝.
- 키보드: KeyboardAvoidingView(iOS) + react-native-keyboard-controller로 입력
  영역 자동 스크롤.
- 좌측 브랜딩 패널(AuthLayout left aside): 모바일에선 삭제. 상단
  로고+서브타이틀+FeatureCard 3개를 세로 스택으로.
- 라우팅: 성공 시 navigation.reset({ index: 0, routes: [{ name: 'Main' }] }).
  useNavigate("/monitoring") 대체.
- 비밀번호 찾기 <a href> → Pressable + navigation.navigate('ForgotPassword').
- 사용 훅: @core/hooks/useLogin 그대로 (TanStack mutation은 동일).

  4.2 MonitoringScreen (2순위) — 변환 계획

- 데스크톱 분기(useMediaQuery) 제거. 모바일 단일 레이아웃, 태블릿은
  useWindowDimensions 기준 1024+에서만 좌우 분할 옵션 검토(우선순위 후순위).
- 상단 탭(관제/탐지 로그) 유지. Material Top Tab 대신 페이지 내부 useState로
  충분(현재 web 구현과 동일).
- MonitoringHeader: 날짜 선택은 web의 커스텀 CalendarGrid 대신
  @react-native-community/datetimepicker(네이티브) 또는 RN용 캘린더 라이브러리로
  단순화.
- CameraGrid:
  - 모바일은 현재 web도 카루셀 1개씩(MobileCarousel). 그대로 RN으로
    포팅(FlatList horizontal pagingEnabled + 도트 인디케이터).
  - 데스크톱 그리드는 태블릿 한정으로 후순위.
- CameraFeedCard:
  - <video> → react-native-webrtc의 RTCView 래핑한 WebRTCView 컴포넌트.
  - 상단 오버레이는 absolute 포지셔닝 동일 + expo-linear-gradient.
- AnalyticsPanel/AnalyticsChart:
  - Recharts AreaChart + gradient + Tooltip → react-native-gifted-charts
    LineChart(area=true, startFillColor/endFillColor로 gradient). Tooltip은
    라이브러리 기본 또는 제스처 기반 커스텀.
- EventLogPanel:
  - 현재 map() 렌더. RN에선 FlashList(@shopify/flash-list)로 교체 — 100+
    알림에서 부드러운 스크롤 보장. estimatedItemSize 지정.
  - EventCard navigate(...) → navigation.navigate('AlertDetail', { id }).
- 실시간 스트림(useEventStream/useAlertStream):
  - packages/core/hooks/useStream.ts로 추출 + StreamAdapter 주입.
  - RN 구현체: react-native-sse 사용 (new EventSource(url, { headers: {
    Authorization } })).
  - 폴링 분기(과거 날짜)는 그대로 — setInterval 동작 동일.
- 포커스 처리: useFocusEffect로 화면 비활성 시 스트림 일시정지(배터리/네트워크
  절약).

  4.3 AlertDetailScreen / EventDetailScreen (3·4순위)

- 헤더(EventDetailHeader) 뒤로가기: navigation.goBack().
- 본문 좌우 2분할(web) → 모바일은 세로 스택(CCTV 위, 정보 패널 아래).
- 타임라인 컴포넌트(EventTimelineEntry): 점·연결선 div → View + absolute. 변환
  부담 낮음.
- WebRTC 영상: MonitoringScreen에서 추출한 WebRTCView 재사용.
- 푸시 알림에서 도착 시: notifee onForegroundEvent / RN Firebase
  setBackgroundMessageHandler에서 relatedEventId/alertId 파싱 후
  navigation.navigate('AlertDetail', { id }).

  4.4 PosScreen (5순위)

- web 테이블 → 모바일 카드 리스트(FlashList). 컬럼이 많아 모바일 테이블 비효율.
- 검색바: TextInput + 디바운스(useDeferredValue 또는 setTimeout). web의
  PosSearchBar.PosFilters는 그대로 재사용.
- 날짜 범위: 단일 날짜만 우선 지원(monitoring 캘린더 재사용), 범위는 후순위.
- 필터 드롭다운(FilterDropdown): RN에선 @gorhom/bottom-sheet로 시트 형태
  권장(모바일 UX 친화).
- 페이지 내 filterTransactions 인라인 → @core/business/pos.ts로 추출.

  4.5 SettingScreen + Tabs (6순위)

- Outlet + 중첩 라우트(/settings/account|notification|store|system) → Material
  Top Tab(@react-navigation/material-top-tabs) 또는 페이지 상단 세그먼트 컨트롤.
- ToggleSwitch → RN Switch.
- AccountTab의 useEffect로 me → state 동기화는 안티패턴. useMe() 데이터를
  그대로 form initialValues로 쓰는 controlled form 패턴(react-hook-form 또는 단순
  useState(() => mapMeToForm(me)))으로 교체. 저장은 updateProfileApi mutation
  추가.
- 로그아웃: useLogout에서 useNavigate(web) → navigation.reset({ routes: [{
  name: 'Auth' }] })로 어댑터화. core에서는 onAfterLogout() 콜백 받음.

---

RN 마이그레이션 시 위험 요소 (우선 정리)

CRITICAL (반드시 재작성 필요)

1.  SSE 구현 — useEventStream/useAlertStream가 response.body.getReader() 사용.
    Hermes/RN의 fetch는 ReadableStream 미지원. → react-native-sse 폴리필 + core에
    StreamAdapter 추상화.
2.  WebRTC WHEP — WebRTCVideoPlayer가 브라우저 전용 API(RTCPeerConnection,
    MediaStream, srcObject) 사용. → react-native-webrtc로 동일 흐름 재구현. <video>
    대신 RTCView streamURL={stream.toURL()}. OPTIONS ICE 서버 파싱은 그대로 가능.
    음성 트랙(addTransceiver("audio")) RN 권한 확인 필요.
3.  Recharts — DOM SVG 기반. RN 동작 불가. → react-native-gifted-charts 또는
    victory-native@xl 채택. Area + 듀얼 라인 + gradient 모두 gifted-charts에서
    지원.
4.  FCM Web SDK + Service Worker — firebase/messaging, navigator.serviceWorker,
    Notification API 모두 RN 미지원. → @react-native-firebase/messaging로 전면
    재작성. firebase-messaging-sw.js 폐기. 백엔드 토큰 등록
    엔드포인트(/auth/fcm-token)는 동일하게 사용.

HIGH

5.  window.location.replace("/auth/login") in shared/lib/api.ts 401 처리 —
    RN에서 라우터 인스턴스에 접근하기 위해 core가 onUnauthorized() 콜백을 어댑터로
    받아야 함.
6.  localStorage 직접 사용 — auth.store.ts(3곳), fcm.ts(1곳). MMKV로 교체.
    Zustand 초기값 동기 읽기 유지하려면 MMKV가 필수(AsyncStorage는 비동기라 초기값
    불가).
7.  Tailwind v4 → NativeWind v4 — text-event-critical/76처럼 임의 opacity
    수정자, arbitrary value(text-[14px]), @theme inline 토큰 동기화 등 호환성 일부
    차이. 토큰을 packages/tokens로 추출하고 NativeWind tailwind.config.js에서
    import해 정합성 유지. 일부 셰도우/그라데이션은 RN 네이티브 prop으로 대체.
8.  useMediaQuery("(min-width: 1024px)") 데스크톱 분기 — MonitoringPage에 강하게
    박힘. 모바일에선 사용 안 함. 태블릿 대응은 후순위로 분리.
9.  react-router 전역 의존 — useNavigate, useParams, Navigate, NavLink, Outlet
    모두 RN 환경에서 동작 불가. 페이지 단위로 React Navigation으로 교체
    필요(컴포넌트 시그니처가 다름).

MEDIUM

10. SVG 아이콘 import 방식 — vite-plugin-svgr의 ?react 쿼리는 RN에서 무시됨.
    Metro에 react-native-svg-transformer 추가 후 import Icon from './foo.svg' 일반
    import. 자산은 그대로 재사용 가능.
11. document.addEventListener 사용 — hooks/useClickOutside.ts. RN에선 Pressable
    백드롭/Modal 패턴으로 대체. 호출처 검토 후 삭제.
12. toLocaleDateString("en-CA"), toLocaleTimeString("ko-KR", {...}) — RN의 Intl
    API는 Hermes에서 기본 비활성. iOS는 동작하지만 Android에서 결과 다를 수 있음 →
    Hermes intl 활성화(hermes-engine intl flag) 또는 dayjs/date-fns로 교체 권장.
    가장 안전한 길은 core 단에서 dayjs로 통일.
13. <input type="checkbox"> in LoginForm (로그인 유지) — RN은 Switch 또는
    커스텀 체크박스. 비즈니스 로직(로그인 유지)은 미구현 상태이므로 RN 포팅 시 기능
    자체 결정 필요.
14. <a href> 외부/내부 링크 — Linking.openURL 또는 navigation.navigate.
15. 호버 전용 스타일(hover:opacity-80 등) — RN은 hover 미지원. Pressable의 ({
    pressed }) => style로 대체. 안티패턴: hover 클래스를 그대로 옮기지 말 것.
16. CSS 그라데이션·shadow — bg-gradient-to-b from-black/80 to-transparent는
    expo-linear-gradient로 직접 컴포넌트화. shadow-[...] 임의값은 iOS shadow\* props

- Android elevation로 매핑(완벽 호환 불가).

17. useEffect에서 me → setState 동기화 (AccountTab) — RN으로 이전 시 안티패턴
    제거. 폼 상태를 useMe 데이터로 직접 파생.

LOW

18. 날짜 헬퍼(date.ts)는 그대로 동작(Intl 주의 사항 외).
19. Mapper 함수(순수 함수)는 그대로 동작.
20. 도메인 타입은 그대로 동작.
21. TanStack Query 훅은 그대로 동작.
22. Zustand는 그대로 동작(storage만 교체).
23. cn() 유틸 — NativeWind 사용 시 그대로 동작(twMerge가 RN 클래스도 처리).

확정된 의사결정

- (A) 모노레포: pnpm workspaces + Turborepo로 재구조화. 기존 xross-frontend/src
  → apps/web/src로 이동.
- (B) RN 베이스: Expo prebuild + EAS Build.
- (C) 스타일링: NativeWind v4 + packages/tokens 공유.
- (D) 차트: react-native-gifted-charts (Area + gradient).
- (E) 푸시: @react-native-firebase/messaging + @notifee/react-native.
- (F) 푸시 페이로드 호환: 백엔드 변경 없이 web FCM payload(data.title,
  data.message, data.priority)를 그대로 RN에서 처리.

---

실행 로드맵 (단계별 — 각 단계 사용자 승인 후 다음 진행)

▎ 사용자 요구: “절대 한번에 전체 코드 생성하지 말고, 분석 → 설계 → 단계별
▎ 구현.”
▎ 본 계획 승인 후, 아래 페이즈를 하나씩 진행합니다. 각 페이즈 종료 시 상태 보고
▎ + 다음 페이즈 착수 여부 확인.

- P0. 모노레포 골격화 — pnpm-workspace.yaml, turbo.json, tsconfig 공유, 루트
  package.json, apps/web 이전(코드 변경 없이 경로만), apps/web dev/build 동작
  확인.
- P1. packages/tokens 추출 — theme.css 값을 TS 객체로. web의 theme.css는 tokens
  import해 생성하도록 빌드 시점 검증.
- P2. packages/core 추출 — types/queryKeys/mappers/date-utils 이전. web 코드가
  @xross/core에서 import하도록 수정 후 web 빌드/타입체크 통과 확인.
- P3. createApiClient 도입 (axios) — core에 axios 기반 클라이언트 +
  AuthAdapter/StorageAdapter/StreamAdapter 인터페이스. web은 기존 fetch 동작을
  어댑터로 감싸 통과. 401/me/login/events/alerts/pos/event-details/fcm-token API
  전환.
- P4. core에 hooks 이전 — useMe/useLogin/useLogout(콜백 의존)/useEvents/useEven
  t/useEventDetails/useAlerts/useAlert/usePosTransactions/usePayment/useStream
  이전 + business 함수(buildStats, buildChartData, filterTransactions) 분리.
- P5. apps/mobile 골격 — Expo prebuild 앱 생성, NativeWind v4 설정, 절대경로
  alias, Metro svg transformer, MMKV, react-native-firebase 설치,
  app.config.ts(아이콘/스플래시 placeholder).
- P6. 네비게이션 + 어댑터 주입 — Root/Auth/Main 네비게이터, MMKV 기반 zustand
  auth store, axios client(401→Auth reset), react-native-sse 어댑터.
- P7. LoginScreen — @xross/core/useLogin 사용 + 키보드/SafeArea/네비게이션
  reset 검증.
- P8. MonitoringScreen —
  Header/CameraGrid(MobileCarousel)/AnalyticsPanel/EventLogPanel(FlashList) +
  차트 + SSE 연동.
- P9. WebRTCView — react-native-webrtc로 WHEP 클라이언트 재구현 +
  CameraFeedCard/EventCCTVPlayer에 적용.
- P10. AlertDetail / EventDetail Screen — 타임라인 + 검증 패널 + 액션 버튼.
- P11. PosScreen — 카드 리스트(FlashList), 검색/필터(BottomSheet) 적용.
- P12. Setting Screen + Tabs — Top tab navigator, 폼 안티패턴 정리(useEffect
  동기화 제거).
- P13. 푸시 + 딥링크 — @react-native-firebase/messaging + notifee, 백그라운드
  핸들러, 알림 탭 시 AlertDetail 라우팅, 백엔드 /auth/fcm-token 등록.
- P14. 환경/빌드 — .env(EXPO*PUBLIC*\*), google-services 자산, 아이콘/스플래시
  실제 자산, EAS 프로필(development, preview, production), 초기 internal 빌드
  1회.

진행 원칙 (코드 작성 시)

- useEffect 남용 금지: TanStack Query select/enabled/useQueries, useMemo, React
  Navigation useFocusEffect로 대체.
- 상태/서버상태 분리: 서버 데이터는 Query, 클라이언트 임시 상태는
  useState/Zustand. me→form 같은 동기화는 Query 데이터를 직접 파생 사용.
- 재사용 훅 구조 유지: 모든 데이터 훅은 packages/core/hooks에서 import. 화면은
  데이터를 받기만 함.
- 스타일 하드코딩 최소화: 모든 색·간격은 packages/tokens에서. 일회성 inline
  style={{ color: "#51a2ff" }} 제거.
- 성능: 100+ 항목 리스트는 FlashList, 화면 외 컴포넌트 React.memo, 콜백
  useCallback.
- RN 사고방식: 가로 분할 레이아웃·hover·테이블 등 모바일에 부적합한 패턴은
  카드/시트/탭으로 재구성.

---

핵심 파일 — 변환·이전 대상 (수정 시 참조)

이동 (web 코드에서 packages/core 로)

- apps/web/src/features/auth/api/auth.api.ts →
  packages/core/src/api/auth.api.ts (fetch → axios 클라이언트 사용)
- apps/web/src/features/monitoring/api/monitoring.{api,types}.ts →
  packages/core/src/api/monitoring.{api,types}.ts
- apps/web/src/features/pos/api/pos.{api,types}.ts →
  packages/core/src/api/pos.{api,types}.ts
- apps/web/src/features/_/lib/mappers.ts → packages/core/src/mappers/_.ts
- apps/web/src/features/_/lib/queryKeys.ts → packages/core/src/queryKeys/_.ts
- apps/web/src/features/_/hooks/use_.ts → packages/core/src/hooks/\*.ts
  (네비게이션 의존 부분만 어댑터화)
- apps/web/src/features/_/types/_.types.ts → packages/core/src/types/\*.ts
- apps/web/src/shared/lib/date.ts → packages/core/src/utils/date.ts
- apps/web/src/styles/theme.css (값만) → packages/tokens/src/colors.ts (TS
  객체)
- apps/web/src/features/monitoring/hooks/use{Event,Alert}Stream.ts →
  packages/core/src/hooks/useStream.ts (StreamAdapter 의존)

어댑터화 필요 (web/RN 둘 다 구현)

- apps/web/src/shared/lib/api.ts (fetch + 401 처리) →
  packages/core/createApiClient + apps/{web,mobile}/src/shared/api/client.ts
  구현체.
- apps/web/src/features/auth/store/auth.store.ts → core의
  createAuthStore(storage) + web=localStorage, mobile=MMKV.
- apps/web/src/features/auth/hooks/useLogout.ts → core는 clearAuth +
  queryClient.clear만, 라우팅은 콜백 주입.
- apps/web/src/shared/lib/firebase/\* → web 전용 유지. RN에는
  apps/mobile/src/shared/push/fcm.ts로 RN Firebase 새로 작성.

RN 신규 작성

- apps/mobile/src/shared/components/WebRTCView.tsx (react-native-webrtc + WHEP)
- apps/mobile/src/shared/components/Charts/AreaChart.tsx (gifted-charts 래퍼)
- apps/mobile/src/app/navigation/\* (React Navigation 전체)
- apps/mobile/src/shared/ui/TextField.tsx (Input 포팅)
- apps/mobile/src/shared/icons/index.ts (svg-transformer 기반)
- apps/mobile/src/shared/theme/ (NativeWind config + 런타임 토큰)

---

검증 계획

각 페이지 포팅 완료 시 다음을 확인:

1.  iOS 시뮬레이터 + Android 에뮬레이터: 화면 빌드/렌더 OK, SafeArea/노치/제스처
    검증.
2.  로그인 → 메인: axios 401 인터셉터에서 Navigation reset 동작, MMKV에 token
    저장, 재실행 시 자동 로그인.
3.  MonitoringScreen 실시간: react-native-sse로 신규 이벤트가 1초 내 카드
    리스트에 prepend.
4.  WebRTC: MediaMTX 더미 스트림 연결, 첫 프레임 도착 시간 측정.
5.  차트: gifted-charts AreaChart에 24시간 데이터(시간별 picks/suspicions) 정상
    렌더.
6.  푸시: 백엔드에서 발송한 FCM → 백그라운드(notifee)·포어그라운드 모두 알림
    표시 + 탭 시 AlertDetail로 딥링크.
7.  로그아웃: MMKV 키 3종 삭제 + Query cache clear + Auth Stack reset.
8.  타입체크: pnpm -w typecheck로 core/web/mobile 전체 통과.
9.  EAS Build (preview): iOS internal, Android internal 빌드 성공.

각 검증은 사용자 환경에서 수동으로 확인 후 다음 페이지로 진행.
