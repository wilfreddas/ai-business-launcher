// src/features/scheduling/types.ts
//
// Deliberately simple: a requested date/time and a status a business owner
// can confirm or decline. No calendar engine, no time-slot generation, no
// double-booking prevention -- this is the "does the workflow make sense"
// demo, not a real booking system. Build that out for real once an actual
// paying client wants the scheduling add-on (see roadmap).

export type AppointmentStatus = "requested" | "confirmed" | "declined";

export interface AppointmentRequest {
  id: string;
  slug: string;
  customerId: string;
  customerName: string;
  /** Which client (business/staff) account this request is for -- lets a
   * site with multiple staff accounts each see only their own requests. */
  providerId: string;
  providerName: string;
  requestedDate: string;
  requestedTime: string;
  note?: string;
  status: AppointmentStatus;
  createdAt: string;
}
