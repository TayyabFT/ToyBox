type ClubhouseAreaFilterTab = {
  id: string;
  label: string;
};

type ClubhouseAreaFilterTabsProps = {
  tabs: ClubhouseAreaFilterTab[];
  activeId: string;
  onSelect: (id: string) => void;
};

export function ClubhouseAreaFilterTabs({
  tabs,
  activeId,
  onSelect,
}: ClubhouseAreaFilterTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onSelect(tab.id)}
          className={`font-roboto cursor-pointer rounded-full px-4 py-2 text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors ${
            activeId === tab.id
              ? "admin-gold-cta"
              : "border border-accent/25 text-accent hover:border-accent/40"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
