"use client";

import { useMemo, useState, useTransition } from "react";
import { Search } from "lucide-react";
import type { AppointmentRequest, AppointmentStatus } from "../types";
import { updateAppointmentStatusAction } from "../actions";
import { todayISO, formatDateLong } from "../dateUtils";
import TabBar from "./TabBar";
import AppointmentCalendar from "./AppointmentCalendar";
import AppointmentModeration from "./AppointmentModeration";
import AppointmentRequestForm from "./AppointmentRequestForm";

const sortByDateTime = (a: AppointmentRequest, b: AppointmentRequest) =>
  (a.requestedDate + a.requestedTime).localeCompare(b.requestedDate + b.requestedTime);

type BusinessTab = "today" | "calendar" | "search";
type CustomerTab = "upcoming" | "calendar" | "past";

const BUSINESS_TABS: { id: BusinessTab; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "calendar", label: "Calendar" },
  { id: "search", label: "Search" },
];

const CUSTOMER_TABS: { id: CustomerTab; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "calendar", label: "Calendar" },
  { id: "past", label: "Past" },
];

interface Props {
  slug: string;
  appointments: AppointmentRequest[];
  /** "business" can confirm/decline and search by name; "customer" gets a
   * read-only upcoming/past view plus the request form. One component, one
   * calendar-tab implementation, shared by both scheduling portals. */
  role: "business" | "customer";
  /** Only used by the customer role, for the request form's provider
   * picker. A business account already knows who it is. */
  providers?: { id: string; name: string }[];
}

export default function AppointmentDashboard({ slug, appointments: initial, role, providers = [] }: Props) {
  const [appointments, setAppointments] = useState(initial);
  const [tab, setTab] = useState<BusinessTab | CustomerTab>(role === "business" ? "today" : "upcoming");
  const [query, setQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // A single-owner site (the common case) has exactly one provider on both
  // sides, so the "with {provider}" label would just be noise -- only show
  // it once there's actually more than one to distinguish between. On the
  // business side that's read straight from the loaded appointments (an
  // owner viewing multiple staff' worth of requests); on the customer side
  // it's read from the provider list passed in for the request form.
  const distinctProviderCount = useMemo(() => new Set(appointments.map((a) => a.providerId)).size, [appointments]);
  const showProvider = role === "business" ? distinctProviderCount > 1 : providers.length > 1;

  const today = todayISO();

  const onSetStatus =
    role === "business"
      ? (id: string, status: AppointmentStatus) => {
          startTransition(async () => {
            await updateAppointmentStatusAction(slug, id, status);
            setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
          });
        }
      : undefined;

  const dayAppointments = useMemo(
    () => (selectedDate ? appointments.filter((a) => a.requestedDate === selectedDate).sort(sortByDateTime) : []),
    [appointments, selectedDate]
  );

  const todaysAppointments = useMemo(
    () => appointments.filter((a) => a.requestedDate === today).sort(sortByDateTime),
    [appointments, today]
  );
  const upcoming = useMemo(
    () => appointments.filter((a) => a.requestedDate >= today).sort(sortByDateTime),
    [appointments, today]
  );
  const past = useMemo(
    () => appointments.filter((a) => a.requestedDate < today).sort(sortByDateTime).reverse(),
    [appointments, today]
  );
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return appointments.filter((a) => a.customerName.toLowerCase().includes(q)).sort(sortByDateTime);
  }, [appointments, query]);

  const tabs = role === "business" ? BUSINESS_TABS : CUSTOMER_TABS;

  const pendingCount = useMemo(() => appointments.filter((a) => a.status === "requested").length, [appointments]);
  const stats: { label: string; value: number }[] =
    role === "business"
      ? [
          { label: "Today", value: todaysAppointments.length },
          { label: "Pending", value: pendingCount },
          { label: "Upcoming", value: upcoming.length },
        ]
      : [
          { label: "Upcoming", value: upcoming.length },
          { label: "Past", value: past.length },
        ];

  return (
    <div>
      <div className="mb-6 flex gap-2">
        {stats.map((s) => (
          <div key={s.label} className="flex-1 rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="mt-0.5 text-xs font-medium text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <TabBar tabs={tabs} active={tab} onChange={setTab} />

      <div className="mt-6 space-y-8">
        {tab === "today" && (
          <AppointmentModeration
            appointments={todaysAppointments}
            onSetStatus={onSetStatus}
            isPending={isPending}
            emptyMessage="No appointments today."
            showProvider={showProvider}
          />
        )}

        {tab === "upcoming" && (
          <>
            <AppointmentModeration appointments={upcoming} emptyMessage="No upcoming appointments." showProvider={showProvider} />
            <AppointmentRequestForm slug={slug} providers={providers} />
          </>
        )}

        {tab === "past" && (
          <AppointmentModeration appointments={past} emptyMessage="No past appointments yet." showProvider={showProvider} />
        )}

        {tab === "calendar" && (
          <>
            <AppointmentCalendar appointments={appointments} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            {selectedDate && (
              <div className="border-t border-gray-200 pt-6">
                {role === "business" && <p className="mb-3 text-sm font-semibold">{formatDateLong(selectedDate)}</p>}
                <AppointmentModeration
                  appointments={dayAppointments}
                  onSetStatus={onSetStatus}
                  isPending={isPending}
                  emptyMessage="No appointments this day."
                  showProvider={showProvider}
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
                className="w-full rounded-lg border border-gray-200 p-3 pl-9 text-sm outline-none transition-colors focus:border-gray-900"
              />
            </div>
            <div className="mt-4">
              {query.trim() ? (
                <AppointmentModeration
                  appointments={searchResults}
                  onSetStatus={onSetStatus}
                  isPending={isPending}
                  emptyMessage="No matching appointments."
                  showProvider={showProvider}
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
