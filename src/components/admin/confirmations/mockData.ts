import type {
  BookingItem,
  CompletedTodayItem,
  ConfirmationStatItem,
  InReviewBooking,
  PendingBookingItem,
} from "./types";

export const confirmationStats: ConfirmationStatItem[] = [
  {
    label: "Pending Confirm",
    value: "5",
    subtext: "Awaiting Your Action",
  },
  {
    label: "Sign-Off Queue",
    value: "3",
    subtext: "Manager Review",
  },
  {
    label: "Completed Today",
    value: "9",
    subtext: "Confirmed Done",
    accent: "teal",
  },
  {
    label: "Shift Progress",
    value: "87%",
    subtext: "On Track",
  },
];

export const bookings: BookingItem[] = [
  {
    id: "bk-1",
    vehicle: "Lamborghini Huracán STO",
    reference: "BK-0271",
    member: "Nora Assenmio",
    schedule: "Today · 16:00",
    status: "confirmed",
  },
  {
    id: "bk-2",
    vehicle: "Ferrari SF90 Stradale",
    reference: "BK-0272",
    member: "Khalid Al Mansoori",
    schedule: "Tomorrow · 09:30",
    status: "pending",
  },
  {
    id: "bk-3",
    vehicle: "Rolls-Royce Spectre",
    reference: "BK-0273",
    member: "Alex Mitchell",
    schedule: "18 Jul · 11:00",
    status: "in-review",
  },
];

export const confirmedBookings: BookingItem[] = bookings.filter(
  (booking) => booking.status === "confirmed",
);

export const pendingBookings: PendingBookingItem[] = [
  {
    id: "booking-2",
    index: 2,
    title: "Full Detail — Porsche 911 GT",
    bookingRef: "BK-D0115",
    staff: "Rashid Amer",
    bay: "Bay 03",
    price: "AED 2,050",
    status: "awaiting",
    icon: "check",
  },
  {
    id: "booking-3",
    index: 3,
    title: "Wellness Detail — Rolls-Royce Ghost",
    bookingRef: "BK-1041",
    staff: "Khalid M.",
    bay: "Bay 08",
    price: "AED 1,800",
    status: "sign-off",
    icon: "car",
  },
  {
    id: "booking-4",
    index: 4,
    title: "Battery Check — Bentley Continental GT",
    bookingRef: "BK-1042",
    staff: "Ahmad T.",
    bay: "Bay 05",
    price: "AED 650",
    status: "awaiting",
    icon: "circle",
  },
  {
    id: "booking-5",
    index: 5,
    title: "Ceramic Coating — McLaren 750S",
    bookingRef: "BK-1043",
    staff: "Sofia R.",
    bay: "Bay 02",
    price: "AED 3,400",
    status: "sign-off",
    icon: "car",
  },
];

export const inReviewBookings: InReviewBooking[] = [
  {
    id: "ir-1",
    vehicle: "Rolls-Royce Spectre",
    member: "Alex Mitchell",
    schedule: "18 Jul · 11:00",
  },
  {
    id: "ir-2",
    vehicle: "McLaren 750S",
    member: "Nora Assenmio",
    schedule: "19 Jul · 14:00",
  },
  {
    id: "ir-3",
    vehicle: "Aston Martin DBS",
    member: "Khalid Al Mansoori",
    schedule: "20 Jul · 10:30",
  },
];

export const completedToday: CompletedTodayItem[] = [
  {
    id: "ct-1",
    title: "Transport — Ferrari SF90 · DIFC",
    bookingRef: "BK-T0026",
    confirmedAt: "07:15",
    assignee: "Alex Mitchell",
  },
  {
    id: "ct-2",
    title: "Inspection — Bentley Continental GT",
    bookingRef: "BK-0437",
    confirmedAt: "07:45",
    assignee: "Bay D-03",
  },
  {
    id: "ct-3",
    title: "Exterior Wash — Rolls Royce Phantom",
    bookingRef: "BK-D0112",
    confirmedAt: "10:30",
    assignee: "Sarah Khalid",
  },
];
