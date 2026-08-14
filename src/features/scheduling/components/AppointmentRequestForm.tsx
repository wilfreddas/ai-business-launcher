import { Send } from "lucide-react";
import { requestAppointmentAction } from "../actions";

interface Props {
  slug: string;
  /** Every staff/business account at this site the customer can book with.
   * Shown as a picker when there's more than one; a single provider is
   * submitted silently so the form doesn't grow a needless dropdown. */
  providers: { id: string; name: string }[];
}

const inputStyle =
  "w-full rounded-lg border border-gray-200 p-3 text-sm outline-none transition-colors focus:border-gray-900";
const labelStyle = "mb-1 block text-xs font-medium text-gray-500";

/** Plain server-action-bound form -- no client state needed, mirrors the
 * team login form's pattern (features/accounts/components/AccountAuthForm). */
export default function AppointmentRequestForm({ slug, providers }: Props) {
  const action = requestAppointmentAction.bind(null, slug);

  return (
    <form action={action} className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold">Request an appointment</h2>

      {providers.length > 1 ? (
        <div>
          <label className={labelStyle}>Provider</label>
          <select name="providerId" required defaultValue="" className={inputStyle}>
            <option value="" disabled>
              Who would you like to book with?
            </option>
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <input type="hidden" name="providerId" value={providers[0]?.id ?? ""} />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelStyle}>Date</label>
          <input type="date" name="date" required className={inputStyle} />
        </div>
        <div>
          <label className={labelStyle}>Time</label>
          <input type="time" name="time" required className={inputStyle} />
        </div>
      </div>

      <div>
        <label className={labelStyle}>Note (optional)</label>
        <textarea name="note" rows={3} placeholder="Anything the business should know" className={inputStyle} />
      </div>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
      >
        <Send className="h-4 w-4" />
        Request Appointment
      </button>
      <p className="text-xs text-gray-400">
        This sends a request -- the business will confirm or decline it, it isn&apos;t booked automatically.
      </p>
    </form>
  );
}
