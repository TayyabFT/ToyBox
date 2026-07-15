"use client";

import Link from "next/link";
import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import {
  MemberProfileArrow,
  MemberStarStat,
} from "@/components/common/Svgs";
import type { MemberFilterOption, MemberTierFilter } from "@/types/api";
import type { MemberProfile } from "./types";

type MemberStatItemProps = {
  value: number;
  label: string;
  showDivider?: boolean;
};

function MemberStatItem({ value, label, showDivider = true }: MemberStatItemProps) {
  return (
    <div
      className={`flex flex-1 flex-col items-center justify-center py-1 ${
        showDivider ? "border-r border-accent/10" : ""
      }`}
    >
      <p className="font-copperplate text-[28px] leading-none text-accent">
        {value.toLocaleString()}
      </p>
      <p className="mt-1.5 font-roboto text-[9px] tracking-[0.12em] text-secondary uppercase">
        {label}
      </p>
    </div>
  );
}

type MemberProfileCardProps = {
  member: MemberProfile;
};

function MemberProfileCard({ member }: MemberProfileCardProps) {
  return (
    <article className="rounded-2xl border border-accent/12 bg-card p-5">
      <div className="flex items-start gap-4">
        <span className="admin-gold-avatar flex size-14 shrink-0 items-center justify-center rounded-full font-copperplate text-[22px]">
          {member.initial}
        </span>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-roboto text-[13px] font-semibold tracking-[0.06em] text-accent uppercase">
              {member.name}
            </h2>

            <span className="flex shrink-0 items-center gap-1 rounded-full border border-accent/25 px-2.5 py-1 text-accent">
              <MemberStarStat color="currentColor" className="size-3" />
              <span className="font-roboto text-[9px] font-medium tracking-[0.1em] uppercase">
                {member.tier}
              </span>
            </span>
          </div>

          <p className="font-roboto text-[10px] tracking-[0.06em] text-secondary uppercase">
            No. {member.memberNo} · Since {member.since}
          </p>
        </div>
      </div>

      <div className="mt-5 flex rounded-xl border border-accent/8 bg-surface/60 px-1 py-3">
        <MemberStatItem value={member.vehicles} label="Vehicles" />
        <MemberStatItem value={member.events} label="Events" />
        <MemberStatItem value={member.miles} label="Miles" />
        <MemberStatItem value={member.days} label="Days" showDivider={false} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 border-t border-accent/8 pt-4">
        <p className="font-roboto text-[10px] tracking-[0.04em] text-secondary">
          Last seen ·{" "}
          <span className="font-medium text-foreground">{member.lastSeen}</span>
        </p>

        <Link
          href={`/admin/members/${member.id}`}
          className="admin-gold-cta font-roboto flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[9px] font-semibold tracking-[0.12em] uppercase"
        >
          Profile
          <MemberProfileArrow className="size-3" />
        </Link>
      </div>
    </article>
  );
}

function MemberCardSkeleton() {
  return (
    <article className="rounded-2xl border border-accent/12 bg-card p-5">
      <div className="flex items-start gap-4">
        <ShimmerBlock className="size-14 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <ShimmerBlock className="h-3.5 w-36" />
            <ShimmerBlock className="h-6 w-20 rounded-full" />
          </div>
          <ShimmerBlock className="h-2.5 w-40" />
        </div>
      </div>

      <div className="mt-5 flex gap-2 rounded-xl border border-accent/8 bg-surface/60 px-3 py-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-2">
            <ShimmerBlock className="h-7 w-10" />
            <ShimmerBlock className="h-2 w-12" />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 border-t border-accent/8 pt-4">
        <ShimmerBlock className="h-2.5 w-32" />
        <ShimmerBlock className="h-7 w-20 rounded-full" />
      </div>
    </article>
  );
}

function FiltersSkeleton() {
  const widths = ["w-14", "w-20", "w-24", "w-16", "w-28"];

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

type MembersDirectoryProps = {
  filters: MemberFilterOption[];
  activeTier: MemberTierFilter;
  onTierChange: (tier: MemberTierFilter) => void;
  members: MemberProfile[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
};

export function MembersDirectory({
  filters,
  activeTier,
  onTierChange,
  members,
  loading,
  loadingMore,
  hasMore,
  onLoadMore,
}: MembersDirectoryProps) {
  return (
    <section className="space-y-5">
      {loading ? (
        <FiltersSkeleton />
      ) : (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const isActive = activeTier === filter.key;

            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => onTierChange(filter.key as MemberTierFilter)}
                className={`font-roboto cursor-pointer rounded-full px-4 py-2 text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors ${
                  isActive
                    ? "admin-gold-cta"
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
            <MemberCardSkeleton key={index} />
          ))}
        </div>
      ) : null}

      {!loading && members.length === 0 && (
        <p className="font-roboto py-8 text-center text-sm text-secondary">
          No members found for this filter.
        </p>
      )}

      {!loading && members.length > 0 && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {members.map((member) => (
            <MemberProfileCard key={member.id} member={member} />
          ))}
        </div>
      )}

      {!loading && hasMore && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            disabled={loadingMore}
            onClick={onLoadMore}
            className="admin-gold-cta font-roboto cursor-pointer rounded-full px-5 py-2.5 text-[10px] font-semibold tracking-[0.12em] uppercase disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingMore ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </section>
  );
}
