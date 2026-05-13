import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginApi } from '../api/auth.api';
import { authQueryKeys } from '../queryKeys/auth';

interface UseLoginOptions {
  /** 로그인 성공 시 — token과 storeId를 storage에 저장하는 platform 어댑터 */
  onSuccess: (token: string, storeId: number) => void;
}

export function useLogin({ onSuccess }: UseLoginOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginApi(email, password),
    onSuccess: (data) => {
      onSuccess(data.accessToken, data.user.storeId);
      queryClient.setQueryData(authQueryKeys.me, data.user);
    },
  });
}
