"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AppointmentRequest } from "../types";
import { buildMonthGrid, todayISO } from "../dateUtils";

interface Props {
  appointments: AppointmentRequest[];
  selectedDate: string | null;
  onSelectDate: (iso: string) => void;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Month-grid calendar -- shows a count badge on any day with requests, and
 * clicking a day is how you drill into that day's list (rendered by the
 * caller, not this component, so it stays reusable for both portals). */
export default function AppointmentCalendar({ appointments, selectedDate, onSelectDate }: Props) {
  const today = todayISO();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const grid = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const countByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of appointments) {
      map.set(a.requestedDate, (map.get(a.requestedDate) || 0) + 1);
    }
    return map;
  }, [appointments]);

  function prevMonth() {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-semibold">
          {new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
        <button
          type="button"
          onClick={nextMonth}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-400">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {grid.map(({ iso, date, inMonth }) => {
          const count = countByDate.get(iso) || 0;
          const isToday = iso === today;
          const isSelected = iso === selectedDate;

          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelectDate(iso)}
              className={`flex h-12 flex-col items-center justify-center gap-0.5 rounded-lg border text-sm transition-colors sm:h-14 ${
                inMonth ? "text-gray-900" : "text-gray-300"
              } ${
                isSelected
                  ? "border-black bg-gray-900 text-white"
                  : "border-transparent hover:border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  isToday && !isSelected ? "bg-black text-white" : ""
                }`}
              >
                {date.getDate()}
              </span>
              {count > 0 && (
                <span
                  className={`rounded-full px-1 text-[10px] font-semibold leading-tight ${
                    isSelected ? "text-white" : "text-gray-500"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
