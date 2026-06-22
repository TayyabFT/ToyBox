"use client";

import Link from "next/link";
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
      <p className="font-copperplate text-[28px] leading-none text-primary">
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
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#F0C566] to-[#8B6F2A] font-copperplate text-[22px] text-dark shadow-[0_0_24px_rgba(201,168,76,0.32)]">
          {member.initial}
        </span>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-roboto text-[13px] font-semibold tracking-[0.06em] text-primary uppercase">
              {member.name}
            </h2>

            <span className="flex shrink-0 items-center gap-1 rounded-full border border-accent/25 px-2.5 py-1">
              <MemberStarStat color="var(--primary)" className="size-3" />
              <span className="font-roboto text-[9px] font-medium tracking-[0.1em] text-primary uppercase">
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
          className="font-roboto flex cursor-pointer items-center gap-1.5 rounded-full border border-accent/25 px-3.5 py-1.5 text-[9px] font-semibold tracking-[0.12em] text-primary uppercase transition-colors hover:border-primary/50 hover:bg-accent/8"
        >
          Profile
          <MemberProfileArrow className="size-3" />
        </Link>
      </div>
    </article>
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
                  ? "bg-primary text-dark"
                  : "border border-accent/25 text-primary hover:border-primary/40"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {loading && (
        <p className="font-roboto py-8 text-center text-sm text-secondary">
          Loading members...
        </p>
      )}

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
            className="font-roboto cursor-pointer rounded-full border border-accent/25 px-5 py-2.5 text-[10px] font-semibold tracking-[0.12em] text-primary uppercase transition-colors hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingMore ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </section>
  );
}
