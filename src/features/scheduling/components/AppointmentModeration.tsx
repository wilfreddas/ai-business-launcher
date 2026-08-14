"use client";

import { Check, X } from "lucide-react";
import type { AppointmentRequest, AppointmentStatus } from "../types";
import { relativeDay } from "../dateUtils";

interface Props {
  appointments: AppointmentRequest[];
  /** Omit to render a read-only list (used on the customer side -- a
   * patient can see their own requests but not confirm/decline them). */
  onSetStatus?: (id: string, status: AppointmentStatus) => void;
  isPending?: boolean;
  emptyMessage?: string;
  /** Show which provider each appointment is with -- useful for the owner
   * view (spans every staff account) and the customer's own list (may be
   * booked with more than one provider at the same business). */
  showProvider?: boolean;
}

const STATUS_STYLE: Record<AppointmentStatus, string> = {
  requested: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  declined: "bg-gray-100 text-gray-500",
};

const RELATIVE_STYLE: Record<ReturnType<typeof relativeDay>, string> = {
  past: "bg-gray-100 text-gray-500",
  today: "bg-blue-100 text-blue-700",
  upcoming: "bg-gray-50 text-gray-600",
};

/**
 * Presentational appointment list -- no data fetching or local state of its
 * own, so the same component renders the Today tab, a calendar day's
 * appointments, and search results from a single shared state array owned
 * by the dashboard that renders it (see PortalDashboard/CustomerDashboard).
 */
export default function AppointmentModeration({
  appointments,
  onSetStatus,
  isPending,
  emptyMessage = "No appointments.",
  showProvider,
}: Props) {
  if (appointments.length === 0) {
    return <p className="text-sm text-gray-500">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-3">
      {appointments.map((a) => {
        const relative = relativeDay(a.requestedDate);
        return (
          <div key={a.id} className="rounded-lg border border-gray-200 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{a.customerName}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[a.status]}`}>
                    {a.status}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${RELATIVE_STYLE[relative]}`}>
                    {relative === "today" ? "Today" : relative === "past" ? "Past" : "Upcoming"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-700">
                  {a.requestedDate} at {a.requestedTime}
                  {showProvider && <span className="text-gray-400"> · with {a.providerName}</span>}
                </p>
                {a.note && <p className="mt-1 text-sm text-gray-500">{a.note}</p>}
              </div>

              {onSetStatus && a.status === "requested" && (
                <div className="flex items-center gap-1.5 sm:shrink-0">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => onSetStatus(a.id, "confirmed")}
                    className="inline-flex items-center gap-1 rounded-lg bg-black px-2.5 py-1.5 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-60"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Confirm
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => onSetStatus(a.id, "declined")}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    <X className="h-3.5 w-3.5" />
                    Decline
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
