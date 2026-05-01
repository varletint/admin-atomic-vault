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
    STATS: (productId?: string) => ["products", "stats", productId] as const,
  },
  INVENTORY: {
    ALL: ["inventory"] as const,
    DETAIL: (productId: string) => ["inventory", "detail", productId] as const,
    MOVEMENTS: (productId: string, page?: number) =>
      ["inventory", "movements", productId, page] as const,
  },
  USERS: {
    ALL: ["users"] as const,
    LIST: (filters?: Record<string, unknown>) =>
      ["users", "list", filters] as const,
    DETAIL: (id: string) => ["users", "detail", id] as const,
  },
  WALLETS: {
    ALL: ["wallets"] as const,
    STORE: ["wallets", "store"] as const,
    LEDGER: (walletId: string, filters?: Record<string, unknown>) =>
      ["wallets", "ledger", walletId, filters] as const,
    RECONCILE: (walletId: string) =>
      ["wallets", "reconcile", walletId] as const,
  },
  WITHDRAWALS: {
    ALL: ["withdrawals"] as const,
    LIST: (filters?: Record<string, unknown>) =>
      ["withdrawals", "list", filters] as const,
    DETAIL: (id: string) => ["withdrawals", "detail", id] as const,
  },
} as const;
