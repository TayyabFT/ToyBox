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
          className={`font-roboto rounded-full px-4 py-2 text-[10px] font-semibold tracking-[0.12em] uppercase transition-colors ${
            activeId === tab.id
              ? "bg-primary text-dark"
              : "border border-accent/20 bg-transparent text-secondary hover:border-primary/35 hover:text-primary"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
