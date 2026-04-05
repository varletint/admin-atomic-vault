export const QUERY_KEYS = {
  AUTH: {
    ME: ["auth", "me"] as const,
  },
  ORDERS: {
    ALL: ["orders"] as const,
    LIST: (filters?: Record<string, unknown>) =>
      ["orders", "list", filters] as const,
    DETAIL: (id: string) => ["orders", "detail", id] as const,
  },
  PRODUCTS: {
    ALL: ["products"] as const,
    LIST: (filters?: Record<string, unknown>) =>
      ["products", "list", filters] as const,
    DETAIL: (id: string) => ["products", "detail", id] as const,
    CATEGORIES: ["products", "categories"] as const,
    BRANDS: ["products", "brands"] as const,
  },
} as const;
