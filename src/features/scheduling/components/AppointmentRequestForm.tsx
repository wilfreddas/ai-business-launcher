import { requestAppointmentAction } from "../actions";

interface Props {
  slug: string;
}

/** Plain server-action-bound form -- no client state needed, mirrors the
 * team login form's pattern (features/accounts/components/AccountAuthForm). */
export default function AppointmentRequestForm({ slug }: Props) {
  const action = requestAppointmentAction.bind(null, slug);

  return (
    <form action={action} className="space-y-3 rounded-xl border border-gray-200 p-5">
      <h2 className="font-semibold">Request an appointment</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <input type="date" name="date" required className="w-full rounded-lg border p-3 text-sm" />
        <input type="time" name="time" required className="w-full rounded-lg border p-3 text-sm" />
      </div>
      <textarea
        name="note"
        rows={3}
        placeholder="Anything the business should know (optional)"
        className="w-full rounded-lg border p-3 text-sm"
      />
      <button
        type="submit"
        className="w-full rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
      >
        Request Appointment
      </button>
      <p className="text-xs text-gray-400">
        This sends a request -- the business will confirm or decline it, it isn&apos;t booked automatically.
      </p>
    </form>
  );
}
