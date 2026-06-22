import { redirect } from "next/navigation";

export default function ConciergeConfirmationsRedirect() {
  redirect("/admin/confirmations");
}
