import { redirect, notFound } from "next/navigation";
import { getSite } from "@/features/website/storage";
import { getAccountSession } from "@/features/accounts/auth";
import { logOutAction } from "@/features/accounts/actions";
import { listAppointmentsForCustomer } from "@/features/scheduling/storage";
import { listProviderOptions } from "@/features/accounts/storage";
import DashboardShell from "@/features/accounts/components/DashboardShell";
import AppointmentDashboard from "@/features/scheduling/components/AppointmentDashboard";

export default async function CustomerAccountPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = await getSite(slug);
  if (!site || !site.addOns?.scheduling) notFound();

  const customer = await getAccountSession(slug, "customer");
  if (!customer) redirect(`/site/${slug}/account/login`);

  const appointments = await listAppointmentsForCustomer(slug, customer.id);
  const providers = await listProviderOptions(slug);
  const logout = logOutAction.bind(null, slug, "customer");

  return (
    <DashboardShell
      siteName={site.website.title}
      slug={slug}
      title="My Appointments"
      subtitle={`Logged in as ${customer.name}`}
      roleLabel="Customer"
      logoutAction={logout}
    >
      <AppointmentDashboard slug={slug} appointments={appointments} role="customer" providers={providers} />
    </DashboardShell>
  );
}
