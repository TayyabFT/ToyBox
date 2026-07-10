"use client";

import { useEffect, useState } from "react";
import { DiaryHeader } from "./DiaryHeader";
import { DiaryTimeline } from "./DiaryTimeline";
import { diaryApi } from "@/api/diary.api";
import { Skeleton } from "@/components/common/Skeleton";
import type { MemberDiaryData } from "./types";

export function MemberDiarySkeleton() {
  return (
    <div className="mx-auto w-full  space-y-8 px-8 pb-8 pt-4 sm:space-y-10 sm:py-6">
      {/* Header Skeleton */}
      <div className="space-y-6 animate-pulse">
        {/* Page title skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-24 sm:w-28" />
          <Skeleton className="h-9 w-48 sm:w-64" />
        </div>

        {/* Record hero card skeleton */}
        <div className="relative overflow-hidden rounded-[24px] border border-accent/22 bg-surface p-5">
          <div className="sm:p-7 md:p-2 space-y-3">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-6 w-3/4 sm:w-1/2" />
            <Skeleton className="h-4 w-full max-w-xl" />
            <Skeleton className="h-4 w-5/6 max-w-md" />
          </div>

          {/* Stats skeleton bottom bar */}
          <div className="mt-6 bg-black/45 grid grid-cols-2 gap-y-6 sm:grid-cols-4 rounded-[23px] p-4 text-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center justify-center space-y-2 py-2">
                <Skeleton className="h-8 w-12 rounded" />
                <Skeleton className="h-3.5 w-16 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline skeleton */}
      <div className="relative space-y-8 pl-1">
        {/* Group Header */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
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
                <Skeleton className="h-5 w-48 sm:w-72" />
              </div>
              {/* Optional Hero Image for first item */}
              {idx === 0 && (
                <Skeleton className="h-[170px] w-full sm:h-[200px] md:h-[220px] rounded-[18px] border border-accent/10" />
              )}
              {/* Description lines */}
              <div className="space-y-2 max-w-2xl">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-3/4" />
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

  const loadDiary = () => {
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
      .catch((err) => {
        setError(err.message || "An error occurred");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadDiary();
  }, []);

  if (loading) {
    return <MemberDiarySkeleton />;
  }

  if (error || !data) {
    return (
      <div className="mx-auto w-full max-w-5xl px-8 py-16 flex flex-col items-center justify-center text-center space-y-6">
        <div className="rounded-full bg-destructive/10 p-4 border border-destructive/20 text-destructive animate-bounce">
          <svg
            className="size-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="font-copperplate text-xl font-light text-foreground tracking-[0.05em] uppercase">
            Unable to Load Diary
          </h2>
          <p className="font-roboto max-w-md text-sm text-secondary/70 leading-relaxed">
            {error || "We encountered an issue retrieving your diary details. Please check your network and try again."}
          </p>
        </div>
        <button
          onClick={loadDiary}
          className="font-roboto inline-flex items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-xs font-semibold tracking-wider text-black transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
        >
          TRY AGAIN
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-8 pb-8 pt-4 sm:space-y-10 sm:py-6">
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
