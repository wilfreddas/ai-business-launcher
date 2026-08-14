"use server";

import { revalidatePath } from "next/cache";
import { getAccountSession } from "@/features/accounts/auth";
import { getAccountById } from "@/features/accounts/storage";
import { createAppointment, getAppointment, setAppointmentStatus } from "./storage";
import { isOwnerOrProvider } from "./access";
import type { AppointmentStatus } from "./types";

/** Customer requests an appointment -- must be logged in as that site's
 * customer, and must pick which provider (client account) it's for. */
export async function requestAppointmentAction(slug: string, formData: FormData): Promise<void> {
  const customer = await getAccountSession(slug, "customer");
  if (!customer) throw new Error("Not signed in.");

  const providerId = String(formData.get("providerId") || "");
  const requestedDate = String(formData.get("date") || "");
  const requestedTime = String(formData.get("time") || "");
  const note = String(formData.get("note") || "").trim() || undefined;

  if (!providerId || !requestedDate || !requestedTime) {
    throw new Error("Provider, date, and time are required.");
  }

  const provider = await getAccountById(slug, "client", providerId);
  if (!provider) throw new Error("Invalid provider.");

  await createAppointment(slug, {
    customerId: customer.id,
    customerName: customer.name,
    providerId: provider.id,
    providerName: provider.name,
    requestedDate,
    requestedTime,
    note,
  });

  revalidatePath(`/site/${slug}/account`);
  revalidatePath(`/site/${slug}/portal`);
}

/** Business/staff confirms or declines -- must be logged in as that site's
 * client, and (unless they're the owner account) can only act on their own
 * provider's appointments. */
export async function updateAppointmentStatusAction(
  slug: string,
  appointmentId: string,
  status: AppointmentStatus
): Promise<void> {
  const client = await getAccountSession(slug, "client");
  if (!client) throw new Error("Not signed in.");

  const appointment = await getAppointment(slug, appointmentId);
  if (!appointment || !(await isOwnerOrProvider(slug, client.id, appointment.providerId))) {
    throw new Error("Not authorized for this appointment.");
  }

  await setAppointmentStatus(slug, appointmentId, status);
  revalidatePath(`/site/${slug}/portal`);
}
