import { useLogin as useCoreLogin } from '@xross/core/hooks/useLogin';
import { useAuthStore } from '@/features/auth/store/auth.store';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useCoreLogin({ onSuccess: setAuth });
}
