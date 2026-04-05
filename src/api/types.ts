export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrdersPaginatedResponse<T> {
  success: boolean;
  data: {
    orders: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
