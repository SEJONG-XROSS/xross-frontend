import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { authQueryKeys } from "@/features/auth/lib/queryKeys";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginApi(email, password),
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user.storeId);
      queryClient.setQueryData(authQueryKeys.me, data.user);
    },
  });
}
