import type { SparklineCardProps } from "../components/SparklineCard";

export const DASHBOARD_TABS = [
  "Profit",
  "Product Type",
  "Orders",
  "Features",
  "Gross MRR",
  "ARR",
  "Customers",
  "Sales",
] as const;

export type DashboardTab = (typeof DASHBOARD_TABS)[number];

/** Card configs keyed by tab. All data is mock/placeholder. */
export const TAB_CARDS: Record<
  DashboardTab,
  Omit<SparklineCardProps, "data">[]
> = {
  Profit: [
    {
      title: "Net Profit",
      value: "$48,290",
      change: "12.4",
      trend: "up",
      endLabel: "+$5,120",
    },
    {
      title: "Gross Profit",
      value: "$72,560",
      change: "8.7",
      trend: "up",
      endLabel: "+$6,340",
    },
    { title: "Profit Margin", value: "34.2%", change: "2.1", trend: "up" },
  ],
  "Product Type": [
    {
      title: "Electronics",
      value: "1,284",
      change: "15.3",
      trend: "up",
      endLabel: "+196",
    },
    { title: "Apparel", value: "842", change: "3.9", trend: "down" },
    {
      title: "Home & Kitchen",
      value: "567",
      change: "7.2",
      trend: "up",
      endLabel: "+41",
    },
  ],
  Orders: [
    {
      title: "Total Orders",
      value: "3,847",
      change: "9.2",
      trend: "up",
      endLabel: "+354",
    },
    { title: "Avg Order Value", value: "$67.40", change: "1.8", trend: "down" },
    { title: "Fulfillment Rate", value: "97.3%", change: "0.4", trend: "up" },
  ],
  Features: [
    { title: "Feature Adoption", value: "68.5%", change: "5.1", trend: "up" },
    { title: "Engagement Score", value: "7.8/10", change: "3.2", trend: "up" },
    { title: "Feature Requests", value: "142", change: "11.0", trend: "down" },
  ],
  "Gross MRR": [
    {
      title: "Gross MRR",
      value: "$128,400",
      change: "6.3",
      trend: "up",
      endLabel: "+$8,100",
    },
    {
      title: "New MRR",
      value: "$18,200",
      change: "14.5",
      trend: "up",
      endLabel: "+$2,640",
    },
    { title: "Churned MRR", value: "$4,300", change: "2.1", trend: "down" },
  ],
  ARR: [
    {
      title: "Annual Revenue",
      value: "$1.54M",
      change: "6.3",
      trend: "up",
      endLabel: "+$97K",
    },
    { title: "Expansion ARR", value: "$218K", change: "18.7", trend: "up" },
    { title: "Contraction ARR", value: "$51K", change: "3.4", trend: "down" },
  ],
  Customers: [
    {
      title: "Total Customers",
      value: "12,480",
      change: "8.9",
      trend: "up",
      endLabel: "+1,110",
    },
    { title: "Active Users", value: "8,342", change: "5.7", trend: "up" },
    { title: "Churn Rate", value: "2.4%", change: "0.3", trend: "down" },
  ],
  Sales: [
    {
      title: "Total Sales",
      value: "$234,800",
      change: "11.2",
      trend: "up",
      endLabel: "+$26.3K",
    },
    { title: "Conversion Rate", value: "3.8%", change: "0.6", trend: "up" },
    { title: "Avg Deal Size", value: "$1,240", change: "4.1", trend: "down" },
  ],
};

/**
 * Generate deterministic-looking sparkline data for each card.
 * Uses a simple seeded pattern so visuals look natural but are stable across renders.
 */
const SPARKLINE_SEEDS: Record<DashboardTab, number[][]> = {
  Profit: [
    [20, 28, 22, 35, 30, 42, 38, 52, 48, 58],
    [30, 35, 32, 40, 38, 45, 50, 48, 55, 60],
    [25, 28, 30, 27, 33, 35, 32, 38, 36, 40],
  ],
  "Product Type": [
    [10, 18, 15, 28, 22, 35, 30, 40, 45, 52],
    [40, 38, 42, 36, 34, 38, 32, 30, 35, 33],
    [15, 20, 18, 25, 28, 22, 30, 35, 32, 38],
  ],
  Orders: [
    [22, 30, 28, 38, 35, 42, 40, 50, 48, 55],
    [35, 33, 38, 30, 32, 28, 34, 30, 32, 29],
    [60, 62, 58, 65, 63, 68, 66, 70, 68, 72],
  ],
  Features: [
    [30, 35, 38, 42, 40, 48, 45, 50, 52, 55],
    [40, 45, 42, 50, 48, 55, 52, 58, 55, 60],
    [50, 48, 52, 46, 50, 44, 48, 42, 45, 40],
  ],
  "Gross MRR": [
    [80, 88, 85, 95, 92, 100, 98, 110, 105, 115],
    [10, 14, 12, 18, 15, 22, 20, 25, 22, 28],
    [8, 10, 7, 9, 12, 8, 10, 6, 9, 7],
  ],
  ARR: [
    [100, 108, 105, 115, 112, 120, 118, 128, 125, 135],
    [15, 18, 20, 22, 25, 28, 26, 32, 30, 35],
    [12, 10, 14, 11, 13, 9, 12, 10, 11, 9],
  ],
  Customers: [
    [80, 88, 92, 95, 100, 105, 102, 110, 115, 120],
    [50, 55, 53, 58, 60, 62, 58, 65, 63, 68],
    [5, 4, 6, 3, 5, 4, 3, 5, 4, 3],
  ],
  Sales: [
    [120, 135, 128, 150, 145, 160, 155, 172, 168, 180],
    [2, 3, 2, 3, 4, 3, 4, 3, 4, 5],
    [30, 28, 35, 27, 32, 25, 30, 28, 26, 24],
  ],
};

export function getTabCards(tab: DashboardTab) {
  const cards = TAB_CARDS[tab];
  const seeds = SPARKLINE_SEEDS[tab];
  return cards.map((card, i) => ({
    ...card,
    data: seeds[i] ?? seeds[0],
  }));
}
