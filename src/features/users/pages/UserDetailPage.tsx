import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { useUser, useUpdateUserStatus } from "../hooks/useUsers";

const statusStyle: Record<string, string> = {
  ACTIVE: "bg-[var(--color-success-bg)] text-[var(--color-success)]",
  SUSPENDED: "bg-[var(--color-error-bg)] text-[var(--color-error)]",
  PENDING: "bg-[var(--color-warning-bg)] text-[var(--color-warning)]",
};

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useUser(id ?? "");
  const statusMutation = useUpdateUserStatus();

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

  const canToggle = user.status === "ACTIVE" || user.status === "SUSPENDED";
  const nextStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

  return (
    <>
      <Helmet>
        <title>{user.name} — Users</title>
      </Helmet>
      <div className='p-4 md:p-8'>
        <button
          type='button'
          onClick={() => navigate("/users")}
          className='mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-admin-muted transition-colors hover:text-admin-ink'>
          <ArrowLeft size={14} />
          Back to users
        </button>

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
              </div>
            </div>
          </div>

          <div className='grid gap-px bg-[var(--color-border)] sm:grid-cols-3'>
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
                {new Date(user.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className='bg-admin-surface p-5'>
              <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
                Last Updated
              </p>
              <p className='mt-2 text-sm font-semibold tabular-nums text-admin-ink'>
                {new Date(user.updatedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {canToggle && (
            <div className='border-t border-[var(--color-border)] p-6'>
              <button
                type='button'
                disabled={statusMutation.isPending}
                onClick={() =>
                  statusMutation.mutate({ id: user._id, status: nextStatus })
                }
                className={`btn ${
                  nextStatus === "SUSPENDED" ? "btn-secondary" : "btn-primary"
                }`}>
                {statusMutation.isPending
                  ? "Updating…"
                  : nextStatus === "SUSPENDED"
                  ? "Suspend User"
                  : "Activate User"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
