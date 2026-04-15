import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "http://10.252.103.108:3000/api",
  timeout: 10_000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshFailed = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}[] = [];

function processQueue(error: unknown | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(undefined);
    }
  });
  failedQueue = [];
}

export function resetRefreshState() {
  refreshFailed = false;
}

const NO_REFRESH_PATHS = [
  "/users/login",
  "/users/register",
  "/users/refresh",
  "/users/logout",
];

function shouldSkipRefresh(url: string | undefined): boolean {
  if (!url) return true;
  return NO_REFRESH_PATHS.some((path) => url.includes(path));
}

function getCsrfToken(): string | undefined {
  return document.cookie
    .split("; ")
    .find((c) => c.startsWith("csrf-token="))
    ?.split("=")[1];
}

api.interceptors.request.use((config) => {
  if (config.method && config.method !== "get") {
    const token = getCsrfToken();
    if (token) {
      config.headers["X-CSRF-Token"] = token;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      shouldSkipRefresh(originalRequest.url) ||
      refreshFailed
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await api.post("/users/refresh");
      processQueue(null);
      return api(originalRequest);
    } catch (refreshError) {
      refreshFailed = true;
      processQueue(refreshError);
      useAuthStore.getState().clearAuth();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
