import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  ShieldCheck,
  ShieldOff,
  ShieldX,
  MapPin,
  Clock,
  Wifi,
  Monitor,
  Lock,
  Mail,
  Key,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/format";
import {
  useUser,
  useUserOrders,
  useSuspendUser,
  useReactivateUser,
  useDeactivateUser,
} from "../hooks/useUsers";

const statusStyle: Record<string, string> = {
  ACTIVE: "bg-[var(--color-success-bg)] text-[var(--color-success)]",
  SUSPENDED: "bg-[var(--color-error-bg)] text-[var(--color-error)]",
  UNVERIFIED: "bg-[var(--color-warning-bg)] text-[var(--color-warning)]",
  DEACTIVATED: "bg-[var(--color-bg-muted)] text-admin-faint",
};

function fmtDateSafe(d?: string | null): string {
  if (!d) return "—";
  return formatDate(d);
}

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useUser(id ?? "");
  const { data: ordersData } = useUserOrders(id ?? "");
  const suspendMutation = useSuspendUser();
  const reactivateMutation = useReactivateUser();
  const deactivateMutation = useDeactivateUser();

  const [actionReason, setActionReason] = useState("");
  const [pendingAction, setPendingAction] = useState<
    "suspend" | "reactivate" | "deactivate" | null
  >(null);

  if (isLoading) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'>
        <p className='animate-pulse text-xs font-semibold uppercase tracking-[0.2em] text-admin-muted'>
          Loading user…
        </p>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className='p-8'>
        <p className='text-sm font-semibold text-[var(--color-error)]'>
          User not found.
        </p>
      </div>
    );
  }

  const orders = ordersData?.orders ?? [];
  const isBusy =
    suspendMutation.isPending ||
    reactivateMutation.isPending ||
    deactivateMutation.isPending;

  function executeAction() {
    if (!pendingAction || !actionReason.trim()) return;
    const payload = { id: user!._id, reason: actionReason.trim() };
    const opts = {
      onSuccess: () => {
        setPendingAction(null);
        setActionReason("");
      },
    };
    if (pendingAction === "suspend") suspendMutation.mutate(payload, opts);
    if (pendingAction === "reactivate")
      reactivateMutation.mutate(payload, opts);
    if (pendingAction === "deactivate")
      deactivateMutation.mutate(payload, opts);
  }

  return (
    <>
      <Helmet>
        <title>{user.name} — Users</title>
      </Helmet>
      <div className='p-4 md:p-8'>
        {/* Back */}
        <button
          type='button'
          onClick={() => navigate("/users")}
          className='mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-admin-muted transition-colors hover:text-admin-ink'>
          <ArrowLeft size={14} />
          Back to users
        </button>

        {/* ── Profile Header ── */}
        <div className='border border-[var(--color-border)] bg-admin-surface'>
          <div className='border-b border-[var(--color-border)] p-6'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
              <div>
                <h1 className='text-xl font-bold tracking-tight text-admin-ink md:text-2xl'>
                  {user.name}
                </h1>
                <p className='mt-1 text-sm text-admin-muted'>{user.email}</p>
              </div>
              <div className='flex items-center gap-3'>
                <span
                  className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                    statusStyle[user.status] ?? "text-admin-muted"
                  }`}>
                  {user.status}
                </span>
                <span className='text-[10px] font-bold uppercase tracking-[0.12em] text-admin-muted'>
                  {user.role}
                </span>
                {user.isEmailVerified ? (
                  <Mail size={14} className='text-[var(--color-success)]' />
                ) : (
                  <Mail size={14} className='text-[var(--color-warning)]' />
                )}
              </div>
            </div>
          </div>

          {/* ── Info Grid ── */}
          <div className='grid gap-px bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4'>
            <div className='bg-admin-surface p-5'>
              <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                User ID
              </p>
              <p className='mt-2 font-mono text-xs text-admin-text'>
                {user._id}
              </p>
            </div>
            <div className='bg-admin-surface p-5'>
              <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                Joined
              </p>
              <p className='mt-2 text-sm font-semibold tabular-nums text-admin-ink'>
                {fmtDateSafe(user.createdAt)}
              </p>
            </div>
            <div className='bg-admin-surface p-5'>
              <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                Email Verified
              </p>
              <p className='mt-2 text-sm font-semibold text-admin-ink'>
                {user.isEmailVerified ? "Yes" : "No"}
              </p>
            </div>
            <div className='bg-admin-surface p-5'>
              <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                Last Updated
              </p>
              <p className='mt-2 text-sm font-semibold tabular-nums text-admin-ink'>
                {fmtDateSafe(user.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* ── Auth Metadata ── */}
        <div className='mt-6 border border-[var(--color-border)] bg-admin-surface'>
          <div className='border-b border-[var(--color-border)] p-4'>
            <h2 className='text-xs font-bold uppercase tracking-[0.2em] text-admin-muted'>
              <Key size={12} className='mr-2 inline-block' />
              Authentication
            </h2>
          </div>
          <div className='grid gap-px bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3'>
            <div className='flex items-start gap-3 bg-admin-surface p-5'>
              <Clock size={14} className='mt-0.5 text-admin-faint' />
              <div>
                <p className='text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                  Last Login
                </p>
                <p className='mt-1 text-sm font-semibold tabular-nums text-admin-ink'>
                  {fmtDateSafe(user.auth?.lastLoginAt)}
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3 bg-admin-surface p-5'>
              <Wifi size={14} className='mt-0.5 text-admin-faint' />
              <div>
                <p className='text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                  Last Login IP
                </p>
                <p className='mt-1 font-mono text-xs text-admin-text'>
                  {user.auth?.lastLoginIp ?? "—"}
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3 bg-admin-surface p-5'>
              <Monitor size={14} className='mt-0.5 text-admin-faint' />
              <div>
                <p className='text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                  Last Device
                </p>
                <p className='mt-1 text-xs text-admin-text truncate max-w-[260px]'>
                  {user.auth?.lastLoginDevice ?? "—"}
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3 bg-admin-surface p-5'>
              <Lock size={14} className='mt-0.5 text-admin-faint' />
              <div>
                <p className='text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                  Failed Attempts
                </p>
                <p className='mt-1 text-sm font-semibold text-admin-ink'>
                  {user.auth?.failedLoginAttempts ?? 0}
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3 bg-admin-surface p-5'>
              <Lock size={14} className='mt-0.5 text-admin-faint' />
              <div>
                <p className='text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                  Locked Until
                </p>
                <p className='mt-1 text-sm font-semibold tabular-nums text-admin-ink'>
                  {fmtDateSafe(user.auth?.lockedUntil)}
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3 bg-admin-surface p-5'>
              <Key size={14} className='mt-0.5 text-admin-faint' />
              <div>
                <p className='text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                  Password Changed
                </p>
                <p className='mt-1 text-sm font-semibold tabular-nums text-admin-ink'>
                  {fmtDateSafe(user.auth?.passwordChangedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Address ── */}
        {user.address && (
          <div className='mt-6 border border-[var(--color-border)] bg-admin-surface'>
            <div className='border-b border-[var(--color-border)] p-4'>
              <h2 className='text-xs font-bold uppercase tracking-[0.2em] text-admin-muted'>
                <MapPin size={12} className='mr-2 inline-block' />
                Address
              </h2>
            </div>
            <div className='p-5'>
              <p className='text-sm text-admin-ink'>{user.address.street}</p>
              <p className='mt-1 text-sm text-admin-text'>
                {user.address.city}, {user.address.state} {user.address.zip}
              </p>
              <p className='mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-admin-muted'>
                {user.address.country}
              </p>
            </div>
          </div>
        )}

        {/* ── Order History ── */}
        <div className='mt-6 border border-[var(--color-border)] bg-admin-surface'>
          <div className='border-b border-[var(--color-border)] p-4'>
            <h2 className='text-xs font-bold uppercase tracking-[0.2em] text-admin-muted'>
              Recent Orders ({orders.length})
            </h2>
          </div>
          {orders.length === 0 ? (
            <div className='p-8 text-center'>
              <p className='text-sm text-admin-muted'>
                This user has no orders yet.
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm'>
                <thead>
                  <tr className='border-b border-[var(--color-border)] bg-admin-bg/40'>
                    <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                      Order ID
                    </th>
                    <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                      Status
                    </th>
                    <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                      Total
                    </th>
                    <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className='cursor-pointer border-b border-[var(--color-border)] bg-admin-surface last:border-b-0 transition-colors hover:bg-admin-bg/30'>
                      <td className='px-4 py-3 font-mono text-xs text-admin-text'>
                        {order._id.slice(-8)}
                      </td>
                      <td className='px-4 py-3'>
                        <span className='text-[10px] font-bold uppercase tracking-[0.1em] text-admin-muted'>
                          {order.status}
                        </span>
                      </td>
                      <td className='px-4 py-3 font-semibold tabular-nums text-admin-ink'>
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className='px-4 py-3 text-xs tabular-nums text-admin-faint'>
                        {fmtDateSafe(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Status History Timeline ── */}
        {user.statusHistory && user.statusHistory.length > 0 && (
          <div className='mt-6 border border-[var(--color-border)] bg-admin-surface'>
            <div className='border-b border-[var(--color-border)] p-4'>
              <h2 className='text-xs font-bold uppercase tracking-[0.2em] text-admin-muted'>
                Status History
              </h2>
            </div>
            <div className='p-5'>
              <div className='relative border-l-2 border-[var(--color-border)] pl-6'>
                {[...user.statusHistory].reverse().map((entry, i) => (
                  <div key={i} className='relative mb-6 last:mb-0'>
                    <div className='absolute -left-[31px] top-0.5 h-4 w-4 border-2 border-[var(--color-border)] bg-admin-surface' />
                    <div className='flex flex-col gap-1'>
                      <div className='flex items-center gap-3'>
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${
                            statusStyle[entry.status] ?? "text-admin-muted"
                          }`}>
                          {entry.status}
                        </span>
                        <span className='text-xs tabular-nums text-admin-faint'>
                          {fmtDateSafe(entry.timestamp)}
                        </span>
                      </div>
                      {entry.reason && (
                        <p className='text-xs text-admin-text'>
                          {entry.reason}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Admin Actions ── */}
        {user.status !== "DEACTIVATED" && (
          <div className='mt-6 border border-[var(--color-border)] bg-admin-surface p-6'>
            <h2 className='text-xs font-bold uppercase tracking-[0.2em] text-admin-muted mb-4'>
              Admin Actions
            </h2>

            {pendingAction ? (
              <div className='space-y-3'>
                <p className='text-sm text-admin-text'>
                  {pendingAction === "suspend" &&
                    "Suspend this user? They will retain login but cannot transact."}
                  {pendingAction === "reactivate" &&
                    "Reactivate this user? Full access will be restored."}
                  {pendingAction === "deactivate" &&
                    "Deactivate this user? This is a terminal action and cannot be undone."}
                </p>
                <div className='input-group'>
                  <label className='input-label'>Reason</label>
                  <input
                    type='text'
                    className='input-field'
                    placeholder='Provide a reason…'
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                  />
                </div>
                <div className='flex gap-2'>
                  <button
                    type='button'
                    className='btn btn-secondary'
                    onClick={() => {
                      setPendingAction(null);
                      setActionReason("");
                    }}>
                    Cancel
                  </button>
                  <button
                    type='button'
                    className='btn btn-primary'
                    disabled={!actionReason.trim() || isBusy}
                    onClick={executeAction}>
                    {isBusy ? "Processing…" : "Confirm"}
                  </button>
                </div>
              </div>
            ) : (
              <div className='flex flex-wrap gap-2'>
                {user.status === "ACTIVE" && (
                  <>
                    <button
                      type='button'
                      className='btn btn-secondary'
                      onClick={() => setPendingAction("suspend")}>
                      <ShieldOff size={14} />
                      Suspend
                    </button>
                    <button
                      type='button'
                      className='btn btn-secondary'
                      onClick={() => setPendingAction("deactivate")}>
                      <ShieldX size={14} />
                      Deactivate
                    </button>
                  </>
                )}
                {user.status === "SUSPENDED" && (
                  <>
                    <button
                      type='button'
                      className='btn btn-primary'
                      onClick={() => setPendingAction("reactivate")}>
                      <ShieldCheck size={14} />
                      Reactivate
                    </button>
                    <button
                      type='button'
                      className='btn btn-secondary'
                      onClick={() => setPendingAction("deactivate")}>
                      <ShieldX size={14} />
                      Deactivate
                    </button>
                  </>
                )}
                {user.status === "UNVERIFIED" && (
                  <button
                    type='button'
                    className='btn btn-secondary'
                    onClick={() => setPendingAction("deactivate")}>
                    <ShieldX size={14} />
                    Deactivate
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
