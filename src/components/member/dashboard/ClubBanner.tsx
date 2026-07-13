"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { MemberClubVenue } from "./types";

type Slide = {
  id: string;
  imageUrl: string;
  headline: React.ReactNode;
  subtitle: string;
  cta?: { label: string; href: string };
};

const defaultSlides: Slide[] = [
  {
    id: "1",
    imageUrl:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=85",
    headline: (
      <>
        <span className="text-white">Your </span>
        <span className="text-accent">Private </span>
        <br />
        <span className="text-white">Automotive </span>
        <span className="text-accent">Club.</span>
      </>
    ),
    subtitle:
      "An exclusive membership experience built around the world's finest automobiles — curated for those who demand the extraordinary.",
    cta: { label: "Explore the Club", href: "/member/the-club" },
  },
  {
    id: "2",
    imageUrl:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=85",
    headline: (
      <>
        <span className="text-white">White-Glove </span>
        <span className="text-accent">Care</span>
        <br />
        <span className="text-white">At Every </span>
        <span className="text-accent">Turn.</span>
      </>
    ),
    subtitle:
      "Every detail of your vehicle's care is managed by our specialist team — from inspection to valet, handled with precision and discretion.",
    cta: { label: "Book a Service", href: "/member/concierge" },
  },
  {
    id: "3",
    imageUrl:
      "https://images.unsplash.com/photo-1562141961-b6cbb3b74fd4?w=1200&q=85",
    headline: (
      <>
        <span className="text-white">Secure </span>
        <span className="text-accent">Vehicle</span>
        <br />
        <span className="text-white">Seamless </span>
        <span className="text-accent">Service.</span>
      </>
    ),
    subtitle:
      "Inspection, maintenance, and movement of your vehicles handled with precision, privacy, and white-glove care — ensuring a seamless ownership experience at every touchpoint.",
    cta: { label: "Request Service", href: "/member/concierge" },
  },
];

function formatVenueHeadline(name: string): React.ReactNode {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length <= 1) {
    return <span className="text-white">{name}</span>;
  }

  const accent = words.pop();

  return (
    <>
      <span className="text-white">{words.join(" ")} </span>
      <span className="text-accent">{accent}</span>
    </>
  );
}

function buildSlidesFromVenues(venues: MemberClubVenue[]): Slide[] {
  return venues.slice(0, 3).map((venue) => ({
    id: venue.id,
    imageUrl: venue.imageUrl,
    headline: formatVenueHeadline(venue.name),
    subtitle:
      venue.description ||
      "Restaurant, bar and private spaces — reserved exclusively for members.",
    cta: {
      label: venue.actionLabel ?? "Reserve",
      href: venue.href ?? "/member/concierge",
    },
  }));
}

type ClubBannerProps = {
  venues?: MemberClubVenue[];
};

export function ClubBanner({ venues }: ClubBannerProps) {
  const slides = useMemo(() => {
    if (venues?.length) {
      return buildSlidesFromVenues(venues);
    }

    return defaultSlides;
  }, [venues]);

  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (animating || index === current) return;
      setAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setAnimating(false);
      }, 300);
    },
    [animating, current],
  );

  // Auto-advance every 5 seconds
  useEffect(() => {
    setCurrent(0);
  }, [slides]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[current];
  const slideNumber = String(current + 1).padStart(2, "0");
  const totalNumber = String(slides.length).padStart(2, "0");

  return (
    <div className="relative flex h-full min-h-[200px] overflow-hidden rounded-2xl border border-primary/25">
      {/* Background images — cross-fade */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          aria-hidden
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img
            src={s.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ))}

      {/* Dark gradient overlay — stronger at bottom for text legibility */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(4,3,2,0.96) 0%, rgba(4,3,2,0.7) 38%, rgba(4,3,2,0.28) 70%, rgba(4,3,2,0.18) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative flex h-full min-h-[200px] w-full flex-col justify-end p-6 space-y-3">
        {/* Headline */}
        <h3
          className={[
            "font-copperplate text-[22px] leading-tight uppercase transition-opacity duration-300",
            animating ? "opacity-0" : "opacity-100",
          ].join(" ")}
        >
          {slide.headline}
        </h3>

        {/* Subtitle */}
        <p
          className={[
            "font-roboto text-[11px] leading-relaxed tracking-[0.03em] text-white/55 transition-opacity duration-300",
            animating ? "opacity-0" : "opacity-100",
          ].join(" ")}
        >
          {slide.subtitle}
        </p>

        {/* Bottom row: counter left + dots right */}
        <div className="flex items-center justify-between pt-1">
          {/* Slide counter */}
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-white/25" />
            <span className="font-roboto text-[10px] tracking-[0.18em] text-white/40">
              {slideNumber} / {totalNumber}
            </span>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={[
                  "h-[3px] cursor-pointer rounded-full transition-all duration-300",
                  i === current
                    ? "w-6 bg-accent"
                    : "w-3 bg-white/25 hover:bg-white/40",
                ].join(" ")}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
