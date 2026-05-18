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
        const url = error.config?.url ?? '';
        const method = (error.config?.method ?? '').toLowerCase();
        // PATCH /auth/me의 401은 비밀번호 오류 — 세션 만료가 아니므로 로그아웃 제외
        const isPasswordError = url.includes('/auth/me') && method === 'patch';
        if (auth.getAccessToken() && !isPasswordError) {
          auth.onUnauthorized();
        }
      }
      const message =
        (axios.isAxiosError(error) &&
          (error.response?.data as { message?: string })?.message) ||
        '요청에 실패했습니다.';

      // 원래 axios 에러 정보를 보존해서 dev 로깅/디버깅에서 사용 가능하게
      const err = new Error(message) as Error & {
        status?: number;
        axiosCode?: string;
        axiosUrl?: string;
      };
      if (axios.isAxiosError(error)) {
        err.status = error.response?.status;
        err.axiosCode = error.code;
        err.axiosUrl = `${error.config?.baseURL ?? ''}${error.config?.url ?? ''}`;
      }
      return Promise.reject(err);
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
