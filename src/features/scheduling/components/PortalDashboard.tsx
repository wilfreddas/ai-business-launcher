"use client";

import { useMemo, useState, useTransition } from "react";
import { Search } from "lucide-react";
import type { AppointmentRequest, AppointmentStatus } from "../types";
import { updateAppointmentStatusAction } from "../actions";
import { todayISO, formatDateLong } from "../dateUtils";
import TabBar from "./TabBar";
import AppointmentCalendar from "./AppointmentCalendar";
import AppointmentModeration from "./AppointmentModeration";

interface Props {
  slug: string;
  initialAppointments: AppointmentRequest[];
}

type Tab = "today" | "calendar" | "search";

const TABS: { id: Tab; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "calendar", label: "Calendar" },
  { id: "search", label: "Search" },
];

/**
 * The business owner's view: today's schedule by default, a month calendar
 * to browse any day, and a search-by-patient-name tab that spans every
 * request regardless of date (past, today, or upcoming).
 */
export default function PortalDashboard({ slug, initialAppointments }: Props) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [tab, setTab] = useState<Tab>("today");
  const [query, setQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function setStatus(id: string, status: AppointmentStatus) {
    startTransition(async () => {
      await updateAppointmentStatusAction(slug, id, status);
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    });
  }

  const sortByDateTime = (a: AppointmentRequest, b: AppointmentRequest) =>
    (a.requestedDate + a.requestedTime).localeCompare(b.requestedDate + b.requestedTime);

  const today = todayISO();
  const todaysAppointments = useMemo(
    () => appointments.filter((a) => a.requestedDate === today).sort(sortByDateTime),
    [appointments, today]
  );

  const dayAppointments = useMemo(
    () => (selectedDate ? appointments.filter((a) => a.requestedDate === selectedDate).sort(sortByDateTime) : []),
    [appointments, selectedDate]
  );

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return appointments.filter((a) => a.customerName.toLowerCase().includes(q)).sort(sortByDateTime);
  }, [appointments, query]);

  return (
    <div>
      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      <div className="mt-6">
        {tab === "today" && (
          <AppointmentModeration
            appointments={todaysAppointments}
            onSetStatus={setStatus}
            isPending={isPending}
            emptyMessage="No appointments today."
          />
        )}

        {tab === "calendar" && (
          <>
            <AppointmentCalendar appointments={appointments} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            {selectedDate && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <p className="mb-3 text-sm font-semibold">{formatDateLong(selectedDate)}</p>
                <AppointmentModeration
                  appointments={dayAppointments}
                  onSetStatus={setStatus}
                  isPending={isPending}
                  emptyMessage="No appointments this day."
                />
              </div>
            )}
          </>
        )}

        {tab === "search" && (
          <div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by patient/customer name"
                className="w-full rounded-lg border p-3 pl-9 text-sm"
              />
            </div>
            <div className="mt-4">
              {query.trim() ? (
                <AppointmentModeration
                  appointments={searchResults}
                  onSetStatus={setStatus}
                  isPending={isPending}
                  emptyMessage="No matching appointments."
                />
              ) : (
                <p className="text-sm text-gray-500">Type a name to see their past, current, and upcoming appointments.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
