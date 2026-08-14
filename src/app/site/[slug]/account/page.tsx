import { redirect, notFound } from "next/navigation";
import { getSite } from "@/features/website/storage";
import { getAccountSession } from "@/features/accounts/auth";
import { logOutAction } from "@/features/accounts/actions";
import { listAppointmentsForCustomer } from "@/features/scheduling/storage";
import AppointmentRequestForm from "@/features/scheduling/components/AppointmentRequestForm";

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
  const logout = logOutAction.bind(null, slug, "customer");

  return (
    <main className="mx-auto max-w-2xl p-6 sm:p-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Appointments</h1>
          <p className="mt-1 text-sm text-gray-500">
            {site.website.title} -- logged in as {customer.name}
          </p>
        </div>
        <form action={logout}>
          <button type="submit" className="text-sm font-medium text-gray-500 underline hover:text-gray-900">
            Log out
          </button>
        </form>
      </div>

      <div className="mt-8 space-y-3">
        {appointments.length === 0 ? (
          <p className="text-sm text-gray-500">No appointments requested yet.</p>
        ) : (
          appointments.map((a) => (
            <div key={a.id} className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <p className="font-semibold">
                  {a.requestedDate} at {a.requestedTime}
                </p>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    a.status === "confirmed"
                      ? "bg-emerald-100 text-emerald-700"
                      : a.status === "declined"
                        ? "bg-gray-100 text-gray-500"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {a.status}
                </span>
              </div>
              {a.note && <p className="mt-1 text-sm text-gray-500">{a.note}</p>}
            </div>
          ))
        )}
      </div>

      <div className="mt-8">
        <AppointmentRequestForm slug={slug} />
      </div>
    </main>
  );
}
