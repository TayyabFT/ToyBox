"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { authApi } from "@/api/auth.api";
import { clubhouseApi } from "@/api/clubhouse.api";
import type { MemberClubVenue } from "@/components/member/dashboard/types";
import { IconSelectArea, IconCalendar } from "@/components/common/Svgs";
import type { ClubhouseSlotAvailability, ClubhouseReservationResponseData } from "@/types/api";

type ReservationModalProps = {
  venue: MemberClubVenue;
  onClose: () => void;
  allVenues?: MemberClubVenue[];
};

export function ReservationModal({ venue, onClose, allVenues = [] }: ReservationModalProps) {
  const [step, setStep] = useState<number>(1);

  // Step 1 states
  const [selectedArea, setSelectedArea] = useState<string>(venue.name);
  const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState<boolean>(false);
  const [areaSearch, setAreaSearch] = useState<string>("");

  // Calendar state
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const formatDateLabel = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const [selectedDate, setSelectedDate] = useState<string>(formatDateLabel(tomorrow));
  const [selectedDateObj, setSelectedDateObj] = useState<Date>(tomorrow);
  const [calendarDate, setCalendarDate] = useState<Date>(
    new Date(tomorrow.getFullYear(), tomorrow.getMonth(), 1)
  );
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState<boolean>(false);
  // "day" = day grid, "month" = month picker, "year" = year range picker
  const [calendarView, setCalendarView] = useState<"day" | "month" | "year">("day");
  const [yearRangeStart, setYearRangeStart] = useState<number>(
    Math.floor(tomorrow.getFullYear() / 12) * 12
  );

  const calendarDays = (() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7; // Monday-based
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  })();

  const times = [
    "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM",
    "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM",
    "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM"
  ];
  const [selectedTime, setSelectedTime] = useState<string>("1:30 PM");

  const [slotsAvailability, setSlotsAvailability] = useState<ClubhouseSlotAvailability[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState<boolean>(false);

  const [guests, setGuests] = useState<number>(4);

  const occasions = ["Business Lunch", "Birthday", "Anniversary", "Client Dinner", "Casual Dining"];
  const [selectedOccasion, setSelectedOccasion] = useState<string>("Business Lunch");
  const [isOccasionDropdownOpen, setIsOccasionDropdownOpen] = useState<boolean>(false);

  const [specialRequests, setSpecialRequests] = useState<string>("");

  // Step 2 states
  const [memberName, setMemberName] = useState<string>("James Al-Farsi");
  const [memberNumber, setMemberNumber] = useState<string>("No. 022142");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [arrivalNote, setArrivalNote] = useState<string>("");

  // Step 3 states
  const [paymentMethod, setPaymentMethod] = useState<"account" | "card">("account");
  const [agreedToPolicy, setAgreedToPolicy] = useState<boolean>(true);

  // Submission states
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmationData, setConfirmationData] = useState<ClubhouseReservationResponseData | null>(null);

  // Dropdown refs for click-outside
  const areaRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const occasionRef = useRef<HTMLDivElement>(null);
  // Portal calendar refs
  const dateTriggerRef = useRef<HTMLButtonElement>(null);
  const calendarPortalRef = useRef<HTMLDivElement>(null);
  const [calendarPos, setCalendarPos] = useState({ top: 0, left: 0, width: 0 });

  // Fetch real profile details if available, else fallback to Figma defaults
  useEffect(() => {
    authApi.getProfile()
      .then((res) => {
        if (res.success && res.data) {
          if (res.data.fullName || res.data.name) {
            setMemberName(res.data.fullName || res.data.name || "James Al-Farsi");
          }
          if (res.data.id) {
            const formatted = String(res.data.id).slice(0, 6).padStart(6, "0");
            setMemberNumber(`No. ${formatted}`);
          }
          if (res.data.mobile) {
            setContactNumber(res.data.mobile);
          }
        }
      })
      .catch(() => {
        // use default James Al-Farsi
      });
  }, []);

  // Recalculate calendar popup position when it opens
  useEffect(() => {
    if (isDateDropdownOpen && dateTriggerRef.current) {
      const rect = dateTriggerRef.current.getBoundingClientRect();
      setCalendarPos({ top: rect.bottom + 6, left: rect.left, width: rect.width });
    }
  }, [isDateDropdownOpen]);

  // Click outside listener for dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (areaRef.current && !areaRef.current.contains(event.target as Node)) {
        setIsAreaDropdownOpen(false);
      }
      // Close date calendar if click is outside both trigger and portal
      if (
        dateRef.current && !dateRef.current.contains(event.target as Node) &&
        calendarPortalRef.current && !calendarPortalRef.current.contains(event.target as Node)
      ) {
        setIsDateDropdownOpen(false);
      }
      if (occasionRef.current && !occasionRef.current.contains(event.target as Node)) {
        setIsOccasionDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Map selected name to areaId
  const currentVenue = allVenues.find(v => v.name === selectedArea) || venue;
  const areaId = currentVenue?.id;

  // Fetch slot availability from API
  useEffect(() => {
    if (!areaId) return;
    setLoadingAvailability(true);
    const dateStr = selectedDateObj.toISOString().slice(0, 10);
    clubhouseApi.getAvailability(areaId, dateStr, guests)
      .then((res) => {
        if (res.success && res.data?.slots) {
          setSlotsAvailability(res.data.slots);

          // Auto-select first available time slot if the current is not available
          const currentSlot = res.data.slots.find(s => s.timeSlot === selectedTime);
          if (!currentSlot || !currentSlot.available) {
            const firstAvail = res.data.slots.find(s => s.available);
            if (firstAvail) {
              setSelectedTime(firstAvail.timeSlot);
            }
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load availability slots:", err);
      })
      .finally(() => {
        setLoadingAvailability(false);
      });
  }, [areaId, selectedDateObj, guests]);

  // Submit reservation to API
  const handleConfirmReservation = () => {
    if (submitting) return;

    // Client-side guards for required fields
    if (!areaId) {
      setSubmitError("Please select a valid space to reserve.");
      return;
    }
    if (!selectedTime) {
      setSubmitError("Please select a time slot.");
      return;
    }
    if (guests < 1) {
      setSubmitError("At least 1 guest is required.");
      return;
    }
    if (!agreedToPolicy) {
      setSubmitError("You must accept the cancellation policy to confirm.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const dateStr = selectedDateObj.toISOString().slice(0, 10);
    const billedToMapped = paymentMethod === "card" ? "saved_card" : "member_account";

    clubhouseApi.createReservation({
      areaId,
      date: dateStr,
      timeSlot: selectedTime,
      guests,
      occasion: selectedOccasion || null,
      specialRequests: specialRequests || null,
      contactNumber: contactNumber || null,
      arrivalNote: arrivalNote || null,
      billedTo: billedToMapped,
      acceptCancellationPolicy: agreedToPolicy,
    })
      .then((res) => {
        if (res.success && res.data) {
          setConfirmationData(res.data);
          setStep(4);
        } else {
          setSubmitError(res.message || "Failed to confirm reservation");
        }
      })
      .catch((err) => {
        setSubmitError(err.message || "An unexpected error occurred. Please try again.");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  // Pricing calculations
  const isRestaurant = selectedArea.toLowerCase().includes("restaurant") || selectedArea.toLowerCase().includes("clubhouse");
  const isSuite = selectedArea.toLowerCase().includes("suite");

  const tableHoldCost = isSuite ? 400 : 0;
  const fbMinimum = isSuite ? 200 : isRestaurant ? (guests * 200) : 300;
  const totalCost = tableHoldCost + fbMinimum;

  // Venues to display in dropdown
  const venueOptions = allVenues.length > 0
    ? allVenues.map(v => v.name)
    : ["The Clubhouse Restaurant", "Members' Lounge", "Private Suites"];

  const filteredVenues = venueOptions.filter(name =>
    name.toLowerCase().includes(areaSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      {/* Modal Container */}
      <div className="Custom__Scrollbar relative w-full max-w-[480px] max-h-[92vh] bg-[#0A0907] border border-accent/20 rounded-[20px] shadow-2xl flex flex-col overflow-y-auto">

        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-3 border-b border-accent/5">
          <div className="space-y-0.5">
            <h2 className="font-Roboto uppercase tracking-[0.08em] text-bold text-[18px] text-white">
              Make a Reservation
            </h2>
            <p className="font-Roboto text-[10px] font-semibold tracking-[0.16em] text-secondary uppercase">
              Step {step} of 4 · <span className="text-accent">{step === 1 ? "Details" : step === 2 ? "Member" : step === 3 ? "Payment" : "Confirmed"}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center size-7 rounded-full border border-white/10 hover:border-white/20 text-secondary hover:text-white transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 1l10 10M11 1L1 11" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Step Indicators */}
        <div className="px-5 py-4 flex items-center justify-between">
          {[1, 2, 3, 4].map((num, i) => (
            <div key={num} className="flex-1 flex items-center">
              <div
                className={`flex items-center justify-center size-[35px] rounded-full text-[11px] font-bold transition-all duration-300 ${step >= num
                  ? "bg-accent text-dark shadow-[0_0_12px_rgba(212,168,71,0.35)]"
                  : "bg-[#14120F] text-secondary border border-accent/10"
                  }`}
              >
                {num}
              </div>
              {i < 3 && (
                <div
                  className={`h-[1px] flex-1 mx-2 transition-all duration-300 ${step > num ? "bg-accent/40" : "bg-accent/10"
                    }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Body */}
        <div className="Custom__Scrollbar flex-1 px-5 pb-5 overflow-y-auto space-y-5">
          {/* STEP 1: DETAILS */}
          {step === 1 && (
            <>
              {/* Select Area */}
              <div className="space-y-1.5" ref={areaRef}>
                <label className="font-Roboto tracking-[0.12em] text-[11px] font-semibold text-f1ead7cc uppercase">
                  Select Area <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsAreaDropdownOpen(!isAreaDropdownOpen)}
                    className="w-full font-Roboto bg-[#11100C] border border-accent/15 px-4 py-3 rounded-xl flex items-center justify-between text-[13px] text-foreground outline-none text-left"
                  >
                    <span className="flex items-center gap-2.5">
                      <IconSelectArea />
                      {selectedArea}
                    </span>
                    <svg
                      width="8"
                      height="5"
                      viewBox="0 0 10 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className={`transition-transform duration-200 ${isAreaDropdownOpen ? "rotate-180" : ""}`}
                    >
                      <path d="M1 1l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {isAreaDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-[#11100C] border border-accent/20 rounded-xl shadow-xl overflow-hidden p-2 space-y-2">
                      <div className="relative flex items-center bg-black/40 border border-accent/10 rounded-lg px-2.5 py-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary mr-2">
                          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                          type="text"
                          placeholder="Search area..."
                          value={areaSearch}
                          onChange={(e) => setAreaSearch(e.target.value)}
                          className="w-full bg-transparent text-[11px] text-foreground outline-none placeholder:text-secondary/40"
                        />
                      </div>
                      <div className="Custom__Scrollbar max-h-[140px] overflow-y-auto space-y-1">
                        {filteredVenues.map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setSelectedArea(option);
                              setIsAreaDropdownOpen(false);
                              setAreaSearch("");
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-[12px] transition-colors ${selectedArea === option
                              ? "bg-accent/10 text-accent font-medium"
                              : "text-foreground-soft hover:bg-white/5"
                              }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Date Selection */}
              <div className="space-y-1.5 relative" ref={dateRef}>
                <label className="font-Roboto tracking-[0.12em] text-[11px] font-semibold text-f1ead7cc uppercase">
                  Date <span className="text-red-400">*</span>
                </label>

                {/* Trigger button */}
                <button
                  ref={dateTriggerRef}
                  onClick={() => { setIsDateDropdownOpen(!isDateDropdownOpen); setCalendarView("day"); }}
                  className={`w-full font-Roboto bg-[#11100C] border px-4 py-3 rounded-xl flex items-center justify-between text-[13px] text-foreground outline-none text-left transition-colors ${isDateDropdownOpen ? "border-accent/40" : "border-accent/15 hover:border-accent/30"}`}
                >
                  <span className="flex items-center gap-2.5">
                    <IconCalendar />
                    {selectedDate}
                  </span>
                  <svg width="8" height="5" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5"
                    className={`transition-transform duration-200 ${isDateDropdownOpen ? "rotate-180 text-accent" : "text-secondary"}`}>
                    <path d="M1 1l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Calendar portal — rendered on document.body so modal overflow never clips it */}
                {isDateDropdownOpen && typeof window !== "undefined" && createPortal(
                  <div
                    ref={calendarPortalRef}
                    style={{ top: calendarPos.top, left: calendarPos.left, width: calendarPos.width }}
                    className="fixed z-[9999] bg-[#0E0D0A] border border-accent/20 rounded-xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.8)]"
                  >

                    {/* ── HEADER ── */}
                    <div className="flex items-center justify-between px-3 py-2 border-b border-accent/8">
                      <button
                        onClick={() => {
                          if (calendarView === "day")
                            setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
                          else if (calendarView === "month")
                            setCalendarDate(new Date(calendarDate.getFullYear() - 1, calendarDate.getMonth(), 1));
                          else
                            setYearRangeStart((y) => y - 12);
                        }}
                        className="size-5 flex items-center justify-center rounded-md hover:bg-white/5 text-secondary hover:text-foreground transition-colors"
                      >
                        <svg width="4" height="7" viewBox="0 0 5 9" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M4 1L1 4.5l3 3.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setCalendarView(calendarView === "month" ? "day" : "month")}
                          className={`font-Roboto text-[10px] font-semibold tracking-[0.06em] uppercase px-1.5 py-0.5 rounded-md transition-colors ${calendarView === "month" ? "text-accent bg-accent/8" : "text-foreground hover:bg-white/5"
                            }`}
                        >
                          {calendarDate.toLocaleDateString("en-GB", { month: "long" })}
                        </button>
                        <button
                          onClick={() => setCalendarView(calendarView === "year" ? "day" : "year")}
                          className={`font-Roboto text-[10px] font-semibold tracking-[0.04em] px-1.5 py-0.5 rounded-md transition-colors ${calendarView === "year" ? "text-accent bg-accent/8" : "text-secondary hover:bg-white/5 hover:text-foreground"
                            }`}
                        >
                          {calendarDate.getFullYear()}
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          if (calendarView === "day")
                            setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
                          else if (calendarView === "month")
                            setCalendarDate(new Date(calendarDate.getFullYear() + 1, calendarDate.getMonth(), 1));
                          else
                            setYearRangeStart((y) => y + 12);
                        }}
                        className="size-5 flex items-center justify-center rounded-md hover:bg-white/5 text-secondary hover:text-foreground transition-colors"
                      >
                        <svg width="4" height="7" viewBox="0 0 5 9" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M1 1l3 3.5-3 3.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>

                    {/* ── YEAR PICKER ── */}
                    {calendarView === "year" && (
                      <div className="grid grid-cols-4 gap-0.5 p-2">
                        {Array.from({ length: 12 }, (_, i) => yearRangeStart + i).map((yr) => {
                          const isPastYear = yr < today.getFullYear();
                          const isCurrentYear = yr === calendarDate.getFullYear();
                          return (
                            <button
                              key={yr}
                              disabled={isPastYear}
                              onClick={() => { setCalendarDate(new Date(yr, calendarDate.getMonth(), 1)); setCalendarView("month"); }}
                              className={`py-1.5 rounded-lg text-[10px] font-Roboto font-medium transition-all ${isCurrentYear ? "bg-accent text-dark font-bold" : isPastYear ? "text-secondary/25 cursor-not-allowed" : "text-foreground-soft hover:bg-white/5"
                                }`}
                            >{yr}</button>
                          );
                        })}
                      </div>
                    )}

                    {/* ── MONTH PICKER ── */}
                    {calendarView === "month" && (
                      <div className="grid grid-cols-3 gap-0.5 p-2">
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, mi) => {
                          const isPastMonth = calendarDate.getFullYear() === today.getFullYear() && mi < today.getMonth();
                          const isCurrentMonth = mi === calendarDate.getMonth();
                          return (
                            <button
                              key={m}
                              disabled={isPastMonth}
                              onClick={() => { setCalendarDate(new Date(calendarDate.getFullYear(), mi, 1)); setCalendarView("day"); }}
                              className={`py-1.5 rounded-lg text-[10px] font-Roboto font-medium tracking-[0.04em] uppercase transition-all ${isCurrentMonth ? "bg-accent text-dark font-bold" : isPastMonth ? "text-secondary/25 cursor-not-allowed" : "text-foreground-soft hover:bg-white/5"}`}
                            >{m}</button>
                          );
                        })}
                      </div>
                    )}

                    {/* ── DAY GRID ── */}
                    {calendarView === "day" && (
                      <div className="p-2 space-y-0.5">
                        <div className="grid grid-cols-7">
                          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                            <div key={d} className="text-center font-Roboto text-[8px] font-semibold text-secondary/40 uppercase py-1">
                              {d}
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-px">
                          {calendarDays.map((day, idx) => {
                            if (!day) return <div key={`e-${idx}`} />;
                            const isPast = day <= today;
                            const label = formatDateLabel(day);
                            const isSelected = label === selectedDate;
                            const isToday = day.getTime() === today.getTime();
                            return (
                              <button
                                key={label}
                                disabled={isPast}
                                onClick={() => {
                                  setSelectedDate(label);
                                  setSelectedDateObj(day);
                                  setIsDateDropdownOpen(false);
                                }}
                                className={`aspect-square w-full flex items-center justify-center rounded-md text-[11px] font-Roboto transition-all ${isSelected
                                  ? "bg-accent text-dark font-bold shadow-[0_0_8px_rgba(201,168,76,0.4)]"
                                  : isPast
                                    ? "text-secondary/20 cursor-not-allowed"
                                    : isToday
                                      ? "border border-accent/40 text-accent hover:bg-accent/10"
                                      : "text-foreground-soft hover:bg-white/5 hover:text-white"
                                  }`}
                              >
                                {day.getDate()}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>,
                  document.body
                )}
              </div>

              {/* Time Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-Roboto tracking-[0.12em] text-[11px] font-semibold text-f1ead7cc uppercase">
                    Time <span className="text-red-400">*</span>
                  </label>
                  {loadingAvailability && (
                    <span className="font-Roboto text-[10px] text-accent/80 animate-pulse uppercase tracking-[0.1em]">
                      Checking availability...
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {times.map((t) => {
                    const match = slotsAvailability.find(s => s.timeSlot === t);
                    const isAvailable = match ? match.available : true; // default true if not fetched
                    const isDisabled = !isAvailable && !loadingAvailability;

                    return (
                      <button
                        key={t}
                        disabled={isDisabled}
                        onClick={() => setSelectedTime(t)}
                        className={`py-2 px-1 text-[11px] font-Roboto font-medium rounded-lg text-center transition-all ${
                          selectedTime === t
                            ? "bg-accent text-dark font-bold shadow-[0_0_8px_rgba(212,168,71,0.25)]"
                            : isDisabled
                              ? "bg-[#11100C]/40 border border-transparent text-secondary/20 cursor-not-allowed"
                              : "bg-[#11100C] border border-accent/10 text-foreground-soft hover:border-accent/25"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Guests Selector */}
              <div className="space-y-1.5">
                <label className="font-Roboto tracking-[0.12em] text-[11px] font-semibold text-f1ead7cc uppercase">
                  Guests <span className="text-secondary/50">(Pax)</span> <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-[#11100C] border border-accent/15 rounded-xl overflow-hidden p-1">
                    <button
                      onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                      className="size-9 rounded-lg hover:bg-white/5 text-accent flex items-center justify-center text-[18px] font-medium transition-colors"
                    >
                      -
                    </button>
                    <span className="font-Roboto font-bold text-[14px] text-white w-10 text-center">
                      {guests}
                    </span>
                    <button
                      onClick={() => setGuests(prev => Math.min(12, prev + 1))}
                      className="size-9 rounded-lg hover:bg-white/5 text-accent flex items-center justify-center text-[16px] font-medium transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-Roboto text-[11px] text-secondary/60">
                    Max 12 guests
                  </span>
                </div>
              </div>

              {/* Occasion Dropdown */}
              <div className="space-y-1.5" ref={occasionRef}>
                <label className="font-Roboto tracking-[0.12em] text-[11px] font-semibold  text-f1ead7cc uppercase">
                  Occasion <span className="text-secondary/50">(Optional)</span>
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsOccasionDropdownOpen(!isOccasionDropdownOpen)}
                    className="w-full font-Roboto bg-[#11100C] border border-accent/15 px-4 py-3 rounded-xl flex items-center justify-between text-[13px] text-foreground outline-none text-left"
                  >
                    {selectedOccasion}
                    <svg
                      width="8"
                      height="5"
                      viewBox="0 0 10 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className={`transition-transform duration-200 ${isOccasionDropdownOpen ? "rotate-180" : ""}`}
                    >
                      <path d="M1 1l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {isOccasionDropdownOpen && (
                    <div className="Custom__Scrollbar absolute top-full left-0 right-0 mt-1 z-30 bg-[#11100C] border border-accent/20 rounded-xl shadow-xl overflow-hidden p-1 max-h-[160px] overflow-y-auto">
                      {occasions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSelectedOccasion(option);
                            setIsOccasionDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-[12px] transition-colors ${selectedOccasion === option
                            ? "bg-accent/10 text-accent font-medium"
                            : "text-foreground-soft hover:bg-white/5"
                            }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Special Requests */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-Roboto tracking-[0.12em] text-[11px] font-semibold  text-f1ead7cc uppercase">
                    Special Requests
                  </label>
                  <span className="font-Roboto text-[9px] text-secondary/40">
                    {specialRequests.length}/250
                  </span>
                </div>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value.slice(0, 250))}
                  rows={3}
                  placeholder="Any special requests (e.g. window seat, dietary requirements)."
                  className="font-Roboto w-full resize-none rounded-xl border border-accent/10 bg-[#11100C] px-4 py-3 text-[13px] text-foreground outline-none transition-colors placeholder:text-secondary/40 focus:border-accent/40"
                />
              </div>

              {/* Reservation Summary */}
              <div className="bg-[#12110E] border border-accent/10 rounded-[14px] p-4 space-y-2.5">
                <p className="font-Roboto text-[12px] font-bold tracking-[0.2em] text-accent uppercase">
                  Reservation Summary
                </p>
                <div className="space-y-1.5 font-Roboto text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-secondary/70 text-[12px]">AREA:</span>
                    <span className="text-white text-[12px] uppercase ">{selectedArea}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary/70 text-[12px]">DATE:</span>
                    <span className="text-white text-[12px] uppercase ">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary/70 text-[12px]">TIME:</span>
                    <span className="text-white text-[12px] uppercase ">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary/70 text-[12px]">GUESTS:</span>
                    <span className="text-white text-[12px] uppercase ">{guests} GUESTS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary/70 text-[12px]">OCCASION:</span>
                    <span className="text-white text-[12px] uppercase ">{selectedOccasion}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* STEP 2: MEMBER */}
          {step === 2 && (
            <>
              {/* Member Card */}
              <div className="space-y-1.5">
                <label className="font-Roboto tracking-[0.12em] text-[11px] font-semibold  text-f1ead7cc uppercase">
                  Member Details
                </label>
                <div className="flex items-center gap-3.5 bg-[#11100C] border border-accent/15 rounded-xl p-4">
                  <div className="size-9 rounded-full bg-accent text-dark flex items-center justify-center font-bold text-[13px] shadow-[0_0_8px_rgba(212,168,71,0.2)]">
                    {memberName.charAt(0)}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-Roboto text-[13px] font-bold text-white leading-tight">
                      {memberName}
                    </h4>
                    <p className="font-Roboto text-[10px] text-secondary">
                      Member No. {memberNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Number */}
              <div className="space-y-1.5">
                <label className="font-Roboto tracking-[0.12em] text-[11px] font-semibold  text-f1ead7cc uppercase">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={contactNumber}
                  placeholder="+971 50 123 4567"
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="font-Roboto w-full rounded-xl border border-accent/15 bg-[#11100C] px-4 py-3 text-[13px] text-foreground outline-none transition-colors placeholder:text-secondary/40 focus:border-accent/40"
                />
              </div>

              {/* Arrival Note */}
              <div className="space-y-1.5">
                <label className="font-Roboto tracking-[0.12em] text-[11px] font-semibold  text-f1ead7cc uppercase">
                  Arrival Note for Host
                </label>
                <textarea
                  value={arrivalNote}
                  onChange={(e) => setArrivalNote(e.target.value)}
                  rows={4}
                  placeholder="Optional note for the host"
                  className="font-Roboto w-full resize-none rounded-xl border border-accent/10 bg-[#11100C] px-4 py-3 text-[13px] text-foreground outline-none transition-colors placeholder:text-secondary/40 focus:border-accent/40"
                />
              </div>

              {/* Summary Cards */}

              <div className="bg-[#12110E] border border-accent/10 rounded-[14px] p-2 font-Roboto">
                <p className="text-[12px] text-secondary text-semibold  capitalize">
                  SUMMARY
                </p>
                <div className="flex justify-between gap-4 p-2 ">

                  <div className="space-y-1">
                    <h4 className="text-[13px] font-bold text-white">
                      {selectedTime} , {guests} Guests
                    </h4>
                    <p className="text-[10px] text-secondary capitalize">
                      {selectedOccasion}
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <h4 className="text-[12px] font-semibold text-accent uppercase">
                      {isSuite ? "Suite" : isRestaurant ? "Restaurant" : "Lounge"}
                    </h4>
                    <p className="text-[10px] text-secondary">
                      {selectedDate}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* STEP 3: PAYMENT */}
          {step === 3 && (
            <>
              {/* Payment Methods */}
              <div className="space-y-3">
                <label className="font-Roboto tracking-[0.12em] text-[11px] font-semibold  text-f1ead7cc uppercase">
                  Member Details
                </label>

                {/* Option 1: Member Account */}
                <button
                  onClick={() => setPaymentMethod("account")}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${paymentMethod === "account"
                    ? "bg-accent/5 border-accent shadow-[0_0_10px_rgba(212,168,71,0.1)]"
                    : "bg-[#11100C] border-accent/10 hover:border-accent/20"
                    }`}
                >
                  <div className="flex items-center gap-3 font-Roboto">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={paymentMethod === "account" ? "text-accent" : "text-secondary"}>
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span className={`text-[13px] font-semibold ${paymentMethod === "account" ? "text-white" : "text-foreground-soft"}`}>
                      Member account - no deposit
                    </span>
                  </div>
                  <div className={`size-4 rounded-full border flex items-center justify-center ${paymentMethod === "account" ? "border-accent" : "border-secondary/40"
                    }`}>
                    {paymentMethod === "account" && <div className="size-2 rounded-full bg-accent" />}
                  </div>
                </button>

                {/* Option 2: Card */}
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${paymentMethod === "card"
                    ? "bg-accent/5 border-accent shadow-[0_0_10px_rgba(212,168,71,0.1)]"
                    : "bg-[#11100C] border-accent/10 hover:border-accent/20"
                    }`}
                >
                  <div className="flex items-center gap-3 font-Roboto">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={paymentMethod === "card" ? "text-accent" : "text-secondary"}>
                      <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                    <span className={`text-[13px] font-semibold ${paymentMethod === "card" ? "text-white" : "text-foreground-soft"}`}>
                      Card ending 44721
                    </span>
                  </div>
                  <div className={`size-4 rounded-full border flex items-center justify-center ${paymentMethod === "card" ? "border-accent" : "border-secondary/40"
                    }`}>
                    {paymentMethod === "card" && <div className="size-2 rounded-full bg-accent" />}
                  </div>
                </button>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-3 pt-2">
                <label className="font-Roboto tracking-[0.12em] text-[11px] font-semibold  text-f1ead7cc uppercase">
                  Cost Breakdown
                </label>
                <div className="bg-[#12110E] border border-accent/10 rounded-[14px] p-4 mt-2 space-y-3 font-Roboto text-[12px]">
                  <div className="flex justify-between text-secondary/85 text-[12px]">
                    <span>{isSuite ? "Room booking" : `Table hold (${guests} guests)`}</span>
                    <span className="text-f1ead7">AED {tableHoldCost}</span>
                  </div>
                  <div className="flex justify-between text-secondary/85 text-[12px]">
                    <span>Estimated F&B minimum</span>
                    <span className="text-f1ead7">AED {fbMinimum}</span>
                  </div>
                  <div className="h-[1px] bg-accent/10 my-1" />
                  <div className="flex justify-between font-bold text-[12px]">
                    <span className="text-f1ead7">Billed to account</span>
                    <span className="text-accent">AED {totalCost}</span>
                  </div>
                </div>
              </div>

              {/* Cancellation Agreement Checkbox */}
              <label className="flex items-start align-center gap-3 cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  checked={agreedToPolicy}
                  onChange={(e) => setAgreedToPolicy(e.target.checked)}
                  className="sr-only"
                />
                <div className={`size-4 mt-0.5 rounded border flex items-center justify-center transition-all shrink-0 ${agreedToPolicy ? "bg-accent border-accent text-dark" : "border-accent/20 bg-[#11100C]"
                  }`}>
                  {agreedToPolicy && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 3.5l2.5 2.5L8 1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="font-Roboto text-[10px] text-secondary/80 leading-normal">
                  I agree to the 2-hour cancellation policy for clubhouse dining.
                </span>
              </label>
            </>
          )}

          {/* STEP 4: CONFIRMED */}
          {step === 4 && (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-6">

              {/* Success Circle */}
              <div className="size-[65px] rounded-full bg-[#5FB49C] flex items-center justify-center shadow-[0_0_18px_rgba(95,180,156,0.3)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0A0907" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-Inter text-[18px] font-normal uppercase tracking-[0.04em] text-white">
                  Reservation Confirmed
                </h3>
                <p className="font-Roboto text-[13px] text-secondary/80">
                  A confirmation was sent to the member's app.
                </p>
              </div>

              {/* Final Confirmation Details */}
              <div className="w-full bg-[#12110E] border border-accent/10 rounded-[14px] p-4 space-y-2.5 text-left font-Roboto text-[11px]">
                <div className="flex justify-between">
                  <span className="text-F1F0EB80 text-[12px]">Confirmation no.</span>
                  <span className="text-white font-bold uppercase tracking-wide text-[12px]">
                    {confirmationData?.confirmationNumber ?? confirmationData?.referenceNumber ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-F1F0EB80 text-[12px]">Area</span>
                  <span className="text-white font-medium capitalize text-[12px]">{selectedArea}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-F1F0EB80 text-[12px]">Date & Time</span>
                  <span className="text-white font-medium text-[12px]">{selectedDate}, {selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-F1F0EB80 text-[12px]">Guests</span>
                  <span className="text-white font-medium text-[12px]">{guests} Guests</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Buttons / Actions */}
        <div className="p-5 pt-2 border-t border-accent/5 space-y-2 bg-[#0A0907]">
          {step === 1 && (
            <>
              <button
                onClick={handleNext}
                disabled={!selectedTime || !areaId}
                className={`w-full font-Roboto text-dark font-bold text-[11px] py-3 rounded-full uppercase tracking-[0.16em] flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(212,168,71,0.15)] ${
                  !selectedTime || !areaId
                    ? "bg-accent/40 opacity-50 cursor-not-allowed"
                    : "bg-accent hover:brightness-110 active:brightness-95 cursor-pointer"
                }`}
              >
                Continue
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 2L6 5L3 8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="w-full font-Roboto text-secondary/60 hover:text-white text-[11px] font-bold py-2 rounded-full transition-colors uppercase tracking-[0.16em] bg-transparent cursor-pointer"
              >
                Cancel
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <button
                onClick={handleNext}
                className="w-full font-Roboto bg-accent text-dark font-bold text-[11px] py-3 rounded-full hover:brightness-110 active:brightness-95 uppercase tracking-[0.16em] flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(212,168,71,0.15)] cursor-pointer"
              >
                Continue
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 2L6 5L3 8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={handleBack}
                className="w-full font-Roboto text-secondary/60 hover:text-white text-[11px] font-bold py-2 rounded-full transition-colors uppercase tracking-[0.16em] bg-transparent cursor-pointer"
              >
                Back
              </button>
            </>
          )}

          {step === 3 && (
            <>
              {/* Error Banner */}
              {submitError && (
                <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-3 text-[12px] text-red-400 leading-relaxed">
                  {submitError}
                </div>
              )}
              <button
                onClick={handleConfirmReservation}
                disabled={!agreedToPolicy || submitting}
                className={`w-full font-Roboto text-dark font-bold text-[11px] py-3 rounded-full transition-all uppercase tracking-[0.16em] flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(212,168,71,0.15)] cursor-pointer ${
                  !agreedToPolicy || submitting
                    ? "bg-accent/40 opacity-50 cursor-not-allowed"
                    : "bg-accent hover:brightness-110 active:brightness-95"
                }`}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin size-3.5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Confirming...
                  </>
                ) : (
                  "Confirm Reservation"
                )}
              </button>
              <button
                onClick={handleBack}
                disabled={submitting}
                className="w-full font-Roboto text-secondary/60 hover:text-white text-[11px] font-bold py-2 rounded-full transition-colors uppercase tracking-[0.16em] bg-transparent cursor-pointer disabled:opacity-40"
              >
                Back
              </button>
            </>
          )}

          {step === 4 && (
            <>
              <button
                onClick={onClose}
                className="w-full font-Roboto bg-accent text-dark font-bold text-[11px] py-3 rounded-full hover:brightness-110 active:brightness-95 uppercase tracking-[0.16em] transition-all shadow-[0_0_12px_rgba(212,168,71,0.15)] cursor-pointer"
              >
                View in Reservations
              </button>
              <button
                onClick={onClose}
                className="w-full font-Roboto text-secondary/60 hover:text-white text-[11px] font-bold py-2 rounded-full transition-colors uppercase tracking-[0.16em] bg-transparent cursor-pointer"
              >
                Back
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
