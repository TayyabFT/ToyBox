import { redirect } from "next/navigation";

export default function AdminConfirmationsRedirect() {
  redirect("/admin/bookings");
}
