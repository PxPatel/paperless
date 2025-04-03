import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import ClassBox from "../../components/class";
import organizations from "../../utils/supabase/db/organizations";
import { DashboardView } from "../../components/dashboard/dashboard-view";

export default async function Dashboard() {

    const organization = organizations

  return (
     <DashboardView organizations={organizations} />
  );
}
