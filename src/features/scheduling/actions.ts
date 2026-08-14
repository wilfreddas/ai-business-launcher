"use server";

import { revalidatePath } from "next/cache";
import { getAccountSession } from "@/features/accounts/auth";
import { createAppointment, setAppointmentStatus } from "./storage";
import type { AppointmentStatus } from "./types";

/** Customer requests an appointment -- must be logged in as that site's customer. */
export async function requestAppointmentAction(slug: string, formData: FormData): Promise<void> {
  const customer = await getAccountSession(slug, "customer");
  if (!customer) throw new Error("Not signed in.");

  const requestedDate = String(formData.get("date") || "");
  const requestedTime = String(formData.get("time") || "");
  const note = String(formData.get("note") || "").trim() || undefined;

  if (!requestedDate || !requestedTime) {
    throw new Error("Date and time are required.");
  }

  await createAppointment(slug, {
    customerId: customer.id,
    customerName: customer.name,
    requestedDate,
    requestedTime,
    note,
  });

  revalidatePath(`/site/${slug}/account`);
}

/** Business owner confirms/declines -- must be logged in as that site's client. */
export async function updateAppointmentStatusAction(
  slug: string,
  appointmentId: string,
  status: AppointmentStatus
): Promise<void> {
  const client = await getAccountSession(slug, "client");
  if (!client) throw new Error("Not signed in.");

  await setAppointmentStatus(slug, appointmentId, status);
  revalidatePath(`/site/${slug}/portal`);
}
