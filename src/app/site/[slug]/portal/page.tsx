import { redirect, notFound } from "next/navigation";
import { getSite } from "@/features/website/storage";
import { getAccountSession } from "@/features/accounts/auth";
import { logOutAction } from "@/features/accounts/actions";
import { listAppointments } from "@/features/scheduling/storage";
import AppointmentModeration from "@/features/scheduling/components/AppointmentModeration";

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

  const appointments = await listAppointments(slug);
  const logout = logOutAction.bind(null, slug, "client");

  return (
    <main className="mx-auto max-w-2xl p-6 sm:p-10">
      <div className="flex items-start justify-between gap-4">
        <div>
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
        <AppointmentModeration slug={slug} initialAppointments={appointments} />
      </div>
    </main>
  );
}
