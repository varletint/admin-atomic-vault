import api from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/api/types";
import type { User } from "@/types";

interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  login: (data: LoginPayload) =>
    api.post<ApiResponse<User>>(API_ENDPOINTS.AUTH.LOGIN, data),

  logout: () => api.post<ApiResponse<unknown>>(API_ENDPOINTS.AUTH.LOGOUT),

  refreshTokens: () => api.post<ApiResponse<unknown>>(API_ENDPOINTS.AUTH.REFRESH),

  getMe: () => api.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME),
};
