"use client";

import { useMemo, useState } from "react";
import type { AppointmentRequest } from "../types";
import { todayISO } from "../dateUtils";
import TabBar from "./TabBar";
import AppointmentCalendar from "./AppointmentCalendar";
import AppointmentModeration from "./AppointmentModeration";
import AppointmentRequestForm from "./AppointmentRequestForm";

interface Props {
  slug: string;
  appointments: AppointmentRequest[];
}

type Tab = "upcoming" | "calendar" | "past";

const TABS: { id: Tab; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "calendar", label: "Calendar" },
  { id: "past", label: "Past" },
];

/** The patient/customer's view: their own requests only, read-only (only
 * the business can confirm/decline -- see PortalDashboard), plus the
 * request-a-new-appointment form. */
export default function CustomerDashboard({ slug, appointments }: Props) {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const sortByDateTime = (a: AppointmentRequest, b: AppointmentRequest) =>
    (a.requestedDate + a.requestedTime).localeCompare(b.requestedDate + b.requestedTime);

  const today = todayISO();
  const upcoming = useMemo(
    () => appointments.filter((a) => a.requestedDate >= today).sort(sortByDateTime),
    [appointments, today]
  );
  const past = useMemo(
    () => appointments.filter((a) => a.requestedDate < today).sort(sortByDateTime).reverse(),
    [appointments, today]
  );
  const dayAppointments = useMemo(
    () => (selectedDate ? appointments.filter((a) => a.requestedDate === selectedDate) : []),
    [appointments, selectedDate]
  );

  return (
    <div>
      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      <div className="mt-6 space-y-8">
        {tab === "upcoming" && (
          <>
            <AppointmentModeration appointments={upcoming} emptyMessage="No upcoming appointments." />
            <AppointmentRequestForm slug={slug} />
          </>
        )}

        {tab === "calendar" && (
          <>
            <AppointmentCalendar appointments={appointments} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            {selectedDate && (
              <div className="border-t border-gray-200 pt-6">
                <AppointmentModeration appointments={dayAppointments} emptyMessage="No appointments this day." />
              </div>
            )}
          </>
        )}

        {tab === "past" && <AppointmentModeration appointments={past} emptyMessage="No past appointments yet." />}
      </div>
    </div>
  );
}
