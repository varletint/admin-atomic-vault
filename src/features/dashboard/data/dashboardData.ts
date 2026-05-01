import type { SparklineCardProps } from "../components/SparklineCard";
import type { DashboardStats, CardStats } from "../api/dashboardApi";
import { formatCurrency } from "@/utils/format";

export const DASHBOARD_TABS = [
  "Revenue",
  "Orders",
  "Customers",
  "Products",
] as const;

export type DashboardTab = (typeof DASHBOARD_TABS)[number];

function formatValue(
  value: number,
  format: "currency" | "number" | "percent"
): string {
  if (format === "currency") return formatCurrency(value);
  if (format === "percent") return `${value}%`;
  return new Intl.NumberFormat("en-US").format(value);
}

function mapCard(
  title: string,
  stats: CardStats,
  format: "currency" | "number" | "percent" = "number"
): Omit<SparklineCardProps, "data"> & { data: number[] } {
  return {
    title,
    value: formatValue(stats.total, format),
    change: stats.change.toFixed(1),
    trend: stats.trend,
    data: stats.daily,
  };
}

export function getTabCards(
  tab: DashboardTab,
  stats?: DashboardStats
): SparklineCardProps[] {
  if (!stats) return [];

  switch (tab) {
    case "Revenue":
      return [
        mapCard("Total Revenue", stats.revenue.totalRevenue, "currency"),
        mapCard("Avg Order Value", stats.revenue.avgOrderValue, "currency"),
        mapCard("Total Profit", stats.revenue.totalProfit, "currency"),
      ];
    case "Orders":
      return [
        mapCard("Total Orders", stats.orders.totalOrders, "number"),
        mapCard("Fulfilled Orders", stats.orders.fulfilled, "number"),
        mapCard("Cancelled Orders", stats.orders.cancelled, "number"),
      ];
    case "Customers":
      return [
        mapCard("Total Customers", stats.customers.totalCustomers, "number"),
        mapCard("New Customers (10d)", stats.customers.newCustomers, "number"),
        mapCard("Active Customers", stats.customers.activeCustomers, "number"),
      ];
    case "Products":
      return [
        mapCard("Total Products", stats.products.totalProducts, "number"),
        mapCard("Units Sold (10d)", stats.products.unitsSold, "number"),
        mapCard("Inventory Value", stats.products.inventoryValue, "currency"),
      ];
    default:
      return [];
  }
}
