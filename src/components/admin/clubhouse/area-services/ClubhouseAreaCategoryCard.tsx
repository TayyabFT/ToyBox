import { ClubhouseVenueStatusBadge } from "../ClubhouseVenueStatusBadge";
import type { ClubhouseAreaCategoryCard as ClubhouseAreaCategoryCardData } from "./types";

type ClubhouseAreaCategoryCardProps = {
  category: ClubhouseAreaCategoryCardData;
  active: boolean;
  onSelect: () => void;
};

export function ClubhouseAreaCategoryCard({
  category,
  active,
  onSelect,
}: ClubhouseAreaCategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex flex-col rounded-2xl border p-5 text-left transition-colors ${
        active
          ? "border-primary/45 bg-accent/6"
          : "border-accent/12 bg-card hover:border-primary/30 hover:bg-accent/4"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-copperplate text-[14px] leading-tight tracking-[0.06em] uppercase">
          {category.title.before ? (
            <span className="text-foreground">{category.title.before}</span>
          ) : null}
          <span className="text-accent">{category.title.highlight}</span>
          {category.title.after ? (
            <span className="text-foreground">{category.title.after}</span>
          ) : null}
        </h3>
        <ClubhouseVenueStatusBadge
          label={category.statusLabel}
          tone={category.statusTone}
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="font-roboto text-[10px] tracking-[0.12em] uppercase">
          <span className="text-secondary">Available </span>
          <span className="font-medium text-teal">{category.available}</span>
        </span>
        <span className="font-roboto text-[10px] tracking-[0.12em] uppercase">
          <span className="text-secondary">Occupied </span>
          <span className="font-medium text-primary">{category.occupied}</span>
        </span>
      </div>

      {category.topItems.length > 0 ? (
        <ul className="mt-4 space-y-2.5 border-t border-accent/8 pt-4">
          {category.topItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4"
            >
              <span className="font-roboto truncate text-[11px] tracking-[0.02em] text-primary">
                {item.label}
              </span>
              <span className="font-roboto shrink-0 text-[11px] tracking-[0.02em] text-muted">
                {item.value}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </button>
  );
}
