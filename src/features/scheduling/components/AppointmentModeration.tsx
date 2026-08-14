"use client";

import { useState, useTransition } from "react";
import { Check, X } from "lucide-react";
import type { AppointmentRequest, AppointmentStatus } from "../types";
import { updateAppointmentStatusAction } from "../actions";

interface Props {
  slug: string;
  initialAppointments: AppointmentRequest[];
}

const STATUS_STYLE: Record<AppointmentStatus, string> = {
  requested: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  declined: "bg-gray-100 text-gray-500",
};

/** Same approve/reject pattern as the review moderation panel -- these
 * requests aren't freely editable, just something to confirm or decline. */
export default function AppointmentModeration({ slug, initialAppointments }: Props) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [isPending, startTransition] = useTransition();

  function setStatus(id: string, status: AppointmentStatus) {
    startTransition(async () => {
      await updateAppointmentStatusAction(slug, id, status);
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    });
  }

  if (appointments.length === 0) {
    return <p className="text-sm text-gray-500">No appointment requests yet.</p>;
  }

  return (
    <div className="space-y-3">
      {appointments.map((a) => (
        <div key={a.id} className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{a.customerName}</p>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[a.status]}`}>
                  {a.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-700">
                {a.requestedDate} at {a.requestedTime}
              </p>
              {a.note && <p className="mt-1 text-sm text-gray-500">{a.note}</p>}
            </div>

            {a.status === "requested" && (
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setStatus(a.id, "confirmed")}
                  className="inline-flex items-center gap-1 rounded-lg bg-black px-2.5 py-1.5 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-60"
                >
                  <Check className="h-3.5 w-3.5" />
                  Confirm
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setStatus(a.id, "declined")}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                >
                  <X className="h-3.5 w-3.5" />
                  Decline
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
