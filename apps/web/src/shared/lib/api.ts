import { useAuthStore } from "@/features/auth/store/auth.store";

export const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const token = useAuthStore.getState().accessToken;

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (response.status === 401) {
    useAuthStore.getState().clearAuth();
    window.location.replace("/auth/login");
    throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
  }

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      (body as { message?: string }).message ?? "요청에 실패했습니다.",
    );
  }

  return body as T;
}
