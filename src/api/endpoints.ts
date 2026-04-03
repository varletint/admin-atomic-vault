/**
 * Hand-written API paths — keep in sync with backend and storefront `api/endpoints`.
 * Add admin-only sections as routes are introduced.
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/users/login",
    LOGOUT: "/users/logout",
    REFRESH: "/users/refresh",
    ME: "/users/me",
  },
  ADMIN: {
    /** Example — replace when backend exposes admin namespaces */
    ROOT: "/admin",
  },
} as const;
