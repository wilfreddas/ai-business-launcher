import { redirect, notFound } from "next/navigation";
import { getSite } from "@/features/website/storage";
import { getAccountSession } from "@/features/accounts/auth";
import { logOutAction } from "@/features/accounts/actions";
import { listAppointments, listAppointmentsForProvider } from "@/features/scheduling/storage";
import { getOwnerAccountId } from "@/features/accounts/storage";
import DashboardShell from "@/features/accounts/components/DashboardShell";
import AppointmentDashboard from "@/features/scheduling/components/AppointmentDashboard";

export default async function ClientPortalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = await getSite(slug);
  if (!site || !site.addOns?.scheduling) notFound();

  const client = await getAccountSession(slug, "client");
  if (!client) redirect(`/site/${slug}/portal/login`);

  const isOwner = (await getOwnerAccountId(slug)) === client.id;
  const appointments = isOwner ? await listAppointments(slug) : await listAppointmentsForProvider(slug, client.id);
  const logout = logOutAction.bind(null, slug, "client");

  return (
    <DashboardShell
      siteName={site.website.title}
      slug={slug}
      title="Appointment Requests"
      subtitle={`Logged in as ${client.name}`}
      roleLabel={isOwner ? "Owner" : "Staff"}
      logoutAction={logout}
    >
      <AppointmentDashboard slug={slug} appointments={appointments} role="business" />
    </DashboardShell>
  );
}
