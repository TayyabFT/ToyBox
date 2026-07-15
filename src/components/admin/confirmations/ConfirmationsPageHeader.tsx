"use client";

import { useEffect, useState } from "react";
import { formatStaffDateShiftLine } from "@/lib/staffShift";

export function ConfirmationsPageHeader() {
  const [dateShiftLine, setDateShiftLine] = useState("");

  useEffect(() => {
    const update = () => setDateShiftLine(formatStaffDateShiftLine());

    update();
    const interval = setInterval(update, 60_000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2">
      <p className="font-roboto text-[11px] tracking-[0.14em] text-section-label uppercase">
        {dateShiftLine || "\u00A0"}
      </p>
      <h1 className="font-copperplate text-[32px] leading-tight tracking-[0.04em] uppercase sm:text-[36px]">
        <span className="text-accent">Bookings</span>
      </h1>
    </div>
  );
}
