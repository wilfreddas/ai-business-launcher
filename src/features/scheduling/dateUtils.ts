// src/features/scheduling/dateUtils.ts
//
// Small date helpers shared by the calendar + list views in both portals.
// Dates are stored/compared as plain "YYYY-MM-DD" strings throughout
// scheduling (see AppointmentRequest.requestedDate) -- these just convert
// between that and real Date objects for display and grid layout.

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function todayISO(): string {
  return toISO(new Date());
}

export function formatDateLong(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** "past" | "today" | "upcoming" relative to right now -- used for the small
 * status tag next to a search result, since a patient's history spans all three. */
export function relativeDay(iso: string): "past" | "today" | "upcoming" {
  const today = todayISO();
  if (iso < today) return "past";
  if (iso === today) return "today";
  return "upcoming";
}

/** A 6-week (42-day) grid covering the given month, including the tail end
 * of the previous month and start of the next -- the standard calendar-UI
 * layout so every week row is full. `month` is 0-indexed. */
export function buildMonthGrid(year: number, month: number): { date: Date; iso: string; inMonth: boolean }[] {
  const firstOfMonth = new Date(year, month, 1);
  const gridStart = new Date(year, month, 1 - firstOfMonth.getDay());

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    return { date, iso: toISO(date), inMonth: date.getMonth() === month };
  });
}
