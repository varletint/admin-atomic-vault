import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { DashboardTabs } from "../components/DashboardTabs";
import { SparklineCard } from "../components/SparklineCard";
import {
  DASHBOARD_TABS,
  getTabCards,
  type DashboardTab,
} from "../data/dashboardData";

// function MetricCard({
//   label,
//   value,
//   hint,
// }: {
//   label: string;
//   value: string;
//   hint: string;
// }) {
//   return (
//     <div className='border border-[var(--color-border)] bg-admin-bg/20 p-5'>
//       <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted'>
//         {label}
//       </p>
//       <p className='mt-3 text-2xl font-bold tabular-nums tracking-tight text-admin-ink'>
//         {value}
//       </p>
//       <p className='mt-2 text-xs text-admin-faint'>{hint}</p>
//     </div>
//   );
// }

export function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>("Profit");
  const cards = getTabCards(activeTab);

  return (
    <>
      <Helmet>
        <title>Dashboard — Atomic Admin</title>
      </Helmet>
      <div className='p-6 md:p-8'>
        <div className='border-b border-[var(--color-border)] pb-6'>
          <h1 className='text-2xl font-bold tracking-tight text-admin-ink md:text-3xl'>
            Dashboard
          </h1>
          <p className='mt-2 text-sm font-medium text-admin-muted'>
            <span className='text-admin-text'>{user?.name}</span>
            <span className='mx-2 text-admin-border'>·</span>
            <span className='text-xs font-bold uppercase tracking-wider text-admin-ink'>
              {user?.role}
            </span>
          </p>
        </div>

        <section className='mt-8' aria-labelledby='metrics-heading'>
          <h2 id='metrics-heading' className='sr-only'>
            Summary metrics
          </h2>
          {/* <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            <MetricCard
              label='Orders (24h)'
              value='—'
              hint='Wire your API slice'
            />
            <MetricCard
              label='Active users'
              value='—'
              hint='Wire your API slice'
            />
            <MetricCard
              label='Exceptions'
              value='0'
              hint='Placeholder until wired'
            />
          </div> */}
        </section>

        {/* ── Tabbed Sparkline Section ─────────────── */}
        <section
          className='mt-10 border border-[var(--color-border)] bg-admin-bg/20'
          aria-labelledby='performance-heading'>
          <div className='p-5 pb-0'>
            <h2
              id='performance-heading'
              className='text-xs font-bold uppercase tracking-[0.2em] text-admin-muted'>
              Performance
            </h2>
          </div>

          <div className='mt-4 px-5'>
            <DashboardTabs
              tabs={[...DASHBOARD_TABS]}
              active={activeTab}
              onChange={(tab) => setActiveTab(tab as DashboardTab)}
            />
          </div>

          <div className='grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3'>
            {cards.map((card) => (
              <SparklineCard key={`${activeTab}-${card.title}`} {...card} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
