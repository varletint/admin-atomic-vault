import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { productApi } from "../api/productApi";
import type { ProductFilters } from "../types";

/* ── List ───────────────────────────────── */

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.LIST(filters as Record<string, unknown>),
    queryFn: async () => {
      const { data } = await productApi.getProducts(filters);
      return data;
    },
  });
}

/* ── Detail ─────────────────────────────── */

export function useProduct(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.DETAIL(id),
    queryFn: async () => {
      const { data } = await productApi.getProduct(id);
      return data.data;
    },
    enabled: !!id,
  });
}

import { storageApi } from "../api/storageApi";

interface ImageFileEntry {
  file: File;
  preview: string;
  isPrimary: boolean;
}

async function handleImageUploads(imageFiles: ImageFileEntry[] = []) {
  const uploadedMoves: { tempKey: string; finalKey: string }[] = [];
  const rollbackKeys: string[] = [];
  const formattedImages: any[] = [];

  try {
    for (let i = 0; i < imageFiles.length; i++) {
      const { file, isPrimary } = imageFiles[i];
      const uploadInfo = await storageApi.getUploadUrl(
        "products/images",
        file.name,
        file.type
      );

      rollbackKeys.push(uploadInfo.tempKey);
      await storageApi.uploadToR2(uploadInfo.uploadUrl, file);
      uploadedMoves.push({
        tempKey: uploadInfo.tempKey,
        finalKey: uploadInfo.finalKey,
      });

      formattedImages.push({
        url: uploadInfo.publicUrl,
        altText: file.name.replace(/\.[^/.]+$/, ""),
        sortOrder: i, // append at end effectively, though backend re-sorts
        isPrimary,
      });
    }
    return { formattedImages, uploadedMoves, rollbackKeys };
  } catch (error) {
    if (rollbackKeys.length > 0) {
      storageApi.rollbackUploads(rollbackKeys).catch(console.error);
    }
    throw error;
  }
}

/* ── Create ─────────────────────────────── */

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      imageFiles,
    }: {
      data: Record<string, unknown>;
      imageFiles?: ImageFileEntry[];
    }) => {
      const { formattedImages, uploadedMoves, rollbackKeys } =
        await handleImageUploads(imageFiles);

      try {
        const payload = { ...data };
        payload.images = [
          ...((payload.images as any[]) || []),
          ...formattedImages,
        ];

        const result = await productApi.createProduct(payload);

        if (uploadedMoves.length > 0) {
          await storageApi.confirmUploads(uploadedMoves);
        }
        return result;
      } catch (error) {
        if (rollbackKeys.length > 0) {
          storageApi.rollbackUploads(rollbackKeys).catch(console.error);
        }
        throw error;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL });
    },
  });
}

/* ── Update ─────────────────────────────── */

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
      imageFiles,
    }: {
      id: string;
      data: Record<string, unknown>;
      imageFiles?: ImageFileEntry[];
    }) => {
      const { formattedImages, uploadedMoves, rollbackKeys } =
        await handleImageUploads(imageFiles);

      try {
        const payload = { ...data };
        payload.images = [
          ...((payload.images as any[]) || []),
          ...formattedImages,
        ];

        const result = await productApi.updateProduct(id, payload);

        if (uploadedMoves.length > 0) {
          await storageApi.confirmUploads(uploadedMoves);
        }
        return result;
      } catch (error) {
        if (rollbackKeys.length > 0) {
          storageApi.rollbackUploads(rollbackKeys).catch(console.error);
        }
        throw error;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL });
    },
  });
}

/* ── Deactivate ─────────────────────────── */

export function useDeactivateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productApi.deactivateProduct(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL });
    },
  });
}

/* ── Reactivate ─────────────────────────── */

export function useReactivateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productApi.reactivateProduct(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL });
    },
  });
}

/* ── Filter helpers ─────────────────────── */

export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.CATEGORIES,
    queryFn: async () => {
      const { data } = await productApi.getCategories();
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 min
  });
}

export function useBrands() {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.BRANDS,
    queryFn: async () => {
      const { data } = await productApi.getBrands();
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
