/**
 * API paths — keep in sync with backend and storefront `api/endpoints`.
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/users/login",
    LOGOUT: "/users/logout",
    REFRESH: "/users/refresh",
    ME: "/users/me",
  },
  ORDERS: {
    LIST: "/orders/admin",
    DETAIL: (id: string) => `/orders/${id}`,
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
    CANCEL: (id: string) => `/orders/${id}/status`,
  },
  PRODUCTS: {
    LIST: "/products",
    DETAIL: (id: string) => `/products/${id}`,
    BY_SKU: (sku: string) => `/products/sku/${sku}`,
    CREATE: "/products",
    UPDATE: (id: string) => `/products/${id}`,
    DEACTIVATE: (id: string) => `/products/${id}/deactivate`,
    REACTIVATE: (id: string) => `/products/${id}/reactivate`,
    CATEGORIES: "/products/categories",
    BRANDS: "/products/brands",
  },
  STORAGE: {
    UPLOAD_URL: "/storage/upload-url",
    CONFIRM: "/storage/confirm",
    ROLLBACK: "/storage/rollback",
  },
  INVENTORY: {
    GET: (productId: string) => `/inventory/${productId}`,
    MOVEMENTS: (productId: string) => `/inventory/${productId}/movements`,
    ADJUST: (productId: string) => `/inventory/${productId}/adjust`,
    RESERVE: (productId: string) => `/inventory/${productId}/reserve`,
    RELEASE: (productId: string) => `/inventory/${productId}/release`,
    COMMIT: (productId: string) => `/inventory/${productId}/commit`,
  },
} as const;
