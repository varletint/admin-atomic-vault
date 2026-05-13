import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { fetchAuditLogs } from "../api/auditApi";
import type { AuditFilters } from "../types";

export function useAuditLogs(filters: AuditFilters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.AUDIT_LOGS.LIST(filters as Record<string, unknown>),
    queryFn: () => fetchAuditLogs(filters),
  });
}
