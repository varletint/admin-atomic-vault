import { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/utils/format";
import { useDashboardStats } from "../hooks/useDashboard";
import { DashboardTabs } from "../components/DashboardTabs";
import { SparklineCard } from "../components/SparklineCard";
import { MetricCard } from "../components/MetricCard";
import { RecentActivity } from "../components/RecentActivity";
import { QuickActions } from "../components/QuickActions";
import {
  DASHBOARD_TABS,
  getTabCards,
  type DashboardTab,
} from "../data/dashboardData";

export function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>("Revenue");
  const { data: stats, isLoading } = useDashboardStats();

  const cards = getTabCards(activeTab, stats);

  return (
    <>
      <Helmet>
        <title>Overview — Atomic Admin</title>
      </Helmet>
      <div className="p-6 md:p-8">
        {/* ── Page Header ───────────────────────── */}
        <div className="border-b border-[var(--color-border)] pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-admin-ink md:text-3xl">
            Overview
          </h1>
          <p className="mt-2 text-sm font-medium text-admin-muted">
            <span className="text-admin-text">{user?.name}</span>
            <span className="mx-2 text-admin-border">·</span>
            <span className="text-xs font-bold uppercase tracking-wider text-admin-ink">
              {user?.role}
            </span>
          </p>
        </div>

        {/* ── Metric Cards (Top KPIs) ────────────── */}
        <section className="mt-8" aria-labelledby="metrics-heading">
          <h2 id="metrics-heading" className="sr-only">
            Summary metrics
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
              <>
                <Skeleton className="h-[120px]" />
                <Skeleton className="h-[120px]" />
                <Skeleton className="h-[120px]" />
                <Skeleton className="h-[120px]" />
              </>
            ) : (
              <>
                <MetricCard
                  label="Total Revenue"
                  value={
                    stats
                      ? formatCurrency(stats.revenue.totalRevenue.total)
                      : "—"
                  }
                  icon={DollarSign}
                  trend={
                    stats
                      ? {
                          value: stats.revenue.totalRevenue.change.toFixed(1),
                          direction: stats.revenue.totalRevenue.trend,
                        }
                      : undefined
                  }
                  hint="Last 10 days"
                />
                <MetricCard
                  label="Total Orders"
                  value={
                    stats
                      ? new Intl.NumberFormat("en-US").format(
                          stats.orders.totalOrders.total
                        )
                      : "—"
                  }
                  icon={Package}
                  trend={
                    stats
                      ? {
                          value: stats.orders.totalOrders.change.toFixed(1),
                          direction: stats.orders.totalOrders.trend,
                        }
                      : undefined
                  }
                  hint="Last 10 days"
                />
                <MetricCard
                  label="Customers"
                  value={
                    stats
                      ? new Intl.NumberFormat("en-US").format(
                          stats.customers.totalCustomers.total
                        )
                      : "—"
                  }
                  icon={Users}
                  trend={
                    stats
                      ? {
                          value: stats.customers.totalCustomers.change.toFixed(1),
                          direction: stats.customers.totalCustomers.trend,
                        }
                      : undefined
                  }
                  hint="Total registered"
                />
                <MetricCard
                  label="Products"
                  value={
                    stats
                      ? new Intl.NumberFormat("en-US").format(
                          stats.products.totalProducts.total
                        )
                      : "—"
                  }
                  icon={ShoppingBag}
                  trend={
                    stats
                      ? {
                          value: stats.products.totalProducts.change.toFixed(1),
                          direction: stats.products.totalProducts.trend,
                        }
                      : undefined
                  }
                  hint="Active catalog"
                />
              </>
            )}
          </div>
        </section>

        {/* ── Tabbed Sparkline Section ────────────── */}
        <section
          className="mt-10 border border-[var(--color-border)] bg-admin-bg/20"
          aria-labelledby="performance-heading">
          <div className="p-5 pb-0">
            <h2
              id="performance-heading"
              className="text-xs font-bold uppercase tracking-[0.2em] text-admin-muted">
              Performance
            </h2>
          </div>

          <div className="mt-4 px-5">
            <DashboardTabs
              tabs={[...DASHBOARD_TABS]}
              active={activeTab}
              onChange={(tab) => setActiveTab(tab as DashboardTab)}
            />
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <>
                <Skeleton.Card />
                <Skeleton.Card />
                <Skeleton.Card />
              </>
            ) : (
              cards.map((card) => (
                <SparklineCard key={`${activeTab}-${card.title}`} {...card} />
              ))
            )}
          </div>
        </section>

        {/* ── Bottom Grid: Activity + Quick Actions ── */}
        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <div>
            <QuickActions />
          </div>
        </section>
      </div>
    </>
  );
}
