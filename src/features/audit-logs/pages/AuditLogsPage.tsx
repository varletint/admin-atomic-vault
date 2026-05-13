import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ChevronDown, FileText } from "lucide-react";
import { Pagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { useAuditLogs } from "../hooks/useAuditLogs";
import type { AuditSeverity, AuditEntityType, AuditLog } from "../types";

const SEVERITY_VARIANTS: Record<
  AuditSeverity,
  "info" | "warning" | "error" | "neutral"
> = {
  info: "info",
  warning: "warning",
  error: "error",
  critical: "error",
};

const ENTITY_TYPES: AuditEntityType[] = [
  "User",
  "Order",
  "Transaction",
  "Product",
  "Inventory",
  "Wallet",
  "Ledger",
  "Cart",
  "TrackingEvent",
  "OutboxEvent",
  "System",
  "Other",
];

function ExpandedRow({ log }: { log: AuditLog }) {
  return (
    <tr>
      <td colSpan={6} className='p-0'>
        <div className='grid grid-cols-2 gap-x-8 gap-y-4 border-t border-dashed border-[var(--color-border)] bg-admin-bg/30 px-6 py-4 md:grid-cols-3 lg:grid-cols-4'>
          {/* Actor details */}
          <div>
            <p className='text-[10px] font-bold uppercase tracking-[0.15em] text-admin-faint'>
              Actor Email
            </p>
            <p className='mt-0.5 text-xs text-admin-ink'>
              {log.actor.email ?? "—"}
            </p>
          </div>
          <div>
            <p className='text-[10px] font-bold uppercase tracking-[0.15em] text-admin-faint'>
              Actor Role
            </p>
            <p className='mt-0.5 text-xs text-admin-ink'>
              {log.actor.role ?? "—"}
            </p>
          </div>
          <div>
            <p className='text-[10px] font-bold uppercase tracking-[0.15em] text-admin-faint'>
              Entity ID
            </p>
            <p className='mt-0.5 break-all font-mono text-xs text-admin-ink'>
              {log.entity?.id ?? "—"}
            </p>
          </div>

          {/* Request context */}
          {log.request && (
            <>
              <div>
                <p className='text-[10px] font-bold uppercase tracking-[0.15em] text-admin-faint'>
                  Endpoint
                </p>
                <p className='mt-0.5 font-mono text-xs text-admin-ink'>
                  {log.request.method} {log.request.endpoint ?? "—"}
                </p>
              </div>
              <div>
                <p className='text-[10px] font-bold uppercase tracking-[0.15em] text-admin-faint'>
                  IP Address
                </p>
                <p className='mt-0.5 font-mono text-xs text-admin-ink'>
                  {log.request.ipAddress ?? "—"}
                </p>
              </div>
            </>
          )}

          {/* Result */}
          {log.result && (
            <div>
              <p className='text-[10px] font-bold uppercase tracking-[0.15em] text-admin-faint'>
                Result
              </p>
              <p
                className={`mt-0.5 text-xs font-semibold ${
                  log.result.success
                    ? "text-[var(--color-success)]"
                    : "text-[var(--color-error)]"
                }`}>
                {log.result.success ? "SUCCESS" : "FAILED"}
                {log.result.errorMessage && ` — ${log.result.errorMessage}`}
              </p>
            </div>
          )}

          {/* Metadata */}
          {log.metadata && Object.keys(log.metadata).length > 0 && (
            <div className='col-span-full'>
              <p className='text-[10px] font-bold uppercase tracking-[0.15em] text-admin-faint'>
                Metadata
              </p>
              <pre className='mt-1 overflow-x-auto rounded bg-admin-bg p-3 text-[11px] text-admin-text'>
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            </div>
          )}

          {/* Changes */}
          {log.changes && (
            <div className='col-span-full'>
              <p className='text-[10px] font-bold uppercase tracking-[0.15em] text-admin-faint'>
                Changes
              </p>
              {log.changes.changedFields && (
                <p className='mt-1 text-xs text-admin-muted'>
                  Fields: {log.changes.changedFields.join(", ")}
                </p>
              )}
              <div className='mt-2 grid grid-cols-1 gap-4 md:grid-cols-2'>
                {log.changes.before != null ? (
                  <div>
                    <p className='text-[10px] font-bold text-[var(--color-error)]'>
                      BEFORE
                    </p>
                    <pre className='mt-1 overflow-x-auto rounded bg-admin-bg p-3 text-[11px]'>
                      {JSON.stringify(log.changes.before, null, 2)}
                    </pre>
                  </div>
                ) : null}
                {log.changes.after != null ? (
                  <div>
                    <p className='text-[10px] font-bold text-[var(--color-success)]'>
                      AFTER
                    </p>
                    <pre className='mt-1 overflow-x-auto rounded bg-admin-bg p-3 text-[11px]'>
                      {JSON.stringify(log.changes.after, null, 2)}
                    </pre>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

export function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [severity, setSeverity] = useState<AuditSeverity | "">("");
  const [entityType, setEntityType] = useState<AuditEntityType | "">("");
  const [actionFilter, setActionFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, isLoading, isError } = useAuditLogs({
    page,
    limit: 25,
    ...(severity ? { severity: severity as AuditSeverity } : {}),
    ...(entityType ? { entityType: entityType as AuditEntityType } : {}),
    ...(actionFilter ? { action: actionFilter } : {}),
    ...(fromDate ? { from: fromDate } : {}),
    ...(toDate ? { to: toDate } : {}),
  });

  return (
    <>
      <Helmet>
        <title>Audit Logs</title>
      </Helmet>
      <div className='p-4 md:p-8'>
        <div className='border-b border-[var(--color-border)] pb-6'>
          <h1 className='text-2xl font-black uppercase tracking-tight text-admin-ink md:text-3xl'>
            Audit Logs
          </h1>
          <p className='mt-1 text-sm text-admin-muted'>
            System-wide activity and change history
          </p>
        </div>

        {/* ── Filters ──────────────── */}
        <div className='mt-6 grid grid-cols-1 gap-4 border border-[var(--color-border)] bg-admin-surface p-4 md:grid-cols-5'>
          <Input
            label='Action'
            placeholder='e.g. TRANSACTION_REVERSED'
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
          />
          <Select
            label='Severity'
            options={[
              { value: "", label: "All" },
              { value: "info", label: "Info" },
              { value: "warning", label: "Warning" },
              { value: "error", label: "Error" },
              { value: "critical", label: "Critical" },
            ]}
            value={severity}
            onChange={(e) => {
              setSeverity(e.target.value as AuditSeverity | "");
              setPage(1);
            }}
            name='severity'
          />
          <Select
            label='Entity Type'
            options={[
              { value: "", label: "All" },
              ...ENTITY_TYPES.map((t) => ({ value: t, label: t })),
            ]}
            value={entityType}
            onChange={(e) => {
              setEntityType(e.target.value as AuditEntityType | "");
              setPage(1);
            }}
            name='entityType'
          />
          <div>
            <label className='input-label'>From</label>
            <input
              type='date'
              className='input-field'
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div>
            <label className='input-label'>To</label>
            <input
              type='date'
              className='input-field'
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* ── Table ──────────────── */}
        {isLoading ? (
          <div className='mt-6'>
            <Skeleton.TableRows rows={10} cols={6} />
          </div>
        ) : isError || !data ? (
          <div className='mt-6 p-8 text-center'>
            <p className='text-sm font-semibold text-[var(--color-error)]'>
              Failed to load audit logs.
            </p>
          </div>
        ) : data.logs.length === 0 ? (
          <div className='mt-6'>
            <EmptyState
              icon={FileText}
              title='No audit logs found'
              description='Adjust your filters or wait for system activity.'
            />
          </div>
        ) : (
          <>
            <div className='mt-6 overflow-x-auto border border-[var(--color-border)]'>
              <table className='w-full text-left text-sm'>
                <thead>
                  <tr className='border-b border-[var(--color-border)] bg-admin-bg/40'>
                    <th className='w-8 px-2 py-3' />
                    <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                      Action
                    </th>
                    <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                      Actor
                    </th>
                    <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                      Entity
                    </th>
                    <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                      Severity
                    </th>
                    <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.logs.map((log) => {
                    const isExpanded = expandedId === log._id;
                    return (
                      <>
                        <tr
                          key={log._id}
                          className={`cursor-pointer border-b border-[var(--color-border)] bg-admin-surface transition-colors hover:bg-admin-bg/60 ${
                            isExpanded ? "bg-admin-bg/60" : ""
                          } last:border-b-0`}
                          onClick={() =>
                            setExpandedId(isExpanded ? null : log._id)
                          }>
                          <td className='px-2 py-3 text-admin-muted'>
                            <ChevronDown
                              size={14}
                              className={`transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </td>
                          <td className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-admin-ink'>
                            {log.action}
                          </td>
                          <td className='px-4 py-3 text-xs text-admin-text'>
                            {log.actor.isSystem
                              ? "SYSTEM"
                              : log.actor.email ?? "Unknown"}
                          </td>
                          <td className='px-4 py-3 text-xs text-admin-muted'>
                            {log.entity ? (
                              <>
                                <span className='font-semibold'>
                                  {log.entity.type}
                                </span>
                                {log.entity.name && (
                                  <span className='ml-1 text-admin-faint'>
                                    · {log.entity.name}
                                  </span>
                                )}
                              </>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className='px-4 py-3'>
                            <StatusBadge
                              label={log.severity.toUpperCase()}
                              variant={
                                SEVERITY_VARIANTS[log.severity] ?? "neutral"
                              }
                            />
                          </td>
                          <td className='px-4 py-3 text-xs tabular-nums text-admin-faint'>
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                        </tr>
                        {isExpanded && (
                          <ExpandedRow key={`${log._id}-exp`} log={log} />
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination
              page={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </>
  );
}
