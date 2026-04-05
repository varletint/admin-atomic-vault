import api from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface UploadUrlResponse {
  uploadUrl: string;
  tempKey: string;
  finalKey: string;
  publicUrl: string;
}

export const storageApi = {
  getUploadUrl: async (
    folder: string,
    fileName: string,
    contentType: string
  ) => {
    const { data } = await api.post<{
      success: boolean;
      data: UploadUrlResponse;
    }>(API_ENDPOINTS.STORAGE.UPLOAD_URL, { folder, fileName, contentType });
    return data.data;
  },

  /**
   * Upload directly to Cloudflare R2 via pre-signed URL.
   * Uses raw fetch (not axios) to avoid sending auth cookies/headers to S3.
   */
  uploadToR2: async (uploadUrl: string, file: File) => {
    const res = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    if (!res.ok) throw new Error(`R2 upload failed: ${res.statusText}`);
  },

  confirmUploads: async (moves: { tempKey: string; finalKey: string }[]) => {
    await api.post(API_ENDPOINTS.STORAGE.CONFIRM, { moves });
  },

  rollbackUploads: async (keys: string[]) => {
    await api.post(API_ENDPOINTS.STORAGE.ROLLBACK, { keys });
  },
};
