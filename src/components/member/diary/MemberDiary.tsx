"use client";

import { useEffect, useState, useCallback } from "react";
import { DiaryHeader } from "./DiaryHeader";
import { DiaryTimeline } from "./DiaryTimeline";
import { diaryApi } from "@/api/diary.api";
import { Skeleton } from "@/components/common/Skeleton";
import { useAppSelector } from "@/store/hooks";
import type { MemberDiaryData } from "./types";

export function MemberDiarySkeleton() {
  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-6 animate-pulse">
        {/* Page title skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-24 sm:w-28" />
          <Skeleton className="h-7 sm:h-9 w-40 sm:w-64" />
        </div>

        {/* Record hero card skeleton */}
        <div className="diary-record-card relative overflow-hidden rounded-[24px] border border-accent/22 p-4 sm:p-5">
          <div className="space-y-3 sm:p-4 md:p-2">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-5 sm:h-6 w-3/4 sm:w-1/2" />
            <Skeleton className="h-4 w-full max-w-xl" />
            <Skeleton className="h-4 w-5/6 max-w-md" />
          </div>

          {/* Stats skeleton bottom bar */}
          <div className="diary-record-stats mt-4 sm:mt-6 grid grid-cols-2 gap-y-4 sm:gap-y-6 rounded-[23px] p-3 sm:p-4 text-center sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center justify-center space-y-2 py-2">
                <Skeleton className="h-7 sm:h-8 w-10 sm:w-12 rounded" />
                <Skeleton className="h-3 sm:h-3.5 w-14 sm:w-16 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline skeleton */}
      <div className="relative space-y-8 pl-1">
        {/* Group Header */}
        <div className="space-y-2">
          <Skeleton className="h-4 sm:h-5 w-28 sm:w-32" />
          <Skeleton className="h-3 w-16" />
        </div>

        {/* Timeline Items */}
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="relative pb-8 flex">
            {/* Timeline node */}
            <div className="absolute left-[0px] w-6 top-0 bottom-0 flex justify-center">
              <span className="absolute left-1/2 w-px -translate-x-1/2 bg-accent/18 top-0 bottom-0" />
              <span className="relative z-10 mt-1.5 flex size-3 items-center justify-center rounded-full border border-accent/50 bg-background shadow-[0_0_0_4px_var(--background)]">
                <span className="size-1 rounded-full bg-accent" />
              </span>
            </div>

            {/* Content card skeleton */}
            <div className="min-w-0 ml-10 flex-1 space-y-3">
              {/* Date & Time */}
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-4 sm:h-5 w-40 sm:w-72" />
              </div>
              {/* Optional Hero Image for first item */}
              {idx === 0 && (
                <Skeleton className="h-[150px] sm:h-[200px] md:h-[220px] w-full rounded-[18px] border border-accent/10" />
              )}
              {/* Description lines */}
              <div className="space-y-2 max-w-2xl">
                <Skeleton className="h-3.5 sm:h-4 w-full" />
                <Skeleton className="h-3.5 sm:h-4 w-11/12" />
                <Skeleton className="h-3.5 sm:h-4 w-3/4" />
              </div>
              {/* Tags */}
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="h-6 w-14 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MemberDiary() {
  const [data, setData] = useState<MemberDiaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Watch for parking (or any) actions that invalidate the diary
  const invalidatedAt = useAppSelector((state) => state.diary.invalidatedAt);

  const loadDiary = useCallback(() => {
    setLoading(true);
    setError(null);
    diaryApi
      .getDiary()
      .then((res) => {
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError(res.message || "Failed to load diary");
        }
      })
      .catch((err: { message?: string }) => {
        setError(err.message || "An error occurred");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Initial load
  useEffect(() => {
    loadDiary();
  }, [loadDiary]);

  // Refetch whenever something invalidates the diary (e.g. parking submission)
  useEffect(() => {
    if (invalidatedAt === 0) return;
    loadDiary();
  }, [invalidatedAt, loadDiary]);

  if (loading) {
    return <MemberDiarySkeleton />;
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <h2 className="font-copperplate text-[18px] tracking-[0.06em] text-foreground uppercase">
          Diary Unavailable
        </h2>
        <p className="font-roboto max-w-sm text-sm text-secondary/80">
          {error || "We encountered an issue retrieving your diary details. Please check your network and try again."}
        </p>
        <button
          type="button"
          onClick={loadDiary}
          className="font-roboto rounded-lg border border-accent/30 bg-accent/5 px-5 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-accent uppercase transition-colors hover:border-accent/50 hover:bg-accent/10"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
      <DiaryHeader
        eyebrow={data.eyebrow}
        title={data.title}
        recordEyebrow={data.recordEyebrow}
        recordTitlePrefix={data.recordTitlePrefix}
        recordTitleHighlight={data.recordTitleHighlight}
        recordSubtitle={data.recordSubtitle}
        stats={data.stats}
      />

      <DiaryTimeline groups={data.groups} />
    </div>
  );
}
