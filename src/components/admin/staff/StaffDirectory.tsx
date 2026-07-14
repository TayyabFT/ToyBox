"use client";

import Image from "next/image";
import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import { MemberStarStat } from "@/components/common/Svgs";
import type { StaffFilterOption, StaffProfile } from "./types";

function statusTone(status: string): string {
  if (status === "active") {
    return "border-teal/40 text-teal";
  }

  if (status === "pending_activation") {
    return "border-accent/40 text-accent";
  }

  return "border-accent/25 text-secondary";
}

type StaffProfileCardProps = {
  staff: StaffProfile;
};

function StaffProfileCard({ staff }: StaffProfileCardProps) {
  return (
    <article className="rounded-2xl border border-accent/12 bg-card p-5">
      <div className="flex items-start gap-4">
        {staff.profileImageUrl ? (
          <Image
            src={staff.profileImageUrl}
            alt={staff.name}
            width={56}
            height={56}
            className="size-14 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="admin-gold-avatar flex size-14 shrink-0 items-center justify-center rounded-full font-copperplate text-[22px]">
            {staff.initial}
          </span>
        )}

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-roboto text-[13px] font-semibold tracking-[0.06em] text-accent uppercase">
              {staff.name}
            </h2>

            <span className="flex shrink-0 items-center gap-1 rounded-full border border-accent/25 px-2.5 py-1 text-accent">
              <MemberStarStat color="currentColor" className="size-3" />
              <span className="font-roboto text-[9px] font-medium tracking-[0.1em] uppercase">
                {staff.jobTitle}
              </span>
            </span>
          </div>

          <p className="font-roboto truncate text-[10px] tracking-[0.04em] text-secondary lowercase">
            {staff.email}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-xl border border-accent/8 bg-surface/60 px-4 py-3">
        <span className="font-roboto text-[9px] tracking-[0.12em] text-secondary uppercase">
          Account Status
        </span>
        <span
          className={`font-roboto rounded-full border px-3 py-1 text-[9px] font-semibold tracking-[0.1em] uppercase ${statusTone(
            staff.accountStatus,
          )}`}
        >
          {staff.accountStatusLabel}
        </span>
      </div>

      <div className="mt-4 border-t border-accent/8 pt-4">
        <p className="font-roboto text-[10px] tracking-[0.04em] text-secondary">
          Last seen ·{" "}
          <span className="font-medium text-foreground">{staff.lastSeen}</span>
        </p>
      </div>
    </article>
  );
}

function StaffCardSkeleton() {
  return (
    <article className="rounded-2xl border border-accent/12 bg-card p-5">
      <div className="flex items-start gap-4">
        <ShimmerBlock className="size-14 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <ShimmerBlock className="h-3.5 w-36" />
            <ShimmerBlock className="h-6 w-24 rounded-full" />
          </div>
          <ShimmerBlock className="h-2.5 w-44" />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-xl border border-accent/8 bg-surface/60 px-4 py-3">
        <ShimmerBlock className="h-2.5 w-24" />
        <ShimmerBlock className="h-6 w-20 rounded-full" />
      </div>

      <div className="mt-4 border-t border-accent/8 pt-4">
        <ShimmerBlock className="h-2.5 w-32" />
      </div>
    </article>
  );
}

function FiltersSkeleton() {
  const widths = ["w-14", "w-20", "w-28", "w-24"];

  return (
    <div className="flex flex-wrap gap-2" aria-hidden="true">
      {widths.map((width, index) => (
        <ShimmerBlock
          key={index}
          className={`h-8 rounded-full ${width}`}
        />
      ))}
    </div>
  );
}

type StaffDirectoryProps = {
  filters: StaffFilterOption[];
  activeFilter: string;
  onFilterChange: (key: string) => void;
  staff: StaffProfile[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
};

export function StaffDirectory({
  filters,
  activeFilter,
  onFilterChange,
  staff,
  loading,
  loadingMore,
  hasMore,
  onLoadMore,
}: StaffDirectoryProps) {
  return (
    <section className="space-y-5">
      {loading ? (
        <FiltersSkeleton />
      ) : (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;

            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => onFilterChange(filter.key)}
                className={`font-roboto cursor-pointer rounded-full px-4 py-2 text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors ${
                  isActive
                    ? "bg-accent text-dark"
                    : "border border-accent/25 text-accent hover:border-accent/40"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      )}

      {loading ? (
        <div
          className="grid grid-cols-1 gap-4 xl:grid-cols-2"
          aria-busy="true"
          aria-live="polite"
        >
          {Array.from({ length: 4 }, (_, index) => (
            <StaffCardSkeleton key={index} />
          ))}
        </div>
      ) : null}

      {!loading && staff.length === 0 && (
        <p className="font-roboto py-8 text-center text-sm text-secondary">
          No staff found for this filter.
        </p>
      )}

      {!loading && staff.length > 0 && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {staff.map((member) => (
            <StaffProfileCard key={member.id} staff={member} />
          ))}
        </div>
      )}

      {!loading && hasMore && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            disabled={loadingMore}
            onClick={onLoadMore}
            className="font-roboto cursor-pointer rounded-full border border-accent/25 px-5 py-2.5 text-[10px] font-semibold tracking-[0.12em] text-accent uppercase transition-colors hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingMore ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </section>
  );
}
