import { redirect } from "next/navigation";
import { STAFF_BASE } from "@/lib/staffNav";

const page = () => {
  redirect(`${STAFF_BASE}/overview`);
};

export default page;
