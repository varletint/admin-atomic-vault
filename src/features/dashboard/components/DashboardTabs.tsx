interface DashboardTabsProps {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}

export function DashboardTabs({ tabs, active, onChange }: DashboardTabsProps) {
  return (
    <div className='flex gap-0 border-b border-[var(--color-border)] overflow-x-auto'>
      {tabs.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={[
              "px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] whitespace-nowrap transition-colors",
              isActive
                ? "border-b-2 border-admin-ink text-admin-ink"
                : "border-b-2 border-transparent text-admin-muted hover:text-admin-ink",
            ].join(" ")}>
            {tab}
          </button>
        );
      })}
    </div>
  );
}
