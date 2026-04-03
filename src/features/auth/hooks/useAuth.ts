import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store";
import { QUERY_KEYS } from "@/constants";
import { authApi } from "../api/authApi";
import { resetRefreshState } from "@/api/axios";

export function useAuth() {
  const queryClient = useQueryClient();
  const { user, setUser, clearAuth } = useAuthStore();

  const meQuery = useQuery({
    queryKey: QUERY_KEYS.AUTH.ME,
    queryFn: async () => {
      const { data } = await authApi.getMe();
      return data.data;
    },
    enabled: !!user,
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (meQuery.data) {
      setUser(meQuery.data);
    }
  }, [meQuery.data, setUser]);

  useEffect(() => {
    if (meQuery.isError) {
      clearAuth();
    }
  }, [meQuery.isError, clearAuth]);

  const loginMutation = useMutation({
    mutationFn: (data: { email: string; password: string }) => authApi.login(data),
    onSuccess: ({ data }) => {
      resetRefreshState();
      if (data.data) setUser(data.data);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
    },
  });

  return {
    user,
    isLoading: meQuery.isLoading,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
