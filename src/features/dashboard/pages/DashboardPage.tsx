import { Helmet } from "react-helmet-async";
import { useAuth } from "@/features/auth/hooks/useAuth";

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="border-2 border-admin-border bg-admin-surface p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted">{label}</p>
      <p className="mt-3 text-2xl font-bold tabular-nums tracking-tight text-admin-ink">
        {value}
      </p>
      <p className="mt-2 text-xs text-admin-faint">{hint}</p>
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <>
      <Helmet>
        <title>Dashboard — Atomic Admin</title>
      </Helmet>
      <div className="p-6 md:p-8">
        <div className="border-b-2 border-admin-ink pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-admin-ink md:text-3xl">Dashboard</h1>
          <p className="mt-2 text-sm font-medium text-admin-muted">
            <span className="text-admin-text">{user?.name}</span>
            <span className="mx-2 text-admin-border">·</span>
            <span className="text-xs font-bold uppercase tracking-wider text-admin-ink">{user?.role}</span>
          </p>
        </div>

        <section className="mt-8" aria-labelledby="metrics-heading">
          <h2 id="metrics-heading" className="sr-only">
            Summary metrics
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard label="Orders (24h)" value="—" hint="Wire your API slice" />
            <MetricCard label="Active users" value="—" hint="Wire your API slice" />
            <MetricCard label="Exceptions" value="0" hint="Placeholder until wired" />
          </div>
        </section>

        <section className="mt-10 border-2 border-admin-border bg-admin-surface p-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-admin-muted">Next steps</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-admin-text">
            Add feature slices under{" "}
            <code className="border border-admin-border bg-admin-bg px-1.5 py-0.5 font-mono text-xs">
              src/features/
            </code>{" "}
            and register routes in{" "}
            <code className="border border-admin-border bg-admin-bg px-1.5 py-0.5 font-mono text-xs">
              App.tsx
            </code>
            .
          </p>
        </section>
      </div>
    </>
  );
}
