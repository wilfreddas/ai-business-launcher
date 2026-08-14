import { redirect, notFound } from "next/navigation";
import { getSite } from "@/features/website/storage";
import { getAccountSession } from "@/features/accounts/auth";
import { logOutAction } from "@/features/accounts/actions";
import { listAppointments, listAppointmentsForProvider } from "@/features/scheduling/storage";
import { getOwnerAccountId } from "@/features/accounts/storage";
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
    <main className="mx-auto max-w-3xl p-6 sm:p-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold">Appointment Requests</h1>
          <p className="mt-1 text-sm text-gray-500">
            {site.website.title} -- logged in as {client.name}
          </p>
        </div>
        <form action={logout}>
          <button type="submit" className="text-sm font-medium text-gray-500 underline hover:text-gray-900">
            Log out
          </button>
        </form>
      </div>

      <div className="mt-8">
        <AppointmentDashboard slug={slug} appointments={appointments} role="business" />
      </div>
    </main>
  );
}
