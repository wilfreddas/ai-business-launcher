import { listSites } from "@/features/website/storage";
import DashboardClient from "@/features/website/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const sites = await listSites();

  return <DashboardClient initialSites={sites} />;
}
