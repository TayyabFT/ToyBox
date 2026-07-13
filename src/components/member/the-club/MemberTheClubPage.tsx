"use client";

import { useEffect, useState } from "react";
import { clubhouseApi } from "@/api/clubhouse.api";
import { mapClubVenues, buildClubStatusLine } from "@/lib/memberDashboard";
import { VenueCard } from "@/components/member/dashboard/MemberClubSection";
import type { MemberClubVenue } from "@/components/member/dashboard/types";
import { ReservationModal } from "./ReservationModal";

function TheClubSkeleton() {
  return (
    <div className="mx-auto w-full space-y-8 px-8 pb-12 pt-5 sm:space-y-10 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-32 rounded bg-elevated" />
        <div className="h-10 w-64 rounded bg-elevated" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="overflow-hidden rounded-[18px] border border-accent/10 bg-card">
            <div className="h-[320px] w-full bg-elevated" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MemberTheClubPage() {
  const [venues, setVenues] = useState<MemberClubVenue[]>([]);
  const [statusLine, setStatusLine] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedVenue, setSelectedVenue] = useState<MemberClubVenue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const loadClubhouse = () => {
    setLoading(true);
    setError(null);
    clubhouseApi
      .getOverview()
      .then((res) => {
        if (res.success && res.data) {
          // Map spaces with NO limit so we display all available venues
          const mappedVenues = mapClubVenues(res.data);
          const status = buildClubStatusLine(res.data);
          setVenues(mappedVenues);
          setStatusLine(status);
        } else {
          setError(res.message || "Failed to load clubhouse spaces");
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
    loadClubhouse();
  }, []);

  if (loading) {
    return <TheClubSkeleton />;
  }

  if (error) {
    return (
      <div className="mx-auto w-full  px-8 py-16 flex flex-col items-center justify-center text-center space-y-6">
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
          <h2 className="font-copperplate text-[20px] tracking-[0.06em] text-foreground uppercase">
            Clubhouse Temporarily Offline
          </h2>
          <p className="font-roboto max-w-sm text-[13px] leading-relaxed text-secondary/80">
            {error}. Please check your connection or contact concierge if the issue persists.
          </p>
        </div>
        <button
          type="button"
          onClick={loadClubhouse}
          className="font-roboto rounded-full border border-accent/30 bg-accent/5 px-6 py-2 text-[11px] font-semibold tracking-[0.14em] text-accent uppercase transition-colors hover:border-accent/50 hover:bg-accent/10"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full  space-y-8 px-8 pb-12 pt-5 sm:space-y-10">
      {/* Page header */}
      <div className="space-y-1.5">
        <p className="font-roboto text-[10px] font-medium tracking-[0.24em] text-secondary uppercase">
          {statusLine}
        </p>
        <h1 className="font-copperplate text-[38px] font-light leading-none tracking-[-0.75px] uppercase sm:text-[46px]">
          <span className="text-foreground">The </span>
          <span className="font-normal text-primary">Club</span>
        </h1>
      </div>

      {/* Grid of venue cards */}
      {venues.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              onClick={(e) => {
                e.preventDefault();
                setSelectedVenue(venue);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-accent/10 bg-card py-16 text-center">
          <p className="font-copperplate text-[18px] text-foreground uppercase tracking-[0.05em]">
            No Spaces Available
          </p>
          <p className="font-roboto text-[12px] text-secondary/65">
            There are currently no spaces or venues published.
          </p>
        </div>
      )}

      {/* Reservation Modal */}
      {isModalOpen && selectedVenue && (
        <ReservationModal
          venue={selectedVenue}
          allVenues={venues}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
