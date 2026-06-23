import { redirect } from "next/navigation";

export default function StaffConfirmationsRedirect() {
  redirect("/staff/bookings");
}
