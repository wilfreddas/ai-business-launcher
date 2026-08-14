import "server-only";
import { randomUUID } from "crypto";
import { getRedis } from "@/lib/redis";
import type { AppointmentRequest, AppointmentStatus } from "./types";

const memoryAppointments = new Map<string, AppointmentRequest[]>();

function key(slug: string): string {
  return `appointments:${slug}`;
}

async function readAll(slug: string): Promise<AppointmentRequest[]> {
  const redis = getRedis();
  if (redis) {
    return (await redis.get<AppointmentRequest[]>(key(slug))) || [];
  }
  return memoryAppointments.get(slug) || [];
}

async function writeAll(slug: string, appointments: AppointmentRequest[]): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.set(key(slug), appointments);
  } else {
    memoryAppointments.set(slug, appointments);
  }
}

/** Every request for a site, across all providers -- what the business
 * owner (the first client account created) sees. */
export async function listAppointments(slug: string): Promise<AppointmentRequest[]> {
  return readAll(slug);
}

/** Just one customer's own requests -- what the customer sees. */
export async function listAppointmentsForCustomer(
  slug: string,
  customerId: string
): Promise<AppointmentRequest[]> {
  const all = await readAll(slug);
  return all.filter((a) => a.customerId === customerId);
}

/** Just one provider's (staff account's) own requests -- what a non-owner
 * client account sees. */
export async function listAppointmentsForProvider(
  slug: string,
  providerId: string
): Promise<AppointmentRequest[]> {
  const all = await readAll(slug);
  return all.filter((a) => a.providerId === providerId);
}

export async function getAppointment(slug: string, id: string): Promise<AppointmentRequest | null> {
  const all = await readAll(slug);
  return all.find((a) => a.id === id) ?? null;
}

export async function createAppointment(
  slug: string,
  input: {
    customerId: string;
    customerName: string;
    providerId: string;
    providerName: string;
    requestedDate: string;
    requestedTime: string;
    note?: string;
  }
): Promise<AppointmentRequest> {
  const appointment: AppointmentRequest = {
    id: randomUUID(),
    slug,
    customerId: input.customerId,
    customerName: input.customerName,
    providerId: input.providerId,
    providerName: input.providerName,
    requestedDate: input.requestedDate,
    requestedTime: input.requestedTime,
    note: input.note,
    status: "requested",
    createdAt: new Date().toISOString(),
  };

  const existing = await readAll(slug);
  await writeAll(slug, [...existing, appointment]);
  return appointment;
}

export async function setAppointmentStatus(
  slug: string,
  appointmentId: string,
  status: AppointmentStatus
): Promise<void> {
  const all = await readAll(slug);
  await writeAll(
    slug,
    all.map((a) => (a.id === appointmentId ? { ...a, status } : a))
  );
}
