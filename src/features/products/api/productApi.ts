import api from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { PaginatedResponse, ApiResponse } from "@/api/types";
import type { Product, ProductFilters } from "../types";

export const productApi = {
  getProducts: (filters: ProductFilters = {}) => {
    const params: Record<string, string | number | boolean> = {};
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.category) params.category = filters.category;
    if (filters.brand) params.brand = filters.brand;
    if (filters.tag) params.tag = filters.tag;
    if (filters.isActive !== undefined) params.isActive = filters.isActive;
    if (filters.isFeatured !== undefined)
      params.isFeatured = filters.isFeatured;
    if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
    if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
    if (filters.search) params.search = filters.search;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;

    return api.get<PaginatedResponse<Product>>(API_ENDPOINTS.PRODUCTS.LIST, {
      params,
    });
  },

  getProduct: (id: string) =>
    api.get<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS.DETAIL(id)),

  createProduct: (data: Record<string, unknown>) =>
    api.post<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS.CREATE, data),

  updateProduct: (id: string, data: Record<string, unknown>) =>
    api.patch<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS.UPDATE(id), data),

  deactivateProduct: (id: string) =>
    api.patch<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS.DEACTIVATE(id)),

  reactivateProduct: (id: string) =>
    api.patch<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS.REACTIVATE(id)),

  getCategories: () =>
    api.get<ApiResponse<string[]>>(API_ENDPOINTS.PRODUCTS.CATEGORIES),

  getBrands: () =>
    api.get<ApiResponse<string[]>>(API_ENDPOINTS.PRODUCTS.BRANDS),
};
