import api from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { AuditFilters, AuditListResponse } from "../types";

export async function fetchAuditLogs(
  filters: AuditFilters = {}
): Promise<AuditListResponse> {
  const params: Record<string, unknown> = {};
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  if (filters.action) params.action = filters.action;
  if (filters.severity) params.severity = filters.severity;
  if (filters.entityType) params.entityType = filters.entityType;
  if (filters.from) params.from = filters.from;
  if (filters.to) params.to = filters.to;

  const { data } = await api.get(API_ENDPOINTS.AUDIT_LOGS.LIST, { params });
  return data.data;
}
