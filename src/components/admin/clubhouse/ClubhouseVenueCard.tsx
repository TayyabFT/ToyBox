import Link from "next/link";
import type { ElementType } from "react";
import { ClubhouseVenueStatusBadge } from "./ClubhouseVenueStatusBadge";
import type { ClubhouseVenueCard } from "./types";

type ClubhouseVenueCardProps = {
  venue: ClubhouseVenueCard;
};

export function ClubhouseVenueCardItem({ venue }: ClubhouseVenueCardProps) {
  const available = Math.max(0, venue.capacity - venue.occupied);
  const progressPercent =
    venue.capacity > 0
      ? Math.min(100, Math.round((venue.occupied / venue.capacity) * 100))
      : 0;

  const Container: ElementType = venue.href ? Link : "article";
  const containerProps = venue.href
    ? { href: venue.href }
    : {};

  return (
    <Container
      {...containerProps}
      className={`flex h-full flex-col rounded-2xl border border-accent/12 bg-card p-5${
        venue.href
          ? " transition-colors hover:border-primary/40 hover:bg-accent/5"
          : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-copperplate text-[15px] leading-tight tracking-[0.06em] uppercase">
          {venue.title.before ? (
            <span className="text-foreground">{venue.title.before}</span>
          ) : null}
          <span className="text-accent">{venue.title.highlight}</span>
          {venue.title.after ? (
            <span className="text-foreground">{venue.title.after}</span>
          ) : null}
        </h2>
        <ClubhouseVenueStatusBadge
          label={venue.statusLabel}
          tone={venue.statusTone}
        />
      </div>

      <p className="mt-2 font-roboto text-[10px] tracking-[0.12em] text-secondary uppercase">
        {venue.subtitle}
      </p>

      <div className="mt-5 space-y-2">
        <div className="h-[3px] overflow-hidden rounded-full bg-accent/10">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="font-roboto text-[9px] tracking-[0.12em] uppercase">
            <span className="text-secondary">Available </span>
            <span className="font-medium text-teal">{available}</span>
          </span>
          <span className="font-roboto text-[9px] tracking-[0.12em] uppercase">
            <span className="text-secondary">Occupied </span>
            <span className="font-medium text-primary">{venue.occupied}</span>
          </span>
        </div>
      </div>

      <ul className="mt-5 space-y-3 border-t border-accent/8 pt-4">
        {venue.details.map((detail) => (
          <li
            key={detail.label}
            className="flex items-start justify-between gap-4"
          >
            <span
              className={`font-roboto text-[11px] tracking-[0.02em] ${
                detail.labelTone === "muted" ? "text-secondary" : "text-primary"
              }`}
            >
              {detail.label}
            </span>
            <span className="font-roboto text-right text-[11px] tracking-[0.02em] text-muted">
              {detail.value}
            </span>
          </li>
        ))}
      </ul>
    </Container>
  );
}
