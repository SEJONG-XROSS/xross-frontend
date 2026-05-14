import axios, { type AxiosInstance } from 'axios';

export interface AuthAdapter {
  getAccessToken(): string | null;
  /** 401 수신 시 호출 — web: window.location.replace, RN: navigation.reset */
  onUnauthorized(): void;
}

export interface SSEEvent {
  data: string;
}

/** SSE 전송 계층 어댑터 — web: fetch+ReadableStream, RN: react-native-sse */
export interface StreamAdapter {
  open(opts: {
    url: string;
    headers?: Record<string, string>;
    onMessage: (event: SSEEvent) => void;
    onError: (error: Error) => void;
    onOpen?: () => void;
  }): () => void; // cleanup 함수 반환
}

let _streamAdapter: StreamAdapter | null = null;

export function setStreamAdapter(adapter: StreamAdapter): void {
  _streamAdapter = adapter;
}

export function getStreamAdapter(): StreamAdapter {
  if (!_streamAdapter) throw new Error('[xross/core] StreamAdapter 미주입. 앱 부팅 시 setStreamAdapter()를 호출하세요.');
  return _streamAdapter;
}

let _client: AxiosInstance | null = null;
let _baseURL = '';

export function createApiClient(baseURL: string, auth: AuthAdapter): AxiosInstance {
  _baseURL = baseURL;

  const instance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  });

  // 요청 인터셉터: Bearer 토큰 주입
  instance.interceptors.request.use((config) => {
    const token = auth.getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // 응답 인터셉터: 에러 정규화 + 세션 만료 처리
  instance.interceptors.response.use(
    (res) => res,
    (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // 토큰이 있었던 경우만 세션 만료 → 인증 해제
        // 로그인 요청의 401(잘못된 자격증명)은 토큰이 없으므로 통과
        if (auth.getAccessToken()) {
          auth.onUnauthorized();
        }
      }
      const message =
        (axios.isAxiosError(error) &&
          (error.response?.data as { message?: string })?.message) ||
        '요청에 실패했습니다.';
      return Promise.reject(new Error(message));
    },
  );

  return instance;
}

export function setApiClient(client: AxiosInstance): void {
  _client = client;
}

export function getApiClient(): AxiosInstance {
  if (!_client) throw new Error('[xross/core] API client 미초기화. 앱 부팅 시 setApiClient()를 호출하세요.');
  return _client;
}

/** SSE/WebRTC 등 raw URL 구성에 필요한 base URL */
export function getBaseURL(): string {
  return _baseURL;
}
